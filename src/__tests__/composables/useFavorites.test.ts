import { describe, it, expect, beforeEach, vi } from 'vitest'

const STORAGE_KEY = 'tvdash-favorites'

describe('useFavorites', () => {
  beforeEach(async () => {
    localStorage.clear()
    vi.resetModules()
  })

  async function getFavorites() {
    const { useFavorites } = await import('@/composables/useFavorites')
    return useFavorites()
  }

  it('starts with no favorites when localStorage is empty', async () => {
    const { favoriteIds } = await getFavorites()
    expect(favoriteIds.value).toEqual([])
  })

  it('reads favorites from localStorage on init', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]))
    const { isFavorite } = await getFavorites()
    expect(isFavorite(1)).toBe(true)
    expect(isFavorite(2)).toBe(true)
    expect(isFavorite(3)).toBe(true)
    expect(isFavorite(99)).toBe(false)
  })

  it('adds a show when toggled once', async () => {
    const { toggle, isFavorite } = await getFavorites()
    toggle(42)
    expect(isFavorite(42)).toBe(true)
  })

  it('removes a show when toggled twice', async () => {
    const { toggle, isFavorite } = await getFavorites()
    toggle(42)
    toggle(42)
    expect(isFavorite(42)).toBe(false)
  })

  it('persists favorites to localStorage on toggle', async () => {
    const { toggle } = await getFavorites()
    toggle(7)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toContain(7)
  })

  it('removes the id from localStorage on second toggle', async () => {
    const { toggle } = await getFavorites()
    toggle(7)
    toggle(7)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).not.toContain(7)
  })

  it('keeps other favorites intact when removing one', async () => {
    const { toggle, favoriteIds } = await getFavorites()
    toggle(1)
    toggle(2)
    toggle(3)
    toggle(2)
    expect(favoriteIds.value).toContain(1)
    expect(favoriteIds.value).not.toContain(2)
    expect(favoriteIds.value).toContain(3)
  })
})
