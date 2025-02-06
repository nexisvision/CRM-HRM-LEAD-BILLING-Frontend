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
} from "antd";
import OrderListData from "../../../../assets/data/order-list.data.json";
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
import { DeleteTasks, GetTasks } from "../project/task/TaskReducer/TaskSlice";

const { Option } = Select;

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

  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);

  const dispatch = useDispatch();

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [iddd, setIddd] = useState("");

  const allloggeddata = useSelector((state) => state.user);
  const fndlogged = allloggeddata.loggedInUser;

  const idd = fndlogged.id;

  const alldatas = useSelector((state) => state.Tasks);
  const fnddata = alldatas.Tasks.data;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetTasks(idd));
  }, [dispatch, idd]);

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
                      
                          if (parsedPermissions["dashboards-Task"] && parsedPermissions["dashboards-Task"][0]?.permissions) {
                            allpermisson = parsedPermissions["dashboards-Task"][0].permissions;
                            console.log('Parsed Permissions:', allpermisson);
                          
                          } else {
                            console.log('dashboards-Task is not available');
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
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };

  const deleytfun = (userId) => {
    dispatch(DeleteTasks(userId)).then(() => {
      dispatch(GetTasks(idd));
      setList(list.filter((itme) => itme.id !== userId));
      // message.success("Task Delete Success");
    });
  };

  const editfubn = (idd) => {
    openEditTaskModal();
    setIddd(idd);
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
      <Menu.Item>
        <Flex alignItems="center" onClick={() => togglePinTask(row.id)}>
          {pinnedTasks.includes(row.id) ? (
            <PushpinOutlined style={{ color: "gold" }} />
          ) : (
            <PushpinOutlined />
          )}
          <span className="ml-2">{pinnedTasks.includes(row.id) ? "Unpin" : "Pin"}</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={openviewTaskModal}>
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
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
      title: "Pinned",
      dataIndex: "pinned",
      render: (text, record) => (
        <span>
          {pinnedTasks.includes(record.id) ? (
            <PushpinOutlined style={{ color: "gold" }} />
          ) : (
            <PushpinOutlined />
          )}
        </span>
      ),
    },
    {
      title: "Title",
      dataIndex: "taskName",
      sorter: {
        compare: (a, b) => a.taskName.length - b.taskName.length,
      },
    },
    {
      title: "priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.priority.length - b.priority.length,
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: "priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.priority.length - b.priority.length,
      },
    },
    // {
    //   title: "Priority",
    //   dataIndex: "priority",
    //   sorter: {
    //     compare: (a, b) => a.priority.length - b.priority.length,
    //   },
    // },
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   render: (_, record) => (
    //     <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "startdate"),
    // },
    // {
    // 	title: 'Due Date',
    // 	dataIndex: 'duedate',
    // 	render: (_, record) => (
    // 		<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
    // 	),
    // 	sorter: (a, b) => utils.antdTableSorter(a, b, 'startdate')
    // },
    // {
    // 	title: 'Estimated Time',
    // 	dataIndex: 'estimatedtime',
    // 	sorter: {
    // 		compare: (a, b) => a.description.length - b.description.length,
    // 	},
    // },
    // {
    // 	title: 'Hours Logged',
    // 	dataIndex: 'hourslogged',
    // 	sorter: {
    // 		compare: (a, b) => a.description.length - b.description.length,
    // 	},
    // },
    // {
    //   title: "Assigned To",
    //   dataIndex: "description",
    //   render: (_, record) => (
    //     <div className="d-flex">
    //       <AvatarStatus size={30} src={record.image} />
    //     </div>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "description"),
    // },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getOrderStatus(record.status)}>{record.status}</Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "orderStatus"),
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
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e)}
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">All Status </Option>
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
        <div className="table-responsive">

          {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                             <Table
                                                                                                             columns={tableColumns}
                                                                                                             dataSource={list}
                                                                                                             rowKey="id"
                                                                                                             scroll={{ x: 1200 }}
                                                                                                             rowSelection={{
                                                                                                               selectedRowKeys: selectedRowKeys,
                                                                                                               type: "checkbox",
                                                                                                               preserveSelectedRowKeys: false,
                                                                                                               ...rowSelection,
                                                                                                             }}
                                                                                                           />
                                                                                                            ) : null}
        </div>
      </Card>

      <Card>
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
          <EditTask onClose={closeEditTaskModal} iddd={iddd} />
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
      </Card>
    </>
  );
};

export default TaskList;
