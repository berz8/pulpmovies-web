import { json, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { format, intervalToDuration } from "date-fns";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  HeadersFunction,
} from "@remix-run/node";
import type { Watchlist } from "~/interfaces";
import { useCallback, useMemo, useState } from "react";
import MoviePosterAnimated from "~/components/movie/moviePosterAnimated";
import MovieRating from "~/components/movie/movieRating";
import MovieWatchProviders from "~/components/movie/movieWatchProviders";
import { Button, SegmentedControls, TmdbCredits } from "~/components/ui";
import { motion } from "framer-motion";
import { MoviePerson } from "~/components/movie/moviePerson";
import {
  type CrewPerson,
  type Video,
  creditsTypes,
} from "~/interfaces/movieDetail";
import { IconShare, IconVideo } from "~/components/icons";
import { IconWatchlist } from "~/components/icons/watchlist";
import { authenticator } from "~/services/auth.server";
import { getMovie, getMovieDetail } from "~/services/api.tmdb.server";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "private, max-age=150",
});

export async function action({ request, params }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const formData = await request.formData();
  const addToWatchlist = formData.get("addToWatchlist");

  if (!user) return null;

  const movie = await getMovie(params.id);

  if (addToWatchlist === "true") {
    const addMovieReq = await fetch(
      `${process.env.API_URL}/watchlist/id/default/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ...movie }),
      }
    );
    if (addMovieReq.status != 201 && addMovieReq.status != 200) {
      return redirect(`/movie/${params.id}?error=true`);
    }

    return null;
  } else if (addToWatchlist === "false") {
    const res = await fetch(
      `${process.env.API_URL}/watchlist/id/default/${movie.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (res.status != 200) {
      return redirect(`/movie/${params.id}?error=true`);
    }

    return null;
  }
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  let watchlists: Watchlist[] = [];
  if (user) {
    let watchlistPromise = await fetch(
      `${process.env.API_URL}/watchlist/user/movie/${params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    watchlists = await watchlistPromise.json();
  }

  const movie = await getMovieDetail(params.id);

  if (!movie || !movie.id) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    movie,
    watchlists,
    user: user?.user,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${data?.movie?.title} (${
      data?.movie.release_date &&
      format(new Date(data?.movie?.release_date), "yyyy")
    })`,
  },
  {
    property: "og:title",
    content: `${data?.movie?.title} (${
      data?.movie.release_date &&
      format(new Date(data.movie?.release_date), "yyyy")
    })`,
  },
  { property: "description", content: data?.movie.overview },
  { property: "og:description", content: data?.movie.overview },
  {
    property: "og:image",
    content: `https://image.tmdb.org/t/p/original${data?.movie.backdrop_path}`,
  },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "675" },
  { property: "og:site_name", content: "PulpMovies" },
];

export default function MovieId() {
  const { movie, watchlists, user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isInWatchlist = fetcher.formData
    ? fetcher.formData.get("addToWatchlist") === "true"
    : watchlists.length > 0;

  movie.credits.crew.sort((a, b) => {
    const depOrder: { [key: string]: number } = {
      Writing: 1,
      Camera: 2,
      Directing: 3,
    };

    const depA = depOrder[a.department] || 2;
    const depB = depOrder[b.department] || 2;

    return depA - depB;
  });
  const details: { label: string; value: creditsTypes }[] = [
    { label: "Cast", value: creditsTypes.cast },
    { label: "Crew", value: creditsTypes.crew },
  ];

  const [showFullOverview, setShowFullOverview] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState({
    value: creditsTypes.cast,
    index: 0,
  });

  const formattedRuntime = useMemo((): string => {
    const runtimeMinute = movie.runtime;
    const runtimeObject = intervalToDuration({
      start: 0,
      end: runtimeMinute * 60000,
    });
    if (runtimeObject.hours && runtimeObject.hours > 0) {
      return `${runtimeObject.hours}h ${
        runtimeObject.minutes ? runtimeObject.minutes + "m" : ""
      }`;
    }
    return `${runtimeObject.minutes}m`;
  }, [movie]);

  const getDirectors = useCallback(
    (_directors: CrewPerson[] = []) =>
      _directors
        .filter((director) => director.job === "Director")
        .map((director, index: number, filteredDirectors: CrewPerson[]) => (
          <Link
            to={`/person/${director.id}`}
            key={director.id}
            className="inline-block ml-1 font-bold italic text-center text-gray-300 relative"
          >
            {`${director.name}${
              filteredDirectors.length > 1 &&
              filteredDirectors.length - 1 !== index
                ? ", "
                : ""
            }`}
          </Link>
        )),
    []
  );

  const getTrailer = useCallback((videos: Video[]) => {
    const trailer = videos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
    if (!trailer) return null;
    return (
      <a
        href={`https://youtube.com/watch?v=${trailer.key}`}
        rel="noreferrer"
        target="_blank"
        className="w-full p-2 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md text-gray-200 flex gap-2 justify-center"
      >
        <IconVideo />
        <span>Trailer</span>
      </a>
    );
  }, []);

  const shareSheet = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${movie?.title} (${format(
            new Date(movie?.release_date),
            "yyyy"
          )})`,
          url: `https://pulpmovies.app/movie/${movie.id}`,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    }
  };

  return (
    <div className="pb-28">
      {movie && (
        <div className="pt-3 pb-4">
          {movie.backdrop_path ? (
            <div className="w-[CALC(100% - 1.5rem)] mx-3 h-[240px] relative rounded-xl overflow-hidden lg:h-[450px]">
              <img
                src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                className="object-cover w-full h-full"
                alt=""
              />
              {movie.runtime && (
                <div className="absolute top-1 left-1 bg-[rgba(0,0,0,0.3)] rounded-lg py-1 px-2 text-sm text-gray-200 font-bold lg:text-md lg:py-2 lg:px-3">
                  {formattedRuntime}
                </div>
              )}
              {movie.release_date && (
                <div className="absolute top-1 right-1 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm rounded-lg py-1 px-2 text-sm text-gray-200 font-bold lg:text-md lg:py-2 lg:px-3">
                  {format(new Date(movie.release_date), "yyyy")}
                </div>
              )}
              <div className="absolute bottom-0 left-0 z-0 h-44 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326]" />
            </div>
          ) : (
            <div className="w-[CALC(100%_-_1.5rem)] mx-3 h-[80px] relative rounded-xl overflow-hidden" />
          )}
        </div>
      )}
      <h1 className="text-gray-100 text-center text-3xl px-4 -mt-12 relative font-bold">
        {movie.title}
      </h1>
      <div className="text-center px-2">{getDirectors(movie.credits.crew)}</div>
      <div className="flex px-3 pt-4">
        <div
          className="w-[100px] lg:w-[250px]"
          style={{ viewTransitionName: `movie-${movie.id}` }}
        >
          <MoviePosterAnimated
            posterPath={movie.poster_path}
            title={movie.title}
          />
        </div>
        <div
          className={`w-[CALC(100%_-_100px)] pl-3 lg:pl-6 overflow-hidden relative ${
            !showFullOverview && "max-h-[150px]"
          }`}
          onClick={() => setShowFullOverview(!showFullOverview)}
        >
          {movie.original_title !== movie.title && (
            <h2 className="text-gray-400 text-lg italic font-bold mb-2">
              {movie.original_title}
            </h2>
          )}
          <p className="text-gray-300 text-sm lg:text-lg">{movie.overview}</p>
          <div
            className={`absolute bottom-0 left-0 z-0 h-8 w-full bg-gradient-to-t from-[#252D46] via-[rgba(37,45,70,0.7)] to-[rgba(37,45,70,0)] dark:from-[#222326] ${
              showFullOverview && "opacity-0"
            }`}
          />
        </div>
      </div>
      <div className="px-3 mt-5 flex items-center">
        <MovieRating rating={movie.vote_average} />
      </div>
      {user && (
        <div className="px-3 mt-5 flex items-center w-full">
          <fetcher.Form
            method="post"
            action={`/movie/${movie.id}`}
            className="w-full"
          >
            <Button
              type="submit"
              value={!isInWatchlist ? "true" : "false"}
              name="addToWatchlist"
              text={isInWatchlist ? "In your Watchlist" : "Add to Watchlist"}
              variant="secondary"
              icon={<IconWatchlist fill={isInWatchlist} />}
            />
          </fetcher.Form>
        </div>
      )}
      {Object.keys(movie["watch/providers"].results).length > 0 &&
        movie["watch/providers"].results.IT && (
          <div className="mt-5 px-3">
            <MovieWatchProviders
              watchProviders={movie["watch/providers"].results}
            />
          </div>
        )}
      <div className="px-3 mt-5">
        <motion.div className="p-2 rounded-lg bg-[rgba(0,0,0,0.3)] shadow-md">
          <SegmentedControls
            items={details}
            selected={selectedDetail}
            setSelected={setSelectedDetail}
          />
          <motion.div className="flex gap-3 overflow-scroll p-2 scrollbar-hide">
            {movie.credits[selectedDetail.value].map((person) => (
              <MoviePerson key={person.id + person.credit_id} person={person} />
            ))}
          </motion.div>
        </motion.div>
      </div>
      <div className="px-3 mt-5 flex gap-2">
        {movie.videos.results && getTrailer(movie.videos.results)}
        <Button
          variant="secondary"
          onClick={() => shareSheet()}
          icon={<IconShare />}
          text="Share"
        />
      </div>
      <div className="px-3 mt-5 flex flex-col gap-2">
        <div className="py-2 border-b border-gray-600">
          <span className="block text-xs text-gray-200 font-bold">Genre</span>
          <span className="block text-sm text-gray-300">
            {movie.genres.map((x) => x.name).join(", ")}
          </span>
        </div>
        <div className="py-2 border-b border-gray-600">
          <span className="block text-xs text-gray-200 font-bold">
            Original Title
          </span>
          <span className="block text-sm text-gray-300">
            {movie.original_title}
          </span>
        </div>
        <div className="py-2 border-b border-gray-600">
          <span className="block text-xs text-gray-200 font-bold">
            Languages
          </span>
          <span className="block text-sm text-gray-300">
            {movie.spoken_languages.map((x) => x.english_name).join(", ")}
          </span>
        </div>
        <div className="py-2">
          <span className="block text-xs text-gray-200 font-bold">
            Production Companies
          </span>
          <span className="block text-sm text-gray-300">
            {movie.production_companies.map((x) => x.name).join(", ")}
          </span>
        </div>
      </div>
      <TmdbCredits />
    </div>
  );
}
