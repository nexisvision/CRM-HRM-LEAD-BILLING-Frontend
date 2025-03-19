import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddJob from "./AddJob";
import { utils, writeFile } from "xlsx";
import OrderListData from "assets/data/order-list.data.json";
import EditJob from "./EditJob";
import { Deletejobs, GetJobdata } from "./JobReducer/JobSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const JobList = () => {
  const [list, setList] = useState(OrderListData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);
  const [isEditJobModalVisible, setIsEditJobModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [uniqueStatuses, setUniqueStatuses] = useState(["All"]);
  const user = useSelector((state) => state.user.loggedInUser.username);
  const allempdata = useSelector((state) => state.Jobs);
  const filtermin = React.useMemo(
    () => allempdata.Jobs.data || [],
    [allempdata.Jobs.data]
  );
  const filteredData = filtermin.filter((item) => item.created_by === user);
  const openAddJobModal = () => {
    setIsAddJobModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
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
      filtered = filtered.filter((job) => {
        return (
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.category?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.jobType?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.recruiter?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.workExperience
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter(
        (job) => job.status === selectedStatus.toLowerCase()
      );
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).startOf("day");
      const endDate = dayjs(dateRange[1]).endOf("day");

      filtered = filtered.filter((job) => {
        if (!job.startDate || !job.endDate) return false;

        const jobStartDate = dayjs(job.startDate);
        const jobEndDate = dayjs(job.endDate);

        return (
          (jobStartDate.isSame(startDate, "day") ||
            jobStartDate.isAfter(startDate)) &&
          (jobEndDate.isSame(endDate, "day") || jobEndDate.isBefore(endDate))
        );
      });
    }

    return filtered;
  };

  const handleSearch = () => {
    message.success("Search completed");
  };

  const deleteUser = (userId) => {
    dispatch(Deletejobs(userId));
    dispatch(GetJobdata());
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

  //// permission handling
  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);
  const whorole = roleData?.role_name;

  // Parse permissions
  const parsedPermissions =
    typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : roleData?.permissions || {};

  // Get job list specific permissions
  const jobListPermissions =
    parsedPermissions["extra-hrm-jobs-joblist"]?.[0]?.permissions || [];

  // Individual permission checks
  const canView = jobListPermissions.includes("view");
  const canCreate = jobListPermissions.includes("create");
  const canUpdate = jobListPermissions.includes("update");
  const canDelete = jobListPermissions.includes("delete");

  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    return (
      whorole === "super-admin" ||
      whorole === "client" ||
      jobListPermissions.includes(permission)
    );
  };

  const getDropdownItems = (elm) => {
    const items = [];

    if (hasPermission("update")) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editFunc(elm.id),
      });
    }

    if (hasPermission("delete")) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(elm.id),
        danger: true,
      });
    }

    return items;
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
  useEffect(() => {
    dispatch(GetJobdata());
  }, [dispatch]);

  useEffect(() => {
    if (filtermin) {
      setList(filteredData);
      const statuses = [
        "All",
        ...new Set(filteredData.map((job) => job.status).filter(Boolean)),
      ];
      setUniqueStatuses(statuses);
    }
  }, [filtermin, filteredData]);

  const editFunc = (idd) => {
    openEditJobModal();
    setIdd(idd);
  };

  const tableColumns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: {
        compare: (a, b) => a.category.localeCompare(b.category),
      },
    },
    {
      title: "Interview Rounds",
      dataIndex: "interviewRounds",
      render: (rounds) => {
        try {
          const parsedRounds = JSON.parse(rounds);
          return parsedRounds.InterviewRounds?.join(", ") || "N/A";
        } catch (e) {
          return "N/A";
        }
      },
    },
    {
      title: "Job Type",
      dataIndex: "jobType",
      sorter: {
        compare: (a, b) => a.jobType.localeCompare(b.jobType),
      },
    },
    {
      title: "Recruiter",
      dataIndex: "recruiter",
      sorter: {
        compare: (a, b) => a.recruiter.localeCompare(b.recruiter),
      },
    },
    {
      title: "Work Experience",
      dataIndex: "workExperience",
      sorter: {
        compare: (a, b) => a.workExperience.localeCompare(b.workExperience),
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (_, record) => (
        <span>
          {record.startDate ? dayjs(record.startDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "startDate"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (_, record) => (
        <span>
          {record.endDate ? dayjs(record.endDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "endDate"),
    },
    {
      title: "Expected Salary",
      dataIndex: "expectedSalary",
      render: (salary, record) => <span>{salary ? `${salary}` : "N/A"}</span>,
      sorter: {
        compare: (a, b) => a.expectedSalary - b.expectedSalary,
      },
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
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: "10px",
                padding: 0,
              }}
            >
              <MoreOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
            </Button>
          </Dropdown>
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
              placeholder={["Start Date", "End Date"]}
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
          {hasPermission("create") && (
            <Button type="primary" className="ml-2" onClick={openAddJobModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          )}

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
        {hasPermission("view") && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredJobs()}
            rowKey="id"
            pagination={{
              total: getFilteredJobs().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        )}
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

  .ant-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
  }
  .ant-dropdown-menu-item {
    padding: 8px 16px;
    border-radius: 4px;
    margin: 2px 0;
    transition: all 0.3s;
  }
  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }
  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }
  .ant-dropdown-menu-item .anticon {
    font-size: 16px;
    margin-right: 8px;
  }
`;

const JobListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobList />
  </>
);

export default JobListWithStyles;
