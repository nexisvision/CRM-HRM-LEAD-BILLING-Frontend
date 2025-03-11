import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Input, Button, Modal, Select } from 'antd';
import { DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddVendor from './AddVendor';
import EditVendor from './Editvendor';
import { vendordatadeletee, vendordataedata } from './vendorReducers/vendorSlice';
import { useDispatch, useSelector } from 'react-redux';
const { Option } = Select

const VendorList = () => {
  const [list, setList] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const [accountType, setAccountType] = useState('All');
  const [isAddVendorModalVisible, setIsAddVendorModalVisible] = useState(false);
  const [isEditVendorModalVisible, setIsEditVendorModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [idd, setIdd] = useState("");
  const accountTypeList = ['All', 'Salary', 'Savings', 'Current'];

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

  // Handle account type filter
  const handleAccountTypeFilter = value => {
    setAccountType(value);
    if (value !== 'All') {
      const filteredData = list.filter(item =>
        item.accounttype && item.accounttype.toLowerCase() === value.toLowerCase()
      );
      setList(filteredData);
    } else {
      setList([]); // or refetch the data
    }
  };
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

  const dropdownMenu = (record) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => openEditVendorModal(record)}
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
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
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
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
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

  return (
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
  );
};
export default VendorList;


