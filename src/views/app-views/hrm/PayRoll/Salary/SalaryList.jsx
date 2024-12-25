
import React, { useState } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddSalary from './AddSalary';
import { useNavigate } from 'react-router-dom';
// import setsalary from './setsalary';
import EmployeeSalary from './EmployeeSalary'; // Import the Set Salary Component
import userData from 'assets/data/user-list.data.json';
import utils from 'utils';
import Allowance from './Allowance';
import Commission from './Commission';
import SetSalary from './SetSalary';

const SalaryList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
  const navigate = useNavigate();
  const [isSetSalaryModalVisible, setIsSetSalaryModalVisible] = useState(false);

  // Open Add Salary Modal
  const openAddSalaryModal = () => {
    setIsAddSalaryModalVisible(true);
  };

  const handleSetSalary = () => {
    navigate('/app/hrm/payroll/salary/setsalary', { state: { user: selectedUser } }); // Pass user data as state if needed
  };

  // Close Add Salary Modal
  const closeAddSalaryModal = () => {
    setIsAddSalaryModalVisible(false);
  };

  // Open Set Salary Modal
  const openSetSalaryModal = (user) => {
    setSelectedUser(user);
    setIsSetSalaryModalVisible(true);
  };

  // Close Set Salary Modal
  const closeSetSalaryModal = () => {
    setSelectedUser(null);
    setIsSetSalaryModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const filteredUsers = utils.wildCardSearch(userData, value);
    setList(filteredUsers);
  };

  // Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const dropdownMenu = (user) => (
    <Menu>
      <Menu.Item>
        <Button type="text" icon={<EyeOutlined />} onClick={() => setUserProfileVisible(true)}>
          View Details
        </Button>
      </Menu.Item>
      {/* <Menu.Item>
        <Button type="text" icon={<EyeOutlined />} onClick={() => openSetSalaryModal(user)}>
          Set Salary
        </Button>
      </Menu.Item> */}


<Menu.Item>
        <Button type="text" icon={<EyeOutlined />} onClick={handleSetSalary}>
          Set Salary
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="text" icon={<DeleteOutlined />} onClick={() => deleteUser(user.id)}>
          Delete
        </Button>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeid',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, record) => <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />,
    },
    {
      title: 'PayRoll Type',
      dataIndex: 'payrolltype',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
    },
    {
      title: 'Net Salary',
      dataIndex: 'netsalary',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <EllipsisDropdown menu={dropdownMenu(record)} />
      ),
    },
  ];

  return (
    <Card>
      <Flex alignItems="center" justifyContent="space-between">
        <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
        <Button type="primary" className='ml-2' onClick={openAddSalaryModal}>
          <PlusOutlined /> Add Salary
        </Button>
      </Flex>
      <Table columns={tableColumns} dataSource={list} rowKey="id" />
      <Modal
        title="Add Salary"
        visible={isAddSalaryModalVisible}
        onCancel={closeAddSalaryModal}
        width={1000}
        footer={null}
      >
        <AddSalary onClose={closeAddSalaryModal} />
      </Modal>
      <Modal
      className='mt-[-70px]'
        title="Set Salary"
        visible={isSetSalaryModalVisible}
        onCancel={closeSetSalaryModal}
        footer={null}
        width={1900}
      >
        <SetSalary onClose={closeSetSalaryModal} />
    
      </Modal>
    </Card>
  );
};

export default SalaryList;















// import React, { useState } from 'react';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddSalary from './AddSalary';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import utils from 'utils';

// const SalaryList = () => {
//   const [users, setUsers] = useState(userData);
//   const [list, setList] = useState(OrderListData);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
//   const [annualStatisticData] = useState(AnnualStatisticData);

//   // Open Add Job Modal
//   const openAddSalaryModal = () => {
//     setIsAddSalaryModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddSalaryModal = () => {
//     setIsAddSalaryModalVisible(false);
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
//             onClick={() => showUserProfile(elm)}
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
//             icon={<EyeOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="">Set Salary</span>
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
//             icon={<PushpinOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="ml-2">Pin</span>
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
//       title: 'Employee Id',
//       dataIndex: 'employeeid',
//       sorter: {
//         compare: (a, b) => a.branch.length - b.branch.length,
//       },
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       render: (_, record) => (
//         <div className="d-flex">
//           <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
//         </div>
//       ),
//       sorter: {
//         compare: (a, b) => {
//           a = a.name.toLowerCase();
//           b = b.name.toLowerCase();
//           return a > b ? -1 : b > a ? 1 : 0;
//         },
//       },
//     },
//     {
//       title: 'PayRoll Type',
//       dataIndex: 'payrolltype',
//       sorter: {
//         compare: (a, b) => a.payrolltype.length - b.payrolltype.length,
//       },
//     },  
//     {
//       title: 'Salary',
//       dataIndex: 'salary',
//       sorter: {
//         compare: (a, b) => a.salary.length - b.salary.length,
//       },
//     },
//     {
//       title: 'NetSalary',
//       dataIndex: 'netsalary',
//       sorter: {
//         compare: (a, b) => a.netsalary.length - b.netsalary.length,
//       },
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
//       {/* <Row gutter={16}>
//         {annualStatisticData.map((elm, i) => (
//           <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
//             <StatisticWidget
//               title={elm.title}
//               value={elm.value}
//               status={elm.status}
//               subtitle={elm.subtitle}
//             />
//           </Col>
//         ))}
//       </Row> */}
//       <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//         <Flex className="mb-1" mobileFlex={false}>
//           <div className="mr-md-3 mb-3">
//             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//           </div>
//         </Flex>
//         <Flex gap="7px">
//           <Button type="primary" className="ml-2" onClick={openAddSalaryModal}>
//             <PlusOutlined />
//             <span>New</span>
//           </Button>
//           <Button type="primary" icon={<FileExcelOutlined />} block>
//             Export All
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

//       {/* Add Job Modal */}
//       <Modal
//         title=""
//         visible={isAddSalaryModalVisible}
//         onCancel={closeAddSalaryModal}
//         footer={null}
//         width={800}
//       >
//         <AddSalary onClose={closeAddSalaryModal} />
//       </Modal>
//     </Card>
//   );
// };

// export default SalaryList;

