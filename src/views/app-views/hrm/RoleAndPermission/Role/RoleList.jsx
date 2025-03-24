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
  EyeOutlined,
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
  const [isPermissionModalVisible, setIsPermissionModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
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

  const whorole = roleData?.role_name;

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

  // Add all permission titles mapping from AddRole.jsx
  const permissionTitles = {
    // CRM Module
    'dashboards-leadcards': 'LeadCards',
    'dashboards-lead': 'Leads',
    'dashboards-deal': 'Deals',
    'dashboards-proposal': 'Proposal',
    'dashboards-task': 'Task',
    'dashboards-TaskCalendar': 'Task Calendar',
    'dashboards-systemsetup': 'CRM System Setup',
    'dashboards-mail': 'Mail',
    'dashboards-chat': 'Chat',
    'dashboards-calendar': 'Calendar',
    'extra-pages-customersupports-ticket': 'Ticket Supports',

    // Staff Module
    'extra-users-list': 'Users',
    'extra-users-client-list': 'Clients',

    // Project Module
    'dashboards-project-list': 'Project',
    'dashboards-project-Contract': 'Contract',

    // HRM Module
    'extra-hrm-employee': 'Employee',
    'extra-hrm-payroll-salary': 'Salary',
    'extra-hrm-performance-indicator': 'Indicator',
    'extra-hrm-performance-appraisal': 'Appraisal',
    'extra-hrm-role': 'Role',
    'extra-hrm-designation': 'Designation',
    'extra-hrm-department': 'Department',
    'extra-hrm-branch': 'Branch',
    'extra-hrm-attendance-attendancelist': 'Attendance',
    'extra-hrm-leave-leavelist': 'Leave Management',
    'extra-hrm-meeting': 'Meeting',
    'extra-hrm-announcement': 'Announcement',
    'extra-hrm-jobs-joblist': 'Job',
    'extra-hrm-jobs-jobcandidate': 'Job Candidate',
    'extra-hrm-jobs-jobonbording': 'Job On-Bording',
    'extra-hrm-jobs-jobapplication': 'Job Application',
    'extra-hrm-jobs-jobofferletter': 'Job Offer Letter',
    'extra-hrm-jobs-interview': 'Job Interviews',
    'extra-hrm-document': 'Document',
    'extra-hrm-trainingSetup': 'TrainingSetup',

    // Account Module
    'dashboards-sales-customer': 'Customer',
    'dashboards-sales-invoice': 'Invoice',
    'dashboards-purchase-billing': 'Billing',
    'dashboards-purchase-vendor': 'Vendor',
    'dashboards-purchase-debitnote': 'Debit Note',
    'dashboards-sales-revenue': 'Revenue',
    'dashboards-sales-estimates': 'Estimates',
    'dashboards-sales-creditnotes': 'Credit Notes',
    'dashboards-banking-account': 'Account',
    'dashboards-banking-transfer': 'Transfer'
  };

  const renderPermissions = (permissions) => {
    try {
      if (!permissions) return <span className="text-gray-400">No permissions assigned</span>;

      const parsedPermissions = typeof permissions === "string" 
        ? JSON.parse(permissions) 
        : permissions;

      return (
        <div className="permissions-wrapper">
          {Object.entries(parsedPermissions).map(([key, permissionArray]) => (
            <div key={key} className="permission-card">
              <div className="permission-header">
                <span className="permission-module-name">
                  {permissionTitles[key] || key}
                </span>
              </div>
              <div className="permission-badges">
                {permissionArray[0].permissions.map((action) => (
                  <span
                    key={`${key}-${action}`}
                    className={`badge ${getActionClass(action)}`}
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } catch (error) {
      console.error("Error parsing permissions:", error);
      return <span className="text-red-500">Invalid permissions format</span>;
    }
  };

  const getActionClass = (action) => {
    switch (action) {
      case 'create':
        return 'badge-create';
      case 'view':
        return 'badge-view';
      case 'update':
        return 'badge-update';
      case 'delete':
        return 'badge-delete';
      default:
        return '';
    }
  };

  const showPermissionModal = (record) => {
    setSelectedRole(record);
    setIsPermissionModalVisible(true);
  };

  const subModules = {
    CRM: [
      { key: 'dashboards-leadcards', title: 'LeadCards' },
      { key: 'dashboards-lead', title: 'Leads' },
      { key: 'dashboards-deal', title: 'Deals' },
      { key: 'dashboards-proposal', title: 'Proposal' },
      { key: 'dashboards-task', title: 'Task' },
      { key: 'dashboards-TaskCalendar', title: 'Task Calendar' },
      { key: 'dashboards-systemsetup', title: 'CRM System Setup' },
      { key: 'dashboards-mail', title: 'Mail' },
      { key: 'dashboards-chat', title: 'Chat' },
      { key: 'dashboards-calendar', title: 'Calendar' },
      { key: 'extra-pages-customersupports-ticket', title: 'Ticket Supports' },
    ],
    Staff: [
      { key: 'extra-users-list', title: 'Users' },
      { key: 'extra-users-client-list', title: 'Clients' },
    ],
    Project: [
      { key: 'dashboards-project-list', title: 'Project' },
      { key: 'dashboards-project-Contract', title: 'Contract' },
    ],
    HRM: [
      { key: 'extra-hrm-employee', title: 'Employee' },
      { key: 'extra-hrm-payroll-salary', title: 'Salary' },
      { key: 'extra-hrm-performance-indicator', title: 'Indicator' },
      { key: 'extra-hrm-performance-appraisal', title: 'Appraisal' },
      { key: 'extra-hrm-role', title: 'Role' },
      { key: 'extra-hrm-designation', title: 'Designation' },
      { key: 'extra-hrm-department', title: 'Department' },
      { key: 'extra-hrm-branch', title: 'Branch' },
      { key: 'extra-hrm-attendance-attendancelist', title: 'Attendance' },
      { key: 'extra-hrm-leave-leavelist', title: 'Leave Management' },
      { key: 'extra-hrm-meeting', title: 'Meeting' },
      { key: 'extra-hrm-announcement', title: 'Announcement' },
      { key: 'extra-hrm-jobs-joblist', title: 'Job' },
      { key: 'extra-hrm-jobs-jobcandidate', title: 'Job Candidate' },
      { key: 'extra-hrm-jobs-jobonbording', title: 'Job On-Bording' },
      { key: 'extra-hrm-jobs-jobapplication', title: 'Job Application' },
      { key: 'extra-hrm-jobs-jobofferletter', title: 'Job Offer Letter' },
      { key: 'extra-hrm-jobs-interview', title: 'Job Interviews' },
      { key: 'extra-hrm-document', title: 'Document' },
      { key: 'extra-hrm-trainingSetup', title: 'TrainingSetup' }
    ],
    Account: [
      { key: 'dashboards-sales-customer', title: 'Customer' },
      { key: 'dashboards-sales-invoice', title: 'Invoice' },
      { key: 'dashboards-purchase-billing', title: 'Billing' },
      { key: 'dashboards-purchase-vendor', title: 'Vendor' },
      { key: 'dashboards-purchase-debitnote', title: 'Debit Note' },
      { key: 'dashboards-sales-revenue', title: 'Revenue' },
      { key: 'dashboards-sales-estimates', title: 'Estimates' },
      { key: 'dashboards-sales-creditnotes', title: 'Credit Notes' },
      { key: 'dashboards-banking-account', title: 'Account' },
      { key: 'dashboards-banking-transfer', title: 'Transfer' },
    ],
  };

  const PermissionModal = ({ visible, onClose, roleData }) => {
    const [activeTab, setActiveTab] = useState('Staff');
    
    const modules = [
      'Staff',
      'CRM',
      'Project',
      'HRM',
      'Account',
    ];

    const getPermissionsForModule = (moduleKey) => {
      try {
        if (!roleData?.permissions) return {};
        const permissions = typeof roleData.permissions === 'string' 
          ? JSON.parse(roleData.permissions) 
          : roleData.permissions;
        
        return permissions;
      } catch (error) {
        console.error('Error parsing permissions:', error);
        return {};
      }
    };

    return (
      <Modal
        title={`Permissions - ${roleData?.role_name}`}
        visible={visible}
        onCancel={onClose}
        width={800}
        footer={null}
      >
        <div className="permission-modal">
          <div className="module-tabs">
            {modules.map(module => (
              <Button
                key={module}
                type={activeTab === module ? 'primary' : 'default'}
                onClick={() => setActiveTab(module)}
                className="module-tab-button"
              >
                {module}
              </Button>
            ))}
          </div>

          <table className="permission-table">
            <thead>
              <tr>
                <th>Module</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {subModules[activeTab]?.map(submodule => {
                const modulePermissions = getPermissionsForModule(submodule.key);
                const permissions = modulePermissions[submodule.key]?.[0]?.permissions || [];

                return (
                  <tr key={submodule.key}>
                    <td>{submodule.title}</td>
                    <td>
                      <div className="permission-badges">
                        {['view', 'create', 'update', 'delete'].map(action => (
                          <span
                            key={action}
                            className={`permission-badge ${
                              permissions.includes(action) ? 'active' : 'inactive'
                            }`}
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Modal>
    );
  };

  const tableColumns = [
    {
      title: "Role",
      dataIndex: "role_name",
      sorter: {
        compare: (a, b) => a.role_name.localeCompare(b.role_name),
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EyeOutlined />}
          onClick={() => showPermissionModal(record)}
        >
          View Permissions
        </Button>
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
    <Card bodyStyle={{ padding: "20px" }}>
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

      <PermissionModal 
        visible={isPermissionModalVisible}
        onClose={() => setIsPermissionModalVisible(false)}
        roleData={selectedRole}
      />

      <style jsx>{`
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

        .permissions-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 8px 0;
        }

        .permission-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          min-width: 200px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .permission-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-color: #d1d5db;
        }

        .permission-header {
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        .permission-module-name {
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .permission-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          text-transform: capitalize;
          letter-spacing: 0.3px;
        }

        .badge-create {
          background-color: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .badge-view {
          background-color: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .badge-update {
          background-color: #fffbeb;
          color: #b45309;
          border: 1px solid #fcd34d;
        }

        .badge-delete {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        @media (max-width: 768px) {
          .permission-card {
            min-width: 100%;
          }

          .permissions-wrapper {
            gap: 8px;
          }
        }

        /* Hover effects for badges */
        .badge:hover {
          filter: brightness(95%);
        }

        /* Animation for new permissions */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .permission-card {
          animation: fadeIn 0.3s ease-out;
        }

        .permission-modal {
          padding: 20px;
        }

        .module-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .module-tab-button {
          min-width: 100px;
          text-align: center;
        }

        .permission-table {
          width: 100%;
          border-collapse: collapse;
        }

        .permission-table th,
        .permission-table td {
          border: 1px solid #f0f0f0;
          padding: 12px;
        }

        .permission-table th {
          background-color: #fafafa;
          font-weight: 500;
        }

        .permission-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .permission-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .permission-badge.active {
          background-color: #e6f7ff;
          color: #1890ff;
          border: 1px solid #91d5ff;
        }

        .permission-badge.inactive {
          background-color: #f5f5f5;
          color: #999;
          border: 1px solid #d9d9d9;
        }

        @media (max-width: 768px) {
          .module-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Card>
  );
};

export default RoleList;
