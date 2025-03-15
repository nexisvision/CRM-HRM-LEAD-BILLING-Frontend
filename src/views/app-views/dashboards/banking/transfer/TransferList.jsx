import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, Button, Modal, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import { useNavigate } from 'react-router-dom';
import utils from 'utils';
import AddTransfer from './AddTransfer';
import EditTransfer from './EditTransfer';
import { transferdatas, transferdeltess } from './transferReducers/transferSlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

// Add this helper function to strip HTML tags
const stripHtmlTags = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

const TransferList = () => {
  const [list, setList] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [accountType, setAccountType] = useState('All');
  const [isAddTransferModalVisible, setIsAddTransferModalVisible] = useState(false);
  const [isEditTransferModalVisible, setIsEditTransferModalVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [idd, setIdd] = useState("");
  // Add the missing state variables
  const [accountsList, setAccountsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(transferdatas())
  }, [dispatch])

  const handleJob = () => {
    navigate('/app/hrm/jobs/viewjob', { state: { user: selectedUser } });
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
  };
  const deleteUser = (userId) => {
    dispatch(transferdeltess(userId))
      .then(() => {
        dispatch(transferdatas())
        setList(list.filter((item) => item.id !== userId));
      })
  };

  const alltransferdata = useSelector((state) => state?.transfer?.transfer?.data);



  useEffect(() => {
    if (alltransferdata) {
      setList(alltransferdata)
    }
  }, [alltransferdata])

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };
  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };
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
      // height={1000}
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


