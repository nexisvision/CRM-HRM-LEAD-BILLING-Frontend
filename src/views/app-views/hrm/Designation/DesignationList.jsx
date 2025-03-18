import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Button,
  Input,
  message,
  Modal,
  Select,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import { useNavigate } from "react-router-dom";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddDesignation from "./AddDesignation";
import { utils, writeFile } from "xlsx";
import ParticularDesignation from "./ParticularDesignation";
import EditDesignation from "./EditDesignation";
import { useDispatch, useSelector } from "react-redux";
import { DeleteDes, getDes } from "./DesignationReducers/DesignationSlice";
import { getBranch } from "../Branch/BranchReducer/BranchSlice";

const { Option } = Select;

const DesignationList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddDesignationModalVisible, setIsAddDesignationModalVisible] =
    useState(false);
  const [isEditDesignationModalVisible, setIsEditDesignationModalVisible] =
    useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Designation);

  const [id, setId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");

  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);

  const userBranches = branchData.filter(
    (branch) => branch.created_by === user
  );

  useEffect(() => {
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  // Updated permission checks
  const designationPermissions =
    parsedPermissions["extra-hrm-designation"]?.[0]?.permissions || [];

  const canViewDesignation =
    whorole === "super-admin" ||
    whorole === "client" ||
    designationPermissions.includes("view");
  const canCreateDesignation =
    whorole === "super-admin" ||
    whorole === "client" ||
    designationPermissions.includes("create");
  const canEditDesignation =
    whorole === "super-admin" ||
    whorole === "client" ||
    designationPermissions.includes("update");
  const canDeleteDesignation =
    whorole === "super-admin" ||
    whorole === "client" ||
    designationPermissions.includes("delete");

  useEffect(() => {
    if (tabledata && tabledata.Designation && tabledata.Designation.data) {
      const filteredData = tabledata.Designation.data.filter(
        (item) => item.created_by === user
      );
      setUsers(filteredData);
    }
  }, [tabledata]);

  const openAddDesignationModal = () => {
    setIsAddDesignationModalVisible(true);
  };

  const closeAddDesignationModal = () => {
    setIsAddDesignationModalVisible(false);
  };

  const openEditDesignationModal = () => {
    setIsEditDesignationModalVisible(true);
  };

  const closeEditDesignationModal = () => {
    setIsEditDesignationModalVisible(false);
  };

  const handleParticularDesignationModal = () => {
    navigate("/app/hrm/designation/particulardesignation", {
      state: { user: selectedUser },
    });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getBranchNameById = (branchId) => {
    const branch = branchData.find((branch) => branch.id === branchId);
    return branch ? branch.branchName : "N/A";
  };

  const getFilteredDesignations = () => {
    if (!users) return [];

    let filtered = users;

    if (searchText) {
      filtered = filtered.filter((designation) =>
        designation.designation_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    if (selectedBranch !== "all") {
      filtered = filtered.filter(
        (designation) => designation.branch === selectedBranch
      );
    }

    return filtered;
  };

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
  };

  const deleteUser = (userId) => {
    dispatch(DeleteDes(userId))
      .then(() => {
        dispatch(getDes());
        setUsers(users.filter((item) => item.id !== userId));
        navigate("/app/hrm/designation");
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Designation"); // Append the sheet to the workbook

      writeFile(wb, "DesignationData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editfun = (id) => {
    openEditDesignationModal();
    setId(id);
  };

  const getDropdownItems = (elm) => {
    const items = [];

    if (canEditDesignation) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(elm.id),
      });
    }

    if (canDeleteDesignation) {
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

  const tableColumns = [
    {
      title: "Designation",
      dataIndex: "designation_name",
      sorter: {
        compare: (a, b) =>
          a.designation_name.length - b.designation_name.length,
      },
      render: (text) => <span className="designation-cell">{text}</span>,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      render: (branchId) => (
        <span className="branch-cell">{getBranchNameById(branchId)}</span>
      ),
      sorter: {
        compare: (a, b) => {
          const branchNameA = getBranchNameById(a.branch).toLowerCase();
          const branchNameB = getBranchNameById(b.branch).toLowerCase();
          return branchNameA.localeCompare(branchNameB);
        },
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
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

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search designation..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              placeholder="Filter by branch"
              onChange={handleBranchChange}
              value={selectedBranch}
              style={{ width: 200 }}
              className="branch-select"
            >
              <Option value="all">All Branches</Option>
              {userBranches.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          {canCreateDesignation && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddDesignationModal}
            >
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
        {canViewDesignation && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredDesignations()}
            rowKey="id"
            pagination={{
              total: getFilteredDesignations().length,
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
        title="Add Designation"
        visible={isAddDesignationModalVisible}
        onCancel={closeAddDesignationModal}
        footer={null}
        width={800}
      >
        <AddDesignation onClose={closeAddDesignationModal} />
      </Modal>

      <Modal
        title="Edit Designation"
        visible={isEditDesignationModalVisible}
        onCancel={closeEditDesignationModal}
        footer={null}
        width={800}
      >
        <EditDesignation onClose={closeEditDesignationModal} id={id} />
      </Modal>
    </Card>
  );
};

// Update styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .branch-select {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus,
  .branch-select:hover,
  .branch-select:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    .search-input,
    .branch-select,
    .ant-input-group {
      width: 100%;
      margin-bottom: 1rem;
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

  .ant-dropdown-trigger {
    transition: all 0.3s;
  }

  .ant-dropdown-trigger:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .ant-menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
  }

  .ant-menu-item:hover {
    background-color: #f0f7ff;
  }

  .ant-menu-item-danger:hover {
    background-color: #fff1f0;
  }

  .ant-table-row {
    transition: all 0.3s;
  }

  .ant-table-row:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .designation-cell {
    font-weight: 500;
    
  }

  .branch-cell {
    color: #666;
    font-size: 0.9em;
  }

  .ant-select-selector {
    transition: all 0.3s !important;
  }

  .ant-select-selector:hover {
    border-color: #40a9ff !important;
  }

  .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ant-modal-content {
    border-radius: 8px;
  }
`;

const DesignationListWithStyles = () => (
  <>
    <style>{styles}</style>
    <DesignationList />
  </>
);

export default DesignationListWithStyles;
