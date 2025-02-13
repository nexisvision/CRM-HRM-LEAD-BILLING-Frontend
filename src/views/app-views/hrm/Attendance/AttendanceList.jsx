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

      // if (fndattendancedata) {
      //   fndattendancedata.forEach((attendance) => {
      //     const attendanceDate = dayjs(attendance.date);
      //     if (attendanceDate.isSame(selectedMonth, 'month')) {
      //       const day = attendanceDate.date();
      //       if (!employeeAttendanceMap[attendance.employee].attendanceByDay[day]) {
      //         employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
      //           status: 'P',
      //           startTime: attendance.startTime,
      //           endTime: attendance.endTime,
      //         };
      //         const startTime = dayjs(attendance.startTime, "HH:mm:ss");
      //         const endTime = dayjs(attendance.endTime, "HH:mm:ss");
      //         const hoursWorked = endTime.diff(startTime, 'hour', true);
      //         employeeAttendanceMap[attendance.employee].totalWorkingHours += hoursWorked;
      //         employeeAttendanceMap[attendance.employee].workingDays++;
      //       }
      //     }
      //   });
      // }

     
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



  // useEffect(() => {
  //   if (fndemployeeData) {
  //     const employeeAttendanceMap = fndemployeeData.reduce((acc, employee) => {
  //       acc[employee.id] = {
  //         employee: employee.username,
  //         id: employee.id,
  //         attendanceByDay: {},
  //         totalWorkingHours: 0,
  //         workingDays: 0,
  //       };
  //       return acc;
  //     }, {});

  //     let totalWorkingDays = 0;
  //     const daysInMonth = selectedMonth.daysInMonth();

  //     for (let i = 1; i <= daysInMonth; i++) {
  //       const date = selectedMonth.date(i);
  //       if (date.day() !== 0) { // Exclude Sundays
  //         totalWorkingDays++;
  //       }
  //     }

  //     if (fndattendancedata) {
  //       fndattendancedata.forEach((attendance) => {
  //         const attendanceDate = dayjs(attendance.date);
  //         if (attendanceDate.isSame(selectedMonth, 'month')) {
  //           const day = attendanceDate.date();
  //           if (!employeeAttendanceMap[attendance.employee].attendanceByDay[day]) {
  //             employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
  //               status: 'P',
  //               startTime: attendance.startTime,
  //               endTime: attendance.endTime,
  //             };
  //             const startTime = dayjs(attendance.startTime, "HH:mm:ss");
  //             const endTime = dayjs(attendance.endTime, "HH:mm:ss");
  //             const hoursWorked = endTime.diff(startTime, 'hour', true);
  //             employeeAttendanceMap[attendance.employee].totalWorkingHours += hoursWorked;
  //             employeeAttendanceMap[attendance.employee].workingDays++;
  //           }
  //         }
  //       });
  //     }

  //     if (fndleavedata) {
  //       fndleavedata.forEach((leave) => {
  //         const leaveStart = dayjs(leave.startDate);
  //         const leaveEnd = dayjs(leave.endDate);
  //         if (leaveStart.isSame(selectedMonth, 'month') || leaveEnd.isSame(selectedMonth, 'month')) {
  //           const employee = employeeAttendanceMap[leave.employeeId];
  //           if (employee) {
  //             for (let d = leaveStart; d.isBefore(leaveEnd) || d.isSame(leaveEnd); d = d.add(1, 'day')) {
  //               if (d.isSame(selectedMonth, 'month')) {
  //                 const day = d.date();
  //                 employee.attendanceByDay[day] = {
  //                   status: 'L',
  //                   leaveType: leave.leaveType,
  //                   remark: leave.remarks,
  //                   statusText: leave.status,
  //                 };
  //               }
  //             }
  //           }
  //         }
  //       });
  //     }

  //     const aggregatedData = Object.values(employeeAttendanceMap).map(employee => ({
  //       ...employee,
  //       totalWorkingDays,
  //     }));

  //     setUsers(aggregatedData);
  //     console.log(aggregatedData, "users");
  //   }
  // }, [fndattendancedata, fndemployeeData, fndleavedata, selectedMonth]);


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
    const value = e.currentTarget.value;
    const filteredList = value ? utils.wildCardSearch(list, value) : tabledata;
    setList(filteredList);
    setSelectedRowKeys([]);
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

  return (
    <Card>
      <div className="mb-4">
        <h2>Employee Attendance</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <DatePicker.MonthPicker
              defaultValue={selectedMonth}
              format="MMM YYYY"
              onChange={(date) => setSelectedMonth(date)}
            />
            {/* <Select
              defaultValue="All Department"
              style={{ width: 150 }}
              onChange={(value) => setSelectedDepartment(value)}
            >
              <Option value="All Department">All Department</Option>
              {/* Add department options */}
            {/* </Select>
            <Select
              defaultValue="All Employee"
              style={{ width: 150 }}
              onChange={(value) => setSelectedEmployee(value)}
            >
              <Option value="All Employee">All Employee</Option>
              Add employee options */}
            {/* </Select> */}
          </div>
          <div className="flex gap-2">
          

             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openAddAttendanceModal}
              >
                Add Attendance
              </Button>                                                               ) : null}
            <Button icon={<FileExcelOutlined />}>Export</Button>
          </div>
        </div>
      </div>

        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                             <Table
                                                                                             columns={tableColumns}
                                                                                             dataSource={users}
                                                                                             scroll={{ x: 2000 }}
                                                                                             pagination={false}
                                                                                             rowKey="id"
                                                                                           />
                                                                                     
                                                                                                   ) : null}
      
     
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

