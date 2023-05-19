import { LoaderArgs, V2_MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import MoviePosterAnimated from "~/components/movie/moviePosterAnimated";
import { TmdbCredits } from "~/components/ui";
import { Person } from "~/interfaces/person";

export async function loader({ params }: LoaderArgs) {
  const res = await fetch(`${process.env.TMDB_API_URL}/person/${params.id}?language=en&append_to_response=person_credits`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization':`Bearer ${process.env.TMDB_API_KEY}`,
    }
  });

  const person: Person  = await res.json();

  if (!person || !person.id) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ person });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => ([
  { title: data.person?.name },
  { property: "og:title", content: data.person?.name }, 
  { property: "og:image", content: `https://image.tmdb.org/t/p/original${data.person.profile_path}`},
  { property: "og:site_name", content: "PulpMovies" },
]);

export default function Person() {

  const { person } = useLoaderData<typeof loader>();
  
  const [showFullOverview, setShowFullOverview] = useState(false);

  return (
    <div className="pb-32">
      <h1 className="text-gray-100 text-center text-3xl px-4 relative font-bold">
        {person.name}
      </h1>
      <div className="flex px-3 pt-4">
        <div className="w-[100px] lg:w-[250px]">
          <MoviePosterAnimated posterPath={person.profile_path} title={person.name} />
        </div>
        <div
          className={`w-[CALC(100%_-_100px)] pl-3 lg:pl-6 overflow-hidden relative ${!showFullOverview && 'max-h-[150px]'}`}
          onClick={() => setShowFullOverview(!showFullOverview)}
        >
          <p className="text-gray-300 text-sm lg:text-lg">{person.biography}</p>
          <div className={`absolute bottom-0 left-0 z-0 h-8 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326] ${showFullOverview && 'opacity-0'}`} />
        </div>
      </div>
      <TmdbCredits />
    </div>
  )
}
