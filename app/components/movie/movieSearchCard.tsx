import { Link } from "@remix-run/react";
import { Movie } from "../../interfaces";
import { format } from "date-fns";

export function MovieSearchCard({ movie }: Props) {
  return (
   <Link
    to={`/movie/${movie.id}`}
    className="mb-2 flex shadow-lg bg-cover bg-center rounded-lg overflow-hidden backdrop-blur-0 p-2 relative lg:basis-[CALC(50%_-_2rem)] lg:mb-0 bg-[rgba(0,0,0,0.3)]" >
      <div className="w-[60px] relative z-20 min-h-[80px]">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt=""
          className="rounded-lg shadow-lg"
          loading="lazy"
        />
      </div>
      <div className="pl-3 w-[CALC(100%_-_60px)] relative z-20">
        <h1 className="text-gray-200 text-xl font-bold">
          {movie.title}
        </h1>
        <span className="block text-gray-400 text-sm">
          {movie.release_date && format(new Date(movie.release_date), 'yyyy')}
        </span>
      </div>
    </Link> 
  )
}

interface Props {
  movie: Movie
}
