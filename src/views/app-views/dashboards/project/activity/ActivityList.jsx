import React, { useState } from 'react';
function ActivityList() {
  const [timelineItems, setTimelineItems] = useState([
    {
      date: 'Oct 24',
      time: '06:07 pm',
      event: 'New task added to the project.',
    },
    {
      date: 'Oct 24',
      time: '06:07 pm',
      event: 'New member added to the project.',
    },
  ]);
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      {/* <h2 className="text-xl font-semibold mb-4">Project Timeline</h2> */}
      <ul className="space-y-4 ">
        {timelineItems.map((item, index) => (
          <li key={index} className="flex items-center border-b border-gray-200 pb-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4 ">
              {item.date.substring(0, 3)}
            </div>
            <div>
              <p className="text-sm font-semibold">{item.date}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
              <p className="text-sm">{item.event}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ActivityList;