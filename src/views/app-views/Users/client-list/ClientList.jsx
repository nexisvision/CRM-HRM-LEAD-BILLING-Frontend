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
  const [clientid,setClientId] = useState("");

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
      const data = utils.filterArray(users, key, value);
      setUsers(data);
    } else {
      dispatch(ClientData());
    }
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : list;
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
      {/* <Menu.Item>
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
      </Menu.Item> */}
     

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
            icon={<MdOutlineEmail/>}
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
      title: "profilePic",
      dataIndex: 'profilePic',
      render: (_, record) => (
        <AvatarStatus
          src={record.profilePic}
          name={record.username || record.firstName}
          size={40}
        />
      ),
    },
    {
      title: "username",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },

    {
      title: "Client",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    // {
    //   title: "Client",
    //   dataIndex: "name",
    //   render: (_, record) => (
    //     <div className="d-flex" onClick={() => ClickFun(record.id)}>
    //       <AvatarStatus
    //         src={record.img}
    //         name={record.name}
    //         subTitle={record.email}
    //       />
    //     </div>
    //   ),
    //   sorter: (a, b) => a.name.localeCompare(b.name),
    // },
    {
      title: "created_by",
      dataIndex: "created_by",
      sorter: (a, b) => a.created_by.length - b.created_by.length,
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
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
      

           {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
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
     
         {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                  <Table columns={tableColumns} dataSource={users} rowKey="id" />
                                                                                                                  ) : null}
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
