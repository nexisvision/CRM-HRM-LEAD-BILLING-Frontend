import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  EditOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJob from "./AddJob";
import { useNavigate } from "react-router-dom";
import { utils, writeFile } from "xlsx";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import EditJob from "./EditJob";
import { Deletejobs, GetJobdata } from "./JobReducer/JobSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const JobList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);
  const [isEditJobModalVisible, setIsEditJobModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const navigate = useNavigate();

  const [annualStatisticData] = useState(AnnualStatisticData);

const user = useSelector((state) => state.user.loggedInUser.username);

  const allempdata = useSelector((state) => state.Jobs);

  const filtermin = allempdata.Jobs.data || [];

  const filteredData = filtermin.filter((item) => item.created_by === user);

  // console.log("filteredData", filteredData);
  // Open Add Job Modal
  const openAddJobModal = () => {
    setIsAddJobModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };

  const handleJob = () => {
    navigate("/app/hrm/jobs/viewjob", { state: { user: selectedUser } }); // Pass user data as state if needed
  };

  // Open Add Job Modal
  const openEditJobModal = () => {
    setIsEditJobModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditJobModal = () => {
    setIsEditJobModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  // Delete user
  const deleteUser = (userId) => {
    dispatch(Deletejobs(userId));
    dispatch(GetJobdata());
    setUsers(list.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(list); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Job"); // Append the sheet to the workbook

      writeFile(wb, "JobData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
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
                 
                    if (parsedPermissions["extra-hrm-jobs-joblist"] && parsedPermissions["extra-hrm-jobs-joblist"][0]?.permissions) {
                      allpermisson = parsedPermissions["extra-hrm-jobs-joblist"][0].permissions;
                      // console.log('Parsed Permissions:', allpermisson);
                    
                    } else {
                      // console.log('extra-hrm-jobs-joblist is not available');
                    }
                    
                    const canCreateClient = allpermisson?.includes('create');
                    const canEditClient = allpermisson?.includes('edit');
                    const canDeleteClient = allpermisson?.includes('delete');
                    const canViewClient = allpermisson?.includes('view');
                 
                    ///endpermission



  // Show user profile
  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  useEffect(() => {
    dispatch(GetJobdata());
  }, [dispatch]);

  useEffect(() => {
    if (filtermin) {
      // console.log("aaaaaa", filtermin);
      setList(filteredData);
    }
  }, [filtermin]);

  const jobStatusList = ["active", "blocked"];

  const editFunc = (idd) => {
    openEditJobModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={handleJob}
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
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item> */}
    
    

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                    <Menu.Item>
                                    <Flex alignItems="center">
                                      <Button
                                        type=""
                                        className=""
                                        icon={<EditOutlined />}
                                        onClick={() => editFunc(elm.id)}
                                        size="small"
                                      >
                                        <span className="ml-2">Edit</span>
                                      </Button>
                                    </Flex>
                                  </Menu.Item>
                                ) : null}
                  
                  
                  {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Flex alignItems="center">
                                     <Button
                                       type=""
                                       className=""
                                       icon={<DeleteOutlined />}
                                       onClick={() => deleteUser(elm.id)}
                                       size="small"
                                     >
                                       <span className="">Delete</span>
                                     </Button>
                                   </Flex>
                                 </Menu.Item>
                                ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (_, record) => (
        <span>
          {record.startDate ? dayjs(record.startDate).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "startDate"),
    },

    {
      title: "End Date",
      dataIndex: "endDate",
      render: (_, record) => (

        <span>
          {record.endDate ? dayjs(record.endDate).format('DD-MM-YYYY') : ''}
        </span>

      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "endDate"),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getjobStatus(record.status)}>{record.status}</Tag>
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

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      {/* <Row gutter={16}>
        {annualStatisticData.map((elm, i) => (
          <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
            <StatisticWidget
              title={elm.title}
              value={elm.value}
              status={elm.status}
              subtitle={elm.subtitle}
            />
          </Col>
        ))}
      </Row> */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          {/* <div className="w-full md:w-48 ">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Job </Option>
              {jobStatusList.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div> */}
        </Flex>
        <Flex gap="7px">
        


           {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                              <Button type="primary" className="ml-2" onClick={openAddJobModal}>
                                                                                              <PlusOutlined />
                                                                                              <span>New</span>
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
      <div className="table-responsive mt-2">

         {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                           <Table
                                           columns={tableColumns}
                                           dataSource={list}
                                           rowKey="id"
                                           scroll={{ x: 1200 }}
                                         />
                                             ) : null}

       
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* Add Job Modal */}
      <Modal
        title="Create Job"
        visible={isAddJobModalVisible}
        onCancel={closeAddJobModal}
        footer={null}
        width={1100}
        className="mt-[-70px]"
        // height={1000}
      >
        <AddJob onClose={closeAddJobModal} />
      </Modal>

      <Modal
        title="Edit Job"
        visible={isEditJobModalVisible}
        onCancel={closeEditJobModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
        // height={1000}
      >
        <EditJob onClose={closeEditJobModal} idd={idd} />
      </Modal>
    </Card>
  );
};

export default JobList;
