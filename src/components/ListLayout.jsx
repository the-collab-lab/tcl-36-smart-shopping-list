import React, { useEffect, useState } from 'react';
import { setUpdateToDb, deleteItemFromDb } from '../lib/firebase';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import toast, { Toaster } from 'react-hot-toast';
import { ONE_DAY_IN_MILLISECONDS, isWithin24hours } from '../utilities';
import { itemStatusGroups } from '../configuration';
import Header from './Header';
import GradientFrame from './GradientFrame';

// UI responsible for filtering and displaying items in correct groups based on calculateEstimate algorithm; also handles updating and deleting items from database
const ListLayout = ({ items, localToken }) => {
  const [filter, setFilter] = useState(''); //*
  const [layoutItems, setLayoutItems] = useState(items);

  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    //loop through the items list and update item.checked property to true
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
          item = { ...checkedItem, checked: false }; //if checked item was checked before set checked value to false
        }
        return item;
      });
      setLayoutItems(updatedList); //update state for layoutItems list
    }
  };

  //update and send data for each checked item in db
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
    // tailwindcss classes for styling (flex, text, screen size responsiveness including hiding table headings on mobile)
    <>
      <Header layoutItems={layoutItems} filter={filter} setFilter={setFilter} />
      <Toaster />
      <div className="mx-auto w-5/6 md:w-1/2">
        {itemStatusGroups.map((group, idx) => {
          //groupFilter is a callback that returns true if an item matches the criteria for group category
          const itemsGrouped = filteredItems.filter((item) =>
            group.groupFilter(item),
          );
          return (
            <GradientFrame key={idx} colorClass={group.colorClass}>
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
                        <tr>
                          <th className="p-4 text-gray-600 hidden md:table-cell">
                            item name
                          </th>
                          <th className="p-4 text-gray-600 hidden md:table-cell">
                            purchased
                          </th>
                          <th className="p-4 text-gray-600 hidden md:table-cell">
                            delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          //the matching group items are mapped together in the section they belong
                          itemsGrouped.map((item, idx) => {
                            return (
                              <tr key={item.id} className="h-8">
                                <td>
                                  <label
                                    htmlFor={item.id}
                                  >{`${item.itemName}`}</label>
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="ml-3 mr-6"
                                    checked={item.checked} //if item was bought within 24 hours gap it should be checked
                                    onChange={(e) =>
                                      handleCheckboxChange(e, item)
                                    }
                                    name={item.id}
                                    id={item.id}
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
                    {filter.length > 0
                      ? 'No matching items'
                      : 'No items needed in this time frame'}
                  </p>
                )
              }
            </GradientFrame>
          );
        })}
      </div>
      <div className="text-offWhite bg-teal-700 font-DM-Sans sticky bottom-0 border-t md:flex justify-center p-4 pt-0 shadow-lg md:pt-4 ">
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="purchased" className="text-center">
            Check the items you have purchased today and click 'save purchases'
            to update your list
          </label>
          <button
            className="bg-teal-800 hover:bg-sky-800 font-bold py-2 px-2 rounded md:mx-4"
            area-label="submit button to save items as purchased"
            onClick={submitDataToDb}
          >
            Save Purchases
          </button>
        </div>
      </div>
    </>
  );
};

export default ListLayout;
