import React, { useState } from "react";


const GeneralList = () => {


  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full">
      {/* Table Header */}
      <h2 className="text-lg font-semibold mb-4">Tasks</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Task</th>
              <th className="px-4 py-2">Assigned To</th>
              <th className="px-4 py-2">Assigned By</th>
              <th className="px-4 py-2 ">Due Date</th>
              <th className="px-4 py-2 ">Total Hours</th>
              <th className="px-4 py-2 ">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* No Records Found Row */}
            <tr className="text-center text-gray-500">
              <td colSpan="7" className="px-4 py-8">
                <div className="flex flex-col items-center">
                  <svg
                    className="w-10 h-10 text-gray-400 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  <span className="text-sm">- No record found. -</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralList;
