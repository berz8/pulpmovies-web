export default function MovieRating({ rating }: Props) {
  return (
    <div className="w-full h-2 rounded-lg bg-gradient-to-r from-[#E200B1] to-[#9E01CC] relative flex-grow">
      {rating > 0 && (
        <>
          <div
            className="h-full bg-gray-300 rounded-lg absolute right-0 top-0"
            style={{ width: `${100 - (Number(rating.toFixed(1)) ?? 0) * 10}%` }}
          />
          <div
            className="absolute top-[2px] -translate-y-1/2 px-2 rounded-xl bg-gradient-to-br from-[#E200B1] to-[#B101C5] shadow-xl"
            style={{ right: `${97 - (Number(rating.toFixed(1)) ?? 0) * 10}%` }}
          >
            <span className="block text-lg font-black text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

interface Props {
  rating: number;
}
