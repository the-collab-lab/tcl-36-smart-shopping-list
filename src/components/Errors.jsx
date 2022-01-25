import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function Errors({ itemName }) {
  const [list, setList] = useState([]);
  const token = localStorage.getItem('list-token');
  const [error, setError] = useState(null);
  //use effect enables the app to listen for changes to the database and updates the state accordingly

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, token), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setList(snapshotDocs);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, [token]);

  //items = array of objects

  //validation
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
    if (listItem.itemName === itemName) {
      return setError('This item already exists in your shopping list!');
    }
  });

  return <div>{error && <p className="error">Error: {error}</p>}</div>;
}

export default Errors;
