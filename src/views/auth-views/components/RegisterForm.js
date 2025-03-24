import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { 
	UserOutlined,
	MailOutlined, 
	LockOutlined,
	EyeOutlined,
	EyeInvisibleOutlined,
	ReloadOutlined 
} from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from "antd";
import { signUp, showAuthMessage, showLoading, hideAuthMessage } from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import formbg from "assets/form/login/formbg.png";
import axios from "axios";
import { env } from "configs/EnvironmentConfig";
import { registerClient } from 'views/app-views/company/CompanyReducers/CompanySlice';
import { useDispatch } from 'react-redux';

export const RegisterForm = (props) => {
	const dispatch = useDispatch();
	const { showLoading, token, loading, redirect, allowRedirect = true } = props
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [showOtpModal, setShowOtpModal] = useState(false);
	const [otpToken, setOtpToken] = useState(null);
	const [otp, setOtp] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const generatePassword = () => {
		const length = 8;
		const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let password = "";

		for (let i = 0; i < length; i++) {
			password += charset[Math.floor(Math.random() * charset.length)];
		}

		const randomNum = Math.floor(Math.random() * 10).toString();
		password = password.slice(0, 7) + randomNum;

		return password;
	};

	const otpapi = async (otp) => {
		try {
			const res = await axios.post(
				`${env.API_ENDPOINT_URL}/auth/verify-signup`,
				{ otp },
				{
					headers: {
						Authorization: `Bearer ${otpToken}`,
					},
				}
			);
			return res.data;
		} catch (error) {
			console.error("Error verifying OTP:", error);
			throw error;
		}
	};

	const handleOtpVerify = async () => {
		if (!otp || otp.length !== 6) {
			message.error("Please enter a valid 6-digit OTP.");
			return;
		}

		try {
			const response = await otpapi(otp);
			if (response.success) {
				message.success("OTP Verified Successfully");
				setShowOtpModal(false);
				navigate('/auth/login');
			} else {
				message.error("Invalid OTP. Please try again.");
			}
		} catch (error) {
			message.error("Failed to verify OTP. Please try again.");
		}
	};

	const onSignUp = async (values) => {
		setIsSubmitting(true);
		try {
			showLoading();
			const response = await dispatch(registerClient(values));
			if (response.payload?.data?.sessionToken) {
				setOtpToken(response.payload?.data?.sessionToken);
				message.success("Registration successful! Please verify OTP.");
				setShowOtpModal(true);
			}
			form.resetFields();
		} catch (error) {
			message.error("Failed to register. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
	}, [token, allowRedirect, navigate, redirect]);

	return (
		<div className="flex h-full">
			{/* Left Section with Background Image */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-[#4169E1]">
				<div className="absolute inset-0 flex flex-col p-12">
					<div>
						{/* Logo and Brand */}
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
								<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
									<path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4169E1" />
								</svg>
							</div>
							<span className="text-white text-xl">Raiser</span>
						</div>

						{/* Main Content */}
						<div className="mt-16">
							<h1 className="text-white text-[28px] font-normal leading-tight">
								Start your journey
								<br />
								Join our community today.
							</h1>
						</div>

						{/* Illustration */}
						<div className="mt-12">
							<img
								src={formbg}
								alt="workspace illustration"
								className="w-full max-w-[400px]"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
				<div className="w-full max-w-[360px]">
					<div className="mb-8">
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Create an Account
						</h1>
						<p className="text-gray-600">
							Please fill in the details to create your account
						</p>
					</div>

					<Form
						form={form}
						name="register"
						onFinish={onSignUp}
						layout="vertical"
						className="space-y-5"
					>
						<Form.Item
							name="username"
							label={<span className="text-gray-700 font-medium">Username</span>}
							rules={[
								{ required: true, message: 'Please input your username!' }
							]}
						>
							<Input
								prefix={<UserOutlined className="text-gray-400" />}
								placeholder="Enter your username"
								className="h-11 rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors"
							/>
						</Form.Item>

						<Form.Item
							name="email"
							label={<span className="text-gray-700 font-medium">Email</span>}
							rules={[
								{ required: true, message: 'Please input your email!' },
								{ type: 'email', message: 'Please enter a valid email!' }
							]}
						>
							<Input
								prefix={<MailOutlined className="text-gray-400" />}
								placeholder="youremail@gmail.com"
								className="h-11 rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors"
							/>
						</Form.Item>

						<Form.Item
							name="password"
							label={<span className="text-gray-700 font-medium">Password</span>}
							rules={[
								{ required: true, message: 'Please input your password!' },
								{ min: 8, message: 'Password must be at least 8 characters!' },
								{ matches: /\d/, message: 'Password must have at least one number' }
							]}
						>
							<div className="relative">
								<Input.Password
									prefix={<LockOutlined className="text-gray-400" />}
									placeholder="••••••••"
									className="h-11 rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors"
									iconRender={(visible) =>
										visible ? (
											<EyeOutlined className="text-gray-400" />
										) : (
											<EyeInvisibleOutlined className="text-gray-400" />
										)
									}
								/>
								<Button
									className="absolute right-10 top-1/2 border-0 bg-transparent ring-0 hover:none -translate-y-1/2 flex items-center z-10"
									onClick={() => form.setFieldsValue({ password: generatePassword() })}
								>
									<ReloadOutlined />
								</Button>
							</div>
						</Form.Item>

						<Button
							type="primary"
							htmlType="submit"
							loading={loading || isSubmitting}
							className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-base flex items-center justify-center group"
						>
							<span>Sign Up</span>
							<span className="ml-2 group-hover:translate-x-1 transition-transform">
								→
							</span>
						</Button>

						<div className="text-center mt-6 border-t pt-6">
							<span className="text-gray-600">Already have an account? </span>
							<Button
								type="link"
								onClick={() => navigate('/auth/login')}
								className="text-blue-600 hover:text-blue-700 font-medium p-0"
							>
								Sign In
							</Button>
						</div>
					</Form>
				</div>
			</div>

			{/* OTP Modal */}
			<Modal
				title="Verify OTP"
				visible={showOtpModal}
				onCancel={() => setShowOtpModal(false)}
				footer={null}
				centered
			>
				<div className="p-4 rounded-lg bg-white">
					<h2 className="text-xl font-semibold mb-4">OTP Page</h2>
					<p>
						An OTP has been sent to your registered email. Please enter the OTP
						below to verify your account.
					</p>
					<Input
						type="number"
						placeholder="Enter OTP"
						className="mt-4 p-3 border border-gray-300 rounded-md"
						style={{ width: "100%" }}
						onChange={(e) => setOtp(e.target.value)}
					/>
					<div className="mt-4">
						<Button
							type="primary"
							htmlType="submit"
							loading={isSubmitting}
							disabled={isSubmitting}
							onClick={handleOtpVerify}
						>
							{isSubmitting ? "Verifying..." : "Verify OTP"}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	signUp,
	showAuthMessage,
	hideAuthMessage,
	showLoading
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm)
