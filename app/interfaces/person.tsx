import type { Movie } from "./movie"
import type { creditsTypes } from "./movieDetail"

 export interface Person {
  adult: boolean
  also_known_as: string[]
  biography: string
  birthday: string
  deathday: any
  gender: number
  homepage: any
  id: number
  imdb_id: string
  known_for_department: string
  name: string
  place_of_birth: string
  popularity: number
  profile_path: string
  movie_credits: {
    [creditsTypes.cast]: CastCredit[]
    [creditsTypes.crew]: CrewCredit[]
  }
}

export interface CastCredit extends Movie {
  genre_ids: number[]
  poster_path: string
  character: string
  credit_id: string
  order: number
}

export interface CrewCredit extends Movie {
  genre_ids: number[]
  credit_id: string
  department: string
  job: string
}
