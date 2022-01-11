import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import './App.css';

function App() {
  const [text, setText] = useState('');

  //handle submit for the form
  const handleClick = async (e) => {
    e.preventDefault();

    //create new doc reference for text input and save to firestore database
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        text,
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  //updating state for the input box
  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <div className="temp">
        <form method="post">
          <input
            type="text"
            placeholder="Enter Text"
            name="text"
            onChange={(e) => handleChange(e)}
          ></input>
          <button type="submit" onClick={(e) => handleClick(e)}>
            Click this button to send data!
          </button>
        </form>
        <div>{text}</div>
      </div>
    </div>
  );
}

export default App;
