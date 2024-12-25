import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal ,Select} from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { AnnualStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddJob from './AddJob';
import { useNavigate } from 'react-router-dom';

import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import EditJob from './EditJob'

const { Option } = Select

const JobList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);
  const [isEditJobModalVisible, setIsEditJobModalVisible] = useState(false);
  const navigate = useNavigate();

  // const [isViewJobModalVisible, setIsViewJobModalVisible] = useState(false);


  const [annualStatisticData] = useState(AnnualStatisticData);

  // Open Add Job Modal
  const openAddJobModal = () => {
    setIsAddJobModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };

  const handleJob = () => {
    navigate('/app/hrm/jobs/viewjob', { state: { user: selectedUser } }); // Pass user data as state if needed
  };

   // Open Add Job Modal
   const openEditJobModal = () => {
    setIsEditJobModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditJobModal = () => {
    setIsEditJobModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  // Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  // Show user profile
  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const getjobStatus = status => {
    if (status === 'active') {
      return 'blue'
    }
    if (status === 'blocked') {
      return 'cyan'
    }
    return ''
  }
  
  const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'status'
			const data = utils.filterArray(userData, key, value)
			setUsers(data)
		} else {
			setUsers(userData)
		}
	}
  
  const jobStatusList = ['active', 'blocked']

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={handleJob}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={openEditJobModal}
            size="small"
          >
            <span className="ml-2">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(elm.id)}
            size="small"
          >
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Branch',
      dataIndex: 'branch',
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startdate',
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: 'End Date',
      dataIndex: 'enddate',
      sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
				<><Tag color={getjobStatus(record.status)}>{record.status}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
    },
    {
      title: 'Created At',
      dataIndex: 'createdat',
      sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
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
      <Row gutter={16}>
        {annualStatisticData.map((elm, i) => (
          <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
            <StatisticWidget
              title={elm.title}
              value={elm.value}
              status={elm.status}
              subtitle={elm.subtitle}
            />
          </Col>
        ))}
      </Row>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
          <div className="w-full md:w-48 ">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Job </Option>
              {jobStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddJobModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table
          columns={tableColumns}
          dataSource={users}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Job Modal */}
      <Modal
        title="Create Job"
        visible={isAddJobModalVisible}
        onCancel={closeAddJobModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
        // height={1000}
      >
        <AddJob onClose={closeAddJobModal} />
      </Modal>

      <Modal
        title="Edit Job"
        visible={isEditJobModalVisible}
        onCancel={closeEditJobModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
        // height={1000}
      >
        <EditJob onClose={closeEditJobModal} />
      </Modal>
    </Card>
  );
};

export default JobList;










// import React, { Component, useState } from 'react';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../pages/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { 
// 	AnnualStatisticData, 
//   } from '../../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddJob from './AddJob';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class JobList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddJobModalVisible: false,
//     annualStatisticData:AnnualStatisticData, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddJobModal = () => {
//     this.setState({ isAddJobModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddJobModal = () => {
//     this.setState({ isAddJobModalVisible: false });
//   };

//   onSearch = (e) => {
//     const { list } = this.state;
    
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     this.setState({ list: data, selectedRowKeys: [] });
//   };

//   deleteUser = (userId) => {
//     this.setState({
//       users: this.state.users.filter(item => item.id !== userId),
//     });
//     message.success({ content: `Deleted user ${userId}`, duration: 2 });
//   };

//   showUserProfile = (userInfo) => {
//     this.setState({
//       userProfileVisible: true,
//       selectedUser: userInfo,
//     });
//   };

//   closeUserProfile = () => {
//     this.setState({
//       userProfileVisible: false,
//       selectedUser: null,
//     });
//   };

//   render() {
//     const { users, userProfileVisible, selectedUser, isAddJobModalVisible } = this.state;


//     const dropdownMenu = elm => (
//         <Menu>
            
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                 <Button type="" className="" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="">View Details</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                  <Button type="" className="" icon={<MailOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="">Send Mail</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                  <Button type="" className="" icon={<PushpinOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="ml-2">Pin</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <DeleteOutlined />
//                     <span className="ml-2">Delete</span> */}
                
//     <Button type="" className="" icon={<DeleteOutlined />} onClick={() => {this.deleteUser(elm.id)}} size="small"> 
//     <span className="">Delete</span>
//     </Button>
    
    
//                 </Flex>
//             </Menu.Item>	
//         </Menu>
//     );


//     const tableColumns = [
//       {
//         title: 'Branch',
//         dataIndex: 'branch',
//         sorter: {
//             compare: (a, b) => a.branch.length - b.branch.length,
//           },
//       },
//       {
//         title: 'Title',
//         dataIndex: 'title',
//         sorter: {
//           compare: (a, b) => a.title.length - b.title.length,
//         },
//       },
      
//       {
//         title: 'Start Date',
//         dataIndex: 'startdate',
       
//         sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//       },
//       {
//         title: 'End Date',
//         dataIndex: 'enddate',
       
//         sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
//       },
//       {
//         title: 'Status',
//         dataIndex: 'status',
//         render: (status) => (
//           <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//             {status}
//           </Tag>
//         ),
//         sorter: {
//           compare: (a, b) => a.status.length - b.status.length,
//         },
//       },
//       {
//         title: 'Created At',
//         dataIndex: 'createdat',
       
//         sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
//       },
//       {
//         title: 'Action',
//         dataIndex: 'actions',
//         render: (_, elm) => (
//             <div className="text-center">
//                 <EllipsisDropdown menu={dropdownMenu(elm)}/>
//             </div>
//         )
//     },
//     //   {
//     //     title: 'Action',
//     //     dataIndex: 'actions',
//     //     render: (_, elm) => (
//     //       <div className="text-right d-flex justify-content-center">
//     //         <Tooltip title="View">
//     //           <Button
//     //             type="primary"
//     //             className="mr-2"
//     //             icon={<EyeOutlined />}
//     //             onClick={() => this.showUserProfile(elm)}
//     //             size="small"
//     //           />
//     //         </Tooltip>
//     //         <Tooltip title="Delete">
//     //           <Button danger icon={<DeleteOutlined />} onClick={() => this.deleteUser(elm.id)} size="small" />
//     //         </Tooltip>
//     //       </div>
//     //     ),
//     //   },
//     ];
// 	const [annualStatisticData] = useState(AnnualStatisticData);

//     return (
//       <Card bodyStyle={{ padding: '-3px' }}>
        
// <Row gutter={16}>
//             {
//               annualStatisticData.map((elm, i) => (
// 				<Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>

//                   <StatisticWidget 
//                     title={elm.title} 
//                     value={elm.value}
//                     status={elm.status}
//                     subtitle={elm.subtitle}
//                   />
//                 </Col>
//               ))
//             }
//           </Row>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button type="primary" className="ml-2" onClick={this.openAddJobModal}>
//               <PlusOutlined />
//               <span>New</span>
//             </Button>
//             <Button type="primary" icon={<FileExcelOutlined />} block>
//               Export All
//             </Button>
//           </Flex>
//         </Flex>
//         <div className="table-responsive mt-2">
//           <Table columns={tableColumns} dataSource={users} rowKey="id"  scroll={{ x: 1200 }} />
//         </div>
//         <UserView data={selectedUser} visible={userProfileVisible} close={() => this.closeUserProfile()} />

//         {/* Add Employee Modal */}
//         <Modal
//           title=""
//           visible={isAddJobModalVisible}
//           onCancel={this.closeAddJobModal}
//           footer={null}
//           width={800}
//         >
//           <AddJob onClose={this.closeAddJobModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default JobList;









