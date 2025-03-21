import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Table,
  Input,
  message,
  Button,
  Modal,
  Radio,
  Select,
  Tag,
  Menu,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  FileExcelOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  RetweetOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import AddLead from "./AddLead";
import { utils, writeFile } from "xlsx";
import EditLead from "./EditLead";
import ViewLead from "./ViewLead";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads, LeadsDelete } from "./LeadReducers/LeadSlice";
import { useNavigate } from "react-router-dom";
import LeadCards from "./LeadCards/LeadCards";
import ConvertDeal from "./ConvertDeal";

const VIEW_LIST = "LIST";
const VIEW_GRID = "GRID";

const LeadList = () => {
  const [users, setUsers] = useState([]);
  const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);
  const [isViewLeadModalVisible, setIsViewLeadModalVisible] = useState(false);
  const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);
  const navigate = useNavigate();
  const [id, setId] = useState("null");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [view, setView] = useState(VIEW_LIST);
  const [isConvertDealModalVisible, setIsConvertDealModalVisible] =
    useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) message.success(`Selected file: ${file.name}`);
  };

  const openAddLeadModal = () => setIsAddLeadModalVisible(true);
  const closeAddLeadModal = () => setIsAddLeadModalVisible(false);
  const openEditLeadModal = () => setIsEditLeadModalVisible(true);
  const closeEditLeadModal = () => setIsEditLeadModalVisible(false);
  const closeViewLeadModal = () => setIsViewLeadModalVisible(false);

  const tabledata = useSelector((state) => state.Leads);

  useEffect(() => {
    if (tabledata && tabledata.Leads && tabledata.Leads.data) {
      setFilteredData(tabledata.Leads.data);
    }
  }, [tabledata]);

  const getUniqueStatuses = () => {
    if (!tabledata?.Leads?.data) return [];
    const statuses = [
      ...new Set(tabledata.Leads.data.map((item) => item.status)),
    ];
    return [
      { value: "all", label: "All Status" },
      ...statuses.map((status) => ({
        value: status,
        label: status,
      })),
    ];
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (!tabledata?.Leads?.data) return;
    if (value === "all") {
      setFilteredData(tabledata.Leads.data);
      return;
    }
    const filtered = tabledata.Leads.data.filter(
      (lead) => lead.status === value
    );
    setFilteredData(filtered);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    if (!value || !tabledata.Leads.data) {
      setFilteredData(tabledata.Leads.data);
      return;
    }
    const filtered = tabledata.Leads.data.filter(
      (lead) =>
        (lead.leadTitle?.toString().toLowerCase().includes(value) ||
          lead.status?.toString().toLowerCase().includes(value)) &&
        (selectedStatus === "all" || lead.status === selectedStatus)
    );
    setFilteredData(filtered);
  };

  const getFilteredLeads = () => {
    return filteredData || [];
  };

  const handleLeadClick = (id) => {
    navigate(`/app/dashboards/lead/view/${id}`);
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

  const leadPermissions =
    parsedPermissions["dashboards-lead"]?.[0]?.permissions || [];

  const canCreateLead =
    whorole === "super-admin" ||
    whorole === "client" ||
    leadPermissions.includes("create");
  const canEditLead =
    whorole === "super-admin" ||
    whorole === "client" ||
    leadPermissions.includes("update");
  const canDeleteLead =
    whorole === "super-admin" ||
    whorole === "client" ||
    leadPermissions.includes("delete");
  const canViewLead =
    whorole === "super-admin" ||
    whorole === "client" ||
    leadPermissions.includes("view");

  const deleteUser = async (userId) => {
    try {
      await dispatch(LeadsDelete(userId));
      await dispatch(GetLeads());
      setUsers(users.filter((item) => item.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Lead");
      writeFile(wb, "LeadData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(GetLeads());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.Leads && tabledata.Leads.data) {
      const filteredLeads = tabledata.Leads.data;
      setUsers(filteredLeads);
    }
  }, [tabledata]);

  const EditFun = (id) => {
    setId(id);
    openEditLeadModal();
  };

  const openConvertDealModal = (lead) => {
    setSelectedLead(lead);
    setIsConvertDealModalVisible(true);
  };

  const closeConvertDealModal = () => {
    setSelectedLead(null);
    setIsConvertDealModalVisible(false);
  };

  const getDropdownItems = (elm) => {
    const items = [];

    items.push({
      key: "convert",
      icon: <RetweetOutlined />,
      label: "Convert to Deal",
      onClick: () => openConvertDealModal(elm),
    });

    if (canEditLead) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => EditFun(elm.id),
      });
    }

    if (canDeleteLead) {
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
      title: "leadTitle",
      dataIndex: "leadTitle",
      render: (leadTitle, record) => (
        <div
          onClick={() => handleLeadClick(record.id)}
          className="cursor-pointer hover:text-blue-600"
        >
          <h4 className="mb-0">{leadTitle}</h4>
        </div>
      ),
      sorter: {
        compare: (a, b) => a.leadTitle.length - b.leadTitle.length,
      },
    },
    {
      title: "Name",
      dataIndex: "firstName",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: "email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.length - b.email.length,
      },
    },
    {
      title: "company name",
      dataIndex: "company_name",
      sorter: {
        compare: (a, b) => a.company_name.length - b.company_name.length,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="text-capitalize"
          color={status === "active" ? "cyan" : "red"}
        >
          {status}
        </Tag>
      ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
    {
      title: "telephone",
      dataIndex: "telephone",
      sorter: {
        compare: (a, b) => a.telephone.length - b.telephone.length,
      },
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

  const styles = `
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

  return (
    <div>
      <Card bodyStyle={{ padding: "-3px" }}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search by lead title or status..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mr-md-3 mb-3">
              <Select
                placeholder="Filter by status"
                onChange={handleStatusChange}
                value={selectedStatus}
                style={{ width: "200px" }}
                className="status-select"
              >
                {getUniqueStatuses().map((status) => (
                  <Select.Option key={status.value} value={status.value}>
                    {status.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Flex>

          <Flex gap="7px" className="items-center">
            <Radio.Group
              defaultValue={VIEW_LIST}
              onChange={(e) => setView(e.target.value)}
              value={view}
              className="mr-2"
            >
              <Radio.Button value={VIEW_GRID}>
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value={VIEW_LIST}>
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>

            {canCreateLead && (
              <Button type="primary" onClick={openAddLeadModal}>
                <PlusOutlined />
                <span>New</span>
              </Button>
            )}

            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
            >
              Export All
            </Button>
          </Flex>
        </Flex>

        {view === VIEW_LIST ? (
          <div className="table-responsive">
            {canViewLead && (
              <Table
                columns={tableColumns}
                dataSource={getFilteredLeads()}
                rowKey="id"
                pagination={{
                  total: getFilteredLeads().length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
              />
            )}
          </div>
        ) : (
          <LeadCards data={getFilteredLeads()} />
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <Modal
          visible={isAddLeadModalVisible}
          onCancel={closeAddLeadModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddLead onClose={closeAddLeadModal} />
        </Modal>

        <Modal
          visible={isEditLeadModalVisible}
          onCancel={closeEditLeadModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <EditLead onClose={closeEditLeadModal} id={id} />
        </Modal>

        <Modal
          title="View Lead"
          visible={isViewLeadModalVisible}
          onCancel={closeViewLeadModal}
          footer={null}
          width={1800}
          className="mt-[-70px]"
        >
          <ViewLead onClose={closeViewLeadModal} />
        </Modal>

        <Modal
          title="Convert to Deal"
          visible={isConvertDealModalVisible}
          onCancel={closeConvertDealModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <ConvertDeal
            onClose={closeConvertDealModal}
            leadData={selectedLead}
          />
        </Modal>
      </Card>
      <style jsx>{styles}</style>
    </div>
  );
};

export default LeadList;
