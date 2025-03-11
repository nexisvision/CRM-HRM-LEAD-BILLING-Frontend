import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  message,
  Button,
  Modal,
  DatePicker,
  Tooltip
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import UserView from "../../Users/user-list/UserView";
import AddAttendance from "./AddAttendance";
import {
  getAttendances,
} from "./AttendanceReducer/AttendanceSlice";
import { useSelector, useDispatch } from "react-redux";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { GetLeave } from "../Leaves/LeaveReducer/LeaveSlice";
import { getsholidayss } from "../holiday/AttendanceReducer/holidaySlice";

// Extend dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);


const AttendanceList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddAttendanceModalVisible, setIsAddAttendanceModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.attendance);
  const fnddat = React.useMemo(() => tabledata.Attendances.data || [], [tabledata.Attendances.data]);
  const employeeData = useSelector((state) => state.employee?.employee?.data || []);
  const leaveData = useSelector((state) => state.Leave?.Leave?.data || []);
  const fndleavedata = leaveData.filter((item) => item.created_by === user);


  useEffect(() => {
    if (employeeData) {
      const employeeAttendanceMap = employeeData.reduce((acc, employee) => {
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
        if (date.day() !== 0) {
          totalWorkingDays++;
        }
      }


      if (fnddat) {
        fnddat.forEach((attendance) => {
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

      if (JSON.stringify(users) !== JSON.stringify(aggregatedData)) {
        setUsers(aggregatedData);
      }
    }
  }, [fnddat, employeeData, fndleavedata, selectedMonth, users]);



  useEffect(() => {
    dispatch(getAttendances());
    dispatch(getsholidayss());

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
                                    
                                    } else {

                                    }
                                    
                                    const canCreateClient = allpermisson?.includes('create');
                                    const canEditClient = allpermisson?.includes('edit');
                                    const canDeleteClient = allpermisson?.includes('delete');
                                    const canViewClient = allpermisson?.includes('view');
                                 

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };


  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };




  // Add this function to check if a date is a holiday
  const isHoliday = (date) => {
    if (!allholidaudata) return null;
    
    try {
      return allholidaudata.find(holiday => {
        if (!holiday.start_date || !holiday.end_date) return false;
        
        const startDate = dayjs(holiday.start_date);
        const endDate = dayjs(holiday.end_date);
        const checkDate = dayjs(date);

        // Check if all dates are valid dayjs objects
        if (!startDate.isValid() || !endDate.isValid() || !checkDate.isValid()) {
          console.log('Invalid date detected:', { 
            start: holiday.start_date, 
            end: holiday.end_date, 
            check: date.format('YYYY-MM-DD') 
          });
          return false;
        }

        // Check if the date falls within the holiday period
        return (checkDate.isAfter(startDate, 'day') || checkDate.isSame(startDate, 'day')) && 
               (checkDate.isBefore(endDate, 'day') || checkDate.isSame(endDate, 'day'));
      });
    } catch (error) {
      console.error('Error in isHoliday:', error);
      return null;
    }
  };

  const generateDateColumns = () => {
    const daysInMonth = selectedMonth.daysInMonth();
    const columns = [];

    for (let i = 1; i <= daysInMonth; i++) {
      try {
        const currentDate = dayjs(selectedMonth).set('date', i);
        const isSunday = currentDate.day() === 0;
        const holiday = isHoliday(currentDate);
        
        columns.push({
          title: (
            <div className="text-center">
              <div>{i}</div>
              <div>{currentDate.format('ddd')}</div>
            </div>
          ),
          dataIndex: 'attendanceByDay',
          width: 60,
          align: 'center',
          render: (attendanceByDay) => {
            // First check if it's a holiday
            if (holiday) {
              return (
                <Tooltip title={`Holiday: ${holiday.holiday_name} (${holiday.leave_type})`}>
                  <Tag color={holiday.leave_type === 'paid' ? 'purple' : 'magenta'} className="m-0">
                    H
                  </Tag>
                </Tooltip>
              );
            }
            
            // Then check if it's Sunday
            if (isSunday) return 'WK';
            
            // Then check attendance
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
      } catch (error) {
        console.error('Error in generateDateColumns:', error);
      }
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
          <>
            <div className="mb-4 flex flex-wrap gap-3">
              <Tag color="green">P - Present</Tag>
              <Tag color="red">A - Absent</Tag>
              <Tag color="orange">L - Leave</Tag>
              <Tag color="purple">H - Paid Holiday</Tag>
              <Tag color="magenta">H - Unpaid Holiday</Tag>
              <Tag>WK - Weekend</Tag>
            </div>
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
          </>
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

  .ant-tag {
    margin: 0;
    min-width: 28px;
    text-align: center;
  }

  .legend-container {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const AttendanceListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AttendanceList />
  </>
);

export default AttendanceListWithStyles;