export default AttendanceList;












// ==-=-=-=-=-=-=-=-=working code -=-=-=-=-=-=-=-=-=
// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Table,
//   Menu,
//   Tag,
//   Input,
//   message,
//   Button,
//   Modal,
//   DatePicker,
//   Select,
//   Tooltip
// } from "antd";
// import {
//   EyeOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   MailOutlined,
//   PlusOutlined,
//   FileExcelOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import UserView from "../../Users/user-list/UserView";
// import Flex from "components/shared-components/Flex";
// import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
// import AvatarStatus from "components/shared-components/AvatarStatus";
// import AddAttendance from "./AddAttendance";
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from "utils";
// import {
//   deleteAttendance,
//   getAttendances,
// } from "./AttendanceReducer/AttendanceSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
// import { GetLeave } from "../Leaves/LeaveReducer/LeaveSlice";

// const { Option } = Select;

// const AttendanceList = () => {
//   const [users, setUsers] = useState([]);
//   const dispatch = useDispatch();
//   const [list, setList] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(dayjs());
//   const [selectedDepartment, setSelectedDepartment] = useState("All Department");
//   const [selectedLocation, setSelectedLocation] = useState("All Location");
//   const [selectedEmployee, setSelectedEmployee] = useState("All Employee");
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const navigate = useNavigate();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const tabledata = useSelector((state) => state.attendance);
//   const fnddat = tabledata.Attendances.data;
//   const employeeData = useSelector((state) => state.employee?.employee?.data || []);

//   useEffect(() => {
//     if (employeeData) {
//       const employeeAttendanceMap = employeeData.reduce((acc, employee) => {
//         acc[employee.id] = {
//           employee: employee.username,
//           id: employee.id,
//           attendanceByDay: {},
//           totalWorkingHours: 0,
//           workingDays: 0,
//         };
//         return acc;
//       }, {});

//       let totalWorkingDays = 0;
//       const daysInMonth = selectedMonth.daysInMonth();

//       for (let i = 1; i <= daysInMonth; i++) {
//         const date = selectedMonth.date(i);
//         if (date.day() !== 0) { // Exclude Sundays
//           totalWorkingDays++;
//         }
//       }

