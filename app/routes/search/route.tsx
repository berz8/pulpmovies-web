import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { debounce } from "lodash";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import type { Movie } from "~/interfaces";
import { IconSearch } from "~/components/icons";
import { MovieSearchCard } from "~/components/movie/movieSearchCard";


export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if(query && query !== ""){
    const res = await fetch(`${process.env.TMDB_API_URL}/search/movie?query=${query}&language=en&page=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
      }
    });

    const result: { results: Movie[] } = await res.json();
    return json({movies: result.results, query});
  }
  return json({movies: [], query: ''});
};

export default function Index() {

  const { movies, query } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const debounceChange = useCallback(debounce((e) => handleChange(e), 350), [])

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("query", (event.target as HTMLInputElement ).value)
      submit(searchParams, { replace: true });
  }

  return (
    <div className="p-4">
      <div id="search" className="fixed z-30 top-0 left-0 w-full p-4 pb-0 bg-transparent backdrop-blur-md">
        <div
          id="header__search-bar"
          className="flex w-full justify-around mb-4 md:mb-6 lg:mt-20"
        >
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="absolute top-1/2 left-2 -translate-y-1/2 transform">
              <IconSearch />
            </div>
            <Form action="/search" method="get" onChange={debounceChange}>
              <input
                type="text"
                name="query"
                placeholder="cerca"
                defaultValue={query}
                className="
                  shadow-up
                  w-full
                  rounded-xl py-2
                  pl-9 pr-4
                  bg-[#E1E4EC]
                "
              />
            </Form>
          </div>
        </div>
      </div>
      {movies.length && (
        <div className="pt-16 pb-14 m-auto md:pt-20 flex flex-col lg:flex-wrap lg:gap-4 lg:flex-row">
          {movies.map(movie => <MovieSearchCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  )
}
