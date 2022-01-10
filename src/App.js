import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AddItem from './components/AddItem';
import ListView from './components/ListView';
import Navigation from './components/Navigation';
import Home from './components/Home';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addItem" element={<AddItem />} />
        <Route path="listView" element={<ListView />} />
      </Routes>

      <Navigation />
    </>
  );
}

export default App;
