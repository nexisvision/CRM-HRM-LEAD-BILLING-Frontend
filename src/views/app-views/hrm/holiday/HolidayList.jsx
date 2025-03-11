import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal } from 'antd';
import { DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import { deltsholidayss, getsholidayss } from './AttendanceReducer/holidaySlice';
import { useDispatch, useSelector } from 'react-redux';

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

  const dropdownMenu = (record) => ({
    items: [
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
        onClick: () => deleteHoliday(record.id)
      }
    ]
  });

  const tableColumns = [
    {
      title: 'Holiday Name',
      dataIndex: 'holiday_name',
      sorter: (a, b) => a.holiday_name.localeCompare(b.holiday_name),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leave_type',
      render: (text) => (
        <Tag color={text === 'paid' ? 'green' : 'red'} className="capitalize px-3 py-1">
          {text || 'N/A'}
        </Tag>
      ),
      sorter: (a, b) => (a.leave_type || '').localeCompare(b.leave_type || ''),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Unpaid', value: 'unpaid' },
      ],
      onFilter: (value, record) => record.leave_type === value,
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
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(record)} />
        </div>
      ),
    },
  ];

  return (
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

      <style jsx="true">{`
        .capitalize {
          text-transform: capitalize;
        }
        .ant-tag {
          border-radius: 20px;
          font-weight: 500;
        }
        .table-responsive .ant-table-thead > tr > th {
          background: #f8fafc;
          color: #1f2937;
        }
        .ant-select-selector {
          border-radius: 6px !important;
        }
        .ant-input-affix-wrapper {
          border-radius: 6px !important;
        }
        .ant-input-affix-wrapper:hover {
          border-color: #40a9ff !important;
        }
        .ant-input-affix-wrapper-focused {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
      `}</style>
    </Card>
  );
};

export default HolidayList;