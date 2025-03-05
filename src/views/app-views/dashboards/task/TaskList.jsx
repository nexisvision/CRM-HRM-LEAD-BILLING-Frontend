/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Row,
  Col,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  message,
  Space,
  DatePicker,
} from "antd";
// import OrderListData from "../../../../assets/data/order-list.data.json";
// import OrderListData from "assets/data/order-list.data.json"
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import StatisticWidget from "components/shared-components/StatisticWidget";
// import {
// 	AnnualStatisticData,
// } from '../../../dashboards/default/DefaultDashboardData';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils, writeFile } from "xlsx";
import ViewTask from "./ViewTask";
import { useNavigate } from "react-router-dom";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import { useSelector, useDispatch } from "react-redux";
import { DeleteTasks, GetTasks, EditTaskss } from "../project/task/TaskReducer/TaskSlice";
import { debounce } from 'lodash';
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

const getOrderStatus = (status) => {
  if (status === "Normal") {
    return "success";
  }
  if (status === "Shipped") {
    return "warning";
  }
  return "";
};

const orderStatusList = ["Normal", "Expired"];

const stripHtmlTags = (html) => {
  if (!html) return '';
  // First, decode any HTML entities
  const decoded = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  // Create a temporary element
  const temp = document.createElement('div');
  // Set the HTML content
  temp.innerHTML = decoded;
  // Get the text content
  return temp.textContent || temp.innerText || '';
};

