import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <>
      <h1 className="font-Karma text-black text-center text-4xl my-4">
        Welcome to ~name of app here~
      </h1>

      <div className="rounded-xl w-1/2 mx-auto  mt-10 bg-gradient-to-r p-4 from-orange-500 via-yellow-500 to-orange-500">
        <div className="flex flex-col justify-between  py-20 bg-white text-white rounded-lg p-4">
          <div className="text-black mx-auto bg-white transform transition duration-500 hover:scale-110 hover:bg-orange-500 font-semibold py-2 px-4 border border-2 border-gradient-to-t from-yellow-600 to-orange-600 via-yellow-600 rounded shadow text-center md:w-1/4">
            <Link to="/addItemView">Start Your List</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
