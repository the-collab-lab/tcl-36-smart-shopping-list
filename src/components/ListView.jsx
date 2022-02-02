import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

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
    <div className="m-20">
      <h1 className="text-center text-2xl my-12">Your Shopping List:</h1>
      <ul className="grid grid-cols-2 justify-around">
        {items.map((item, idx) => (
          <li className="flex flex-col my-4" key={idx}>
            <div>{` Item Name: ${item.itemName}`}</div>
            <div>{` Frequency: ${item.frequency}`}</div>
          </li>
        ))}
      </ul>
      <Welcome items={items} />
    </div>
  );
}

export default ListView;
