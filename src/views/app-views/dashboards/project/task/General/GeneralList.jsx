import React, { useState } from 'react';
import FileList from '../File/FileList';
import SubTaskList from '../SubTask/SubTaskList';
import CommentList from '../Comment/CommentList';
import TimeSheetList from '../TimeSheet/TimeSheetList';
import NotesList from '../Notes/NotesList';

const GeneralList = () => {
  const [selectedSection, setSelectedSection] = useState('File');

  const tabs = [
    { id: 'File', label: 'File' },
    { id: 'SubTask', label: 'Sub Task' },
    { id: 'Comment', label: 'Comment' },
    { id: 'Timesheet', label: 'Timesheet' },
    { id: 'Notes', label: 'Notes' }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Tabs Navigation */}
      <div className="border-b overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSection(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors
                ${selectedSection === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 lg:p-6">
        {selectedSection === 'File' && <FileList />}
        {selectedSection === 'SubTask' && <SubTaskList />}
        {selectedSection === 'Comment' && <CommentList />}
        {selectedSection === 'Timesheet' && <TimeSheetList />}
        {selectedSection === 'Notes' && <NotesList />}
      </div>
    </div>
  );
};

export default GeneralList;
