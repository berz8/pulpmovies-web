export function Button({ text, type, disabled = false, variant = "main", size = "md" }: Props) {
  return (
    <button
      type={type}
      className={classGenerator(variant, size)}
      disabled={disabled}
    >
      {text}
    </button>
  )
}


const classGenerator = (variant: string, size: string): string => {
  let className = "w-full rounded-md disabled:bg-none disabled:bg-[rgba(0,0,0,0.3)] disabled:shadow-inner disabled:text-[rgba(255,255,255,0.6)] ";
  if (variant === "main") className += " bg-gradient-to-br from-[#E200B1] to-[#6400E2] text-white ";
  if (variant === "transparent") className += "bg-transparent border-2 border-gray-400 text-gray-400 ";

  if (size === "sm") className += "p-1 text-sm ";
  if (size === "md") className += "p-2 ";

  return className
}

interface Props {
  text: string
  type: "submit" | "button"
  size?: "sm" | "md" | "lg"
  variant?: "main" | "secondary" | "transparent"
  disabled?: boolean
}
