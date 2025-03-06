import React, { useState } from 'react';
import OverViewList from './overView/OverViewList';
import LeadMember from './leadMember/LeadMember';
import FileList from './File/FileList';
import NotesList from './notes/NotesList';
import EstimatesList from './estimates/EstimatesList';
import ReminderList from './Reminder/ReminderList.jsx';
// import TaskList from './task/TaskList';
// import InvoiceList from './invoice/InvoiceList';
// import PaymentList from './payment/PaymentList';
// import ExpensesList from './expenses/ExpensesList';
// import MilestoneList from './milestone/MilestoneList';
import ProductList from './product/ProductList';
// import ActivityList from './activity/ActivityList';

const ViewLead  = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'leadmember', label: 'Lead Member' },
    { id: 'files', label: 'Files' },
    { id: 'estimate', label: 'Estimates' },
    // { id: 'milestones', label: 'Milestones' },
    // { id: 'tasks', label: 'Tasks' },
    // { id: 'invoices', label: 'Invoices' },
    // { id: 'expenses', label: 'Expenses' },
    // { id: 'payments', label: 'Payments' },
    {id:'reminder',label:'Reminder'},
    { id: 'notes', label: 'Notes' },
    { id: 'products', label: 'Products & Services' },
    // { id: 'activity', label: 'Activity' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverViewList />;
      case "leadmember": return <LeadMember />;
      case "files": return <FileList />;
      case "estimate": return <EstimatesList />;
      case 'products': return <ProductList />;
      // case "milestones": return <MilestoneList />;
      // case "tasks": return <TaskList />;
      // case "invoices": return <InvoiceList />;
      // case "expenses": return <ExpensesList />;
      // case "payments": return <PaymentList />;
      case "notes": return <NotesList />;
      case "reminder": return <ReminderList />;
      // case 'activity': return <ActivityList />;
      default: return <OverViewList />;
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Menu Button */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200 ">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-between w-full sm:w-[200px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
          <svg
            className={`w-5 h-5 ml-2 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-b border-gray-200 bg-white shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block lg:block border-b border-gray-200">
        <nav className="flex flex-wrap overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ViewLead;







// import React, { useState } from 'react';
// import OverViewList from './overView/OverViewList';
// import FileList from './File/FileList';
// import TaskList from './task/TaskList';
// import InvoiceList from './invoice/InvoiceList';
// import PaymentList from './payment/PaymentList';
// import ProjectMember from './projectmember/ProjectMember';
// import ExpensesList from './expenses/ExpensesList';
// import MilestoneList from './milestone/MilestoneList';
// import NotesList from './notes/NotesList';
// import ProductList from './product/ProductList';

// const ViewProject = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const tabs = [
//     { id: 'overview', label: 'Overview' },
//     { id: 'projectmember', label: 'Project Member' },
//     { id: 'files', label: 'Files' },
//     { id: 'milestones', label: 'Milestones' },
//     { id: 'tasks', label: 'Tasks' },
//     { id: 'invoices', label: 'Invoices' },
//     { id: 'expenses', label: 'Expenses' },
//     { id: 'payments', label: 'Payments' },
//     { id: 'notes', label: 'Notes' },
//     { id: 'products', label: 'Products & Services' },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <OverViewList />;
//       case "projectmember":
//         return <ProjectMember />;
//       case "milestones":
//         return <MilestoneList />;
//       case "files":
//         return <FileList />;
//       case "tasks":
//         return <TaskList />;
//       case "invoices":
//         return <InvoiceList />;
//       case "expenses":
//         return <ExpensesList />;
//       case "payments":
//         return <PaymentList />;
//       case "notes":
//         return <NotesList />;
//       case 'products':
//         return <ProductList />;
//       default:
//         return <OverViewList />;
//     }
//   };

//   return (
//     <div className="w-full">
//       {/* Mobile Menu Button */}
//       <div className="lg:hidden p-4 border-b border-gray-200">
//         <button
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//           className="flex items-center justify-between w-full msm:w-[200px] px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           <span>{tabs.find(tab => tab.id === activeTab)?.label}</span>
//           <svg
//             className={`w-5 h-5 ml-2 transition-transform duration-200 ${
//               isMenuOpen ? 'transform rotate-180' : ''
//             }`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path
//               fillRule="evenodd"
//               d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <div className={` lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
//         <div className="px-2 pt-2 pb-3 space-y-1">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => {
//                 setActiveTab(tab.id);
//                 setIsMenuOpen(false);
//               }}
//               className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
//                 activeTab === tab.id
//                   ? 'bg-blue-50 text-blue-600'
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Desktop Navigation */}
//       <div className="hidden md:block lg:block border-b border-gray-200">
//         <nav className="flex flex-wrap">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-4 px-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
//                 activeTab === tab.id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Content Area */}
//       <div className="p-4 sm:p-6 lg:p-8">
//         <div className="max-w-7xl mx-auto">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewProject;
