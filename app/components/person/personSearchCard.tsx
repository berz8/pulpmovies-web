import { Link } from "@remix-run/react";
import { PersonSearch } from "../../interfaces";

export default function PersonSearchCard({ person }: Props) {
  const posterPath = !person.profile_path
    ? "/images/fallback-profile.jpg"
    : `https://image.tmdb.org/t/p/w200${person.profile_path}`;

  return (
    <Link
      to={`/person/${person.id}`}
      className="mb-2 flex shadow-lg bg-cover bg-center rounded-lg overflow-hidden backdrop-blur-0 p-2 relative lg:basis-[CALC(50%_-_2rem)] lg:mb-0 bg-[rgba(0,0,0,0.3)]"
      unstable_viewTransition
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
        <h1 className="text-gray-200 text-xl font-bold">{person.name}</h1>
        <h2 className="text-gray-400 italic text-md font-semibold">
          Know for: {person.known_for_department}
        </h2>
        <span className="block text-gray-400 text-sm">
          {person.known_for.map((x) => x.title).join(", ")}
        </span>
      </div>
    </Link>
  );
}

interface Props {
  person: PersonSearch;
}
