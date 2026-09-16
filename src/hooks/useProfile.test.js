import { describe, it, expect } from 'vitest'
import { USERNAME_PATTERN } from './useProfile'

describe('USERNAME_PATTERN', () => {
  it('accepts a valid username with letters and numbers', () => {
    expect(USERNAME_PATTERN.test('angel123')).toBe(true)
  })

  it('accepts a valid username with underscores', () => {
    expect(USERNAME_PATTERN.test('angel_burbano')).toBe(true)
  })

  it('rejects a username shorter than 3 characters', () => {
    expect(USERNAME_PATTERN.test('ab')).toBe(false)
  })

  it('rejects a username longer than 20 characters', () => {
    expect(USERNAME_PATTERN.test('a'.repeat(21))).toBe(false)
  })

  it('rejects a username with spaces', () => {
    expect(USERNAME_PATTERN.test('angel burbano')).toBe(false)
  })

  it('rejects a username with special characters', () => {
    expect(USERNAME_PATTERN.test('angel@123')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(USERNAME_PATTERN.test('')).toBe(false)
  })
})
