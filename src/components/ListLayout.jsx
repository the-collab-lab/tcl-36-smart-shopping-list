import React, { useEffect, useState, useRef } from 'react';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { ImCross } from 'react-icons/im';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import toast, { Toaster } from 'react-hot-toast';

// UPDATED this function to accommodate changes to multiple values on an item object
const setUpdateToDb = async (collection, itemId, dataToUpdate) => {
  const itemRef = doc(db, collection, itemId);
  await updateDoc(itemRef, dataToUpdate);
};
//create a function to delete item from db
const deleteItemFromDb = async (token, itemId) => {
  await deleteDoc(doc(db, token, itemId));
};

const ListLayout = ({ items, localToken }) => {
  const [filter, setFilter] = useState('');
  const [layoutItems, setLayoutItems] = useState(items);

  const [checkedItems, setCheckedItems] = useState([]);

  const oneDay = 86400000; //24 hours in milliseconds
  //create a reference for an input
  const currentTime = Date.now();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    items.forEach((item) => {
      // updates isActive property of item to true if item has 2+ purchases and has been purchased within calculated estimate
      // isActive is defaulted to false when item is added
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
    //loop throught the items list and update item.checked property to true
    //if item was bought within 24 hours gap
    // checked is defaulted to false when item is added
    let newList = [];
    items.forEach((item) => {
      newList.push({ ...item, checked: within24hours(item.purchasedDate) });
    });
    //update layoutItems state to new updated items list
    setLayoutItems(newList);

    //if currentTime or within24hours func. added to dependency array it creates an infinite loop
    //any solutions?
  }, [items, localToken]);

  const handleCheckboxChange = async (e, checkedItem) => {
    if (e.target.checked) {
      checkedItems.push(checkedItem); //push checked item into array  for checkedItems

      setCheckedItems(checkedItems); //update state for checkedItems array

      const updatedList = layoutItems.map((item) => {
        //find checked item in layoutItems list to update it's checked value
        if (item.id === checkedItem.id) {
          item = { ...checkedItem, checked: true };
        }
        return item;
      });
      setLayoutItems(updatedList); //update state for layoutItems list
    } else {
      const filtered = checkedItems.filter(
        //filter checkedItems list to remove checked item from it
        (item) => item.id !== checkedItem.id,
      );

      setCheckedItems(filtered); //update state for checkedItems

      const updatedList = layoutItems.map((item) => {
        //find checked item in layoutItems list to update it's checked value
        if (item.id === checkedItem.id) {
          item = { ...checkedItem, checked: false }; //if checked item was checked before set ckecked value to false
        }
        return item;
      });
      setLayoutItems(updatedList); //update state for layoutItems list
    }
  };
  //update and send data for each ckecked item indo db
  //function invoked when button clicked
  const submitDataToDb = () => {
    checkedItems.forEach((item) => {
      //for each item user checked update data and save it to database
      const dateOfLastTransaction =
        item.totalPurchases > 0 ? item.purchasedDate : item.createdAt;
      const daysSinceLastTransaction =
        (currentTime - dateOfLastTransaction) / oneDay;

      const dataToUpdate = {
        previousEstimate: calculateEstimate(
          item.previousEstimate,
          daysSinceLastTransaction,
          item.totalPurchases,
        ),
        totalPurchases: item.totalPurchases + 1,
        purchasedDate: currentTime,
      };
      // dataToUpdate is sent to Firestore with updated values
      setUpdateToDb(localToken, item.id, dataToUpdate);
    });
    toast.success(
      `${checkedItems.length} checked items was marked as purchased!`,
    );

    setCheckedItems([]); //reset checkedItems state to empty array
  };

  //persists checked box for 24 hours and used to disable a checkbox
  function within24hours(date) {
    let timeCheck = false;
    const gap = currentTime - date;
    if (gap < oneDay) {
      timeCheck = true;
    }
    return timeCheck;
  }

  function deleteButtonPressed(itemId, itemName) {
    if (window.confirm(`Are you sure you want to delete ${itemName}?`)) {
      deleteItemFromDb(localToken, itemId);
    }
  }

  //filters items to only display items a user is searching by via the input bar
  const filteredItems = layoutItems.filter((item) =>
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
      <Toaster />
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
      <button
        style={{
          //ignore button style it will be changed accordingly to list style
          backgroundColor: 'blue',
          color: 'white',
          padding: '2px',
          marginTop: '5px',
        }}
        area-label="submit button to save items as purchased"
        onClick={submitDataToDb}
      >
        Submit checked items
      </button>
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
                          checked={item.checked} //if item was bought within 24 hours gap it should be checked
                          onChange={(e) => handleCheckboxChange(e, item)}
                          name={item.id}
                          aria-label={item.itemName}
                          disabled={within24hours(item.purchasedDate)} //if item was bought within 24 hours gap it should be disabled
                        />
                        <button
                          aria-label={`delete ${item.id} button`}
                          className="bg-blue-500 hover:bg-blue-700 text-white ml-4 font-bold py-1 px-1 rounded"
                          onClick={() =>
                            deleteButtonPressed(item.id, item.itemName)
                          }
                        >
                          <RiDeleteBin6Fill />
                        </button>
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
