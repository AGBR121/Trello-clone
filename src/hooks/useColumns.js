import { useState, useEffect, useCallback, useRef } from 'react'
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

  const debounceRef = useRef(null)

  useEffect(() => {
    if (!boardId) return

    function scheduleRefetch() {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetchColumns()
      }, 150)
    }

    const channel = supabase
      .channel(`board-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        scheduleRefetch
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: `board_id=eq.${boardId}`,
        },
        scheduleRefetch
      )
      .subscribe()

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      supabase.removeChannel(channel)
    }
  }, [boardId, fetchColumns])
  // --------------------------------------------------------------------

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
      board_id: boardId,
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

  async function reorderCards({ cardId, sourceColumnId, destColumnId, newIndex }) {
    const previousColumns = columns

    const nextColumns = columns.map((col) => ({ ...col, cards: [...col.cards] }))

    const sourceCol = nextColumns.find((c) => c.id === sourceColumnId)
    const destCol = nextColumns.find((c) => c.id === destColumnId)
    if (!sourceCol || !destCol) return

    const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId)
    if (cardIndex === -1) return

    const [movedCard] = sourceCol.cards.splice(cardIndex, 1)
    destCol.cards.splice(newIndex, 0, movedCard)

    sourceCol.cards = sourceCol.cards.map((c, i) => ({ ...c, position: i }))
    destCol.cards = destCol.cards.map((c, i) => ({
      ...c,
      position: i,
      column_id: destCol.id,
    }))

    setColumns(nextColumns)

    const affectedCards =
      sourceColumnId === destColumnId
        ? destCol.cards
        : [...sourceCol.cards, ...destCol.cards]

    const { error } = await supabase.from('cards').upsert(
      affectedCards.map((c) => ({
        id: c.id,
        column_id: c.column_id,
        board_id: boardId,
        position: c.position,
        title: c.title,
        description: c.description,
        due_date: c.due_date,
        assigned_to: c.assigned_to,
        color: c.color,
      }))
    )

    if (error) {
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