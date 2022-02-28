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
    <div className="text-center w-1/2 mx-auto">
      <main className="flex flex-col flex-justify items-center text-white p-6 rounded-3xl border-8 border-teal-500">
        <Toaster />
        <p className="text-2xl mb-4">Welcome to Smart Shopper.</p>
        <p className="text-2xl mb-4">The app that learns how you shop!</p>
        <button
          className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-semibold py-1 px-4 border border-gray-400 rounded shadow w-1/2"
          onClick={handleNewList}
        >
          Create a New List
        </button>
        <div>
          <p className="mt-10 mb-4 text-2xl">
            Join an existing list by entering its three-word token.
          </p>
        </div>
        <label className="text-xl" htmlFor="userToken">
          Enter List Token:
        </label>
        <input
          type="text"
          id="userToken"
          name="userToken"
          className=" w-1/2"
          value={userToken}
          onChange={(e) => setUserToken(e.target.value.toLowerCase())}
        ></input>
        <button
          type="submit"
          className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-semibold mt-4 py-1 px-4 border border-gray-400 rounded shadow w-1/2"
          disabled={!userToken} //button is disabled until user input an item name
          onClick={handleTokenSubmit}
        >
          Join an Existing List
        </button>
      </main>
    </div>
  );
}

export default Home;
