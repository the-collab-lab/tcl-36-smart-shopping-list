import React from 'react';
import { ImExit } from 'react-icons/im';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

// UI to 'log out' a user; clears local storage token to allow a user to return back to home page
const ExitList = () => {
  const navigate = useNavigate();

  const exitList = () => {
    if (
      window.confirm(
        'Are you sure you want to leave current shopping list? Make sure you copied and saved list to come back.',
      )
    ) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <>
      <IconContext.Provider value={{ color: 'tomato', size: '1.4em' }}>
        <button
          onClick={exitList}
          aria-label="button to exit current list"
          className="hover:text-tomato text-xl flex flex-row items-center whitespace-pre "
        >
          <ImExit /> Logout
        </button>
      </IconContext.Provider>
    </>
  );
};
export default ExitList;
