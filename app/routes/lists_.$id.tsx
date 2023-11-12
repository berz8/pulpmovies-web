import { LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import { MovieSearchCard } from "~/components/movie/movieSearchCard";
import { Movie, Watchlist } from "~/interfaces"

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const res = await fetch(`${process.env.API_URL}/watchlist/id/${params.id}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  })

  const watchlist: { watchlist: Watchlist, movies: Movie[] } = await res.json();

  return json(watchlist)


}
export default function ListIdPage() {
  const { watchlist, movies } = useLoaderData<typeof loader>()

  return (
    <div className="pt-4 px-3">
      <h1 className="text-gray-400 font-bold text-3xl">{watchlist.name}</h1>
      <h2 className="text-gray-500 italic mb-6 text-lg">{watchlist.description}</h2>
      {movies.length > 0 ? movies.map(m => <MovieSearchCard  key={m.id} movie={m} />) : (
        <div className="py-8 px-4 text-center">
          <span className="italic text-gray-400">You can add movies to this list directly from the movie page</span>
        </div>
      )}
    </div>
  )
}
