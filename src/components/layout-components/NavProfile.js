import React, { useEffect, useState } from 'react';
import { Avatar, Modal, Form, Input, Upload, Button, message, Select, Menu, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
	EditOutlined,
	SettingOutlined,
	ShopOutlined,
	QuestionCircleOutlined,
	LogoutOutlined,
	UserOutlined,
	UploadOutlined
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { signOut } from 'store/slices/authSlice';
import { updateUser, getUserById } from 'views/auth-views/auth-reducers/UserSlice';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER } from 'constants/ThemeConstant';
import EditCompany from 'views/app-views/company/EditCompany';
import { Formik } from "formik";
import * as Yup from "yup";

const StyledModal = styled(Modal)`
	.ant-modal-content {
		border-radius: 12px;
		overflow: hidden;
	}
	
	.ant-modal-header {
		background: #f8f9fa;
		padding: 16px 24px;
		border-bottom: 1px solid #e9ecef;
	}

	.ant-modal-body {
		padding: 24px;
		max-height: calc(100vh - 200px);
		overflow-y: auto;
	}

	@media screen and (max-width: 768px) {
		width: 90vw !important;
		margin: 0 auto;
		
		.ant-modal-body {
			padding: 16px;
		}
	}
`;

const FormContainer = styled.div`
	.form-section {
		margin-bottom: 32px;

		h3 {
			font-size: 16px;
			font-weight: 600;
			margin-bottom: 24px;
			color: #2c3e50;
		}
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		margin-bottom: 24px;

		@media screen and (max-width: 576px) {
			grid-template-columns: 1fr;
			gap: 16px;
		}
	}

	.form-field {
		label {
			display: block;
			margin-bottom: 8px;
			font-weight: 500;
			color: #2c3e50;
		}

		.ant-input,
		.ant-select,
		.ant-input-password {
			width: 100%;
			border-radius: 6px;
		}

		.error-message {
			color: #dc3545;
			font-size: 12px;
			margin-top: 4px;
		}
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 32px;
		padding-top: 16px;
		border-top: 1px solid #e9ecef;

		button {
			min-width: 100px;
		}
	}
`;

const Profile = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 0 12px;
`;

const UserInfo = styled.div`
	padding-left: ${SPACER[2]};
	display: flex;
	flex-direction: column;

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none;
	}
`;

const Name = styled.div`
	font-weight: ${FONT_WEIGHT.SEMIBOLD};
	font-size: 14px;
	line-height: 1.2;
`;

const Title = styled.span`
	opacity: 0.8;
	font-size: 12px;
	line-height: 1.2;
