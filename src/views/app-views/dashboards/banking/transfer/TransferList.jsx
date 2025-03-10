import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import { useNavigate } from 'react-router-dom';
import utils from 'utils';
import AddTransfer from './AddTransfer';
import EditTransfer from './EditTransfer';
import { transferdatas, transferdeltess } from './transferReducers/transferSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAccounts } from '../account/AccountReducer/AccountSlice';

const { Option } = Select;

const TransferList = () => {
  const [users, setUsers] = useState([]);
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
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountType, setAccountType] = useState('All');
  const [isAddTransferModalVisible, setIsAddTransferModalVisible] = useState(false);
  const [isEditTransferModalVisible, setIsEditTransferModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [idd, setIdd] = useState("");
  const [accountsList, setAccountsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(()=>{
    dispatch(transferdatas())
    dispatch(getAccounts())
  },[dispatch])

  // Open Add Job Modal
  const openAddJobModal = () => {
    setIsAddJobModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };
  const handleJob = () => {
    navigate('/app/hrm/jobs/viewjob', { state: { user: selectedUser } }); 
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
    }
  };
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = list;
    let data = utils.wildCardSearch(searchArray, value);
    
    if (accountType !== 'All') {
      data = data.filter(item => 
        item.accounttype && item.accounttype.toLowerCase() === accountType.toLowerCase()
      );
    }
    
    setList(data);
    setSelectedRowKeys([]);
  };
  const deleteUser = (userId) => {
    dispatch(transferdeltess(userId))
      .then(()=>{
        dispatch(transferdatas())
        setList(list.filter((item) => item.id !== userId));
      })
  };

  const loggeddata = useSelector((state)=>state.user.loggedInUser.username);

  const alltransferdata = useSelector((state)=>state?.transfer?.transfer?.data);


  useEffect(()=>{
    if(alltransferdata){
      setList(alltransferdata)
    }
},[alltransferdata])

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
  
  
  
  const jobStatusList = ['active', 'blocked']

  const stripHtmlTags = (html) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const tableColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: {
        compare: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      },
    },
    {
      title: 'From Account',
      dataIndex: 'fromAccount',
      render: (fromAccount) => {
        const account = accountsList.find(acc => acc.id === fromAccount);
        return account ? account.bankName : 'Unknown Account';
      },
      sorter: {
        compare: (a, b) => {
          const accountA = accountsList.find(acc => acc.id === a.fromAccount);
          const accountB = accountsList.find(acc => acc.id === b.fromAccount);
          return accountA?.bankName.localeCompare(accountB?.bankName) || 0;
        },
      },
    },
    {
      title: 'To Account',
      dataIndex: 'toAccount',
      render: (toAccount) => {
        const account = accountsList.find(acc => acc.id === toAccount);
        return account ? account.bankName : 'Unknown Account';
      },
      sorter: {
        compare: (a, b) => {
          const accountA = accountsList.find(acc => acc.id === a.toAccount);
          const accountB = accountsList.find(acc => acc.id === b.toAccount);
          return accountA?.bankName.localeCompare(accountB?.bankName) || 0;
        },
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
      render: (description) => stripHtmlTags(description),
      sorter: {
        compare: (a, b) => stripHtmlTags(a.description).localeCompare(stripHtmlTags(b.description)),
      },
    },
   
  ];
  const openAddAccountModal = () => {
    setIsAddAccountModalVisible(true);
  };

  const closeAddAccountModal = () => {
    setIsAddAccountModalVisible(false);
  };

  const openEditAccountModal = (account) => {
    setSelectedAccount(account);
    setIsEditAccountModalVisible(true);
  };

  const closeEditAccountModal = () => {
    setIsEditAccountModalVisible(false);
  };

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
    setIdd(transfer.id)
  };

  const closeEditTransferModal = () => {
    setIsEditTransferModalVisible(false);
    setSelectedTransfer(null);
  };

  const allAccountsData = useSelector((state) => state?.account?.account?.data);

  useEffect(() => {
    if (allAccountsData) {
      setAccountsList(allAccountsData);
    }
  }, [allAccountsData]);

  // Add date search handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const filteredData = alltransferdata.filter(item => 
        dayjs(item.date).format('YYYY-MM-DD') === formattedDate
      );
      setList(filteredData);
    } else {
      // If date is cleared, reset to original data
      setList(alltransferdata);
    }
  };

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
     
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input 
              placeholder="Search" 
              prefix={<SearchOutlined />} 
              onChange={(e) => onSearch(e)} 
            />
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker 
              placeholder="Select Date"
              onChange={handleDateChange}
              value={selectedDate}
              format="DD/MM/YYYY"
              style={{ width: '200px' }}
            />
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
      >
        <EditTransfer 
          onClose={closeEditTransferModal} 
          transferData={selectedTransfer}
          idd={idd}
        />
      </Modal>
    </Card>
  );
};
export default TransferList;


