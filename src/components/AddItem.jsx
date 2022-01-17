import React from 'react';

function AddItem() {
  return (
    <form>
      <label htmlFor="itemName">Item Name:</label>
      <input type="text" id="itemName" name="itemName"></input>

      <fieldset>
        <legend>Choose how soon you will buy this again </legend>
        <input
          type="radio"
          id="soon"
          name="frequency"
          value="soon"
          checked
        ></input>
        <label htmlFor="soon">soon</label>
        <input
          type="radio"
          id="kind of soon"
          name="frequency"
          value="kind of soon"
        ></input>
        <label htmlFor="kind of soon">kind of soon</label>
        <input
          type="radio"
          id="not soon"
          name="frequency"
          value="not soon"
        ></input>
        <label htmlFor="not soon">not soon</label>
      </fieldset>
    </form>
  );
}

export default AddItem;
