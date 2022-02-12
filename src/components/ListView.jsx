import React, { useEffect, useState } from 'react';

import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

// UPDATED this function to accommodate changes to multiple values on an item object
const setUpdateToDb = async (collection, itemId, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  await updateDoc(itemRef, dataToUpdate);
};

function ListView() {
  const [items, setItems] = useState([]);
  //loading is false until list is retrieved from database, this value controls the component rendering
  //alternative to load list items at a higher level and pass as props
  const [loading, setLoading] = useState(false);

  const currentTime = Date.now();
  const oneDay = Math.pow(8.64, 7); //24 hours in milliseconds

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
    // grabbing the specific item from state that is clicked because we will be updating its properties
    const itemToUpdate = items.find((item) => itemId === item.id);

    let daysSinceLastTransaction;

    // if user checks a box, itemToUpdate is taken through this flow
    if (e.target.checked) {
      // check to see if the item has never been purchased before (purchasedDate is set to null by default)
      if (!itemToUpdate.purchasedDate) {
        daysSinceLastTransaction =
          (currentTime - itemToUpdate.createdAt) / oneDay;
        // this is the util function we imported
        itemToUpdate.newEstimate = calculateEstimate(
          itemToUpdate.previousEstimate,
          daysSinceLastTransaction,
          itemToUpdate.totalPurchases,
        );
        // increment totalPurchases/purchasedDate
        itemToUpdate.totalPurchases++;
        itemToUpdate.purchasedDate = currentTime;

        // itemToUpdate is sent to Firestore with updated values
        setUpdateToDb(localToken, itemId, itemToUpdate);
      } else {
        // basically this is the same flow as above, but will run if the item has been purchased before
        daysSinceLastTransaction =
          (currentTime - itemToUpdate.purchasedDate) / oneDay;
        itemToUpdate.newEstimate = calculateEstimate(
          itemToUpdate.previousEstimate,
          daysSinceLastTransaction,
          itemToUpdate.totalPurchases,
        );
        itemToUpdate.totalPurchases++;
        itemToUpdate.purchasedDate = currentTime;

        setUpdateToDb(localToken, itemId, itemToUpdate);
      }
    } else {
      // TODO: We should think through what happens if a user wants to uncheck an item...
      console.log('heyyyyyy');
    }
  };

  //persists checked box for 24 hours
  function within24hours(date) {
    let timeCheck = false;
    const gap = currentTime - date;
    if (gap < oneDay) {
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
                  <div>{` Frequency: ${item.previousEstimate}`}</div>
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
