import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

import { getToken } from '@the-collab-lab/shopping-list-utils';

function Home() {
  const [userToken, setUserToken] = useState('');
  const [notification, setNotification] = useState('');

  const navigate = useNavigate();

  //check for existing token and go to List View if it is there
  useEffect(() => {
    const checkToken = localStorage.getItem('list-token');
    if (checkToken) navigate('/listView');
  }, [navigate]);

  const handleNewList = async () => {
    const token = getToken();
    localStorage.setItem('list-token', token);

    //add token to Firestore under 'token' collection
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

  const handleTokenSubmit = async () => {
    //create query for token collection in firestore
    const q = query(collection(db, 'token'), where('token', '==', userToken));

    //set token in local storage if it exists
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      localStorage.setItem('list-token', doc.data().token);
    });

    const localToken = localStorage.getItem('list-token');
    if (localToken) {
      navigate('/listView');
    } else {
      setNotification(
        'The token does not exist. try again or create a new list',
      );
      setUserToken('');
      //setTimeout is used to clear the notification after 2 seconds
      setTimeout(() => {
        setNotification('');
      }, 2000);
      console.log(`'${userToken}' token does not exist...`);
    }
  };

  return (
    <div className="App">
      <main className="App-header">
        <p>Our Shopping App</p>
        <button onClick={() => handleNewList()}>Create a New List</button>
        <div>
          <p>--Or--</p>
          <p>Join an Existing List by Entering Three Word Token</p>
        </div>
        <label htmlFor="userToken">List Token:</label>
        <input
          type="text"
          id="userToken"
          name="userToken"
          value={userToken}
          onChange={(e) => setUserToken(e.target.value)}
        ></input>
        <button
          type="submit"
          disabled={!userToken} //button is disabled until user input an item name
          onClick={(e) => handleTokenSubmit(e)}
        >
          Join an existing list
        </button>
        {notification}
      </main>
    </div>
  );
}

export default Home;
