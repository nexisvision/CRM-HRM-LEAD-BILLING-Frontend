import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Avatar, Modal, Form, Input, Upload, Button, message, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
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
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from 'constants/ThemeConstant';
import EditCompany from 'views/app-views/company/EditCompany';
// import { Avatar } from 'antd';
// import { UserOutlined } from '@ant-design/icons';


const Icon = styled.div(() => ({
	fontSize: FONT_SIZES.LG
}))

const Profile = styled.div(() => ({
	display: 'flex',
	alignItems: 'center'
}))

const UserInfo = styled('div')`
	padding-left: ${SPACER[2]};

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none
	}
`

const Name = styled.div(() => ({
	fontWeight: FONT_WEIGHT.SEMIBOLD
}))

const Title = styled.span(() => ({
	opacity: 0.8
}))

const MenuItem = (props) => {
	const { onClick } = props;
	return (
		<Flex as="div" onClick={onClick} style={{ cursor: 'pointer' }} alignItems="center" gap={SPACER[2]}>
			<Icon>{props.icon}</Icon>
			<span>{props.label}</span>
		</Flex>
	);
}

const MenuItemSignOut = (props) => {

	const dispatch = useDispatch();



	const handleSignOut = () => {
		dispatch(signOut())
	}

	return (
		<div onClick={handleSignOut}>
			<Flex alignItems="center" gap={SPACER[2]} >
				<Icon>
					<LogoutOutlined />
				</Icon>
				<span>{props.label}</span>
			</Flex>
		</div>
	)
}