const TaskList = () => {
  // const [annualStatisticData] = useState(AnnualStatisticData);

  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const dispatch = useDispatch();
  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const fndassine = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [idd, setIdd] = useState("");

  const allloggeddata = useSelector((state) => state.user);
  const fndlogged = allloggeddata.loggedInUser;

  const id = fndlogged.id;

  const alldatas = useSelector((state) => state.Tasks);
  const fnddata = alldatas.Tasks.data;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetTasks(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  useEffect(() => {
    // Load pinned tasks from local storage on component mount
    const storedPinnedTasks = JSON.parse(localStorage.getItem("pinnedTasks")) || [];
    setPinnedTasks(storedPinnedTasks);
  }, []);

  //// permission

  const whorole = userRole?.role_name;

  const parsedPermissions = Array.isArray(userRole?.permissions)
    ? userRole.permissions
    : typeof userRole?.permissions === 'string'
      ? JSON.parse(userRole.permissions)
      : [];


  let allpermisson;

  if (parsedPermissions["dashboards-Task"] && parsedPermissions["dashboards-Task"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-Task"][0].permissions;
    // console.log('Parsed Permissions:', allpermisson);

  } else {
    // console.log('dashboards-Task is not available');
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission



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

  const openviewTaskModal = () => {
    navigate("/app/dashboards/project/task/viewtask");
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      dispatch(GetTasks(id));
    }
  };

  const deleytfun = (userId) => {
    dispatch(DeleteTasks(userId)).then(() => {
      dispatch(GetTasks(id));
      setList(list.filter((itme) => itme.id !== userId));
    });
  };

  const editfubn = (taskId) => {
    const taskToEdit = list.find(task => task.id === taskId);
    if (taskToEdit) {
      setIdd(taskId);
      openEditTaskModal();
    } else {
      message.error("Task not found");
    }
  };

  const togglePinTask = (taskId) => {
    setPinnedTasks((prevPinned) => {
      const newPinned = prevPinned.includes(taskId)
        ? prevPinned.filter((id) => id !== taskId)
        : [...prevPinned, taskId];
      localStorage.setItem("pinnedTasks", JSON.stringify(newPinned));
      return newPinned;
    });
    message.success(
      pinnedTasks.includes(taskId) ? "Task unpinned successfully" : "Task pinned successfully"
    );
  };

  // Filter tasks based on pinned status
  const getPinnedTasks = () => list.filter((task) => pinnedTasks.includes(task.id));
  const getUnpinnedTasks = () => list.filter((task) => !pinnedTasks.includes(task.id));

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => togglePinTask(row.id)}>
          <PushpinOutlined style={{ color: pinnedTasks.includes(row.id) ? "#1890ff" : undefined }} />
          <span className="ml-2">{pinnedTasks.includes(row.id) ? "Unpin" : "Pin"}</span>
        </Flex>
      </Menu.Item>
      {/* <Menu.Item>
        <Flex alignItems="center" onClick={openviewTaskModal}>
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item> */}
      {/* <Menu.Item>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add to remark</span>
        </Flex>
      </Menu.Item> */}

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center" onClick={() => editfubn(row.id)}>
            <EditOutlined />
            <span className="ml-2">Edit</span>
          </Flex>
        </Menu.Item>
      ) : null}


      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center" onClick={() => deleytfun(row.id)}>
            <DeleteOutlined />
            <span className="ml-2">Delete</span>
          </Flex>
        </Menu.Item>
      ) : null}

    </Menu>
  );

  const tableColumns = [
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          icon={<PushpinOutlined style={{
            color: pinnedTasks.includes(record.id) ? "#1890ff" : "#999",
            transform: pinnedTasks.includes(record.id) ? "rotate(-45deg)" : "none",
            transition: "all 0.3s"
          }} />}
          onClick={() => togglePinTask(record.id)}
          className="pin-button"
        />
      ),
      fixed: 'left'
    },
    {
      title: "Title",
      dataIndex: "taskName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record.taskName
          ? record.taskName.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.taskName.length - b.taskName.length,
    },
    {
      title: "Assigned To",
      dataIndex: "assignTo",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            mode="multiple"
            style={{ width: 200, marginBottom: 8 }}
            placeholder="Select users"
            value={selectedKeys}
            onChange={values => setSelectedKeys(values)}
            allowClear
          >
            {fndassine.map(user => (
              <Option key={user.id} value={user.id}>
                {user.firstName || user.username || "Unnamed User"}
              </Option>
            ))}
          </Select>
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => {
        try {
          const assignees = Array.isArray(record.assignTo)
            ? record.assignTo
            : typeof record.assignTo === 'string'
              ? JSON.parse(record.assignTo)
              : [record.assignTo];
          return assignees.includes(value);
        } catch (error) {
          return false;
        }
      },
      render: (assignTo) => {
        try {
          let assignees = [];
          if (typeof assignTo === 'string') {
            assignees = JSON.parse(assignTo);
          } else if (Array.isArray(assignTo)) {
            assignees = assignTo;
          } else if (assignTo) {
            assignees = [assignTo];
          }

          return (
            <div className="assignee-tags">
              {assignees.map(userId => {
                const user = fndassine.find(u => u.id === userId);
                return user ? (
                  <Tag
                    key={userId}
                    className="mb-1"
                    color="blue"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      marginRight: '4px'
                    }}
                  >
                    {user.firstName || user.username || "Unnamed User"}
                  </Tag>
                ) : null;
              })}
            </div>
          );
        } catch (error) {
          return <Tag color="red">No Assignees</Tag>;
        }
      }
    },
    {
      title: "Task Reporter",
      dataIndex: "task_reporter",
      render: (reporterId, record) => {
        const reporter = fndassine.find(user => user.id === reporterId);
        return reporter ? (reporter.firstName || reporter.username || "Unnamed Client") : "Not Assigned";
      },
      sorter: (a, b) => {
        const reporterA = fndassine.find(user => user.id === a.task_reporter);
        const reporterB = fndassine.find(user => user.id === b.task_reporter);
        return (reporterA?.firstName || reporterA?.username || "").localeCompare(reporterB?.firstName || reporterB?.username || "");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          disabled={!(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client"))}
        >
          <Option value="Incomplete">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              Incomplete
            </div>
          </Option>
          <Option value="To Do">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              To Do
            </div>
          </Option>
          <Option value="In Progress">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
              In Progress
            </div>
          </Option>
          <Option value="Completed">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Completed
            </div>
          </Option>
          <Option value="On Hold">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
              Waiting Approval
            </div>
          </Option>
        </Select>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (_, record) => (
        <Select
          value={record.priority}
          style={{ width: 120 }}
          onChange={(value) => handlePriorityChange(record.id, value)}
          disabled={!(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client"))}
        >
          <Option value="High">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
              High
            </div>
          </Option>
          <Option value="Medium">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
              Medium
            </div>
          </Option>
          <Option value="Low">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Low
            </div>
          </Option>
        </Select>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "priority"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "N/A"),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "N/A"),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Files",
      dataIndex: "task_file",
      render: (file) => {
        if (!file) return "No files";
        return (
          <a href={file} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (createdBy, record) => {
        if (typeof createdBy === 'string' && !createdBy.match(/^[0-9a-fA-F-]+$/)) {
          return createdBy;
        }
        const creator = fndassine.find(user => user.id === createdBy);
        return creator ? (creator.firstName || creator.username || "Unnamed User") : createdBy || "Unknown";
      },
      sorter: (a, b) => {
        const nameA = typeof a.created_by === 'string' ? a.created_by : "";
        const nameB = typeof b.created_by === 'string' ? b.created_by : "";
        return nameA.localeCompare(nameB);
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

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  // Modified debounced search function to use date range
  const debouncedSearch = debounce((value, dates, data, setList) => {
    setIsSearching(true);

    const searchValue = value.toLowerCase();

    if (!fnddata) {
      setList([]);
      setIsSearching(false);
      return;
    }

    const filteredData = fnddata.filter(task => {
      // Text search filter for multiple fields
      const matchesSearch = !searchValue || (
        task.taskName?.toString().toLowerCase().includes(searchValue) ||
        stripHtmlTags(task.description)?.toLowerCase().includes(searchValue) ||
        task.priority?.toString().toLowerCase().includes(searchValue) ||
        task.status?.toString().toLowerCase().includes(searchValue) ||
        // Search in assignees
        (task.assignTo && (() => {
          try {
            const assignees = Array.isArray(task.assignTo)
              ? task.assignTo
              : typeof task.assignTo === 'string'
                ? JSON.parse(task.assignTo)
                : [task.assignTo];

            return assignees.some(userId => {
              const user = fndassine.find(u => u.id === userId);
              return user && (
                (user.firstName || '').toLowerCase().includes(searchValue) ||
                (user.username || '').toLowerCase().includes(searchValue)
              );
            });
          } catch (error) {
            return false;
          }
        })())
      );

      // Date range filter with proper validation
      let matchesDateRange = true;
      if (dates && dates[0] && dates[1]) {
        const taskStartDate = task.startDate ? dayjs(task.startDate) : null;
        const taskDueDate = task.dueDate ? dayjs(task.dueDate) : null;
        const rangeStart = dayjs(dates[0]).startOf('day');
        const rangeEnd = dayjs(dates[1]).endOf('day');

        matchesDateRange = (!taskStartDate || taskStartDate.isAfter(rangeStart) || taskStartDate.isSame(rangeStart)) &&
          (!taskDueDate || taskDueDate.isBefore(rangeEnd) || taskDueDate.isSame(rangeEnd));
      }

      return matchesSearch && matchesDateRange;
    });

    setList(filteredData);
    setIsSearching(false);
  }, 300);

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, dateRange, fnddata, setList);
  };

  // Add date range change handler
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    debouncedSearch(searchValue, dates, fnddata, setList);
  };

  // const exportToExcel = () => {
  //   const ws = utils.json_to_sheet(list); // Convert the list to a worksheet
  //   const wb = utils.book_new(); // Create a new workbook
  //   utils.book_append_sheet(wb, ws, "Tasks"); // Append the worksheet to the workbook
  //   utils.writeFile(wb, "Tasks.xlsx"); // Write the workbook to a file
  // };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(list);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Tasks");
    writeFile(wb, "TaskData.xlsx");
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = list.find(task => task.id === taskId);
      if (!taskToUpdate) {
        message.error("Task not found");
        return;
      }

      const values = {
        ...taskToUpdate,
        status: newStatus,
        startDate: taskToUpdate.startDate ? dayjs(taskToUpdate.startDate).toISOString() : null,
        dueDate: taskToUpdate.dueDate ? dayjs(taskToUpdate.dueDate).toISOString() : null,
        assignTo: Array.isArray(taskToUpdate.assignTo) ? taskToUpdate.assignTo : [taskToUpdate.assignTo],
      };

      await dispatch(EditTaskss({ idd: taskId, values }));
      message.success("Status updated successfully");
      dispatch(GetTasks(id)); // Refresh the task list
    } catch (error) {
      console.error("Error updating task status:", error);
      message.error("Failed to update status");
    }
  };

  const handlePriorityChange = async (taskId, newPriority) => {
    try {
      const taskToUpdate = list.find(task => task.id === taskId);
      if (!taskToUpdate) {
        message.error("Task not found");
        return;
      }

      const values = {
        ...taskToUpdate,
        priority: newPriority,
        startDate: taskToUpdate.startDate ? dayjs(taskToUpdate.startDate).toISOString() : null,
        dueDate: taskToUpdate.dueDate ? dayjs(taskToUpdate.dueDate).toISOString() : null,
        assignTo: Array.isArray(taskToUpdate.assignTo) ? taskToUpdate.assignTo : [taskToUpdate.assignTo],
      };

      await dispatch(EditTaskss({ idd: taskId, values }));
      message.success("Priority updated successfully");
      dispatch(GetTasks(id)); // Refresh the task list
    } catch (error) {
      console.error("Error updating task priority:", error);
      message.error("Failed to update priority");
    }
  };

  // Add row className function
  const getRowClassName = (record) => {
    return pinnedTasks.includes(record.id) ? 'pinned-row' : '';
  };

  return (
    <>
      <Card>
        {/* <Row gutter={16}>
					{
						annualStatisticData.map((elm, i) => (
							<Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>

								<StatisticWidget
									title={elm.title}
									value={elm.value}
									status={elm.status}
									subtitle={elm.subtitle}
								/>
							</Col>
						))
					}
				</Row> */}
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
            <div className="mr-0 md:mr-3 mb-3 md:mb-0" style={{ display: 'flex', gap: '8px' }}>
              <Input
                placeholder="Search by task title..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchValue}
                style={{ width: '250px' }}
                loading={isSearching}
              />
              <RangePicker
                onChange={handleDateRangeChange}
                value={dateRange}
                format="DD-MM-YYYY"
                placeholder={['Start Date', 'Due Date']}
                allowClear
                style={{ width: '280px' }}
              />
              <Button
                type={showPinnedOnly ? "primary" : "default"}
                icon={<PushpinOutlined />}
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              >
                {showPinnedOnly ? "Show All" : "Show Pinned"}
              </Button>
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">All Status</Option>
                {orderStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">


            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
              <Button
                type="primary"
                className="flex items-center"
                onClick={openAddTaskModal}
              >
                <PlusOutlined />
                <span className="ml-2">New</span>
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

        {/* Main Tasks Table */}
        <div className="table-responsive">
          {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
            <Table
              columns={tableColumns}
              dataSource={showPinnedOnly ? getPinnedTasks() : [...list].sort((a, b) => {
                // Sort by pinned status first
                const isPinnedA = pinnedTasks.includes(a.id) ? 1 : 0;
                const isPinnedB = pinnedTasks.includes(b.id) ? 1 : 0;
                return isPinnedB - isPinnedA;
              })}
              rowKey="id"
              scroll={{ x: 1200 }}
              rowSelection={{
                selectedRowKeys: selectedRowKeys,
                type: "checkbox",
                preserveSelectedRowKeys: false,
                ...rowSelection,
              }}
              rowClassName={getRowClassName}
            />
          )}
        </div>

        <style jsx>{`
          .pinned-row {
            background-color: #fafafa !important;
            border-left: 3px solid #1890ff;
          }
          .pinned-row:hover {
            background-color: #f0f7ff !important;
          }
          .ant-table-row {
            transition: all 0.3s ease;
          }
          .ant-table-row:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
          }
          .pin-button {
            opacity: 0.6;
            transition: all 0.3s;
          }
          .pin-button:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          .ant-table-row:hover .pin-button {
            opacity: 1;
          }
          .assignee-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }
          .ant-tag {
            margin-right: 0;
            margin-bottom: 4px;
          }
        `}</style>
      </Card>


      <Modal
        title="Add Task"
        visible={isAddTaskModalVisible}
        onCancel={closeAddTaskModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <AddTask onClose={closeAddTaskModal} />
      </Modal>

      <Modal
        title="Edit Task"
        visible={isEditTaskModalVisible}
        onCancel={closeEditTaskModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditTask onClose={closeEditTaskModal} idd={idd} />
      </Modal>

      {/* <Modal
					title="Task"
					visible={isViewTaskModalVisible}
					onCancel={closeViewTaskModal}
					footer={null}
					width={1200}
					className='mt-[-70px]'


				>
					<ViewTask onClose={closeViewTaskModal} />
				</Modal> */}

    </>
  );
};

export default TaskList;
