import React, { useState } from 'react';
import OverViewList from './overView/OverViewList';
import FileList from './File/FileList';
// import Members from './tabs/Members';
// import Files from './tabs/Files';
// import Milestones from './tabs/Milestones';
// import Tasks from './tabs/Tasks';
// import TaskBoard from './tabs/TaskBoard';
// import GanttChart from './tabs/GanttChart';
// import Invoices from './tabs/Invoices';

const ViewProject = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'files', label: 'Files' },
    // { id: 'members', label: 'Members' },
    // { id: 'milestones', label: 'Milestones' },
    // { id: 'tasks', label: 'Tasks' },
    // { id: 'taskboard', label: 'Task Board' },
    // { id: 'ganttchart', label: 'Gantt Chart' },
    // { id: 'invoices', label: 'Invoices' },
    // { id: 'more', label: 'More↓' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverViewList />;
          case 'files':
            return <FileList />;
    //   case 'members':
    //     return <Members />;
    //   case 'milestones':
    //     return <Milestones />;
    //   case 'tasks':
    //     return <Tasks />;
    //   case 'taskboard':
    //     return <TaskBoard />;
    //   case 'ganttchart':
    //     return <GanttChart />;
    //   case 'invoices':
    //     return <Invoices />;
      default:
        return <OverViewList />;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default ViewProject;