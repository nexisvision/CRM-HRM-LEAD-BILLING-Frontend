import React, { useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined,EditOutlined , PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

import AddAppraisal from './AddAppraisal';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import EditAppraisal from './EditAppraisal';
import { Model } from 'miragejs';
import ViewAppraisal from './ViewAppraisal';

const AppraisalList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [isAddAppraisalModalVisible, setIsAddAppraisalModalVisible] = useState(false);
  const [isEditAppraisalModalVisible, setIsEditAppraisalModalVisible] = useState(false);
  const [isViewAppraisalModalVisible, setIsViewAppraisalModalVisible] = useState(false);



  const openAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(true);
  };

  const closeAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(false);
  };



  const openViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(true);
  };

  const closeViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(false);
  };



  const openEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(true);
  };

  const closeEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(false);
  };

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
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={openViewAppraisalModal}
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
            onClick={openEditAppraisalModal}
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
            icon={<PushpinOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            Pin
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
      title: 'Branch',
      dataIndex: 'branch',
      sorter: (a, b) => a.branch.length - b.branch.length,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      sorter: (a, b) => a.department.length - b.department.length,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      sorter: (a, b) => a.designation.length - b.designation.length,
    },
    {
      title: 'Employee',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Target Rating',
      dataIndex: 'targetrating',
      sorter: (a, b) => a.targetrating.length - b.targetrating.length,
    },
    {
      title: 'Overall Rating',
      dataIndex: 'overallrating',
      sorter: (a, b) => a.overallrating.length - b.overallrating.length,
    },
    {
      title: 'Added By',
      dataIndex: 'addedby',
      sorter: (a, b) => a.addedby.length - b.addedby.length,
    },
    {
      title: 'Appraisal',
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
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" onClick={openAddAppraisalModal}>
            <PlusOutlined />
            New
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />}>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Employee Modal */}
      <Modal
        title="Add Appraisal"
        visible={isAddAppraisalModalVisible}
        onCancel={closeAddAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddAppraisal onClose={closeAddAppraisalModal} />
      </Modal>

      <Modal
        title="Edit Appraisal"
        visible={isEditAppraisalModalVisible}
        onCancel={closeEditAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <EditAppraisal onClose={closeEditAppraisalModal} />
      </Modal>
      <Modal
        title="Appraisal Detail"
        visible={isViewAppraisalModalVisible}
        onCancel={closeViewAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Modal>
      {/* <Model
      title="View Appraisal"
      visible={isEditAppraisalModalVisible}
      onCancel={closeViewAppraisalModal}
      footer={null}
      width={1000}
      className='mt-[-70px]'
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Model> */}

    </Card>
  );
};

export default AppraisalList;









// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddAppraisal from './AddAppraisal';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class AppraisalList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddAppraisalModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddAppraisalModal = () => {
//     this.setState({ isAddAppraisalModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddAppraisalModal = () => {
//     this.setState({ isAddAppraisalModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddAppraisalModalVisible } = this.state;


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
//         {
//           title: 'Branch',
//           dataIndex: 'branch',
//           sorter: {
//               compare: (a, b) => a.branch.length - b.branch.length,
//             },
//         },
//         {
//           title: 'Department',
//           dataIndex: 'depqartment',
//           sorter: {
//               compare: (a, b) => a.department.length - b.department.length,
//             },
//         },
//         {
//           title: 'Designation',
//           dataIndex: 'designation',
//           sorter: {
//               compare: (a, b) => a.designation.length - b.designation.length,
//             },
//         },
//         {
//             title: 'Employee',
//             dataIndex: 'name',
//             sorter: {
//                 compare: (a, b) => a.name.length - b.name.length,
//               },
//           },
//           {
//             title: 'Target Rating',
//             dataIndex: 'targetrating',
//             sorter: {
//                 compare: (a, b) => a.targetrating.length - b.targetrating.length,
//               },
//           },
//         {
//           title: 'Overall Rating',
//           dataIndex: 'overallrating',
//           sorter: {
//               compare: (a, b) => a.overallrating.length - b.overallrating.length,
//             },
//         },
//         {
//           title: 'Added By',
//           dataIndex: 'addedby',
//           sorter: {
//               compare: (a, b) => a.addedby.length - b.addedby.length,
//             },
//         },
//         {
//           title: 'Appraisal',
//           dataIndex: 'startdate',
         
//           sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//         },
//       //   {
//       //     title: 'Last online',
//       //     dataIndex: 'lastOnline',
//       //     render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
//       //     sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
//       //   },
//       //   {
//       //     title: 'Status',
//       //     dataIndex: 'status',
//       //     render: (status) => (
//       //       <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//       //         {status}
//       //       </Tag>
//       //     ),
//       //     sorter: {
//       //       compare: (a, b) => a.status.length - b.status.length,
//       //     },
//       //   },
//         {
//           title: 'Action',
//           dataIndex: 'actions',
//           render: (_, elm) => (
//               <div className="text-center">
//                   <EllipsisDropdown menu={dropdownMenu(elm)}/>
//               </div>
//           )
//       },
//       //   {
//       //     title: 'Action',
//       //     dataIndex: 'actions',
//       //     render: (_, elm) => (
//       //       <div className="text-right d-flex justify-content-center">
//       //         <Tooltip title="View">
//       //           <Button
//       //             type="primary"
//       //             className="mr-2"
//       //             icon={<EyeOutlined />}
//       //             onClick={() => this.showUserProfile(elm)}
//       //             size="small"
//       //           />
//       //         </Tooltip>
//       //         <Tooltip title="Delete">
//       //           <Button danger icon={<DeleteOutlined />} onClick={() => this.deleteUser(elm.id)} size="small" />
//       //         </Tooltip>
//       //       </div>
//       //     ),
//       //   },
//       ];

//     return (
//       <Card bodyStyle={{ padding: '-3px' }}>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button type="primary" className="ml-2" onClick={this.openAddAppraisalModal}>
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
//           title="Add Appraisal"
//           visible={isAddAppraisalModalVisible}
//           onCancel={this.closeAddAppraisalModal}
//           footer={null}
//           width={800}
//         >
//           <AddAppraisal onClose={this.closeAddAppraisalModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default AppraisalList;
