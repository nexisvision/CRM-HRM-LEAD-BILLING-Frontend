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
  DatePicker,
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
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [uniqueStatuses, setUniqueStatuses] = useState(['All']);

  const [annualStatisticData] = useState(AnnualStatisticData);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const allempdata = useSelector((state) => state.Jobs);
  const filtermin = allempdata.Jobs.data || [];
  const filteredData = filtermin.filter((item) => item.created_by === user);

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

  const openEditJobModal = () => {
    setIsEditJobModalVisible(true);
  };

  const closeEditJobModal = () => {
    setIsEditJobModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredJobs = () => {
    if (!filteredData) return [];
    
    let filtered = [...filteredData];

    if (searchText) {
      filtered = filtered.filter(job => {
        return (
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.job_type?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(job => job.status === selectedStatus.toLowerCase());
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).startOf('day');
      const endDate = dayjs(dateRange[1]).endOf('day');

      filtered = filtered.filter(job => {
        if (!job.startDate || !job.endDate) return false;
        
        const jobStartDate = dayjs(job.startDate);
        const jobEndDate = dayjs(job.endDate);

        return (
          (jobStartDate.isSame(startDate, 'day') || jobStartDate.isAfter(startDate)) &&
          (jobEndDate.isSame(endDate, 'day') || jobEndDate.isBefore(endDate))
        );
      });
    }

    return filtered;
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

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
                    
                    } else {
                    }
                    
                    const canCreateClient = allpermisson?.includes('create');
                    const canEditClient = allpermisson?.includes('edit');
                    const canDeleteClient = allpermisson?.includes('delete');
                    const canViewClient = allpermisson?.includes('view');
                 
  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

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
      setList(filteredData);
      const statuses = ['All', ...new Set(filteredData.map(job => job.status).filter(Boolean))];
      setUniqueStatuses(statuses);
    }
  }, [filtermin, filteredData]);

  const editFunc = (idd) => {
    openEditJobModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => ({
    items: [
      
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editFunc(elm.id)
      }] : []),
      
      ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(elm.id)
      }] : [])
    ]
  });

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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates || [null, null]); // Ensure we set [null, null] when clearing
  };

  // Add status change handler
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

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
                placeholder="Search job title"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD-MM-YYYY"
              placeholder={['Start Date', 'End Date']}
              className="w-100"
              allowClear={true}
            />
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              {uniqueStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
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
                onClick={exportToExcel} 
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
                                           dataSource={getFilteredJobs()}
                                           rowKey="id"
                                           pagination={{
                                             total: getFilteredJobs().length,
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

      <Modal
        title="Create Job"
        visible={isAddJobModalVisible}
        onCancel={closeAddJobModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
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
      >
        <EditJob onClose={closeEditJobModal} idd={idd} />
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

  .ant-picker-range {
    min-width: 300px;
  }

  .ant-select {
    min-width: 120px;
  }

  @media (max-width: 768px) {
    .ant-picker-range,
    .ant-select {
      width: 100%;
    }
  }
`;

const JobListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobList />
  </>
);

export default JobListWithStyles;
