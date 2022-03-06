import React from 'react';
import { Link } from 'react-router-dom';

// UI displayed to user if a list does not have any items yet
function Welcome() {
  return (
    <>
      <h1 className="font-Karma text-white text-center text-4xl my-4">
        Welcome!
      </h1>

      <div className="rounded-xl w-3/4 md:w-1/2 mx-auto  mt-10 bg-gradient-to-r p-4 from-teal-500 via-teal-600 to-teal-500">
        <div className="flex flex-col justify-between  py-20 bg-white text-white rounded-lg p-4">
          <div className="text-black mx-auto bg-white transform transition duration-500 hover:scale-110 hover:bg-amber-300 font-semibold py-2 px-4 border border-2 border-gradient-to-t from-amber-600 to-amber-600 via-amber-600 rounded shadow text-center md:w-1/4">
            <Link to="/addItemView">Start Your List</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
