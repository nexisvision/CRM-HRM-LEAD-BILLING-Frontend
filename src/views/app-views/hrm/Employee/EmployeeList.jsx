import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, EditOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import ViewEmployee from './ViewEmployee';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEmp, empdata } from './EmployeeReducers/EmployeeSlice';

const EmployeeList = () => {
  // State declarations
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch()
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [isViewEmployeeModalVisible, setIsViewEmployeeModalVisible] = useState(false);
  const tabledata = useSelector((state) => state.emp);
  console.log("employeee",tabledata)
  const [sub,setSub] = useState(false);

  // Modal handlers
  const openAddEmployeeModal = () => setIsAddEmployeeModalVisible(true);
  const closeAddEmployeeModal = () => setIsAddEmployeeModalVisible(false);
  // const openEditEmployeeModal = () => setIsEditEmployeeModalVisible(true);
  const openViewEmployeeModal = () => setIsViewEmployeeModalVisible(true);
  const closeViewEmployeeModal = () => setIsViewEmployeeModalVisible(false);
  
  const closeEditEmployeeModal = () => setIsEditEmployeeModalVisible(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

const openEditEmployeeModal = (empId) => {
  setSelectedEmployeeId(empId); 
  setIsEditEmployeeModalVisible(true);
};

  // Search handler
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };


  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteEmp(userId)); 
  
      const updatedData = await dispatch(empdata());
      console.log("lll",updatedData)
  
      setUsers(updatedData.emp.data || updatedData.payload.data);
  
      message.success({ content: 'Deleted user successfully', duration: 2 });
    } catch (error) {
      // message.error({ content: 'Failed to delete user', duration: 2 });
      console.error('Error deleting user:', error);
    }
  };
  
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };


  useEffect(() => {
    dispatch(empdata());
    setSub(false);
  }, [sub,dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.emp && tabledata.emp.data) {
      setUsers(tabledata.emp.data);
    }
  }, [tabledata]);

  // Dropdown menu component
  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} onClick={openViewEmployeeModal} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<MailOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<FilePdfOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">Download CV</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
        <Button 
  type="" 
  className="" 
  icon={<EditOutlined />} 
  onClick={() => openEditEmployeeModal(elm.id)} 
  size="small"
>
  <span className="ml-2">Edit</span>
</Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small">
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  // Table columns configuration
  const tableColumns = [
    // {
    //   title: 'User',
    //   dataIndex: 'name',
    //   render: (_, record) => (
    //     <div className="d-flex">
    //       <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
    //     </div>
    //   ),
    //   sorter: {
    //     compare: (a, b) => {
    //       a = a.name.toLowerCase();
    //       b = b.name.toLowerCase();
    //       return a > b ? -1 : b > a ? 1 : 0;
    //     },
    //   },
    // },
    {
      title: 'User',
      dataIndex: `firstName`,
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      sorter: {
        compare: (a, b) => a.department.length - b.department.length,
      },
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      sorter: {
        compare: (a, b) => a.designation.length - b.designation.length,
      },
    },
    {
      title: 'Date OF Joining',
      dataIndex: 'joiningDate',
      sorter: {
        compare: (a, b) => a.dateofjoining.length - b.dateofjoining.length,
      },
    },
    {
      title: 'Last online',
      dataIndex: 'lastOnline',
      sorter: {
        compare: (a, b) => a.lastOnline.length - b.lastOnline.length,
      },
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      )
    },
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddEmployeeModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      <Modal
        title="Add Employee"
        visible={isAddEmployeeModalVisible}
        onCancel={closeAddEmployeeModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddEmployee onClose={closeAddEmployeeModal} setSub={setSub} />
      </Modal>
      <Modal
  title="Edit Employee"
  visible={isEditEmployeeModalVisible}
  onCancel={closeEditEmployeeModal}
  footer={null}
  width={1000}
  className='mt-[-70px]'
>
  <EditEmployee onClose={closeEditEmployeeModal} employeeIdd={selectedEmployeeId} />
</Modal>

      <Modal
        title={<span className="text-2xl font-bold">Employee Details</span>}
        visible={isViewEmployeeModalVisible}
        onCancel={closeViewEmployeeModal}
        footer={null}
        width={1000}
        className='mt-[-80px]'
      >
        <ViewEmployee onClose={closeViewEmployeeModal} />
      </Modal>
    </Card>
  );
};

export default EmployeeList;







// import React, { Component, useState } from 'react'
// import { Card, Table, Tag, Select,Input, Tooltip, message, Button } from 'antd';
// import { EyeOutlined, DeleteOutlined,SearchOutlined,PlusOutlined,FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../pages/user-list/UserView';
// import Flex from 'components/shared-components/Flex'
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import { Link, useLocation } from 'react-router-dom';



// import utils from 'utils'


// export class EmployeeList extends Component {


	
// 	state = {
// 		users: userData,
// 		userProfileVisible: false,
// 		selectedUser: null,
// 		list: OrderListData, // Initialize with OrderListData
//         selectedRowKeys: [], 
// 	}

// 	// handleShowStatus = (value) => {
//     //     const { list } = this.state;
//     //     if (value !== 'All') {
//     //         const key = 'status';
//     //         const data = utils.filterArray(OrderListData, key, value);
//     //         this.setState({ list: data });
//     //     } else {
//     //         this.setState({ list: OrderListData });
//     //     }
//     // };

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
// 					<div className="text-right d-flex justify-content-center">
// 						<Tooltip title="View">
// 							<Button type="primary" className="mr-2" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small"/>
// 						</Tooltip>
// 						<Tooltip title="Delete">
// 							<Button danger icon={<DeleteOutlined />} onClick={()=> {this.deleteUser(elm.id)}} size="small"/>
// 						</Tooltip>
// 					</div>
// 				)
// 			}
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
// 				{/* <Link to={`localhost:3000/app/hrm/employee/newemployee`}> */}
					
// 				<Button type="primary" className="ml-2">
// 								<PlusOutlined />
// 								<span>New</span>
// 							</Button>
                            
// 				{/* </Link> */}
// 					<Button type="primary" icon={<FileExcelOutlined />} block>Export All</Button>
// 				</Flex>
// 			</Flex>
// 				<div className="table-responsive mt-2">
// 					<Table columns={tableColumns} dataSource={users} rowKey='id' />
// 				</div>
// 				<UserView data={selectedUser} visible={userProfileVisible} close={()=> {this.closeUserProfile()}}/>
// 			</Card>
// 		)
// 	}
// }

// export default EmployeeList
