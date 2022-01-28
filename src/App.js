import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddItemView from './components/AddItem';
import ListView from './components/ListView';
import Navigation from './components/Navigation';
import Home from './components/Home';

import './App.css';

function App() {
  return (
    <div>
      <>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate replace to={'/home'} />} />
          <Route path="addItemView" element={<AddItemView />} />
          <Route path="listView" element={<ListView />} />
        </Routes>

        <Navigation />
      </>
    </div>
  );
}

export default App;
