import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {
	AUTH_PREFIX_PATH,
	UNAUTHENTICATED_ENTRY,
} from 'configs/AppConfig'

const ProtectedRoute = () => {

	const token = localStorage.getItem("auth_token")


	if (!token) {
		return <Navigate to={`${AUTH_PREFIX_PATH}${UNAUTHENTICATED_ENTRY}`} replace />;
	}

	return <Outlet />
}

export default ProtectedRoute