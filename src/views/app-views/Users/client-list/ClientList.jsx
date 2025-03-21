import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Tag,
  Button,
  Select,
  Modal,
  message,
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
import UserView from "./ViewClient";
import Flex from "components/shared-components/Flex";
import { utils, writeFile } from "xlsx";
import ResetPassword from "./ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { ClientData, deleteClient } from "./CompanyReducers/CompanySlice";
import ViewClient from "./ViewClient";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import { useLocation } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import EmailVerification from "../../company/EmailVerification";

const ClientList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] =
    useState(false);
  const [comnyid, setCompnyid] = useState("");
  const [clientid, setClientId] = useState("");

  const tabledata = useSelector((state) => state.ClientData);

  const loggedInUser = useSelector((state) => state.user.loggedInUser);

  const dispatch = useDispatch();

  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (
    parsedPermissions["extra-users-client-list"] &&
    parsedPermissions["extra-users-client-list"][0]?.permissions
  ) {
    allpermisson = parsedPermissions["extra-users-client-list"][0].permissions;
  } else {
  }

  const canCreateClient = allpermisson?.includes("create");
  const canEditClient = allpermisson?.includes("edit");
  const canDeleteClient = allpermisson?.includes("delete");
  const canViewClient = allpermisson?.includes("view");

  ///endpermission

  const deleteUser = (userId) => {
    dispatch(deleteClient(userId));
    setUsers(users.filter((user) => user.id !== userId));
    dispatch(ClientData());
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

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const { state } = useLocation();

  const alldata = useSelector((state) => state.SubClient.SubClient.data);

  useEffect(() => {
    setClientId(state?.idd);
  }, [state?.idd]);

  const matchingClients = alldata?.filter(
    (client) => client?.created_by === clientid
  );

  useEffect(() => {
    if (loggedInUser.username === "superadmin" && !state) {
      setUsers(tabledata.ClientData.data);
    } else if (state && matchingClients) {
      setUsers(matchingClients);
    } else {
      if (tabledata && tabledata.ClientData && tabledata.ClientData.data) {
        const filteredUsers = tabledata.ClientData.data.filter(
          (client) => client.created_by === loggedInUser?.username
        );
        setUsers(filteredUsers);
      }
    }
  }, [tabledata, loggedInUser.username, state, matchingClients]);

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
      const filteredData = baseData.filter((user) =>
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

  const closeViewCompanyModal = () => {
    setIsViewCompanyModalVisible(false);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
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

  const getDropdownItems = (record) => {
    const items = [];

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canViewClient && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "view",
        icon: <EyeOutlined />,
        label: "View Details",
        onClick: () => showUserProfile(record),
      });
    }

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canEditClient && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => openEditCompanyModal(record.id),
      });
    }

    items.push({
      key: "email",
      icon: <MdOutlineEmail />,
      label: "Update Email",
      onClick: () => {
        setIsEmailVerificationModalVisible(true);
        setCompnyid(record.id);
      },
    });

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canDeleteClient && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(record.id),
        danger: true,
      });
    }

    return items;
  };

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
                {record.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.username || "N/A"}
            </div>
            <div className="text-gray-500 text-sm">
              {record.email || "No email"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (created_by) => (
        <Tag
          color="purple"
          className="text-sm px-3 py-1 rounded-full font-medium"
        >
          {created_by || "N/A"}
        </Tag>
      ),
      sorter: (a, b) => (a.created_by || "").localeCompare(b.created_by || ""),
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      render: (date) => (
        <div className="text-gray-600">
          {date ? dayjs(date).format("DD MMM YYYY") : "N/A"}
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
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: "10px",
                padding: 0,
              }}
            >
              <MoreOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "0" }} className="rounded-xl overflow-hidden">
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
                style={{ borderRadius: "8px" }}
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="min-w-[180px]"
                onChange={handleShowStatus}
                placeholder="Status"
                style={{ borderRadius: "8px" }}
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
            {(whorole === "super-admin" ||
              whorole === "client" ||
              (canCreateClient &&
                whorole !== "super-admin" &&
                whorole !== "client")) && (
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
        {(whorole === "super-admin" ||
          whorole === "client" ||
          (canViewClient &&
            whorole !== "super-admin" &&
            whorole !== "client")) && (
            <Table
              columns={tableColumns}
              dataSource={users}
              rowKey="id"
              className="ant-table-striped"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
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
        width={400}
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
      ></Modal>
      <EmailVerification
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        initialEmail={users.find((user) => user.id === comnyid)?.email}
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

const ClientListWithStyles = () => (
  <>
    <style>{styles}</style>
    <ClientList />
  </>
);

export default ClientListWithStyles;
