export function IconWatchlist({ fill = false }: { fill?: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      fill={fill ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 6.75C6.75 5.64543 7.64543 4.75 8.75 4.75H15.25C16.3546 4.75 17.25 5.64543 17.25 6.75V19.25L12 14.75L6.75 19.25V6.75Z"
      />
    </svg>
  );
}
