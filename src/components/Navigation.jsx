import React from 'react';
import { NavLink } from 'react-router-dom';

const navStyles = {
  position: 'fixed',
  bottom: '0',
  width: '100%',
  textAlign: 'center',
  backgroundColor: '#fff',
};

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
