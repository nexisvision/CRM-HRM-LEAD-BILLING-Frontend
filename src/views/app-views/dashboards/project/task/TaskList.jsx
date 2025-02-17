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
  const [idd, setIdd] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = useParams();

  const alldatatask = useSelector((state) => state.Tasks);
  const fnddata = alldatatask.Tasks.data;
  const employees = useSelector((state) => state.employee?.employee?.data || []);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
  useEffect(() => {
    dispatch(empdata());
    dispatch(GetTasks(id));
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  // Format tasks with employee names
  useEffect(() => {
    if (fnddata && employees?.length > 0) {
      try {
        const formattedTasks = fnddata.map(task => {
          // Parse the assignTo JSON string to array
          const assignToIds = JSON.parse(task.assignTo || "[]");
          
          // Map IDs to employee names
          const employeeNames = assignToIds.map(empId => {
            const employee = employees.find(emp => emp.id === empId);
            return employee?.firstName || 'Unknown';
          });

          return {
            ...task,
            assignToName: employeeNames.join(', ') || 'Not Assigned'
          };
        });
        setList(formattedTasks);
      } catch (error) {
        console.error('Error formatting tasks:', error);
      }
    }
  }, [fnddata, employees]);

  useEffect(() => {
    // Load pinned tasks from local storage on component mount
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
    {
      title: "Completed On",
      dataIndex: "taskDate",
      sorter: {
        compare: (a, b) => a.completedon.length - b.completedon.length,
      },
    },
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const data = utils.wildCardSearch(list, value);
    setList(data);
    setSelectedRowKeys([]);
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
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e)}
              />
            </div>
            {/* <div className="mb-3">
              <h1 className="mb-2 text-black text-base">Status</h1>
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">Hide Completed Task </Option>
                {paymentStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <h1 className="mb-2 text-black text-base">Assigned To</h1>
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">All</Option>
                {paymentStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="mb-3">
              <h1 className="mb-2 text-black text-base">Milestone</h1>
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">All payment </Option>
                {paymentStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
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
                onClick={exportToExcel} // Call export function when the button is clicked
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
