import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Button, Input, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from 'react-redux';
import utils from 'utils';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import AddRole from './AddRole';
import { deleteRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';
import EditRole from './EditRole';

const RoleList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
  const [id, setId] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState(false);
  const dispatch = useDispatch();

  const loginUser = useSelector((state) => state.user.loggedInUser);
  const tabledata = useSelector((state) => state.role.role.data);

  const filteredData = Array.isArray(tabledata) && loginUser ?
    tabledata.filter((item) => item.created_by === loginUser.username) : [];


  const openEditRoleModal = () => {
    setIsEditRoleModalVisible(true);
  };

  const closeEditRoleModal = () => {
    setIsEditRoleModalVisible(false);
  };

  const openAddRoleModal = () => {
    setIsAddRoleModalVisible(true);
  };

  const closeAddRoleModal = () => {
    setIsAddRoleModalVisible(false);
  };

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    if (filteredData) {
      setUsers(filteredData);
    }
  }, [filteredData]);



  const editfun = (id) => {
    openEditRoleModal();
    setId(id);
  }
  const deleteRoles = (userId) => {
    dispatch(deleteRole(userId))
      .then(() => {
        dispatch(getRoles());
        message.success('Appraisal Deleted successfully!');
        setUsers(users.filter(item => item.id !== userId));

      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
  };


  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EditOutlined />}
            onClick={() => {
              editfun(elm.id);
            }}
            size="small"
          >
            Edit
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<DeleteOutlined />} onClick={() => { deleteRoles(elm.id) }} size="small">
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const renderPermissions = (permissions) => {
    try {
      const parsedPermissions =
        permissions && typeof permissions === "string" ? JSON.parse(permissions) : {};
  
      return Object.keys(parsedPermissions).map(moduleKey => (
        <div key={moduleKey}>
          {parsedPermissions[moduleKey].map(permission => (
            <div key={permission.key} style={{ marginBottom: '5px' }}>
              {permission.permissions.map(action => (
                <Button key={`${permission.key}-${action}`} size="small" style={{ margin: '2px', backgroundColor: '#3e79f7', color: 'white' }}>
                  {`${permission.key.replace('extra-hrm-', '')}  ${action}`} {/* Remove prefix for cleaner display */}
                </Button>
              ))}
            </div>
          ))}
        </div>
      ));
    } catch (error) {
      console.error("Error parsing permissions:", error);
      return "Invalid Permissions";
    }
  };


  const tableColumns = [
    {
      title: 'Role',
      dataIndex: 'role_name',
      sorter: {
        compare: (a, b) => a.role_name.length - b.role_name.length,
      },
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      render: (permissions) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {renderPermissions(permissions)}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      )
    },
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddRoleModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>

      <Modal
        title="Add Role"
        visible={isAddRoleModalVisible}
        onCancel={closeAddRoleModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddRole onClose={closeAddRoleModal} />
      </Modal>

      <Modal
        title="Edit Role"
        visible={isEditRoleModalVisible}
        onCancel={closeEditRoleModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <EditRole onClose={closeEditRoleModal} id={id} />
      </Modal>
    </Card>
  );
};

export default RoleList;