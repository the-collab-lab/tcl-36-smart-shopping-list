import React, { useEffect, useState } from 'react';

import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

//reusable function to send updates to db
const setUpdateToDb = async (collection, itemId, field, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  const fieldSet = {};
  fieldSet[field] = dataToUpdate;

  await setDoc(itemRef, fieldSet, { merge: true });
};

function ListView() {
  const [items, setItems] = useState([]);
  //loading is false until list is retrieved from database, this value controls the component rendering
  //alternative to load list items at a higher level and pass as props
  const [loading, setLoading] = useState(false);

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

    setLoading(false);
    const unsubscribe = onSnapshot(collection(db, localToken), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => {
        snapshotDocs.push({ ...doc.data(), id: doc.id });
      });
      setItems(snapshotDocs);
      setLoading(true);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, [localToken, navigate]);

  //
  const handleCheckboxChange = async (e) => {
    const itemId = e.target.name;
    //create time variable to save time when user checked the box as purchasedTime
    const datePurchased = Date.now();
    //if user want to uncheck the item it can be done and purchasedDate is set to null again
    if (e.target.checked) {
      setUpdateToDb(localToken, itemId, 'purchasedDate', datePurchased);
    } else {
      setUpdateToDb(localToken, itemId, 'purchasedDate', null);
    }
  };

  //persists checked box for 24 hours
  function within24hours(date) {
    let timeCheck = false;
    const gap = currentTime - date;
    if (gap < hours24gap) {
      timeCheck = true;
    }
    return timeCheck;
  }

  //controls page render to ensure items.length can evaluate after the items have been retrieved from firebase
  if (loading) {
    return (
      <div className="m-20">
        {!items.length ? (
          <Welcome />
        ) : (
          <div>
            <h1 className="text-center text-2xl my-12">Your Shopping List:</h1>
            <ul className="grid grid-cols-2 justify-around">
              {items.map((item, idx) => (
                <li className="flex flex-col my-4" key={idx}>
                  <div>
                    {` Item Name: ${item.itemName}`}{' '}
                    <input
                      type="checkbox"
                      checked={within24hours(item.purchasedDate)}
                      onChange={(e) => handleCheckboxChange(e)}
                      name={item.id}
                      aria-label={item.itemName} //what do we want to call this ('item', 'item.itemName', 'purchased item' .....)
                    />
                  </div>
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
