import { ref, computed } from 'vue'
import { fetchAllShows, fetchShow } from '@/api/tvmaze'
import type { Show } from '@/types'

const cache = ref<Show[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let fetched = false

export function useShows() {
  async function loadShows() {
    if (fetched) return
    loading.value = true
    error.value = null
    try {
      cache.value = await fetchAllShows(3)
      fetched = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load shows'
    } finally {
      loading.value = false
    }
  }

  return {
    shows: computed<readonly Show[]>(() => cache.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadShows,
  }
}

export function useShow(id: number) {
  const show = ref<Show | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadShow() {
    loading.value = true
    error.value = null
    try {
      show.value = await fetchShow(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load show'
    } finally {
      loading.value = false
    }
  }

  return {
    show: computed<Show | null>(() => show.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadShow,
  }
}
