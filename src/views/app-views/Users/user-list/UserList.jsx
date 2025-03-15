import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Select,
  Input,
  message,
  Button,
  Modal,
  Avatar,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "./UserView";
import Flex from "components/shared-components/Flex";
import AddUser from "./AddUser"; // Assuming AddUser is a component
import EditUser from "./EditUser"; // Assuming EditUser is a component
import ResetPassword from "./ResetPassword";
import { Dleteusetr, GetUsers } from "../UserReducers/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineEmail } from "react-icons/md";
import EmailVerification from "../../company/EmailVerification";
import { debounce } from 'lodash';

const UserList = () => {
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const paymentStatusList = ["active", "blocked"];

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const alluserdata = useSelector((state) => state.Users);
  const finddata = alluserdata.Users.data;

  const allroledata = useSelector((state) => state.role);
  const fnddata = allroledata.role.data;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (finddata) {
      setUsers(finddata);
    }
  }, [finddata]);


  //// permission

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

  if (parsedPermissions["extra-users-list"] && parsedPermissions["extra-users-list"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-users-list"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const data = users.filter(user => user.status === value);
      setUsers(data);
    } else {
      dispatch(GetUsers());
    }
  };

  // Create debounced version of search
  const debouncedSearch = debounce((value, data, setUsers) => {
    const searchValue = value.toLowerCase();

    if (!searchValue) {
      setUsers(data || []); // Reset to original filtered data
      return;
    }

    const filteredData = data?.filter(user => {
      return (
        user.name?.toString().toLowerCase().includes(searchValue) ||
        user.email?.toString().toLowerCase().includes(searchValue) ||
        user.status?.toString().toLowerCase().includes(searchValue)
      );
    }) || [];

    setUsers(filteredData);
  }, 300); // 300ms delay

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    debouncedSearch(value, finddata, setUsers);
  };

  const deleteUser = (userId) => {
    dispatch(Dleteusetr(userId));
    dispatch(GetUsers());
    setUsers(users.filter((user) => user.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    // Find the role name for the user
    const role = fnddata?.find(role => role.id === userInfo.role_id);
    setSelectedUser({
      ...userInfo,
      role_name: role?.role_name || 'N/A'
    });
    setUserProfileVisible(true);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const openAddUserModal = () => {
    setIsAddUserModalVisible(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalVisible(false);
  };

  const openEditUserModal = () => {
    setIsEditUserModalVisible(true);
  };

  const closeEditUserModal = () => {
    setIsEditUserModalVisible(false);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const Editfun = (idd) => {
    openEditUserModal();
    setIdd(idd);
  };

  const getDropdownItems = (record) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => showUserProfile(record)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => Editfun(record.id)
      });
    }

    items.push({
      key: 'email',
      icon: <MdOutlineEmail />,
      label: 'Update Email',
      onClick: () => {
        setIsEmailVerificationModalVisible(true);
        setSelectedUserId(record.id);
      }
    });

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(record.id),
        danger: true
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "User",
      dataIndex: "profilePic",
      render: (_, record) => (
        <div className="flex items-center">
          <div className="mr-3">
            {record.profilePic ? (
              <Avatar
                src={record.profilePic}
                size={40}
                className="border-2 border-white shadow-md"
              />
            ) : (
              <Avatar
                size={40}
                className="bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center"
              >
                {record.username?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.username || 'N/A'}
            </div>
            <div className="text-gray-500 text-sm">
              {record.email || 'No email'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role_id",
      render: (role_id) => {
        const role = fnddata?.find(role => role.id === role_id);
        return (
          <Tag color="blue" className="text-sm px-3 py-1 rounded-full font-medium">
            {role?.role_name || 'N/A'}
          </Tag>
        );
      }
    },
  
    {
      title: "Created",
      dataIndex: "createdAt",
      render: (date) => (
        <div className="text-gray-600">
          {date ? dayjs(date).format('DD MMM YYYY') : 'N/A'}
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
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
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "0" }} className="rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 p-6 border-b border-gray-100">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search users..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={onSearch}
                allowClear
                className="min-w-[250px] hover:border-blue-400 focus:border-blue-500"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="min-w-[180px]"
                onChange={handleShowStatus}
                placeholder="Status"
                style={{ borderRadius: '8px' }}
              >
                <Select.Option value="All">All Status</Select.Option>
                {paymentStatusList.map((elm) => (
                  <Select.Option key={elm} value={elm}>
                    {elm}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px">
            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) && (
              <Button
                type="primary"
                className="rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
                onClick={openAddUserModal}
              >
                <PlusOutlined />
                New
              </Button>
            )}
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              className="rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Export All
            </Button>
          </Flex>
        </Flex>
      </div>
      <div className="overflow-hidden">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            className="ant-table-striped"
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }
          />
        )}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />
      <Modal
        title="Create User"
        visible={isAddUserModalVisible}
        onCancel={closeAddUserModal}
        footer={null}
        width={700}
      >
        <AddUser onClose={closeAddUserModal} />
      </Modal>
      <Modal
        title="Edit User"
        visible={isEditUserModalVisible}
        onCancel={closeEditUserModal}
        footer={null}
        width={700}
      >
        <EditUser onClose={closeEditUserModal} idd={idd} />
      </Modal>

      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={closeResetPasswordModal}
        footer={null}
        width={800}
      >
        <ResetPassword onClose={closeResetPasswordModal} />
      </Modal>

      <EmailVerification
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        initialEmail={users.find(user => user.id === selectedUserId)?.email}
        idd={selectedUserId}
      />
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
  }

  .ant-dropdown-menu-item {
    padding: 8px 16px;
    border-radius: 4px;
    margin: 2px 0;
    transition: all 0.3s;
  }

  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }

  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }

  .ant-dropdown-menu-item .anticon {
    font-size: 16px;
    margin-right: 8px;
  }

  .ant-btn-text:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-btn-text:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const UserListWithStyles = () => (
  <>
    <style>{styles}</style>
    <UserList />
  </>
);

export default UserListWithStyles;
