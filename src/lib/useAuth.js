import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Errores más comunes de Supabase a español.
function translateAuthError(message) {
  if (!message) return 'Ocurrió un error, intenta de nuevo.'

  if (message.includes('Invalid login credentials')) {
    return 'Email o contraseña incorrectos.'
  }
  if (message.includes('already registered')) {
    return 'Ya existe una cuenta con este email.'
  }
  if (message.includes('Password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.'
  }
  if (message.includes('valid email')) {
    return 'Ingresa un email válido.'
  }

  return 'Ocurrió un error, intenta de nuevo.'
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Revisa si ya hay una sesión activa.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Se suscribe a cambios de sesión.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      return { data: null, error: translateAuthError(error.message) }
    }
    return { data, error: null }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      return { data: null, error: translateAuthError(error.message) }
    }
    return { data, error: null }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error: translateAuthError(error.message) }
    }
    return { error: null }
  }

  return { user, loading, signUp, signIn, signOut }
}