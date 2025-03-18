import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Menu,
  Button,
  Input,
  message,
  Modal,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { useDispatch, useSelector } from "react-redux";
import AddRole from "./AddRole";
import {
  deleteRole,
  getRoles,
} from "../RoleAndPermissionReducers/RoleAndPermissionSlice";
import EditRole from "./EditRole";

const RoleList = () => {
  const [users, setUsers] = useState([]);
  const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState(false);
  const dispatch = useDispatch();

  const loginUser = useSelector((state) => state.user.loggedInUser);
  const tabledata = useSelector((state) => state.role.role.data);

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(tabledata) || !loginUser) return [];
    return tabledata.filter((item) => item.created_by === loginUser.username);
  }, [tabledata, loginUser]);

  const [searchText, setSearchText] = useState("");

  const closeEditRoleModal = () => {
    setIsEditRoleModalVisible(false);
  };

  const openEditRoleModal = (roleId) => {
    setSelectedRoleId(roleId);
    setIsEditRoleModalVisible(true);
  };

  const openAddRoleModal = () => {
    setIsAddRoleModalVisible(true);
  };

  const closeAddRoleModal = () => {
    setIsAddRoleModalVisible(false);
  };

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  const deleteRoles = (userId) => {
    dispatch(deleteRole(userId))
      .then(() => {
        dispatch(getRoles());
        message.success("Role Deleted successfully!");
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredRoles = () => {
    if (!users) return [];

    if (!searchText) return users;

    return users.filter((role) => {
      return (
        role.role_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        JSON.stringify(role.permissions)
          ?.toLowerCase()
          .includes(searchText.toLowerCase())
      );
    });
  };

  useEffect(() => {
    if (filteredData) {
      setUsers(filteredData);
    }
  }, [filteredData]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  let allpermisson;

  if (
    parsedPermissions["extra-hrm-role"] &&
    parsedPermissions["extra-hrm-role"][0]?.permissions
  ) {
    allpermisson = parsedPermissions["extra-hrm-role"][0].permissions;
  }

  const canCreateClient = allpermisson?.includes("create");
  const canDeleteClient = allpermisson?.includes("delete");
  const canViewClient = allpermisson?.includes("view");

  const getDropdownItems = (elm) => {
    const items = [];

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canCreateClient && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => openEditRoleModal(elm.id),
      });
    }

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      (canDeleteClient && whorole !== "super-admin" && whorole !== "client")
    ) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteRoles(elm.id),
        danger: true,
      });
    }

    return items;
  };

  const renderPermissions = (permissions) => {
    try {
      const parsedPermissions =
        permissions && typeof permissions === "string"
          ? JSON.parse(permissions)
          : {};

      return (
        <div className="permissions-container">
          {Object.keys(parsedPermissions).map((moduleKey) => (
            <div key={moduleKey} className="module-permissions">
              {parsedPermissions[moduleKey].map((permission) => (
                <div key={permission.key}>
                  {permission.permissions.map((action) => (
                    <span
                      key={`${permission.key}-${action}`}
                      className="permission-tag"
                    >
                      {`${permission.key.replace("extra-hrm-", "")} ${action}`}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error parsing permissions:", error);
      return "Invalid Permissions";
    }
  };

  const tableColumns = [
    {
      title: "Role",
      dataIndex: "role_name",
      sorter: {
        compare: (a, b) => a.role_name.length - b.role_name.length,
      },
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      render: (permissions) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {renderPermissions(permissions)}
        </div>
      ),
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
              placeholder="Search role name or permissions..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
        </Flex>
        <Flex gap="7px">
          {whorole === "super-admin" ||
          whorole === "client" ||
          (canCreateClient &&
            whorole !== "super-admin" &&
            whorole !== "client") ? (
            <Button type="primary" className="ml-2" onClick={openAddRoleModal}>
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
        {whorole === "super-admin" ||
        whorole === "client" ||
        (canViewClient && whorole !== "super-admin" && whorole !== "client") ? (
          <Table
            columns={tableColumns}
            dataSource={getFilteredRoles()}
            rowKey="id"
            pagination={{
              total: getFilteredRoles().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        ) : null}
      </div>

      <Modal
        title="Add Role"
        visible={isAddRoleModalVisible}
        onCancel={closeAddRoleModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <AddRole onClose={closeAddRoleModal} />
      </Modal>

      <Modal
        title="Edit Role"
        visible={isEditRoleModalVisible}
        onCancel={closeEditRoleModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditRole onClose={closeEditRoleModal} id={selectedRoleId} />
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

  .permission-button {
    margin: 2px;
    background-color: #3e79f7;
    color: white;
    transition: all 0.3s;
  }

  .permission-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(62, 121, 247, 0.2);
  }

  .permissions-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .module-permissions {
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 6px;
    background-color: rgba(62, 121, 247, 0.05);
  }

  .permission-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    margin: 2px;
    border-radius: 4px;
    background-color: #3e79f7;
    color: white;
    font-size: 12px;
    transition: all 0.3s;
  }

  .permission-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(62, 121, 247, 0.2);
  }
`;

const RoleListWithStyles = () => (
  <>
    <style>{styles}</style>
    <RoleList />
  </>
);

export default RoleListWithStyles;
