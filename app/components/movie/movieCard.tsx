import { Link } from "@remix-run/react";
import type { Movie } from "../../interfaces";

export default function MovieCard({ movie }: Props) {
  return (
    <Link to={`/movie/${movie.id}`} className="basis-[CALC(33.33%_-_0.75rem)]">
      <img src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} alt={`${movie.title} - PulpMovies`} className="rounded-md rounded-b-none" loading="lazy" />
      <div className="w-full h-1 rounded-lg bg-[rgba(205,205,205,0.2)] relative flex-grow">
        <div className="h-full bg-gradient-to-r from-[#E200B1] to-[#9E01CC] rounded-lg absolute left-0 top-0" style={{ width: `${((movie.vote_average.toFixed(1) || 0 * 10))}%` }} />
      </div>
    </Link>
  )
}

interface Props {
  movie: Movie
}
