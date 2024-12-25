import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Select,
  Input,
  Menu,
  message,
  Button,
  Modal,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from './UserView';
import Flex from 'components/shared-components/Flex';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import OrderListData from 'assets/data/order-list.data.json';
import AddUser from './AddUser'; // Assuming AddUser is a component
import EditUser from './EditUser'; // Assuming EditUser is a component
import utils from 'utils';
import ResetPassword from './ResetPassword';

const UserList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);


  const paymentStatusList = ['active', 'blocked'];

  const handleShowStatus = (value) => {
    if (value !== 'All') {
      const key = 'status';
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const openAddUserModal = () => {
    setIsAddUserModalVisible(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalVisible(false);
  };

  const openEditUserModal = () => {
    setIsEditUserModalVisible(true);
  };

  const closeEditUserModal = () => {
    setIsEditUserModalVisible(false);
  };

  const openResetPasswordModal = () => {
    setIsResetPasswordModalVisible(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            View Details
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EditOutlined />}
            onClick={openEditUserModal}
            size="small"
          >
            Edit
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={openResetPasswordModal}
            size="small"
          >
            Reset Password
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(elm.id)}
            size="small"
          >
            Delete
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
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: (a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? -1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? 1
          : 0,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: 'Last online',
      dataIndex: 'lastOnline',
      render: (date) => <span>{dayjs.unix(date).format('MM/DD/YYYY')} </span>,
      sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag
          className="text-capitalize"
          color={status === 'active' ? 'cyan' : 'red'}
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Select.Option value="All">Status</Select.Option>
              {paymentStatusList.map((elm) => (
                <Select.Option key={elm} value={elm}>
                  {elm}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddUserModal}>
            <PlusOutlined />
            New
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />
      <Modal
        title="Create User"
        visible={isAddUserModalVisible}
        onCancel={closeAddUserModal}
        footer={null}
        width={1100}
        // className="mt-[-70px]"
      >
        <AddUser onClose={closeAddUserModal} />
      </Modal>
      <Modal
        title="Edit User"
        visible={isEditUserModalVisible}
        onCancel={closeEditUserModal}
        footer={null}
        width={1000}
      >
        <EditUser onClose={closeEditUserModal} />
      </Modal>

      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={closeResetPasswordModal}
        footer={null}
        width={1000}
      >
        <ResetPassword onClose={closeResetPasswordModal} />
      </Modal>
    </Card>
  );
};

export default UserList;













// import React, { Component, useState } from 'react'
// import { Card, Table, Tag, Select,Input,Menu, message, Button } from 'antd';
// import { EyeOutlined, DeleteOutlined,SearchOutlined,PlusOutlined,FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from './UserView';
// import Flex from 'components/shared-components/Flex'
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import userData from "assets/data/user-list.data.json";
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import OrderListData from "assets/data/order-list.data.json"

// import utils from 'utils'


// export class UserList extends Component {


	
// 	state = {
// 		users: userData,
// 		userProfileVisible: false,
// 		selectedUser: null,
// 		list: OrderListData, // Initialize with OrderListData
//         selectedRowKeys: [], 
// 	}



//  // Open Add Job Modal
//  const openAddUserModal = () => {
//     setIsAddUserModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddUserModal = () => {
//     setIsAddUserModalVisible(false);
//   };

//    // Open Add Job Modal
//    const openEditUserModal = () => {
//     setIsEditUserModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeEditUserModal = () => {
//     setIsEditUserModalVisible(false);
//   };

// 	handleShowStatus = (value) => {
//         const { list } = this.state;
//         if (value !== 'All') {
//             const key = 'status';
//             const data = utils.filterArray(OrderListData, key, value);
//             this.setState({ list: data });
//         } else {
//             this.setState({ list: OrderListData });
//         }
//     };

// 	onSearch = (e) => {
//         const { list } = this.state;
//         const value = e.currentTarget.value;
//         const searchArray = value ? list : OrderListData;
//         const data = utils.wildCardSearch(searchArray, value);
//         this.setState({ list: data, selectedRowKeys: [] });
//     };

// 	deleteUser = userId => {
// 		this.setState({
// 			users: this.state.users.filter(item => item.id !== userId),
// 		})
// 		message.success({ content: `Deleted user ${userId}`, duration: 2 });
// 	}

// 	showUserProfile = userInfo => {
// 		this.setState({
// 			userProfileVisible: true,
// 			selectedUser: userInfo
// 		});
// 	};
	
// 	closeUserProfile = () => {
// 		this.setState({
// 			userProfileVisible: false,
// 			selectedUser: null
//     });
// 	}

// 	render() {
// 		const { users, userProfileVisible, selectedUser } = this.state;
	
	
// 		// const handleShowStatus = value => {
// 		// 	if(value !== 'All') {
// 		// 		const key = 'priority'
// 		// 		const data = utils.filterArray(OrderListData, key, value)
// 		// 		setList(data)
// 		// 	} else {
// 		// 		setList(OrderListData)
// 		// 	}
// 		// }

		
// const { Column } = Table;

// const { Option } = Select

// const getPaymentStatus = status => {
// 	if(status === 'Paid') {
// 		return 'success'
// 	}
// 	if(status === 'Pending') {
// 		return 'warning'
// 	}
// 	if(status === 'Expired') {
// 		return 'error'
// 	}
// 	return ''
// }

// const getShippingStatus = status => {
// 	if(status === 'Ready') {
// 		return 'blue'
// 	}
// 	if(status === 'Shipped') {
// 		return 'cyan'
// 	}
// 	return ''
// }

// const dropdownMenu = elm => (
// 	<Menu>
		
// 		<Menu.Item>
// 			<Flex alignItems="center">
// 				{/* <EyeOutlined />
// 				<span className="ml-2">View Details</span> */}
			 
// 			<Button type="" className="" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
// 			<span className="">View Details</span>
// 			</Button>
// 			</Flex>
// 		</Menu.Item>
//         <Menu.Item>
// 			<Flex alignItems="center">
// 				{/* <EyeOutlined />
// 				<span className="ml-2">View Details</span> */}
			 
// 			<Button type="" className="" icon={<EyeOutlined />} onClick={openEditUserModal} size="small">
// 			<span className="">Edit</span>
// 			</Button>
// 			</Flex>
// 		</Menu.Item>
// 		<Menu.Item>
// 			<Flex alignItems="center">
// 				{/* <DeleteOutlined />
// 				<span className="ml-2">Delete</span> */}
			
// <Button type="" className="" icon={<DeleteOutlined />} onClick={() => {this.deleteUser(elm.id)}} size="small"> 
// <span className="">Delete</span>
// </Button>


// 			</Flex>
// 		</Menu.Item>	
// 	</Menu>
// );

// const paymentStatusList = ['active', 'blocked']

// 		const tableColumns = [
// 			{
// 				title: 'User',
// 				dataIndex: 'name',
// 				render: (_, record) => (
// 					<div className="d-flex">
// 						<AvatarStatus src={record.img} name={record.name} subTitle={record.email}/>
// 					</div>
// 				),
// 				sorter: {
// 					compare: (a, b) => {
// 						a = a.name.toLowerCase();
//   						b = b.name.toLowerCase();
// 						return a > b ? -1 : b > a ? 1 : 0;
// 					},
// 				},
// 			},
// 			{
// 				title: 'Role',
// 				dataIndex: 'role',
// 				sorter: {
// 					compare: (a, b) => a.role.length - b.role.length,
// 				},
// 			},
// 			{
// 				title: 'Last online',
// 				dataIndex: 'lastOnline',
// 				render: date => (
// 					<span>{dayjs.unix(date).format("MM/DD/YYYY")} </span>
// 				),
// 				sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix()
// 			},
// 			{
// 				title: 'Status',
// 				dataIndex: 'status',
// 				render: status => (
// 					<Tag className ="text-capitalize" color={status === 'active'? 'cyan' : 'red'}>{status}</Tag>
// 				),
// 				sorter: {
// 					compare: (a, b) => a.status.length - b.status.length,
// 				},
// 			},


// 			{
// 				title: 'Action',
// 				dataIndex: 'actions',
// 				render: (_, elm) => (
// 					<div className="text-center">
// 						<EllipsisDropdown menu={dropdownMenu(elm)}/>
// 					</div>
// 				)
// 			},
// 			// {
// 			// 	title: 'Action',
// 			// 	dataIndex: 'actions',
// 			// 	render: (_, elm) => (
// 			// 		<div className="text-right d-flex justify-content-center">
// 			// 			<Tooltip title="View">
// 			// 				<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small"/>
// 			// 			</Tooltip>
// 			// 			<Tooltip title="Delete">
// 			// 				<Button danger icon={<DeleteOutlined />} onClick={()=> {this.deleteUser(elm.id)}} size="small"/>
// 			// 			</Tooltip>
// 			// 		</div>
// 			// 	)
// 			// }
// 		];

// 		// const onSearch = e => {
// 		// 	const value = e.currentTarget.value
// 		// 	const searchArray = e.currentTarget.value? list : OrderListData
// 		// 	const data = utils.wildCardSearch(searchArray, value)
// 		// 	setList(data)
// 		// 	setSelectedRowKeys([])
// 		// }

// 		return (
// 			<Card bodyStyle={{'padding': '-3px'}}>
// 				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
// 				<Flex className="mb-1" mobileFlex={false}>
// 					<div className="mr-md-3 mb-3">
// 						<Input placeholder="Search" prefix={<SearchOutlined />}  onChange={(e) => this.onSearch(e)}/>
// 					</div>
// 					<div className="mb-3">
// 					<Select
//   defaultValue="All"
//   className="w-100"
//   style={{ minWidth: 180 }}
//   onChange={(value) => this.handleShowStatus(value)} // Use `this.handleShowStatus`
//   placeholder="Status"
// >
//   <Option value="All">Status</Option>
//   {paymentStatusList.map((elm) => (
//     <Option key={elm} value={elm}>
//       {elm}
//     </Option>
//   ))}
// </Select>
// 					</div>
// 				</Flex>								
// 				<Flex gap="7px">
				
// 				<Button type="primary" className="ml-2" onClick={openAddUserModal}>
// 								<PlusOutlined />
// 								<span>New</span>
// 							</Button>
// 					<Button type="primary" icon={<FileExcelOutlined />} block>Export All</Button>
// 				</Flex>
// 			</Flex>
// 				<div className="table-responsive mt-2">
// 					<Table columns={tableColumns} dataSource={users} rowKey='id' />
// 				</div>
// 				<UserView data={selectedUser} visible={userProfileVisible} close={()=> {this.closeUserProfile()}}/>
//                 <Modal
//         title="Create User"
//         visible={isAddUserModalVisible}
//         onCancel={closeAddUserModal}
//         footer={null}
//         width={1100}
//         className='mt-[-70px]'
//         // height={1000}
//       >
//         <AddUser onClose={closeAddUserModal} />
//       </Modal>

//       <Modal
//         title="Edit User"
//         visible={isEditUserModalVisible}
//         onCancel={closeEditUserModal}
//         footer={null}
//         width={1000}
//         // height={1000}
//       >
//         <EditUser  onClose={closeEditUserModal} />
//       </Modal>
// 			</Card>
// 		)
// 	}
// }

// export default UserList
