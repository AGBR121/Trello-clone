import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

// Traduce los códigos de resultado de invite_member_by_email a mensajes.
const INVITE_ERROR_MESSAGES = {
  not_owner: 'Solo el dueño puede invitar.',
  user_not_found: 'No existe una cuenta con ese email.',
  already_member: 'Esta persona ya es miembro del tablero.',
}

export function useBoardMembers(boardId) {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMembers = useCallback(async () => {
    if (!boardId) return

    setLoading(true)
    setError(null)

    const { data, error } = await supabase.rpc('get_board_members', {
      _board_id: boardId,
    })

    if (error) {
      setError('No se pudo cargar la lista de miembros.')
      setMembers([])
    } else {
      setMembers(data)
    }

    setLoading(false)
  }, [boardId])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  async function inviteMember(email) {
    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      return { error: 'Escribe un email.' }
    }

    const { data: resultCode, error } = await supabase.rpc(
      'invite_member_by_email',
      { _board_id: boardId, _email: trimmedEmail }
    )

    if (error) {
      return { error: 'Ocurrió un error, intenta de nuevo.' }
    }

    if (resultCode !== 'ok') {
      return { error: INVITE_ERROR_MESSAGES[resultCode] || 'No se pudo invitar.' }
    }

    await fetchMembers()
    return { error: null }
  }

  async function removeMember(userId) {
    const { error } = await supabase
      .from('board_members')
      .delete()
      .eq('board_id', boardId)
      .eq('user_id', userId)

    if (error) {
      return { error: 'No se pudo remover al miembro.' }
    }

    setMembers((prev) => prev.filter((m) => m.user_id !== userId))
    return { error: null }
  }

  async function leaveBoard() {
    if (!user) return { error: 'No hay sesión activa.' }
    return removeMember(user.id)
  }

  return {
    members,
    loading,
    error,
    inviteMember,
    removeMember,
    leaveBoard,
    refetch: fetchMembers,
  }
}