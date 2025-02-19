import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Tag,
  Input,
  message,
  Button,
  Modal,
  DatePicker,
  Select,
  Tooltip
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  FileExcelOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddAttendance from "./AddAttendance";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import {
  deleteAttendance,
  getAttendances,
} from "./AttendanceReducer/AttendanceSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { GetLeave } from "../Leaves/LeaveReducer/LeaveSlice";

const { Option } = Select;

const AttendanceList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [selectedDepartment, setSelectedDepartment] = useState("All Department");
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [selectedEmployee, setSelectedEmployee] = useState("All Employee");
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchText, setSearchText] = useState('');

  const user = useSelector((state) => state.user.loggedInUser.username);

  const tabledata = useSelector((state) => state.attendance);
  const fnddat = tabledata.Attendances.data || [];
  const fndattendancedata = fnddat.filter((item) => item.created_by === user);


  const employeeData = useSelector((state) => state.employee?.employee?.data || []);
  const fndemployeeData = employeeData.filter((item) => item.created_by === user);
  
  const leaveData = useSelector((state) => state.Leave?.Leave?.data || []);
  const fndleavedata = leaveData.filter((item) => item.created_by === user);


  useEffect(() => {
    if (fndemployeeData) {
      const employeeAttendanceMap = fndemployeeData.reduce((acc, employee) => {
        acc[employee.id] = {
          employee: employee.username,
          id: employee.id,
          attendanceByDay: {},
          totalWorkingHours: 0,
          workingDays: 0,
        };
        return acc;
      }, {});

      let totalWorkingDays = 0;
      const daysInMonth = selectedMonth.daysInMonth();

      for (let i = 1; i <= daysInMonth; i++) {
        const date = selectedMonth.date(i);
        if (date.day() !== 0) { // Exclude Sundays
          totalWorkingDays++;
        }
      }

     
      if (fndattendancedata) {
        fndattendancedata.forEach((attendance) => {
          const attendanceDate = dayjs(attendance.date);
          if (attendanceDate.isSame(selectedMonth, 'month')) {
            const day = attendanceDate.date();
      
            // Ensure employeeAttendanceMap[attendance.employee] exists
            if (!employeeAttendanceMap[attendance.employee]) {
              employeeAttendanceMap[attendance.employee] = {
                attendanceByDay: {},
                totalWorkingHours: 0,
                workingDays: 0,
              };
            }
      
            if (!employeeAttendanceMap[attendance.employee].attendanceByDay[day]) {
              employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
                status: 'P',
                startTime: attendance.startTime,
                endTime: attendance.endTime,
              };
      
              const startTime = dayjs(attendance.startTime, "HH:mm:ss");
              const endTime = dayjs(attendance.endTime, "HH:mm:ss");
              const hoursWorked = endTime.diff(startTime, 'hour', true);
      
              employeeAttendanceMap[attendance.employee].totalWorkingHours += hoursWorked;
              employeeAttendanceMap[attendance.employee].workingDays++;
            }
          }
        });
      }
     
     
      if (fndleavedata) {
        fndleavedata.forEach((leave) => {
          const leaveStart = dayjs(leave.startDate);
          const leaveEnd = dayjs(leave.endDate);
          if (leaveStart.isSame(selectedMonth, 'month') || leaveEnd.isSame(selectedMonth, 'month')) {
            const employee = employeeAttendanceMap[leave.employeeId];
            if (employee) {
              for (let d = leaveStart; d.isBefore(leaveEnd) || d.isSame(leaveEnd); d = d.add(1, 'day')) {
                if (d.isSame(selectedMonth, 'month')) {
                  const day = d.date();
                  employee.attendanceByDay[day] = {
                    status: 'L',
                    leaveType: leave.leaveType,
                    remark: leave.remarks,
                    statusText: leave.status,
                  };
                }
              }
            }
          }
        });
      }

      const aggregatedData = Object.values(employeeAttendanceMap).map(employee => ({
        ...employee,
        totalWorkingDays,
      }));

      // Only set users if the data has changed
      if (JSON.stringify(users) !== JSON.stringify(aggregatedData)) {
        setUsers(aggregatedData);
        // console.log(aggregatedData, "users");
      }
    }
  }, [fndattendancedata, fndemployeeData, fndleavedata, selectedMonth]);



  useEffect(() => {
    dispatch(getAttendances());
    dispatch(GetLeave());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const openAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(true);
  };

  const closeAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(false);
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
                                 
                                    if (parsedPermissions["extra-hrm-role"] && parsedPermissions["extra-hrm-role"][0]?.permissions) {
                                      allpermisson = parsedPermissions["extra-hrm-role"][0].permissions;
                                      console.log('Parsed Permissions:', allpermisson);
                                    
                                    } else {
                                      console.log('extra-hrm-role is not available');
                                    }
                                    
                                    const canCreateClient = allpermisson?.includes('create');
                                    const canEditClient = allpermisson?.includes('edit');
                                    const canDeleteClient = allpermisson?.includes('delete');
                                    const canViewClient = allpermisson?.includes('view');
                                 
                                    ///endpermission


  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const onDateChange = (dates) => {
    setStartDate(dates ? dates[0] : null);
    setEndDate(dates ? dates[1] : null);
  };

  const filterByDate = (data) => {
    if (startDate && endDate) {
      return data.filter((item) => {
        const itemDate = dayjs(item.intime);
        return itemDate.isBetween(startDate, endDate, "day", "[]");
      });
    }
    return data;
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const deleteAttendances = (userId) => {
    dispatch(deleteAttendance(userId))
      .then(() => {
        dispatch(getAttendances());
        message.success("Appraisal Deleted successfully!");
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={() => {
              showUserProfile(elm);
            }}
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
            onClick={() => {
              showUserProfile(elm);
            }}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>

    

      {/* {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                <Menu.Item>
                                <Flex alignItems="center">
                                  <Button
                                    type=""
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                      editfun(elm.id);
                                    }}
                                    size="small"
                                  >
                                    Edit
                                  </Button>
                                </Flex>
                              </Menu.Item>
                                ) : null} */}
                  
                  
                  {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                      <Menu.Item>
                                      <Flex alignItems="center">
                                        <Button
                                          type=""
                                          className=""
                                          icon={<DeleteOutlined />}
                                          onClick={() => {
                                            deleteAttendances(elm.id);
                                          }}
                                          size="small"
                                        >
                                          <span className="">Delete</span>
                                        </Button>
                                      </Flex>
                                    </Menu.Item>
                                ) : null}
    </Menu>
  );

  const generateDateColumns = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const columns = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = selectedMonth.date(i);
      const isSunday = date.day() === 0;
      columns.push({
        title: (
          <div className="text-center">
            <div>{i}</div>
            <div>{date.format('ddd')}</div>
          </div>
        ),
        dataIndex: 'attendanceByDay',
        width: 60,
        align: 'center',
        render: (attendanceByDay) => {
          if (isSunday) return 'WK';
          const attendance = attendanceByDay[i];
          if (!attendance) return <Tag color="red" className="m-0">A</Tag>;
          if (attendance.status === 'L') {
            return (
              <Tooltip title={`Leave Type: ${attendance.leaveType}, Remark: ${attendance.remark || 'N/A'}, Status: ${attendance.statusText}`}>
                <Tag color="orange" className="m-0">L</Tag>
              </Tooltip>
            );
          }
          return renderAttendanceStatus(attendanceByDay, i);
        },
      });
    }
    return columns;
  };

  const renderAttendanceStatus = (attendanceByDay, day) => {
    if (!attendanceByDay) return null;
  
    const attendance = attendanceByDay[day];
    const status = attendance ? 'P' : 'A';
    const statusColors = {
      P: 'green',
      A: 'red',
    };
  
    if (!attendance) {
      return (
        <Tag color={statusColors[status]} className="m-0">
          {status}
        </Tag>
      );
    }
  
    const startTime = dayjs(attendance.startTime, "HH:mm:ss");
    const endTime = dayjs(attendance.endTime, "HH:mm:ss");
    const totalHours = endTime.diff(startTime, 'hour');
    const totalMinutes = endTime.diff(startTime, 'minute') % 60;
    const earlyOutHours = 17 - endTime.hour();
    const earlyOutMinutes = (60 - endTime.minute()) % 60;
  
    const tooltipContent = (
      <div>
        <div>Total Working Hours: {totalHours}H : {totalMinutes}M</div>
        <div>Early OUT Hours: {earlyOutHours}H : {earlyOutMinutes}M</div>
        <div>Late IN Hours: {startTime.hour() - 9}H : {startTime.minute()}M</div>
      </div>
    );
  
    return (
      <Tooltip title={tooltipContent}>
        <Tag color={statusColors[status]} className="m-0">
          {status}
        </Tag>
      </Tooltip>
    );
  };

  const tableColumns = [
    {
      title: 'Employee Name',
      dataIndex: 'employee',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <div>
          {text}
          <Tooltip title={`Total Working Hours: ${record.totalWorkingHours.toFixed(2)}H`}>
            <ClockCircleOutlined style={{ marginLeft: 8, color: 'blue' }} />
          </Tooltip>
          <span style={{ marginLeft: 8 }}>
            {record.workingDays}/{record.totalWorkingDays}
          </span>
        </div>
      ),
    },
    ...generateDateColumns(),
  ];

  const getFilteredAttendances = () => {
    if (!users) return [];
    
    if (!searchText) return users;

    return users.filter(attendance => {
      return (
        attendance.employee?.toLowerCase().includes(searchText.toLowerCase()) ||
        attendance.branch?.toLowerCase().includes(searchText.toLowerCase()) ||
        attendance.department?.toLowerCase().includes(searchText.toLowerCase()) ||
        attendance.date?.toLowerCase().includes(searchText.toLowerCase()) ||
        attendance.startTime?.toLowerCase().includes(searchText.toLowerCase()) ||
        attendance.endTime?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <div className="flex items-center flex-col md:flex-row justify-between">
        <div className="flex flex-col md:flex-row mb-4 gap-3">
          <div className="mr-0 md:mr-3 mb-3">
            <Input.Group compact>
              <Input
                placeholder="Search employee, branch, department..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="w-full md:w-[300px]  transition-all duration-300 hover:border-[#40a9ff] focus:border-[#40a9ff] focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)]"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <DatePicker.MonthPicker
            defaultValue={selectedMonth}
            format="MMM YYYY"
            onChange={(date) => setSelectedMonth(date)}
            className="mb-3"
          />
        </div>
        <div className="flex justify-end gap-2">
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddAttendanceModal}
              className="inline-flex items-center mb-4"
            >
              Add Attendance
            </Button>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table 
            columns={tableColumns} 
            dataSource={getFilteredAttendances()} 
            rowKey="id"
            pagination={{
              total: getFilteredAttendances().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      <Modal
        title="Add Attendance"
        visible={isAddAttendanceModalVisible}
        onCancel={closeAddAttendanceModal}
        footer={null}
        width={800}
      >
        <AddAttendance onClose={closeAddAttendanceModal} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  .ant-input-group .ant-input {
    width: calc(100% - 90px);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ant-input-group .ant-btn {
    width: 90px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-group {
      width: 100%;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const AttendanceListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AttendanceList />
  </>
);

export default AttendanceListWithStyles;
