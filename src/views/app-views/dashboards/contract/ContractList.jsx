import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined ,CopyOutlined,EditOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddContract from './AddContract';
import ViewContract from './ViewContract';
import EditContract from './EditContract';

import userData from '../../../../assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import { IoCopyOutline } from "react-icons/io5";
import utils from 'utils';

const ContractList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddContractModalVisible, setIsAddContractModalVisible] = useState(false);
  const [isViewContractModalVisible, setIsViewContractModalVisible] = useState(false);
  const [isEditContractModalVisible, setIsEditContractModalVisible] = useState(false);

//   const [dealStatisticData] = useState(DealStatisticData);

  // Open Add Job Modal
  const openAddContractModal = () => {
    setIsAddContractModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddContractModal = () => {
    setIsAddContractModalVisible(false);
  };

  const openViewContractModal = () => {
    setIsViewContractModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewContractModal = () => {
    setIsViewContractModalVisible(false);
  };

  const openEditContractModal = () => {
    setIsEditContractModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditContractModal = () => {
    setIsEditContractModalVisible(false);
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
            icon={<CopyOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Duplicate</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewContractModal}
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
            onClick={openEditContractModal}
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
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   sorter: {
    //     compare: (a, b) => a.branch.length - b.branch.length,
    //   },
    // },
    {
      title: 'Subject',
      dataIndex: 'subject',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Client',
      dataIndex: 'name',
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: 'Project',
      dataIndex: 'project',
    //   render: (status) => (
    //     <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
    //       {status}
    //     </Tag>
    //   ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
    {
        title: 'Contract Type',
        dataIndex: 'contracttype',
        // render: (_, record) => (
        //     <div className="d-flex">
        //         <AvatarStatus size={30} src={record.image} name={record.name}/>
        //     </div>
        // ),
        sorter: {
            compare: (a, b) => a.title.length - b.title.length,
          },
    },
    {
        title: 'Contract Value',
        dataIndex: 'contractvalue',
        // render: (_, record) => (
        //     <div className="d-flex">
        //         <AvatarStatus size={30} src={record.image} name={record.name}/>
        //     </div>
        // ),
        sorter: {
            compare: (a, b) => a.title.length - b.title.length,
          },
    },
    {
        title: 'Start Date',
        dataIndex: 'startdate',
        // render: (_, record) => (
        //     <div className="d-flex">
        //         <AvatarStatus size={30} src={record.image} name={record.name}/>
        //     </div>
        // ),
        sorter: {
            compare: (a, b) => a.title.length - b.title.length,
          },
    },
    {
        title: 'End Date',
        dataIndex: 'enddate',
        // render: (_, record) => (
        //     <div className="d-flex">
        //         <AvatarStatus size={30} src={record.image} name={record.name}/>
        //     </div>
        // ),
        sorter: {
            compare: (a, b) => a.title.length - b.title.length,
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
      {/* <Row gutter={16}>
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
      </Row> */}
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddContractModal}>
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
        title="Add Contract"
        visible={isAddContractModalVisible}
        onCancel={closeAddContractModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddContract onClose={closeAddContractModal} />
      </Modal>
      <Modal
        title="View Contract"
        visible={isViewContractModalVisible}
        onCancel={closeViewContractModal}
        footer={null}
        width={1800}
        className='mt-[-70px]'
      >
        <ViewContract onClose={closeViewContractModal} />
      </Modal>
      <Modal
        title="Edit Contract"
        visible={isEditContractModalVisible}
        onCancel={closeEditContractModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <EditContract onClose={closeEditContractModal} />
      </Modal>
    </Card>
  );
};

export default ContractList;

