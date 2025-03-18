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
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  FileExcelOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddAppraisal from "./AddAppraisal";
import { utils, writeFile } from "xlsx";
import EditAppraisal from "./EditAppraisal";
import ViewAppraisal from "./ViewAppraisal";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { getBranch } from "../../Branch/BranchReducer/BranchSlice";
import {
  deleteAppraisal,
  getAppraisals,
} from "./AppraisalReducers/AppraisalSlice";

const { Option } = Select;

const AppraisalList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [id, setId] = useState(null);
  const [isAddAppraisalModalVisible, setIsAddAppraisalModalVisible] =
    useState(false);
  const [isEditAppraisalModalVisible, setIsEditAppraisalModalVisible] =
    useState(false);
  const [isViewAppraisalModalVisible, setIsViewAppraisalModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [searchText, setSearchText] = useState("");

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.appraisal);
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const employeeDaata = useSelector(
    (state) => state.employee?.employee?.data || []
  );

  const employeeDataa = employeeDaata.filter(
    (item) => item.created_by === user
  );
  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : [];

  let allpermisson = [];

  if (parsedPermissions["extra-hrm-performance-appraisal"]) {
    allpermisson =
      parsedPermissions["extra-hrm-performance-appraisal"][0]?.permissions ||
      [];
  }

  const canCreate = allpermisson?.includes("create");
  const canEdit = allpermisson?.includes("update");
  const canDelete = allpermisson?.includes("delete");
  const canView = allpermisson?.includes("view");

  ///endpermission

  const openAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(true);
  };

  const closeAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(false);
  };

  const openViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(true);
  };

  const closeViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(false);
  };

  const openEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(true);
  };

  const closeEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(false);
  };

  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAppraisals());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata?.Appraisals?.data) {
      const mappedData = tabledata.Appraisals.data
        .filter((item) => item.created_by === user)
        .map((appraisal) => {
          const branch =
            branchData.find((b) => b.id === appraisal.branch)?.branchName ||
            "N/A";
          const employee =
            employeeDataa.find((e) => e.id === appraisal.employee)?.username ||
            "N/A";

          return {
            ...appraisal,
            branch,
            employee,
          };
        });
      setUsers(mappedData);
    }
  }, [tabledata, branchData, employeeDataa, user]);

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Appraisal");

      writeFile(wb, "AppraisalData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const editfun = (id) => {
    openEditAppraisalModal();
    setId(id);
  };

  const deleteAppraisals = (userId) => {
    // setUsers(users.filter(item => item.id !== userId));
    // dispatch(DeleteDes(userId));
    // dispatch(getDes())
    // message.success({ content: `Deleted user ${userId}`, duration: 2 });

    dispatch(deleteAppraisal(userId))
      .then(() => {
        dispatch(getAppraisals());
        message.success("Appraisal Deleted successfully!");
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        // message.error('Failed to delete Indicator.');
        console.error("Edit API error:", error);
      });
  };

  const getDropdownItems = (elm) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || canView) {
      items.push({
        key: "view",
        icon: <EyeOutlined />,
        label: "View Details",
        onClick: openViewAppraisalModal,
      });
    }

    if (whorole === "super-admin" || whorole === "client" || canEdit) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(elm.id),
      });
    }

    if (whorole === "super-admin" || whorole === "client" || canDelete) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteAppraisals(elm.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: (a, b) => a.branch.length - b.branch.length,
    },

    {
      title: "Employee",
      dataIndex: "employee",
      sorter: (a, b) => a.employee.length - b.employee.length,
    },

    {
      title: "Overall Rating",
      dataIndex: "overallRating",
      key: "overallRating",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.overallRating - b.overallRating,
      },
    },

    {
      title: "Business Process",
      dataIndex: "businessProcess",
      key: "businessProcess",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.businessProcess - b.businessProcess,
      },
    },
    {
      title: "Oral Communication",
      dataIndex: "oralCommunication",
      key: "oralCommunication",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.oralCommunication - b.oralCommunication,
      },
    },

    {
      title: "Leadership",
      dataIndex: "leadership",
      key: "leadership",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.leadership - b.leadership,
      },
    },

    {
      title: "Project Management",
      dataIndex: "projectManagement",
      key: "projectManagement",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.projectManagement - b.projectManagement,
      },
    },
    {
      title: "Allocating Resources",
      dataIndex: "allocatingResources",
      key: "allocatingResources",
      // render: (rating) => <Rate disabled defaultValue={rating} />,
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

  const getFilteredAppraisals = () => {
    if (!users) return [];

    let filteredData = [...users];

    // Filter by employee
    if (selectedEmployee !== "all") {
      filteredData = filteredData.filter(
        (appraisal) => appraisal.employee === selectedEmployee
      );
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter((appraisal) => {
        return (
          appraisal.employee?.toLowerCase().includes(searchLower) ||
          appraisal.branch?.toLowerCase().includes(searchLower) ||
          appraisal.overallRating?.toString().includes(searchLower)
        );
      });
    }

    return filteredData;
  };

  const EmployeeFilter = () => (
    <Select
      style={{ width: 200 }}
      placeholder="Filter by Employee"
      value={selectedEmployee}
      onChange={setSelectedEmployee}
      className="mr-2"
    >
      <Option value="all">All Employees</Option>
      {employeeDataa.map((employee) => (
        <Option key={employee.id} value={employee.username}>
          {employee.username}
        </Option>
      ))}
    </Select>
  );

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
              placeholder="Search appraisals..."
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          {/* <div className="mr-md-3 mb-3">
            <Select
              style={{ width: 200 }}
              placeholder="Filter by Branch"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              className="mr-2"
            >
              <Option value="all">All Branches</Option>
              {branchData.map(branch => (
                <Option key={branch.id} value={branch.branchName}>
                  {branch.branchName}
                </Option>
              ))}
            </Select>
          </div> */}
          <div className="mr-md-3 mb-3">
            <EmployeeFilter />
          </div>
        </Flex>
        <Flex gap="7px">
          {(whorole === "super-admin" || whorole === "client" || canCreate) && (
            <Button type="primary" onClick={openAddAppraisalModal}>
              <PlusOutlined />
              New
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
        {(whorole === "super-admin" || whorole === "client" || canView) && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredAppraisals()}
            rowKey="id"
          />
        )}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* Add Employee Modal */}
      <Modal
        title="Add Appraisal"
        visible={isAddAppraisalModalVisible}
        onCancel={closeAddAppraisalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddAppraisal onClose={closeAddAppraisalModal} />
      </Modal>

      <Modal
        title="Edit Appraisal"
        visible={isEditAppraisalModalVisible}
        onCancel={closeEditAppraisalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditAppraisal onClose={closeEditAppraisalModal} id={id} />
      </Modal>
      <Modal
        title="Appraisal Detail"
        visible={isViewAppraisalModalVisible}
        onCancel={closeViewAppraisalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Modal>
      {/* <Model
      title="View Appraisal"
      visible={isEditAppraisalModalVisible}
      onCancel={closeViewAppraisalModal}
      footer={null}
      width={1000}
      className='mt-[-70px]'
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Model> */}
    </Card>
  );
};

// Add minimal required styles
const styles = `
  .ant-select {
    min-width: 200px;
  }

  .mr-2 {
    margin-right: 1rem;
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

  .table-responsive {
    overflow-x: auto;
  }

  .ant-table-row {
    transition: all 0.3s;
  }

  .ant-table-row:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .search-input {
    border-radius: 6px;
    transition: all 0.3s;
  }

  .search-input:hover {
    border-color: #40a9ff;
  }

  .search-input:focus,
  .search-input-focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
    transition: all 0.3s;
  }

  .ant-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .ant-modal-content {
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .ant-select {
      width: 100%;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }
`;

const AppraisalListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AppraisalList />
  </>
);

export default AppraisalListWithStyles;
