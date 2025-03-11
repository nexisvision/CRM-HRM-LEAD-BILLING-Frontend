import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Modal,
  message,
  Space,
  DatePicker,
  Avatar,
  Tooltip,
  Menu,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  PushpinOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import { utils, writeFile } from "xlsx";
import ViewTask from "./ViewTask";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import { useSelector, useDispatch } from "react-redux";
import { DeleteTasks, GetTasks, EditTaskss } from "../project/task/TaskReducer/TaskSlice";
import { debounce } from 'lodash';
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;


const stripHtmlTags = (html) => {
  if (!html) return '';
  const decoded = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const temp = document.createElement('div');
  temp.innerHTML = decoded;
  return temp.textContent || temp.innerText || '';
};

const UserAvatarGroup = ({ users, maxCount = 3 }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const colors = [
    { bg: '#E3F2FD', text: '#1976D2' },
    { bg: '#F3E5F5', text: '#7B1FA2' },
    { bg: '#E8F5E9', text: '#388E3C' },
    { bg: '#FFF3E0', text: '#F57C00' },
    { bg: '#E1F5FE', text: '#0288D1' },
    { bg: '#FCE4EC', text: '#C2185B' },
  ];

  const displayUsers = users.slice(0, maxCount);
  const remainingCount = users.length - maxCount;

  return (
    <Avatar.Group
      maxCount={maxCount}
      maxStyle={{
        color: '#5A5A5A',
        backgroundColor: '#F5F5F5',
        border: '2px solid #FFFFFF',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '12px',
        fontWeight: '600'
      }}
    >
      {displayUsers.map((user, index) => {
        const name = user.firstName || user.username || "Unnamed";
        const color = colors[index % colors.length];
        return (
          <Tooltip key={user.id} title={name}>
            <Avatar
              style={{
                backgroundColor: color.bg,
                color: color.text,
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {getInitials(name)}
            </Avatar>
          </Tooltip>
        );
      })}
      {remainingCount > 0 && (
        <Avatar
          style={{
            backgroundColor: '#F5F5F5',
            color: '#5A5A5A',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          +{remainingCount}
        </Avatar>
      )}
    </Avatar.Group>
  );
};

const TaskList = () => {

  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority] = useState('All');

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
  const [idd, setIdd] = useState("");

  const allloggeddata = useSelector((state) => state.user);
  const fndlogged = allloggeddata.loggedInUser;

  const id = fndlogged.id;

  const alldatas = useSelector((state) => state.Tasks);
  const fnddata = alldatas.Tasks.data;

  useEffect(() => {
    dispatch(GetTasks(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  useEffect(() => {
    const storedPinnedTasks = JSON.parse(localStorage.getItem("pinnedTasks")) || [];
    setPinnedTasks(storedPinnedTasks);
  }, []);

  const whorole = userRole?.role_name;

  const parsedPermissions = Array.isArray(userRole?.permissions)
    ? userRole.permissions
    : typeof userRole?.permissions === 'string'
      ? JSON.parse(userRole.permissions)
      : [];


  let allpermisson;

  if (parsedPermissions["dashboards-Task"] && parsedPermissions["dashboards-Task"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-Task"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  const openAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
  };
  const closeAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
  };
  const openEditTaskModal = () => {
    setIsEditTaskModalVisible(true);
  };

  const closeEditTaskModal = () => {
    setIsEditTaskModalVisible(false);
  };


  const getUniqueStatuses = () => {
    if (!fnddata) return ['All'];

    const statuses = [...new Set(fnddata.map(item => item.status))];
    return ['All', ...statuses];
  };

  const getUniquePriorities = () => {
    if (!fnddata) return ['All'];

    const priorities = [...new Set(fnddata.map(item => item.priority))];
    return ['All', ...priorities];
  };

  const handleShowStatus = (value) => {
    setSelectedStatus(value);
    applyFilters(value, selectedPriority);
  };


  // Add combined filter function
  const applyFilters = (status, priority) => {
    if (!fnddata) return;

    let filteredData = [...fnddata];

    if (searchValue) {
      filteredData = filteredData.filter(task =>
        task.taskName?.toString().toLowerCase().includes(searchValue.toLowerCase()) ||
        stripHtmlTags(task.description)?.toLowerCase().includes(searchValue.toLowerCase()) ||
        task.priority?.toString().toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (status !== 'All') {
      filteredData = filteredData.filter(task => task.status === status);
    }

    if (priority !== 'All') {
      filteredData = filteredData.filter(task => task.priority === priority);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const rangeStart = dayjs(dateRange[0]).startOf('day');
      const rangeEnd = dayjs(dateRange[1]).endOf('day');

      filteredData = filteredData.filter(task => {
        const taskStartDate = dayjs(task.startDate);
        const taskDueDate = dayjs(task.dueDate);
        return taskStartDate.isAfter(rangeStart) && taskDueDate.isBefore(rangeEnd);
      });
    }

    setList(filteredData);
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

  const getPinnedTasks = () => list.filter((task) => pinnedTasks.includes(task.id));

  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const openViewTaskModal = (task) => {
    setSelectedTask(task);
    setIsViewTaskModalVisible(true);
  };

  const closeViewTaskModal = () => {
    setSelectedTask(null);
    setIsViewTaskModalVisible(false);
  };

  const getDropdownItems = (row) => [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: 'View Details',
      onClick: () => openViewTaskModal(row)
    },
    {
      key: 'pin',
      icon: <PushpinOutlined style={{ color: pinnedTasks.includes(row.id) ? "#1890ff" : undefined }} />,
      label: pinnedTasks.includes(row.id) ? "Unpin" : "Pin",
      onClick: () => togglePinTask(row.id)
    },
    ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => editfubn(row.id)
    }] : []),
    ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => deleytfun(row.id),
      danger: true
    }] : [])
  ];

  const tableColumns = [
    {
      title: "",
      width: 50,
      render: (_, record) => (
        <div className="interactive-cell" onClick={e => e.stopPropagation()}>
          <Button
            type="text"
            icon={<PushpinOutlined style={{
              color: pinnedTasks.includes(record.id) ? "#1890ff" : "#999",
              transform: pinnedTasks.includes(record.id) ? "rotate(-45deg)" : "none",
              transition: "all 0.3s"
            }} />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePinTask(record.id);
            }}
            className="pin-button"
          />
        </div>
      ),
      fixed: 'left'
    },
    {
      title: "Title",
      dataIndex: "taskName",
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
      onFilter: (value, record) => {
        try {
          let assignedUsers = [];
          if (typeof record.assignTo === 'string') {
            const parsed = JSON.parse(record.assignTo);
            assignedUsers = parsed.assignedUsers || [];
          } else if (record.assignTo?.assignedUsers) {
            assignedUsers = record.assignTo.assignedUsers;
          }
          return assignedUsers.includes(value);
        } catch (error) {
          return false;
        }
      },
      render: (assignTo) => {
        let assignedUsers = [];
        try {
          if (typeof assignTo === 'string') {
            const parsed = JSON.parse(assignTo);
            const userIds = parsed.assignedUsers || [];
            assignedUsers = userIds.map(id =>
              fndassine.find(user => user.id === id)
            ).filter(Boolean);
          } else if (assignTo?.assignedUsers) {
            assignedUsers = assignTo.assignedUsers
              .map(id => fndassine.find(user => user.id === id))
              .filter(Boolean);
          }
        } catch (error) {
          console.error("Error parsing assignTo:", error);
        }

        return assignedUsers.length > 0 ? (
          <UserAvatarGroup users={assignedUsers} maxCount={3} />
        ) : (
          <span>No users assigned</span>
        );
      },
      sorter: (a, b) => {
        try {
          const getFirstAssigneeName = (assignTo) => {
            let assignedUsers = [];
            if (typeof assignTo === 'string') {
              const parsed = JSON.parse(assignTo);
              assignedUsers = parsed.assignedUsers || [];
            } else if (assignTo?.assignedUsers) {
              assignedUsers = assignTo.assignedUsers;
            }

            if (assignedUsers.length > 0) {
              const user = fndassine.find(u => u.id === assignedUsers[0]);
              return user ? (user.firstName || user.username || "").toLowerCase() : "";
            }
            return "";
          };

          return getFirstAssigneeName(a.assignTo).localeCompare(getFirstAssigneeName(b.assignTo));
        } catch (error) {
          return 0;
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
        <div className="interactive-cell" onClick={e => e.stopPropagation()}>
          <Select
            value={record.status}
            style={{ width: 140 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            disabled={!(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client"))}
            dropdownStyle={{ zIndex: 1001 }}
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
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (_, record) => (
        <div className="interactive-cell" onClick={e => e.stopPropagation()}>
          <Select
            value={record.priority}
            style={{ width: 120 }}
            onChange={(value) => handlePriorityChange(record.id, value)}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onMouseUp={e => e.stopPropagation()}
            disabled={!(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client"))}
            dropdownStyle={{ zIndex: 1001 }}
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
        </div>
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
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
        </div>
      )
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRowKeys(key);
    },
  };

  const debouncedSearch = debounce((value, dates, status, priority, data, setList) => {
    setIsSearching(true);

    const searchValue = value.toLowerCase();

    if (!fnddata) {
      setList([]);
      setIsSearching(false);
      return;
    }

    const filteredData = fnddata.filter(task => {
      const matchesSearch = !searchValue || (
        task.taskName?.toString().toLowerCase().includes(searchValue) ||
        stripHtmlTags(task.description)?.toLowerCase().includes(searchValue) ||
        task.priority?.toString().toLowerCase().includes(searchValue) ||
        task.status?.toString().toLowerCase().includes(searchValue) ||
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

      const matchesStatus = status === 'All' || task.status === status;

      const matchesPriority = priority === 'All' || task.priority === priority;

      let matchesDateRange = true;
      if (dates && dates[0] && dates[1]) {
        const taskStartDate = task.startDate ? dayjs(task.startDate) : null;
        const taskDueDate = task.dueDate ? dayjs(task.dueDate) : null;
        const rangeStart = dayjs(dates[0]).startOf('day');
        const rangeEnd = dayjs(dates[1]).endOf('day');

        matchesDateRange = (!taskStartDate || taskStartDate.isAfter(rangeStart) || taskStartDate.isSame(rangeStart)) &&
          (!taskDueDate || taskDueDate.isBefore(rangeEnd) || taskDueDate.isSame(rangeEnd));
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
    });

    setList(filteredData);
    setIsSearching(false);
  }, 300);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, dateRange, selectedStatus, selectedPriority, fnddata, setList);
  };
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    debouncedSearch(searchValue, dates, selectedStatus, selectedPriority, fnddata, setList);
  };


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

      let assignToObject = {
        assignedUsers: []
      };

      try {
        if (typeof taskToUpdate.assignTo === 'string') {
          const parsed = JSON.parse(taskToUpdate.assignTo);
          assignToObject.assignedUsers = parsed.assignedUsers || [];
        } else if (taskToUpdate.assignTo?.assignedUsers) {
          assignToObject.assignedUsers = taskToUpdate.assignTo.assignedUsers;
        } else if (Array.isArray(taskToUpdate.assignTo)) {
          assignToObject.assignedUsers = taskToUpdate.assignTo;
        }
      } catch (error) {
        console.error("Error parsing assignTo:", error);
        assignToObject.assignedUsers = [];
      }

      const values = {
        ...taskToUpdate,
        status: newStatus,
        startDate: taskToUpdate.startDate ? dayjs(taskToUpdate.startDate).format("YYYY-MM-DD") : null,
        dueDate: taskToUpdate.dueDate ? dayjs(taskToUpdate.dueDate).format("YYYY-MM-DD") : null,
        assignTo: assignToObject
      };

      await dispatch(EditTaskss({ idd: taskId, values }));
      message.success("Status updated successfully");
      dispatch(GetTasks(id));
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

      let assignToObject = {
        assignedUsers: []
      };

      try {
        if (typeof taskToUpdate.assignTo === 'string') {
          const parsed = JSON.parse(taskToUpdate.assignTo);
          assignToObject.assignedUsers = parsed.assignedUsers || [];
        } else if (taskToUpdate.assignTo?.assignedUsers) {
          assignToObject.assignedUsers = taskToUpdate.assignTo.assignedUsers;
        } else if (Array.isArray(taskToUpdate.assignTo)) {
          assignToObject.assignedUsers = taskToUpdate.assignTo;
        }
      } catch (error) {
        console.error("Error parsing assignTo:", error);
        assignToObject.assignedUsers = [];
      }

      const values = {
        ...taskToUpdate,
        priority: newPriority,
        startDate: taskToUpdate.startDate ? dayjs(taskToUpdate.startDate).format("YYYY-MM-DD") : null,
        dueDate: taskToUpdate.dueDate ? dayjs(taskToUpdate.dueDate).format("YYYY-MM-DD") : null,
        assignTo: assignToObject
      };

      await dispatch(EditTaskss({ idd: taskId, values }));
      message.success("Priority updated successfully");
      dispatch(GetTasks(id));
    } catch (error) {
      console.error("Error updating task priority:", error);
      message.error("Failed to update priority");
    }
  };

  const getRowClassName = (record) => {
    return pinnedTasks.includes(record.id) ? 'pinned-row' : '';
  };

  // Update the Action column in the existing tableColumns array
  const updatedTableColumns = [...tableColumns];
  const actionColumnIndex = updatedTableColumns.findIndex(col => col.dataIndex === 'actions');

  if (actionColumnIndex !== -1) {
    updatedTableColumns[actionColumnIndex] = {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
        </div>
      )
    };
  }

  return (
    <>
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
            <div className="mb-3" style={{ display: 'flex', gap: '8px' }}>
              <Select
                value={selectedStatus}
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                {getUniqueStatuses().map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
              <Select
                value={selectedPriority}
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handlePriorityChange}
                placeholder="Priority"
              >
                {getUniquePriorities().map((priority) => (
                  <Option key={priority} value={priority}>
                    {priority}
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
              onClick={exportToExcel}
              block
            >
              Export All
            </Button>
          </Flex>
        </Flex>

        <div className="table-responsive">
          {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
            <Table
              columns={updatedTableColumns}
              dataSource={showPinnedOnly ? getPinnedTasks() : [...list].sort((a, b) => {
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
              onRow={(record) => ({
                onClick: (e) => {
                  const isInteractiveElement = e.target.closest('.interactive-cell') ||
                    e.target.closest('.ant-select') ||
                    e.target.closest('.pin-button') ||
                    e.target.closest('.ant-dropdown-trigger') ||
                    e.target.closest('.ant-checkbox-wrapper');

                  if (!isInteractiveElement) {
                    openViewTaskModal(record);
                  }
                },
                style: { cursor: 'pointer' }
              })}
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
          .ant-table-row {
            cursor: pointer;
          }
          .ant-table-cell {
            pointer-events: auto;
          }
          .ant-table-row-selected {
            background-color: #e6f7ff !important;
          }
          .ant-table-row:hover td {
            background-color: #f0f7ff !important;
          }
          .interactive-cell {
            position: relative;
            z-index: 2;
          }
          .ant-select-dropdown {
            z-index: 1001 !important;
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

      <Modal
        title={selectedTask?.taskName || "Task Details"}
        visible={isViewTaskModalVisible}
        onCancel={closeViewTaskModal}
        footer={null}
        width={1200}
        className="mt-[-70px]"
      >
        <ViewTask filterdatass={selectedTask} onClose={closeViewTaskModal} />
      </Modal>

    </>
  );
};

export default TaskList;
