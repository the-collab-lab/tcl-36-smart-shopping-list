import React from 'react';
import { NavLink } from 'react-router-dom';

// UI for navigation links - Add Item and List View
export default function Navigation() {
  return (
    <nav>
      <ul className="text-xl list-reset md:flex md:items-center">
        <li className="md:ml-4 my-2 md:my-0">
          <NavLink
            to="/addItemView"
            style={({ isActive }) => ({
              fontWeight: isActive ? '700' : '',
            })}
            className="bg-teal-800 hover:bg-sky-800 mt-4 py-1 px-2 rounded"
          >
            Add Items
          </NavLink>
        </li>
        <li className="md:ml-4">
          <NavLink
            to="/listView"
            style={({ isActive }) => ({
              fontWeight: isActive ? '700' : '',
            })}
            className="bg-teal-800 hover:bg-sky-800 mt-4 py-1 px-2 rounded"
          >
            List View
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
