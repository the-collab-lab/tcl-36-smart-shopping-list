import React, { useEffect, useState } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

function ListView() {
  const [items, setItems] = useState([]);
  //loading is false until list is retrieved from database, this value controls the component rendering
  //alternative to load list items at a higher level and pass as props
  const [loading, setLoading] = useState(false);

  const localToken = localStorage.getItem('list-token');
  const navigate = useNavigate();
  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    if (!localToken) {
      navigate('/');
      return;
    }
    setLoading(false);
    const unsubscribe = onSnapshot(collection(db, localToken), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setItems(snapshotDocs);
      setLoading(true);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, [localToken, navigate]);

  //controls page render to ensure items.length can evaluate after the items have been retrieved from firebase
  if (loading) {
    return (
      <div className="m-20">
        {!items.length ? (
          <Welcome items={items} />
        ) : (
          <div>
            <h1 className="text-center text-2xl my-12">Your Shopping List:</h1>
            <ul className="grid grid-cols-2 justify-around">
              {items.map((item, idx) => (
                <li className="flex flex-col my-4" key={idx}>
                  <div>{` Item Name: ${item.itemName}`}</div>
                  <div>{` Frequency: ${item.frequency}`}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
}

export default ListView;
