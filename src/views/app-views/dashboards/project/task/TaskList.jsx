import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
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
import OrderListData from "../../../../../assets/data/order-list.data.json";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
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
import utils from "utils";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import TaskView from "./TaskView";
import { useDispatch, useSelector } from "react-redux";
import { DeleteTasks, GetTasks } from "./TaskReducer/TaskSlice";

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
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState(OrderListData);
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

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "paymentStatus";
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };

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
  // const openViewTaskModal = () => {
  //     setIsViewTaskModalVisible(true);
  // };
  const openViewTaskModal = () => {
    navigate("/app/dashboards/project/task/TaskView", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };
  // Close Add Job Modal
  const closeViewTaskModal = () => {
    setIsViewTaskModalVisible(false);
  };

  useEffect(() => {
    dispatch(GetTasks(id));
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  const DeleteFun = async (idd) => {
    try {
      const response = await dispatch(DeleteTasks(idd));
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(GetTasks(id));
      setList(list.filter((item) => item.id !== idd));

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };

  const EditTaskfun = (idd) => {
    openEditTaskModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={openViewTaskModal}>
          <EyeOutlined />
          {/* <EyeOutlined /> */}
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add to remark</span>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center" onClick={() => EditTaskfun(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <TiPinOutline />
          <span className="ml-2">Pin</span>
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
      dataIndex: "startdate",
      render: (_, record) => (
        <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "startdate"),
    },
    {
      title: "Due Date",
      dataIndex: "duedate",
      render: (_, record) => (
        <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "duedate"),
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
      dataIndex: "assignedto",
      sorter: (a, b) => utils.antdTableSorter(a, b, "assignedto"),
    },
    {
      title: "status",
      dataIndex: "taskStatus",
      render: (_, record) => (
        <>
          <Tag color={getPaymentStatus(record.taskStatus)}>
            {record.taskStatus}
          </Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "taskStatus"),
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
    const searchArray = e.currentTarget.value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
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
            <div className="mb-3">
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
            </div>
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
            <Button type="primary" icon={<FileExcelOutlined />} block>
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
