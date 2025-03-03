import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, message, Button, Modal, Select, Switch, Badge, Avatar, Tag } from "antd";
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
import EmailVerification from "views/app-views/company/EmailVerification";
import { handleSalaryStatusChange } from '../PayRoll/Salary/SalaryList';
import { editSalaryss, getSalaryss } from '../PayRoll/Salary/SalaryReducers/SalarySlice';

import { Option } from "antd/es/mentions";
import AddAttendance from "../Attendance/AddAttendance";
import { addAttendance, editAttendance } from "../Attendance/AttendanceReducer/AttendanceSlice";

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
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchText, setSearchText] = useState('');

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.employee);

  const [sub, setSub] = useState(false);


  const allroledata = useSelector((state) => state.role);
  const fndroledata = allroledata.role.data;

  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);

  // console.log("tData", designationData);

  const branchDataa = useSelector((state) => state.Branch?.Branch?.data || []);

  // const branchData = branchDataa.filter(item => item.created_by === user);

  // console.log("branchData", branchData);

  const salaryData = useSelector((state) => state.salary?.salary?.data || []);

  useEffect(() => {
    dispatch(roledata());
  }, []);

  useEffect(() => {
    // Fetch all required data
    dispatch(empdata());
    dispatch(getSalaryss());
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.employee && tabledata.employee.data) {
      const datas = tabledata.employee.data;

      if (datas) {
        // Filter employees by created_by matching the logged-in user's username
        // const datas = datas.filter(
        //   (item) => item.created_by === user && item.employeeId
        // );

        // Map the data to include names instead of IDs
        const mappedData = datas.map(employee => {
          // Find corresponding department
          const department = departmentData.find(
            dept => dept.id === employee.department
          );

          // Find corresponding designation
          const designation = designationData.find(
            desig => desig.id === employee.designation
          );

          // Find corresponding branch
          const branch = branchDataa.find(
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
  }, [tabledata, user, departmentData, designationData]);

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
    const value = e.target.value;
    setSearchText(value);
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


  const viewfunction = (empId) => {
    setSelectedEmployeeId(empId);
    openViewEmployeeModal();
  };






  // useEffect(() => {
  //   if (tabledata && tabledata.employee && tabledata.employee.data) {
  //     const datas = tabledata.employee.data;

  //     if (datas) {
  //       // const matchingRoleData = fndroledata.find(
  //       //   (item) => item.role_name === "employee"
  //       // );

  //       // const datas = datas.filter(
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
            icon={<MdOutlineEmail />}
            onClick={() => {
              setIsEmailVerificationModalVisible(true);
              setCompnyid(elm.id);
            }}
            size="small"
          // style={{ display: "block", marginBottom: "8px" }}
          >
            <span>Update Email</span>
          </Button>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            // onClick={() => openViewEmployeeModal()}
            onClick={() => viewfunction(elm.id)}
            size="small"
          >
            <span className="ml-2">View</span>
          </Button>
        </Flex>
      </Menu.Item>


      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => handleCheckIn(elm.id)}
            size="small"
          >
            <span className="ml-2">Check In</span>
          </Button>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => handleCheckOut(elm.id)}
            size="small"
          >
            <span className="ml-2">Check Out</span>
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

  // Add this component at the top of the file after the imports
  const SalaryStatusSwitch = ({ record }) => {
    const [status, setStatus] = useState(record.salaryStatus || 'unpaid');

    const handleStatusChange = (checked) => {
      setStatus(checked ? 'paid' : 'unpaid');
      message.success(`Salary status changed to ${checked ? 'paid' : 'unpaid'}`);
    };

    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={status === 'paid'}
          onChange={handleStatusChange}
          className={status === 'paid' ? 'bg-green-500' : 'bg-red-500'}
        />
        <Badge
          status={status === 'paid' ? 'success' : 'error'}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      </div>
    );
  };

  // Add this function to get salary status for an employee
  const getEmployeeSalaryStatus = (employeeId) => {
    const salaryRecord = salaryData.find(
      salary => salary.employeeId === employeeId && salary.created_by === user
    );
    return salaryRecord;
  };

  // Update your tableColumns to include salary status
  const tableColumns = [
    {
      title: "Employee",
      dataIndex: 'profilePic',
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
                {record.firstName?.charAt(0)?.toUpperCase() || record.username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName && record.lastName
                ? `${record.firstName} ${record.lastName}`
                : record.username || 'N/A'
              }
            </div>
            <div className="text-gray-500 text-sm">
              {record.email || 'No email'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      render: (branch) => (
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${branch ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          <span className="text-gray-700">{branch || 'N/A'}</span>
        </div>
      ),
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
      render: (department) => (
        <Tag color="blue" className="text-sm px-3 py-1 rounded-full font-medium">
          {department || 'N/A'}
        </Tag>
      ),
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
      render: (designation) => (
        <Tag color="purple" className="text-sm px-3 py-1 rounded-full font-medium">
          {designation || 'N/A'}
        </Tag>
      ),
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
      render: (text) => (
        <div className="text-gray-600">
          {text ? moment(text).format('DD MMM YYYY') : 'N/A'}
        </div>
      ),
      sorter: {
        compare: (a, b) => moment(a.joiningDate) - moment(b.joiningDate),
      },
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      render: (text) => (
        <div className="text-gray-600">
          {text ? moment(text).format('DD MMM YYYY') : 'N/A'}
        </div>
      ),
      sorter: {
        compare: (a, b) => moment(a.leaveDate) - moment(b.leaveDate),
      },
    },
    {
      title: "Salary Status",
      key: "salaryStatus",
      render: (_, record) => {
        const salaryRecord = getEmployeeSalaryStatus(record.id);

        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={salaryRecord?.status === 'paid'}
              onChange={(checked) => handleEmployeeSalaryStatus(record, checked)}
              checkedChildren="Paid"
              unCheckedChildren="Unpaid"
              disabled={!(whorole === "super-admin" || whorole === "client" || canEditClient)}
              className={`${salaryRecord?.status === 'paid' ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`}
            />
            <Badge
              status={salaryRecord?.status === 'paid' ? 'success' : 'error'}
              text={
                <span className="text-sm font-medium">
                  {salaryRecord?.status
                    ? salaryRecord.status.charAt(0).toUpperCase() + salaryRecord.status.slice(1)
                    : 'No Salary'}
                </span>
              }
            />
          </div>
        );
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

  // Update handleEmployeeSalaryStatus function
  const handleEmployeeSalaryStatus = (record, checked) => {
    const salaryRecord = getEmployeeSalaryStatus(record.id);

    if (salaryRecord) {
      handleSalaryStatusChange(dispatch, salaryRecord, checked)
        .then(() => {
          // Refresh both employee and salary data
          dispatch(empdata());
          dispatch(getSalaryss());
        });
    } else {
      message.warning('No salary record found for this employee');
    }
  };

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

  // Add this function to filter employees by branch
  const getFilteredEmployees = () => {
    if (!users) return [];

    let datas = users;

    // Filter by branch
    if (selectedBranch !== 'all') {
      datas = datas.filter(employee => employee.branch === selectedBranch);
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      datas = datas.filter(employee => {
        return (
          employee.username?.toLowerCase().includes(searchLower) ||
          employee.firstName?.toLowerCase().includes(searchLower) ||
          employee.lastName?.toLowerCase().includes(searchLower) ||
          employee.department?.toLowerCase().includes(searchLower) ||
          employee.designation?.toLowerCase().includes(searchLower) ||
          employee.branch?.toLowerCase().includes(searchLower)
        );
      });
    }

    return datas;
  };

  // Add this before the table component
  const BranchFilter = () => (
    <div style={{ marginBottom: '1rem' }}>
      <Select
        style={{ width: 200 }}
        placeholder="Filter by Branch"
        value={selectedBranch}
        onChange={setSelectedBranch}
      >
        <Option value="all">All Branches</Option>
        {branchDataa.map(branch => (
          <Option key={branch.id} value={branch.branchName}>
            {branch.branchName}
          </Option>
        ))}
      </Select>
    </div>
  );

  const handleCheckIn = (empId) => {
    const currentDate = moment().format('YYYY-MM-DD'); // Get current date
    const currentTime = moment().format('HH:mm:ss'); // Get current time

    const values = {
      employee: empId,
      date: currentDate,
      startTime: currentTime,
    };

    dispatch(addAttendance(values))
      .then(() => {
        message.success("Checked in successfully!");
      })
      .catch((error) => {
        console.error("Error checking in:", error);
        message.error("Failed to check in. Please try again.");
      });
  };

  const handleCheckOut = (empId) => {
    const currentDate = moment().format('YYYY-MM-DD'); // Get current date
    const currentTime = moment().format('HH:mm:ss'); // Get current time

    const values = {
      employee: empId,
      endTime: currentTime,
      date: currentDate,
    };

    dispatch(editAttendance({ id: empId, values }))
      .then(() => {
        message.success("Checked out successfully!");
      })
      .catch((error) => {
        console.error("Error checking out:", error);
        message.error("Failed to check out. Please try again.");
      });
  };

  return (
    <Card bodyStyle={{ padding: "0" }} className="shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border-b border-gray-100">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search employees..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={onSearch}
                allowClear
                className="min-w-[250px] hover:border-indigo-400 focus:border-indigo-500"
                style={{ borderRadius: '8px' }}
              />
            </div>
            <div className="mb-3 ml-2">
              <BranchFilter />
            </div>
          </Flex>
          <Flex gap="7px">
            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) && (
              <Button
                type="primary"
                className="rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
                onClick={openAddEmployeeModal}
              >
                <PlusOutlined />
                Add Employee
              </Button>
            )}
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
              className="rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Export
            </Button>
          </Flex>
        </Flex>
      </div>
      <div className="overflow-hidden">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredEmployees()}
            rowKey="id"
            className="ant-table-striped"
            rowClassName={(record, index) =>
              index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100 transition-colors' : 'bg-white hover:bg-gray-50 transition-colors'
            }
          />
        )}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600">
            <PlusOutlined className="text-xl" />
            <span>Add New Employee</span>
          </div>
        }
        visible={isAddEmployeeModalVisible}
        onCancel={closeAddEmployeeModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <AddEmployee onClose={closeAddEmployeeModal} />
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-indigo-600">
            <EditOutlined className="text-xl" />
            <span>Edit Employee</span>
          </div>
        }
        visible={isEditEmployeeModalVisible}
        onCancel={closeEditEmployeeModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <EditEmployee onClose={closeEditEmployeeModal} idd={selectedEmployeeId} />
      </Modal>

      <Modal
        visible={isViewEmployeeModalVisible}
        onCancel={closeViewEmployeeModal}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <ViewEmployee employeeIdd={selectedEmployeeId} visible={isViewEmployeeModalVisible} close={closeViewEmployeeModal} />
      </Modal>

      <EmailVerification
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        initialEmail={users.find(user => user.id === comnyid)?.email}
        idd={comnyid}
      />

      <style jsx global>{`
        .custom-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
        .custom-modal .ant-modal-header {
          padding: 16px 24px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        .custom-modal .ant-modal-body {
          padding: 24px;
        }
        .custom-modal .ant-modal-close {
          top: 16px;
          right: 16px;
        }
        .ant-table-striped .ant-table-row:nth-child(odd) > td {
          background-color: #f8fafc;
        }
        .ant-table-row:hover > td {
          background-color: #f1f5f9 !important;
        }
        .ant-table-tbody > tr > td {
          padding: 16px 24px;
          transition: all 0.2s;
        }
        .ant-input-affix-wrapper:hover {
          border-color: #818cf8;
        }
        .ant-input-affix-wrapper-focused {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
        .ant-btn-primary {
          background: linear-gradient(to right, #4f46e5, #6366f1);
          border: none;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
        }
        .ant-btn-primary:hover {
          background: linear-gradient(to right, #4338ca, #4f46e5);
          transform: translateY(-1px);
        }
      `}</style>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-affix-wrapper {
    min-width: 250px;
  }

  @media (max-width: 768px) {
    .ant-input-affix-wrapper {
      width: 100%;
    }
  }
`;

const EmployeeListWithStyles = () => (
  <>
    <style>{styles}</style>
    <EmployeeList />
  </>
);

export default EmployeeListWithStyles;
