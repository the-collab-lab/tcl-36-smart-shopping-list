import React, { useEffect, useState, useRef } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

//reusable function to send updates to db
const setUpdateToDb = async (collection, itemId, field, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  const fieldSet = {};
  fieldSet[field] = dataToUpdate;

  await setDoc(itemRef, fieldSet, { merge: true });
};

const ListLayout = ({ items, localToken }) => {
  const [filter, setFilter] = useState('');

  const currentTime = Date.now();
  const hours24gap = Math.pow(8.64, 7); //24 hours in milliseconds

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  //persists checked box for 24 hours
  function within24hours(date) {
    let timeCheck = false;
    const gap = currentTime - date;
    if (gap < hours24gap) {
      timeCheck = true;
    }
    return timeCheck;
  }

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

  return (
    <div>
      <label htmlFor="search">Filter shopping list</label>
      <input
        className="border"
        type="search"
        id="search"
        ref={inputRef}
        value={filter}
        placeholder=""
        onChange={(e) => setFilter(e.target.value)}
        aria-label="search the shopping list"
      />

      <ul className="grid grid-cols-2 justify-around">
        {items
          .filter((item) => item.id.includes(filter.toLowerCase()))
          .map((item, idx) => (
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
  );
};
export default ListLayout;
