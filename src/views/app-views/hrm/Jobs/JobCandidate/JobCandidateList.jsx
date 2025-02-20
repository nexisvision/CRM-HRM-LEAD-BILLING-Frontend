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
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  FilePdfOutlined,
  PushpinOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import { utils, writeFile } from "xlsx";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobCandidate from "./AddJobCandidate";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";

const JobCandidateList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobCandidateModalVisible, setIsAddJobCandidateModalVisible] =
    useState(false);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data || [];

  const filteredData = fnddta.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(getjobapplication());
  }, []);

  useEffect(() => {
    if (fnddta) {
      setUsers(filteredData);
    }
  }, [fnddta]);

  // Open Add Job Modal
  const openAddJobCandidateModal = () => {
    setIsAddJobCandidateModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobCandidateModal = () => {
    setIsAddJobCandidateModalVisible(false);
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Candidates");
    writeFile(wb, "JobCandidates.xlsx");
  };

  const handleJob = () => {
    navigate("/app/hrm/jobs/jobcandidate/viewjobcandidate", {
      state: { user: selectedUser },
    });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredCandidates = () => {
    if (!users) return [];
    
    if (!searchText) return users;

    return users.filter(candidate => {
      return (
        candidate.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.job?.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.location?.toLowerCase().includes(searchText.toLowerCase()) ||
        candidate.current_location?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

  // Delete user
  const deleteUser = (userId) => {
    setUsers(filteredData.filter((item) => item.id !== userId));
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
                   
                      if (parsedPermissions["extra-hrm-jobs-jobcandidate"] && parsedPermissions["extra-hrm-jobs-jobcandidate"][0]?.permissions) {
                        allpermisson = parsedPermissions["extra-hrm-jobs-jobcandidate"][0].permissions;
                        // console.log('Parsed Permissions:', allpermisson);
                      
                      } else {
                        // console.log('extra-hrm-jobs-jobcandidate is not available');
                      }
                      
                      const canCreateClient = allpermisson?.includes('create');
                      const canEditClient = allpermisson?.includes('edit');
                      const canDeleteClient = allpermisson?.includes('delete');
                      const canViewClient = allpermisson?.includes('view');
                   
                      ///endpermission

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
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
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<FilePdfOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Download Cv</span>
          </Button>
        </Flex>
      </Menu.Item>
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
    </Menu>
  );

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const tableColumns = [
    {
      title: "name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: "Notice Period",
      dataIndex: "notice_period",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Job",
      dataIndex: "job",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "current_location",
      dataIndex: "current_location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "phone",
      dataIndex: "phone",
      sorter: (a, b) => a.totaldays.length - b.totaldays.length,
    },
    {
      title: "total_experience",
      dataIndex: "total_experience",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
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
  ];

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input.Group compact>
              <Input
                placeholder="Search "
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
        </Flex>
        {/* <Flex gap="7px">
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddJobCandidateModal}>
              <PlusOutlined />
              <span>New</span>
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
        </Flex> */}
      </Flex>
      <div className="table-responsive mt-2">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table 
            columns={tableColumns} 
            dataSource={getFilteredCandidates()} 
            rowKey="id"
            pagination={{
              total: getFilteredCandidates().length,
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
        title=""
        visible={isAddJobCandidateModalVisible}
        onCancel={closeAddJobCandidateModal}
        footer={null}
        width={800}
      >
        <AddJobCandidate onClose={closeAddJobCandidateModal} />
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
`;

const JobCandidateListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobCandidateList />
  </>
);

export default JobCandidateListWithStyles;
