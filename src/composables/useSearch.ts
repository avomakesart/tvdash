import { ref, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { searchShows } from '@/api/tvmaze'
import type { Show } from '@/types'

const queryCache = new Map<string, Show[]>()

export function useSearch(query: Ref<string>) {
  const results = ref<Show[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let abortController: AbortController | null = null

  watch(
    query,
    (q) => {
      if (debounceTimer) clearTimeout(debounceTimer)

      if (!q.trim()) {
        results.value = []
        loading.value = false
        error.value = null
        return
      }

      loading.value = true
      debounceTimer = setTimeout(async () => {
        const trimmed = q.trim()

        if (queryCache.has(trimmed)) {
          results.value = queryCache.get(trimmed)!
          loading.value = false
          return
        }

        abortController?.abort()
        abortController = new AbortController()

        error.value = null
        try {
          const raw = await searchShows(trimmed, abortController.signal)
          const shows = raw.map((r) => r.show)
          queryCache.set(trimmed, shows)
          results.value = shows
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') return
          error.value = e instanceof Error ? e.message : 'Search failed'
          results.value = []
        } finally {
          loading.value = false
        }
      }, 300)
    },
    { immediate: true },
  )

  return {
    results: computed<readonly Show[]>(() => results.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
  }
}
