import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Select,
  Switch,
  Badge,
  Avatar,
  Tag,
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
import Flex from "components/shared-components/Flex";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import ViewEmployee from "./ViewEmployee";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { roledata } from "../RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../Designation/DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";
import moment from "moment";
import { MdOutlineEmail } from "react-icons/md";
import EmailVerification from "views/app-views/company/EmailVerification";
import { handleSalaryStatusChange } from "../PayRoll/Salary/SalaryList";
import { getSalaryss } from "../PayRoll/Salary/SalaryReducers/SalarySlice";
import { Option } from "antd/es/mentions";
import {
  addAttendance,
  editAttendance,
} from "../Attendance/AttendanceReducer/AttendanceSlice";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] =
    useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] =
    useState(false);
  const [isViewEmployeeModalVisible, setIsViewEmployeeModalVisible] =
    useState(false);
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] =
    useState(false);
  const [comnyid, setCompnyid] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [sub, setSub] = useState(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.employee || []);

  const departmentData = useSelector(
    (state) => state.Department?.Department?.data || []
  );
  const designationData = useSelector(
    (state) => state.Designation?.Designation?.data || []
  );
  const branchDataa = useSelector((state) => state.Branch?.Branch?.data || []);
  const salaryData = useSelector((state) => state.salary?.salary?.data || []);


  useEffect(() => {
    dispatch(empdata());
    dispatch(roledata());
    dispatch(getSalaryss());
    dispatch(getDept());
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);


  useEffect(() => {
    if (tabledata?.employee?.data) {
      const mappedData = tabledata.employee.data.map((employee) => {
        const department = departmentData.find(
          (dept) => dept.id === employee.department
        );
        const designation = designationData.find(
          (desig) => desig.id === employee.designation
        );

        const branch = branchDataa.find((br) => br.id === employee.branch);

        return {
          ...employee,
          department: department?.department_name || "N/A",
          designation: designation?.designation_name || "N/A",
          branch: branch?.branchName || "N/A",
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
  const roleData = roles?.find((role) => role.id === roleId);
  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  const employeePermissions =
    parsedPermissions["extra-hrm-employee"]?.[0]?.permissions || [];

  const canCreateEmployee = employeePermissions.includes("create");
  const canEditEmployee = employeePermissions.includes("update");
  const canDeleteEmployee = employeePermissions.includes("delete");
  const canViewEmployee = employeePermissions.includes("view");

  const checkAndUpdateSalaryStatus = React.useCallback(
    (salaryRecord) => {
      if (!salaryRecord || !salaryRecord.paymentDate) return salaryRecord;

      const lastPaymentDate = moment(salaryRecord.paymentDate);
      const today = moment();
      const nextPaymentDue = lastPaymentDate.add(1, "month");

      if (today.isAfter(nextPaymentDue) && salaryRecord.status === "paid") {
        handleSalaryStatusChange(dispatch, salaryRecord, false)
          .then(() => {
            dispatch(getSalaryss());
          })
          .catch((error) => {
            console.error("Error updating salary status:", error);
          });
        return { ...salaryRecord, status: "unpaid" };
      }

      return salaryRecord;
    },
    [dispatch]
  );

  const getEmployeeSalaryStatus = (employeeId) => {
    const salaryRecord = salaryData.find(
      (salary) => salary.employeeId === employeeId && salary.created_by === user
    );

    if (salaryRecord) {
      return checkAndUpdateSalaryStatus(salaryRecord);
    }
    return null;
  };

  useEffect(() => {
    const checkSalaryStatuses = () => {
      if (salaryData && salaryData.length > 0) {
        salaryData.forEach((salary) => {
          checkAndUpdateSalaryStatus(salary);
        });
      }
    };

    checkSalaryStatuses();

    const intervalId = setInterval(checkSalaryStatuses, 86400000);

    return () => clearInterval(intervalId);
  }, [salaryData, checkAndUpdateSalaryStatus]);

  const handleEmployeeSalaryStatus = (record, checked) => {
    const salaryRecord = salaryData.find(
      (salary) => salary.employeeId === record.id && salary.created_by === user
    );

    if (salaryRecord) {
      const updates = {
        ...salaryRecord,
        status: checked ? "paid" : "unpaid",
        paymentDate: checked
          ? moment().format("YYYY-MM-DD")
          : salaryRecord.paymentDate,
      };

      handleSalaryStatusChange(dispatch, updates, checked)
        .then(() => {
          dispatch(empdata());
          dispatch(getSalaryss());
        })
        .catch((error) => {
          message.error("Failed to update salary status");
          console.error("Error:", error);
        });
    } else {
      message.warning("No salary record found for this employee");
    }
  };

  const getFilteredEmployees = () => {
    if (!users) return [];

    let filteredData = users;

    if (selectedBranch !== "all") {
      filteredData = filteredData.filter(
        (employee) => employee.branch === selectedBranch
      );
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter((employee) => {
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
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    dispatch(
      addAttendance({
        employee: empId,
        date: currentDate,
        startTime: currentTime,
      })
    )
      .then(() => message.success("Checked in successfully!"))
      .catch(() => message.error("Failed to check in. Please try again."));
  };

  const handleCheckOut = (empId) => {
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    dispatch(
      editAttendance({
        id: empId,
        values: {
          employee: empId,
          endTime: currentTime,
          date: currentDate,
        },
      })
    )
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

  const getDropdownItems = (elm) => {
    const items = [];

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canEditEmployee && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => {
          setSelectedEmployeeId(elm.id);
          setIsEditEmployeeModalVisible(true);
        },
      });
    }

    if (canEditEmployee || whorole === "super-admin" || whorole === "client") {
      items.push({
        key: "email",
        icon: <MdOutlineEmail />,
        label: "Update Email",
        onClick: () => {
          setIsEmailVerificationModalVisible(true);
          setCompnyid(elm.id);
        },
      });
    }

    if (canViewEmployee || whorole === "super-admin" || whorole === "client") {
      items.push({
        key: "view",
        icon: <EyeOutlined />,
        label: "View",
        onClick: () => {
          setSelectedEmployeeId(elm.id);
          setIsViewEmployeeModalVisible(true);
        },
      });
    }

    if (canEditEmployee || whorole === "super-admin" || whorole === "client") {
      items.push({
        key: "checkin",
        icon: <EditOutlined />,
        label: "Check In",
        onClick: () => handleCheckIn(elm.id),
      });

      items.push({
        key: "checkout",
        icon: <EditOutlined />,
        label: "Check Out",
        onClick: () => handleCheckOut(elm.id),
      });
    }

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canDeleteEmployee && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(elm.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Employee",
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
                {record.firstName?.charAt(0)?.toUpperCase() ||
                  record.username?.charAt(0)?.toUpperCase() ||
                  "U"}
              </Avatar>
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.firstName && record.lastName
                ? `${record.firstName} ${record.lastName}`
                : record.username || "N/A"}
            </div>
            <div className="text-gray-500 text-sm">
              {record.email || "No email"}
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
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              branch ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          <span className="text-gray-700">{branch || "N/A"}</span>
        </div>
      ),
      sorter: (a, b) => a.branch?.localeCompare(b.branch) || 0,
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (department) => (
        <Tag
          color="blue"
          className="text-sm px-3 py-1 rounded-full font-medium"
        >
          {department || "N/A"}
        </Tag>
      ),
      sorter: (a, b) => a.department?.localeCompare(b.department) || 0,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      render: (designation) => (
        <Tag
          color="purple"
          className="text-sm px-3 py-1 rounded-full font-medium"
        >
          {designation}
        </Tag>
      ),
      sorter: (a, b) => a.designation?.localeCompare(b.designation) || 0,
    },
    {
      title: "Date OF Joining",
      dataIndex: "joiningDate",
      render: (text) => (
        <div className="text-gray-600">
          {text ? moment(text).format("DD MMM YYYY") : "N/A"}
        </div>
      ),
      sorter: (a, b) => moment(a.joiningDate) - moment(b.joiningDate),
    },
   
    {
      title: "Salary Status",
      key: "salaryStatus",
      render: (_, record) => {
        const salaryRecord = getEmployeeSalaryStatus(record.id);
        const nextPaymentDate = salaryRecord?.paymentDate
          ? moment(salaryRecord.paymentDate)
              .add(1, "month")
              .format("DD MMM YYYY")
          : "N/A";

        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={salaryRecord?.status === "paid"}
                onChange={(checked) =>
                  handleEmployeeSalaryStatus(record, checked)
                }
                checkedChildren="Paid"
                unCheckedChildren="Unpaid"
                disabled={
                  !(
                    whorole === "super-admin" ||
                    whorole === "client" ||
                    canEditEmployee
                  )
                }
                className={`${
                  salaryRecord?.status === "paid"
                    ? "bg-green-500"
                    : "bg-gray-400"
                } shadow-sm`}
              />
              <Badge
                status={salaryRecord?.status === "paid" ? "success" : "error"}
                text={
                  <span className="text-sm font-medium">
                    {salaryRecord?.status
                      ? salaryRecord.status.charAt(0).toUpperCase() +
                        salaryRecord.status.slice(1)
                      : "No Salary"}
                  </span>
                }
              />
            </div>
            <div className="text-xs text-gray-500">
              Next Payment: {nextPaymentDate}
            </div>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
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
    <Card bodyStyle={{ padding: "0" }} className="rounded-lg shadow-sm">
      <div className="bg-white border-b">
        <div className="p-6">
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
                  {branchDataa.map((branch) => (
                    <Option key={branch.id} value={branch.branchName}>
                      {branch.branchName}
                    </Option>
                  ))}
                </Select>
              </div>
            </Flex>
            <Flex gap="8px">
              {(whorole === "super-admin" ||
                whorole === "client" ||
                (canCreateEmployee &&
                  whorole !== "super-admin" &&
                  whorole !== "client")) && (
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
        {(whorole === "super-admin" ||
          whorole === "client" ||
          (canViewEmployee &&
            whorole !== "super-admin" &&
            whorole !== "client")) && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredEmployees()}
            rowKey="id"
            className="ant-table-striped"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }
          />
        )}
      </div>

      <Modal
        title="Add Employee"
        visible={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        footer={null}
        width={1000}
        className="custom-modal"
      >
        <AddEmployee onClose={() => setIsAddEmployeeModalVisible(false)} />
      </Modal>

      <Modal
        title="Edit Employee"
        visible={isEditEmployeeModalVisible}
        onCancel={() => setIsEditEmployeeModalVisible(false)}
        footer={null}
        width={1000}
        className="custom-modal"
      >
        <EditEmployee
          onClose={() => setIsEditEmployeeModalVisible(false)}
          idd={selectedEmployeeId}
          
          initialData={
            users.find((user) => user.id === selectedEmployeeId) || {}
          }
        />
      </Modal>

      <Modal
        title="View Employee"
        visible={isViewEmployeeModalVisible}
        onCancel={() => setIsViewEmployeeModalVisible(false)}
        footer={null}
        width={1000}
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
        initialEmail={users.find((user) => user.id === comnyid)?.email}
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
        .ant-dropdown-menu {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          padding: 4px;
        }
        .ant-dropdown-menu-item {
          padding: 8px 16px;
          border-radius: 4px;
          margin: 2px 0;
        }
        .ant-dropdown-menu-item:hover {
          background-color: #f5f5f5;
        }
        .ant-dropdown-menu-item-danger:hover {
          background-color: #fff1f0;
        }
        .ant-dropdown-menu-item .anticon {
          font-size: 16px;
        }
      `}</style>
    </Card>
  );
};

export default EmployeeList;
