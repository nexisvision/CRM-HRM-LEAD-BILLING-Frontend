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
  EditOutlined,
  PlusOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobOnBording from "./AddJobOnBording";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import EditJobOnBording from "./EditJobOnBording";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobonBoarding,
  getJobonBoarding,
} from "./JobOnBoardingReducer/jobonboardingSlice";

const { Option } = Select;
const JobOnBordingList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobOnBordingModalVisible, setIsAddJobOnBordingModalVisible] =
    useState(false);
  const [isEditJobOnBordingModalVisible, setIsEditJobOnBordingModalVisible] =
    useState(false);
    const [idd, setIdd] = useState("");
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const user = useSelector((state) => state.user.loggedInUser.username);

  const alldata = useSelector((state) => state.jobonboarding);
  const fnddata = alldata.jobonboarding.data || [];

  const filteredData = fnddata.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(getJobonBoarding());
  }, []);

  useEffect(() => {
    if (fnddata) {
      setUsers(filteredData);
    }
  }, [fnddata]);

  const [annualStatisticData] = useState(AnnualStatisticData);

  // Open Add Job Modal
  const openAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(false);
  };
  const editfunction = (idd) => {
    setIdd(idd)
    setIsEditJobOnBordingModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditJobOnBordingModal = () => {
    setIsEditJobOnBordingModalVisible(false);
  };

  // Update the search handler
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Add this function to filter onboarding entries by name
  const getFilteredOnboarding = () => {
    if (!filteredData) return [];
    
    if (!searchText) return filteredData;

    return filteredData.filter(onboarding => {
      return onboarding.Interviewer?.toLowerCase().includes(searchText.toLowerCase());
    });
  };

  // Add search button handler
  const handleSearch = () => {
    message.success('Search completed');
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
                   
                      if (parsedPermissions["extra-hrm-jobs-jobonbording"] && parsedPermissions["extra-hrm-jobs-jobonbording"][0]?.permissions) {
                        allpermisson = parsedPermissions["extra-hrm-jobs-jobonbording"][0].permissions;
                        // console.log('Parsed Permissions:', allpermisson);
                      
                      } else {
                        // console.log('extra-hrm-jobs-jobonbording is not available');
                      }
                      
                      const canCreateClient = allpermisson?.includes('create');
                      const canEditClient = allpermisson?.includes('edit');
                      const canDeleteClient = allpermisson?.includes('delete');
                      const canViewClient = allpermisson?.includes('view');
                   
                      ///endpermission



  // Delete user
  const deleteUser = (userId) => {
    dispatch(deleteJobonBoarding(userId)).then(() => {
      dispatch(getJobonBoarding());
      setUsers(users.filter((item) => item.id !== userId));
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const openViewJobOnBordingModal = () => {
    navigate("/app/hrm/jobs/viewjobonbording", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };

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

  const jobStatusList = ["active", "blocked"];

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewJobOnBordingModal}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
     
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<FilePdfOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Download OfferLetter</span>
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
                                       onClick={()=> editfunction(elm.id)}
                                       size="small"
                                     >
                                       <span className="">Edit</span>
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
      title: "Name",
      dataIndex: "Interviewer",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: "Job",
      dataIndex: "JobType",
      sorter: {
        compare: (a, b) => a.job.length - b.job.length,
      },
    },

    {
      title: "Salary",
      dataIndex: "Salary",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },

    {
      title: "JoiningDate",
      dataIndex: "JoiningDate",
      sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
    },

    {
      title: "SalaryType",
      dataIndex: "SalaryType",
      sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
    },
    {
      title: "SalaryDuration",
      dataIndex: "SalaryDuration",
      sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getjobStatus(record.Status)}>{record.Status}</Tag>
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
            <Input.Group compact>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
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
                                                                                                        <Button
                                                                                                        type="primary"
                                                                                                        className="ml-2"
                                                                                                        onClick={openAddJobOnBordingModal}
                                                                                                      >
                                                                                                        <PlusOutlined />
                                                                                                        <span>New</span>
                                                                                                      </Button>                                                                                                                              
                                                                                                                                                                                                                                      
                                                                                                                    ) : null}


          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

           {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                   <Table
                                                   columns={tableColumns}
                                                   dataSource={getFilteredOnboarding()}
                                                   rowKey="id"
                                                   pagination={{
                                                     total: getFilteredOnboarding().length,
                                                     pageSize: 10,
                                                     showSizeChanger: true,
                                                     showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                                   }}
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
        title="Add Job On Bording"
        visible={isAddJobOnBordingModalVisible}
        onCancel={closeAddJobOnBordingModal}
        footer={null}
        width={1000}
      >
        <AddJobOnBording onClose={closeAddJobOnBordingModal} />
      </Modal>
      <Modal
        title="Edit Job On Bording"
        visible={isEditJobOnBordingModalVisible}
        onCancel={closeEditJobOnBordingModal}
        footer={null}
        width={1000}
      >
        <EditJobOnBording onClose={closeEditJobOnBordingModal} idd={idd}/>
      </Modal>
    </Card>
  );
};

// Add styles
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
`;

const JobOnBordingListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobOnBordingList />
  </>
);

export default JobOnBordingListWithStyles;
