import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, message, Button, Modal, Select, Switch, Badge, Avatar, Tag } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
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
import { getSalaryss } from '../PayRoll/Salary/SalaryReducers/SalarySlice';
import { Option } from "antd/es/mentions";
import { addAttendance, editAttendance } from "../Attendance/AttendanceReducer/AttendanceSlice";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [isViewEmployeeModalVisible, setIsViewEmployeeModalVisible] = useState(false);
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
  const [comnyid, setCompnyid] = useState("");
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [sub, setSub] = useState(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.employee);
  const allroledata = useSelector((state) => state.role);
  const fndroledata = allroledata.role.data;
  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);
  const branchDataa = useSelector((state) => state.Branch?.Branch?.data || []);
  const salaryData = useSelector((state) => state.salary?.salary?.data || []);

  useEffect(() => {
    dispatch(roledata());
  }, []);

  useEffect(() => {
    dispatch(empdata());
    dispatch(getSalaryss());
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata?.employee?.data) {
      const mappedData = tabledata.employee.data.map(employee => {
        const department = departmentData.find(dept => dept.id === employee.department);
        const designation = designationData.find(desig => desig.id === employee.designation);
        const branch = branchDataa.find(br => br.id === employee.branch);

        return {
          ...employee,
          department: department?.department_name || 'N/A',
          designation: designation?.designation_name || 'N/A',
          branch: branch?.branchName || 'N/A'
        };
      });

      setUsers(mappedData);
    }
  }, [tabledata, departmentData, designationData, branchDataa]);

  useEffect(() => {
    dispatch(empdata());
    setSub(false);
  }, [sub, dispatch]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);
  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  const allpermisson = parsedPermissions["extra-hrm-employee"]?.[0]?.permissions;

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  const getEmployeeSalaryStatus = (employeeId) => {
    return salaryData.find(salary => salary.employeeId === employeeId && salary.created_by === user);
  };

  const handleEmployeeSalaryStatus = (record, checked) => {
    const salaryRecord = getEmployeeSalaryStatus(record.id);
    if (salaryRecord) {
      handleSalaryStatusChange(dispatch, salaryRecord, checked)
        .then(() => {
          dispatch(empdata());
          dispatch(getSalaryss());
        });
    } else {
      message.warning('No salary record found for this employee');
    }
  };

  const getFilteredEmployees = () => {
    if (!users) return [];

    let filteredData = users;

    if (selectedBranch !== 'all') {
      filteredData = filteredData.filter(employee => employee.branch === selectedBranch);
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(employee => {
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

    return filteredData;
  };

  const handleCheckIn = (empId) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm:ss');

    dispatch(addAttendance({
      employee: empId,
      date: currentDate,
      startTime: currentTime,
    }))
      .then(() => message.success("Checked in successfully!"))
      .catch(() => message.error("Failed to check in. Please try again."));
  };

  const handleCheckOut = (empId) => {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('HH:mm:ss');

    dispatch(editAttendance({
      id: empId,
      values: {
        employee: empId,
        endTime: currentTime,
        date: currentDate,
      }
    }))
      .then(() => message.success("Checked out successfully!"))
      .catch(() => message.error("Failed to check out. Please try again."));
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Employee");
      writeFile(wb, "EmployeeData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      message.error("Failed to export data. Please try again.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(deleteEmp(userId));
      const updatedData = await dispatch(empdata());
      setUsers(updatedData.employee.data || updatedData.payload.data);
      message.success("Deleted employee successfully");
    } catch (error) {
      message.error("Failed to delete employee");
    }
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) && (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              className=""
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedEmployeeId(elm.id);
                setIsEditEmployeeModalVisible(true);
              }}
              size="small"
            >
              <span className="ml-2">Edit</span>
            </Button>
          </Flex>
        </Menu.Item>
      )}

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
            onClick={() => {
              setSelectedEmployeeId(elm.id);
              setIsViewEmployeeModalVisible(true);
            }}
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

      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) && (
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
      )}
    </Menu>
  );

  const tableColumns = [
    {
      title: "Employee",
      dataIndex: 'profilePic',
      render: (_, record) => (
        <div className="flex items-center">
          <div className="mr-3">
            {record.profilePic ? (
              <Avatar src={record.profilePic} size={40} className="border-2 border-white shadow-md" />
            ) : (
              <Avatar size={40} className="bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center">
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
            <div className="text-gray-500 text-sm">{record.email || 'No email'}</div>
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
      sorter: (a, b) => a.branch?.localeCompare(b.branch) || 0,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (department) => (
        <Tag color="blue" className="text-sm px-3 py-1 rounded-full font-medium">
          {department || 'N/A'}
        </Tag>
      ),
      sorter: (a, b) => a.department?.localeCompare(b.department) || 0,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (designation) => (
        <Tag color="purple" className="text-sm px-3 py-1 rounded-full font-medium">
          {designation || 'N/A'}
        </Tag>
      ),
      sorter: (a, b) => a.designation?.localeCompare(b.designation) || 0,
    },
    {
      title: "Date OF Joining",
      dataIndex: "joiningDate",
      render: (text) => (
        <div className="text-gray-600">
          {text ? moment(text).format('DD MMM YYYY') : 'N/A'}
        </div>
      ),
      sorter: (a, b) => moment(a.joiningDate) - moment(b.joiningDate),
    },
    {
      title: "Leave Date",
      dataIndex: "leaveDate",
      render: (text) => (
        <div className="text-gray-600">
          {text ? moment(text).format('DD MMM YYYY') : 'N/A'}
        </div>
      ),
      sorter: (a, b) => moment(a.leaveDate) - moment(b.leaveDate),
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

  return (
    <Card bodyStyle={{ padding: "0" }} className="rounded-lg shadow-sm">
      <div className="bg-white border-b">
        <div className="p-6">
          <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
            <Flex className="mb-1" mobileFlex={false}>
              <div className="mr-md-3 mb-3">
                <Input
                  placeholder="Search employees..."
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  className="min-w-[250px] rounded-md border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="mb-3 ml-2">
                <Select
                  style={{ width: 200 }}
                  placeholder="Filter by Branch"
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  className="rounded-md border-gray-300"
                >
                  <Option value="all">All Branches</Option>
                  {branchDataa.map(branch => (
                    <Option key={branch.id} value={branch.branchName}>
                      {branch.branchName}
                    </Option>
                  ))}
                </Select>
              </div>
            </Flex>
            <Flex gap="8px">
              {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) && (
                <Button
                  type="primary"
                  onClick={() => setIsAddEmployeeModalVisible(true)}
                  className="bg-blue-500 hover:bg-blue-600 border-0 rounded-md shadow-sm hover:shadow flex items-center"
                >
                  <PlusOutlined />
                  <span className="ml-2">Add Employee</span>
                </Button>
              )}
              <Button
                onClick={exportToExcel}
                className="bg-blue-500 hover:bg-blue-600 text-white border-0 rounded-md shadow-sm hover:shadow flex items-center"
              >
                <FileExcelOutlined />
                <span className="ml-2">Export</span>
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>

      <div className="bg-white">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredEmployees()}
            rowKey="id"
            className="ant-table-striped"
            rowClassName={(record, index) => index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
          />
        )}
      </div>

      <Modal
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <PlusOutlined className="text-lg" />
            <span className="font-medium">Add New Employee</span>
          </div>
        }
        visible={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <AddEmployee onClose={() => setIsAddEmployeeModalVisible(false)} />
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <EditOutlined className="text-lg" />
            <span className="font-medium">Edit Employee</span>
          </div>
        }
        visible={isEditEmployeeModalVisible}
        onCancel={() => setIsEditEmployeeModalVisible(false)}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <EditEmployee
          onClose={() => setIsEditEmployeeModalVisible(false)}
          idd={selectedEmployeeId}
          initialData={users.find(user => user.id === selectedEmployeeId) || {}}
        />
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-gray-700">
            <EyeOutlined className="text-lg" />
            <span className="font-medium">View Employee Details</span>
          </div>
        }
        visible={isViewEmployeeModalVisible}
        onCancel={() => setIsViewEmployeeModalVisible(false)}
        footer={null}
        width={800}
        className="custom-modal"
      >
        <ViewEmployee
          employeeIdd={selectedEmployeeId}
          visible={isViewEmployeeModalVisible}
          close={() => setIsViewEmployeeModalVisible(false)}
        />
      </Modal>

      <EmailVerification
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        initialEmail={users.find(user => user.id === comnyid)?.email}
        idd={comnyid}
      />

      <style jsx global>{`
        .custom-modal .ant-modal-content {
          border-radius: 8px;
          overflow: hidden;
        }
        .custom-modal .ant-modal-header {
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #f0f0f0;
        }
        .custom-modal .ant-modal-body {
          padding: 24px;
        }
        .custom-modal .ant-modal-close {
          top: 16px;
          right: 16px;
        }
        .ant-table-striped .ant-table-row:nth-child(odd) > td {
          background-color: #fafafa;
        }
        .ant-table-row:hover > td {
          background-color: #f5f5f5 !important;
        }
        .ant-table-tbody > tr > td {
          padding: 16px 24px;
          transition: all 0.2s;
        }
        .ant-input-affix-wrapper:hover {
          border-color: #40a9ff;
        }
        .ant-input-affix-wrapper-focused {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }
        .ant-select:hover .ant-select-selector {
          border-color: #40a9ff !important;
        }
        .ant-select-focused .ant-select-selector {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }
        .ant-btn-primary {
          background: #1890ff;
          border: none;
        }
        .ant-btn-primary:hover {
          background: #40a9ff;
        }
        .ant-table {
          border-radius: 0;
        }
      `}</style>
    </Card>
  );
};

export default EmployeeList;
