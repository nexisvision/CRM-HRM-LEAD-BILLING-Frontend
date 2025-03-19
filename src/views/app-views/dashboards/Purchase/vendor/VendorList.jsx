import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Input, Button, Modal, Select, Dropdown } from 'antd';
import { DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, FileExcelOutlined, MoreOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddVendor from './AddVendor';
import EditVendor from './Editvendor';
import { vendordatadeletee, vendordataedata } from './vendorReducers/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';

const VendorList = () => {
  const [list, setList] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const [isAddVendorModalVisible, setIsAddVendorModalVisible] = useState(false);
  const [isEditVendorModalVisible, setIsEditVendorModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(vendordataedata())
  }, [dispatch])

  const alllloggeduser = useSelector((state) => state.user.loggedInUser.username);
  const allvendordata = useSelector((state) => state?.vendors?.vendors?.data);

  const fnsddta = allvendordata?.filter((item) => item?.created_by === alllloggeduser)

  useEffect(() => {
    if (fnsddta) {
      setList(fnsddta)
    }
  }, [allvendordata, fnsddta])


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
  };
  // Delete user
  const deleteUser = (userId) => {
    dispatch(vendordatadeletee(userId))
      .then(() => {
        dispatch(vendordataedata())
        setList(list.filter((item) => item.id !== userId));
      })

  };
  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const getDropdownItems = (record) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => openEditVendorModal(record)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => deleteUser(record.id),
      danger: true
    }
  ];

  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      render: (contact) => <span>{contact || 'N/A'}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (email) => <span>{email || 'N/A'}</span>,
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

    .table-responsive {
      overflow-x: auto;
    }

    .ant-input-affix-wrapper {
      transition: all 0.3s;
    }

    .ant-input-affix-wrapper:hover,
    .ant-input-affix-wrapper:focus {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .ant-table-row {
      transition: all 0.3s;
    }

    .ant-table-row:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    .ant-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .ant-modal-content {
      border-radius: 8px;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <Card bodyStyle={{ padding: '-3px' }}>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
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
        >
          <EditVendor
            onClose={closeEditVendorModal}
            vendorData={selectedVendor}
            idd={idd}
          />
        </Modal>
      </Card>
    </>
  );
};
export default VendorList;


