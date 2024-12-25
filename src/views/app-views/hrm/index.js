import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Employee = () => (
	<Routes>
		<Route path="*" element={<Navigate to="hrm" replace />} />
	</Routes>
);

export default Employee;