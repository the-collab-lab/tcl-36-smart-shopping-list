import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

function ListView() {
  const [items, setItems] = useState([]);

  const localToken = localStorage.getItem('list-token');
  const navigate = useNavigate();
  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    if (!localToken) {
      navigate('/');
      return;
    }
    const unsubscribe = onSnapshot(collection(db, localToken), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setItems(snapshotDocs);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {!items.length ? (
        <>
          <p>Your shopping list is currently empty.</p>
          <button>Add Item</button>
        </>
      ) : (
        <ul>
          {items.map((item, idx) => (
            <li
              key={idx}
            >{` Name: ${item.itemName}  Frequency: ${item.frequency}`}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListView;
