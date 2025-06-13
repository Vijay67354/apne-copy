import React from "react";
import { NavLink } from "react-router-dom";

const categories = [
  { name: "Sports", path: "/sports" },
  { name: "Technology", path: "/technology" },
//   { name: "Business", path: "/business" },
];

const Sidebar = () => {
  return (
    <aside className=" h-screen pl-6 pr-6 pt-0 top-5 left-0 overflow-y-auto">
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <NavLink
                to={category.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 transition-colors duration-300 ${
                    isActive ? "text-indigo-600" : "text-gray-600 hover:text-indigo-600"
                  }`
                }
                onClick={(e) => {
                  // Prevent double navigation in case of event bubbling
                  e.stopPropagation();
                }}
              >
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                <span className="text-sm text-red-600">{category.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;