import React, { useState, useEffect } from 'react';
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
// import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';
import AddVendor from './AddVendor';
import EditVendor from './Editvendor';
import { vendordatadeletee, vendordataedata } from './vendorReducers/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';
const { Option } = Select

const VendorList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);
  const [isEditJobModalVisible, setIsEditJobModalVisible] = useState(false);
  const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);
  const [isEditAccountModalVisible, setIsEditAccountModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [isViewJobModalVisible, setIsViewJobModalVisible] = useState(false);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState('All');
  const [isAddTransferModalVisible, setIsAddTransferModalVisible] = useState(false);
  const [isEditTransferModalVisible, setIsEditTransferModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isAddVendorModalVisible, setIsAddVendorModalVisible] = useState(false);
  const [isEditVendorModalVisible, setIsEditVendorModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [idd, setIdd] = useState("");

  // Add account type options
  const accountTypeList = ['All', 'Salary', 'Savings', 'Current'];

  // useEffect(() => {
  //   // Fetch data from an API or state management store
  //   const fetchVendorData = async () => {
  //     try {
  //       const response = await fetch('/api/vendors'); // Replace with actual API endpoint
  //       const data = await response.json();
  //       setList(data);
  //     } catch (error) {
  //       console.error('Failed to fetch vendor data:', error);
  //     }
  //   };

  //   fetchVendorData();
  // }, []);

  useEffect(()=>{
    dispatch(vendordataedata())
  },[dispatch])

  const alllloggeduser = useSelector((state)=>state.user.loggedInUser.username);
  const allvendordata = useSelector((state)=>state?.vendors?.vendors?.data);

  const fnsddta = allvendordata?.filter((item)=>item?.created_by === alllloggeduser)

  useEffect(()=>{
    if(fnsddta){
      setList(fnsddta)
    }
  },[allvendordata])

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
      const filteredData = list.filter(item => 
        item.accounttype && item.accounttype.toLowerCase() === value.toLowerCase()
      );
      setList(filteredData);
    } else {
      setList([]); // or refetch the data
    }
  };
  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    if (!value) {
        setList(fnsddta);
        return;
    }
    
    const searchArray = fnsddta.filter(item => 
        item.name?.toLowerCase().includes(value) ||
        item.address?.toLowerCase().includes(value) ||
        item.city?.toLowerCase().includes(value) ||
        item.state?.toLowerCase().includes(value) ||
        item.country?.toLowerCase().includes(value)
    );
    
    setList(searchArray);
    setSelectedRowKeys([]);
  };
  // Delete user
  const deleteUser = (userId) => {
    dispatch(vendordatadeletee(userId))
      .then(()=>{
        dispatch(vendordataedata())
        setList(list.filter((item) => item.id !== userId));
      })
  
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
            onClick={() => openEditVendorModal(record)}
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
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: (address) => (
        <span>{address || 'N/A'}</span>
      ),
      sorter: {
        compare: (a, b) => (a.address || '').localeCompare(b.address || ''),
      },
    },
    {
      title: 'City',
      dataIndex: 'city',
      render: (city) => (
        <span>{city || 'N/A'}</span>
      ),
      sorter: {
        compare: (a, b) => (a.city || '').localeCompare(b.city || ''),
      },
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: (state) => (
        <span>{state || 'N/A'}</span>
      ),
      sorter: {
        compare: (a, b) => (a.state || '').localeCompare(b.state || ''),
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      render: (country) => (
        <span>{country || 'N/A'}</span>
      ),
      sorter: {
        compare: (a, b) => (a.country || '').localeCompare(b.country || ''),
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

  const openAddVendorModal = () => {
    setIsAddVendorModalVisible(true);
  };

  const closeAddVendorModal = () => {
    setIsAddVendorModalVisible(false);
  };

  const openEditVendorModal = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditVendorModalVisible(true);
    setIdd(vendor.id)
  };

  const closeEditVendorModal = () => {
    setIsEditVendorModalVisible(false);
    setSelectedVendor(null);
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
          <Button type="primary" className="ml-2" onClick={openAddVendorModal}>
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
        title="Create Vendor"
        visible={isAddVendorModalVisible}
        onCancel={closeAddVendorModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
      >
        <AddVendor onClose={closeAddVendorModal} />
      </Modal>
      <Modal
        title="Edit Vendor"
        visible={isEditVendorModalVisible}
        onCancel={closeEditVendorModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
        // height={1000}
      >
        <EditVendor 
          onClose={closeEditVendorModal} 
          vendorData={selectedVendor}
          idd={idd}
        />
      </Modal>
    </Card>
  );
};
export default VendorList;


