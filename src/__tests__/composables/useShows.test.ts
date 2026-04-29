import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeShow } from '../fixtures'

vi.mock('@/api/tvmaze', () => ({
  fetchAllShows: vi.fn(),
  fetchShow: vi.fn(),
  searchShows: vi.fn(),
}))

import { fetchShow } from '@/api/tvmaze'
import { useShow } from '@/composables/useShows'

const mockFetchShow = vi.mocked(fetchShow)

describe('useShow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with null show, loading false, no error', () => {
    const { show, loading, error } = useShow(1)
    expect(show.value).toBeNull()
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('sets loading to true during fetch and false after', async () => {
    let resolve!: (value: ReturnType<typeof makeShow>) => void
    mockFetchShow.mockImplementation(() => new Promise((r) => { resolve = r }))

    const { loading, loadShow } = useShow(1)
    const promise = loadShow()

    expect(loading.value).toBe(true)
    resolve(makeShow({ id: 1 }))
    await promise
    expect(loading.value).toBe(false)
  })

  it('populates show on success and passes the correct id', async () => {
    mockFetchShow.mockResolvedValue(makeShow({ id: 42, name: 'Succession' }))

    const { show, loadShow } = useShow(42)
    await loadShow()

    expect(show.value?.name).toBe('Succession')
    expect(mockFetchShow).toHaveBeenCalledWith(42)
  })

  it('sets error message on failure and show remains null', async () => {
    mockFetchShow.mockRejectedValue(new Error('Not found'))

    const { show, error, loadShow } = useShow(99)
    await loadShow()

    expect(show.value).toBeNull()
    expect(error.value).toBe('Not found')
  })

  it('creates independent state per call', async () => {
    mockFetchShow
      .mockResolvedValueOnce(makeShow({ id: 1, name: 'Show A' }))
      .mockResolvedValueOnce(makeShow({ id: 2, name: 'Show B' }))

    const a = useShow(1)
    const b = useShow(2)
    await Promise.all([a.loadShow(), b.loadShow()])

    expect(a.show.value?.name).toBe('Show A')
    expect(b.show.value?.name).toBe('Show B')
  })
})
