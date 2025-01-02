import React, { useState } from 'react';
import OverViewList from './overView/OverViewList';
import FileList from './File/FileList';
import TaskList from './task/TaskList';
import InvoiceList from './invoice/InvoiceList';
import PaymentList from './payment/PaymentList';
import ProjectMember from './projectmember/ProjectMember';
import ExpensesList from './expenses/ExpensesList';
import MilestoneList from './milestone/MilestoneList';
import NotesList from './notes/NotesList';
// import Members from './tabs/Members';
// import Files from './tabs/Files';
// import Milestones from './tabs/Milestones';
// import Tasks from './tabs/Tasks';
// import TaskBoard from './tabs/TaskBoard';
// import GanttChart from './tabs/GanttChart';

const ViewProject = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projectmember', label: 'Project Member' },
    { id: 'files', label: 'Files' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'payments', label: 'Payments' },
    { id: 'notes', label: 'Notes' },
    // { id: 'members', label: 'Members' },
    // { id: 'taskboard', label: 'Task Board' },
    // { id: 'ganttchart', label: 'Gantt Chart' },
    // { id: 'more', label: 'More↓' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverViewList />;
      case 'projectmember':
        return <ProjectMember />;
      case 'milestones':
        return <MilestoneList />;
      case 'files':
        return <FileList />;
      case 'tasks':
        return <TaskList />;
      case 'invoices':
        return <InvoiceList />;
      case 'expenses':
        return <ExpensesList />;
      case 'payments':
        return <PaymentList />;
      case 'notes':
        return <NotesList />;

      //   case 'members':
      //     return <Members />;
      //   case 'milestones':
      //     return <Milestones />;
      //   case 'taskboard':
      //     return <TaskBoard />;
      //   case 'ganttchart':
      //     return <GanttChart />;
      default:
        return <OverViewList />;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b-2 border-gray-200">
        <nav className="flex space-x-8 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm
                ${activeTab === tab.id
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