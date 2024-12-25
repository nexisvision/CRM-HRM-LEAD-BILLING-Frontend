import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal,Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddJobOnBording from './AddJobOnBording';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import EditJobOnBording from './EditJobOnBording';
import { useNavigate } from 'react-router-dom';

const {Option} = Select;
const JobOnBordingList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobOnBordingModalVisible, setIsAddJobOnBordingModalVisible] = useState(false);
  const [isEditJobOnBordingModalVisible, setIsEditJobOnBordingModalVisible] = useState(false);
  const navigate = useNavigate();


  const [annualStatisticData] = useState(AnnualStatisticData);

  // Open Add Job Modal
  const openAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(false);
  };
  const openEditJobOnBordingModal = () => {
    setIsEditJobOnBordingModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditJobOnBordingModal = () => {
    setIsEditJobOnBordingModalVisible(false);
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


  const openViewJobOnBordingModal = () => {
    navigate('/app/hrm/jobs/viewjobonbording', { state: { user: selectedUser } }); // Pass user data as state if needed
  }

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
            onClick={openViewJobOnBordingModal}
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
            onClick={openEditJobOnBordingModal}
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
            icon={<FilePdfOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Download OfferLetter</span>
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
      title: 'Job',
      dataIndex: 'job',
      sorter: {
        compare: (a, b) => a.job.length - b.job.length,
      },
    },
    
    {
        title: 'Branch',
        dataIndex: 'branch',
        sorter: {
          compare: (a, b) => a.branch.length - b.branch.length,
        },
      },

    {
      title: 'Applied At',
      dataIndex: 'createdat',
      sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
    },
    
    {
        title: 'Joinnig At',
        dataIndex: 'createdat',
        sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
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
      </Row> */}
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
          <Button type="primary" className="ml-2" onClick={openAddJobOnBordingModal}>
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
        title="Add Job On Bording"
        visible={isAddJobOnBordingModalVisible}
        onCancel={closeAddJobOnBordingModal}
        footer={null}
        width={1000}
      >
        <AddJobOnBording onClose={closeAddJobOnBordingModal} />
      </Modal>
      <Modal
        title="Edit Job On Bording"
        visible={isEditJobOnBordingModalVisible}
        onCancel={closeEditJobOnBordingModal}
        footer={null}
        width={1000}
      >
        <EditJobOnBording onClose={closeEditJobOnBordingModal} />
      </Modal>
    </Card>
  );
};

export default JobOnBordingList;

