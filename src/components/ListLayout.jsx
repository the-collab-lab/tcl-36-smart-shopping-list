import React, { useEffect, useState, useRef } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ImCross } from 'react-icons/im';

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
  //create a reference for an input
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
    <>
      <label className="" htmlFor="search">
        Filter shopping list
      </label>
      <div className="flex relative text-gray-600 focus-within:text-gray-400">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input
          className="text-black bg-violet-100 p-2 text-md bg-gray-900 rounded-md pl-10"
          type="text"
          id="search"
          ref={inputRef}
          value={filter}
          placeholder="Filter"
          onChange={(e) => setFilter(e.target.value)}
          aria-label="filter the shopping list"
        ></input>
        <button
          className="p-1 text-md rounded-md"
          aria-label="clear input"
          onClick={() => setFilter('')}
        >
          <ImCross />
        </button>
      </div>
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
    </>
  );
};
export default ListLayout;
