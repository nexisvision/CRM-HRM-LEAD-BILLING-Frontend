import React, { useEffect, useState } from "react";
import { Card, Table, Input, Button, Modal, message, Dropdown } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import { useNavigate } from "react-router-dom";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteBranch, getBranch } from "./BranchReducer/BranchSlice";
import { GetUsers } from "../../Users/UserReducers/UserSlice";

const BranchList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);
  const [isEditBranchModalVisible, setIsEditBranchModalVisible] =
    useState(false);
  const [dept, setDept] = useState("");
  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState("");
  const tabledata = useSelector((state) => state.Branch);

  useEffect(() => {
    dispatch(getBranch());
    dispatch(GetUsers());
  }, [dispatch]);

  const alluserdata = useSelector((state) => state.Users.Users.data);

  useEffect(() => {
    if (tabledata && tabledata.Branch && tabledata.Branch.data) {
      const branchData = Array.isArray(tabledata.Branch.data)
        ? tabledata.Branch.data
        : [];
      setUsers(branchData);
    }
  }, [tabledata]);

  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];

  let branchPermissions = [];

  if (
    parsedPermissions["extra-hrm-branch"] &&
    parsedPermissions["extra-hrm-branch"][0]?.permissions
  ) {
    branchPermissions = parsedPermissions["extra-hrm-branch"][0].permissions;
  }

  const canView =
    whorole === "super-admin" ||
    whorole === "client" ||
    branchPermissions.includes("view");
  const canCreate =
    whorole === "super-admin" ||
    whorole === "client" ||
    branchPermissions.includes("create");
  const canUpdate =
    whorole === "super-admin" ||
    whorole === "client" ||
    branchPermissions.includes("update");
  const canDelete =
    whorole === "super-admin" ||
    whorole === "client" ||
    branchPermissions.includes("delete");

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  const openEditBranchModal = () => {
    setIsEditBranchModalVisible(true);
  };

  const closeEditBranchModal = () => {
    setIsEditBranchModalVisible(false);
  };

  const handleParticularBranchModal = () => {
    navigate("/app/hrm/department/particulardepartment", {
      state: { user: selectedUser },
    });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredBranches = () => {
    if (!Array.isArray(users)) return [];

    if (!searchText) return users;

    return users.filter((branch) => {
      return branch?.branchName
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    });
  };

  const deleteUser = (userId) => {
    dispatch(deleteBranch(userId))
      .then(() => {
        dispatch(getBranch());
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        message.error("Failed to update branch.");
        console.error("Edit API error:", error);
      });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Branch"); // Append the sheet to the workbook

      writeFile(wb, "BranchData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editDept = (Deptid) => {
    openEditBranchModal();
    setDept(Deptid);
    setIdd(Deptid);
  };

  const getDropdownItems = (row) => {
    const items = [];

    if (canView) {
      items.push(
        {
          key: "view",
          icon: <EyeOutlined />,
          label: "View Details",
          onClick: handleParticularBranchModal,
        },
        {
          key: "pin",
          icon: <PushpinOutlined />,
          label: "Pin",
          onClick: () => showUserProfile(row),
        }
      );
    }

    if (canUpdate) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editDept(row.id),
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
      title: "Branch",
      dataIndex: "branchName",
      sorter: (a, b) => a.branchName.length - b.branchName.length,
    },
    {
      title: "Branch Manager",
      dataIndex: "branchManager",
      render: (branchManagerId) => {
        const manager = alluserdata?.find(
          (item) => item?.id === branchManagerId
        );
        return manager ? (
          <div className="manager-cell">
            <span className="manager-name">
              {manager.username || "Unknown"}
            </span>
            <span className="role-badge">
              {manager.Role?.role_name || 'No Role'}
            </span>
          </div>
        ) : (
          "Unknown"
        );
      },
      sorter: (a, b) => {
        const nameA =
          alluserdata?.find((item) => item?.id === a?.branchManager)
            ?.username || "";
        const nameB =
          alluserdata?.find((item) => item?.id === b?.branchManager)
            ?.username || "";
        return nameA?.length - nameB?.length;
      },
    },
    {
      title: "Address",
      dataIndex: "branchAddress",
      sorter: (a, b) => a.branchAddress.length - b.branchAddress.length,
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
              placeholder="Search branch name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
        </Flex>
        <Flex gap="7px">
          {canCreate && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddBranchModal}
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
        {canView && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredBranches()}
            rowKey="id"
            pagination={{
              total: getFilteredBranches()?.length || 0,
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

      {/* Add Department Modal */}
      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        title="Edit Branch"
        visible={isEditBranchModalVisible}
        onCancel={closeEditBranchModal}
        footer={null}
        width={800}
      >
        <EditBranch onClose={closeEditBranchModal} comnyid={dept} idd={idd} />
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
    .ant-input-affix-wrapper {
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

  .manager-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .manager-name {
    font-weight: 500;
    color: #2c3e50;
  }

  .role-badge {
    padding: 2px 8px;
    background-color: #f0f7ff;
    border: 1px solid #e1effe;
    border-radius: 12px;
    font-size: 12px;
    color: #3b82f6;
    font-weight: 500;
    white-space: nowrap;
  }
`;

const BranchListWithStyles = () => (
  <>
    <style>{styles}</style>
    <BranchList />
  </>
);

export default BranchListWithStyles;
