import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { getToken } from '@the-collab-lab/shopping-list-utils';

function Home() {
  const navigate = useNavigate();

  //check for existing token and go to List View if it is there
  useEffect(() => {
    const checkToken = localStorage.getItem('list-token');
    if (checkToken) navigate('/listView');
  });

  const handleNewList = async () => {
    const token = getToken();
    localStorage.setItem('list-token', token);

    //add token to Firestore
    try {
      const docRef = await addDoc(collection(db, 'token'), {
        token,
      });
      navigate('/listView');
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Our Shopping App</p>
        <button onClick={() => handleNewList()}>Create New List</button>
      </header>
    </div>
  );
}

export default Home;
