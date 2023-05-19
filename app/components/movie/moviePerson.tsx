import { Link } from "@remix-run/react"
import type { CastPerson, CrewPerson } from "~/interfaces/movieDetail"

export function MoviePerson({ person }: Props) {
  return (
    <Link
      to={`/person/${person.id}`}
      className="flex flex-col gap-2 w-24 shrink-0" >
      <div className="w-full h-32 rounded-lg overflow-hidden">
        <img
          className="object-cover"
          src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : "/images/fallback-profile.jpg"}
          alt={person.name}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-xs text-gray-100">{person.name}</h2>
        <h3 className="text-xs text-gray-400">{"character" in person ? person.character : person.department}</h3>
      </div>
    </Link>
  )
}

interface Props {
  person: CastPerson | CrewPerson  
}
