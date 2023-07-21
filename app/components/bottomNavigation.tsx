import { NavLink, useLocation } from "@remix-run/react";
import { BottomNavigationIcons } from "./icons";
import { useCallback } from "react";
import { motion } from "framer-motion"

const menuItems: MenuItem[] = [
  { id: 0, label: "Home", path: "/", matchingPaths: ["/"] },
  //  {label: "Watchlist", path: "/lists"},
  { id: 1, label: "Search", path: "/search", matchingPaths: ["/search", "/movie", "/person"] },
  { id: 2, label: "Profile", path: "/profile", matchingPaths: ["/profile"] },
]

export default function BottomNavigation() {

  let location = useLocation();

  const activeId = useCallback((menuItems: MenuItem[]): number => {
    let x = 0;
    menuItems.forEach(menuItem => {
      if (menuItem.matchingPaths.find(x => x === "/") && location.pathname !== "/") {
        x = menuItem.id
      } else if (menuItem.matchingPaths.find((x) => location.pathname.includes(x))) { x = menuItem.id }
    })
    return x;
  }, [location])

  return (
    <div className="fixed left-0 bottom-0 flex w-full lg:w-auto lg:top-2 lg:bottom-auto lg:left-1/2 lg:-translate-x-1/2 z-40">
      <motion.div
        className="shadow-up m-3 mb-[CALC(0.5rem_+_env(safe-area-inset-bottom))] bg-[rgba(205,205,205,0.3)] py-2 px-2 backdrop-blur-lg rounded-xl
                 lg:rounded-lg relative w-full"
      >
        <div className="relative flex w-full justify-around gap-x-1 lg:gap-y-4">
          <motion.div
            layout
            className={`absolute h-full top-0 rounded-lg bg-gradient-to-br from-[#E200B1] to-[#6400E2] shadow-xl`}
            style={{ width: `${100 / menuItems.length}%`, left: `${(100 / menuItems.length) * activeId(menuItems)}%` }}
          />
          {menuItems.map(menuItem => (
            <NavLink
              key={menuItem.id}
              to={menuItem.path}
              prefetch="render"
              rel="prefetch"
              className="block flex-1 py-1 px-3 text-gray-100 relative z-10 lg:px-16 lg:flex lg:gap-3 lg:items-center lg:justify-center"
            >
              <BottomNavigationIcons label={menuItem.label} />
              <span className="mx-auto text-center text-[0.68rem] hidden md:block lg:text-semibold lg:text-base">
                {menuItem.label}
              </span>
            </NavLink>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface MenuItem {
  id: number
  label: string
  path: string
  matchingPaths: string[]
}
