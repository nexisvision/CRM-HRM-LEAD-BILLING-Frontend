import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
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
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddJobOnBording from "./AddJobOnBording";
import userData from "assets/data/user-list.data.json";
import utils from "utils";
import EditJobOnBording from "./EditJobOnBording";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJobonBoarding,
  getJobonBoarding,
} from "./JobOnBoardingReducer/jobonboardingSlice";

const { Option } = Select;
const JobOnBordingList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobOnBordingModalVisible, setIsAddJobOnBordingModalVisible] =
    useState(false);
  const [isEditJobOnBordingModalVisible, setIsEditJobOnBordingModalVisible] =
    useState(false);
  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [uniqueStatuses, setUniqueStatuses] = useState(["All"]);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const alldata = useSelector((state) => state.jobonboarding);
  const fnddata = useMemo(
    () => alldata.jobonboarding.data || [],
    [alldata.jobonboarding.data]
  );

  const filteredData = fnddata.filter((item) => item.created_by === user);

  useEffect(() => {
    dispatch(getJobonBoarding());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setUsers(filteredData);
      const statuses = [
        "All",
        ...new Set(filteredData.map((item) => item.Status).filter(Boolean)),
      ];
      setUniqueStatuses(statuses);
    }
  }, [fnddata, filteredData]);

  const openAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobOnBordingModal = () => {
    setIsAddJobOnBordingModalVisible(false);
  };
  const editfunction = (idd) => {
    setIdd(idd);
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

  // Update the getFilteredOnboarding function to include status filtering
  const getFilteredOnboarding = () => {
    if (!filteredData) return [];

    let filtered = [...filteredData];

    // Text search filter
    if (searchText) {
      filtered = filtered.filter((onboarding) => {
        return (
          onboarding.Interviewer?.toLowerCase().includes(
            searchText.toLowerCase()
          ) ||
          onboarding.Status?.toLowerCase().includes(searchText.toLowerCase()) ||
          onboarding.JobType?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    // Status filter from dropdown
    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter(
        (onboarding) =>
          onboarding.Status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Date filter
    if (selectedDate) {
      const filterDate = dayjs(selectedDate).format("YYYY-MM-DD");
      filtered = filtered.filter((onboarding) => {
        return (
          dayjs(onboarding.JoiningDate).format("YYYY-MM-DD") === filterDate
        );
      });
    }

    return filtered;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearch = () => {
    message.success("Search completed");
  };

  //// permission handling
  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  // Get permissions for job onboarding
  const jobOnboardingPermissions =
    parsedPermissions["extra-hrm-jobs-jobonbording"]?.[0]?.permissions || [];

  // Define permission checks
  const canView =
    whorole === "super-admin" ||
    whorole === "client" ||
    jobOnboardingPermissions.includes("view");
  const canCreate =
    whorole === "super-admin" ||
    whorole === "client" ||
    jobOnboardingPermissions.includes("create");
  const canUpdate =
    whorole === "super-admin" ||
    whorole === "client" ||
    jobOnboardingPermissions.includes("update");
  const canDelete =
    whorole === "super-admin" ||
    whorole === "client" ||
    jobOnboardingPermissions.includes("delete");

  ///endpermission

  const deleteUser = (userId) => {
    dispatch(deleteJobonBoarding(userId)).then(() => {
      dispatch(getJobonBoarding());
      setUsers(users.filter((item) => item.id !== userId));
    });
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

  const getDropdownItems = (row) => {
    const items = [];

    if (canUpdate) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfunction(row.id),
      });
    }

    if (canDelete) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(row.id),
        danger: true,
      });
    }

    return items;
  };

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
      render: (text) => (
        <span>{text ? dayjs(text).format("DD-MM-YYYY") : "-"}</span>
      ),
      sorter: (a, b) =>
        dayjs(a.JoiningDate).unix() - dayjs(b.JoiningDate).unix(),
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
          <Dropdown
            menu={{ items: getDropdownItems(elm) }}
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
                placeholder="Search name, status, job type..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="DD-MM-YYYY"
              placeholder="Filter by Joining Date"
              className="w-100"
              allowClear={true}
              style={{ minWidth: "200px" }}
            />
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              defaultValue="All"
              style={{ minWidth: "120px" }}
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
          {canCreate && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddJobOnBordingModal}
            >
              <PlusOutlined />
              <span>New</span>
            </Button>
          )}

          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        {canView && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredOnboarding()}
            rowKey="id"
            pagination={{
              total: getFilteredOnboarding().length,
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
        <EditJobOnBording onClose={closeEditJobOnBordingModal} idd={idd} />
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

  .ant-picker {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    .ant-picker {
      width: 100%;
    }
  }

  .ant-select {
    min-width: 120px;
  }

  @media (max-width: 768px) {
    .ant-picker,
    .ant-select {
      width: 100%;
    }
  }
`;

const JobOnBordingListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobOnBordingList />
  </>
);

export default JobOnBordingListWithStyles;
