import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { makeShow } from '../fixtures'

vi.mock('@/api/tvmaze', () => ({
  fetchAllShows: vi.fn(),
  fetchShow: vi.fn(),
  searchShows: vi.fn(),
}))

import { searchShows } from '@/api/tvmaze'
import { useSearch } from '@/composables/useSearch'

const mockSearch = vi.mocked(searchShows)

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    mockSearch.mockResolvedValue([{ score: 1, show: makeShow({ id: 1, name: 'Breaking Bad' }) }])
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('starts with empty results', () => {
    const { results, loading, error } = useSearch(ref(''))
    expect(results.value).toEqual([])
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('does not call the API for an empty query', async () => {
    const query = ref('hello')
    useSearch(query)

    query.value = ''
    await nextTick()
    vi.runAllTimersAsync()

    expect(mockSearch).not.toHaveBeenCalled()
  })

  it('clears results immediately when query becomes empty', async () => {
    const query = ref('breaking')
    const { results } = useSearch(query)

    await nextTick()
        vi.runAllTimersAsync()
    await flushPromises()
    expect(results.value).toHaveLength(1)

    query.value = ''
    await nextTick()
    expect(results.value).toEqual([])
  })

  it('debounces — only fires once after rapid typing', async () => {
    const query = ref('')
    useSearch(query)

    query.value = 'b'
    await nextTick()
    query.value = 'br'
    await nextTick()
    query.value = 'bre'
    await nextTick()

        vi.runAllTimersAsync()
    await flushPromises()

    expect(mockSearch).toHaveBeenCalledTimes(1)
    expect(mockSearch).toHaveBeenCalledWith('bre', expect.any(AbortSignal))
  })

  it('maps SearchResult to Show array', async () => {
    const query = ref('breaking')
    const { results } = useSearch(query)

    await nextTick()
        vi.runAllTimersAsync()
    await flushPromises()

    expect(results.value).toHaveLength(1)
    expect(results.value[0].name).toBe('Breaking Bad')
  })

  it('sets error and clears results on API failure', async () => {
    mockSearch.mockRejectedValueOnce(new Error('Network error'))

    const query = ref('failing')
    const { results, error } = useSearch(query)

    await nextTick()
        vi.runAllTimersAsync()
    await flushPromises()

    expect(results.value).toEqual([])
    expect(error.value).toBe('Network error')
  })
})
