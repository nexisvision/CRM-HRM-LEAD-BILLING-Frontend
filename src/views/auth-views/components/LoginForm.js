import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Divider, Alert, Modal } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { GoogleSVG, FacebookSVG } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import { 
	signIn, 
	showLoading, 
	showAuthMessage, 
	hideAuthMessage, 
	signInWithGoogle, 
	signInWithFacebook 
} from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import UserService from '../auth-reducers/UserService';
import { useDispatch } from 'react-redux';
import { autol, forgototp, forgotpass, resetpass, userLogin } from '../auth-reducers/UserSlice';

const ForgotPasswordForm = ({ visible, onCancel }) => {
	const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const handleSubmit = async (values) => {
		try {
			if (step === 1) {
				dispatch(forgotpass(values));
				setStep(2);
			} else if (step === 2) {
				dispatch(forgototp(values));
				setStep(3);
			} else if (step === 3) {
				dispatch(resetpass(values))
				onCancel();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return (
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: 'Please enter your email' },
							{ type: 'email', message: 'Please enter a valid email' }
						]}
					>
						<Input 
							prefix={<MailOutlined className="text-primary" />}
							placeholder="Email"
							className="rounded-md"
						/>
					</Form.Item>
				);
			case 2:
				return (
					<Form.Item
						name="otp"
						rules={[{ required: true, message: 'Please enter OTP' }]}
					>
						<Input 
							placeholder="Enter OTP"
							className="rounded-md"
							maxLength={6}
						/>
					</Form.Item>
				);
			case 3:
				return (
					<>
						<Form.Item
							name="newPassword"
							rules={[
								{ required: true, message: 'Please enter new password' },
								{ min: 6, message: 'Password must be at least 6 characters' }
							]}
						>
							<Input.Password 
								prefix={<LockOutlined className="text-primary" />}
								placeholder="New Password"
								className="rounded-md"
							/>
						</Form.Item>
						<Form.Item
							name="confirmPassword"
							dependencies={['newPassword']}
							rules={[
								{ required: true, message: 'Please confirm your password' },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('newPassword') === value) {
											return Promise.resolve();
										}
										return Promise.reject('Passwords do not match');
									},
								}),
							]}
						>
							<Input.Password 
								prefix={<LockOutlined className="text-primary" />}
								placeholder="Confirm Password"
								className="rounded-md"
							/>
						</Form.Item>
					</>
				);
			default:
				return null;
		}
	};

	return (
		<Modal
			title={
				<div className="text-lg font-semibold text-gray-800">
					{step === 1 ? 'Forgot Password' : step === 2 ? 'Enter OTP' : 'Reset Password'}
				</div>
			}
			visible={visible}
			onCancel={onCancel}
			footer={null}
			className="rounded-lg"
		>
			<Form
				form={form}
				onFinish={handleSubmit}
				className="space-y-4"
			>
				<div className="mb-4">
					<p className="text-gray-600">
						{step === 1 
							? 'Enter your email to receive a verification code'
							: step === 2 
							? 'Enter the OTP sent to your email'
							: 'Enter your new password'}
					</p>
				</div>

				{renderStepContent()}

				<div className="flex justify-end space-x-4">
					<Button 
						onClick={onCancel}
						className="px-4 py-2 text-gray-700 hover:text-gray-900"
					>
						Cancel
					</Button>
					<Button 
						type="primary" 
						htmlType="submit"
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
					>
						{step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

export const LoginForm = props => {
	const dispatch = useDispatch();
	
	const navigate = useNavigate();


	const { 
		otherSignIn, 
		showForgetPassword, 
		hideAuthMessage,
		onForgetPasswordClick,
		showLoading,
		signInWithGoogle,
		signInWithFacebook,
		extra, 
		signIn, 
		token, 
		loading,
		redirect,
		showMessage,
		message,
		allowRedirect = true
	} = props

	const initialCredential = {
		email: 'user1@themenate.net',
		password: '2005ipo'
	}

	const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

	useEffect(() => {
		const checkAndAutoLogin = async () => {
			const localemail = localStorage.getItem('email');
			const localtoken = localStorage.getItem('autologintoken');

			if (localemail) {
				try {
					console.log('Attempting auto login with:', localemail); // Debug log
					const response = await dispatch(autol({localemail,localtoken}));
					console.log('Auto login response:', response); // Debug log

					if (response.meta.requestStatus === 'fulfilled') { 
						localStorage.removeItem('email');
						localStorage.removeItem("autologintoken");
						navigate('/dashboard/default');
						window.location.reload();
					}
				} catch (error) {
					console.error('Auto login failed:', error);
					localStorage.removeItem('email');
				}
			}
		};

		checkAndAutoLogin();
		
		const intervalId = setInterval(checkAndAutoLogin, 1000); // Check every second
		
		setTimeout(() => {
			clearInterval(intervalId);
		}, 5000);

		return () => clearInterval(intervalId);
	}, [dispatch, navigate]); // Add necessary dependencies

	const onLogin = values => {
		showLoading()
			dispatch(userLogin(values))
			.then((response) => {
				if (response.meta.requestStatus === 'fulfilled') { 
					navigate('/dashboard/default');
					window.location.reload();
				}
			})
			.catch((error) => {
				// message.error("Login failed. Please try again.");
				
				console.error('Login failed:', error);
			})
			.finally(() => {
				// hideLoading();
			});
	};

	const onGoogleLogin = () => {
		showLoading()
		signInWithGoogle()
	}

	const onFacebookLogin = () => {
		showLoading()
		signInWithFacebook()
	}

	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	}, []);
	


	const renderOtherSignIn = (
		<div>
			<Divider>
				<span className="text-muted font-size-base font-weight-normal">or connect with</span>
			</Divider>
			<div className="d-flex justify-content-center">
				<Button 
					onClick={() => onGoogleLogin()} 
					className="mr-2" 
					disabled={loading} 
					icon={<CustomIcon svg={GoogleSVG}/>}
				>
					Google
				</Button>
				<Button 
					onClick={() => onFacebookLogin()} 
					icon={<CustomIcon svg={FacebookSVG}/>}
					disabled={loading} 
				>
					Facebook
				</Button>
			</div>
		</div>
	)

	return (
		<div className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto ">
			<div className="mb-6">
				{/* <h1 className="text-2xl font-bold text-gray-800 mb-2">emilus</h1>
				<p className="text-gray-600">
					Don't have an account yet? 
					<span className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
						Sign Up
					</span>
				</p> */} 
			</div>

			<Form 
				layout="vertical" 
				name="login-form" 
				initialValues={initialCredential}
				onFinish={onLogin}
				className="space-y-4"
			>
				<Form.Item 
					name="login" 
					label={
						<span className="flex items-center">
							<span className="text-red-500 mr-1"></span>
							Email / Username / Phone
						</span>
					}
					rules={[
						{ required: true, message: 'Please input your email or username' },
						{ type: 'text', message: 'Please enter a valid username or email' }
					]}
				>
					<Input 
						prefix={<MailOutlined className="text-gray-400" />}
						className="h-12 rounded-md"
						placeholder="Enter your email"
					/>
				</Form.Item>
				
				<Form.Item 
					name="password" 
					label={
						<span className="flex items-center">
							<span className="text-red-500 mr-1"></span>
							Password
						</span>
					}
					rules={[
						{ required: true, message: 'Please input your password' }
					]}
				>
					<Input.Password 
						prefix={<LockOutlined className="text-gray-400" />}
						className="h-12 rounded-md"
						placeholder="••••••••"
					/>
				</Form.Item>

				<div className="flex justify-end -mt-2 mb-4">
					<span 
						onClick={() => setForgotPasswordVisible(true)} 
						className="text-blue-600 hover:text-blue-700 cursor-pointer text-sm"
					>
						Forgot Password?
					</span>
				</div>

				<Form.Item className="mb-0">
					<Button 
						type="primary" 
						htmlType="submit" 
						block
						className="h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 rounded-md"
					>
						Sign In
					</Button>
				</Form.Item>
			</Form>

			<ForgotPasswordForm 
				visible={forgotPasswordVisible}
				onCancel={() => setForgotPasswordVisible(false)}
			/>
		</div>
	);
};

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: false
};

const mapStateToProps = ({auth}) => {
	const {loading, message, showMessage, token, redirect} = auth;
  return {loading, message, showMessage, token, redirect}
}

const mapDispatchToProps = {
	signIn,
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	signInWithGoogle,
	signInWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
