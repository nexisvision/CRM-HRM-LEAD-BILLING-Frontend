import React, { Component } from 'react'
import { Menu } from 'antd';
import { Route, Navigate, useLocation, Routes } from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import Notification from './Notification';



const SettingOption = () => {

	const location = useLocation();

	const locationPath = location.pathname.split('/')

	const currentpath = locationPath[locationPath.length - 1]

	return (
		<Menu
			mode="inline"
			selectedKeys={[currentpath]}
			items={[
			
			]}
		/>
	);
};

const SettingContent = () => {

	return (
		<Routes>
		
			<Route path="notification" element={<Notification />} />
			<Route path="*" element={<Navigate to="edit-profile" replace />} />
		</Routes>
	)
}

export class Setting extends Component {
	render() {
		return (
			<InnerAppLayout
				sideContentWidth={320}
				sideContent={<SettingOption />}
				mainContent={<SettingContent />}
			/>
		);
	}
}

export default Setting
