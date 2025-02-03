import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, message, Button, Modal } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import ViewEmployee from "./ViewEmployee";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { roledata } from "../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";

const EmployeeList = () => {
  // State declarations
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] =
    useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] =
    useState(false);
  const [isViewEmployeeModalVisible, setIsViewEmployeeModalVisible] =
    useState(false);
  const tabledata = useSelector((state) => state.employee);
  const [sub, setSub] = useState(false);

  const allroledata = useSelector((state) => state.role);
  const fndroledata = allroledata.role.data;

  useEffect(() => {
    dispatch(roledata());
  }, []);

  // Modal handlers
  const openAddEmployeeModal = () => setIsAddEmployeeModalVisible(true);
  const closeAddEmployeeModal = () => setIsAddEmployeeModalVisible(false);
  // const openEditEmployeeModal = () => setIsEditEmployeeModalVisible(true);
  const openViewEmployeeModal = () => setIsViewEmployeeModalVisible(true);
  const closeViewEmployeeModal = () => setIsViewEmployeeModalVisible(false);

  const closeEditEmployeeModal = () => setIsEditEmployeeModalVisible(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const openEditEmployeeModal = (empId) => {
    setSelectedEmployeeId(empId);
    setIsEditEmployeeModalVisible(true);
  };

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
   
      if (parsedPermissions["extra-hrm-employee"] && parsedPermissions["extra-hrm-employee"][0]?.permissions) {
        allpermisson = parsedPermissions["extra-hrm-employee"][0].permissions;
        console.log('Parsed Permissions:', allpermisson);
      
      } else {
        console.log('extra-hrm-employee is not available');
      }
      
      const canCreateClient = allpermisson?.includes('create');
      const canEditClient = allpermisson?.includes('edit');
      const canDeleteClient = allpermisson?.includes('delete');
      const canViewClient = allpermisson?.includes('view');
   
      ///endpermission
   

  // Search handler
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteEmp(userId));

      const updatedData = await dispatch(empdata());
      console.log("lll", updatedData);

      setUsers(updatedData.employee.data || updatedData.payload.data);

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Employee"); // Append the sheet to the workbook

      writeFile(wb, "EmployeeData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    dispatch(empdata());
    setSub(false);
  }, [sub, dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.employee && tabledata.employee.data) {
      const datas = tabledata.employee.data;

      if (datas) {
        // const matchingRoleData = fndroledata.find(
        //   (item) => item.role_name === "employee"
        // );

        // const filteredData = datas.filter(
        //   (item) => item.role_id && item.role_name === "employee"
        // );

        setUsers(datas);
      }
    }
  }, [tabledata]); // Make sure to include roleiddd in dependencies if it changes

  // Dropdown menu component
  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewEmployeeModal}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<FilePdfOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Download CV</span>
          </Button>
        </Flex>
      </Menu.Item>
      
    

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                            <Menu.Item>
                            <Flex alignItems="center">
                              <Button
                                type=""
                                className=""
                                icon={<EditOutlined />}
                                onClick={() => openEditEmployeeModal(elm.id)}
                                size="small"
                              >
                                <span className="ml-2">Edit</span>
                              </Button>
                            </Flex>
                          </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                       <Menu.Item>
                       <Flex alignItems="center">
                         <Button
                           type=""
                           className=""
                           icon={<DeleteOutlined />}
                           onClick={() => deleteUser(elm.id)}
                           size="small"
                         >
                           <span className="">Delete</span>
                         </Button>
                       </Flex>
                     </Menu.Item>
                    ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "User",
      dataIndex: `username` || `firstName`,
      sorter: {
        compare: (a, b) => a.firstName.length - b.firstName.length,
      },
    },
    {
      title: "Branch",
      dataIndex: "banklocation",
      sorter: {
        compare: (a, b) => a.banklocation.length - b.banklocation.length,
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: {
        compare: (a, b) => a.department.length - b.department.length,
      },
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: {
        compare: (a, b) => a.designation.length - b.designation.length,
      },
    },
    {
      title: "Date OF Joining",
      dataIndex: "joiningDate",
      sorter: {
        compare: (a, b) => a.dateofjoining.length - b.dateofjoining.length,
      },
    },
    {
      title: "Last online",
      dataIndex: "lastOnline",
      sorter: {
        compare: (a, b) => a.lastOnline.length - b.lastOnline.length,
      },
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
              onChange={onSearch}
            />
          </div>
        </Flex>
        <Flex gap="7px">
          

          
                     {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                                             <Button
                                                                                                                                                             type="primary"
                                                                                                                                                             className="ml-2"
                                                                                                                                                             onClick={openAddEmployeeModal}
                                                                                                                                                           >
                                                                                                                                                             <PlusOutlined />
                                                                                                                                                             <span>New</span>
                                                                                                                                                           </Button>
                                                                                                                                                
                                                                                                                                                  ) : null}


          <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
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
        title="Add Employee"
        visible={isAddEmployeeModalVisible}
        onCancel={closeAddEmployeeModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddEmployee onClose={closeAddEmployeeModal} setSub={setSub} />
      </Modal>
      <Modal
        title="Edit Employee"
        visible={isEditEmployeeModalVisible}
        onCancel={closeEditEmployeeModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditEmployee
          onClose={closeEditEmployeeModal}
          employeeIdd={selectedEmployeeId}
        />
      </Modal>

      <Modal
        title={<span className="text-2xl font-bold">Employee Details</span>}
        visible={isViewEmployeeModalVisible}
        onCancel={closeViewEmployeeModal}
        footer={null}
        width={1000}
        className="mt-[-80px]"
      >
        <ViewEmployee onClose={closeViewEmployeeModal} />
      </Modal>
    </Card>
  );
};

export default EmployeeList;
