import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useGenres } from '@/composables/useGenres'
import { makeShow } from '../fixtures'

describe('useGenres', () => {
  it('returns empty array for no shows', () => {
    const { genreGroups } = useGenres(ref([]))
    expect(genreGroups.value).toEqual([])
  })

  it('groups shows by genre', () => {
    const shows = ref([
      makeShow({ id: 1, genres: ['Drama'] }),
      makeShow({ id: 2, genres: ['Comedy'] }),
      makeShow({ id: 3, genres: ['Drama'] }),
    ])
    const { genreGroups } = useGenres(shows)

    expect(genreGroups.value).toHaveLength(2)
    expect(genreGroups.value.find((g) => g.genre === 'Drama')?.shows).toHaveLength(2)
    expect(genreGroups.value.find((g) => g.genre === 'Comedy')?.shows).toHaveLength(1)
  })

  it('places a show in each of its genres', () => {
    const shows = ref([makeShow({ id: 1, genres: ['Drama', 'Thriller'] })])
    const { genreGroups } = useGenres(shows)

    expect(genreGroups.value).toHaveLength(2)
    expect(genreGroups.value.every((g) => g.shows[0].id === 1)).toBe(true)
  })

  it('sorts shows within a genre by rating descending', () => {
    const shows = ref([
      makeShow({ id: 1, rating: { average: 7.0 }, genres: ['Drama'] }),
      makeShow({ id: 2, rating: { average: 9.5 }, genres: ['Drama'] }),
      makeShow({ id: 3, rating: { average: 5.0 }, genres: ['Drama'] }),
    ])
    const { genreGroups } = useGenres(shows)
    const ids = genreGroups.value.find((g) => g.genre === 'Drama')!.shows.map((s) => s.id)

    expect(ids).toEqual([2, 1, 3])
  })

  it('treats null ratings as 0 when sorting', () => {
    const shows = ref([
      makeShow({ id: 1, rating: { average: null }, genres: ['Drama'] }),
      makeShow({ id: 2, rating: { average: 5.0 }, genres: ['Drama'] }),
    ])
    const { genreGroups } = useGenres(shows)
    const ids = genreGroups.value.find((g) => g.genre === 'Drama')!.shows.map((s) => s.id)

    expect(ids).toEqual([2, 1])
  })

  it('sorts genres alphabetically', () => {
    const shows = ref([
      makeShow({ id: 1, genres: ['Thriller'] }),
      makeShow({ id: 2, genres: ['Action'] }),
      makeShow({ id: 3, genres: ['Drama'] }),
    ])
    const { genreGroups } = useGenres(shows)
    const genres = genreGroups.value.map((g) => g.genre)

    expect(genres).toEqual(['Action', 'Drama', 'Thriller'])
  })

  it('updates reactively when shows change', () => {
    const shows = ref<ReturnType<typeof makeShow>[]>([])
    const { genreGroups } = useGenres(shows)

    expect(genreGroups.value).toHaveLength(0)
    shows.value = [makeShow({ genres: ['Drama'] })]
    expect(genreGroups.value).toHaveLength(1)
  })
})
