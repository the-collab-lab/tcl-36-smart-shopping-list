import React, { useEffect, useState } from 'react';

import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function ListView() {
  const [itemText, setItemText] = useState('');
  const [items, setItems] = useState([]);

  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setItems(snapshotDocs);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, []);

  //handle submit for the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    //create new doc reference for text input and save to firestore database
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        itemText,
      });
      setItemText('');
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };
  //updating state for the input box
  function handleChange(e) {
    setItemText(e.target.value);
  }

  return (
    <div>
      List View
      <div className="App">
        <div>
          <form method="post">
            <input
              type="text"
              placeholder="New item"
              name="item"
              value={itemText}
              onChange={(e) => handleChange(e)}
            />
            <button type="submit" onClick={(e) => handleSubmit(e)}>
              Click this button to send data!
            </button>
          </form>
          {items.map((item, idx) => (
            <div key={idx}>{item.itemText}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ListView;
