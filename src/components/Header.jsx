import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ListNameCopy from './ListNameCopy';
import ExitList from './ExitList';
import { ImCross } from 'react-icons/im';

const Header = ({ filter, setFilter }) => {
  const [isOpen, setIsOpen] = useState(false);

  const localToken = localStorage.getItem('list-token');
  // const [filter, setFilter] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  //filters items to only display items a user is searching by via the input bar
  // const filteredItems = layoutItems.filter((item) =>
  //   item.id.includes(filter.toLowerCase()),
  // );

  /*
    <header classNameName="sticky top-0 mx-auto my-4">
      <h2 className="text-center bg-sky-700 font-Karma text-white text-5xl p-6">
        Smart Shopper
      </h2>
    </header>*/
  return (
    <header className=" bg-teal-600 sticky top-0 border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
      <div className="flex items-center justify-between mb-4 md:mb-0">
        <img
          className="w-20 md:w-20 mx-4 rounded-3xl shadow-2xl"
          src="img/shopping-cart-logo.jpg"
          alt="shopping cart logo"
        />
        <div className="mx-4 justify-between mb-4 md:mb-0">
          <h1 className="text-2xl text-black-800">
            <NavLink className="no-underline hover:text-blue-500" to="#">
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
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
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
        <div className="flex flex-col relative my-2">
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
              className="text-black w-3/4 bg-white p-2 text-md rounded-md pl-10"
              type="text"
              id="search"
              ref={inputRef}
              value={filter}
              placeholder="search"
              onChange={(e) => setFilter(e.target.value)}
              aria-label="filter the shopping list"
            ></input>
            <button
              className="p-1 text-md rounded-md"
              aria-label="clear input"
              onClick={() => setFilter('')}
            >
              <ImCross />
            </button>
          </div>
        </div>
        <nav>
          <ul className="list-reset md:flex md:items-center">
            <li className="md:ml-4 my-2 md:my-0">
              <NavLink
                to="/addItemView"
                style={({ isActive }) => ({
                  fontWeight: isActive ? '700' : '',
                })}
                className="hover:bg-teal-400 mt-4 py-1 px-2 rounded"
              >
                Add an Item
              </NavLink>
            </li>
            <li className="md:ml-4">
              <NavLink
                to="/listView"
                style={({ isActive }) => ({
                  fontWeight: isActive ? '700' : '',
                })}
                className="hover:bg-teal-400 mt-4 py-1 px-2 rounded"
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
