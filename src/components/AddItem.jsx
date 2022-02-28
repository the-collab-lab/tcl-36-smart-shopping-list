import React, { useState, useEffect, useRef } from 'react';
import { getDoc, doc, setDoc } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { normalizeItemName } from '../utilities';
import { radioButtonOptions } from '../configuration';
import Navigation from './Navigation';

//duplicate item? sets isDuplicateFound to true, otherwise false
//isDuplicateFound boolean gates form submission to database
async function duplicateCheck(localToken, itemNameNormalized) {
  let isDuplicateFound = false;
  //create a reference to the item in firestore inside localToken collection
  const itemRef = doc(db, localToken, itemNameNormalized);
  //send request to get the item
  const docSnap = await getDoc(itemRef);
  if (docSnap.exists()) {
    //if the item found in the collection .exists() method returns 'true'
    return (isDuplicateFound = true);
  }
  return isDuplicateFound;
}

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  //retrieve the token from localStorage
  const localToken = localStorage.getItem('list-token');
  //save normalized users input to use as an unique key
  const itemNameNormalized = normalizeItemName(itemName);

  useEffect(() => {
    if (!localToken) {
      navigate('/');
      return;
    }
    inputRef.current.focus();
  }, [localToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isDuplicateFound = await duplicateCheck(
      localToken,
      itemNameNormalized,
    );

    if (isDuplicateFound) {
      // sets Error message if duplicateCheck results in isDuplicateFound === true
      // if isDuplicateFound returns, preventing item from being written to db
      toast.error(
        `${itemNameNormalized} already exists in your list under the name ${itemName}!`,
      );

      return;
    }
    try {
      // Add a new document/item in collection/localToken under normalized item name  (use it as unique id)
      await setDoc(doc(db, localToken, itemNameNormalized), {
        createdAt: Date.now(),
        itemName,
        previousEstimate: Number(frequency),
        purchasedDate: null,
        totalPurchases: 0,
        isActive: false,
      });
      toast.success(`Successfully added ${itemName}`);

      setItemName('');
      console.log('Document written with ID: ', itemNameNormalized, itemName);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container flex w-1/2 mx-auto p-8 rounded-3xl border-8 border-teal-500 bg-white">
        <form method="post">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            ref={inputRef}
            value={itemName}
            className="ml-2 mb-4 border rounded"
            onChange={(e) => setItemName(e.target.value)}
          ></input>

          <fieldset>
            <legend>Choose how soon you will buy this again</legend>

            {radioButtonOptions.map((radioBtn, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={radioBtn.option}
                  name="frequency"
                  value={radioBtn.value}
                  onChange={(e) => setFrequency(e.target.value)}
                  defaultChecked={radioBtn.defaultChecked}
                ></input>
                <label htmlFor={radioBtn.option}>{radioBtn.option}</label>
                <br />
              </div>
            ))}
          </fieldset>

          <button
            type="submit"
            className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-bold mt-4 py-1 px-2 rounded"
            disabled={!itemName} //button is disabled until user input an item name
            onClick={handleSubmit}
          >
            Add Item
          </button>
        </form>
      </div>
      <Navigation />
    </>
  );
}

export default AddItem;
