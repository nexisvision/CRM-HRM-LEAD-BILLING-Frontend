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

const { Option } = Select;

const AttendanceList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().format("MMM YYYY")
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Department");
  const [selectedLocation, setSelectedLocation] = useState("All Location");
  const [selectedEmployee, setSelectedEmployee] = useState("All Employee");
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] =
    useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const tabledata = useSelector((state) => state.attendance);

  const fnddat = tabledata.Attendances.data;

  const employeeData = useSelector(
    (state) => state.employee?.employee?.data || []
  );


  // useEffect(() => {
  //   if (fnddat) {
  //     setList(fnddat);
  //   }
  // }, [fnddat]);





  useEffect(() => {
    if (fnddat) {
      const employeeAttendanceMap = {};
  
      fnddat.forEach((attendance) => {
        const employeeName =
          employeeData.find((e) => e.id === attendance.employee)?.username || "N/A";
  
        if (!employeeAttendanceMap[attendance.employee]) {
          employeeAttendanceMap[attendance.employee] = {
            employee: employeeName,
            id: attendance.employee,
            attendanceByDay: {},
          };
        }
  
        const day = dayjs(attendance.date).date();
        employeeAttendanceMap[attendance.employee].attendanceByDay[day] = {
          status: 'P',
          startTime: attendance.startTime,
          endTime: attendance.endTime,
        };
      });
  
      const aggregatedData = Object.values(employeeAttendanceMap);
      setUsers(aggregatedData);
      console.log(aggregatedData, "users");
    }
  }, [fnddat, employeeData]);




  // useEffect(() => {
  //   if (fnddat) {
  //     const mappedData = fnddat.map((attendance) => {
  //       const employeeName =
  //         employeeData.find((e) => e.id === attendance.employee)?.username || "N/A";
  
  //       return {
  //         ...attendance,
  //         employee: employeeName, // Replace 'employee' with the employee's name
  //       };
  //     });
  //     setUsers(mappedData);
  //     console.log(mappedData, "users");
  //   }
  // }, [fnddat, employeeData]);


  useEffect(() => {
    dispatch(getAttendances());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  // useEffect(() => {
  //   if (tabledata?.Attendances?.data) {
  //     const mappedData = tabledata.Attendances.data.map((attendance) => {
  //       const employee =
  //         employeeData.find((e) => e.id === mappedData.employee)?.username ||
  //         "N/A";

  //       return {
  //         ...attendance,
  //         employee,
  //       };
  //     });
  //     setUsers(mappedData);
  //     console.log(mappedData, "users");
  //   }
  // }, [tabledata]);






  // Open Add Attendance Modal
  const openAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(true);
  };

  // Close Add Attendance Modal
  const closeAddAttendanceModal = () => {
    setIsAddAttendanceModalVisible(false);
  };

  // Handle Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const filteredList = value ? utils.wildCardSearch(list, value) : tabledata;
    setList(filteredList);
    setSelectedRowKeys([]);
  };

  // Handle Date Range Filtering
  const onDateChange = (dates) => {
    setStartDate(dates ? dates[0] : null); // Set the start date
    setEndDate(dates ? dates[1] : null); // Set the end date
  };

  // Filter based on Date Range
  const filterByDate = (data) => {
    if (startDate && endDate) {
      return data.filter((item) => {
        const itemDate = dayjs(item.intime);
        return itemDate.isBetween(startDate, endDate, "day", "[]"); // inclusive
      });
    }
    return data; // Return original data if no date range is selected
  };

  // Show User Profile
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  // Close User Profile
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

  // Dropdown Menu
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
    </Menu>
  );

  // Calendar header with dates
  // const generateDateColumns = () => {
  //   const daysInMonth = dayjs().daysInMonth();
  //   const columns = [];

  //   for (let i = 1; i <= daysInMonth; i++) {
  //     const date = dayjs().date(i);
  //     columns.push({
  //       title: (
  //         <div className="text-center">
  //           <div>{i}</div>
  //           <div>{date.format('ddd')}</div>
  //         </div>
  //       ),
  //       dataIndex: `day${i}`,
  //       width: 60,
  //       align: 'center',
  //       render: (status) => renderAttendanceStatus(status),
  //     });
  //   }
  //   return columns;
  // };





  const generateDateColumns = () => {
    const daysInMonth = dayjs().daysInMonth();
    const columns = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      columns.push({
        title: (
          <div className="text-center">
            <div>{i}</div>
            <div>{dayjs().date(i).format('ddd')}</div>
          </div>
        ),
        dataIndex: 'attendanceByDay',
        width: 60,
        align: 'center',
        render: (attendanceByDay) => renderAttendanceStatus(attendanceByDay, i),
      });
    }
    return columns;
  };




  // const renderAttendanceStatus = (status) => {
  //   if (!status) return null;

  //   const statusColors = {
  //     P: 'green',
  //     A: 'red',
  //     L: 'orange',
  //     WK: 'blue',
  //     HL: 'purple'
  //   };

  //   return (
  //     <Tag color={statusColors[status]} className="m-0">
  //       {status}
  //     </Tag>
  //   );
  // };




  const renderAttendanceStatus = (attendanceByDay, day) => {
    if (!attendanceByDay) return null;
  
    const attendance = attendanceByDay[day];
    const status = attendance ? 'P' : 'A'; // 'P' for present, 'A' for absent
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
    const earlyOutHours = 17 - endTime.hour(); // Assuming 5 PM is the standard end time
    const earlyOutMinutes = (60 - endTime.minute()) % 60;
  
    const tooltipContent = (
      <div>
        <div>IN - {startTime.format("hh:mm A")}</div>
        <div>OUT - {endTime.format("hh:mm A")}</div>
        <div>Total Working Hours: {totalHours}H : {totalMinutes}M</div>
        <div>Early OUT: {earlyOutHours}H : {earlyOutMinutes}M</div>
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
  


  // const renderAttendanceStatus = (attendance, day) => {
  //   if (!attendance) return null;
  
  //   // Check if the attendance record has a date for the specific day
  //   const isPresent = attendance.date && dayjs(attendance.date).date() === day;
  //   const status = isPresent ? 'P' : 'A'; // 'P' for present, 'A' for absent
  //   const statusColors = {
  //     P: 'green',
  //     A: 'red',
  //   };
  
  //   return (
  //     <Tag
  //       color={statusColors[status]}
  //       className="m-0"
  //       title={isPresent ? `Start: ${attendance.startTime}, End: ${attendance.endTime}` : ''}
  //     >
  //       {status}
  //     </Tag>
  //   );
  // };


  const tableColumns = [
    {
      title: 'Employee Name',
      dataIndex: 'employee',
      fixed: 'left',
      width: 200, 
    },
    ...generateDateColumns(),
  ];

  // Mock data structure
  const generateMockData = () => {
    return list.map((employee) => {
      const attendanceRecord = {
        id: employee.id,
        name: employee.username,
      };

      // Generate random attendance status for each day
      for (let i = 1; i <= dayjs().daysInMonth(); i++) {
        const statuses = ["P", "A", "L", "WK", "HL"];
        attendanceRecord[`day${i}`] =
          statuses[Math.floor(Math.random() * statuses.length)];
      }

      return attendanceRecord;
    });
  };

  return (
    <Card>
      <div className="mb-4">
        <h2>Employee Attendance</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <DatePicker.MonthPicker
              defaultValue={dayjs()}
              format="MMM YYYY"
              onChange={(date) => setSelectedMonth(date.format("MMM YYYY"))}
            />
            <Select
              defaultValue="All Department"
              style={{ width: 150 }}
              onChange={(value) => setSelectedDepartment(value)}
            >
              <Option value="All Department">All Department</Option>
              {/* Add department options */}
            </Select>
            {/* <Select
              defaultValue="All Location"
              style={{ width: 150 }}
              onChange={(value) => setSelectedLocation(value)}
            >
              <Option value="All Location">All Location</Option>
              {/* Add location options */}
            {/* </Select> */} 
            <Select
              defaultValue="All Employee"
              style={{ width: 150 }}
              onChange={(value) => setSelectedEmployee(value)}
            >
              <Option value="All Employee">All Employee</Option>
              {/* Add employee options */}
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAddAttendanceModal}
            >
              Add Attendance
            </Button>
            <Button icon={<FileExcelOutlined />}>Export</Button>
          </div>
        </div>
      </div>
      

      <Table
        columns={tableColumns}
        dataSource={users}
        scroll={{ x: 2000 }}
        pagination={false}
        rowKey="id"
      />

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
