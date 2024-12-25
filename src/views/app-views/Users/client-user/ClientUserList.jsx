import React, { useState } from 'react';
import { Card, Menu, Table, Tag, Button,Modal,Select,Input } from 'antd';
import { EyeOutlined, DeleteOutlined, MailOutlined,FileExcelOutlined,PlusOutlined,SearchOutlined } from '@ant-design/icons';
import { RiLockPasswordLine } from "react-icons/ri";
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import userData from "assets/data/user-list.data.json";
import Flex from 'components/shared-components/Flex';
import UserView from './UserView';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { message } from 'antd';
import AddClientUser from './AddClientUser';
import EditClientUser from './EditClientUser';

const ClientUserList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [isAddClientUserModalVisible, setIsAddClientUserModalVisible] = useState(false);
  const [isEditClientUserModalVisible, setIsEditClientUserModalVisible] = useState(false);

  const deleteUser = (userId) => {
    setUsers(users.filter(item => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };





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



  const openAddClientUserModal = () => {
    setIsAddClientUserModalVisible(true);
  };

  const closeAddClientUserModal = () => {
    setIsAddClientUserModalVisible(false);
  };

  const openEditClientUserModal = () => {
    setIsEditClientUserModalVisible(true);
  };

  const closeEditClientUserModal = () => {
    setIsEditClientUserModalVisible(false);
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
            className=""
            icon={<EyeOutlined />}
            onClick={() => { showUserProfile(elm) }}
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
            onClick={openEditClientUserModal}
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
            icon={<RiLockPasswordLine />}
            onClick={() => { showUserProfile(elm) }}
            size="small"
          >
            <span className="ml-2">Update Password</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<DeleteOutlined />}
            onClick={() => { deleteUser(elm.id) }}
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
      title: 'Client Users',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: 'Client',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus src={record.img} name={record.client} subTitle={record.clientemail} />
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.client.toLowerCase();
          b = b.client.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      sorter: {
        compare: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: {
        compare: (a, b) => a.role.length - b.role.length,
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
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>{status}</Tag>
      ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
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
    <Card bodyStyle={{ 'padding': '0px' }}>
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
          <Button type="primary" className="ml-2" onClick={openAddClientUserModal}>
            <PlusOutlined />
            New
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive">
        <Table columns={tableColumns} dataSource={users} rowKey='id' />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />
      <Modal
        title="Create Client"
        visible={isAddClientUserModalVisible}
        onCancel={closeAddClientUserModal}
        footer={null}
        width={1100}
        // className="mt-[-70px]"
      >
        <AddClientUser onClose={closeAddClientUserModal} />
      </Modal>
      <Modal
        title="Edit Client"
        visible={isEditClientUserModalVisible}
        onCancel={closeEditClientUserModal}
        footer={null}
        width={1000}
      >
        <EditClientUser onClose={closeEditClientUserModal} />
      </Modal>

    </Card>
  );
};

export default ClientUserList;
