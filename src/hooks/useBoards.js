import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

export function useBoards() {
  const { user } = useAuth()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBoards = useCallback(async () => {
    if (!user) {
      setBoards([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    // RLS ya filtra esto a "mis tableros o donde soy miembro"
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('No se pudieron cargar los tableros. Intenta de nuevo.')
      setBoards([])
    } else {
      setBoards(data)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  async function createBoard(name) {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { error: 'El nombre del tablero no puede estar vacío.' }
    }

    const { data: newBoardId, error } = await supabase.rpc('create_board', {
      board_name: trimmedName,
    })

    if (error) {
      return { error: 'No se pudo crear el tablero. Intenta de nuevo.' }
    }

    await fetchBoards()
    return { boardId: newBoardId, error: null }
  }

  async function deleteBoard(boardId) {
    const { error } = await supabase.from('boards').delete().eq('id', boardId)

    if (error) {
      return { error: 'No se pudo eliminar el tablero. Intenta de nuevo.' }
    }

    setBoards((prev) => prev.filter((b) => b.id !== boardId))
    return { error: null }
  }

  return { boards, loading, error, createBoard, deleteBoard, refetch: fetchBoards }
}