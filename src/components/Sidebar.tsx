"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { name: "Home", icon: "fa-home", path: "/" },
  { name: "Calender", icon: "fa-calendar", path: "/calendar" },
];

const Sidebar = ({ expanded, toggleSidebar }: any) => {
  const path = usePathname();

  return (
    <>
      <div
        className={`bg-gray-800 text-white flex flex-col gap-8 fixed left-0 top-0 h-full overflow-y-auto z-10 transition-all duration-300 ${
          expanded ? "w-48" : "w-16"
        }`}
      >
        <i
          className={`fas ${
            expanded ? "fa-chevron-left" : "fa-chevron-right"
          } mt-4 cursor-pointer text-center`}
          onClick={toggleSidebar}
        ></i>
        <ul>
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.path}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${
                path === route.path ? "bg-gray-700" : ""
              } ${expanded ? "" : "pl-6"}`}
            >
              <li className="flex items-center">
                <i className={`fas ${route.icon} mr-2`}></i>
                {expanded ? route.name : null}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
