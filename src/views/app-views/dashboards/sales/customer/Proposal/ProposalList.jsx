import React, { useState, useContext } from "react";
import {
  Card,
  Table,
  Menu,
  Col,
  Tag,
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
  PlusOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  LinkOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import utils from "utils";
import ViewInvoice from "../../invoice/ViewInvoice";
import AddInvoice from "../../invoice/AddInvoice";
import { useSelector } from "react-redux";

const { Option } = Select;
function ProposalList() {
  const permissions = useSelector((state) => state.auth.permissions);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] =
    useState(false);
  const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] =
    useState(false);

  // Update permission checks to handle the array structure correctly
  const hasViewPermission =
    permissions?.["dashboards-proposal"]?.[0]?.permissions?.includes("view") ||
    false;
  const hasCreatePermission =
    permissions?.["dashboards-proposal"]?.[0]?.permissions?.includes(
      "create"
    ) || false;
  const hasUpdatePermission =
    permissions?.["dashboards-proposal"]?.[0]?.permissions?.includes(
      "update"
    ) || false;
  const hasDeletePermission =
    permissions?.["dashboards-proposal"]?.[0]?.permissions?.includes(
      "delete"
    ) || false;

  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddCustomerModal = () => {
    setIsAddCustomerModalVisible(false);
  };

  const openviewCustomerModal = () => {
    setIsViewCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewCustomerModal = () => {
    setIsViewCustomerModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = list;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  //    Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const getProposalStatus = (status) => {
    if (status === "Normal") {
      return "blue";
    }
    if (status === "Shipped") {
      return "cyan";
    }
    return "";
  };

  const handleViewStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      setList([]);
    }
  };

  const proposalStatusList = ["Normal", "Expired"];

  const getDropdownItems = (elm) =>
    [
      hasViewPermission && {
        key: "copy-invoice",
        icon: <LinkOutlined />,
        label: "Copy Invoice",
        onClick: () => {
          message.info("Copy Invoice clicked");
        },
      },
      hasCreatePermission && {
        key: "duplicate",
        icon: <CopyOutlined />,
        label: "Duplicate Proposal",
        onClick: () => {
          message.info("Duplicate Proposal clicked");
        },
      },
      hasViewPermission && {
        key: "view",
        icon: <EyeOutlined />,
        label: "Show",
        onClick: () => openviewCustomerModal(elm),
      },
      hasUpdatePermission && {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => {
          message.info("Edit clicked");
        },
      },
      hasDeletePermission && {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(elm.id),
        danger: true,
      },
    ].filter(Boolean); // Filter out false values

  const tableColumns = [
    {
      title: "Proposal",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name.length - b.name.length,
      },
    },
    {
      title: "Issue Date",
      dataIndex: "date",
      sorter: {
        compare: (a, b) => a.date.length - b.date.length,
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: {
        compare: (a, b) => a.amount.length - b.amount.length,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getProposalStatus(record.status)}>{record.status}</Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
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

  const styles = `
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
         padding: 8px 12px;
      }

      .ant-menu-item:hover {
         background-color: #f0f7ff;
      }

      .ant-menu-item-danger:hover {
         background-color: #fff1f0;
      }
   `;

  return (
    <>
      <style>{styles}</style>
      <Card bodyStyle={{ padding: "-3px" }}>
        <Col span={24}>
          <h4 className="font-medium">Proposal</h4>
        </Col>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={(e) => onSearch(e)}
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                className="w-100"
                style={{ minWidth: 180 }}
                onChange={handleViewStatus}
                placeholder="Status"
              >
                <Option value="All">All Status </Option>
                {proposalStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px">
            {hasCreatePermission && (
              <Button
                type="primary"
                className="ml-2"
                onClick={openAddCustomerModal}
              >
                <PlusOutlined />
                <span>New</span>
              </Button>
            )}
            {hasViewPermission && (
              <Button type="primary" icon={<FileExcelOutlined />} block>
                Export All
              </Button>
            )}
          </Flex>
        </Flex>
        <div className="table-responsive mt-2">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        </div>

        {/* Add Job Modal */}
        <Modal
          title=""
          visible={isAddCustomerModalVisible}
          onCancel={closeAddCustomerModal}
          footer={null}
          width={800}
        >
          <AddInvoice onClose={closeAddCustomerModal} />
        </Modal>

        <Modal
          title=""
          visible={isViewCustomerModalVisible}
          onCancel={closeViewCustomerModal}
          footer={null}
          width={1200}
        >
          <ViewInvoice onClose={closeViewCustomerModal} />
        </Modal>
      </Card>
    </>
  );
}

export default ProposalList;
