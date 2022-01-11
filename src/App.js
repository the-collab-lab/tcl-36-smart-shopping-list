import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [click, setClick] = useState(false);
  const [text, setText] = useState('');

  //updating state for the button
  function handleClick(e) {
    e.preventDefault();
    setClick(!click);
  }
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
