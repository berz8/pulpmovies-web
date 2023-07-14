export function Button({ text, type, disabled = false }: Props){
  return (
      <button 
        type={type} 
        className="w-full py-2 px-2 rounded-md bg-gradient-to-br from-[#E200B1] to-[#6400E2] text-white
                  disabled:bg-none disabled:bg-[rgba(0,0,0,0.3)] disabled:shadow-inner disabled:text-[rgba(255,255,255,0.6)]"
        disabled={disabled}
      >
        { text }
      </button>
  )
}

interface Props {
  text: string
  type: "submit" | "button"
  disabled?: boolean
}
