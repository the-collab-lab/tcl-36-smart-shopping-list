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
  const [duplicateMessage, setDuplicateMessage] = useState(null);

  const localToken = localStorage.getItem('list-token');

  //useEffect to setList of items in that user's list which will be used for duplicate comparison
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, localToken), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setList(snapshotDocs);
    });
    return () => {
      unsubscribe();
    };
  }, [localToken]);

  //duplicate item? sets isDuplicateFound to true, otherwise false
  //isDuplicateFound boolean gates form submission to database
  function duplicateCheck(itemName, list) {
    let isDuplicateFound = false;
    list.forEach((listItem) => {
      listItem.itemName = listItem.itemName.toLowerCase();
      itemName = itemName.toLowerCase();
      //regex for removing punctuation and .split/.join to remove spaces from firebase item and form input item
      listItem.itemName = listItem.itemName
        .replace(/[^\w\s]|_/g, '')
        .split(' ')
        .join('');
      listItem.itemName = listItem.itemName
        .replace(/[^\w\s]|_/g, '')
        .split(' ')
        .join('');
      itemName = itemName
        .replace(/[^\w\s]|_/g, '')
        .split(' ')
        .join('');
      itemName = itemName
        .replace(/[^\w\s]|_/g, '')
        .split(' ')
        .join('');
      if (listItem.itemName === itemName) {
        return (isDuplicateFound = true);
      }
    });
    return isDuplicateFound;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isDuplicateFound = duplicateCheck(itemName, list);
    if (isDuplicateFound) {
      // sets Error message if duplicateCheck results in isDuplicateFound === true
      // if isDuplicateFound returns, preventing item from being written to db
      setDuplicateMessage(`${itemName} already exists in your list!`);
      return;
    } else {
      setDuplicateMessage();
    }
    try {
      const docRef = await addDoc(collection(db, localToken), {
        itemName: itemName,
        frequency: Number(frequency),
        purchasedDate: null,
      });
      setNotification(`Successfully added ${itemName}`);
      setItemName('');
      console.log('Document written with ID: ', docRef.id, itemName);
      setTimeout(() => {
        setNotification('');
      }, 8000);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      {duplicateMessage && <Errors message={duplicateMessage} />}
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
