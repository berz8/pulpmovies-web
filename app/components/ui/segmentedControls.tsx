import { motion } from "framer-motion";

export function SegmentedControls ({ items, selected, setSelected }: Props) {
  return (
    <div className="rounded-lg p-2 relative">
      <div className="relative w-full flex">
        <motion.div
          layout
          className={`absolute h-full top-0 bg-gray-500 rounded-lg transition-300`}
          style={{ width: `${100/items.length}%`, left: `${(100/items.length)*(selected.index)}%` }}
        />
        { items.map((item, index) => (
            <button
              key={item.value}
              type="button"
              className="grow rounded-md p-1 text-gray-50 text-sm relative z-10 font-semibold shadow-lg"
              onClick={() => setSelected({value: item.value, index: index})}
            >
              { item.label }
              { item.detail && (<span className="text-gray-400 font-bold ml-2">{item.detail}</span>) }
            </button>
        ))}
      </div>
    </div>
  )
}

interface Props {
  items: {
    label: string
    value: string
    detail?: string
  }[]
  selected: {
    value: string
    index: number
  }
  setSelected: Function
}
