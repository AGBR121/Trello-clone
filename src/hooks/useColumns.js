import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useColumns(boardId) {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchColumns = useCallback(async () => {
    if (!boardId) return

    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('columns')
      .select('*, cards(*)')
      .eq('board_id', boardId)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'cards' })

    if (error) {
      setError('No se pudieron cargar las columnas.')
      setColumns([])
    } else {
      setColumns(data)
    }

    setLoading(false)
  }, [boardId])

  useEffect(() => {
    fetchColumns()
  }, [fetchColumns])

  async function createColumn(name) {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { error: 'El nombre de la columna no puede estar vacío.' }
    }

    const nextPosition = columns.length

    const { error } = await supabase.from('columns').insert({
      board_id: boardId,
      name: trimmedName,
      position: nextPosition,
    })

    if (error) {
      return { error: 'No se pudo crear la columna.' }
    }

    await fetchColumns()
    return { error: null }
  }

  async function deleteColumn(columnId) {
    const { error } = await supabase.from('columns').delete().eq('id', columnId)

    if (error) {
      return { error: 'No se pudo eliminar la columna.' }
    }

    setColumns((prev) => prev.filter((c) => c.id !== columnId))
    return { error: null }
  }

  async function createCard(columnId, { title, description, due_date }) {
    const column = columns.find((c) => c.id === columnId)
    const nextPosition = column ? column.cards.length : 0

    const { error } = await supabase.from('cards').insert({
      column_id: columnId,
      title: title.trim(),
      description: description?.trim() || null,
      due_date: due_date || null,
      position: nextPosition,
    })

    if (error) {
      return { error: 'No se pudo crear la tarjeta.' }
    }

    await fetchColumns()
    return { error: null }
  }

  async function updateCard(cardId, updates) {
    const { error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', cardId)

    if (error) {
      return { error: 'No se pudo actualizar la tarjeta.' }
    }

    await fetchColumns()
    return { error: null }
  }

  async function deleteCard(cardId) {
    const { error } = await supabase.from('cards').delete().eq('id', cardId)

    if (error) {
      return { error: 'No se pudo eliminar la tarjeta.' }
    }

    await fetchColumns()
    return { error: null }
  }

  /**
   * Se llama al soltar una tarjeta (onDragEnd de dnd-kit).
   * Recalcula las posiciones de la columna origen y, si es distinta,
   * también de la columna destino, y persiste ambas en Supabase.
   *
   * Actualiza el estado local de inmediato (optimistic UI) y revierte
   * si la persistencia falla.
   */
  async function reorderCards({ cardId, sourceColumnId, destColumnId, newIndex }) {
    const previousColumns = columns // snapshot para poder revertir

    let movedCard = null
    const nextColumns = columns.map((col) => ({ ...col, cards: [...col.cards] }))

    const sourceCol = nextColumns.find((c) => c.id === sourceColumnId)
    const destCol = nextColumns.find((c) => c.id === destColumnId)
    if (!sourceCol || !destCol) return

    const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    ;[movedCard] = sourceCol.cards.splice(cardIndex, 1)
    destCol.cards.splice(newIndex, 0, movedCard)

    // Recalcular position como enteros consecutivos en ambas columnas.
    sourceCol.cards = sourceCol.cards.map((c, i) => ({ ...c, position: i }))
    destCol.cards = destCol.cards.map((c, i) => ({
      ...c,
      position: i,
      column_id: destCol.id,
    }))

    // Optimistic UI: aplicar el cambio en pantalla de inmediato.
    setColumns(nextColumns)

    // Persistir: upsert de todas las tarjetas afectadas (origen + destino,
    // o solo una lista si sourceColumnId === destColumnId).
    const affectedCards =
      sourceColumnId === destColumnId
        ? destCol.cards
        : [...sourceCol.cards, ...destCol.cards]

    const { error } = await supabase.from('cards').upsert(
      affectedCards.map((c) => ({
        id: c.id,
        column_id: c.column_id,
        position: c.position,
        // Campos obligatorios que upsert necesita para no perderlos:
        title: c.title,
        description: c.description,
        due_date: c.due_date,
        assigned_to: c.assigned_to,
      }))
    )

    if (error) {
      // Revertir si falla la persistencia.
      setColumns(previousColumns)
      setError('No se pudo guardar el nuevo orden. Se revirtió el cambio.')
    }
  }

  return {
    columns,
    loading,
    error,
    createColumn,
    deleteColumn,
    createCard,
    updateCard,
    deleteCard,
    reorderCards,
    refetch: fetchColumns,
  }
}