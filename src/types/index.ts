export interface ShowImage {
  medium: string | null
  original: string | null
}

export interface ShowRating {
  average: number | null
}

export interface ShowNetwork {
  id: number
  name: string
  country: { name: string; code: string; timezone: string } | null
}

export interface ShowExternals {
  tvrage: number | null
  thetvdb: number | null
  imdb: string | null
}

export interface ShowSchedule {
  time: string
  days: string[]
}

export interface Show {
  id: number
  name: string
  type: string
  language: string | null
  genres: readonly string[]
  status: string
  runtime: number | null
  averageRuntime: number | null
  premiered: string | null
  ended: string | null
  officialSite: string | null
  schedule: ShowSchedule
  rating: ShowRating
  weight: number
  network: ShowNetwork | null
  image: ShowImage | null
  summary: string | null
  updated: number
  url: string
}

export interface GenreGroup {
  genre: string
  shows: Show[]
}