//       if (fnddat) {
//         fnddat.forEach((attendance) => {
//           const attendanceDate = dayjs(attendance.date);
//           if (attendanceDate.isSame(selectedMonth, 'month')) {
//             const day = attendanceDate.date();
//             if (!employeeAttendanceMap[attendance.employee].attendanceByDay[day]) {
//               employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
//                 status: 'P',
//                 startTime: attendance.startTime,
//                 endTime: attendance.endTime,
//               };
//               const startTime = dayjs(attendance.startTime, "HH:mm:ss");
//               const endTime = dayjs(attendance.endTime, "HH:mm:ss");
//               const hoursWorked = endTime.diff(startTime, 'hour', true);
//               employeeAttendanceMap[attendance.employee].totalWorkingHours += hoursWorked;
//               employeeAttendanceMap[attendance.employee].workingDays++;
//             }
//           }
//         });
//       }

//       const aggregatedData = Object.values(employeeAttendanceMap).map(employee => ({
//         ...employee,
//         totalWorkingDays,
//       }));

//       setUsers(aggregatedData);
//       console.log(aggregatedData, "users");
//     }
//   }, [fnddat, employeeData, selectedMonth]);

//   useEffect(() => {
//     dispatch(getAttendances());
//     dispatch(GetLeave());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(empdata());
//   }, [dispatch]);

//   const openAddAttendanceModal = () => {
//     setIsAddAttendanceModalVisible(true);
//   };

//   const closeAddAttendanceModal = () => {
//     setIsAddAttendanceModalVisible(false);
//   };

//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const filteredList = value ? utils.wildCardSearch(list, value) : tabledata;
//     setList(filteredList);
//     setSelectedRowKeys([]);
//   };

//   const onDateChange = (dates) => {
//     setStartDate(dates ? dates[0] : null);
//     setEndDate(dates ? dates[1] : null);
//   };

//   const filterByDate = (data) => {
//     if (startDate && endDate) {
//       return data.filter((item) => {
//         const itemDate = dayjs(item.intime);
//         return itemDate.isBetween(startDate, endDate, "day", "[]");
//       });
//     }
//     return data;
//   };

//   const showUserProfile = (userInfo) => {
//     setUserProfileVisible(true);
//     setSelectedUser(userInfo);
//   };

//   const closeUserProfile = () => {
//     setUserProfileVisible(false);
//     setSelectedUser(null);
//   };

//   const deleteAttendances = (userId) => {
//     dispatch(deleteAttendance(userId))
//       .then(() => {
//         dispatch(getAttendances());
//         message.success("Appraisal Deleted successfully!");
//         setUsers(users.filter((item) => item.id !== userId));
//       })
//       .catch((error) => {
//         console.error("Edit API error:", error);
//       });
//   };

//   const dropdownMenu = (elm) => (
//     <Menu>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<EyeOutlined />}
//             onClick={() => {
//               showUserProfile(elm);
//             }}
//             size="small"
//           >
//             <span className="">View Details</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<MailOutlined />}
//             onClick={() => {
//               showUserProfile(elm);
//             }}
//             size="small"
//           >
//             <span className="">Send Mail</span>
//           </Button>
//         </Flex>
//       </Menu.Item>

//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<DeleteOutlined />}
//             onClick={() => {
//               deleteAttendances(elm.id);
//             }}
//             size="small"
//           >
//             <span className="">Delete</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//     </Menu>
//   );

//   const generateDateColumns = () => {
//     const daysInMonth = selectedMonth.daysInMonth();
//     const columns = [];
  
//     for (let i = 1; i <= daysInMonth; i++) {
//       const date = selectedMonth.date(i);
//       const isSunday = date.day() === 0;
//       columns.push({
//         title: (
//           <div className="text-center">
//             <div>{i}</div>
//             <div>{date.format('ddd')}</div>
//           </div>
//         ),
//         dataIndex: 'attendanceByDay',
//         width: 60,
//         align: 'center',
//         render: (attendanceByDay) => isSunday ? 'WK' : renderAttendanceStatus(attendanceByDay, i),
//       });
//     }
//     return columns;
//   };

//   const renderAttendanceStatus = (attendanceByDay, day) => {
//     if (!attendanceByDay) return null;
  
//     const attendance = attendanceByDay[day];
//     const status = attendance ? 'P' : 'A';
//     const statusColors = {
//       P: 'green',
//       A: 'red',
//     };
  
