import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, Select,message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, DollarOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AiOutlineContainer } from "react-icons/ai";
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddPaySlip from './AddPaySlip';
import userData from '../../../../../assets/data/user-list.data.json';
import OrderListData from '../../../../../assets/data/order-list.data.json';
import { DatePicker } from 'antd';
import utils from 'utils';
import EditPaySlip from './EditPaySlip';

const { Option } = Select

const { MonthPicker } = DatePicker;

const PaySlipList = () => { 
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddPaySlipModalVisible, setIsAddPaySlipModalVisible] = useState(false);
  const [isEditPaySlipModalVisible, setIsEditPaySlipModalVisible] = useState(false);

  const [annualStatisticData] = useState(AnnualStatisticData);
  const [selectedDate, setSelectedDate] = useState(dayjs());



  const onDateChange = (date) => {
    setSelectedDate(date);
    // Add logic to filter data based on the selected date
    console.log('Selected Date:', date);
  };
  // Open Add Job Modal
  const openAddPaySlipModal = () => {
    setIsAddPaySlipModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddPaySlipModal = () => {
    setIsAddPaySlipModalVisible(false);
  };

  const openEditPaySlipModal = () => {
    setIsEditPaySlipModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditPaySlipModal = () => {
    setIsEditPaySlipModalVisible(false);
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
            icon={<PushpinOutlined />}
            onClick={openEditPaySlipModal}
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
            icon={<AiOutlineContainer />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-4">Payslip</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<DollarOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Click to paid</span>
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

  const getpayslipStatus = status => {
    if (status === 'active') {
      return 'success'
    }
    if (status === 'blocked') {
      return 'warning'
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

  const payslipStatusList = ['active','blocked']

  const tableColumns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeid',
      sorter: {
        compare: (a, b) => a.employeeid.length - b.employeeid.length,
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
    },
    {
      title: 'Payroll Type',
      dataIndex: 'payrolltype',
      sorter: {
        compare: (a, b) => a.payrolltype.length - b.payrolltype.length,
      },
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      sorter: {
        compare: (a, b) => a.salary.length - b.salary.length,
      },
    },
    {
      title: 'Net Salary',
      dataIndex: 'netsalary',
      sorter: {
        compare: (a, b) => a.netsalary.length - b.netsalary.length,
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_,record) => (
        <Tag  color={getpayslipStatus(record.status)}>
          {record.status}
        </Tag>
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
          <div className="w-full md:w-48">
							<Select
								defaultValue="All"
								className="w-full"
								style={{ minWidth: 180 }}
								onChange={handleShowStatus}
								placeholder="method"
							>
								<Option value="All">All method </Option>
								{payslipStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
        </Flex>
        <Flex gap="7px">
        <MonthPicker
            placeholder="Select Month"
            format="MMM YYYY"
            onChange={onDateChange}
            className="ml-2 w-[230px]"
          />
          <Button type="primary" className="ml-2" onClick={openAddPaySlipModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          {/* <Button type="primary" className="" icon={<FileExcelOutlined />} block>
            Export All
          </Button> */}
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
        title="Add PaySlip"
        visible={isAddPaySlipModalVisible}
        onCancel={closeAddPaySlipModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddPaySlip onClose={closeAddPaySlipModal} />
      </Modal>
      <Modal
        title="Edit PaySlip"
        visible={isEditPaySlipModalVisible}
        onCancel={closeEditPaySlipModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <EditPaySlip onClose={closeEditPaySlipModal} />
      </Modal>
    </Card>
  );
};

export default PaySlipList;