export const NavProfile = ({ mode }) => {
	const [isEditModalVisible, setIsEditModalVisible] = useState(false);
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [menuPosition, setMenuPosition] = useState();
	const profileRef = useRef(null);
	const dispatch = useDispatch();
	const roles = useSelector((state) => state.role);
	const currentuser = useSelector((state) => state.user);
	const [roleu, setRoleu] = useState("");
	const [current, setCurrent] = useState("");
	const [form] = Form.useForm();

	// Move items inside the component
	const items = [
		{
			key: 'Edit Profile',
			label: (
				<MenuItem
					label="Edit Profile"
					icon={<EditOutlined />}
					className="mb-3"
					onClick={() => setIsEditModalVisible(true)}
				/>
			),
		},
		{
			key: 'Account Setting',
			label: <MenuItem path="/" label="Account Setting" icon={<SettingOutlined />} />,
		},
		{
			key: 'Account Billing',
			label: <MenuItem path="/" label="Account Billing" icon={<ShopOutlined />} />,
		},
		{
			key: 'Help Center',
			label: <MenuItem path="/" label="Help Center" icon={<QuestionCircleOutlined />} />,
		},
		{
			key: 'Sign Out',
			label: <MenuItemSignOut label="Sign Out" />,
		}
	]

	useEffect(() => {
		const roless = roles?.role.data;
		const userRole = roless && roless?.find(
			(role) => role?.role_id === currentuser?.loggedInUser?.role_id
		);

		setRoleu(userRole?.role_name || "");
		setCurrent(currentuser?.loggedInUser?.username || "");

		// Set initial form values with all available user data
		if (currentuser?.loggedInUser) {
			form.setFieldsValue({
				email: currentuser?.loggedInUser?.email,
				firstName: currentuser?.loggedInUser?.firstName,
				lastName: currentuser?.loggedInUser?.lastName,
				phone: currentuser?.loggedInUser?.phone,
				address: currentuser?.loggedInUser?.address,
				state: currentuser?.loggedInUser?.state,
				gstIn: currentuser?.loggedInUser?.gstIn,
				accountholder: currentuser?.loggedInUser?.accountholder,
				accountnumber: currentuser?.loggedInUser?.accountnumber,
				bankname: currentuser?.loggedInUser?.bankname,
				ifsc: currentuser?.loggedInUser?.ifsc,
				banklocation: currentuser?.loggedInUser?.banklocation,
				accounttype: currentuser?.loggedInUser?.accounttype,
			});
		}
	}, [roles, currentuser, roleu, form]);

	const handleProfileClick = () => {
		if (profileRef.current) {
			const rect = profileRef.current.getBoundingClientRect();
			setMenuPosition({
				top: rect.bottom + 5,
				right: window.innerWidth - rect.right
			});
			setShowProfileMenu(!showProfileMenu);
		}
	};

	// Function to refresh user data after profile update
	const refreshUserData = async () => {
		if (currentuser?.loggedInUser?.id) {
			try {
				await dispatch(getUserById(currentuser.loggedInUser.id));
			} catch (error) {
				console.error('Error refreshing user data:', error);
			}
		}
	};

	const handleSuperAdminSubmit = async (values) => {
		try {
			// Create form data for user update
			const formData = new FormData();

			// Add user ID to formData
			formData.append('id', currentuser?.loggedInUser?.id);

			// Loop through all values and append to formData
			Object.keys(values).forEach(key => {
				// For all fields except profilePic
				if (key !== 'profilePic') {
					// Skip empty values, except for fields that can be legitimately empty like password
					if (values[key] !== undefined && values[key] !== null && (values[key] !== '' || key === 'password')) {
						formData.append(key, values[key]);
					}
				}
			});

			// Special handling for profile pic
			if (values.profilePic && values.profilePic.length > 0) {
				// Check if it's a new file being uploaded
				const fileItem = values.profilePic[0];
				if (fileItem.originFileObj) {
					formData.append('profilePic', fileItem.originFileObj);
				}
			}

			// For debugging - log the form data (except file contents)
			console.log('Form data keys being sent:', [...formData.entries()]
				.map(entry => entry[0] === 'profilePic' ? ['profilePic', '[File object]'] : entry));

			// Dispatch the update user action
			const response = await dispatch(updateUser(formData)).unwrap();

			if (response && (response.status === 200 || response.success)) {
				message.success('Profile updated successfully');

				// Refresh user data after successful update
				await refreshUserData();

				// Close the modal
				setIsEditModalVisible(false);
			} else {
				throw new Error(response?.message || 'Failed to update profile');
			}
		} catch (error) {
			console.error('Profile update error:', error);
			message.error(error.message || 'Failed to update profile');
		}
	};

	const SuperAdminEditForm = () => {
		// Get the default file list for the Upload component
		const getDefaultFileList = () => {
			if (currentuser?.loggedInUser?.profilePic) {
				return [
					{
						uid: '-1',
						name: 'Profile Picture',
						status: 'done',
						url: currentuser.loggedInUser.profilePic,
					}
				];
			}
			return [];
		};

		// Custom normalization for file upload
		const normFile = (e) => {
			if (Array.isArray(e)) {
				return e;
			}
			return e?.fileList;
		};

		return (
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSuperAdminSubmit}
				className="grid grid-cols-1 md:grid-cols-2 gap-4"
				initialValues={{
					...currentuser?.loggedInUser,
					password: '' // Initialize password as empty
				}}
			>
				<div className="col-span-2">
					<h3 className="text-lg font-semibold mb-4">Personal Information</h3>
				</div>

				<Form.Item
					label="Email"
					name="email"
					rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="First Name"
					name="firstName"
					rules={[{ required: true, message: 'Please enter your first name' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Last Name"
					name="lastName"
					rules={[{ required: true, message: 'Please enter your last name' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Phone"
					name="phone"
					rules={[{ required: true, message: 'Please enter your phone number' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Address"
					name="address"
					className="col-span-2"
				>
					<Input.TextArea rows={2} />
				</Form.Item>

				<Form.Item
					label="State"
					name="state"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="GST Number"
					name="gstIn"
				>
					<Input />
				</Form.Item>

				<div className="col-span-2">
					<h3 className="text-lg font-semibold mb-4 mt-4">Banking Information</h3>
				</div>

				<Form.Item
					label="Bank Name"
					name="bankname"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Account Holder"
					name="accountholder"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Account Number"
					name="accountnumber"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="IFSC Code"
					name="ifsc"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Bank Location"
					name="banklocation"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Account Type"
					name="accounttype"
				>
					<Select>
						<Select.Option value="saving">Saving</Select.Option>
						<Select.Option value="current">Current</Select.Option>
					</Select>
				</Form.Item>

				<div className="col-span-2">
					<h3 className="text-lg font-semibold mb-4 mt-4">Security</h3>
				</div>

				<Form.Item
					label="New Password"
					name="password"
					rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
					className="col-span-2"
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Profile Picture"
					name="profilePic"
					className="col-span-2"
					valuePropName="fileList"
					getValueFromEvent={normFile}
					initialValue={getDefaultFileList()}
				>
					<Upload
						name="profilePic"
						listType="picture-card"
						maxCount={1}
						beforeUpload={() => false}
						accept="image/*"
					>
						<div>
							<UploadOutlined />
							<div style={{ marginTop: 8 }}>Upload</div>
						</div>
					</Upload>
				</Form.Item>

				<Form.Item className="col-span-2">
					<Button type="primary" htmlType="submit" block>
						Update Profile
					</Button>
				</Form.Item>
			</Form>
		);
	};

	const ProfileMenu = () => (
		<div
			style={{
				position: 'fixed',
				top: menuPosition.top,
				right: menuPosition.right,
				backgroundColor: 'white',
				boxShadow: '0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)',
				borderRadius: '8px',
				padding: '4px 0',
				zIndex: 1000,
				minWidth: '160px'
			}}
		>
			{items.map(item => (
				<div
					key={item.key}
					style={{
						padding: '5px 12px',
						lineHeight: '22px',
						cursor: 'pointer',
						transition: 'all 0.3s',
						display: 'flex',
						alignItems: 'center',
						gap: '8px'
					}}
					className="ant-dropdown-menu-item mt-[12px]"

					onClick={() => {
						setShowProfileMenu(false);
						if (item.key === 'Edit Profile') {
							setIsEditModalVisible(true);
						}
						// Handle other menu item clicks
					}}
				>
					{item.label}
				</div>
			))}
		</div>
	);

	return (
		<>
			<div ref={profileRef} onClick={handleProfileClick} style={{ cursor: 'pointer', margin: 'auto', alignItems: 'center' }}>
				<NavItem mode={mode}>
					<Profile >
						{currentuser?.loggedInUser?.profilePic ? (
							<Avatar
								src={currentuser?.loggedInUser?.profilePic}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = "";
									e.target.style.display = "none";
								}}
							/>
						) : (
							<Avatar
								icon={<UserOutlined style={{ color: '#666666' }} />}
								style={{ backgroundColor: '#f0f0f0' }}
							/>
						)}
						<UserInfo className="profile-text">
							<Name>{current}</Name>
							<Title>{roleu}</Title>
						</UserInfo>
					</Profile>
				</NavItem>
			</div>

			{showProfileMenu && <ProfileMenu />}

			{/* Edit Profile Modal */}
			<Modal
				title="Edit Profile"
				visible={isEditModalVisible}
				onCancel={() => setIsEditModalVisible(false)}
				footer={null}
				width={800}
			>
				{roleu === "superadmin" ? (
					<SuperAdminEditForm />
				) : (
					<EditCompany
						comnyid={currentuser?.loggedInUser?.id}
						onClose={() => setIsEditModalVisible(false)}
					/>
				)}
			</Modal>
		</>
	);
};

export default NavProfile;
