import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
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
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddContract from "./AddContract";
import ViewContract from "./ViewContract";
import EditContract from "./EditContract";
import userData from "../../../../assets/data/user-list.data.json";
import { utils, writeFile } from "xlsx";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { ContaractData, DeleteCon } from "./ContractReducers/ContractSlice";
const { RangePicker } = DatePicker;

const ContractList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const dispatch = useDispatch();
  const tabledata = useSelector((state) => state.Contract);
  const clientData = useSelector((state) => state.SubClient?.SubClient?.data);
  const projectData = useSelector((state) => state.Project?.Project?.data);
  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ContaractData());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata?.Contract?.data) {
      const contractsWithNames = tabledata.Contract.data.map((contract) => ({
        ...contract,
        client:
          clientData?.find((client) => client.id === contract.client)
            ?.username || contract.client,
        project:
          projectData?.find((project) => project.id === contract.project)
            ?.project_name || contract.project,
      }));
      setUsers(contractsWithNames);
    }
  }, [tabledata, clientData, projectData]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddContractModalVisible, setIsAddContractModalVisible] =
    useState(false);
  const [isViewContractModalVisible, setIsViewContractModalVisible] =
    useState(false);
  const [isEditContractModalVisible, setIsEditContractModalVisible] =
    useState(false);
  const openAddContractModal = () => {
    setIsAddContractModalVisible(true);
  };

  const closeAddContractModal = () => {
    setIsAddContractModalVisible(false);
  };
  const closeViewContractModal = () => {
    setIsViewContractModalVisible(false);
  };
  const openEditContractModal = () => {
    setIsEditContractModalVisible(true);
  };
  const closeEditContractModal = () => {
    setIsEditContractModalVisible(false);
  };
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value) {
      setUsers(tabledata?.Contract?.data || []);
      return;
    }

    const filtered =
      tabledata?.Contract?.data?.filter(
        (contract) =>
          contract.contract_number?.toLowerCase().includes(value) ||
          contract.phone?.toLowerCase().includes(value) ||
          contract.country?.toLowerCase().includes(value)
      ) || [];

    setUsers(filtered);
  };

  const getFilteredContracts = () => {
    if (!users) return [];

    let filtered = users;

    if (searchText) {
      filtered = filtered.filter((contract) => {
        const clientName = clientData
          ?.find((client) => client.id === contract.client)
          ?.username?.toLowerCase();

        return clientName?.includes(searchText.toLowerCase());
      });
    }

    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter((contract) => {
        const contractStartDate = dayjs(contract.startDate);
        const contractEndDate = dayjs(contract.endDate);
        const filterStartDate = dayjs(dateRange[0]);
        const filterEndDate = dayjs(dateRange[1]);

        return (
          (contractStartDate.isAfter(filterStartDate) ||
            contractStartDate.isSame(filterStartDate)) &&
          (contractEndDate.isBefore(filterEndDate) ||
            contractEndDate.isSame(filterEndDate))
        );
      });
    }

    return filtered;
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteCon(userId));

      await dispatch(ContaractData());

      setUsers(users.filter((item) => item.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const Editfun = (id) => {
    openEditContractModal();
    setIdd(id);
  };
  const exportToExcel = () => {
    try {
      // Create a worksheet from the formatted data
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Contract"); // Append the worksheet to the workbook

      writeFile(wb, "ContractData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];
  console.log("parsedPermissions", parsedPermissions);

  let contractPermissions = [];

  if (parsedPermissions["dashboards-project-Contract"]) {
    const contractList = parsedPermissions["dashboards-project-Contract"][0];
    if (contractList) {
      contractPermissions = contractList.permissions;
    }
  }

  const canCreateContract = contractPermissions.includes("create");
  const canEditContract = contractPermissions.includes("update");
  const canDeleteContract = contractPermissions.includes("delete");
  const canViewContract = contractPermissions.includes("view");

  ///endpermission

  const getDropdownItems = (elm) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || canEditContract) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => Editfun(elm.id),
      });
    }

    if (
      whorole === "super-admin" ||
      whorole === "client" ||
      canDeleteContract
    ) {
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
      title: "Contract Number",
      dataIndex: "contract_number",

      sorter: (a, b) => a.contract_number.localeCompare(b.contract_number),
    },
    {
      title: "Client",
      dataIndex: "client",
      render: (_, record) => (
        <span>
          {clientData?.find((client) => client.id === record.client)
            ?.username || record.client}
        </span>
      ),
      sorter: {
        compare: (a, b) => {
          const clientA = String(
            clientData?.find((client) => client.id === a.client)?.username ||
            a.client
          );
          const clientB = String(
            clientData?.find((client) => client.id === b.client)?.username ||
            b.client
          );
          return clientA.localeCompare(clientB);
        },
      },
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (_, record) => (
        <span>
          {projectData?.find((project) => project.id === record.project)
            ?.project_name || record.project}
        </span>
      ),
      sorter: {
        compare: (a, b) => {
          const projectA = String(
            projectData?.find((project) => project.id === a.project)
              ?.project_name || a.project
          );
          const projectB = String(
            projectData?.find((project) => project.id === b.project)
              ?.project_name || b.project
          );
          return projectA.localeCompare(projectB);
        },
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (phone) => <span>{phone || "-"}</span>,
      sorter: (a, b) => (a.phone || "").localeCompare(b.phone || ""),
    },
    {
      title: "Country",
      dataIndex: "country",
      render: (country) => <span>{country || "-"}</span>,
      sorter: (a, b) => (a.country || "").localeCompare(b.country || ""),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: {
        compare: (a, b) => a.subject.length - b.subject.length,
      },
    },
    {
      title: "Contract Value",
      dataIndex: "value",
      sorter: {
        compare: (a, b) => a.value.length - b.value.length,
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
              placeholder="Search by contract number, phone, country..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <RangePicker
              placeholder={["Contract Start Date", "Contract End Date"]}
              onChange={(dates) => setDateRange(dates)}
              format="DD-MM-YYYY"
              allowClear
              className="date-range-picker"
            />
          </div>
        </Flex>
        <Flex gap="7px">
          {(whorole === "super-admin" ||
            whorole === "client" ||
            canCreateContract) && (
              <Button
                type="primary"
                className="ml-2"
                onClick={openAddContractModal}
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
        {(whorole === "super-admin" ||
          whorole === "client" ||
          canViewContract) && (
            <Table
              columns={tableColumns}
              dataSource={getFilteredContracts()}
              rowKey="id"
              pagination={{
                total: getFilteredContracts().length,
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
        title="Add Contract"
        visible={isAddContractModalVisible}
        onCancel={closeAddContractModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <AddContract onClose={closeAddContractModal} />
      </Modal>
      <Modal
        title="View Contract"
        visible={isViewContractModalVisible}
        onCancel={closeViewContractModal}
        footer={null}
        width={1800}
        className="mt-[-70px]"
      >
        <ViewContract onClose={closeViewContractModal} />
      </Modal>
      <Modal
        title="Edit Contract"
        visible={isEditContractModalVisible}
        onCancel={closeEditContractModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditContract onClose={closeEditContractModal} id={idd} />
      </Modal>
    </Card>
  );
};

// Add styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .date-range-picker {
    min-width: 280px;
  }

  @media (max-width: 768px) {
    .search-input,
    .date-range-picker {
      width: 100%;
      margin-bottom: 1rem;
    }
  }

  .ant-dropdown-menu {
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .ant-dropdown-menu-item {
    padding: 8px 16px;
  }
  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }
  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }
`;

const ContractListWithStyles = () => (
  <>
    <style>{styles}</style>
    <ContractList />
  </>
);

export default ContractListWithStyles;
