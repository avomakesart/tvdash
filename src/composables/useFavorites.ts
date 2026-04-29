import { ref, computed } from 'vue'

const STORAGE_KEY = 'tvdash-favorites'

function readStorage(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeStorage(ids: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // quota exceeded or private mode — fail silently
  }
}

const favoriteIds = ref<number[]>(readStorage())

export function useFavorites() {
  function toggle(id: number) {
    if (favoriteIds.value.includes(id)) {
      favoriteIds.value = favoriteIds.value.filter((f) => f !== id)
    } else {
      favoriteIds.value = [...favoriteIds.value, id]
    }
    writeStorage(favoriteIds.value)
  }

  function isFavorite(id: number): boolean {
    return favoriteIds.value.includes(id)
  }

  return {
    favoriteIds: computed<readonly number[]>(() => favoriteIds.value),
    toggle,
    isFavorite,
  }
}
