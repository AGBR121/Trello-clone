import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth'

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (!error) {
      setProfile(data)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  async function updateUsername(newUsername) {
    const trimmed = newUsername.trim()

    if (!USERNAME_PATTERN.test(trimmed)) {
      return {
        error:
          'El nombre de usuario debe tener 3-20 caracteres: solo letras, números y guion bajo.',
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({ username: trimmed })
      .eq('id', user.id)

    if (error) {
      // Código 23505 = violación de constraint único en Postgres.
      if (error.code === '23505') {
        return { error: 'Ese nombre de usuario ya está en uso.' }
      }
      return { error: 'No se pudo actualizar el nombre de usuario.' }
    }

    await fetchProfile()
    return { error: null }
  }

  return { profile, loading, updateUsername, refetch: fetchProfile }
}