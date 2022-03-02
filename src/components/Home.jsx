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
    <div className="leading-normal tracking-normal text-white h-auto">
      <div className="pt-12">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div class="flex flex-col w-full md:w-3/6 justify-center items-start text-center md:text-left">
            <h1 class="my-4 text-6xl font-bold leading-tight font-Staatliches">
              Smart Shopper
            </h1>
            <p className="leading-normal text-2xl mb-8 font-Staatliches">
              Spend less time on lists, and more time shopping smarter.
            </p>
            <div className="flex space-x-2">
              <button
                className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={handleNewList}
              >
                Get Started
              </button>
              <button
                onClick={() => console.log('woo')}
                className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Join List
              </button>
              <button
                onClick={() => console.log('woooo!')}
                className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="w-full md:w-3/6 py-6 text-center">
            <img
              className="w-full md:w-4/5 rounded-3xl shadow-2xl"
              src="img/shopping-cart-logo.jpg"
              alt="shopping cart logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
