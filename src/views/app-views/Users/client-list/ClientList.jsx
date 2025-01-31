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
} from "@ant-design/icons";
import dayjs from "dayjs";
// import { useNavigate } from 'react-router-dom';
import UserView from "../client-list/UserView";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";

import userData from "assets/data/user-list.data.json";

import ResetPassword from "./ResetPassword";
import { useDispatch, useSelector } from "react-redux";
import { ClientData, deleteClient } from "./CompanyReducers/CompanySlice";
import ViewClient from "./ViewClient";
import AddClient from "./AddClient";
import EditClient from "./EditClient";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectList from "views/app-views/dashboards/project/project-list/ProjectList";

const { Option } = Select;

const ClientList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
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
  const [comnyid, setCompnyid] = useState("");
  const [clientid,setClientId] = useState("");

  const tabledata = useSelector((state) => state.ClientData);

  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  // const rolesData = useSelector((state) => state.role.role.data);

  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
	const roles = useSelector((state) => state.role?.role?.data);
	const roleData = roles?.find(role => role.id === roleId);

  
  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
    ? JSON.parse(roleData.permissions)
    : [];

    console.log('Parsed Permissions:', parsedPermissions["extra-users-client-list"][0].permissions);

    const allpermisson = parsedPermissions["extra-users-client-list"][0].permissions;


    const canCreateClient = allpermisson.includes('create');
    const canEditClient = allpermisson.includes('edit');
    const canDeleteClient = allpermisson.includes('delete');
    const canViewClient = allpermisson.includes('view');

  const deleteUser = (userId) => {
    if (!canDeleteClient) {
      message.error('You do not have permission to delete clients.');
      return;
    }
    dispatch(deleteClient(userId));
    setUsers(users.filter((user) => user.id !== userId));
    dispatch(ClientData());
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
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

   const {state} = useLocation();

   const allddata = useSelector((state)=>state.SubClient.SubClient.data);
   
      useEffect(()=>{
      setClientId(state?.idd) 
      },[])
  
      const matchingClients = allddata?.filter(client => client?.created_by === clientid);


  useEffect(() => {
    if(loggedInUser.username == "superadmin" && !state){
      setUsers(tabledata.ClientData.data);
    }else if(state && matchingClients){
      setUsers(matchingClients)
    }else{
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
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
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
    if (!canEditClient) {
      message.error('You do not have permission to edit clients.');
      return;
    }
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
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={() => openViewCompanyModal()}
            size="small"
            style={{ display: "block", marginBottom: "8px" }}
          >
            View Details
          </Button>
        </Flex>
      </Menu.Item>
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
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<PushpinOutlined />}
            onClick={openResetPasswordModal}
            size="small"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Reset Password
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<RocketOutlined />}
            onClick={openUpgradePlanModal}
            size="small"
            style={{ display: "block", marginBottom: "8px" }}
          >
            Upgrade Plan
          </Button>
        </Flex>
      </Menu.Item>
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
    </Menu>
  );

  const tableColumns = [
    {
      title: "username",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex" onClick={() => ClickFun(record.id)}>
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "created_by",
      dataIndex: "created_by",
      sorter: (a, b) => a.created_by.length - b.created_by.length,
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
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
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
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
          {whorole === "super-admin" || (canCreateClient && whorole !== "super-admin") ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddCompanyModal} className="flex items-center">
                New Client
            </Button>
          ) : null}
          <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel}
                block
              >
                Export All
              </Button>
        </Flex>
      </Flex>
      <div className="table-responsive">
        {canViewClient && (
          <Table columns={tableColumns} dataSource={users} rowKey="id" />
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
        width={1100}
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
    </Card>
  );
};

export default ClientList;
