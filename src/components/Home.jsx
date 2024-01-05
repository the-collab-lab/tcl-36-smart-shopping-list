import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
// import { getToken } from '@the-collab-lab/shopping-list-utils';
import toast, { Toaster } from 'react-hot-toast';
import LearnMoreModal from './LearnMoreModal';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

// Landing page for app with buttons to start new list, join list, or open learn more modal
function Home() {
  const [userToken, setUserToken] = useState('');
  const [showJoinListForm, setShowJoinListForm] = useState(false);
  const navigate = useNavigate();

  //check for existing token and go to List View if it is there
  useEffect(() => {
    const checkToken = localStorage.getItem('list-token');
    if (checkToken) navigate('/listView');
  }, [navigate]);

  const handleNewList = async () => {
    console.log('Creating new lists is disabled');
    // const token = getToken();
    // localStorage.setItem('list-token', token);

    //add token to Firestore under 'token' collection
    // try {
    //   const docRef = await addDoc(collection(db, 'token'), {
    //     token,
    //   });
    //   navigate('/listView');
    //   console.log('Document written with ID: ', docRef.id);
    // } catch (e) {
    //   console.error('Error adding document: ', e);
    // }
  };

  const handleTokenSubmit = async () => {
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

  const joinListForm = () => {
    return (
      // tailwindcss classes for styling (background, borders, padding, focus, text color)
      <>
        <form className="w-full max-w-sm mt-6 row-start-4 row-span-2">
          <div className="md:flex md:items-center mb-3">
            <div className="md:w-2/3">
              <input
                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                id="userToken"
                name="userToken"
                value={userToken}
                onChange={(e) =>
                  setUserToken(e.target.value.toLocaleLowerCase())
                }
                placeholder="Enter Code"
                type="text"
              />
            </div>
          </div>
          <div className="md:flex md:items-center">
            <div className="md:w-2/3 space-x-2">
              <button
                aria-label="submit"
                className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={handleTokenSubmit}
                type="button"
              >
                Submit
              </button>
              <button
                aria-label="cancel"
                className="mx-auto lg:mx-0 bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
                onClick={() => setShowJoinListForm(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  const showButtons = () => {
    return (
      <div className="flex">
        <button
          aria-label="get started button"
          className="bg-white mr-2 text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          onClick={handleNewList}
        >
          Get Started
        </button>
        <button
          aria-label="join list button"
          onClick={() => setShowJoinListForm(true)}
          className="bg-white mr-2 text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalScrollable"
        >
          Join List
        </button>
        <LearnMoreModal />
      </div>
    );
  };

  return (
    <div className="ml-0 leading-normal tracking-normal text-white h-auto">
      <Toaster />
      <div className="mt-12">
        <div className="md:items-center container px-3 mx-auto flex flex-wrap flex-col lg:flex-row items-center justify-between">
          <div className="grid grid-rows-5 flex-col w-full md:w-1/2 justify-center items-start text-center md:text-left">
            <h1 className="self-end my-4 text-6xl font-bold leading-tight font-Staatliches">
              Smart Shopper
            </h1>
            <p className="leading-normal text-2xl mb-8 font-Staatliches">
              Spend less time on lists, and more time shopping smarter.
            </p>
            {showButtons()}
            {showJoinListForm && joinListForm()}
          </div>
          <div className="w-full md:w-1/2 py-6 text-center order-first lg:order-last">
            <img
              className="w-full md:w-4/5 rounded-3xl shadow-2xl"
              src="img/shopping-cart-logo.jpg"
              alt="shopping cart logo"
            />
          </div>
        </div>
      </div>
      <ArchivalNoticeModal />
    </div>
  );
}

export default Home;
