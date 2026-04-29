import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeShow } from '../fixtures'

const mockFetchAllShows = vi.fn()

describe('useShows module-level cache', () => {
  beforeEach(() => {
    vi.resetModules()
    // vi.doMock is NOT hoisted — it runs here, before the dynamic import below
    vi.doMock('@/api/tvmaze', () => ({
      fetchAllShows: mockFetchAllShows,
      fetchShow: vi.fn(),
      searchShows: vi.fn(),
    }))
    mockFetchAllShows.mockReset()
  })

  async function freshUseShows() {
    const { useShows } = await import('@/composables/useShows')
    return useShows()
  }

  it('starts with empty shows and loading=false', async () => {
    const { shows, loading, error } = await freshUseShows()
    expect(shows.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetches and populates shows on first loadShows call', async () => {
    mockFetchAllShows.mockResolvedValue([makeShow({ id: 1 }), makeShow({ id: 2 })])
    const { shows, loadShows } = await freshUseShows()
    await loadShows()

    expect(shows.value).toHaveLength(2)
    expect(mockFetchAllShows).toHaveBeenCalledTimes(1)
  })

  it('does not call the API a second time (cache hit)', async () => {
    mockFetchAllShows.mockResolvedValue([makeShow()])
    const { loadShows } = await freshUseShows()
    await loadShows()
    await loadShows()

    expect(mockFetchAllShows).toHaveBeenCalledTimes(1)
  })

  it('sets error and clears loading when fetch fails', async () => {
    mockFetchAllShows.mockRejectedValue(new Error('Offline'))
    const { loading, error, loadShows } = await freshUseShows()
    await loadShows()

    expect(loading.value).toBe(false)
    expect(error.value).toBe('Offline')
  })
})
