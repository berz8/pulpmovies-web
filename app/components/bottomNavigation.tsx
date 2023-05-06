import { NavLink, useLocation } from "@remix-run/react";
import { BottomNavigationIcons } from "./icons";
import { useCallback } from "react";

const menuItems: MenuItem[] = [
  {label: "Home", path: "/", matchingPaths: ["/"]},
//  {label: "Watchlist", path: "/lists"},
  {label: "Search", path: "/search", matchingPaths: ["/search","/movie"]},
//  {label: "Profile", path: "/user"}
]

export default function BottomNavigation() {

  let location = useLocation();

  const isActive = useCallback((menuItem: MenuItem): boolean => {
      if(menuItem.matchingPaths.find(x => x === "/") && location.pathname !== "/") {
        return false
      } else {
        return !!menuItem.matchingPaths.find((x) => location.pathname.includes(x))
      }
    }, [location])

  return (
    <div className="fixed left-0 bottom-0 flex w-full lg:bottom-auto lg:left-4 lg:top-1/2 lg:w-auto lg:-translate-y-1/2 z-50">
      <div
        className="shadow-up m-3 mb-[CALC(0.5rem_+_env(safe-area-inset-bottom))] flex w-full justify-around gap-x-1 bg-[rgba(205,205,205,0.3)] py-2 px-2 backdrop-blur-lg rounded-xl
                 lg:flex-col lg:rounded-lg lg:gap-y-4"
        style={{WebkitBackdropFilter: "blur(16px)"}}
      >
        {menuItems.map(menuItem => (
          <NavLink
            key={menuItem.label}
            to={menuItem.path}
            prefetch="render"
            className={() =>
              `block flex-1 py-1 px-3 ${
                isActive(menuItem)
                  ? "active rounded-lg bg-gradient-to-br from-[#E200B1] to-[#6400E2] text-white shadow-xl"
                  : "text-gray-100 hover:rounded-md hover:bg-gradient-to-br hover:from-[#E200B1] hover:to-[#6400E2]"
              }`
            }
          >
            <BottomNavigationIcons label={menuItem.label} />
            <span className="mx-auto text-center text-[0.68rem] hidden md:block">
              {menuItem.label}
            </span>
          </NavLink>

        ))}
        
      </div>
    </div>
  );
}

interface MenuItem {
  label: string
  path: string
  matchingPaths: string[]
}
