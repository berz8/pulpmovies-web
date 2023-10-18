import type { WatchProviders } from "~/interfaces";

export default function MovieWatchProviders({ watchProviders }: Props) {
  
  // TODO gestire paesi

  return (
    <div>
      <span className="block text-sm text-gray-400 mb-1">Streaming</span>
        <div className="flex gap-2 flex-wrap">
          {watchProviders.IT.flatrate?.map(
            (provider) => (
              <div className="w-[45px]" key={provider.provider_id} >
                <img src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} alt="" className="rounded-md" />
              </div>
            ),
          )}
          {watchProviders.IT.ads?.map(
            (provider) => (
              <div className="w-[45px]" key={provider.provider_id}>
                <img src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`} alt="" className="rounded-md" />
              </div>
            ),
          )}
        </div>
    </div>
  )
}

interface Props {
  watchProviders: {
    IT: WatchProviders
    EN: WatchProviders
  }
}
