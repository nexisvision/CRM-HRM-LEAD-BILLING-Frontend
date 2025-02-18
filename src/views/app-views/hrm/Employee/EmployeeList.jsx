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
import { utils, writeFile } from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { roledata } from "../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import moment from "moment";
import { MdOutlineEmail } from "react-icons/md";

const EmployeeList = () => {
  // State declarations
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] =
    useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] =
    useState(false);
  const [isViewEmployeeModalVisible, setIsViewEmployeeModalVisible] =
    useState(false);
    const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
    const [comnyid, setCompnyid] = useState("");
  const [initialValues, setInitialValues] = useState({ email: '' });
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.employee);

  const [sub, setSub] = useState(false);


  const allroledata = useSelector((state) => state.role);
  const fndroledata = allroledata.role.data;

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);

  useEffect(() => {
    dispatch(roledata());
  }, []);

  useEffect(() => {
    // Fetch all required data
    dispatch(empdata());
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.employee && tabledata.employee.data) {
      const datas = tabledata.employee.data;

      if (datas) {
        // Filter employees by created_by matching the logged-in user's username
        const filteredData = datas.filter(
          (item) => item.created_by === user && item.employeeId
        );

        // Map the data to include names instead of IDs
        const mappedData = filteredData.map(employee => {
          // Find corresponding department
          const department = departmentData.find(
            dept => dept.id === employee.department
          );

          // Find corresponding designation
          const designation = designationData.find(
            desig => desig.id === employee.designation
          );

          // Find corresponding branch
          const branch = branchData.find(
            br => br.id === employee.branch
          );

          return {
            ...employee,
            department: department?.department_name || 'N/A',
            designation: designation?.designation_name || 'N/A',
            branch: branch?.branchName || 'N/A'
          };
        });

        setUsers(mappedData);
      }
    }
  }, [tabledata, user, departmentData, designationData, branchData]);

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
    // console.log('Parsed Permissions:', allpermisson);

  } else {
    // console.log('extra-hrm-employee is not available');
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission


  // Search handler
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : [];
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteEmp(userId));

      const updatedData = await dispatch(empdata());
      // console.log("lll", updatedData);

      setUsers(updatedData.employee.data || updatedData.payload.data);

      message.success({ content: "Deleted employee successfully", duration: 2 });
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
    dispatch(empdata())
  }, [dispatch])




  // useEffect(() => {
  //   if (tabledata && tabledata.employee && tabledata.employee.data) {
  //     const datas = tabledata.employee.data;

  //     if (datas) {
  //       // const matchingRoleData = fndroledata.find(
  //       //   (item) => item.role_name === "employee"
  //       // );

  //       // const filteredData = datas.filter(
  //       //   (item) => item.role_id && item.role_name === "employee"
  //       // );

  //       setUsers(datas);
  //     }
  //   }
  // }, [tabledata]); // Make sure to include roleiddd in dependencies if it changes

  // Dropdown menu component
  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
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
      </Menu.Item> */}
      {/* <Menu.Item>
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
      </Menu.Item> */}



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
      title: "User",
      dataIndex: "username",
      sorter: {
        compare: (a, b) => {
          if (a.username && b.username) {
            return a.username.localeCompare(b.username);
          }
          return 0;
        },
      },
    },
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: {
        compare: (a, b) => {
          if (a.branch && b.branch) {
            return a.branch.localeCompare(b.branch);
          }
          return 0;
        },
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: {
        compare: (a, b) => {
          if (a.department && b.department) {
            return a.department.localeCompare(b.department);
          }
          return 0;
        },
      },
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: {
        compare: (a, b) => {
          if (a.designation && b.designation) {
            return a.designation.localeCompare(b.designation);
          }
          return 0;
        },
      },
    },
    {
      title: "Date OF Joining",
      dataIndex: "joiningDate",
      render: (text) => {
        return text ? moment(text).format('DD-MM-YYYY') : 'N/A';
      },
      sorter: {
        compare: (a, b) => moment(a.joiningDate) - moment(b.joiningDate),
      },
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      render: (text) => {
        return text ? moment(text).format('DD-MM-YYYY') : 'N/A';
      },
      sorter: {
        compare: (a, b) => moment(a.leaveDate) - moment(b.leaveDate),
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

  const handleEmailVerification = (email) => {
    setInitialValues({ email });
    setIsEmailVerificationModalVisible(true);
  };

  const handleSendOTP = () => {
    setEmailForOtp(initialValues.email);
    setIsEmailVerificationModalVisible(false);
    setIsOtpModalVisible(true);
  };

  // Add this handler for OTP verification
  const handleVerifyOTP = () => {
    // Add your OTP verification logic here
    
    // Close the OTP modal
    setIsOtpModalVisible(false);
    
    // Clear the OTP input
    setOtp('');
    
    // Optionally show a success message
    message.success('Email verified successfully');
  };

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
        title={<span className="ms-5">Add Employee</span>}
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

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MailOutlined />
            <span>Email Verification</span>
          </div>
        }
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEmailVerificationModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSendOTP}>
            Send OTP
          </Button>
        ]}
        width={400}
      >
        <div>
          <div style={{ marginBottom: '8px' }}>
          Email Address <span style={{ color: '#ff4d4f' }}>*</span> 
          </div>
          <Input 
            placeholder="Enter your email"
            value={initialValues.email}
            onChange={(e) => setInitialValues({ email: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MailOutlined />
            <span>Verify OTP</span>
          </div>
        }
        visible={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsOtpModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleVerifyOTP}>
            Verify OTP
          </Button>
        ]}
        width={400}
      >
        <div>
          <div>{emailForOtp}</div>
          <div style={{ marginBottom: '8px', marginTop: '16px' }}>
            <span style={{ color: '#ff4d4f' }}>*</span> Enter OTP
          </div>
          <Input 
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      </Modal>
    </Card>
  );
};

export default EmployeeList;
