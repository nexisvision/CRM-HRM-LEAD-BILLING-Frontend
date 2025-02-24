import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal ,Select} from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddJob from './AddJob';
import { useNavigate } from 'react-router-dom';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import AddTransfer from './AddTransfer';
import EditTransfer from './EditTransfer';
// import AddAccount from './AddAccount';
// import EditAccount from './EditAccount';
// import EditJob from './EditJob'
const { Option } = Select

const TransferList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);
  const [isEditJobModalVisible, setIsEditJobModalVisible] = useState(false);
  const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);
  const [isEditAccountModalVisible, setIsEditAccountModalVisible] = useState(false);
  const navigate = useNavigate();
  // const [isViewJobModalVisible, setIsViewJobModalVisible] = useState(false);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState('All');
  const [isAddTransferModalVisible, setIsAddTransferModalVisible] = useState(false);
  const [isEditTransferModalVisible, setIsEditTransferModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  // Add account type options
  const accountTypeList = ['All', 'Salary', 'Savings', 'Current'];

  // Open Add Job Modal
  const openAddJobModal = () => {
    setIsAddJobModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };
  const handleJob = () => {
    navigate('/app/hrm/jobs/viewjob', { state: { user: selectedUser } }); // Pass user data as state if needed
  };
   // Open Add Job Modal
   const openEditJobModal = () => {
    setIsEditJobModalVisible(true);
  };
  // Close Add Job Modal
  const closeEditJobModal = () => {
    setIsEditJobModalVisible(false);
  };
  // Handle account type filter
  const handleAccountTypeFilter = value => {
    setAccountType(value);
    if (value !== 'All') {
      const filteredData = OrderListData.filter(item => 
        item.accounttype && item.accounttype.toLowerCase() === value.toLowerCase()
      );
      setList(filteredData);
    } else {
      setList(OrderListData);
    }
  };
  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    let data = utils.wildCardSearch(searchArray, value);
    
    // Apply account type filter if not 'All'
    if (accountType !== 'All') {
      data = data.filter(item => 
        item.accounttype && item.accounttype.toLowerCase() === accountType.toLowerCase()
      );
    }
    
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
  const dropdownMenu = (record) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={handleJob}
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
            onClick={() => showUserProfile(record)}
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
            onClick={() => openEditTransferModal(record)}
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
            onClick={() => deleteUser(record.id)}
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
    //   title: 'Chart Of Account	',
    //   dataIndex: 'chartofaccount',
    //   sorter: {
    //     compare: (a, b) => a.chartofaccount.length - b.chartofaccount.length,
    //   },
    // },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: {
        compare: (a, b) => a.date.length - b.date.length,
      },
    },
    {
      title: 'From Account',
      dataIndex: 'fromaccount',
      sorter: {
        compare: (a, b) => a.fromaccount.length - b.fromaccount.length,
      },
    },
    {
      title: 'To Account',
      dataIndex: 'toaccount',
      sorter: {
        compare: (a, b) => a.toaccount.length - b.toaccount.length,
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: {
        compare: (a, b) => a.amount.length - b.amount.length,
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: {
        compare: (a, b) => a.description.length - b.description.length,
      },
    },
    // {
    //   title: 'Bank Branch',
    //   dataIndex: 'bankbranch',
    //   sorter: {
    //     compare: (a, b) => a.bankbranch.length - b.bankbranch.length,
    //   },
    // },
    // {
    //   title: 'Account Type',
    //   dataIndex: 'accounttype',
    //   sorter: {
    //     compare: (a, b) => {
    //       if (a.accounttype && b.accounttype) {
    //         return a.accounttype.localeCompare(b.accounttype);
    //       }
    //       return 0;
    //     },
    //   },
    //   render: (accounttype) => (
    //     <Tag color={getAccountTypeColor(accounttype)}>
    //       {accounttype}
    //     </Tag>
    //   ),
    // },
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
  // Open Add Account Modal
  const openAddAccountModal = () => {
    setIsAddAccountModalVisible(true);
  };

  // Close Add Account Modal
  const closeAddAccountModal = () => {
    setIsAddAccountModalVisible(false);
  };

  // Add these handler functions
  const openEditAccountModal = (account) => {
    setSelectedAccount(account);
    setIsEditAccountModalVisible(true);
  };

  const closeEditAccountModal = () => {
    setIsEditAccountModalVisible(false);
  };

  // Helper function to get tag color based on account type
  const getAccountTypeColor = type => {
    switch (type?.toLowerCase()) {
      case 'salary':
        return 'green';
      case 'savings':
        return 'blue';
      case 'current':
        return 'purple';
      default:
        return 'default';
    }
  };

  const openAddTransferModal = () => {
    setIsAddTransferModalVisible(true);
  };

  const closeAddTransferModal = () => {
    setIsAddTransferModalVisible(false);
  };

  const openEditTransferModal = (transfer) => {
    setSelectedTransfer(transfer);
    setIsEditTransferModalVisible(true);
  };

  const closeEditTransferModal = () => {
    setIsEditTransferModalVisible(false);
    setSelectedTransfer(null);
  };

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
              value={accountType}
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleAccountTypeFilter}
              placeholder="Account Type"
            >
              {accountTypeList.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddTransferModal}>
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
      {/* Add Account Modal */}
      <Modal
        title="Create Transfer"
        visible={isAddTransferModalVisible}
        onCancel={closeAddTransferModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
      >
        <AddTransfer onClose={closeAddTransferModal} />
      </Modal>
      <Modal
        title="Edit Transfer"
        visible={isEditTransferModalVisible}
        onCancel={closeEditTransferModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
        // height={1000}
      >
        <EditTransfer 
          onClose={closeEditTransferModal} 
          transferData={selectedTransfer}
        />
      </Modal>
    </Card>
  );
};
export default TransferList;


