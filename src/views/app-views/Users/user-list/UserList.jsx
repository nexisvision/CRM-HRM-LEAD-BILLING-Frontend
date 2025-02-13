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
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
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

const UserList = () => {
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [userUpdated, setUserUpdated] = useState(false);

  const paymentStatusList = ["active", "blocked"];

  useEffect(() => {
    dispatch(GetUsers());
    setUserUpdated(false);
  }, [dispatch]);

  const alluserdata = useSelector((state) => state.Users);
  const fndfdata = alluserdata.Users.data;
  
  const loggeddata = useSelector((state) => state?.user?.loggedInUser.username);
  
  const finddata = fndfdata?.filter((item) => item.created_by === loggeddata);
  
  const allroledata = useSelector((state) => state.role);
  const fnddata = allroledata.role.data;
  const logged = useSelector((state) => state.user.loggedInUser.username);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (finddata) {
      setUsers(finddata);
    }
  }, [fndfdata]);


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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? users : fndfdata;
    const data = searchArray.filter(user => user.name.toLowerCase().includes(value.toLowerCase()));
    setUsers(data);
  };

  const deleteUser = (userId) => {
    dispatch(Dleteusetr(userId));
    dispatch(GetUsers());
    setUserUpdated(true);
    setUsers(users.filter((user) => user.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
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
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            View Details
          </Button>
        </Flex>
      </Menu.Item>
     
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={openResetPasswordModal}
            size="small"
          >
            Reset Password
          </Button>
        </Flex>
      </Menu.Item> */}
    

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                             <Menu.Item>
                             <Flex alignItems="center">
                               <Button
                                 type=""
                                 icon={<EditOutlined />}
                                 onClick={() => Editfun(elm.id)}
                                 size="small"
                               >
                                 Edit
                               </Button>
                             </Flex>
                           </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                       <Menu.Item>
                       <Flex alignItems="center">
                         <Button
                           type=""
                           icon={<DeleteOutlined />}
                           onClick={() => deleteUser(elm.id)}
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
      title: "User",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase()
          ? -1
          : b.name.toLowerCase() > a.name.toLowerCase()
          ? 1
          : 0,
    },
    {
      title: "Last online",
      dataIndex: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="text-capitalize"
          color={status === "active" ? "cyan" : "red"}
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
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
              <Select.Option value="All">Status</Select.Option>
              {paymentStatusList.map((elm) => (
                <Select.Option key={elm} value={elm}>
                  {elm}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
        

           {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                           <Button type="primary" className="ml-2" onClick={openAddUserModal}>
                                                                                                                                           <PlusOutlined />
                                                                                                                                           New
                                                                                                                                         </Button>
                                                                                                                          
                                                                                                                              ) : null}


          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

         {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                         <Table columns={tableColumns} dataSource={users} rowKey="id" />
                                                                                                          ) : null}


       
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
    </Card>
  );
};

export default UserList;
