import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, DatePicker, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddMeeting from './AddMeeting';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import { utils, writeFile } from "xlsx";
import EditMeeting from './EditMeeting';
import { deleteM, MeetData } from './MeetingReducer/MeetingSlice';
import { useDispatch, useSelector } from 'react-redux';
import ViewMeeting from './ViewMeeting';

const MeetingList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddMeetingModalVisible, setIsAddMeetingModalVisible] = useState(false);
  const [isEditMeetingModalVisible, setIsEditMeetingModalVisible] = useState(false);
  const [meetid, setMeetid] = useState("");
  const [searchText, setSearchText] = useState('');
  const [isViewMeetingModalVisible, setIsViewMeetingModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Meeting?.Meeting?.data || []);
  const filteredData = tabledata.filter((item) => item.created_by === user) || [];

  //   const [dealStatisticData] = useState(DealStatisticData);

  // Open Add Job Modal
  const openAddMeetingModal = () => {
    setIsAddMeetingModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddMeetingModal = () => {
    setIsAddMeetingModalVisible(false);
  };


  // Open Add Job Modal
  const openEditMeetingModal = () => {
    setIsEditMeetingModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditMeetingModal = () => {
    setIsEditMeetingModalVisible(false);
  };

  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data || []);
  const roleData = roles?.find(role => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-meeting"] && parsedPermissions["extra-hrm-meeting"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-meeting"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission




  // Search functionality
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Update getFilteredMeetings to include date filtering
  const getFilteredMeetings = () => {
    if (!filteredData) return [];

    let result = [...filteredData];

    // Apply text search filter
    if (searchText) {
      const searchValue = searchText.toLowerCase().trim();
      result = result.filter(meeting => {
        return (
          meeting.title?.toLowerCase().includes(searchValue) ||
          meeting.startTime?.toLowerCase().includes(searchValue) ||
          meeting.status?.toLowerCase().includes(searchValue) ||
          (searchValue === 'completed' && meeting.status?.toLowerCase() === 'completed') ||
          (searchValue === 'scheduled' && meeting.status?.toLowerCase() === 'scheduled') ||
          (searchValue === 'cancelled' && meeting.status?.toLowerCase() === 'cancelled')
        );
      });
    }

    // Apply date filter
    if (selectedDate) {
      const filterDate = dayjs(selectedDate).format('YYYY-MM-DD');
      result = result.filter(meeting => {
        const meetingDate = dayjs(meeting.date).format('YYYY-MM-DD');
        return meetingDate === filterDate;
      });
    }

    // Apply status filter
    if (selectedStatus) {
      result = result.filter(meeting => 
        meeting.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return result;
  };

  // Add search button handler
  const handleSearch = () => {
    message.success('Search completed');
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteM(userId));

      const updatedData = await dispatch(MeetData());

      setSelectedUser(null);
      setUserProfileVisible(false);

      message.success({ content: 'Deleted meeting successfully.', duration: 2 });
    } catch (error) {
      message.error({ content: 'Failed to delete meeting', duration: 2 });
      console.error('Error deleting meeting:', error);
    }
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

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(filteredData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Meeting");
      writeFile(wb, "MeetingData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(MeetData());
  }, [dispatch]);

  useEffect(() => {
    if (filteredData) {
      // Filter meetings by created_by matching the logged-in user's username
      setSelectedUser(filteredData[0]);
    }
  }, [tabledata]);

  const EditMeet = (id) => {
    openEditMeetingModal();
    setMeetid(id)
  }

  const closeViewMeetingModal = () => {
    setIsViewMeetingModalVisible(false);
  };

  const openViewMeetingModal = (id) => {
    setMeetid(id);
    setIsViewMeetingModalVisible(true);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => openViewMeetingModal(elm.id)}
            size="small"
          >
            <span className="">View</span>
          </Button>
        </Flex>
      </Menu.Item>

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              className=""
              icon={<EditOutlined />}
              onClick={() => EditMeet(elm.id)}
              size="small"
            >
              <span className="">Edit</span>
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}


      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
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
      ) : null}
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Meeting title ',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },

    {
      title: "Meeting Date",
      dataIndex: "date",
      render: (_, record) => (
        <span>
          {record.date ? dayjs(record.date).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "date"),
    },


    {
      title: 'Start Time',
      dataIndex: 'startTime',
      render: (startTime) => {
        return startTime ? dayjs(`2000-01-01 ${startTime}`).format('h:mm A') : '-';
      },
      sorter: (a, b) => utils.antdTableSorter(a, b, 'startTime')
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      render: (endTime) => {
        return endTime ? dayjs(`2000-01-01 ${endTime}`).format('h:mm A') : '-';
      },
      sorter: (a, b) => utils.antdTableSorter(a, b, 'endTime')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'default';
        switch (status?.toLowerCase()) {
          case 'completed':
            color = 'success';
            break;
          case 'pending':
            color = 'warning';
            break;
          case 'cancelled':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status?.toUpperCase() || 'N/A'}</Tag>;
      },
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

  // Add date change handler
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Add status change handler
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <Card bodyStyle={{ padding: '-3px' }}>

      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input.Group compact>
              <Input
                placeholder="Search meeting title"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                allowClear
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker
              onChange={handleDateChange}
              value={selectedDate}
              format="DD-MM-YYYY"
              placeholder="Filter by date"
              allowClear
              style={{ width: '200px' }}
            />
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              placeholder="Filter by status"
              onChange={handleStatusChange}
              value={selectedStatus}
              style={{ width: '200px' }}
              allowClear
            >
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">


          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddMeetingModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>

          ) : null}
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel} // Call export function when the button is clicked
            block
          >
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table
            columns={tableColumns}
            dataSource={getFilteredMeetings()}
            rowKey="id"
            pagination={{
              total: getFilteredMeetings().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}



      </div>
      {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}

      {/* Add Job Modal */}
      <Modal
        title="Add Meeting"
        visible={isAddMeetingModalVisible}
        onCancel={closeAddMeetingModal}
        footer={null}
        width={1000}
      >
        <AddMeeting onClose={closeAddMeetingModal} />
      </Modal>
      <Modal
        title="Edit Meeting"
        visible={isEditMeetingModalVisible}
        onCancel={closeEditMeetingModal}
        footer={null}
        width={1000}
      >
        <EditMeeting onClose={closeEditMeetingModal} meetid={meetid} />
      </Modal>
      <Modal
        title="View Meeting"
        visible={isViewMeetingModalVisible}
        onCancel={closeViewMeetingModal}
        footer={null}
        width={1000}
      >
        <ViewMeeting onClose={closeViewMeetingModal} meetid={meetid} />
      </Modal>
    </Card>
  );
};

// Add styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  .ant-input-group .ant-input {
    width: calc(100% - 90px);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ant-input-group .ant-btn {
    width: 90px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-group {
      width: 100%;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const MeetingListWithStyles = () => (
  <>
    <style>{styles}</style>
    <MeetingList />
  </>
);

export default MeetingListWithStyles;