//     if (!attendance) {
//       return (
//         <Tag color={statusColors[status]} className="m-0">
//           {status}
//         </Tag>
//       );
//     }
  
//     const startTime = dayjs(attendance.startTime, "HH:mm:ss");
//     const endTime = dayjs(attendance.endTime, "HH:mm:ss");
//     const totalHours = endTime.diff(startTime, 'hour');
//     const totalMinutes = endTime.diff(startTime, 'minute') % 60;
//     const earlyOutHours = 17 - endTime.hour();
//     const earlyOutMinutes = (60 - endTime.minute()) % 60;
  
//     const tooltipContent = (
//       <div>
//         <div>Total Working Hours: {totalHours}H : {totalMinutes}M</div>
//         <div>Early OUT Hours: {earlyOutHours}H : {earlyOutMinutes}M</div>
//         <div>Late IN Hours: {startTime.hour() - 9}H : {startTime.minute()}M</div>
//       </div>
//     );
  
//     return (
//       <Tooltip title={tooltipContent}>
//         <Tag color={statusColors[status]} className="m-0">
//           {status}
//         </Tag>
//       </Tooltip>
//     );
//   };

//   const tableColumns = [
//     {
//       title: 'Employee Name',
//       dataIndex: 'employee',
//       fixed: 'left',
//       width: 200,
//       render: (text, record) => (
//         <div>
//           {text}
//           <Tooltip title={`Total Working Hours: ${record.totalWorkingHours.toFixed(2)}H`}>
//             <ClockCircleOutlined style={{ marginLeft: 8, color: 'blue' }} />
//           </Tooltip>
//           <span style={{ marginLeft: 8 }}>
//             {record.workingDays}/{record.totalWorkingDays}
//           </span>
//         </div>
//       ),
//     },
//     ...generateDateColumns(),
//   ];

//   return (
//     <Card>
//       <div className="mb-4">
//         <h2>Employee Attendance</h2>
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex gap-4">
//             <DatePicker.MonthPicker
//               defaultValue={selectedMonth}
//               format="MMM YYYY"
//               onChange={(date) => setSelectedMonth(date)}
//             />
//             <Select
//               defaultValue="All Department"
//               style={{ width: 150 }}
//               onChange={(value) => setSelectedDepartment(value)}
//             >
//               <Option value="All Department">All Department</Option>
//               {/* Add department options */}
//             </Select>
//             <Select
//               defaultValue="All Employee"
//               style={{ width: 150 }}
//               onChange={(value) => setSelectedEmployee(value)}
//             >
//               <Option value="All Employee">All Employee</Option>
//               {/* Add employee options */}
//             </Select>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={openAddAttendanceModal}
//             >
//               Add Attendance
//             </Button>
//             <Button icon={<FileExcelOutlined />}>Export</Button>
//           </div>
//         </div>
//       </div>
      
//       <Table
//         columns={tableColumns}
//         dataSource={users}
//         scroll={{ x: 2000 }}
//         pagination={false}
//         rowKey="id"
//       />

//       <UserView
//         data={selectedUser}
//         visible={userProfileVisible}
//         close={closeUserProfile}
//       />

//       <Modal
//         title="Add Attendance"
//         visible={isAddAttendanceModalVisible}
//         onCancel={closeAddAttendanceModal}
//         footer={null}
//         width={800}
//       >
//         <AddAttendance onClose={closeAddAttendanceModal} />
//       </Modal>
//     </Card>
//   );
// };

// export default AttendanceList;















// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   Table,
//   Menu,
//   Tag,
//   Input,
//   message,
//   Button,
//   Modal,
//   DatePicker,
//   Select,
//   Tooltip
// } from "antd";
// import {
//   EyeOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   MailOutlined,
//   PlusOutlined,
//   FileExcelOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import UserView from "../../Users/user-list/UserView";
// import Flex from "components/shared-components/Flex";
// import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
// import AvatarStatus from "components/shared-components/AvatarStatus";
// import AddAttendance from "./AddAttendance";
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from "utils";
// import {
//   deleteAttendance,
//   getAttendances,
// } from "./AttendanceReducer/AttendanceSlice";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";

