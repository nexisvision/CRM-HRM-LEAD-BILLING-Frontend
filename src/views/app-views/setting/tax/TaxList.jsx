import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Row, Col, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, FileExcelOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTaxes,deleteTax } from '../tax/taxreducer/taxSlice';
import AddTax from './AddTax';
import EditTax from './EditTax';

const TaxList = () => {
  const dispatch = useDispatch();
  const { taxes, loading } = useSelector((state) => state.tax);
  const [isAddTaxModalVisible, setIsAddTaxModalVisible] = useState(false);
  const [isEditTaxModalVisible, setIsEditTaxModalVisible] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getAllTaxes());
  }, [dispatch]);



  useEffect(() => {
    // Ensure taxes is an array before setting filtered taxes
    if (Array.isArray(taxes?.data)) {
      setFilteredTaxes(taxes.data);
    } else if (Array.isArray(taxes)) {
      setFilteredTaxes(taxes);
    } else {
      setFilteredTaxes([]);
    }
  }, [taxes]);

  // Open Add Tax Modal
  const openAddTaxModal = () => {
    setIsAddTaxModalVisible(true);
  };

  // Close Add Tax Modal
  const closeAddTaxModal = () => {
    setIsAddTaxModalVisible(false);
    // Refresh the tax list after adding
    // dispatch(getAllTaxes());
  };

  const openEditTaxModal = (tax) => {
    setSelectedTax(tax);
    setIsEditTaxModalVisible(true);
    setIdd(tax._id || tax.id);
  };

  const closeEditTaxModal = () => {
    setSelectedTax(null);
    setIsEditTaxModalVisible(false);
    // Refresh the tax list after editing
    dispatch(getAllTaxes());
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const taxesToFilter = Array.isArray(taxes?.data) ? taxes.data : Array.isArray(taxes) ? taxes : [];
    
    const filtered = taxesToFilter.filter(
      tax => 
        tax?.gstName?.toLowerCase().includes(value) || 
        tax?.gstPercentage?.toString().includes(value)
    );
    setFilteredTaxes(filtered);
  };



const delfun = (idd) => {
    dispatch(deleteTax(idd)).then(() => {
      dispatch(getAllTaxes());
      message.success('Tax deleted successfully');
    //   setList(list.filter((item) => item.id !== idd));
    });
  };

  const dropdownMenu = (record) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => openEditTaxModal(record)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => delfun(record.id)
      }
    ]
  });

  const tableColumns = [
    {
      title: 'GST Name',
      dataIndex: 'gstName',
      sorter: (a, b) => (a.gstName || '').localeCompare(b.gstName || ''),
    },
    {
      title: 'GST Percentage',
      dataIndex: 'gstPercentage',
      sorter: (a, b) => (a.gstPercentage || 0) - (b.gstPercentage || 0),
      render: (percentage) => percentage ? `${percentage}%` : '-'
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
    <Card bodyStyle={{ padding: '20px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input 
              placeholder="Search" 
              prefix={<SearchOutlined />} 
              onChange={onSearch}
            />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" onClick={openAddTaxModal}>
            <PlusOutlined />
            <span>Add Tax</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />}>
            Export
          </Button>
        </Flex>
      </Flex>

      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={filteredTaxes}
          rowKey="id"
          // loading={loading}
        />
      </div>

      {/* Add Tax Modal */}
      <Modal
        title="Add Tax"
        visible={isAddTaxModalVisible}
        onCancel={closeAddTaxModal}
        footer={null}
        width={800}
      >
        <AddTax onClose={closeAddTaxModal} />
      </Modal>

      {/* Edit Tax Modal */}
      <Modal
        title="Edit Tax"
        visible={isEditTaxModalVisible}
        onCancel={closeEditTaxModal}
        footer={null}
        width={800}
      >
        <EditTax onClose={closeEditTaxModal} idd={idd} tax={selectedTax} />
      </Modal>
    </Card>
  );
};

export default TaxList;

