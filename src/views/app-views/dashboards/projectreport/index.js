import React from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import AttendanceList from './DepartmentList';
import ProjectReportList from "./ProjectReportList"
// import AddEmployee from './AddEmployee';
// import InnerAppLayout from 'layouts/inner-app-layout';
// import EditEmployee from './EditEmployee';

const projectreport = () => (
	// <Routes>
	// 	<Route path="*" element={<Navigate to="employee" replace />} />
	// </Routes>

<div className="mail">
<ProjectReportList/>
    {/* // mainContent={<AddEmployee {...this.props}/>} */}

{/* <AddEmployee /> */}

{/* <EditEmployee /> */}
</div>

);

export default projectreport;