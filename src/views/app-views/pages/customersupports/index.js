import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Customersupports = () => (
	<Routes>
		<Route path="*" element={<Navigate to="customersupports" replace />} />
	</Routes>
);

export default Customersupports;