import React from 'react'
import LoginForm from '../../components/LoginForm'
import { useSelector } from 'react-redux';

const LoginOne = () => {
	const theme = useSelector(state => state.theme.currentTheme)
	
	return (
		<div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[1000px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
				<LoginForm />
			</div>
		</div>
	)
}

export default LoginOne
