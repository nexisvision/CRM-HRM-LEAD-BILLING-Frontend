import React, { useRef, useState } from 'react'; // Import useRef for file input
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddLead from './AddLead';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import EditLead from './EditLead';
import ViewLead from './ViewLead';

const LeadList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);
  const [isViewLeadModalVisible, setIsViewLeadModalVisible] = useState(false);
  const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);
  const [dealStatisticData] = useState(DealStatisticData);

  // Ref for file input
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file); // Process the file here (e.g., upload to server)
      message.success(`Selected file: ${file.name}`);
    }
  };

  // Open file manager
  const openFileManager = () => {
    fileInputRef.current.click();
  };

  const openAddLeadModal = () => setIsAddLeadModalVisible(true);
  const closeAddLeadModal = () => setIsAddLeadModalVisible(false);
  const openEditLeadModal = () => setIsEditLeadModalVisible(true);
  const closeEditLeadModal = () => setIsEditLeadModalVisible(false);
  const openViewLeadModal = () => setIsViewLeadModalVisible(true);
  const closeViewLeadModal = () => setIsViewLeadModalVisible(false);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
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

  const dropdownMenu = (elm) => (
    <Menu>
       <Menu.Item>
         <Flex alignItems="center">
           <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewLeadModal}
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
            onClick={openEditLeadModal}
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
            title: 'Name',
            dataIndex: 'name',
            sorter: {
              compare: (a, b) => a.branch.length - b.branch.length,
            },
          },
          {
            title: 'Subject',
            dataIndex: 'subject',
            sorter: {
              compare: (a, b) => a.title.length - b.title.length,
            },
          },
          {
            title: 'Stage',
            dataIndex: 'stage',
            sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
          },
          {
            title: 'Task',
            dataIndex: 'status',
            render: (status) => (
              <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
                {status}
              </Tag>
            ),
            sorter: {
              compare: (a, b) => a.status.length - b.status.length,
            },
          },
          {
              title: 'User',
              dataIndex: 'name',
              render: (_, record) => (
                  <div className="d-flex">
                      <AvatarStatus size={30} src={record.image} name={record.name}/>
                  </div>
              ),
              sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
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
    // Table columns definition
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Row gutter={16}>
        {dealStatisticData.map((elm, i) => (
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
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddLeadModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block onClick={openFileManager}>
            Import
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

      {/* File input (hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      <Modal
        title="Create Lead"
        visible={isAddLeadModalVisible}
        onCancel={closeAddLeadModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddLead onClose={closeAddLeadModal} />
      </Modal>
      <Modal
        title="Edit Lead"
        visible={isEditLeadModalVisible}
        onCancel={closeEditLeadModal}
        footer={null}
        width={800}
        className='mt-[-70px] '
      >
        <EditLead onClose={closeEditLeadModal} />
      </Modal>

      <Modal
        title="View Lead"
        visible={isViewLeadModalVisible}
        onCancel={closeViewLeadModal}
        footer={null}
        width={1800}
        className='mt-[-70px]'
      >
        <ViewLead onClose={closeViewLeadModal} />
      </Modal>
    </Card>
  );
};

export default LeadList;











// import React, { useState } from 'react';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, EditOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddLead from './AddLead';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import utils from 'utils';
// import EditLead from './EditLead';
// import ViewLead from './ViewLead';

// const LeadList = () => {
//   const [users, setUsers] = useState(userData);
//   const [list, setList] = useState(OrderListData);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   // const [viewDealVisible, setViewDealVisible] = useState(false);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);
//   const [isViewLeadModalVisible, setIsViewLeadModalVisible] = useState(false);

//   const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);

//   const [dealStatisticData] = useState(DealStatisticData);

//   // Open Add Job Modal
//   const openAddLeadModal = () => {
//     setIsAddLeadModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddLeadModal = () => {
//     setIsAddLeadModalVisible(false);
//   };


//   const openEditLeadModal = () => {
//     setIsEditLeadModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeEditLeadModal = () => {
//     setIsEditLeadModalVisible(false);
//   };



//   const openViewLeadModal = () => {
//     setIsViewLeadModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeViewLeadModal = () => {
//     setIsViewLeadModalVisible(false);
//   };




//   // Search functionality
//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     setList(data);
//     setSelectedRowKeys([]);
//   };

//   // Delete user
//   const deleteUser = (userId) => {
//     setUsers(users.filter((item) => item.id !== userId));
//     message.success({ content: `Deleted user ${userId}`, duration: 2 });
//   };

//   // Show user profile
//   const showUserProfile = (userInfo) => {
//     setSelectedUser(userInfo);
//     setUserProfileVisible(true);
//   };

//   // Close user profile
//   const closeUserProfile = () => {
//     setSelectedUser(null);
//     setUserProfileVisible(false);
//   };

   
  

//   const dropdownMenu = (elm) => (
//     <Menu>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<EyeOutlined />}
//             onClick={openViewLeadModal}
//             size="small"
//           >
//             <span className="">View Details</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<MailOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="">Send Mail</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<EditOutlined />}
//             onClick={openEditLeadModal}
//             size="small"
//           >
//             <span className="ml-2">Edit</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<DeleteOutlined />}
//             onClick={() => deleteUser(elm.id)}
//             size="small"
//           >
//             <span className="">Delete</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//     </Menu>
//   );

//   const tableColumns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       sorter: {
//         compare: (a, b) => a.branch.length - b.branch.length,
//       },
//     },
//     {
//       title: 'Subject',
//       dataIndex: 'subject',
//       sorter: {
//         compare: (a, b) => a.title.length - b.title.length,
//       },
//     },
//     {
//       title: 'Stage',
//       dataIndex: 'stage',
//       sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//     },
//     {
//       title: 'Task',
//       dataIndex: 'status',
//       render: (status) => (
//         <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//           {status}
//         </Tag>
//       ),
//       sorter: {
//         compare: (a, b) => a.status.length - b.status.length,
//       },
//     },
//     {
//         title: 'User',
//         dataIndex: 'name',
//         render: (_, record) => (
//             <div className="d-flex">
//                 <AvatarStatus size={30} src={record.image} name={record.name}/>
//             </div>
//         ),
//         sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
//     },
//     {
//       title: 'Action',
//       dataIndex: 'actions',
//       render: (_, elm) => (
//         <div className="text-center">
//           <EllipsisDropdown menu={dropdownMenu(elm)} />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Card bodyStyle={{ padding: '-3px' }}>
//       <Row gutter={16}>
//         {dealStatisticData.map((elm, i) => (
//           <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
//             <StatisticWidget
//               title={elm.title}
//               value={elm.value}
//               status={elm.status}
//               subtitle={elm.subtitle}
//             />
//           </Col>
//         ))}
//       </Row>
//       <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//         <Flex className="mb-1" mobileFlex={false}>
//           <div className="mr-md-3 mb-3">
//             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//           </div>
//         </Flex>
//         <Flex gap="7px">
//           <Button type="primary" className="ml-2" onClick={openAddLeadModal}>
//             <PlusOutlined />
//             <span>New</span>
//           </Button>
//           <Button type="primary" icon={<FileExcelOutlined />} block>
//             Export All
//           </Button>
//           <Button type="primary" icon={<FileExcelOutlined />} block>
//             Import
//           </Button>
//         </Flex>
//       </Flex>
//       <div className="table-responsive mt-2">
//         <Table
//           columns={tableColumns}
//           dataSource={users}
//           rowKey="id"
//           scroll={{ x: 1200 }}
//         />
//       </div>
//       <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />
//       {/* <ViewDeal visible={viewDealVisible} close={closeViewDeal} /> */}

//       {/* Add Job Modal */}
//       <Modal
//         title="Add Lead"
//         visible={isAddLeadModalVisible}
//         onCancel={closeAddLeadModal}
//         footer={null}
//         width={800}
//       >
//         <AddLead onClose={closeAddLeadModal} />
//       </Modal>
//       <Modal
//         title="Edit Lead"
//         visible={isEditLeadModalVisible}
//         onCancel={closeEditLeadModal}
//         footer={null}
//         width={800}
//       >
//         <EditLead onClose={closeEditLeadModal} />
//       </Modal>

//       <Modal
//       className='mt-[-80px]'
//         title=""
//         visible={isViewLeadModalVisible}
//         onCancel={closeViewLeadModal}
//         footer={null}
//         width={1800}
//       >
//         <ViewLead onClose={closeViewLeadModal} />
    
//       </Modal>
//     </Card>
//   );
// };

// export default LeadList;

