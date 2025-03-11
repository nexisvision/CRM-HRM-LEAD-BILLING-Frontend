import React, { useEffect, useState } from 'react';
import { Avatar, Modal, Input, Upload, Button, message, Select, Menu, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
	EditOutlined,
	LogoutOutlined,
	UserOutlined,
	UploadOutlined,
	PlusOutlined
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { signOut } from 'store/slices/authSlice';
import { updateUser, getUserById, updateSuperAdmin } from 'views/auth-views/auth-reducers/UserSlice';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER } from 'constants/ThemeConstant';
import EditCompany from 'views/app-views/company/EditCompany';
import { Formik } from "formik";
import AddCountries from "views/app-views/setting/countries/AddCountries";
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';


const { Option } = Select;

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

const FormField = ({ label, name, type = "text", required, children, error }) => (
	<div className="form-field">
		<label>{label} {required && <span style={{ color: '#dc3545' }}>*</span>}</label>
		{children}
		{error && <div className="error-message">{error}</div>}
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
	const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
	const countries = useSelector((state) => state.countries?.countries);

	useEffect(() => {
		if (!roles || !loggedInUser) return;

		const rolee = loggedInUser?.role_id;

		const role = roles.find(r => r?.id === rolee)?.role_name;

		setUserRole(role || "");

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

	useEffect(() => {
		dispatch(getallcountries());
	}, [dispatch]);

	const handleSubmit = async (values, { setSubmitting }) => {
		try {
			const formData = new FormData();

			// Append basic fields
			formData.append('id', loggedInUser?.id);
			formData.append('firstName', values.firstName);
			formData.append('lastName', values.lastName);
			formData.append('phone', values.phone);
			if (values.password) {
				formData.append('password', values.password);
			}

			if (fileList[0]?.originFileObj) {
				formData.append('profilePic', fileList[0].originFileObj);
			}

			let response;
			if (userRole === "super-admin") {
				response = await dispatch(updateSuperAdmin({
					id: loggedInUser.id,
					data: formData
				}));
			} else {
				response = await dispatch(updateUser(formData));
			}

			if (response?.payload?.success || response?.payload?.status === 200) {
				message.success('Profile updated successfully');
				await dispatch(getUserById(loggedInUser.id));
				setIsModalVisible(false);
			}
		} catch (error) {
			message.error('Failed to update profile');
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

			setFileList([{
				originFileObj: file,
				uid: '-1',
				name: file.name,
				status: 'done',
				url: URL.createObjectURL(file)
			}]);
			return false;
		},
		onRemove: () => {
			setFileList([]);
			return true;
		},
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
				width={1000}

				centered
			>
				{userRole === "super-admin" ? (
					<Formik
						initialValues={{
							firstName: loggedInUser?.firstName || '',
							lastName: loggedInUser?.lastName || '',
							phoneCode: '+91',
							phone: loggedInUser?.phone || '',
							password: '',
							profilePic: loggedInUser?.profilePic || ''
						}}
						onSubmit={handleSubmit}
					>
						{({ handleSubmit, isSubmitting, errors, touched, handleChange, values, setFieldValue }) => (
							<FormContainer>
								<form onSubmit={handleSubmit}>
									<div className="form-section">
										<h3>Personal Information</h3>
										<div className="form-row">
											<FormField
												label="First Name"
												name="firstName"
												required
											>
												<Input
													name="firstName"
													value={values.firstName}
													onChange={handleChange}
													placeholder="Enter first name"
												/>
											</FormField>
										</div>
										<div className="form-row">
											<FormField
												label="Last Name"
												name="lastName"
												required
											>
												<Input
													name="lastName"
													value={values.lastName}
													onChange={handleChange}
													placeholder="Enter last name"
												/>
											</FormField>
											<FormField label="Phone" name="phone" required>
												<Input.Group compact>
													<Select
														name="phoneCode"
														style={{ width: '80px' }}
														value={values.phoneCode}
														onChange={(value) => {
															if (value === 'add_new') {
																setIsAddPhoneCodeModalVisible(true);
															} else {
																setFieldValue('phoneCode', value);
															}
														}}
														className="phone-code-select"
														dropdownStyle={{ minWidth: '180px' }}
														suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
														dropdownRender={menu => (
															<div>
																<div
																	className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
																	onClick={() => setIsAddPhoneCodeModalVisible(true)}
																>
																	<PlusOutlined className="mr-2" />
																	<span className="text-sm">Add New</span>
																</div>
																{menu}
															</div>
														)}
													>
														{countries?.map((country) => (
															<Option key={country.id} value={country.phoneCode}>
																<div className="flex items-center w-full px-1">
																	<span className="text-base min-w-[40px]">{country.phoneCode}</span>
																	<span className="text-gray-600 text-sm ml-3">{country.countryName}</span>
																	<span className="text-gray-400 text-xs ml-auto">{country.countryCode}</span>
																</div>
															</Option>
														))}
													</Select>
													<Input
														style={{ width: '70%' }}
														name="phone"
														value={values.phone}
														onChange={(e) => {
															const value = e.target.value.replace(/\D/g, '');
															if (value.length <= 15) {
																setFieldValue('phone', value);
															}
														}}
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
											>
												<Input.Password
													name="password"
													value={values.password}
													onChange={handleChange}
													placeholder="Enter new password"
												/>
											</FormField>
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

			<Modal
				title="Add New Country"
				visible={isAddPhoneCodeModalVisible}
				onCancel={() => setIsAddPhoneCodeModalVisible(false)}
				footer={null}
				width={600}
			>
				<AddCountries
					onClose={() => {
						setIsAddPhoneCodeModalVisible(false);
						dispatch(getallcountries());
					}}
				/>
			</Modal>

			<style jsx="true">{`
				.phone-code-select .ant-select-selector {
					background-color: #f8fafc !important;
					border-top-right-radius: 0 !important;
					border-bottom-right-radius: 0 !important;
					border-right: 0 !important;
				}

				.phone-code-select .ant-select-selection-item {
					display: flex !important;
					align-items: center !important;
					justify-content: center !important;
					font-size: 16px !important;
				}

				.phone-code-select .ant-select-selection-item > div {
					display: flex !important;
					align-items: center !important;
				}

				.phone-code-select .ant-select-selection-item span:not(:first-child) {
					display: none !important;
				}
			`}</style>
		</>
	);
};

export default React.memo(NavProfile);
