import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const radioButtonOptions = [
  {
    option: 'soon',
    value: 7,
    defaultChecked: true,
  },
  {
    option: 'kind of soon',
    value: 14,
    defaultChecked: false,
  },
  {
    option: 'not soon',
    value: 30,
    defaultChecked: false,
  },
];

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [frequency, setFrequency] = useState(7);
  const [notification, setNotification] = useState('');

  const navigate = useNavigate();

  //retrive the token from localStorage
  const localToken = localStorage.getItem('list-token');

  useEffect(() => {
    if (!localToken) {
      navigate('/');
      return;
    }
  });

  //handle submit for the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    //create new doc reference for text input and save to firestore database
    //use a token to save new items into specific collection (shopping list)
    try {
      const docRef = await addDoc(collection(db, localToken), {
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
      <br />
      {notification}
      <br />
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
          disabled={!itemName} //button is disabled until user input an item name
          onClick={handleSubmit}
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
