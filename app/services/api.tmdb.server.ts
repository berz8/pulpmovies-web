import type { Movie, MovieDetail, PersonSearch } from "../interfaces";
import type { PersonDetail } from "../interfaces/personDetail";

async function getFromTmdb(url: string) {
  const res = await fetch(
    `${process.env.TMDB_API_URL}/${url}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    },
  );
   return await res.json();
}

export async function getTrendingMovies() {
  const url = `trending/movie/week?language=en`;
  return await getFromTmdb(url) as { results: Movie[] };
}

export async function getMovie(id: string | undefined) {
  const url = `movie/${id}?language=en`;
  return await getFromTmdb(url) as Movie;
}

export async function getMovieDetail(id: string | undefined) {
  const url = `movie/${id}?language=en&append_to_response=credits,videos,watch/providers`;
  return await getFromTmdb(url) as MovieDetail;
}

export async function getPersonDetail(id: string | undefined) {
  const url = `person/${id}?language=en&append_to_response=movie_credits`;
  return await getFromTmdb(url) as PersonDetail;
}

export async function getSearchResults(query: string, section: string) {
    const url = `search/${section}?query=${query}&language=en&page=1`;
    return await getFromTmdb(url) as { results: Movie[] | PersonSearch[] };
}
