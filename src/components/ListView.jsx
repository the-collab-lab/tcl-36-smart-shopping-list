import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function ListView() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('list-token');

  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, token), (snapshot) => {
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
      Your Shopping List:
      <ul>
        {items.map((item, idx) => (
          <li
            key={idx}
          >{` Name: ${item.itemName}  Frequency: ${item.frequency}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListView;
