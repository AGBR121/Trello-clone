import { describe, it, expect } from 'vitest'
import { formatDueDate } from './dateutils'

describe('formatDueDate', () => {
  it('returns null when there is no date', () => {
    expect(formatDueDate(null)).toBe(null)
    expect(formatDueDate(undefined)).toBe(null)
    expect(formatDueDate('')).toBe(null)
  })

  it('formats an ISO date string in Spanish, day + short month', () => {
    const result = formatDueDate('2026-03-15')
    expect(result).toMatch(/14|15/)
    expect(result.toLowerCase()).toMatch(/mar/)
  })

  it('handles a full ISO timestamp, not just a date', () => {
    const result = formatDueDate('2026-12-25T10:00:00.000Z')
    expect(result).toMatch(/25|24/) 
    expect(result.toLowerCase()).toMatch(/dic/)
  })
})