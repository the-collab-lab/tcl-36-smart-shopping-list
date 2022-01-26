import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Errors from './Errors';

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
  const [list, setList] = useState([]);
  const token = localStorage.getItem('list-token');
  const [error, setError] = useState(null);
  //use effect enables the app to listen for changes to the database and updates the state accordingly

  //useEffect to setList of items in that user's list
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, token), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setList(snapshotDocs);
    });
    return () => {
      unsubscribe();
    };
  }, [token]);

  //ERRORS: Handle submit needs a way to reject a form item, import list as prop? do list here?
  function duplicateCheck(itemName, list) {
    list.forEach((listItem) => {
      listItem.itemName = listItem.itemName.toLowerCase();
      itemName = itemName.toLowerCase();
      //regex for removing punctuation from firebase item
      listItem.itemName = listItem.itemName.replace(
        /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
        '',
      );
      //regex for removing spaces from firebase item
      listItem.itemName = listItem.itemName.replace(/\s{2,}/g, ' ');
      //regex repeated for form item
      itemName = itemName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      itemName = itemName.replace(/\s{2,}/g, ' ');
      console.log(listItem.itemName, itemName);
      if (listItem.itemName === itemName && !error) {
        return setError('This item already exists in your shopping list!');
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    duplicateCheck(itemName, list);
    try {
      if (error) throw error;
      const docRef = await addDoc(collection(db, token), {
        //data points being sent to firebase, object format
        //should we convert frequency to a number? or send in as a string?
        itemName: itemName,
        frequency: Number(frequency),
        purchasedDate: null,
      });
      setNotification(`Successfully added ${itemName}`);
      setItemName('');
      console.log('Document written with ID: ', docRef.id);
      setTimeout(() => {
        setNotification('');
      }, 2000);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      {error && <Errors error={error} />}
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

          {radioButtonOptions.map((radioBut, index) => (
            <div key={index}>
              <input
                type="radio"
                id={radioBut.option}
                name="frequency"
                value={radioBut.value}
                onChange={(e) => setFrequency(e.target.value)}
                defaultChecked={radioBut.defaultChecked}
              ></input>
              <label htmlFor={radioBut.option}>{radioBut.option}</label>
              <br />
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={!itemName} //button is disabled until user input an item name
          onClick={(e) => handleSubmit(e)}
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItem;
