import React from 'react';
import { ImExit } from 'react-icons/im';
import { IconContext } from 'react-icons';
import { useNavigate } from 'react-router-dom';

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
    <IconContext.Provider value={{ color: 'tomato', size: '1.2em' }}>
      <button
        onClick={exitList}
        aria-label="button to exit current list"
        style={{ paddingLeft: '10px' }}
      >
        <ImExit />
      </button>
    </IconContext.Provider>
  );
};
export default ExitList;
