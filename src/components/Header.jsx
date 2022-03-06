import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ListNameCopy from './ListNameCopy';
import ExitList from './ExitList';
import { ImCross } from 'react-icons/im';

const Header = ({ filter, setFilter, display }) => {
  // UI that displays current list name, button to copy list, and navigation options to toggle between list view and add item form
  const [isOpen, setIsOpen] = useState(false);

  const localToken = localStorage.getItem('list-token');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    // tailwindcss classes for styling (flex, text color, sticky header, screen size responsiveness)
    <header className="text-offWhite bg-teal-700 font-DM-Sans sticky top-0 border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
      <div className="flex items-center justify-between mb-4 md:mb-0">
        <img
          className="w-20 md:w-20 mx-4 rounded-3xl shadow-2xl"
          src="img/shopping-cart-logo.jpg"
          alt="shopping cart logo"
        />
        <div className="mx-4 justify-between mb-4 md:mb-0">
          <h1 className="text-2xl">
            <NavLink className="no-underline" to="/">
              Smart Shopper
            </NavLink>
          </h1>
          <p>
            Current list: <strong>{localToken}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex md:hidden"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        className={
          isOpen
            ? `flex flex-col mx-4 mb-4 md:mb-0`
            : `hidden md:visible md:flex md:items-center md:justify-between`
        }
      >
        <div className="md:mx-4 flex items-center mb-4 md:mb-0">
          <ListNameCopy copyText={localToken} />
          <ExitList />
        </div>
        <div className={`flex flex-col relative my-2 ${display}`}>
          <div className="flex relative text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>

            <input
              className="text-black w-full bg-white p-2 text-md rounded-md pl-10"
              type="text"
              id="search"
              ref={inputRef}
              value={filter}
              placeholder="search"
              onChange={(e) => setFilter(e.target.value)}
              aria-label="filter the shopping list"
            ></input>
            <span className="absolute inset-y-0 right-4 flex items-center">
              <button
                className="p-1 text-md rounded-md"
                aria-label="clear input"
                onClick={() => setFilter('')}
              >
                <ImCross />
              </button>
            </span>
          </div>
        </div>
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
      </div>
    </header>
  );
};

export default Header;
