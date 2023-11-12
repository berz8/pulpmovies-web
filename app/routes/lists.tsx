import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { Button } from "~/components/ui"
import { Movie, Watchlist } from "~/interfaces"
import { authenticator } from "~/services/auth.server"

export const meta: MetaFunction = () => ([
  { title: "Lists - PulpMovies" },
  { property: "og:title", content: "Lists - PulpMovies"},
  { property: "og:description", content: "Discover everything about the movies you love and share them with your friends"},
  { property: "og:image", content: "https://pulpmovies.app/images/pulpmovies-og.jpg"},
  { property: "og:image:width", content: "1200"},
  { property: "og:image:height", content: "675"},
  { property: "og:site_name", content: "PulpMovies" },
])

export const loader = async ({request}: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  const wathclistsReq = await fetch(`${process.env.API_URL}/watchlist/user/${user.user.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
  })
  const watchlists: Watchlist[] = await wathclistsReq.json()
  let watchlistWithMovies: {watchlist: Watchlist, movies: Movie[]} | null = null 
  if(watchlists.length > 0) {
    const watchlistWithMoviesReq = await fetch(`${process.env.API_URL}/watchlist/id/${watchlists[0].id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
    },
  })
    watchlistWithMovies = await watchlistWithMoviesReq.json()
  }

  return json({ watchlists, watchlistWithMovies })
}

export default function ListsPage() {
  const { watchlists, watchlistWithMovies } = useLoaderData<typeof loader>();
  const posterPath = (movie: Movie) => !movie.poster_path ? "/images/fallback-movie.jpg" : `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    return (
      <div className="pt-4 px-3">
          <h2 className="text-2xl text-gray-400 font-bold">
           Your lists 
          </h2>
          <div className="mt-3">
            <Button variant="transparent" text="Create a new list" type="button" />
          </div>
          <div className="mt-4">
            {watchlists.map(w => (
              <Link to={`/lists/${w.id}`} key={w.id} className="mb-4 block w-full rounded-lg shadow-lg bg-[rgba(0,0,0,0.3)] py-2 px-2">
                <div className="flex items-center justify-between text-gray-300 ">
                  <h2 className="text-lg font-bold">{w.name}</h2>
                  <div className="flex gap-1">
                  <span>{watchlistWithMovies ? watchlistWithMovies.movies.length : "0"} movie{watchlistWithMovies?.movies.length != 1 ? "s" : null}</span>
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.75 8.75L14.25 12L10.75 15.25"></path>
                  </svg>
                  </div>
                </div>
                {watchlistWithMovies && watchlistWithMovies.movies.length > 0 ?
                  (<div className="flex gap-2 mt-2">
                {watchlistWithMovies && watchlistWithMovies.movies.map(m => (
                  <div key={m.id} className="rounded-lg overflow-hidden w-16">
                    <img src={posterPath(m)} alt={m.title} loading="lazy" />
                  </div>
                )) }
                </div>) : (
                 <div className="py-8 px-4 text-center">
                  <span className="italic text-gray-400">You can add movies to this list directly from the movie page</span>
                 </div>
                )}
              </Link>
            ))}
          </div>
      </div>
      )
  }
