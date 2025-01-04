import React from 'react';

const IntroList = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4 lg:p-6 space-y-4  top-0">
      <div className="flex items-center justify-center gap-2 p-3 ">
        <span className="h-3 w-3 bg-red-500 rounded-full"></span>
        <span className="text-gray-800 font-semibold">Incomplete</span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm text-gray-500">Created On</h3>
          <div className="text-right">
            <p className="text-gray-800">Mon 21 Oct</p>
            <p className="text-sm text-gray-600">2024 07:35 am</p>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <h3 className="text-sm text-gray-500">Start Date</h3>
          <div className="text-right">
            <p className="text-gray-800">Fri 02 Aug</p>
            <p className="text-sm text-gray-600">2024</p>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <h3 className="text-sm text-gray-500">Due Date</h3>
          <div className="text-right">
            <p className="text-gray-800">Thu 08 Aug</p>
            <p className="text-sm text-gray-600">2024</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-sm text-gray-500">Hours Logged</h3>
          <p className="text-gray-800">0s</p>
        </div>
      </div>
    </div>
  );
};

export default IntroList;
