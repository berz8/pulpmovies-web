import { motion } from "framer-motion";

export function SegmentedControls ({ items, selected, setSelected }: Props) {
  return (
    <div className="rounded-lg p-2 relative">
      <div className="relative w-full flex">
        <motion.div
          layout
          className={`absolute h-full top-0 bg-gray-500 rounded-lg transition-300`}
          style={{ width: `${100/items.length}%`, left: `${(100/items.length)*selected}%` }}
        />
        { items.map(item => (
            <button
              key={item.id}
              type="button"
              className="grow rounded-md p-1 text-gray-50 text-sm relative z-10"
              onClick={() => setSelected(item.id)}
            >
              { item.label }
            </button>
        ))}
      </div>
    </div>
  )
}

interface Props {
  items: {
    id: number,
    label: string
  }[]
  selected: number,
  setSelected: Function
}
