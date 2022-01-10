import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav>
      <NavLink
        to="/addItem"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
      >
        Add an Item
      </NavLink>

      <NavLink
        to="/listView"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
      >
        List View
      </NavLink>
    </nav>
  );
}