`;

const validationSchema = Yup.object({
	email: Yup.string().email('Invalid email').required('Email is required'),
	firstName: Yup.string().required('First name is required'),
	lastName: Yup.string().required('Last name is required'),
	phone: Yup.string().required('Phone number is required'),
	password: Yup.string().min(6, 'Password must be at least 6 characters')
});

const FormField = ({ label, name, type = "text", required, children }) => (
	<div className="form-field">
		<label>{label} {required && <span style={{ color: '#dc3545' }}>*</span>}</label>
		{children || (
			<Input
				type={type}
				name={name}
				placeholder={`Enter ${label.toLowerCase()}`}
			/>
		)}
	</div>
);

export const NavProfile = ({ mode }) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [fileList, setFileList] = useState([]);
	const dispatch = useDispatch();
	const { role: { data: roles } = {} } = useSelector((state) => state.role);
	const { loggedInUser } = useSelector((state) => state.user);
	const [userRole, setUserRole] = useState("");
	const [userName, setUserName] = useState("");

	useEffect(() => {
		if (!roles || !loggedInUser) return;

		const role = roles.find(r => r?.role_id === loggedInUser?.role_id);
		setUserRole(role?.role_name || "");
		setUserName(loggedInUser?.username || "");

		if (loggedInUser?.profilePic) {
			setFileList([{
				uid: '-1',
				name: 'Profile Picture',
				status: 'done',
				url: loggedInUser.profilePic,
			}]);
		}
	}, [roles, loggedInUser]);

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			const formData = new FormData();
			formData.append('id', loggedInUser?.id);

			Object.entries(values).forEach(([key, value]) => {
				if (key !== 'profilePic' && value != null && (value !== '' || key === 'password')) {
					formData.append(key, value);
				}
			});

			if (fileList[0]?.originFileObj) {
				formData.append('profilePic', fileList[0].originFileObj);
			}

			const response = await dispatch(updateUser(formData)).unwrap();

			if (response?.success || response?.status === 200) {
				message.success('Profile updated successfully');
				await dispatch(getUserById(loggedInUser.id));
				setIsModalVisible(false);
			} else {
				throw new Error(response?.message);
			}
		} catch (error) {
			message.error(error.message || 'Failed to update profile');
		} finally {
			setSubmitting(false);
		}
	};

	const menu = (
		<Menu>
			<Menu.Item key="edit" onClick={() => setIsModalVisible(true)}>
				<Flex alignItems="center">
					<EditOutlined />
					<span className="ml-2">Edit Profile</span>
				</Flex>
			</Menu.Item>
			<Menu.Item key="settings">
				<Flex alignItems="center">
					<SettingOutlined />
					<span className="ml-2">Account Setting</span>
				</Flex>
			</Menu.Item>
			<Menu.Item key="billing">
				<Flex alignItems="center">
					<ShopOutlined />
					<span className="ml-2">Account Billing</span>
				</Flex>
			</Menu.Item>
			<Menu.Item key="help">
				<Flex alignItems="center">
					<QuestionCircleOutlined />
					<span className="ml-2">Help Center</span>
				</Flex>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="logout" onClick={() => dispatch(signOut())}>
				<Flex alignItems="center">
					<LogoutOutlined />
					<span className="ml-2">Sign Out</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const uploadProps = {
		beforeUpload: file => {
			const isValid = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isValid) {
				message.error('Please upload JPG/PNG/WEBP file');
				return false;
			}

			if (!isLt2M) {
				message.error('Image must be smaller than 2MB');
				return false;
			}

			setFileList([file]);
			return false;
		},
		onRemove: () => setFileList([]),
		fileList
	};

	return (
		<>
			<div className="nav-profile">
				<Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
					<NavItem mode={mode}>
						<Profile>
							<Avatar
								size={36}
								src={loggedInUser?.profilePic}
								icon={!loggedInUser?.profilePic && <UserOutlined />}
								style={{
									backgroundColor: !loggedInUser?.profilePic ? '#f0f0f0' : undefined,
									flexShrink: 0
								}}
							/>
							<UserInfo>
								<Name>{userName}</Name>
								<Title>{userRole}</Title>
							</UserInfo>
						</Profile>
					</NavItem>
				</Dropdown>
			</div>

			<StyledModal
				title="Edit Profile"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={720}
				destroyOnClose
				centered
			>
				{userRole === "superadmin" ? (
					<Formik
						initialValues={{
							email: loggedInUser?.email || '',
							firstName: loggedInUser?.firstName || '',
							lastName: loggedInUser?.lastName || '',
							phone: loggedInUser?.phone || '',
							password: ''
						}}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({ handleSubmit, isSubmitting, errors, touched }) => (
							<FormContainer>
								<form onSubmit={handleSubmit}>
									<div className="form-section">
										<h3>Personal Information</h3>
										<div className="form-row">
											<FormField
												label="Email"
												name="email"
												required
												error={touched.email && errors.email}
											/>
											<FormField
												label="First Name"
												name="firstName"
												required
												error={touched.firstName && errors.firstName}
											/>
										</div>
										<div className="form-row">
											<FormField
												label="Last Name"
												name="lastName"
												required
												error={touched.lastName && errors.lastName}
											/>
											<FormField label="Phone" name="phone" required>
												<Input.Group compact>
													<Select
														defaultValue="91"
														style={{ width: '30%' }}
													>
														<Select.Option value="91">+91</Select.Option>
														<Select.Option value="1">+1</Select.Option>
														<Select.Option value="44">+44</Select.Option>
													</Select>
													<Input
														style={{ width: '70%' }}
														name="phone"
														placeholder="Enter phone number"
													/>
												</Input.Group>
											</FormField>
										</div>
									</div>

									<div className="form-section">
										<h3>Security</h3>
										<div className="form-row">
											<FormField
												label="New Password"
												name="password"
												type="password"
												error={touched.password && errors.password}
											/>
											<FormField label="Profile Picture">
												<Upload {...uploadProps}>
													<Button icon={<UploadOutlined />}>
														Upload Photo
													</Button>
												</Upload>
											</FormField>
										</div>
									</div>

									<div className="form-actions">
										<Button onClick={() => setIsModalVisible(false)}>
											Cancel
										</Button>
										<Button
											type="primary"
											htmlType="submit"
											loading={isSubmitting}
										>
											Save Changes
										</Button>
									</div>
								</form>
							</FormContainer>
						)}
					</Formik>
				) : (
					<EditCompany
						comnyid={loggedInUser?.id}
						onClose={() => setIsModalVisible(false)}
					/>
				)}
			</StyledModal>
		</>
	);
};

export default React.memo(NavProfile);
