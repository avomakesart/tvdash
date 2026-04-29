import { describe, it, expect, beforeEach, vi } from 'vitest'
import { makeShow } from '../fixtures'

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
    const stored = [makeShow({ id: 1 }), makeShow({ id: 2 }), makeShow({ id: 3 })]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    const { isFavorite } = await getFavorites()
    expect(isFavorite(1)).toBe(true)
    expect(isFavorite(2)).toBe(true)
    expect(isFavorite(3)).toBe(true)
    expect(isFavorite(99)).toBe(false)
  })

  it('ignores old localStorage format that stored plain IDs', async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]))
    const { favoriteIds } = await getFavorites()
    expect(favoriteIds.value).toEqual([])
  })

  it('adds a show when toggled once', async () => {
    const { toggle, isFavorite } = await getFavorites()
    toggle(makeShow({ id: 42 }))
    expect(isFavorite(42)).toBe(true)
  })

  it('removes a show when toggled twice', async () => {
    const { toggle, isFavorite } = await getFavorites()
    toggle(makeShow({ id: 42 }))
    toggle(makeShow({ id: 42 }))
    expect(isFavorite(42)).toBe(false)
  })

  it('persists the full show object to localStorage on toggle', async () => {
    const show = makeShow({ id: 7, name: 'Succession' })
    const { toggle } = await getFavorites()
    toggle(show)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored[0].id).toBe(7)
    expect(stored[0].name).toBe('Succession')
  })

  it('removes the show from localStorage on second toggle', async () => {
    const show = makeShow({ id: 7 })
    const { toggle } = await getFavorites()
    toggle(show)
    toggle(show)
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(0)
  })

  it('keeps other favorites intact when removing one', async () => {
    const { toggle, favoriteIds } = await getFavorites()
    toggle(makeShow({ id: 1 }))
    toggle(makeShow({ id: 2 }))
    toggle(makeShow({ id: 3 }))
    toggle(makeShow({ id: 2 }))
    expect(favoriteIds.value).toContain(1)
    expect(favoriteIds.value).not.toContain(2)
    expect(favoriteIds.value).toContain(3)
  })
})
