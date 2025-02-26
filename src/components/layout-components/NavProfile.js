import React, { useEffect, useState, useRef } from 'react';
import { Dropdown, Avatar, Modal, Form, Input, Upload, Button, message } from 'antd';
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

		// Set initial form values for superadmin
		if (roleu === "superadmin") {
			form.setFieldsValue({
				email: currentuser?.loggedInUser?.email,
				firstName: currentuser?.loggedInUser?.firstName,
				lastName: currentuser?.loggedInUser?.lastName,
				phone: currentuser?.loggedInUser?.phone,
			});
		}
	}, [roles, currentuser, roleu]);

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

	const handleSuperAdminSubmit = async (values) => {
		try {
			// Handle superadmin profile update
			const formData = new FormData();
			formData.append('email', values.email);
			formData.append('firstName', values.firstName);
			formData.append('lastName', values.lastName);
			formData.append('phone', values.phone);
			if (values.password) {
				formData.append('password', values.password);
			}
			if (values.profilePic) {
				formData.append('profilePic', values.profilePic);
			}

			// Dispatch your update action here
			// await dispatch(updateSuperAdminProfile(formData));
			message.success('Profile updated successfully');
			setIsEditModalVisible(false);
		} catch (error) {
			message.error('Failed to update profile');
		}
	};

	const SuperAdminEditForm = () => (
		<Form
			form={form}
			layout="vertical"
			onFinish={handleSuperAdminSubmit}
		>
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
				label="New Password"
				name="password"
				rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item
				label="Profile Picture"
				name="profilePic"
			>
				<Upload
					maxCount={1}
					beforeUpload={() => false}
					accept="image/*"
				>
					<Button icon={<UploadOutlined />}>Upload Photo</Button>
				</Upload>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit">
					Update Profile
				</Button>
			</Form.Item>
		</Form>
	);

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
