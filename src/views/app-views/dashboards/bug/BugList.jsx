import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal,Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined ,CopyOutlined,EditOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddBug from './AddBug';
import userData from 'assets/data/user-list.data.json';
import OrderListData from '../../../../assets/data/order-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
import { IoCopyOutline } from "react-icons/io5";
import utils from 'utils';
import EditBug from './EditBug';

const { Option } = Select

const BugList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddBugModalVisible, setIsAddBugModalVisible] = useState(false);
  const [isEditBlogModalVisible, setIsEditBlogModalVisible] = useState(false);
  const openAddBugModal = () => {
    setIsAddBugModalVisible(true);
  };

  const closeAddBugModal = () => {
    setIsAddBugModalVisible(false);
  };

   const openEditBugModal = () => {
    setIsEditBlogModalVisible(true);
  };

  const closeEditContractModal = () => {
    setIsEditBlogModalVisible(false);
  };

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

  const getBugPriority = priority => {
    if(priority === 'Low') {
       return 'blue'
    }
    if(priority === 'Medium') {
       return 'cyan'
    }
    if(priority === 'High') {
      return 'orange'
   }
    return ''
 }

 const handleShowStatus = value => {
  if (value !== 'All') {
    const key = 'priority';
    const data = utils.filterArray(OrderListData, key, value)
    setList(data)
  } else {
    setList(OrderListData)
  }
}

const orderStatusList = ['Low', 'Medium','High']

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
            onClick={openEditBugModal}
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
          compare: (a, b) => a.name.length - b.name.length,
        },
      },
    {
      title: 'Bug Status',
      dataIndex: 'bugStatus',
      sorter: {
        compare: (a, b) => a.bugStatus.length - b.bugStatus.length,
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (_, record) => (
				<><Tag color={getBugPriority(record.priority)}>{record.priority}</Tag></>
			),
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: 'End Date',
      dataIndex: 'enddate',
   
    sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
    },
    {
        title: 'Created By',
        dataIndex: 'createdBy',
        
        sorter: {
            compare: (a, b) => a.title.length - b.title.length,
          },
    },
    {
        title: 'Assigned To',
        dataIndex: 'assignedTo',
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
          <Button type="primary" className="ml-2" onClick={openAddBugModal}>
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
          dataSource={list}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Job Modal */}
      <Modal
        title="Add Bug"
        visible={isAddBugModalVisible}
        onCancel={closeAddBugModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddBug onClose={closeAddBugModal} />
      </Modal>
      <Modal
        title="Edit Bug"
        visible={isEditBlogModalVisible}
        onCancel={closeEditContractModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <EditBug onClose={closeEditContractModal} />
      </Modal>
    </Card>
  );
};

export default BugList;

