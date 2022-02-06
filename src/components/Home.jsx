import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getToken } from '@the-collab-lab/shopping-list-utils';
import toast, { Toaster } from 'react-hot-toast';

function Home() {
  const [userToken, setUserToken] = useState('');

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

    const querySnapshot = await getDocs(q);

    //set token in local storage if it exists in firebase firestore
    if (querySnapshot.docs.length) {
      localStorage.setItem('list-token', userToken);
      navigate('/listView');
    } else {
      toast.error('The token does not exist. try again or create a new list');
      setUserToken('');
      console.log(`'${userToken}' token does not exist...`);
    }
  };

  return (
    <div className="App">
      <main className="App-header">
        <Toaster />
        <p>Our Shopping App</p>
        <button onClick={handleNewList}>Create a New List</button>
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
          onChange={(e) => setUserToken(e.target.value.toLowerCase())}
        ></input>
        <button
          type="submit"
          disabled={!userToken} //button is disabled until user input an item name
          onClick={handleTokenSubmit}
        >
          Join an existing list
        </button>
      </main>
    </div>
  );
}

export default Home;
