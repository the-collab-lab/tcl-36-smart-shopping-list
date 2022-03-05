import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  /*
    <header className="sticky top-0 mx-auto my-4">
      <h2 className="text-center bg-sky-700 font-Karma text-white text-5xl p-6">
        Smart Shopper
      </h2>
    </header>*/
  return (
    <header class="border-b md:flex md:items-center md:justify-between p-4 pb-0 shadow-lg md:pb-4">
      <div class="flex items-center justify-between mb-4 md:mb-0">
        <h1 class="leading-none text-2xl text-grey-darkest">
          <Link class="no-underline text-grey-darkest hover:text-black" to="#">
            Site Title
          </Link>
        </h1>

        <Link class="text-black hover:text-orange md:hidden" to="#">
          <i class="fa fa-2x fa-bars"></i>
        </Link>
      </div>
      <form class="mb-4 w-full md:mb-0 md:w-1/4">
        <label class="hidden" for="search-form">
          Search
          <input
            class="bg-grey-lightest border-2 focus:border-orange p-2 rounded-lg shadow-inner w-full"
            placeholder="Search"
            type="text"
          ></input>
          <button class="hidden">Submit</button>
        </label>
      </form>
      <nav>
        <ul class="list-reset md:flex md:items-center">
          <li class="md:ml-4">
            <Link
              class="block no-underline hover:underline py-2 text-grey-darkest hover:text-black md:border-none md:p-0"
              to="#"
            >
              Products
            </Link>
          </li>
          <li class="md:ml-4">
            <Link
              class="border-t block no-underline hover:underline py-2 text-grey-darkest hover:text-black md:border-none md:p-0"
              to="#"
            >
              About
            </Link>
          </li>
          <li class="md:ml-4">
            <Link
              class="border-t block no-underline hover:underline py-2 text-grey-darkest hover:text-black md:border-none md:p-0"
              to="#"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
