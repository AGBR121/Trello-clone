import { describe, it, expect } from 'vitest'
import { translateAuthError } from './useAuth'

describe('translateAuthError', () => {
  it('translates invalid credentials error', () => {
    expect(translateAuthError('Invalid login credentials')).toBe(
      'Email o contraseña incorrectos.'
    )
  })

  it('translates already registered error', () => {
    expect(translateAuthError('User already registered')).toBe(
      'Ya existe una cuenta con este email.'
    )
  })

  it('translates weak password error', () => {
    expect(
      translateAuthError('Password should be at least 6 characters')
    ).toBe('La contraseña debe tener al menos 6 caracteres.')
  })

  it('translates invalid email error', () => {
    expect(translateAuthError('Unable to validate email address: valid email required')).toBe(
      'Ingresa un email válido.'
    )
  })

  it('falls back to a generic message for unknown errors', () => {
    expect(translateAuthError('Some completely unexpected error')).toBe(
      'Ocurrió un error, intenta de nuevo.'
    )
  })

  it('falls back to a generic message when there is no message at all', () => {
    expect(translateAuthError(null)).toBe('Ocurrió un error, intenta de nuevo.')
    expect(translateAuthError(undefined)).toBe('Ocurrió un error, intenta de nuevo.')
    expect(translateAuthError('')).toBe('Ocurrió un error, intenta de nuevo.')
  })
})
