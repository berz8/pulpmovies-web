import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useCallback } from "react";
import { debounce } from "lodash";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { Movie, PersonSearch } from "~/interfaces";
import { IconSearch } from "~/components/icons";
import { MovieSearchCard } from "~/components/movie/movieSearchCard";
import { SegmentedControls } from "~/components/ui";
import PersonSearchCard from "~/components/person/personSearchCard";

enum searchResultsType {
  movie = "movie",
  person = "person",
} 

const parseSection = (section: string | null) => { 
    if (section === searchResultsType.person) return searchResultsType.person
    return searchResultsType.movie
}

export const meta: MetaFunction = () => ([
  { title: "Search - PulpMovies" },
  { property: "og:title", content: "Search - PulpMovies"},
  { property: "og:description", content: "Discover everything about the movies you love and share them with your friends"},
  { property: "og:image", content: "https://pulpmovies.app/images/pulpmovies-og.jpg"},
  { property: "og:site_name", content: "PulpMovies" },
]);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") ?? "";
  const section  = parseSection(url.searchParams.get("section"))
  const result: {
    movies: Movie[],
    person: PersonSearch[],
    query: string,
    section: searchResultsType 
  } = {movies: [], person: [], query, section: section}
  if(query && query !== ""){
    const res = await fetch(`${process.env.TMDB_API_URL}/search/${section}?query=${query}&language=en&page=1`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
      }
    });

    const resJson: { results: Movie[] | PersonSearch[] } = await res.json();
    if (section === searchResultsType.movie) result.movies = resJson.results as Movie[];
    if (section === searchResultsType.person) result.person = resJson.results as PersonSearch[];
  }
  return json(result);
};

export default function Index() {

  const { movies, person, query, section } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const selectedSection = () => {
    const index = Object.keys(searchResultsType).findIndex(x => x === section)
    return {value: section as string, index }
  }

  const debounceChange = useCallback(debounce((e) => handleChange(e), 350), [])

  const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("query", (event.target as HTMLInputElement ).value)
      submit(searchParams, { replace: true });
  }

  const sections: {value: searchResultsType, label: string}[] = [
    {value: searchResultsType.movie, label: "Movies"},
    {value: searchResultsType.person, label: "Cast & Crew"}
  ]

  const handleSectionChange = (section: {value: searchResultsType, label: string}) => {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("section", section.value)
      submit(searchParams, { replace: true });
  }

  return (
    <div className="p-4">
      <div id="search" className="fixed z-30 top-0 left-0 w-full p-4 pb-0 bg-transparent backdrop-blur-md">
        <div
          id="header__search-bar"
          className="flex flex-col w-full justify-around items-center mb-4 md:mb-6 lg:mt-20 lg:max-w-[1400px] lg:m-auto lg:flex-row lg:justify-center lg:gap-4"
        >
          <div className="relative w-full md:w-1/2">
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
          <div className="mt-3 p-1 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md w-full md:w-1/2 lg:mt-0">
            <SegmentedControls items={sections} selected={selectedSection()} setSelected={handleSectionChange} />
          </div>
        </div>
      </div>
      {!!(movies.length && section === searchResultsType.movie) && (
        <div className="pt-32 pb-14 m-auto md:pt-20 flex flex-col lg:flex-wrap lg:gap-4 lg:flex-row">
          {movies.map(movie => <MovieSearchCard key={movie.id} movie={movie} />)}
        </div>
      )}
      {!!(person.length && section === searchResultsType.person) && (
        <div className="pt-32 pb-14 m-auto md:pt-20 flex flex-col lg:flex-wrap lg:gap-4 lg:flex-row">
          {person.map(pers => <PersonSearchCard key={pers.id} person={pers} />)}
        </div>
       )}
    </div>
  )
}
