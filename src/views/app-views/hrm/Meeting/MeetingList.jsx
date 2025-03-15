import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal, DatePicker, Select, Dropdown } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, FileExcelOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddMeeting from './AddMeeting';
import { utils, writeFile } from "xlsx";
import EditMeeting from './EditMeeting';
import { deleteM, MeetData } from './MeetingReducer/MeetingSlice';
import { useDispatch, useSelector } from 'react-redux';
import ViewMeeting from './ViewMeeting';

const MeetingList = () => {
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
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

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

  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteM(userId));

      message.success({ content: 'Deleted meeting successfully.', duration: 2 });
    } catch (error) {
      message.error({ content: 'Failed to delete meeting', duration: 2 });
      console.error('Error deleting meeting:', error);
    }
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

  const getDropdownItems = (elm) => {
    const items = [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View',
        onClick: () => openViewMeetingModal(elm.id)
      }
    ];

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => EditMeet(elm.id)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(elm.id),
        danger: true
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: 'Meeting title',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
      render: (text) => <span className="meeting-title">{text}</span>
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
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
        </div>
      )
    },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .ant-dropdown-trigger {
    transition: all 0.3s;
  }

  .ant-dropdown-trigger:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .ant-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
  }

  .ant-menu-item:hover {
    background-color: #f0f7ff;
  }

  .ant-menu-item-danger:hover {
    background-color: #fff1f0;
  }

  .meeting-title {
    font-weight: 500;
  }

  .ant-table-row {
    transition: all 0.3s;
  }

  .ant-table-row:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .ant-tag {
    border-radius: 4px;
    padding: 2px 8px;
    font-weight: 500;
  }

  .ant-input-affix-wrapper,
  .ant-picker,
  .ant-select-selector {
    border-radius: 6px !important;
    transition: all 0.3s !important;
  }

  .ant-input-affix-wrapper:hover,
  .ant-picker:hover,
  .ant-select-selector:hover {
    border-color: #40a9ff !important;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused,
  .ant-picker-focused,
  .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
  }

  .ant-modal-content {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-group,
    .ant-picker,
    .ant-select {
      width: 100% !important;
      min-width: unset !important;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }

    .flex.items-center {
      flex-direction: column;
      align-items: stretch;
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

