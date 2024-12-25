import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined,EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddCoupon from './AddCoupon';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import EditCoupon from './EditCoupon';

const CouponList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddCouponModalVisible, setIsAddCouponModalVisible] = useState(false);
  const [isEditCouponModalVisible, setIsEditCouponModalVisible] = useState(false);
//   const [dealStatisticData] = useState(DealStatisticData);

  // Open Add Job Modal
  const openAddCouponModal = () => {
    setIsAddCouponModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddCouponModal = () => {
    setIsAddCouponModalVisible(false);
  };

   // Open Add Job Modal
   const openEditCouponModal = () => {
    setIsEditCouponModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditCouponModal = () => {
    setIsEditCouponModalVisible(false);
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

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => showUserProfile(elm)}
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
            onClick={openEditCouponModal}
            size="small"
          >
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
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
      title: 'Code',
      dataIndex: 'code',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Discount (%)',
      dataIndex: 'discount',
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
        title: 'Limit',
        dataIndex: 'limit',
        sorter: (a, b) => utils.antdTableSorter(a, b, 'limit')
    },
    {
        title: 'Used',
        dataIndex: 'used',
        sorter: (a, b) => utils.antdTableSorter(a, b, '	Used')
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
          <Button type="primary" className="ml-2" onClick={openAddCouponModal}>
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
      {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}

      {/* Add Job Modal */}
      <Modal
        title="Add Coupon"
        visible={isAddCouponModalVisible}
        onCancel={closeAddCouponModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddCoupon onClose={closeAddCouponModal} />
      </Modal>
      <Modal
        title="Edit Coupon"
        visible={isEditCouponModalVisible}
        onCancel={closeEditCouponModal}
        footer={null}
        width={1000}
        divider={true}
        className='mt-[-70px]'
      >
        <EditCoupon onClose={closeEditCouponModal} />
      </Modal>
    </Card>
  );
};

export default CouponList;

