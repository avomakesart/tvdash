import { ref, computed } from 'vue'
import type { Show } from '@/types'

const STORAGE_KEY = 'tvdash-favorites'

function readStorage(): Show[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    // Guard against old format that stored plain number IDs
    if (!Array.isArray(raw) || raw.some((item) => typeof item !== 'object' || item === null)) {
      return []
    }
    return raw as Show[]
  } catch {
    return []
  }
}

function writeStorage(shows: Show[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

const favorites = ref<Show[]>(readStorage())

export function useFavorites() {
  function toggle(show: Show) {
    if (favorites.value.some((f) => f.id === show.id)) {
      favorites.value = favorites.value.filter((f) => f.id !== show.id)
    } else {
      favorites.value = [...favorites.value, show]
    }
    writeStorage(favorites.value)
  }

  function isFavorite(id: number): boolean {
    return favorites.value.some((f) => f.id === id)
  }

  return {
    favorites: computed<readonly Show[]>(() => favorites.value),
    favoriteIds: computed<readonly number[]>(() => favorites.value.map((f) => f.id)),
    toggle,
    isFavorite,
  }
}
