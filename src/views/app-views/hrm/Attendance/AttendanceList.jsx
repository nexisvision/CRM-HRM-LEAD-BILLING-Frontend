import React, { useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddAttendance from './AddAttendance';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';

const AttendanceList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Open Add Attendance Modal
  const openAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(true);
  };

  // Close Add Attendance Modal
  const closeAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(false);
  };

  // Handle Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const filteredList = value ? utils.wildCardSearch(list, value) : OrderListData;
    setList(filteredList);
    setSelectedRowKeys([]);
  };

  // Handle Date Range Filtering
  const onDateChange = (dates) => {
    setStartDate(dates ? dates[0] : null);  // Set the start date
    setEndDate(dates ? dates[1] : null);    // Set the end date
  };
  
  // Filter based on Date Range
  const filterByDate = (data) => {
    if (startDate && endDate) {
      return data.filter(item => {
        const itemDate = dayjs(item.intime);
        return itemDate.isBetween(startDate, endDate, 'day', '[]'); // inclusive
      });
    }
    return data;  // Return original data if no date range is selected
  };

  // Delete User
  const deleteUser = (userId) => {
    const updatedUsers = users.filter(item => item.id !== userId);
    setUsers(updatedUsers);
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  // Show User Profile
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  // Close User Profile
  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  // Dropdown Menu
  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} onClick={() => { showUserProfile(elm) }} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<MailOutlined />} onClick={() => { showUserProfile(elm) }} size="small">
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<PushpinOutlined />} onClick={() => { showUserProfile(elm) }} size="small">
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<DeleteOutlined />} onClick={() => { deleteUser(elm.id) }} size="small">
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
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      },
    },
    {
      title: 'In Time',
      dataIndex: 'intime',
      sorter: (a, b) => dayjs(a.intime).unix() - dayjs(b.intime).unix(),
    },
    {
      title: 'Out Time',
      dataIndex: 'outtime',
      render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
      sorter: (a, b) => dayjs(a.outtime).unix() - dayjs(b.outtime).unix(),
    },
    {
      title: 'In Status',
      dataIndex: 'instatus',
    },
    {
      title: 'Out Status',
      dataIndex: 'outStatus',
    },
    {
      title: 'Total Hour',
      dataIndex: 'totalhour',
    },
    {
      title: 'Punch By',
      dataIndex: 'punchby',
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

  // Apply date range filter
  const filteredList = filterByDate(list);

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
          </div>
        </Flex>

        <Flex gap="7px">
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={onDateChange}
            format="YYYY-MM-DD"
            style={{ marginRight: 10 }}
            className='w-[250px]'
          />
          <Button type="primary" className="ml-2" onClick={openAddAttendanceModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          {/* <Button className='w-[150px]' type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button> */}
        </Flex>
      </Flex>

      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={filteredList} rowKey="id" scroll={{ x: 1200 }} />
      </div>

      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      <Modal
        title="Add Attendance"
        visible={isAddAttendanceModalVisible}
        onCancel={closeAddAttendanceModal}
        footer={null}
        width={800}
      >
        <AddAttendance onClose={closeAddAttendanceModal} />
      </Modal>
    </Card>
  );
};

export default AttendanceList;










// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddAttendance from './AddAttendance';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class AttendanceList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddAttendanceModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddAttendanceModal = () => {
//     this.setState({ isAddAttendanceModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddAttendanceModal = () => {
//     this.setState({ isAddAttendanceModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddAttendanceModalVisible } = this.state;


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
//         title: 'User',
//         dataIndex: 'name',
//         render: (_, record) => (
//           <div className="d-flex">
//             <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
//           </div>
//         ),
//         sorter: {
//           compare: (a, b) => {
//             a = a.name.toLowerCase();
//             b = b.name.toLowerCase();
//             return a > b ? -1 : b > a ? 1 : 0;
//           },
//         },
//       },
//       {
//         title: 'In Time',
//         dataIndex: 'intime',
//         sorter: {
//           compare: (a, b) => a.intime.length - b.intime.length,
//         },
//       },
//       {
//         title: 'Out Time',
//         dataIndex: 'outtime',
//         render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
//         sorter: (a, b) => dayjs(a.outtime).unix() - dayjs(b.outtime).unix(),
//       },
//       {
//         title: 'In Status',
//         dataIndex: 'instatus',
//         sorter: {
//           compare: (a, b) => a.intime.length - b.intime.length,
//         },
//       },
//       {
//         title: 'Out Status',
//         dataIndex: 'outStatus',
//         sorter: {
//           compare: (a, b) => a.outtime.length - b.outtime.length,
//         },
//       },
//       {
//         title: 'Total Hour',
//         dataIndex: 'totalhour',
//         sorter: {
//           compare: (a, b) => a.totalhour.length - b.totalhour.length,
//         },
//       },
   
//     {
//         title: 'Punch By',
//         dataIndex: 'punchby',
//         sorter: {
//           compare: (a, b) => a.punchby.length - b.punchby.length,
//         },
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

//     return (
//       <Card bodyStyle={{ padding: '-3px' }}>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button type="primary" className="ml-2" onClick={this.openAddAttendanceModal}>
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
//           title="Add Attendance"
//           visible={isAddAttendanceModalVisible}
//           onCancel={this.closeAddAttendanceModal}
//           footer={null}
//           width={800}
//         >
//           <AddAttendance onClose={this.closeAddAttendanceModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default AttendanceList;









