import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddHoliday from './AddHoliday';
import EditHoliday from './EditHoliday';
import axios from 'axios';
import utils from 'utils';
import { deltsholidayss, getsholidayss } from './AttendanceReducer/holidaySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const { Option } = Select;

const HolidayList = () => {
  const dispatch = useDispatch();
  const [holidays, setHolidays] = useState([]);
  const [filteredHolidays, setFilteredHolidays] = useState([]);
  const [isAddHolidayModalVisible, setIsAddHolidayModalVisible] = useState(false);
  const [isEditHolidayModalVisible, setIsEditHolidayModalVisible] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [idd, setIdd] = useState("");

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
    const value = e.currentTarget.value;
    const filtered = holidays?.filter(holiday => 
      holiday?.holiday_name?.toLowerCase().includes(value.toLowerCase())
    ) || [];
    setFilteredHolidays(filtered);
  };

  const deleteHoliday = async (id) => {
    try {
      await dispatch(deltsholidayss(id))
        .then(()=>{ 
          message.success('Holiday deleted successfully');
          dispatch(getsholidayss());
        })
        .catch((error)=>{
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
      title: 'Created By',
      dataIndex: 'created_by',
      sorter: (a, b) => (a.created_by || '').localeCompare(b.created_by || ''),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
        <div className="mr-md-3 mb-3">
          <Input 
            placeholder="Search Holiday" 
            prefix={<SearchOutlined />} 
            onChange={onSearch} 
          />
        </div>
        <Button type="primary" onClick={openAddHolidayModal}>
          <PlusOutlined />
          <span>Add Holiday</span>
        </Button>
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
  );
};

export default HolidayList;