import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Tag,
  Menu,
  Button,
  Select,
  Modal,
  message,
  Avatar,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  MailOutlined,
  RocketOutlined,
  PushpinOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import { useNavigate } from 'react-router-dom';
import UserView from "./ViewClient";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import { utils, writeFile } from "xlsx";

import ResetPassword from "./ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { ClientData, deleteClient } from "./CompanyReducers/CompanySlice";
import ViewClient from "./ViewClient";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectList from "views/app-views/dashboards/project/project-list/ProjectList";
import { MdOutlineEmail } from "react-icons/md";
import EmailVerification from "../../company/EmailVerification";

const { Option } = Select;

const ClientList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] =
    useState(false);
  const [isEditCompanyModalVisible, setIsEditCompanyModalVisible] =
    useState(false);
  const [isViewCompanyModalVisible, setIsViewCompanyModalVisible] =
    useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [isUpgradePlanModalVisible, setIsUpgradePlanModalVisible] =
    useState(false);
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
  const [comnyid, setCompnyid] = useState("");
  const [clientid, setClientId] = useState("");

  const tabledata = useSelector((state) => state.ClientData);

  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  // const rolesData = useSelector((state) => state.role.role.data);

  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

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

  if (parsedPermissions["extra-users-client-list"] && parsedPermissions["extra-users-client-list"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-users-client-list"][0].permissions;
    // console.log('Parsed Permissions:', allpermisson);

  } else {
    // console.log('extra-users-client-list is not available');
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  const deleteUser = (userId) => {

    dispatch(deleteClient(userId));
    setUsers(users.filter((user) => user.id !== userId));
    dispatch(ClientData());
    message.success({ content: `Deleted client successfully`, duration: 2 });
  };

  const getCompanyStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };
  const comId = (id) => {
    setCompnyid(id);
  };

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const { state } = useLocation();

  const allddata = useSelector((state) => state.SubClient.SubClient.data);

  useEffect(() => {
    setClientId(state?.idd)
  }, [])

  const matchingClients = allddata?.filter(client => client?.created_by === clientid);


  useEffect(() => {
    if (loggedInUser.username == "superadmin" && !state) {
      setUsers(tabledata.ClientData.data);
    } else if (state && matchingClients) {
      setUsers(matchingClients)
    } else {
      if (tabledata && tabledata.ClientData && tabledata.ClientData.data) {
        const filteredUsers = tabledata.ClientData.data.filter(
          (client) => client.created_by === loggedInUser?.username
        );
        setUsers(filteredUsers);
      }
    }
  }, [tabledata]);



  const companyStatusList = ["active", "blocked"];

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(users, key, value);
      setUsers(data);
    } else {
      dispatch(ClientData());
    }
  };

  const onSearch = (e) => {
    const searchValue = e.currentTarget.value.toLowerCase();

    // First, get the base data according to user role
    let baseData;
    if (loggedInUser.username === "superadmin" && !state) {
      baseData = tabledata.ClientData.data;
    } else if (state && matchingClients) {
      baseData = matchingClients;
    } else {
      baseData = tabledata.ClientData.data.filter(
        (client) => client.created_by === loggedInUser?.username
      );
    }

    // Then apply the search filter on the already filtered data
    if (searchValue) {
      const filteredData = baseData.filter(user =>
        user.username.toLowerCase().includes(searchValue)
      );
      setUsers(filteredData);
    } else {
      setUsers(baseData);
    }
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Client"); // Append the sheet to the workbook

      writeFile(wb, "ClientData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const openAddCompanyModal = () => {
    setIsAddCompanyModalVisible(true);
  };

  const closeAddCompanyModal = () => {
    setIsAddCompanyModalVisible(false);
  };

  const openEditCompanyModal = (userId) => {

    setCompnyid(userId);
    setIsEditCompanyModalVisible(true);
  };

  const closeEditCompanyModal = () => {
    setIsEditCompanyModalVisible(false);
  };

  const openViewCompanyModal = () => {
    setIsViewCompanyModalVisible(true);
  };

  const closeViewCompanyModal = () => {
    setIsViewCompanyModalVisible(false);
  };

  const openResetPasswordModal = () => {
    setIsResetPasswordModalVisible(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };

  const openUpgradePlanModal = () => {
    setIsUpgradePlanModalVisible(true);
  };

  const closeUpgradePlanModal = () => {
    setIsUpgradePlanModalVisible(false);
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const ClickFun = (idd) => {
    // console.log("dsfvysdvf", idd);
    setIdd(idd);
    // navigate("/app/dashboards/project/list");

    navigate("/app/dashboards/project/list", {
      state: {
        idd,
      },
    });
  };

  const dropdownMenu = (user) => (
    <Menu>
      {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<EyeOutlined />}
              onClick={() => showUserProfile(user)}
              size="small"
              style={{ display: "block", marginBottom: "8px" }}
            >
              View Details
            </Button>
          </Flex>
        </Menu.Item>
      )}

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<EditOutlined />}
              onClick={() => openEditCompanyModal(user.id)}
              size="small"
              style={{ display: "block", marginBottom: "8px" }}
            >
              Edit
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className="flex items-center gap-2"
            icon={<MdOutlineEmail />}
            onClick={() => {
              setIsEmailVerificationModalVisible(true);
              setCompnyid(user.id);
            }}
            size="small"
          // style={{ display: "block", marginBottom: "8px" }}
          >
            <span>Update Email</span>
          </Button>
        </Flex>
      </Menu.Item>

      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              icon={<DeleteOutlined />}
              onClick={() => deleteUser(user.id)}
              size="small"
            >
              Delete
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "Client",
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
      title: "Created By",
      dataIndex: "created_by",
      render: (created_by) => (
        <Tag color="purple" className="text-sm px-3 py-1 rounded-full font-medium">
          {created_by || 'N/A'}
        </Tag>
      ),
      sorter: (a, b) => (a.created_by || '').localeCompare(b.created_by || ''),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="text-sm px-3 py-1 rounded-full font-medium"
          color={getCompanyStatus(status)}
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
      render: (_, user) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(user)} />
        </div>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "0" }} className="shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-6 border-b border-gray-100">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search clients..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={(e) => onSearch(e)}
                allowClear
                className="min-w-[250px] hover:border-indigo-400 focus:border-indigo-500"
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
                {companyStatusList.map((elm) => (
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
                icon={<PlusOutlined />}
                onClick={openAddCompanyModal}
                className="rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
              >
                New Client
              </Button>
            )}
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
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
      {userProfileVisible && (
        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={closeUserProfile}
        />
      )}
      <Modal
        title="Create Client"
        visible={isAddCompanyModalVisible}
        onCancel={closeAddCompanyModal}
        footer={null}
        width={800}
      >
        <AddClient onClose={closeAddCompanyModal} />
      </Modal>
      <Modal
        title="Edit Client"
        visible={isEditCompanyModalVisible}
        onCancel={closeEditCompanyModal}
        footer={null}
        width={1000}
      >
        <EditClient onClose={closeEditCompanyModal} comnyid={comnyid} />
      </Modal>
      <Modal
        title="Client Details"
        visible={isViewCompanyModalVisible}
        onCancel={closeViewCompanyModal}
        footer={null}
        width={1400}
        className="mt-[-70px]"
      >
        <ViewClient onClose={closeViewCompanyModal} />
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
      <Modal
        title="Upgrade Plan"
        visible={isUpgradePlanModalVisible}
        onCancel={closeUpgradePlanModal}
        footer={null}
        width={1000}
      >
      </Modal>
      <EmailVerification
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        initialEmail={users.find(user => user.id === comnyid)?.email}
      />
    </Card>
  );
};

export default ClientList;