// const { Option } = Select;

// const AttendanceList = () => {
//   const [users, setUsers] = useState(userData);
//   const dispatch = useDispatch();
//   const [list, setList] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(
//     dayjs().format("MMM YYYY")
//   );
//   const [selectedDepartment, setSelectedDepartment] =
//     useState("All Department");
//   const [selectedLocation, setSelectedLocation] = useState("All Location");
//   const [selectedEmployee, setSelectedEmployee] = useState("All Employee");
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const navigate = useNavigate();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] =
//     useState(false);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   const tabledata = useSelector((state) => state.attendance);

//   const fnddat = tabledata.Attendances.data;

//   const employeeData = useSelector(
//     (state) => state.employee?.employee?.data || []
//   );


//   // useEffect(() => {
//   //   if (fnddat) {
//   //     setList(fnddat);
//   //   }
//   // }, [fnddat]);





//   useEffect(() => {
//     if (fnddat) {
//       const employeeAttendanceMap = {};
  
//       fnddat.forEach((attendance) => {
//         const employeeName =
//           employeeData.find((e) => e.id === attendance.employee)?.username || "N/A";
  
//         if (!employeeAttendanceMap[attendance.employee]) {
//           employeeAttendanceMap[attendance.employee] = {
//             employee: employeeName,
//             id: attendance.employee,
//             attendanceByDay: {},
//           };
//         }
  
//         const day = dayjs(attendance.date).date();
//         employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
//           status: 'P',
//           startTime: attendance.startTime,
//           endTime: attendance.endTime,
//         };
//       });
  
//       const aggregatedData = Object.values(employeeAttendanceMap);
//       setUsers(aggregatedData);
//       console.log(aggregatedData, "users");
//     }
//   }, [fnddat, employeeData]);




//   // useEffect(() => {
//   //   if (fnddat) {
//   //     const mappedData = fnddat.map((attendance) => {
//   //       const employeeName =
//   //         employeeData.find((e) => e.id === attendance.employee)?.username || "N/A";
  
//   //       return {
//   //         ...attendance,
//   //         employee: employeeName, // Replace 'employee' with the employee's name
//   //       };
//   //     });
//   //     setUsers(mappedData);
//   //     console.log(mappedData, "users");
//   //   }
//   // }, [fnddat, employeeData]);


//   useEffect(() => {
//     dispatch(getAttendances());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(empdata());
//   }, [dispatch]);

//   // useEffect(() => {
//   //   if (tabledata?.Attendances?.data) {
//   //     const mappedData = tabledata.Attendances.data.map((attendance) => {
//   //       const employee =
//   //         employeeData.find((e) => e.id === mappedData.employee)?.username ||
//   //         "N/A";

//   //       return {
//   //         ...attendance,
//   //         employee,
//   //       };
//   //     });
//   //     setUsers(mappedData);
//   //     console.log(mappedData, "users");
//   //   }
//   // }, [tabledata]);






//   // Open Add Attendance Modal
//   const openAddAttendanceModal = () => {
//     setIsAddAttendanceModalVisible(true);
//   };

//   // Close Add Attendance Modal
//   const closeAddAttendanceModal = () => {
//     setIsAddAttendanceModalVisible(false);
//   };

//   // Handle Search functionality
//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const filteredList = value ? utils.wildCardSearch(list, value) : tabledata;
//     setList(filteredList);
//     setSelectedRowKeys([]);
//   };

//   // Handle Date Range Filtering
//   const onDateChange = (dates) => {
//     setStartDate(dates ? dates[0] : null); // Set the start date
//     setEndDate(dates ? dates[1] : null); // Set the end date
//   };

//   // Filter based on Date Range
//   const filterByDate = (data) => {
//     if (startDate && endDate) {
//       return data.filter((item) => {
//         const itemDate = dayjs(item.intime);
//         return itemDate.isBetween(startDate, endDate, "day", "[]"); // inclusive
//       });
//     }
//     return data; // Return original data if no date range is selected
//   };

