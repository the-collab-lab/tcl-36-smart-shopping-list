import React, { useEffect, useState } from 'react';

import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

//we need an advice how we can pass a field name as a varible
//so we can reuse this function to update any field in fireBase

/* const setUpdateToDb = async (localToken, itemId, field, dataToUpdate) => {
  const itemRef = doc(db, localToken, itemId);
  await setDoc(
    itemRef,
    {
      field: dataToUpdate,
    },
    { merge: true },
    );
  }; */

function ListView() {
  const [items, setItems] = useState([]);

  const currentTime = Date.now();
  const hours24gap = Math.pow(8.64, 7); //24 hours in milliseconds

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
      snapshot.forEach((doc) => {
        snapshotDocs.push({ ...doc.data(), id: doc.id });
      });
      setItems(snapshotDocs);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, [localToken, navigate]);

  //
  const handleCheckboxChange = async (e) => {
    const itemId = e.target.name;
    const itemRef = doc(db, localToken, itemId);
    //create time variable to save time when user checked the box as purchasedTime
    const datePurchased = Date.now();
    //if user want to uncheck the item it can be done and purchasedDate is set to null again
    if (e.target.checked) {
      await setDoc(
        itemRef,
        {
          purchasedDate: datePurchased,
        },
        { merge: true },
      );
    } else {
      await setDoc(
        itemRef,
        {
          purchasedDate: null,
        },
        { merge: true },
      );
    }
  };

  //persists checked box for 24 hours
  function within24hours(date) {
    let timeCheck = false;
    const gap = currentTime - date;
    if (gap < hours24gap) {
      timeCheck = true;
      return timeCheck;
    }
    return timeCheck;
  }

  return (
    <div>
      Your Shopping List:
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            <input
              type="checkbox"
              checked={within24hours(item.purchasedDate)}
              onChange={(e) => handleCheckboxChange(e)}
              name={item.id}
              aria-label="item" //what do we want to call this ('item', 'item.itemName', 'purchased item' .....)
            />{' '}
            {` ${item.itemName} `}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListView;
