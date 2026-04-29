import type { Show } from '@/types'

const BASE_URL = 'https://api.tvmaze.com'

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`TVMaze API error ${response.status}: ${path}`)
  }
  return response.json() as Promise<T>
}

export interface SearchResult {
  score: number
  show: Show
}

export async function fetchAllShows(pages = 3): Promise<Show[]> {
  const requests = Array.from({ length: pages }, (_, i) =>
    get<Show[]>(`/shows?page=${i}`).catch(() => [] as Show[]),
  )
  const results = await Promise.all(requests)
  return results.flat()
}

export async function fetchShow(id: number): Promise<Show> {
  return get<Show>(`/shows/${id}`)
}

export async function searchShows(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  return get<SearchResult[]>(`/search/shows?q=${encodeURIComponent(query)}`, signal)
}
