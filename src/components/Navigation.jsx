import React from 'react';
import { NavLink } from 'react-router-dom';
import { navStyles } from '../utils';

export default function Navigation() {
  return (
    <nav style={navStyles}>
      <NavLink
        to="/addItemView"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
      >
        Add an Item
      </NavLink>
      &nbsp;
      <NavLink
        to="/listView"
        style={({ isActive }) => ({ fontWeight: isActive ? '800' : '' })}
      >
        List View
      </NavLink>
    </nav>
  );
}
