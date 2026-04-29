import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Show, GenreGroup } from '@/types'

export function useGenres(shows: Ref<readonly Show[]>) {
  const genreGroups = computed<GenreGroup[]>(() => {
    const genreMap = new Map<string, Show[]>()

    for (const show of shows.value) {
      for (const genre of show.genres) {
        if (!genreMap.has(genre)) genreMap.set(genre, [])
        genreMap.get(genre)!.push(show)
      }
    }

    return Array.from(genreMap.entries())
      .map(([genre, shows]) => ({
        genre,
        shows: [...shows].sort(byRatingDesc),
      }))
      .sort((a, b) => a.genre.localeCompare(b.genre))
  })

  return { genreGroups }
}

function byRatingDesc(a: Show, b: Show): number {
  const ra = a.rating.average ?? 0
  const rb = b.rating.average ?? 0
  return rb - ra
}
