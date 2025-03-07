import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from "components/shared-components/StatisticWidget";
import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Modal,
  Tag,
  message,
  DatePicker,
} from "antd";
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from "react-number-format";
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PushpinOutlined,
  PlusCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import { useNavigate, useParams } from "react-router-dom";
// import NumberFormat from 'react-number-format';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils, writeFile } from "xlsx";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import TaskView from "./TaskView";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTasks, GetTasks } from "./TaskReducer/TaskSlice";
import { AnnualStatisticData } from "../../default/DefaultDashboardData";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Column } = Table;

const { Option } = Select;

const getPaymentStatus = (status) => {
  if (status === "Paid") {
    return "success";
  }
  if (status === "Pending") {
    return "warning";
  }
  if (status === "Expired") {
    return "error";
  }
  return "";
};

const getShippingStatus = (status) => {
  if (status === "Ready") {
    return "blue";
  }
  if (status === "Shipped") {
    return "cyan";
  }
  return "";
};

const paymentStatusList = ["Paid", "Pending", "Expired"];

export const TaskList = () => {
  const [list, setList] = useState([]);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [idd, setIdd] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = useParams();

  const alldatatask = useSelector((state) => state.Tasks);
  const fnddata = alldatatask.Tasks.data;
  const employees = useSelector((state) => state.Users?.Users?.data || []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchText, setSearchText] = useState('');
  // const [statusFilter, setStatusFilter] = useState('all');

  // Add these new state variables if not already present
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add new state for date range
  const [dateRange, setDateRange] = useState(null);

  // Open Add Job Modal
  const openAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
  };

  // Open Add Job Modal
  const openEditTaskModal = () => {
    setIsEditTaskModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditTaskModal = () => {
    setIsEditTaskModalVisible(false);
  };

  // Open Add Job Modal
  const openViewTaskModal = () => {
    navigate("/app/dashboards/project/task/TaskView", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };
  // Close Add Job Modal
  const closeViewTaskModal = () => {
    setIsViewTaskModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(list); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Task"); // Append the sheet to the workbook

      writeFile(wb, "TaskData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  // Modify the existing useEffect to handle initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await dispatch(GetUsers());
        await dispatch(GetTasks(id));
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load data');
      }
      setLoading(false);
    };

    loadInitialData();
  }, [dispatch, id]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  useEffect(() => {
    if (fnddata && employees?.length > 0) {
      try {
        const formattedTasks = fnddata.map(task => {
          let assignToNames = 'Not Assigned';
          try {
            let assignToIds = [];
            
            // Handle different possible formats of assignTo data
            if (typeof task.assignTo === 'string') {
              try {
                const parsed = JSON.parse(task.assignTo);
                assignToIds = Array.isArray(parsed) ? parsed : [parsed];
              } catch {
                assignToIds = [task.assignTo];
              }
            } else if (Array.isArray(task.assignTo)) {
              assignToIds = task.assignTo;
            } else if (task.assignTo) {
              assignToIds = [task.assignTo];
            }

            if (assignToIds.length > 0) {
              const employeeNames = assignToIds
                .map(empId => {
                  const employee = employees.find(emp => emp.id === empId);
                  return employee?.firstName || 'Unknown';
                })
                .filter(name => name); // Remove any undefined/null values
              
              assignToNames = employeeNames.length > 0 ? employeeNames.join(', ') : 'Not Assigned';
            }
          } catch (error) {
            console.error('Error processing assignTo:', error);
          }

          return {
            ...task,
            assignToName: assignToNames
          };
        });
        setList(formattedTasks);
      } catch (error) {
        console.error('Error formatting tasks:', error);
      }
    }
  }, [fnddata, employees]);

  useEffect(() => {
    const storedPinnedTasks = JSON.parse(localStorage.getItem("pinnedTasks")) || [];
    setPinnedTasks(storedPinnedTasks);
  }, []);

  const DeleteFun = async (idd) => {
    try {
      const response = await dispatch(DeleteTasks(idd));
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(GetTasks(id));
      setList(list.filter((item) => item.id !== idd));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };

  const EditTaskfun = (idd) => {
    openEditTaskModal();
    setIdd(idd);
  };


  const togglePinTask = (taskId) => {
    setPinnedTasks((prevPinned) => {
      const newPinned = prevPinned.includes(taskId)
        ? prevPinned.filter((id) => id !== taskId) // Unpin the task
        : [...prevPinned, taskId]; // Pin the task

      // Save the updated pinned tasks to local storage
      localStorage.setItem("pinnedTasks", JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const dropdownMenu = (row) => (
    <Menu>

{/* <Menu.Item>
        <Flex alignItems="center" onClick={() => togglePinTask(row.id)}>
          {pinnedTasks.includes(row.id) ? (
            <PushpinOutlined style={{ color: "gold" }} />
          ) : (
            <PushpinOutlined />
          )}
          <span className="ml-2">{pinnedTasks.includes(row.id) ? "Unpin" : "Pin"}</span>
        </Flex>
      </Menu.Item> */}
      {/* <Menu.Item>
        <Flex alignItems="center" onClick={openViewTaskModal}>
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item> */}
     

      <Menu.Item>
        <Flex alignItems="center" onClick={() => EditTaskfun(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
    
      <Menu.Item>
        <Flex alignItems="center" onClick={() => DeleteFun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "Code",
    //   dataIndex: "id",
    // },
    // {
    //   title: "Pinned",
    //   dataIndex: "pinned",
    //   render: (text, record) => (
    //     <span>
    //       {pinnedTasks.includes(record.id) ? (
    //         <PushpinOutlined style={{ color: "gold" }} />
    //       ) : (
    //         <PushpinOutlined />
    //       )}
    //     </span>
    //   ),
    // },
    {
      title: "Task",
      dataIndex: "taskName",
      sorter: {
        compare: (a, b) => a.task.length - b.task.length,
      },
    },
    // {
    //   title: "Completed On",
    //   dataIndex: "taskDate",
    //   sorter: {
    //     compare: (a, b) => a.completedon.length - b.completedon.length,
    //   },
    // },
    {
      title: "Priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.milestone.length - b.milestone.length,
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "End Date",
      dataIndex: "dueDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    // {
    //   title: "Estimated Time",
    //   dataIndex: "estimatedtime",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "estimatedtime"),
    // },
    // {
    //   title: "projectName ",
    //   dataIndex: "projectName",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "hourslogged"),
    // },
    {
      title: "Assigned To",
      dataIndex: "assignTo",
      render: (_, record) => (
        <span>
          {record.assignToName || 'Not Assigned'}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = a.assignToName || '';
        const nameB = b.assignToName || '';
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getPaymentStatus(record.status)}>
            {record.status}
          </Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
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

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    handleFilters(dates); // Pass the dates directly to handleFilters
  };

  // Get unique priorities from task data
  const getUniquePriorities = () => {
    if (!fnddata) return [];
    
    // Get all unique priorities from the data
    const priorities = [...new Set(fnddata.map(item => item.priority))];
    
    // Create priority options array with 'All Priority' as first option
    return [
      { value: 'all', label: 'All Priority' },
      ...priorities.map(priority => ({
        value: priority,
        label: priority
      }))
    ];
  };

  // Get priority options
  const priorityOptions = getUniquePriorities();

  // Handle priority change
  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
  };

  // Update the filter function to handle priority
  const handleFilters = async (dates = dateRange) => {
    setLoading(true);
    try {
      let filtered = [...fnddata];

      // Apply search text filter
      if (searchText) {
        filtered = filtered.filter(item => 
          item.taskName?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.assignToName?.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Apply status filter
      if (selectedStatus && selectedStatus !== 'all') {
        filtered = filtered.filter(item => item.status === selectedStatus);
      }

      // Apply priority filter
      if (selectedPriority && selectedPriority !== 'all') {
        filtered = filtered.filter(item => item.priority === selectedPriority);
      }

      // Apply date range filter
      if (dates && dates[0] && dates[1]) {
        const startRange = dayjs(dates[0]).startOf('day');
        const endRange = dayjs(dates[1]).endOf('day');
        
        filtered = filtered.filter(task => {
          const taskStartDate = dayjs(task.startDate);
          const taskEndDate = dayjs(task.dueDate);
          
          return taskStartDate.isSame(startRange, 'day') || 
                 taskEndDate.isSame(endRange, 'day') || 
                 (taskStartDate.isAfter(startRange) && taskStartDate.isBefore(endRange)) ||
                 (taskEndDate.isAfter(startRange) && taskEndDate.isBefore(endRange));
        });
      }

      setFilteredData(filtered);
      setList(filtered);
    } catch (error) {
      console.error('Error filtering data:', error);
      message.error('Failed to filter data');
    }
    setLoading(false);
  };

  // Update useEffect to include selectedPriority
  useEffect(() => {
    if (fnddata) {
      handleFilters();
    }
  }, [searchText, selectedStatus, selectedPriority, fnddata]);

  // Update the getFilteredTasks function
  const getFilteredTasks = () => {
    return filteredData;
  };

  // Replace your existing onSearch with this
  const onSearch = (e) => {
    setSearchText(e.currentTarget.value);
  };

  // Add this handler for status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  // Get unique statuses from task data
  const getUniqueStatuses = () => {
    if (!fnddata) return [];
    
    // Get all unique statuses from the data
    const statuses = [...new Set(fnddata.map(item => item.status))];
    
    // Create status options array with 'All Status' as first option
    return [
      { value: 'all', label: 'All Status' },
      ...statuses.map(status => ({
        value: status,
        label: status
      }))
    ];
  };

  // Get status options
  const statusOptions = getUniqueStatuses();

  // Handle status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <div className="container">
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mt-[30px] md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search by task name..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mr-0 md:mr-3 mt-7 md:mb-0 w-full md:w-40">
              <Select
                placeholder="Filter by status"
                onChange={handleStatusChange}
                value={selectedStatus}
                style={{ width: '100%' }}
                className="status-select"
              >
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mr-0 md:mr-3 mt-7 md:mb-0 w-full md:w-40">
              <Select
                placeholder="Filter by priority"
                onChange={handlePriorityChange}
                value={selectedPriority}
                style={{ width: '100%' }}
                className="priority-select"
              >
                {priorityOptions.map(priority => (
                  <Option key={priority.value} value={priority.value}>
                    {priority.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mr-0 md:mr-3 mt-7 md:mb-0">
              <DatePicker.RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={['Start Date', 'End Date']}
                className="date-range-picker"
                allowClear={true}
                value={dateRange}
              />
            </div>
            {/* <div className="mr-0 md:mr-3 mt-7 md:mb-0">
              <Button 
                type="primary" 
                onClick={handleFilters}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </div> */}
          </Flex>
          <Flex gap="7px" className="flex">
            <Button
              type="primary"
              className="flex items-center"
              onClick={openAddTaskModal}
            >
              <PlusOutlined />
              <span className="ml-2">New</span>
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
              block
            >
              Export All
            </Button>
          </Flex>
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1600 }}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: "checkbox",
              preserveSelectedRowKeys: false,
              ...rowSelection,
            }}
          />
        </div>

        <Modal
          title="Task Create"
          visible={isAddTaskModalVisible}
          onCancel={closeAddTaskModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddTask onClose={closeAddTaskModal} />
        </Modal>
        <Modal
          title="Edit Task"
          visible={isEditTaskModalVisible}
          onCancel={closeEditTaskModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditTask onClose={closeEditTaskModal} idd={idd} />
        </Modal>
        <Modal
          title="Task Details"
          visible={isViewTaskModalVisible}
          onCancel={closeViewTaskModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <TaskView onClose={closeViewTaskModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default TaskList;
