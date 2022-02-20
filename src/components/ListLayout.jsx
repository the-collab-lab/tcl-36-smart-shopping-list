import React, { useEffect, useState, useRef } from 'react';
import { updateDoc, doc } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { ImCross } from 'react-icons/im';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';

// UPDATED this function to accommodate changes to multiple values on an item object
const setUpdateToDb = async (collection, itemId, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  await updateDoc(itemRef, dataToUpdate);
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

  // updates isActive property of item to true if item has 2+ purchases and has been purchased within calculated estimate
  // isActive is defaulted to false when item is added
  useEffect(() => {
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
          isActive: true,
        };
        setUpdateToDb(localToken, item.id, itemToUpdate);
      }
    });
    //suggested dependency array via React and I agree with the suggestion if anyone has thoughts on this please let me know!
  }, [items, localToken, currentTime]);

  //filters items to only display items a user is searching by via the input bar
  const filteredItems = items.filter((item) =>
    item.id.includes(filter.toLowerCase()),
  );

  const groups = [
    {
      label: 'Soon',
      sublabel: "We think you'll need this in less than 7 days",
      groupFilter: (item) => {
        return item.previousEstimate < 7 && item.isActive === true;
      },
      colorClass: 'bg-rose-100',
    },
    {
      label: 'Kind of soon',
      sublabel: "We think you'll need this in less than 30 days",
      groupFilter: (item) => {
        return (
          item.previousEstimate >= 7 &&
          item.previousEstimate < 30 &&
          item.isActive === true
        );
      },
      colorClass: 'bg-yellow-100',
    },
    {
      label: 'Not soon',
      sublabel: "We think you'll need this in more than 30 days",
      groupFilter: (item) => {
        return item.previousEstimate >= 30 && item.isActive === true;
      },
      colorClass: 'bg-green-100',
    },
    {
      label: 'Inactive',
      sublabel: "This item is inactive and hasn't been purchased recently",
      groupFilter: (item) => {
        return item.isActive === false;
      },
      colorClass: 'bg-gray-200',
    },
  ];

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
      {
        // have attempted some logic to hide the group if there are no items in that group
        // need to access items first before groups probably doing filter and map first with groups.map nested inside *refactoring item*
        groups.map((group, idx) => (
          <section
            key={idx}
            className={`rounded-3xl p-12 ${group.colorClass} mt-6`}
          >
            <div className="flex justify-between border-b-2">
              <h1 className="text-xl font-semibold text-blue-700">
                {group.label}
              </h1>
              <p className="text-gray-500">{group.sublabel}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-around">
              {filteredItems
                //groupFilter is a callback that returns true if an item matches the criteria for group category
                .filter((item) => group.groupFilter(item))
                //the matching group items are then mapped together in the section they belong
                .map((item, idx) => {
                  return (
                    <li className={`flex flex-col py-4`} key={idx}>
                      <div className="flex">
                        <h4 className="px-4">{`Item Name: ${item.itemName}`}</h4>
                        <input
                          type="checkbox"
                          checked={within24hours(item.purchasedDate)}
                          onChange={(e) => handleCheckboxChange(e)}
                          name={item.id}
                          aria-label={item.itemName}
                        />
                      </div>
                      <div className="px-4">{` Time until next purchase: ${item.previousEstimate}`}</div>
                      <div className="px-4">{` Total purchases: ${item.totalPurchases}`}</div>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))
      }
    </>
  );
};
export default ListLayout;
