import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

function ListView() {
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

  return (
    <div>
      List View
      <div className="App">
        <ul>
          {items.map((item, idx) => (
            <li
              key={idx}
            >{` Name: ${item.itemName}  Frequency: ${item.frequency}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListView;
