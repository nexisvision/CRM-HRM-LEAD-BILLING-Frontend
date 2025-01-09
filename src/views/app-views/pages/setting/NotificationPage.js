

import React from 'react';

const NotificationPage = () => {
  const notifications = [
    {
      name: 'Erin Gonzales',
      action: 'has comment on your board',
      time: '7:57PM',
    },
    {
      name: 'Frederick Adams',
      action: 'has mentioned you in a post',
      time: '3:12PM',
    },
    {
      name: 'Carolyn Hanson',
      action: 'has invited you to a project',
      time: '9:42AM',
    },
  ];
  const reminders = [
    {
      title: "Team Meeting",
      description: "Daily standup with the development team",
      time: "10:00 AM",
      priority: "high"
    },
    {
      title: "Project Deadline",
      description: "Submit the final project documentation",
      time: "5:00 PM",
      priority: "medium"
    }
  ];

  return (
    <div className=" p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className='bg-white rounded-lg shadow-lg'>
        <div className=" p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold"> Notifications</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            3 New
          </span>
        </div>

        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="flex justify-between items-start p-3 hover:bg-gray-50 rounded">
              <div>
                <p className="font-medium">{notification.name}</p>
                <p className="text-gray-600">{notification.action}</p>
              </div>
              <span className="text-gray-500 text-sm">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-green-600">Reminders</h2>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {reminders.length} Active
          </span>
        </div>

        <div className="space-y-4">
          {reminders.map((reminder, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${reminder.priority === 'high'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
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