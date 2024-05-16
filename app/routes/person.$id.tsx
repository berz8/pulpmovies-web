import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MovieCard from "~/components/movie/movieCard";
import MoviePosterAnimated from "~/components/movie/moviePosterAnimated";
import { SegmentedControls, TmdbCredits } from "~/components/ui";
import type { Movie } from "~/interfaces";
import { getPersonDetail } from "~/services/api.tmdb.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const person = await getPersonDetail(params.id);

  if (!person || !person.id) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ person });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.person?.name },
  { property: "og:title", content: data?.person?.name },
  {
    property: "og:image",
    content: `https://image.tmdb.org/t/p/original${data?.person.profile_path}`,
  },
  { property: "og:site_name", content: "PulpMovies" },
];

export default function PersonId() {
  const { person } = useLoaderData<typeof loader>();

  const creditsCategories = () => {
    let crewCount = 0;
    let directorCount = 0;
    if (person.movie_credits.crew) {
      person.movie_credits.crew.forEach((x) => {
        if (x.job === "Director") {
          directorCount += 1;
        } else {
          crewCount += 1;
        }
      });
    }

    const res = [];
    if (person.movie_credits.cast && person.movie_credits.cast.length > 0)
      res.push({
        id: 0,
        value: "acting",
        label: "Actor",
        detail: person.movie_credits.cast.length.toString(),
      });
    if (directorCount > 0)
      res.push({
        id: 1,
        value: "directing",
        label: "Director",
        detail: directorCount.toString(),
      });
    if (crewCount > 0)
      res.push({
        id: 2,
        value: "crew",
        label: "Crew",
        detail: crewCount.toString(),
      });

    return res;
  };

  const defaultSelectedcategory = () => {
    let knownFor: string;
    if (
      person.known_for_department !== "Acting" &&
      person.known_for_department !== "Directing"
    ) {
      knownFor = "crew";
    } else {
      knownFor = person.known_for_department.toLowerCase();
    }
    return {
      value: knownFor,
      index: creditsCategories().findIndex((x) => x.value === knownFor),
    };
  };

  const [showFullOverview, setShowFullOverview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    defaultSelectedcategory(),
  );

  const sortByPopularity = <T extends Movie>(movies: T[]): T[] =>
    movies.sort((a, b) => b.popularity - a.popularity);

  return (
    <div>
      <div className="px-3 mt-4">
        <h1 className="text-gray-100 text-center text-3xl px-4 relative font-bold">
          {person.name}
        </h1>
      </div>
      <div className="flex px-3 pt-4">
        <div className="w-[100px] lg:w-[250px]">
          <MoviePosterAnimated
            posterPath={person.profile_path}
            title={person.name}
          />
        </div>
        <div
          className={`w-[CALC(100%_-_100px)] pl-3 lg:pl-6 overflow-hidden relative ${
            !showFullOverview && "max-h-[150px]"
          }`}
          onClick={() => setShowFullOverview(!showFullOverview)}
        >
          <p className="text-gray-300 text-sm lg:text-lg">{person.biography}</p>
          <div
            className={`absolute bottom-0 left-0 z-0 h-8 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326] ${
              showFullOverview && "opacity-0"
            }`}
          />
        </div>
      </div>
      <div className="px-3 mt-4">
        <div className="p-1 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md">
          <SegmentedControls
            items={creditsCategories()}
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>
        <div className="py-3 flex flex-wrap gap-3 -mr-3">
          {selectedCategory.value === "acting" &&
            sortByPopularity(person.movie_credits.cast).map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          {selectedCategory.value === "directing" &&
            sortByPopularity(person.movie_credits.crew)
              .filter((movie) => movie.job === "Director")
              .map((movie) => (
                <MovieCard movie={movie} key={movie.id + movie.credit_id} />
              ))}
          {selectedCategory.value === "crew" &&
            sortByPopularity(person.movie_credits.crew)
              .filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t.id === value.id),
              )
              .map((movie) => <MovieCard movie={movie} key={movie.id} />)}
        </div>
      </div>
      <TmdbCredits />
    </div>
  );
}
