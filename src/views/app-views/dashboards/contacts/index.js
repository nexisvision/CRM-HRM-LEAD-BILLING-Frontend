import React, { Component } from 'react'
import { Card, Table, Tag, Menu, Tooltip, message, Button } from 'antd';
import { EyeOutlined, DeleteOutlined,PushpinOutlined,MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from './UserView';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from "assets/data/user-list.data.json";
import Flex from 'components/shared-components/Flex'


export class Contacts extends Component {

	state = {
		users: userData,
		userProfileVisible: false,
		selectedUser: null
	}

	deleteUser = userId => {
		this.setState({
			users: this.state.users.filter(item => item.id !== userId),
		})
		message.success({ content: `Deleted user ${userId}`, duration: 2 });
	}

	showUserProfile = userInfo => {
		this.setState({
			userProfileVisible: true,
			selectedUser: userInfo
		});
	};
	
	closeUserProfile = () => {
		this.setState({
			userProfileVisible: false,
			selectedUser: null
    });
	}

	render() {
		const { users, userProfileVisible, selectedUser } = this.state;

		const dropdownMenu = elm => (
			<Menu>
				
				<Menu.Item>
					<Flex alignItems="center">
						{/* <EyeOutlined />
						<span className="ml-2">View Details</span> */}
					 
					<Button type="" className="" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
					<span className="">View Details</span>
					</Button>
					</Flex>
				</Menu.Item>
				<Menu.Item>
					<Flex alignItems="center">
						{/* <EyeOutlined />
						<span className="ml-2">View Details</span> */}
					 
					 <Button type="" className="" icon={<MailOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
					<span className="">Send Mail</span>
					</Button>
					</Flex>
				</Menu.Item>
				<Menu.Item>
					<Flex alignItems="center">
						{/* <EyeOutlined />
						<span className="ml-2">View Details</span> */}
					 
					 <Button type="" className="" icon={<PushpinOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
					<span className="ml-2">Pin</span>
					</Button>
					</Flex>
				</Menu.Item>
				<Menu.Item>
					<Flex alignItems="center">
						{/* <DeleteOutlined />
						<span className="ml-2">Delete</span> */}
					
		<Button type="" className="" icon={<DeleteOutlined />} onClick={() => {this.deleteUser(elm.id)}} size="small"> 
		<span className="">Delete</span>
		</Button>
		
		
					</Flex>
				</Menu.Item>	
			</Menu>
		);


		const tableColumns = [
			{
				title: 'User',
				dataIndex: 'name',
				render: (_, record) => (
					<div className="d-flex">
						<AvatarStatus src={record.img} name={record.name} subTitle={record.email}/>
					</div>
				),
				sorter: {
					compare: (a, b) => {
						a = a.name.toLowerCase();
  						b = b.name.toLowerCase();
						return a > b ? -1 : b > a ? 1 : 0;
					},
				},
			},
			{
				title: 'Role',
				dataIndex: 'role',
				sorter: {
					compare: (a, b) => a.role.length - b.role.length,
				},
			},
			{
				title: 'Last online',
				dataIndex: 'lastOnline',
				render: date => (
					<span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>
				),
				sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix()
			},
			{
				title: 'Status',
				dataIndex: 'status',
				render: status => (
					<Tag className ="text-capitalize" color={status === 'active'? 'cyan' : 'red'}>{status}</Tag>
				),
				sorter: {
					compare: (a, b) => a.status.length - b.status.length,
				},
			},
			{
				title: 'Action',
				dataIndex: 'actions',
				render: (_, elm) => (
					<div className="text-center">
						<EllipsisDropdown menu={dropdownMenu(elm)}/>
					</div>
				)
			},
			// {
			// 	title: '',
			// 	dataIndex: 'actions',
			// 	render: (_, elm) => (
			// 		<div className="text-right d-flex justify-content-end">
			// 			<Tooltip title="View">
			// 				<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small"/>
			// 			</Tooltip>
			// 			<Tooltip title="Delete">
			// 				<Button danger icon={<DeleteOutlined />} onClick={()=> {this.deleteUser(elm.id)}} size="small"/>
			// 			</Tooltip>
			// 		</div>
			// 	)
			// }
		];
		return (
			<Card bodyStyle={{'padding': '0px'}}>
				<div className="table-responsive">
					<Table columns={tableColumns} dataSource={users} rowKey='id' />
				</div>
				<UserView data={selectedUser} visible={userProfileVisible} close={()=> {this.closeUserProfile()}}/>
			</Card>
		)
	}
}

export default Contacts
