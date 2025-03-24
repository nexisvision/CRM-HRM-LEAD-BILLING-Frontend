import React from 'react'
import RegisterForm from '../../components/RegisterForm'
import { Card, Row, Col } from "antd";
import { useSelector } from 'react-redux'

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const RegisterOne = props => {
	const theme = useSelector(state => state.theme.currentTheme)
	return (
		<div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-[1000px] h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden">
				<RegisterForm />
			</div>
		</div>
	)
}

export default RegisterOne
