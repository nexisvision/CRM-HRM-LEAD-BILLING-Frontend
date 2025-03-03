import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Select,
  Input,
  Menu,
  message,
  Button,
  Modal,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "./UserView";
import Flex from "components/shared-components/Flex";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
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
  const [userUpdated, setUserUpdated] = useState(false);
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const paymentStatusList = ["active", "blocked"];

  useEffect(() => {
    dispatch(GetUsers());
    setUserUpdated(false);
  }, [dispatch]);

  const alluserdata = useSelector((state) => state.Users);
  const finddata = alluserdata.Users.data;

  const loggeddata = useSelector((state) => state?.user?.loggedInUser.client_id);

  // const finddata = fndfdata?.filter((item) => item.client_id === loggeddata);

  const allroledata = useSelector((state) => state.role);
  const fnddata = allroledata.role.data;
  const logged = useSelector((state) => state.user.loggedInUser.username);

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
    //  console.log('Parsed Permissions:', allpermisson);

  } else {
    //  console.log('extra-users-list is not available'); 
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
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
    setUserUpdated(true);
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

  const openResetPasswordModal = () => {
    setIsResetPasswordModalVisible(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const Editfun = (idd) => {
    openEditUserModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<EyeOutlined />}
              onClick={() => showUserProfile(elm)}
              size="small"
              className="w-full text-left"
            >
              View Details
            </Button>
          </Flex>
        </Menu.Item>
      )}

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) && (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<EditOutlined />}
              onClick={() => Editfun(elm.id)}
              size="small"
              className="w-full text-left"
            >
              Edit
            </Button>
          </Flex>
        </Menu.Item>
      )}

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className="flex items-center gap-2 w-full text-left"
            icon={<MdOutlineEmail />}
            onClick={() => {
              setIsEmailVerificationModalVisible(true);
              setSelectedUserId(elm.id);
            }}
            size="small"
          >
            <span>Update Email</span>
          </Button>
        </Flex>
      </Menu.Item>

      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) && (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<DeleteOutlined />}
              onClick={() => deleteUser(elm.id)}
              size="small"
              className="w-full text-left"
            >
              Delete
            </Button>
          </Flex>
        </Menu.Item>
      )}
    </Menu>
  );

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
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="text-sm px-3 py-1 rounded-full font-medium"
          color={status === "active" ? "green" : "red"}
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => (a.status || '').localeCompare(b.status || ''),
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
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "0" }} className="shadow-lg rounded-xl overflow-hidden">
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
        width={1100}
      >
        <AddUser onClose={closeAddUserModal} />
      </Modal>
      <Modal
        title="Edit User"
        visible={isEditUserModalVisible}
        onCancel={closeEditUserModal}
        footer={null}
        width={1000}
      >
        <EditUser onClose={closeEditUserModal} idd={idd} />
      </Modal>

      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={closeResetPasswordModal}
        footer={null}
        width={1000}
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

export default UserList;
