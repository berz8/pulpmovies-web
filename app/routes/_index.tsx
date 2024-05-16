import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Logo, Naming } from "../components/branding";
import { useLoaderData } from "@remix-run/react";

import type { MetaFunction } from "@remix-run/node";
import MovieCard from "../components/movie/movieCard";
import { TmdbCredits } from "~/components/ui";
import { authenticator } from "~/services/auth.server";
import { getTrendingMovies } from "~/services/api.tmdb.server";
import { Credits } from "~/components/ui/credits";

export const meta: MetaFunction = () => [
  { title: "PulpMovies" },
  { property: "og:title", content: "PulpMovies" },
  {
    property: "og:description",
    content:
      "Discover everything about the movies you love and share them with your friends",
  },
  {
    property: "og:image",
    content: "https://pulpmovies.app/images/pulpmovies-og.jpg",
  },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "675" },
  { property: "og:site_name", content: "PulpMovies" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await authenticator.isAuthenticated(request);
  const movies = await getTrendingMovies();
  return json({ movies: movies.results, user });
}

export default function Index() {
  const { movies, user } = useLoaderData<typeof loader>();

  return (
    <div className="h-full pt-4 px-3">
      <div className="flex justify-center items-center gap-2 mb-4">
        <Logo width="2.8rem" />
        <Naming width="12rem" />
      </div>
      {user ? (
        <div className="mb-8 mt-2">
          <h2 className="text-2xl text-gray-400 text-center font-bold">
            Welcome back{" "}
            <span className="text-gray-100">@{user.user.username}</span>
          </h2>
        </div>
      ) : null}
      {movies.length ? (
        <>
          <h1 className="mb-3 text-lg text-gray-400 text-center font-bold">
            Trending Movies
          </h1>
          <div className="flex flex-wrap gap-3 -mr-3">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      ) : null}
      <TmdbCredits />
      <Credits />
    </div>
  );
}
