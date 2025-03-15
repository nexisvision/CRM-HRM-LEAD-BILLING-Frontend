import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal, Select, Tag, Dropdown } from 'antd';
import { DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import { deltsholidayss, getsholidayss } from './AttendanceReducer/holidaySlice';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;

const HolidayList = () => {
  const dispatch = useDispatch();
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [isAddHolidayModalVisible, setIsAddHolidayModalVisible] = useState(false);
  const [isEditHolidayModalVisible, setIsEditHolidayModalVisible] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [idd, setIdd] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState('all');

  useEffect(() => {
    dispatch(getsholidayss());
  }, [dispatch]);

  const allholidaudata = useSelector((state) => state.holidays.holidays.data);

  useEffect(() => {
    if (allholidaudata) {
      setHolidays(allholidaudata);
      setFilteredHolidays(allholidaudata);
    }
  }, [allholidaudata]);

  const handleAddSuccess = () => {
    dispatch(getsholidayss());
    closeAddHolidayModal();
  };

  const handleEditSuccess = () => {
    dispatch(getsholidayss());
    closeEditHolidayModal();
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const filtered = holidays?.filter(holiday => 
      holiday?.holiday_name?.toLowerCase().includes(value) ||
      holiday?.leave_type?.toLowerCase().includes(value)
    ) || [];
    setFilteredHolidays(filtered);
  };

  const handleLeaveTypeFilter = (value) => {
    setSelectedLeaveType(value);
    if (value === 'all') {
      setFilteredHolidays(holidays);
    } else {
      const filtered = holidays.filter(holiday => holiday.leave_type === value);
      setFilteredHolidays(filtered);
    }
  };

  const deleteHoliday = async (id) => {
    try {
      await dispatch(deltsholidayss(id))
        .then(() => {
          message.success('Holiday deleted successfully');
          dispatch(getsholidayss());
        })
        .catch((error) => {
          message.error('Failed to delete holiday');
        })
    } catch (error) {
      message.error('Failed to delete holiday');
    }
  };

  const openAddHolidayModal = () => {
    setIsAddHolidayModalVisible(true);
  };

  const closeAddHolidayModal = () => {
    setIsAddHolidayModalVisible(false);
  };

  const openEditHolidayModal = (holiday) => {
    setIdd(holiday.id);
    setSelectedHoliday(holiday);
    setIsEditHolidayModalVisible(true);
  };

  const closeEditHolidayModal = () => {
    setSelectedHoliday(null);
    setIsEditHolidayModalVisible(false);
  };

  const getDropdownItems = (record) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => openEditHolidayModal(record)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => deleteHoliday(record.id),
      danger: true
    }
  ];

  const tableColumns = [
    {
      title: 'Holiday Name',
      dataIndex: 'holiday_name',
      sorter: (a, b) => a.holiday_name.localeCompare(b.holiday_name),
      render: (text) => <span className="holiday-name">{text}</span>
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type',
      sorter: (a, b) => a.leave_type.localeCompare(b.leave_type),
      render: (type) => (
        <Tag color={type === 'paid' ? 'green' : 'orange'} className="leave-type-tag">
          {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
      sorter: (a, b) => dayjs(a.start_date).unix() - dayjs(b.start_date).unix(),
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
      sorter: (a, b) => dayjs(a.end_date).unix() - dayjs(b.end_date).unix(),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            overlay={<Menu items={getDropdownItems(record)} />}
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

  const styles = `
    .capitalize {
      text-transform: capitalize;
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

    .holiday-name {
      font-weight: 500;
      
    }

    .leave-type-tag {
      border-radius: 20px;
      font-weight: 500;
      text-transform: capitalize;
      padding: 2px 12px;
    }

    .ant-table-row {
      transition: all 0.3s;
    }

    .ant-table-row:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    .table-responsive .ant-table-thead > tr > th {
      background: #f8fafc;
      color: #1f2937;
      font-weight: 600;
    }

    .ant-select-selector {
      border-radius: 6px !important;
      transition: all 0.3s !important;
    }

    .ant-select-selector:hover {
      border-color: #40a9ff !important;
    }

    .ant-select-focused .ant-select-selector {
      border-color: #40a9ff !important;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
    }

    .ant-input-affix-wrapper {
      border-radius: 6px !important;
      transition: all 0.3s;
    }

    .ant-input-affix-wrapper:hover {
      border-color: #40a9ff !important;
    }

    .ant-input-affix-wrapper-focused {
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
      .flex.items-center.gap-4 {
        flex-direction: column;
        align-items: stretch;
      }

      .min-w-[200px] {
        min-width: 100% !important;
      }

      .ml-2 {
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <Card bodyStyle={{ padding: '-3px' }}>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <div className="mr-md-3 mb-3 flex items-center gap-4">
            <Input 
              placeholder="Search Holiday" 
              prefix={<SearchOutlined />} 
              onChange={onSearch}
              className="min-w-[200px]"
            />
            <Select
              value={selectedLeaveType}
              onChange={handleLeaveTypeFilter}
              style={{ width: 120 }}
              className="ml-2"
            >
              <Option value="all">All Types</Option>
              <Option value="paid">Paid</Option>
              <Option value="unpaid">Unpaid</Option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button type="primary" onClick={openAddHolidayModal}>
              <PlusOutlined />
              <span>Add Holiday</span>
            </Button>
          </div>
        </Flex>

        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={filteredHolidays}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        </div>

        <Modal
          title="Add Holiday"
          visible={isAddHolidayModalVisible}
          onCancel={closeAddHolidayModal}
          footer={null}
          width={800}
        >
          <AddHoliday
            onClose={closeAddHolidayModal}
            onSuccess={handleAddSuccess}
          />
        </Modal>

        <Modal
          title="Edit Holiday"
          visible={isEditHolidayModalVisible}
          onCancel={closeEditHolidayModal}
          footer={null}
          width={800}
        >
          <EditHoliday
            idd={idd}
            holiday={selectedHoliday}
            onClose={closeEditHolidayModal}
            onSuccess={handleEditSuccess}
          />
        </Modal>
      </Card>
    </>
  );
};

export default HolidayList;