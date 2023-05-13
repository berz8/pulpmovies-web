import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format, intervalToDuration } from "date-fns";
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import type { MovieDetail } from "~/interfaces";
import { useCallback, useMemo, useState } from "react";
import { motion, useAnimate } from "framer-motion";
import MoviePosterAnimated from "~/components/movie/moviePosterAnimated";
import MovieRating from "~/components/movie/movieRating";

export async function loader({ params }: LoaderArgs) {
  const res = await fetch(`${process.env.TMDB_API_URL}/movie/${params.id}?language=en&append_to_response=watch/providers,credits`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
    }
  });

  const movie: MovieDetail  = await res.json();

  if (!movie || !movie.id) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ movie });
};

export const meta: V2_MetaFunction = ({ data }) => ([
  { title: `${data.movie?.title} (${format(new Date(data.movie?.release_date), "yyyy")}) - Pulpmovies` }
]);


export default function MovieId() {

  const { movie } = useLoaderData<typeof loader>();

  const [showFullOverview, setShowFullOverview] = useState(false);

  const formattedRuntime = useMemo((): string => {
    const runtimeMinute = movie.runtime;
    const runtimeObject = intervalToDuration({
      start: 0,
      end: runtimeMinute * 60000,
    });
    if (runtimeObject.hours && runtimeObject.hours > 0) {
      return `${runtimeObject.hours}h ${
        runtimeObject.minutes ? runtimeObject.minutes + "m" : ""
      }`;
    }
    return `${runtimeObject.minutes}m`;
  }, [movie]);

  const getDirectors = useCallback((_directors: any = []) => _directors
    .filter((director: any) => director.job === 'Director')
    .map((director: any, index: number, filteredDirectos: []) => (
      <Link
        to={`/cast/${director.id}`}
        key={director.id}
        className="font-bold italic text-center text-gray-300 relative"
      >
        {`${director.name}${(filteredDirectos.length > 1 && (filteredDirectos.length - 1 !== index)) ? ', ' : ''}`}
      </Link>
    )),[]);
  
  return (
    <div>
      {movie && (
        <div className="pt-3 pb-4">
          {movie.backdrop_path ? (
            <div className="w-[CALC(100% - 1.5rem)] mx-3 h-[240px] relative rounded-xl overflow-hidden lg:h-[450px]">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                className="object-cover w-full h-full"
                alt=""
              />
              {movie.runtime && (
                <div className="absolute top-1 left-1 bg-[rgba(0,0,0,0.3)] rounded-lg py-1 px-2 text-sm text-gray-200 font-bold lg:text-md lg:py-2 lg:px-3">
                  {formattedRuntime}
                </div>
              )}
              {movie.release_date && (
                <div className="absolute top-1 right-1 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm rounded-lg py-1 px-2 text-sm text-gray-200 font-bold lg:text-md lg:py-2 lg:px-3">
                  {format(new Date(movie.release_date), "yyyy")}
                </div>
              )}
              <div className="absolute bottom-0 left-0 z-0 h-44 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326]" />
            </div>
          ) : (
            <div className="w-[CALC(100%_-_1.5rem)] mx-3 h-[80px] relative rounded-xl overflow-hidden" />
          )}
        </div>
      )}
      <h1 className="text-gray-100 text-center text-3xl px-4 -mt-12 relative font-bold">
        {movie.title}
      </h1>
      <div className="text-center">
        {getDirectors(movie.credits.crew)}
      </div>
      <div className="flex px-3 pt-4">
        <div className="w-[100px] lg:w-[250px]">
          <MoviePosterAnimated posterPath={movie.poster_path} title={movie.title} />
        </div>
        <div
          className={`w-[CALC(100%_-_100px)] pl-3 lg:pl-6 overflow-hidden relative ${!showFullOverview && 'max-h-[150px]'}`}
          onClick={() => setShowFullOverview(!showFullOverview)}
        >
          <p className="text-gray-300 text-sm lg:text-lg">{movie.overview}</p>
          <div className={`absolute bottom-0 left-0 z-0 h-8 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326] ${showFullOverview && 'opacity-0'}`} />
        </div>
      </div>
      <div className="px-3 mt-4 flex items-center">
        <MovieRating rating={movie.vote_average} />
      </div>
    </div>
  )
}
