import React, { useEffect, useState, useRef } from 'react';
import { setUpdateToDb, deleteItemFromDb } from '../lib/firebase';
import { ImCross } from 'react-icons/im';
// delete button
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import toast, { Toaster } from 'react-hot-toast';
import { ONE_DAY_IN_MILLISECONDS, isWithin24hours } from '../utilities';
import { itemStatusGroups } from '../configuration';
import ListNameCopy from './ListNameCopy';
import ExitList from './ExitList';

const ListLayout = ({ items, localToken }) => {
  const [filter, setFilter] = useState('');
  const [layoutItems, setLayoutItems] = useState(items);

  const [checkedItems, setCheckedItems] = useState([]);

  //create a reference for an input

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    //loop throught the items list and update item.checked property to true
    //if item was bought within 24 hours gap
    // checked is defaulted to false when item is added
    const currentTime = Date.now();

    items.forEach((item) => {
      // updates isActive property of item to true if item has 2+ purchases and has been purchased within calculated estimate
      // isActive is defaulted to false when item is added
      const dateOfLastTransaction =
        item.totalPurchases > 0 ? item.purchasedDate : item.createdAt;
      const daysSinceLastTransaction =
        (currentTime - dateOfLastTransaction) / ONE_DAY_IN_MILLISECONDS;
      if (
        item.totalPurchases > 1 &&
        daysSinceLastTransaction < 2 * item.previousEstimate &&
        item.isActive === false
      ) {
        let itemToUpdate = {
          isActive: true,
        };
        setUpdateToDb(localToken, item.id, itemToUpdate);
      } else if (
        item.totalPurchases > 1 &&
        daysSinceLastTransaction > 2 * item.previousEstimate &&
        item.isActive === true
      ) {
        let itemToUpdate = {
          isActive: false,
        };
        setUpdateToDb(localToken, item.id, itemToUpdate);
      }
    });

    let newList = [];
    items.forEach((item) => {
      newList.push({ ...item, checked: isWithin24hours(item.purchasedDate) });
    });
    //update layoutItems state to new updated items list
    setLayoutItems(newList);
    //if currentTime or within24hours func. added to dependency array it creates an infinite loop
    //any solutions?
  }, [items, localToken]);

  const deleteButtonPressed = (itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete ${itemName}?`)) {
      deleteItemFromDb(localToken, itemId);
    }
  };

  const handleCheckboxChange = (e, checkedItem) => {
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
      const filteredItems = checkedItems.filter(
        //filter checkedItems list to remove checked item from it
        (item) => item.id !== checkedItem.id,
      );

      setCheckedItems(filteredItems); //update state for checkedItems

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
    const currentTime = Date.now();
    checkedItems.forEach((item) => {
      //for each item user checked update data and save it to database
      const dateOfLastTransaction =
        item.totalPurchases > 0 ? item.purchasedDate : item.createdAt;
      const daysSinceLastTransaction =
        (currentTime - dateOfLastTransaction) / ONE_DAY_IN_MILLISECONDS;

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
    toast.success(`${checkedItems.length} checked items marked as purchased!`);

    setCheckedItems([]); //reset checkedItems state to empty array
  };

  //filters items to only display items a user is searching by via the input bar
  const filteredItems = layoutItems.filter((item) =>
    item.id.includes(filter.toLowerCase()),
  );

  return (
    <>
      <Toaster />
      <div className="mx-auto w-5/6 md:w-1/2">
        {/* search and save features */}
        <div className="top-20 sticky flex flex-col md:flex-row justify-between py-2 px-12 bg-sky-100 rounded-3xl text-gray-600 focus-within:text-gray-400">
          <div className="flex flex-col">
            <label htmlFor="purchasede" className="text-gray-500">
              Check items you have purchased today
            </label>
            <button
              className="bg-teal-200 hover:bg-teal-300 text-gray-700 font-bold mt-4 py-1 px-2 rounded"
              area-label="submit button to save items as purchased"
              onClick={submitDataToDb}
            >
              Save Purchases
            </button>
          </div>

          <div style={{ display: 'flex', color: 'white' }}>
            <p>
              Your list name <strong>{localToken}</strong>
            </p>{' '}
            <ListNameCopy copyText={localToken} />
            <ExitList />
          </div>

          <div className="flex flex-col relative">
            <label htmlFor="search" className="text-gray-500 pb-3">
              Search for items
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
                className="text-black bg-white p-2 text-md rounded-md pl-10"
                type="text"
                id="search"
                ref={inputRef}
                value={filter}
                placeholder="search"
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
          </div>
        </div>

        {itemStatusGroups.map((group, idx) => {
          const itemsGrouped = filteredItems.filter((item) =>
            //groupFilter is a callback that returns true if an item matches the criteria for group category
            group.groupFilter(item),
          );
          return (
            <section
              key={idx}
              className={`rounded-3xl p-2 md:p-12 ${group.colorClass} mt-6`}
            >
              <div className="flex flex-col md:flex-row justify-between border-b-2">
                <h1 className="text-xl font-semibold text-blue-700">
                  {group.label}
                </h1>
                <p className="text-gray-500">{group.sublabel}</p>
              </div>
              {
                //this checks if the group has any items
                itemsGrouped.length > 0 ? (
                  <details open>
                    <summary className="text-gray-500">Toggle List</summary>
                    <table className="table-fixed text-center mx-auto">
                      <thead>
                        <th className="p-4 text-gray-600 hidden md:table-cell">
                          item name
                        </th>
                        <th className="p-4 text-gray-600 hidden md:table-cell">
                          purchased
                        </th>
                        <th className="p-4 text-gray-600 hidden md:table-cell">
                          delete
                        </th>
                      </thead>
                      <tbody>
                        {
                          //the matching group items are mapped together in the section they belong
                          itemsGrouped.map((item, idx) => {
                            return (
                              <tr className="h-8">
                                <td>{`${item.itemName}`}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="ml-3 mr-6"
                                    checked={item.checked} //if item was bought within 24 hours gap it should be checked
                                    onChange={(e) =>
                                      handleCheckboxChange(e, item)
                                    }
                                    name={item.id}
                                    aria-label={item.itemName}
                                    disabled={isWithin24hours(
                                      item.purchasedDate,
                                    )} //if item was bought within 24 hours gap it should be disabled
                                  />
                                </td>
                                <td>
                                  <button
                                    aria-label={`delete ${item.id} button`}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 rounded"
                                    onClick={() =>
                                      deleteButtonPressed(
                                        item.id,
                                        item.itemName,
                                      )
                                    }
                                  >
                                    <RiDeleteBin6Fill />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </table>
                  </details>
                ) : (
                  <p className="text-gray-500">
                    No items needed in this time frame
                  </p>
                )
              }
            </section>
          );
        })}
      </div>
    </>
  );
};

export default ListLayout;
