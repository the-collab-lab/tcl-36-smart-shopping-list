import React, { useEffect, useState, useRef } from 'react';
import { updateDoc, doc } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { ImCross } from 'react-icons/im';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

// UPDATED this function to accommodate changes to multiple values on an item object
const setUpdateToDb = async (collection, itemId, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  await updateDoc(itemRef, dataToUpdate);
  console.log('await finished');
};

const ListLayout = ({ items, localToken }) => {
  const [filter, setFilter] = useState('');

  const currentTime = Date.now();
  const oneDay = 86400000; //24 hours in milliseconds
  //create a reference for an input
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleCheckboxChange = async (e) => {
    const itemId = e.target.name;
    // grabbing the specific item from state that is clicked because we will be updating its properties
    let itemToUpdate = items.find((item) => itemId === item.id);

    const dateOfLastTransaction =
      itemToUpdate.totalPurchases > 0
        ? itemToUpdate.purchasedDate
        : itemToUpdate.createdAt;
    const daysSinceLastTransaction =
      (currentTime - dateOfLastTransaction) / oneDay;

    // if user checks a box, itemToUpdate is taken through this flow
    if (e.target.checked) {
      itemToUpdate = {
        previousEstimate: calculateEstimate(
          itemToUpdate.previousEstimate,
          daysSinceLastTransaction,
          itemToUpdate.totalPurchases,
        ),
        totalPurchases: itemToUpdate.totalPurchases + 1,
        purchasedDate: currentTime,
      };
      // itemToUpdate is sent to Firestore with updated values
      setUpdateToDb(localToken, itemId, itemToUpdate);
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

  //this sorts by previousEstimate (calculation of when user will buy the item again) Note: items is already sorted alphabetically by item Id which is the normalized item name
  items.sort((itemA, itemB) => itemA.previousEstimate - itemB.previousEstimate);

  // updates isActive property of item to true if item has 2+ purchases and has been purchased within calculated estimate
  // isActive is defaulted to false when item is added
  items.forEach((item) => {
    const dateOfLastTransaction =
      item.totalPurchases > 0 ? item.purchasedDate : item.createdAt;
    const daysSinceLastTransaction =
      (currentTime - dateOfLastTransaction) / oneDay;
    if (
      item.totalPurchases > 1 &&
      daysSinceLastTransaction < 2 * item.previousEstimate
    ) {
      let itemToUpdate = {
        ...item,
        isActive: true,
      };
      setUpdateToDb(localToken, item.id, itemToUpdate);
    }
  });

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
              <div>{` Frequency: ${item.previousEstimate}`}</div>
            </li>
          ))}
      </ul>
    </>
  );
};
export default ListLayout;
