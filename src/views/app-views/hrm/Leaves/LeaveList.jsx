import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  message,
  Button,
  Modal,
  DatePicker,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddLeave from "./AddLeave";
import { utils, writeFile } from "xlsx";
import ViewLeave from "./ViewLeave";
import EditLeave from "./EditLeave";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { DeleteLea, GetLeave } from "./LeaveReducer/LeaveSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import axios from "axios";
import { env } from "configs/EnvironmentConfig";
const { RangePicker } = DatePicker;

const LeaveList = () => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddLeaveModalVisible, setIsAddLeaveModalVisible] = useState(false);
  const [isViewLeaveModalVisible, setIsViewLeaveModalVisible] = useState(false);
  const [isEditLeaveModalVisible, setIsEditLeaveModalVisible] = useState(false);
  const [editid, setEditid] = useState(null);
  const [users, setUsers] = useState([]); // Changed to empty array instead of userData
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const tabledata = useSelector((state) => state.Leave);
  const openAddLeaveModal = () => {
    setIsAddLeaveModalVisible(true);
  };
  const closeAddLeaveModal = () => {
    setIsAddLeaveModalVisible(false);
  };
  const closeViewLeaveModal = () => {
    setIsViewLeaveModalVisible(false);
  };

  const openEditLeaveModal = () => {
    setIsEditLeaveModalVisible(true);
  };
  const closeEditLeaveModal = () => {
    setIsEditLeaveModalVisible(false);
  };
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredLeaves = () => {
    if (!users) return [];

    let result = [...users];

    if (searchText) {
      result = result.filter(
        (leave) =>
          leave.leaveType?.toLowerCase().includes(searchText.toLowerCase()) ||
          leave.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
          leave.status?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).startOf("day");
      const endDate = dayjs(dateRange[1]).endOf("day");

      result = result.filter((leave) => {
        const leaveStartDate = dayjs(leave.startDate);
        const leaveEndDate = dayjs(leave.endDate);
        return (
          (leaveStartDate.isAfter(startDate) ||
            leaveStartDate.isSame(startDate)) &&
          (leaveEndDate.isBefore(endDate) || leaveEndDate.isSame(endDate))
        );
      });
    }

    return result;
  };

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson = [];

  if (parsedPermissions["extra-hrm-leave-leavelist"]) {
    allpermisson =
      parsedPermissions["extra-hrm-leave-leavelist"][0]?.permissions || [];
  }

  const canView =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson.includes("view");
  const canCreate =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson.includes("create");
  const canUpdate =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson.includes("update");
  const canDelete =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson.includes("delete");

  ///endpermission

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteLea(userId));
      await dispatch(GetLeave());
      setUsers(users.filter((item) => item.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Leave"); // Append the sheet to the workbook

      writeFile(wb, "LeaveData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  useEffect(() => {
    dispatch(GetLeave());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.Leave && tabledata.Leave.data) {
      const filteredData = tabledata.Leave.data;
      setUsers(filteredData);
    }
  }, [tabledata]);

  const editleave = (id) => {
    openEditLeaveModal();
    setEditid(id);
  };

  const functionleaveok = async (id, status) => {
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.put(
        `${env.API_ENDPOINT_URL}/leaves/approve/${id}`,
        {
          status: status,
          remarks:
            status === "approved" ? "Leave approved." : "Leave rejected.",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(GetLeave());
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const getDropdownItems = (row) => {
    const items = [];

    if (canUpdate) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editleave(row.id),
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
      title: "created_by",
      dataIndex: "created_by",
      render: (_, record) => <div className="d-flex">{record.created_by}</div>,
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
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
      title: "Leave Reason",
      dataIndex: "reason",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },

    {
      title: "Approval Actions",
      dataIndex: "approval",
      render: (_, record) => {
        const handleApprove = () => {
          Modal.confirm({
            title: "Approve Leave",
            content: "Are you sure you want to approve this leave request?",
            okText: "Yes",
            okType: "primary",
            cancelText: "No",
            onOk: async () => {
              await functionleaveok(record.id, "approved");
              message.success("Leave approved successfully");
            },
          });
        };

        const handleReject = () => {
          Modal.confirm({
            title: "Reject Leave",
            content: "Are you sure you want to reject this leave request?",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
              await functionleaveok(record.id, "rejected");
              message.error("Leave rejected");
            },
          });
        };

        const isActionTaken =
          record.status === "approved" || record.status === "rejected";

        return (
          <Flex gap="8px" justifyContent="center">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600"
              title="Approve"
              disabled={isActionTaken} // Disable if action is taken
            />
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              size="small"
              onClick={handleReject}
              title="Reject"
              disabled={isActionTaken}
            />
          </Flex>
        );
      },
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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
                placeholder="Search leave details..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                allowClear
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <RangePicker
              onChange={handleDateRangeChange}
              value={dateRange}
              format="DD-MM-YYYY"
              placeholder={["Start Date", "End Date"]}
              allowClear
              style={{ width: "280px" }}
            />
          </div>
        </Flex>
        <Flex gap="7px">
          {canCreate && (
            <Button type="primary" className="ml-2" onClick={openAddLeaveModal}>
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
        {canView && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredLeaves()}
            rowKey="id"
            pagination={{
              total: getFilteredLeaves().length,
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
        title="Add Leave"
        visible={isAddLeaveModalVisible}
        onCancel={closeAddLeaveModal}
        footer={null}
        width={800}
      >
        <AddLeave onClose={closeAddLeaveModal} />
      </Modal>
      <Modal
        title="Edit Leave"
        visible={isEditLeaveModalVisible}
        onCancel={closeEditLeaveModal}
        footer={null}
        width={800}
      >
        <EditLeave onClose={closeEditLeaveModal} editid={editid} />
      </Modal>

      <Modal
        title="Leave"
        visible={isViewLeaveModalVisible}
        onCancel={closeViewLeaveModal}
        footer={null}
        width={800}
      >
        <ViewLeave onClose={closeViewLeaveModal} editid={editid} />
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

  .bg-green-500 {
    background-color: #10B981;
    border-color: #10B981;
  }

  .bg-green-500:hover {
    background-color: #059669;
    border-color: #059669;
  }

  .ant-btn-primary.bg-green-500:hover {
    background-color: #059669;
    border-color: #059669;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ant-btn[title] {
    position: relative;
  }

  .ant-btn[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
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

const LeaveListWithStyles = () => (
  <>
    <style>{styles}</style>
    <LeaveList />
  </>
);

export default LeaveListWithStyles;
