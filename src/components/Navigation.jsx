import React from 'react';
import { NavLink } from 'react-router-dom';

// UI for navigation links - Add Item and List View
export default function Navigation() {
  return (
    <nav className="sticky bottom-0 text-center py-4 bg-sky-700">
      <NavLink
        to="/addItemView"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
        className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-bold mt-4 py-1 px-2 rounded"
      >
        Add an Item
      </NavLink>
      &nbsp;
      <NavLink
        to="/listView"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
        className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-bold mt-4 py-1 px-2 rounded"
      >
        List View
      </NavLink>
    </nav>
  );
}
