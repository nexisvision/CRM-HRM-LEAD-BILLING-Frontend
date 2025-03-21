import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Select,
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
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddIndicator from "./AddIndicator";
import EditIndicator from "./EditIndicator";
import { utils, writeFile } from "xlsx";
import ViewIndicator from "./ViewIndicator";
import {
  deleteIndicator,
  getIndicators,
} from "./IndicatorReducers/indicatorSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { getBranch } from "../../Branch/BranchReducer/BranchSlice";
import { getDept } from "../../Department/DepartmentReducers/DepartmentSlice";
import { getDes } from "../../Designation/DesignationReducers/DesignationSlice";

const { Option } = Select;

const IndicatorList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [id, setId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddIndicatorModalVisible, setIsAddIndicatorModalVisible] =
    useState(false);
  const [isEditIndicatorModalVisible, setIsEditIndicatorModalVisible] =
    useState(false);
  const [isViewIndicatorModalVisible, setIsViewIndicatorModalVisible] =
    useState(false);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();

  const openAddIndicatorModal = () => setIsAddIndicatorModalVisible(true);
  const closeAddIndicatorModal = () => setIsAddIndicatorModalVisible(false);
  const openEditIndicatorModal = () => setIsEditIndicatorModalVisible(true);
  const closeEditIndicatorModal = () => setIsEditIndicatorModalVisible(false);
  const closeViewIndicatorModal = () => setIsViewIndicatorModalVisible(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.indicator);

  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const departmentData = useSelector(
    (state) => state.Department?.Department?.data || []
  );
  const designationData = useSelector(
    (state) => state.Designation?.Designation?.data || []
  );

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

  if (
    parsedPermissions["extra-hrm-performance-indicator"] &&
    parsedPermissions["extra-hrm-performance-indicator"][0]?.permissions
  ) {
    allpermisson =
      parsedPermissions["extra-hrm-performance-indicator"][0].permissions;
  }

  const canCreateIndicator =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson?.includes("create");
  const canEditIndicator =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson?.includes("update");
  const canDeleteIndicator =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson?.includes("delete");
  const canViewIndicator =
    whorole === "super-admin" ||
    whorole === "client" ||
    allpermisson?.includes("view");

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getIndicators());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata?.Indicators?.data) {
      const mappedData = tabledata.Indicators.data
        .filter((indicator) => indicator.created_by === user) // Filter by created_by matching the username
        .map((indicator) => {
          const branch =
            branchData.find((b) => b.id === indicator.branch)?.branchName ||
            "N/A";
          const department =
            departmentData.find((d) => d.id === indicator.department)
              ?.department_name || "N/A";
          const designation =
            designationData.find((des) => des.id === indicator.designation)
              ?.designation_name || "N/A";

          return {
            ...indicator,
            branch,
            department,
            designation,
          };
        });
      setUsers(mappedData);
    }
  }, [tabledata, departmentData, designationData, user, branchData]);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Indicator"); // Append the sheet to the workbook

      writeFile(wb, "IndicatorData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editfun = (id) => {
    openEditIndicatorModal();
    setId(id);
  };

  const deleteIndicators = (userId) => {
    dispatch(deleteIndicator(userId))
      .then(() => {
        dispatch(getIndicators());
        setUsers(users.filter((item) => item.id !== userId));
        navigate("/app/hrm/performance/indicator");
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  const getDropdownItems = (elm) => {
    const items = [];

    if (canEditIndicator) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(elm.id),
      });
    }

    if (canDeleteIndicator) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteIndicators(elm.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: "Designation",
      dataIndex: "designation",
      sorter: {
        compare: (a, b) => a.designation.length - b.designation.length,
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      sorter: {
        compare: (a, b) => a.department.length - b.department.length,
      },
    },

    {
      title: "Overall Rating",
      dataIndex: "overallRating",
      key: "overallRating",
      sorter: {
        compare: (a, b) => a.overallRating - b.overallRating,
      },
    },
    {
      title: "Business Process",
      dataIndex: "businessProcess",
      key: "businessProcess",
      sorter: {
        compare: (a, b) => a.businessProcess - b.businessProcess,
      },
    },
    {
      title: "Oral Communication",
      dataIndex: "oralCommunication",
      key: "oralCommunication",
      sorter: {
        compare: (a, b) => a.oralCommunication - b.oralCommunication,
      },
    },

    {
      title: "Leadership",
      dataIndex: "leadership",
      key: "leadership",
      sorter: {
        compare: (a, b) => a.leadership - b.leadership,
      },
    },

    {
      title: "Project Management",
      dataIndex: "projectManagement",
      key: "projectManagement",
      sorter: {
        compare: (a, b) => a.projectManagement - b.projectManagement,
      },
    },
    {
      title: "Allocating Resources",
      dataIndex: "allocatingResources",
      key: "allocatingResources",
      sorter: {
        compare: (a, b) => a.allocatingResources - b.allocatingResources,
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

  const getFilteredIndicators = () => {
    if (!users) return [];

    let filteredData = [...users];
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter((indicator) => {
        return (
          indicator.branch?.toLowerCase().includes(searchLower) ||
          indicator.department?.toLowerCase().includes(searchLower) ||
          indicator.designation?.toLowerCase().includes(searchLower) ||
          indicator.overallRating?.toString().includes(searchLower) ||
          indicator.businessProcess?.toString().includes(searchLower) ||
          indicator.oralCommunication?.toString().includes(searchLower) ||
          indicator.leadership?.toString().includes(searchLower) ||
          indicator.projectManagement?.toString().includes(searchLower) ||
          indicator.allocatingResources?.toString().includes(searchLower)
        );
      });
    }
    if (selectedBranch !== "all") {
      filteredData = filteredData.filter(
        (indicator) => indicator.branch === selectedBranch
      );
    }

    return filteredData;
  };

  const BranchFilter = () => (
    <Select
      style={{ width: 200 }}
      placeholder="Filter by Branch"
      value={selectedBranch}
      onChange={setSelectedBranch}
      className="mr-2"
    >
      <Option value="all">All Branches</Option>
      {branchData.map((branch) => (
        <Option key={branch.id} value={branch.branchName}>
          {branch.branchName}
        </Option>
      ))}
    </Select>
  );

  const checkIndicatorExists = (branch, department, designation) => {
    return users.some(indicator =>
      indicator.branch === branch &&
      indicator.department === department &&
      indicator.designation === designation
    );
  };

  const handleAddIndicator = (values) => {
    // Check if indicator already exists
    const exists = checkIndicatorExists(values.branch, values.department, values.designation);

    if (exists) {
      message.error('An indicator already exists for this branch, department, and designation combination.');
      return false;
    }

    // Proceed with adding the indicator
    return true;
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
            <Input
              placeholder="Search branch, department, designation..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <BranchFilter />
          </div>
        </Flex>
        <Flex gap="7px">
          {canCreateIndicator && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddIndicatorModal}
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
        {canViewIndicator && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredIndicators()}
            rowKey="id"
          />
        )}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      <Modal
        title="Add New Indicator"
        visible={isAddIndicatorModalVisible}
        onCancel={closeAddIndicatorModal}
        footer={null}
        width={1000}
      >
        <AddIndicator onClose={closeAddIndicatorModal} onValidate={handleAddIndicator} />
      </Modal>

      <Modal
        title="Edit Indicator"
        visible={isEditIndicatorModalVisible}
        onCancel={closeEditIndicatorModal}
        footer={null}
        width={1000}
      >
        <EditIndicator onClose={closeEditIndicatorModal} id={id} />
      </Modal>

      <Modal
        title="View Indicator"
        visible={isViewIndicatorModalVisible}
        onCancel={closeViewIndicatorModal}
        footer={null}
        width={1000}
      >
        <ViewIndicator onClose={closeViewIndicatorModal} />
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

  .ant-input-affix-wrapper {
    min-width: 250px;
  }

  .ant-select {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-affix-wrapper,
    .ant-select {
      width: 100%;
      min-width: unset;
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

  .ant-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-select:hover .ant-select-selector {
    border-color: #40a9ff;
  }

  .ant-select-focused .ant-select-selector {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }
`;

const IndicatorListWithStyles = () => (
  <>
    <style>{styles}</style>
    <IndicatorList />
  </>
);

export default IndicatorListWithStyles;
