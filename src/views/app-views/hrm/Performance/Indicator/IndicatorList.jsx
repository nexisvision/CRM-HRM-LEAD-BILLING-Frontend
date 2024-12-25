import React, { useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddIndicator from './AddIndicator';
import EditIndicator from './EditIndicator';

import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import ViewIndicator from './ViewIndicator';

const IndicatorList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddIndicatorModalVisible, setIsAddIndicatorModalVisible] = useState(false);
  const [isEditIndicatorModalVisible, setIsEditIndicatorModalVisible] = useState(false);
  const [isViewIndicatorModalVisible, setIsViewIndicatorModalVisible] = useState(false);


  const openAddIndicatorModal = () => setIsAddIndicatorModalVisible(true);
  const closeAddIndicatorModal = () => setIsAddIndicatorModalVisible(false);

  const openEditIndicatorModal = () => setIsEditIndicatorModalVisible(true);
  const closeEditIndicatorModal = () => setIsEditIndicatorModalVisible(false);



  const openViewIndicatorModal = () => setIsViewIndicatorModalVisible(true);
  const closeViewIndicatorModal = () => setIsViewIndicatorModalVisible(false);



  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(item => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} onClick={openViewIndicatorModal} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EditOutlined />} onClick={openEditIndicatorModal} size="small">
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<PushpinOutlined />} size="small">
            <span className="ml-2">Pin</span>
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

  const tableColumns = [
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
      title: 'Overall Rating',
      dataIndex: 'overallrating',
      sorter: {
        compare: (a, b) => a.overallrating.length - b.overallrating.length,
      },
    },
    {
      title: 'Added By',
      dataIndex: 'addedby',
      sorter: {
        compare: (a, b) => a.addedby.length - b.addedby.length,
      },
    },
    {
      title: 'Created At',
      dataIndex: 'startdate',
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
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
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddIndicatorModal}>
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

      {/* Add Indicator Modal */}
      <Modal
        title="Add New Indicator"
        visible={isAddIndicatorModalVisible}
        onCancel={closeAddIndicatorModal}
        footer={null}
        width={1000}
      >
        <AddIndicator onClose={closeAddIndicatorModal} />
      </Modal>

      {/* Edit Indicator Modal */}
      <Modal
        title="Edit Indicator"
        visible={isEditIndicatorModalVisible}
        onCancel={closeEditIndicatorModal}
        footer={null}
        width={1000}
      >
        <EditIndicator onClose={closeEditIndicatorModal} />
      </Modal>

      {/* View Indicator Modal */}
      <Modal
        title="View Indicator"
        visible={isViewIndicatorModalVisible}
        onCancel={closeViewIndicatorModal}
        footer={null}
        width={1000}
      >
        <ViewIndicator onClose={closeViewIndicatorModal} />
      </Modal>
    </Card>
  );
};

export default IndicatorList;










// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined,EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddIndicator from './AddIndicator';
// import EditIndicator from './EditIndicator';

// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class IndicatorList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddIndicatorModalVisible: false,
//     isEditIndicatorModalVisible: false, // State to toggle Add Employee Modal
//      // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddIndicatorModal = () => {
//     this.setState({ isAddIndicatorModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddIndicatorModal = () => {
//     this.setState({ isAddIndicatorModalVisible: false });
//   };

//    // Open Add Employee Modal
//    openEditIndicatorModal = () => {
//     this.setState({ isEditIndicatorModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeEditIndicatorModal = () => {
//     this.setState({ isEditIndicatorModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddIndicatorModalVisible ,isEditIndicatorModalVisible } = this.state;


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
                 
//                  <Button type="" className="" icon={<EditOutlined />} onClick={this.openEditIndicatorModal} size="small">
//                 <span className="">Edit</span>
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
//         title: 'Department',
//         dataIndex: 'depqartment',
//         sorter: {
//             compare: (a, b) => a.department.length - b.department.length,
//           },
//       },
//       {
//         title: 'Designation',
//         dataIndex: 'designation',
//         sorter: {
//             compare: (a, b) => a.designation.length - b.designation.length,
//           },
//       },
//       {
//         title: 'Overall Rating',
//         dataIndex: 'overallrating',
//         sorter: {
//             compare: (a, b) => a.overallrating.length - b.overallrating.length,
//           },
//       },
//       {
//         title: 'Added By',
//         dataIndex: 'addedby',
//         sorter: {
//             compare: (a, b) => a.addedby.length - b.addedby.length,
//           },
//       },
//       {
//         title: 'Created At',
//         dataIndex: 'startdate',
       
//         sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//       },
//     //   {
//     //     title: 'Last online',
//     //     dataIndex: 'lastOnline',
//     //     render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
//     //     sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
//     //   },
//     //   {
//     //     title: 'Status',
//     //     dataIndex: 'status',
//     //     render: (status) => (
//     //       <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//     //         {status}
//     //       </Tag>
//     //     ),
//     //     sorter: {
//     //       compare: (a, b) => a.status.length - b.status.length,
//     //     },
//     //   },
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
//             <Button type="primary" className="ml-2" onClick={this.openAddIndicatorModal}>
//               <PlusOutlined />
//               <span>New</span>
//             </Button>
//             <Button type="primary" icon={<FileExcelOutlined />} block>
//               Export All
//             </Button>
//           </Flex>
//         </Flex>
//         <div className="table-responsive mt-2">
//           <Table columns={tableColumns} dataSource={users} rowKey="id" />
//         </div>
//         <UserView data={selectedUser} visible={userProfileVisible} close={() => this.closeUserProfile()} />

//         {/* Add Employee Modal */}
//         <Modal
//           title="Add New Indicator"
//           visible={isAddIndicatorModalVisible}
//           onCancel={this.closeAddIndicatorModal}
//           footer={null}
//           width={1000}
//           // className='mt-[-70px]'
//         >
//           <AddIndicator onClose={this.closeAddIndicatorModal} />
//         </Modal>
//         <Modal
//           title="Edit Indicator"
//           visible={isEditIndicatorModalVisible}
//           onCancel={this.closeEditIndicatorModal}
//           footer={null}
//           width={1000}
//           // className='mt-[-70px]'
//         >
//           <EditIndicator onClose={this.closeEditIndicatorModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default IndicatorList;
