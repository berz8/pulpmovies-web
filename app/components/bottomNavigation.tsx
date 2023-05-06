import { NavLink } from "@remix-run/react";
import { BottomNavigationIcons } from "./icons";

const menuItems = [
  {label: "Home", path: "/"},
//  {label: "Watchlist", path: "/lists"},
  {label: "Search", path: "/search"},
//  {label: "Profile", path: "/user"}
]

export default function BottomNavigation() {
  return (
    <div className="fixed left-0 bottom-0 flex w-full lg:bottom-auto lg:left-4 lg:top-1/2 lg:w-auto lg:-translate-y-1/2 z-50">
      <div
        className="shadow-up m-3 mb-[CALC(0.5rem_+_env(safe-area-inset-bottom))] flex w-full justify-around gap-x-1 bg-[rgba(205,205,205,0.3)] py-2 px-2 backdrop-blur-lg rounded-xl
                 lg:flex-col lg:rounded-lg lg:gap-y-4"
      >
        {menuItems.map(menuItem => (
          <NavLink
            key={menuItem.label}
            to={menuItem.path}
            className={({ isActive }) =>
              `block flex-1 py-1 px-3 ${
                isActive
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
