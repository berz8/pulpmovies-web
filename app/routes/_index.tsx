import { json } from "@remix-run/node";
import { Logo, Naming } from "../components/branding"
import { useLoaderData } from "@remix-run/react";

import type { V2_MetaFunction } from "@remix-run/node";
import type { Movie } from "../interfaces";
import MovieCard from "../components/movie/movieCard";

export const meta: V2_MetaFunction = () => {
  return [{ title: "PulpMovies" }];
};

export async function loader() {
  const res = await fetch("https://api.themoviedb.org/3/trending/movie/week?language=en", {
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
    },
  });

  const result: { results: Movie[] } = await res.json();

  return json(result);
}

export default function Index() {

  const { results } = useLoaderData<typeof loader>();

  return (
    <div className="h-full pt-4 pb-24 px-3">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Logo width="2.8rem" />
        <Naming width="12rem" />
      </div>
      {results.length && (
        <>
          <h1 className="mb-3 text-lg text-gray-400 text-center font-bold">Now Trending</h1>
          <div className="flex flex-wrap gap-3 -mr-3">
            {results.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
