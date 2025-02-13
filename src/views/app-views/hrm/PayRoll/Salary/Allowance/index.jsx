import React from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import AttendanceList from './DepartmentList';
import AllowanceList from './AllowanceList';
// import AddEmployee from './AddEmployee';
// import InnerAppLayout from 'layouts/inner-app-layout';
// import EditEmployee from './EditEmployee';

const Allowance = ({ id, onClose }) => (
	// <Routes>
	// 	<Route path="*" element={<Navigate to="employee" replace />} />
	// </Routes>

<div className="mail">

<AllowanceList id={id} onClose={onClose} />
    {/* // mainContent={<AddEmployee {...this.props}/>} */}




{/* <AddEmployee /> */}

{/* <EditEmployee /> */}
</div>

);

export default Allowance;