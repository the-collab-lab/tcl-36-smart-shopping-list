import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddItemView from './components/AddItem';
import ListView from './components/ListView';
import Navigation from './components/Navigation';
import Home from './components/Home';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addItemView" element={<AddItemView />} />
        <Route path="listView" element={<ListView />} />
      </Routes>

      <Navigation />
    </>
  );
}

export default App;