//   // Show User Profile
//   const showUserProfile = (userInfo) => {
//     setUserProfileVisible(true);
//     setSelectedUser(userInfo);
//   };

//   // Close User Profile
//   const closeUserProfile = () => {
//     setUserProfileVisible(false);
//     setSelectedUser(null);
//   };

//   const deleteAttendances = (userId) => {
//     dispatch(deleteAttendance(userId))
//       .then(() => {
//         dispatch(getAttendances());
//         message.success("Appraisal Deleted successfully!");
//         setUsers(users.filter((item) => item.id !== userId));
//       })
//       .catch((error) => {
//         console.error("Edit API error:", error);
//       });
//   };

//   // Dropdown Menu
//   const dropdownMenu = (elm) => (
//     <Menu>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<EyeOutlined />}
//             onClick={() => {
//               showUserProfile(elm);
//             }}
//             size="small"
//           >
//             <span className="">View Details</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<MailOutlined />}
//             onClick={() => {
//               showUserProfile(elm);
//             }}
//             size="small"
//           >
//             <span className="">Send Mail</span>
//           </Button>
//         </Flex>
//       </Menu.Item>

//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<DeleteOutlined />}
//             onClick={() => {
//               deleteAttendances(elm.id);
//             }}
//             size="small"
//           >
//             <span className="">Delete</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//     </Menu>
//   );

//   // Calendar header with dates
//   // const generateDateColumns = () => {
//   //   const daysInMonth = dayjs().daysInMonth();
//   //   const columns = [];

//   //   for (let i = 1; i <= daysInMonth; i++) {
//   //     const date = dayjs().date(i);
//   //     columns.push({
//   //       title: (
//   //         <div className="text-center">
//   //           <div>{i}</div>
//   //           <div>{date.format('ddd')}</div>
//   //         </div>
//   //       ),
//   //       dataIndex: `day${i}`,
//   //       width: 60,
//   //       align: 'center',
//   //       render: (status) => renderAttendanceStatus(status),
//   //     });
//   //   }
//   //   return columns;
//   // };





//   const generateDateColumns = () => {
//     const daysInMonth = dayjs().daysInMonth();
//     const columns = [];
  
//     for (let i = 1; i <= daysInMonth; i++) {
//       columns.push({
//         title: (
//           <div className="text-center">
//             <div>{i}</div>
//             <div>{dayjs().date(i).format('ddd')}</div>
//           </div>
//         ),
//         dataIndex: 'attendanceByDay',
//         width: 60,
//         align: 'center',
//         render: (attendanceByDay) => renderAttendanceStatus(attendanceByDay, i),
//       });
//     }
//     return columns;
//   };




//   // const renderAttendanceStatus = (status) => {
//   //   if (!status) return null;

//   //   const statusColors = {
//   //     P: 'green',
//   //     A: 'red',
//   //     L: 'orange',
//   //     WK: 'blue',
//   //     HL: 'purple'
//   //   };

//   //   return (
//   //     <Tag color={statusColors[status]} className="m-0">
//   //       {status}
//   //     </Tag>
//   //   );
//   // };




//   const renderAttendanceStatus = (attendanceByDay, day) => {
//     if (!attendanceByDay) return null;
  
//     const attendance = attendanceByDay[day];
//     const status = attendance ? 'P' : 'A'; // 'P' for present, 'A' for absent
//     const statusColors = {
//       P: 'green',
//       A: 'red',
//     };
  
//     if (!attendance) {
//       return (
//         <Tag color={statusColors[status]} className="m-0">
//           {status}
//         </Tag>
//       );
//     }
  
//     const startTime = dayjs(attendance.startTime, "HH:mm:ss");
//     const endTime = dayjs(attendance.endTime, "HH:mm:ss");
//     const totalHours = endTime.diff(startTime, 'hour');
//     const totalMinutes = endTime.diff(startTime, 'minute') % 60;
//     const earlyOutHours = 17 - endTime.hour(); // Assuming 5 PM is the standard end time
//     const earlyOutMinutes = (60 - endTime.minute()) % 60;
  
