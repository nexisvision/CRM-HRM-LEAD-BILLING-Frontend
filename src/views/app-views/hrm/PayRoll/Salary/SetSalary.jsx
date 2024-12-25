import React from 'react';
import EmployeeSalary from './EmployeeSalary/index';
import Allowance from './Allowance/index';
import Commission from './Commission';
import Loan from './Loan';
import OtherPayment from './OtherPayment';
import Overtime from './Overtime';
import SaturationDeduction from './SaturationDeduction';

const SetSalary = () => (
  <div className="p-3 md:p-4 min-h-screen w-full">
    <div className='mt-[-10px] mb-2'>
      <h1 className='text-2xl font-semibold'>Set Salary</h1>
    </div>
    <hr className="mb-6 border-gray-300" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 ml-[-12px] mr-[-12px] mb-[-20px] sm:gap-3 md:gap-3">
      {/* Employee Salary Section */}
      <div className=" rounded-lg lg:p-1">
        <EmployeeSalary />
      </div>

      {/* Allowance Section */}
      <div className=" rounded-lg lg:p-1">
        <Allowance />
      </div>

      {/* Commission Section */}
      <div className=" rounded-lg lg:p-1">
        <Commission />
      </div>

      {/* Loan Section */}
      <div className=" rounded-lg lg:p-1">
        <Loan />
      </div>

      {/* Other Payment Section */}
      <div className=" rounded-lg lg:p-1">
        <OtherPayment />
      </div>

      {/* Saturation Deduction Section */}
      <div className=" rounded-lg lg:p-1">
        <SaturationDeduction />
      </div>

      {/* Overtime Section */}
      <div className=" rounded-lg lg:p-1">
        <Overtime />
      </div>
    </div>
  </div>
);

export default SetSalary;

















// import React from 'react';
// import EmployeeSalary from './EmployeeSalary/index';
// import Allowance from './Allowance/index';
// import Commission from './Commission';
// import Loan from './Loan';
// import OtherPayment from './OtherPayment';
// import Overtime from './Overtime';
// import SaturationDeduction from './SaturationDeduction';

// const SetSalary = () => (
//   <div className="p-6 min-h-screen w-[1550px]">
//           <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//     {/* <h2 className="text-2xl font-bold mb-6 text-gray-800">Set Salary</h2> */}
//     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
//       {/* Employee Salary Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Employee Salary</h3> */}
//         <EmployeeSalary />
//       </div>

//       {/* Allowance Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Allowance</h3> */}
//         <Allowance />
//       </div>

//       {/* Commission Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Commission</h3> */}
//         <Commission />
//       </div>

//       {/* Loan Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Loan</h3> */}
//         <Loan />
//       </div>

//       {/* Other Payment Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Other Payment</h3> */}
//         <OtherPayment />
//       </div>

//       {/* Saturation Deduction Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Saturation Deduction</h3> */}
//         <SaturationDeduction />
//       </div>

//       {/* Overtime Section */}
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         {/* <h3 className="text-lg font-semibold text-gray-700 mb-4">Overtime</h3> */}
//         <Overtime />
//       </div>
//     </div>
//   </div>
// );

// export default SetSalary;







// import React from 'react';
// // import { Navigate, Route, Routes } from 'react-router-dom';
// // import AttendanceList from './DepartmentList';
// // import EmployeeSalaryList from './EmployeeSalaryList';
// import EmployeeSalary from './EmployeeSalary/index';
// import Allowance from './Allowance/index';
// import Commission from './Commission';
// import Loan from './Loan';
// import OtherPayment from './OtherPayment';
// import Overtime from './Overtime';
// import SaturationDeduction from './SaturationDeduction';
// // import AddEmployee from './AddEmployee';
// // import InnerAppLayout from 'layouts/inner-app-layout';
// // import EditEmployee from './EditEmployee';

// const SetSalary = () => (
// 	// <Routes>
// 	// 	<Route path="*" element={<Navigate to="employee" replace />} />
// 	// </Routes>

// <div className="mail">
// <div className=''>
//     <div>
//         {/* <h3>Employee Salary </h3> */}
// <EmployeeSalary />
// </div>
// <div>
// <Allowance />
// </div>
// <div>
// <Commission />
// </div>
// <div>
//     <Loan />
// </div>
// <div>
//     <OtherPayment />
// </div>
// <div>
//     <Overtime />
// </div>
// <div>
//     <SaturationDeduction />
// </div>
// </div>
//     {/* // mainContent={<AddEmployee {...this.props}/>} */}

// {/* <AddEmployee /> */}

// {/* <EditEmployee /> */}
// </div>

// );

// export default SetSalary;