import React, { useState, useEffect } from 'react';
import { Card, Table, Input, message, Button, Modal, Dropdown, Menu } from 'antd';
import { DeleteOutlined, SearchOutlined, FileExcelOutlined, EditOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTaxes, deleteTax } from '../tax/taxreducer/taxSlice';
import AddTax from './AddTax';
import EditTax from './EditTax';

const TaxList = () => {
  const dispatch = useDispatch();
  const { taxes } = useSelector((state) => state.tax);
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

  const getDropdownItems = (record) => [
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
      onClick: () => delfun(record.id),
      danger: true
    }
  ];

  const tableColumns = [
    {
      title: 'GST Name',
      dataIndex: 'gstName',
      sorter: (a, b) => (a.gstName || '').localeCompare(b.gstName || ''),
      render: (text) => <span className="gst-name">{text || '-'}</span>
    },
    {
      title: 'GST Percentage',
      dataIndex: 'gstPercentage',
      sorter: (a, b) => (a.gstPercentage || 0) - (b.gstPercentage || 0),
      render: (percentage) => (
        <span className="gst-percentage">
          {percentage ? `${percentage}%` : '-'}
        </span>
      )
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
    }
  ];

  const styles = `
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

    .gst-name {
      font-weight: 500;
   
    }

    // .gst-percentage {
    //   font-weight: 500;
    //   color: #52c41a;
    //   background-color: #f6ffed;
    //   padding: 2px 8px;
    //   border-radius: 4px;
    // }

    .ant-table-row {
      transition: all 0.3s;
    }

    .ant-table-row:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    .ant-input-affix-wrapper {
      border-radius: 6px;
      transition: all 0.3s;
    }

    .ant-input-affix-wrapper:hover,
    .ant-input-affix-wrapper:focus {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .ant-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 6px;
      transition: all 0.3s;
    }

    .ant-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .ant-modal-content {
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .ant-input-affix-wrapper {
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

  return (
    <>
      <style>{styles}</style>
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
    </>
  );
};

export default TaxList;

