import React, { useState } from 'react';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [notification, setNotification] = useState('');

  //handle submit for the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    //create new doc reference for text input and save to firestore database
    //at later point will want to change collection(db, "items") to collecton(db, token) to send items to a specific collection separated by token names
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        //data points being sent to firebase, object format
        //should we convert frequency to a number? or send in as a string?
        itemName: itemName,
        frequency: Number(frequency),
        purchasedDate: null,
      });
      setNotification(`Successfully added ${itemName}`);
      setItemName('');
      console.log('Document written with ID: ', docRef.id);
      //setTimeout is used to clear the success notification after 2 seconds
      setTimeout(() => {
        setNotification('');
      }, 2000);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <div>
      <br></br>
      {notification}
      <br></br>
      <form method="post">
        <label htmlFor="itemName">Item Name:</label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        ></input>
        <fieldset>
          <legend>Choose how soon you will buy this again</legend>
          <input
            type="radio"
            id="soon"
            name="frequency"
            value={7}
            onChange={(e) => setFrequency(e.target.value)}
            defaultChecked
          ></input>
          <label htmlFor="soon">soon</label>
          <br></br>
          <input
            type="radio"
            id="kind of soon"
            name="frequency"
            value={14}
            onChange={(e) => setFrequency(e.target.value)}
          ></input>
          <label htmlFor="kind of soon">kind of soon</label>
          <br></br>
          <input
            type="radio"
            id="not soon"
            name="frequency"
            value={30}
            onChange={(e) => setFrequency(e.target.value)}
          ></input>
          <label htmlFor="not soon">not soon</label>
          <br></br>
        </fieldset>
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
