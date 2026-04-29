import type { Show } from '@/types'

export function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    id: 1,
    name: 'Test Show',
    type: 'Scripted',
    language: 'English',
    genres: ['Drama'],
    status: 'Running',
    runtime: 60,
    averageRuntime: 60,
    premiered: '2020-01-01',
    ended: null,
    officialSite: null,
    schedule: { time: '20:00', days: ['Monday'] },
    rating: { average: 8.0 },
    weight: 50,
    network: null,
    image: null,
    summary: null,
    updated: 1234567890,
    url: 'https://www.tvmaze.com/shows/1/test-show',
    ...overrides,
  }
}
