import { HeadersFunction, LoaderArgs, json } from "@remix-run/node";
import { Logo, Naming } from "../components/branding"
import { useLoaderData } from "@remix-run/react";

import type { V2_MetaFunction } from "@remix-run/node";
import type { Movie } from "../interfaces";
import MovieCard from "../components/movie/movieCard";
import { TmdbCredits } from "~/components/ui";
import { authenticator } from "~/services/auth.server";
import { Credits } from "~/components/ui/credits";

export const meta: V2_MetaFunction = () => ([
  { title: "PulpMovies" },
  { property: "og:title", content: "PulpMovies"},
  { property: "og:description", content: "Discover everything about the movies you love and share them with your friends"},
  { property: "og:image", content: "https://pulpmovies.app/images/pulpmovies-og.jpg"},
  { property: "og:site_name", content: "PulpMovies" },
]);

export const headers: HeadersFunction = () => ({
  "Cache-Control": "private, max-age=500",
});

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request);
  const res = await fetch(`${process.env.TMDB_API_URL}/trending/movie/week?language=en`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  const movies: { results: Movie[] } = await res.json();

  return json({movies: movies.results, user});
}

export default function Index() {

  const { movies, user } = useLoaderData<typeof loader>();

  return (
    <div className="h-full pt-4 px-3">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Logo width="2.8rem" />
        <Naming width="12rem" />
      </div>
      {movies.length ? (
        <>
          <h1 className="mb-3 text-lg text-gray-400 text-center font-bold">Now Trending</h1>
          <div className="flex flex-wrap gap-3 -mr-3">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      ) : null }
      <TmdbCredits />
      <Credits />
    </div>
  );
}
