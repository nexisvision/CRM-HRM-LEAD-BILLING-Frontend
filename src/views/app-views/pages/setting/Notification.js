import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';

const Notification = () => {
  return (
    <Router>
      <div className="App">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl">Notification System</h1>
        </header>

        <div className="p-4">
        </div>

        <Routes>
        </Routes>
      </div>
    </Router>
  );
};

export default Notification;
