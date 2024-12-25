import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag,Select, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddContract from './AddContract';
import userData from '../../../../assets/data/user-list.data.json';
import OrderListData from '../../../../assets/data/order-list.data.json';
// import { IoCopyOutline } from "react-icons/io5";
import utils from 'utils';
import AddProjectReport from "./AddProjectReport";
import ViewProjectReport from './ViewProjectReport';
import EditProjectReport from './EditProjectReport';

const { Option } = Select
const ProjectReportList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddProjectReportModalVisible, setIsAddProjectReportModalVisible] = useState(false);
  const [isEditProjectReportModalVisible, setIsEditProjectReportModalVisible] = useState(false);

  //   const [dealStatisticData] = useState(DealStatisticData);

  // Open Add Job Modal
  const openAddProjectReportModal = () => {
    setIsAddProjectReportModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddProjectReportModal = () => {
    setIsAddProjectReportModalVisible(false);
  };

  // Open Add Job Modal
  const openEditProjectReportModal = () => {
    setIsEditProjectReportModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditProjectReportModal = () => {
    setIsEditProjectReportModalVisible(false);
  };

  const [isViewProjectReportModalVisible, setIsViewProjecReportModalVisible] = useState(false);
	// const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);

	// Open Add Project Modal
	const openViewProjectReportModal = () => setIsViewProjecReportModalVisible(true);
	const closeViewProjectReportModal = () => setIsViewProjecReportModalVisible(false);
  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => openViewProjectReportModal(elm)}
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
            onClick={openEditProjectReportModal}
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


  

  const getProjectReportStatus = status => {
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
			const key = 'status';
			const data = utils.filterArray(userData, key, value)
			setUsers(data)
		} else {
			setUsers(userData)
		}
	}

  const orderStatusList = ['active', 'blocked']

  const tableColumns = [
    {
      title: 'Projects',
      dataIndex: 'project',
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startdate',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'duedate',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Projects Members',
      dataIndex: 'member',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus size={30} src={record.image}/>
        </div>
      ),
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Completion',
      dataIndex: 'progression',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_, record) => (
        <><Tag color={getProjectReportStatus(record.status)}>{record.status}</Tag></>
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
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
          <div className="mb-3">
							<Select
								defaultValue="All"
								className="w-100"
								style={{ minWidth: 180 }}
								onChange={handleShowStatus}
								placeholder="Status"
							>
								<Option value="All">All Status </Option>
								{orderStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddProjectReportModal}>
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

      {/* Add Job Modal */}
      <Modal
        title="Add Project Report"
        visible={isAddProjectReportModalVisible}
        onCancel={closeAddProjectReportModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddProjectReport onClose={closeAddProjectReportModal} />
      </Modal>
      <Modal
        title="Edit Project Report"
        visible={isEditProjectReportModalVisible}
        onCancel={closeEditProjectReportModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <EditProjectReport onClose={closeEditProjectReportModal} />
      </Modal>


      <Modal
        title="Project Reports"
        visible={isViewProjectReportModalVisible}
        onCancel={closeViewProjectReportModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
        bodyStyle={{
          backgroundColor: "#f5f5f5", 
          padding:"20px"
        }}
      >
        <ViewProjectReport onClose={closeViewProjectReportModal} className="bg-slate-100"/>
      </Modal>
    </Card>
  );
};

export default ProjectReportList;

