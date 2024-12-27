import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const Setting = () => (
	<Routes>
		<Route path="*" element={<Navigate to="setting" replace />} />
	</Routes>
);

export default Setting;