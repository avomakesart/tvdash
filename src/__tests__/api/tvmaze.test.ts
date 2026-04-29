import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { makeShow } from '../fixtures'

describe('tvmaze API', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function mockFetch(data: unknown, status = 200) {
    vi.mocked(fetch).mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
    } as Response)
  }

  describe('fetchShow', () => {
    it('fetches a show by id', async () => {
      const show = makeShow({ id: 42, name: 'Succession' })
      mockFetch(show)

      const { fetchShow } = await import('@/api/tvmaze')
      const result = await fetchShow(42)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/shows/42'),
        expect.objectContaining({ signal: undefined }),
      )
      expect(result.name).toBe('Succession')
    })

    it('throws on a non-ok response', async () => {
      mockFetch({}, 404)

      const { fetchShow } = await import('@/api/tvmaze')
      await expect(fetchShow(999)).rejects.toThrow('TVMaze API error 404')
    })
  })

  describe('searchShows', () => {
    it('URL-encodes the query', async () => {
      mockFetch([])

      const { searchShows } = await import('@/api/tvmaze')
      await searchShows('breaking bad')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=breaking%20bad'),
        expect.anything(),
      )
    })

    it('passes the AbortSignal to fetch', async () => {
      mockFetch([])
      const controller = new AbortController()

      const { searchShows } = await import('@/api/tvmaze')
      await searchShows('test', controller.signal)

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: controller.signal }),
      )
    })

    it('returns mapped search results', async () => {
      const show = makeShow({ id: 1, name: 'Breaking Bad' })
      mockFetch([{ score: 0.9, show }])

      const { searchShows } = await import('@/api/tvmaze')
      const results = await searchShows('breaking')

      expect(results).toHaveLength(1)
      expect(results[0].show.name).toBe('Breaking Bad')
      expect(results[0].score).toBe(0.9)
    })
  })

  describe('fetchAllShows', () => {
    it('fetches the requested number of pages in parallel', async () => {
      mockFetch([makeShow()])

      const { fetchAllShows } = await import('@/api/tvmaze')
      await fetchAllShows(2)

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=0'), expect.anything())
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.anything())
    })

    it('returns a flat list of all shows across pages', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([makeShow({ id: 1 }), makeShow({ id: 2 })]) } as Response)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([makeShow({ id: 3 })]) } as Response)

      const { fetchAllShows } = await import('@/api/tvmaze')
      const shows = await fetchAllShows(2)

      expect(shows).toHaveLength(3)
    })

    it('silently drops a failed page and returns the rest', async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([makeShow({ id: 1 })]) } as Response)
        .mockRejectedValueOnce(new Error('Network error'))

      const { fetchAllShows } = await import('@/api/tvmaze')
      const shows = await fetchAllShows(2)

      expect(shows).toHaveLength(1)
    })
  })
})
