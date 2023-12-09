export function TmdbCredits() {
  return (
    <div className="mx-8 mt-20 flex flex-col items-center gap-2">
      <img
        className="w-36 mb-1"
        src="/images/tmdb.svg"
        alt="The Movie Database logo"
      />
      <p className="text-sm text-center text-gray-400">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  );
}
