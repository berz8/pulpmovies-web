import { Link } from "@remix-run/react";
import type { Movie } from "../../interfaces";
import { format } from "date-fns";

export function MovieSearchCard({ movie, prefetch }: Props) {
  const posterPath = !movie.poster_path
    ? "/images/fallback-movie.jpg"
    : `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="mb-2 flex shadow-lg bg-cover bg-center rounded-lg overflow-hidden backdrop-blur-0 p-2 relative lg:basis-[CALC(50%_-_2rem)] lg:mb-0 bg-[rgba(0,0,0,0.3)]"
      prefetch={prefetch ? "render" : "none"}
    >
      <div className="w-[60px] relative z-20 min-h-[80px]">
        <img
          src={posterPath}
          alt=""
          className="rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
      <div className="pl-3 w-[CALC(100%_-_60px)] relative z-20">
        <h1 className="text-gray-200 text-xl font-bold">{movie.title}</h1>
        { movie.original_title !== movie.title && (
          <h2 className="text-gray-400 text-lg italic font-bold mb-2">{movie.original_title}</h2>
        )}
        <span className="block text-gray-400 text-sm">
          {movie.release_date && format(new Date(movie.release_date), "yyyy")}
        </span>
      </div>
    </Link>
  );
}

interface Props {
  movie: Movie;
  prefetch?: boolean;
}
