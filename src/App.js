import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import './App.css';

function App() {
  //use text and setText for form inputs
  const [text, setText] = useState('');
  //docs and setDocs will handle fetching items from firestore and displaying them in our div below
  const [docs, setDocs] = useState([]);

  //use effect enables the app to listen for changes to the database and updates the state accordingly
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const snapshotDocs = [];
      snapshot.forEach((doc) => snapshotDocs.push(doc.data()));
      setDocs(snapshotDocs);
    });
    return () => {
      //Used to remove the snapshot listener when the component is unmounted/unsubscribed
      unsubscribe();
    };
  }, []);

  //handle submit for the form
  const handleClick = async (e) => {
    e.preventDefault();

    //create new doc reference for text input and save to firestore database
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        text,
      });
      setText('');
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
            placeholder="New item"
            name="item"
            value={text}
            onChange={(e) => handleChange(e)}
          ></input>
          <button type="submit" onClick={(e) => handleClick(e)}>
            Click this button to send data!
          </button>
        </form>
        {docs.map((doc) => (
          <p>{doc.text}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
