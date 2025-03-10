import React, { useState, useEffect } from 'react';
import { Card, Table, Menu, Button, Input, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from 'react-redux';
import utils from 'utils';
import AddRole from './AddRole';
import { deleteRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';
import EditRole from './EditRole';

const RoleList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
  const [id, setId] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState(false);
  const dispatch = useDispatch();

  const loginUser = useSelector((state) => state.user.loggedInUser);
  const tabledata = useSelector((state) => state.role.role.data);

  const filteredData = Array.isArray(tabledata) && loginUser ?
    tabledata.filter((item) => item.created_by === loginUser.username) : [];

  const [searchText, setSearchText] = useState('');

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
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredRoles = () => {
    if (!users) return [];

    if (!searchText) return users;

    return users.filter(role => {
      return (
        role.role_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        JSON.stringify(role.permissions)?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  useEffect(() => {
    if (filteredData) {
      setUsers(filteredData);
    }
  }, [filteredData]);


  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-role"] && parsedPermissions["extra-hrm-role"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-role"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');


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
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button type="" icon={<DeleteOutlined />} onClick={() => { deleteRoles(elm.id) }} size="small">
              <span className="">Delete</span>
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}
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
            <Input
              placeholder="Search role name or permissions..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
        </Flex>
        <Flex gap="7px">
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddRoleModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          ) : null}
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table
            columns={tableColumns}
            dataSource={getFilteredRoles()}
            rowKey="id"
            pagination={{
              total: getFilteredRoles().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}
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

  .ant-input-affix-wrapper {
    min-width: 250px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-affix-wrapper {
      width: 100%;
      min-width: unset;
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

const RoleListWithStyles = () => (
  <>
    <style>{styles}</style>
    <RoleList />
  </>
);

export default RoleListWithStyles;