import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllNotifications } from './NotificationReducer/NotificationSlice';
import { message } from 'antd';
import axios from 'axios';

const NotificationPage = () => {
  const dispatch = useDispatch();
  const allnoidata = useSelector((state) => state.Notifications);
  const fnddata = allnoidata?.Notifications?.data || [];
  const [list, setList] = useState([]);

  // const Isreadtrue = async () => {
  //   const token = localStorage.getItem("auth_token");
  //   const payload = "true";
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:5353/api/v1/notifications/",
  //       { isRead: payload },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     return res.data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     throw error;
  //   }
  // };

  useEffect(() => {
    dispatch(GetAllNotifications())
     
  }, [dispatch]);

  useEffect(() => {
    if (fnddata.length) {
      setList(fnddata);
    }
  }, [fnddata]);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded shadow">
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {list && list
            .filter((notification) => notification.notification_type === 'normal')
            .map((notification, index) => (
              <div key={index} className="flex justify-between items-start p-3 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-gray-600">{notification.description}</p>
                </div>
                <span className="text-gray-500 text-sm">{notification.time}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-black">Reminders</h2>
        </div>

        <div className="space-y-4">
          { list && list
            .filter((reminder) => reminder.notification_type === 'reminder')
            .map((reminder, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      reminder.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {reminder.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{reminder.description}</p>
                <p className="text-sm text-gray-500">Due: {reminder.time}</p>
              </div>
            ))}
            
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;


