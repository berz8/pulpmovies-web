import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MoviePosterAnimated({ posterPath, title }: Props){

  const [fullscreen, setFullscreen] = useState<boolean>(false)

  useEffect(() => {
    // Preload fullsize image
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/original${posterPath}`
  })

  return (
    <>
      <motion.div
        className="w-full"
        onClick={() => setFullscreen(true)}
      >
        <motion.img src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={`${title}`} className="rounded-md" />
      </motion.div>

      <AnimatePresence>
        {fullscreen &&
          <motion.div
            className="fixed w-full h-full p-10 top-0 left-0 flex flex-col gap-4 items-center justify-center z-50 bg-[rgba(0,0,0,0.4)] backdrop-blur-sm"
            onClick={() => setFullscreen(false)}
            onDrag={() => setFullscreen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              ease: "linear",
              duration: 0.2
            }}
          >
              <motion.img
                src={`https://image.tmdb.org/t/p/original${posterPath}`} alt={`${title}`} className="rounded-xl"
                initial={{ scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  ease: "linear",
                  duration: 0.2
                }}
              />
              <motion.h1 className="text-gray-100 text-center text-xl font-bold italic">{title}</motion.h1>
          </motion.div>   
        }
      </AnimatePresence>
    </>
  )
}

interface Props {
  posterPath: string
  title: string
}
