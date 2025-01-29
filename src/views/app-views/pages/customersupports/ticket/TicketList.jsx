import React, { Component, useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Modal,
  Menu,
  Tag,
  message,
} from "antd";
import NumberFormat from "react-number-format";
import OrderListData from "assets/data/order-list.data.json";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils, writeFile } from "xlsx";
import EditTicket from "./EditTicket";
import AddTicket from "./AddTicket";
import ViewTicket from "./ViewTicket";
import { DeleteTicket, getAllTicket } from "./TicketReducer/TicketSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const { Column } = Table;

const { Option } = Select;

const getPaymentStatus = (status) => {
  if (status === "Paid") {
    return "success";
  }
  if (status === "Pending") {
    return "warning";
  }
  if (status === "Expired") {
    return "error";
  }
  return "";
};

const getShippingStatus = (status) => {
  if (status === "Ready") {
    return "blue";
  }
  if (status === "Shipped") {
    return "cyan";
  }
  return "";
};

const paymentStatusList = ["Normal", "UNNormal", "Expired"];

export const TicketList = () => {
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddTicketModalVisible, setIsAddTicketModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] =
    useState(false);
  const [isViewTicketModalVisible, setIsViewTicketModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = alldatat?.Ticket?.data || [];
  console.log(",mm,,m,m", fnddata);

  // Open Add Job Modal
  const openAddTicketModal = () => {
    setIsAddTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddTicketModal = () => {
    setIsAddTicketModalVisible(false);
  };

  // Open Add Job Modal
  const openEditTicketModal = () => {
    setIsEditTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditTicketModal = () => {
    setIsEditTicketModalVisible(false);
  };

  const openViewTicketModal = () => {
    setIsViewTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewTicketModal = () => {
    setIsViewTicketModalVisible(false);
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "priority";
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };

  useEffect(() => {
    dispatch(getAllTicket());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(list); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Ticket"); // Append the sheet to the workbook

      writeFile(wb, "TicketData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const deletfun = (userId) => {
    dispatch(DeleteTicket(userId));
    dispatch(getAllTicket());
    dispatch(getAllTicket());
    setList(list.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const editfun = (idd) => {
    openEditTicketModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={openViewTicketModal}
            size="small"
          >
            <span className="ml-2">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add to remark</span>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => editfun(row.id)}
            size="small"
          >
            <span className="ml-2">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <TiPinOutline />
          <span className="ml-2">Pin</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => deletfun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Subject",
      dataIndex: "ticketSubject",
      sorter: {
        compare: (a, b) => a.subject.length - b.subject.length,
      },
    },

    {
      title: "requestor",
      dataIndex: "requestor",
      sorter: {
        compare: (a, b) => a.subject.length - b.subject.length,
      },
    },

    // {
    // 	title: 'Project List',
    // 	dataIndex: 'project',
    // 	sorter: {
    // 		compare: (a, b) => a.project.length - b.project.length,
    // 	},
    // },
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (
        <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "date"),
    },

    {
      title: "Priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.priority.length - b.priority.length,
      },
    },
    {
      title: "description",
      dataIndex: "description",
      sorter: {
        compare: (a, b) => a.activity.length - b.activity.length,
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (_, record) => (
    //     <>
    //       <Tag color={getShippingStatus(record.status)}>{record.status}</Tag>
    //     </>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
    // },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <div className="container">
      <Row gutter={16}>
        {annualStatisticData.map((elm, i) => (
          <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
            <StatisticWidget
              title={elm.title}
              value={elm.value}
              status={elm.status}
              subtitle={elm.subtitle}
            />
          </Col>
        ))}
      </Row>
      <Card>
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
                onChange={handleShowStatus}
                placeholder="Status"
              >
                <Option value="All">All priority </Option>
                {paymentStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" gap="7px">
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddTicketModal}
            >
              <PlusOutlined />
              <span>New</span>
            </Button>
            <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
                Export All
              </Button> 
          </Flex>
        </Flex>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: "checkbox",
              preserveSelectedRowKeys: false,
              ...rowSelection,
            }}
          />
        </div>
        <Modal
          title="Create Ticket"
          visible={isAddTicketModalVisible}
          onCancel={closeAddTicketModal}
          footer={null}
          width={1000}
          // className='mt-[-70px]'
          // height={1000}
        >
          <AddTicket onClose={closeAddTicketModal} />
        </Modal>

        <Modal
          title="Edit Ticket"
          visible={isEditTicketModalVisible}
          onCancel={closeEditTicketModal}
          footer={null}
          width={1000}
          // height={1000}
        >
          <EditTicket onClose={closeEditTicketModal} idd={idd} />
        </Modal>
        <Modal
          title="View Ticket"
          visible={isViewTicketModalVisible}
          onCancel={closeViewTicketModal}
          footer={null}
          width={1000}
          // height={1000}
        >
          <ViewTicket onClose={closeViewTicketModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default TicketList;
