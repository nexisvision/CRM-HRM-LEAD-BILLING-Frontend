import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined ,CopyOutlined,EditOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import ViewCustomer from '../customer/ViewCustomer';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddCustomer from './AddCustomer';
import userData from '../../../../../assets/data/user-list.data.json';
// import userData from 'assets/data/user-list.data.json';
import OrderListData from '../../../../../assets/data/order-list.data.json';
import { IoCopyOutline } from "react-icons/io5";
import utils from 'utils';
import EditCustomer from './EditCustomer';

const CustomerList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const [customerVisible,setCustomerVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
  const [isEditCustomerModalVisible, setIsEditCustomerModalVisible] = useState(false);
  const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] = useState(false);


  // Open Add Job Modal
  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddCustomerModal = () => {
    setIsAddCustomerModalVisible(false);
  };

   // Open Add Job Modal
   const openEditCustomerModal = () => {
    setIsEditCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditCustomerModal = () => {
    setIsEditCustomerModalVisible(false);
  };


  const openviewCustomerModal = () => {
    setIsViewCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewCustomerModal = () => {
    setIsViewCustomerModalVisible(false);
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

//   const showCustomerView = (userInfo) => {
//     setSelectedUser(userInfo);
//     setCustomerVisible(true);
//   };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };


//   const closeCustomerView = () => {
//     setSelectedUser(null);
//     setCustomerVisible(false);
//   };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => openviewCustomerModal(elm)}
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
            icon={<EditOutlined />}
            onClick={openEditCustomerModal}
            size="small"
          >
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<PushpinOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item> */}
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
      title: 'Contact',
      dataIndex: 'contact',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      sorter: {
        compare: (a, b) => a.balance.length - b.balance.length,
      },
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
      
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
        <Flex mobileFlex={false} className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
        </Flex>
        <Flex gap="7px" className="flex">
          <Button type="primary" className="flex items-center" onClick={openAddCustomerModal}>
            <PlusOutlined />
            <span className="ml-2">New</span>
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
        title="Add Customer"
        visible={isAddCustomerModalVisible}
        onCancel={closeAddCustomerModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddCustomer onClose={closeAddCustomerModal} />
      </Modal>

      <Modal
        title="Customer"
        visible={isViewCustomerModalVisible}
        onCancel={closeViewCustomerModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
        
      >
        <ViewCustomer onClose={closeViewCustomerModal} />
      </Modal>

      <Modal
        title="Edit Customer"
        visible={isEditCustomerModalVisible}
        onCancel={closeEditCustomerModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
        
      >
        <EditCustomer onClose={closeEditCustomerModal} />
      </Modal>

    </Card>
  );
};

export default CustomerList;

