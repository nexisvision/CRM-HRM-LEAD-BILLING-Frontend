import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, message, Button, Modal } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddSalary from "./AddSalary";
import { useNavigate } from "react-router-dom";
// import setsalary from './setsalary';
import userData from "assets/data/user-list.data.json";
import utils from "utils";
import Allowance from "./Allowance";
import Commission from "./Commission";
import SetSalary from "./SetSalary";
import { useDispatch, useSelector } from "react-redux";
import { deleteSalaryss, getSalaryss } from "./SalaryReducers/SalarySlice";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";

const SalaryList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(userData);

  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
  const navigate = useNavigate();
  const [isSetSalaryModalVisible, setIsSetSalaryModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getSalaryss());
  }, []);

  const alldata = useSelector((state) => state.salary);
  const dfnddata = alldata.salary.data;

  useEffect(() => {
    if (dfnddata) {
      setList(dfnddata);
    }
  }, [dfnddata]);

 useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

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

   if (parsedPermissions["extra-hrm-payroll-salary"] && parsedPermissions["extra-hrm-payroll-salary"][0]?.permissions) {
     allpermisson = parsedPermissions["extra-hrm-payroll-salary"][0].permissions;
    //  console.log('Parsed Permissions:', allpermisson);
   
   } else {
    //  console.log('extra-hrm-payroll-salary is not available');
   }
   
   const canCreateClient = allpermisson?.includes('create');
   const canEditClient = allpermisson?.includes('edit');
   const canDeleteClient = allpermisson?.includes('delete');
   const canViewClient = allpermisson?.includes('view');

   ///endpermission

  // Open Add Salary Modal
  const openAddSalaryModal = () => {
    setIsAddSalaryModalVisible(true);
  };

  const handleSetSalary = () => {
    navigate("/app/hrm/payroll/salary/setsalary", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };



  // Close Add Salary Modal
  const closeAddSalaryModal = () => {
    setIsAddSalaryModalVisible(false);
  };

  // Open Set Salary Modal
  const openSetSalaryModal = (user) => {
    setSelectedUser(user);
    setIsSetSalaryModalVisible(true);
  };

  // Close Set Salary Modal
  const closeSetSalaryModal = () => {
    setSelectedUser(null);
    setIsSetSalaryModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const filteredUsers = utils.wildCardSearch(userData, value);
    setList(filteredUsers);
  };

  // Delete user
  const deleteUser = (userId) => {
    dispatch(deleteSalaryss(userId)).then(() => {
      dispatch(getSalaryss());
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });
      setList(list.filter((item) => item.id !== userId));
    });
  };

  const dropdownMenu = (user) => (
    <Menu>
      <Menu.Item>
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setUserProfileVisible(true)}
        >
          View Details
        </Button>
      </Menu.Item>
      {/* <Menu.Item>
        <Button type="text" icon={<EyeOutlined />} onClick={() => openSetSalaryModal(user)}>
          Set Salary
        </Button>
      </Menu.Item> */}

     
     

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                            <Menu.Item>
                            <Button type="text" icon={<EyeOutlined />} onClick={handleSetSalary}>
                              Set Salary
                            </Button>
                          </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                      <Menu.Item>
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </Menu.Item>
                    ) : null}
    </Menu>
  );

  const tableColumns = [
    {
      title: "salary",
      dataIndex: "salary",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (_, record) => (
    //     <AvatarStatus
    //       src={record.img}
    //       name={record.name}
    //       subTitle={record.email}
    //     />
    //   ),
    // },
    {
      title: "PayRoll Type",
      dataIndex: "payslipType",
    },
    {
      title: "netSalary",
      dataIndex: "netSalary",
    },
    {
      title: "bankAccount",
      dataIndex: "bankAccount",
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (_, record) => <EllipsisDropdown menu={dropdownMenu(record)} />,
    },
  ];

  return (
    <Card>
      <Flex alignItems="center" justifyContent="space-between">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          onChange={onSearch}
        />
   

        {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                                                        <Button type="primary" className="ml-2" onClick={openAddSalaryModal}>
                                                                                                                                                                        <PlusOutlined /> Add Salary
                                                                                                                                                                      </Button>
                                                                                                                                                      
                                                                                                                                                          ) : null}
      </Flex>

       {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                           <Table columns={tableColumns} dataSource={list} rowKey="id" />

      
                                                                                                                                ) : null}

      <Modal
        title="Add Salary"
        visible={isAddSalaryModalVisible}
        onCancel={closeAddSalaryModal}
        width={1000}
        footer={null}
      >
        <AddSalary onClose={closeAddSalaryModal} />
      </Modal>
      <Modal
        className="mt-[-70px]"
        title="Set Salary"
        visible={isSetSalaryModalVisible}
        onCancel={closeSetSalaryModal}
        footer={null}
        width={1900}
      >
        <SetSalary onClose={closeSetSalaryModal} />
      </Modal>
    </Card>
  );
};

export default SalaryList;
