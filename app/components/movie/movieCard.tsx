import { Link } from "@remix-run/react";
import type { Movie } from "../../interfaces";

export default function MovieCard({ movie }: Props) {
  const posterPath = !movie.poster_path
    ? "/images/fallback-movie.jpg"
    : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="basis-[CALC(33.33%_-_0.75rem)] lg:basis-[CALC(25%_-_0.75rem)] min-h-[170px] md:min-h-[200px]"
      unstable_viewTransition
      style={{ viewTransitionName: `movie-${movie.id}` }}
    >
      <img
        src={posterPath}
        alt={`${movie.title} - PulpMovies`}
        className="rounded-t-md lg:rounded-t-lg rounded-b-none"
        loading="lazy"
      />
      <div className="w-full h-1 lg:h-1.5 rounded-b-lg bg-[rgba(205,205,205,0.2)] relative flex-grow overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#E200B1] to-[#9E01CC] rounded-r-lg absolute left-0 top-0"
          style={{ width: `${(movie.vote_average * 10).toFixed(1)}%` }}
        />
      </div>
    </Link>
  );
}

interface Props {
  movie: Movie;
}