//     const tooltipContent = (
//       <div>
//         <div>IN - {startTime.format("hh:mm A")}</div>
//         <div>OUT - {endTime.format("hh:mm A")}</div>
//         <div>Total Working Hours: {totalHours}H : {totalMinutes}M</div>
//         <div>Early OUT: {earlyOutHours}H : {earlyOutMinutes}M</div>
//       </div>
//     );
  
//     return (
//       <Tooltip title={tooltipContent}>
//         <Tag color={statusColors[status]} className="m-0">
//           {status}
//         </Tag>
//       </Tooltip>
//     );
//   };
  


//   // const renderAttendanceStatus = (attendance, day) => {
//   //   if (!attendance) return null;
  
//   //   // Check if the attendance record has a date for the specific day
//   //   const isPresent = attendance.date && dayjs(attendance.date).date() === day;
//   //   const status = isPresent ? 'P' : 'A'; // 'P' for present, 'A' for absent
//   //   const statusColors = {
//   //     P: 'green',
//   //     A: 'red',
//   //   };
  
//   //   return (
//   //     <Tag
//   //       color={statusColors[status]}
//   //       className="m-0"
//   //       title={isPresent ? `Start: ${attendance.startTime}, End: ${attendance.endTime}` : ''}
//   //     >
//   //       {status}
//   //     </Tag>
//   //   );
//   // };


//   const tableColumns = [
//     {
//       title: 'Employee Name',
//       dataIndex: 'employee',
//       fixed: 'left',
//       width: 200, 
//     },
//     ...generateDateColumns(),
//   ];

//   // Mock data structure
//   const generateMockData = () => {
//     return list.map((employee) => {
//       const attendanceRecord = {
//         id: employee.id,
//         name: employee.username,
//       };

//       // Generate random attendance status for each day
//       for (let i = 1; i <= dayjs().daysInMonth(); i++) {
//         const statuses = ["P", "A", "L", "WK", "HL"];
//         attendanceRecord[`day${i}`] =
//           statuses[Math.floor(Math.random() * statuses.length)];
//       }

//       return attendanceRecord;
//     });
//   };

//   return (
//     <Card>
//       <div className="mb-4">
//         <h2>Employee Attendance</h2>
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex gap-4">
//             <DatePicker.MonthPicker
//               defaultValue={dayjs()}
//               format="MMM YYYY"
//               onChange={(date) => setSelectedMonth(date.format("MMM YYYY"))}
//             />
//             <Select
//               defaultValue="All Department"
//               style={{ width: 150 }}
//               onChange={(value) => setSelectedDepartment(value)}
//             >
//               <Option value="All Department">All Department</Option>
//               {/* Add department options */}
//             </Select>
//             {/* <Select
//               defaultValue="All Location"
//               style={{ width: 150 }}
//               onChange={(value) => setSelectedLocation(value)}
//             >
//               <Option value="All Location">All Location</Option>
//               {/* Add location options */}
//             {/* </Select> */} 
//             <Select
//               defaultValue="All Employee"
//               style={{ width: 150 }}
//               onChange={(value) => setSelectedEmployee(value)}
//             >
//               <Option value="All Employee">All Employee</Option>
//               {/* Add employee options */}
//             </Select>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={openAddAttendanceModal}
//             >
//               Add Attendance
//             </Button>
//             <Button icon={<FileExcelOutlined />}>Export</Button>
//           </div>
//         </div>
//       </div>
      

//       <Table
//         columns={tableColumns}
//         dataSource={users}
//         scroll={{ x: 2000 }}
//         pagination={false}
//         rowKey="id"
//       />

//       <UserView
//         data={selectedUser}
//         visible={userProfileVisible}
//         close={closeUserProfile}
//       />

//       <Modal
//         title="Add Attendance"
//         visible={isAddAttendanceModalVisible}
//         onCancel={closeAddAttendanceModal}
//         footer={null}
//         width={800}
//       >
//         <AddAttendance onClose={closeAddAttendanceModal} />
//       </Modal>
//     </Card>
//   );
// };

// export default AttendanceList;
