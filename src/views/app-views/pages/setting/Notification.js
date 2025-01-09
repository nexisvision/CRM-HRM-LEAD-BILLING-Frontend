import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import NotificationPopup from 'views/app-views/pages/setting/NotificationPopup';



const Notification = () => {
  return (
    <Router>
      <div className="App">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl">Notification System</h1>
        </header>

        <div className="p-4">
          {/* <NotificationPopup/> */}
        </div>

        <Routes>
          {/* <Route path="/notification" element={<NotificationPage/>} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default Notification;
