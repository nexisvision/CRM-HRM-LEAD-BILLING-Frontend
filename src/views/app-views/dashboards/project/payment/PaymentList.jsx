/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  Row,
  Col,
  message,
} from "antd";
import OrderListData from "../../../../../assets/data/order-list.data.json";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import AddPayment from "./AddPayment";
// import EditPayment from './EditPayment';
import ViewPayment from "./ViewPayment";
import { PaymentStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import { deletePay, Getpay } from "./PaymentReducer/paymentSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const { Option } = Select;

const getPaymentStatus = (method) => {
  if (method === "Normal") {
    return "success";
  }
  if (method === "Expired") {
    return "warning";
  }
  return "";
};

const paymentStatusList = ["Normal", "Expired"];

const PaymentList = () => {
  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] =
    useState(false);
  const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] =
    useState(false);
  const [isViewPaymentModalVisible, setIsViewPaymentModalVisible] =
    useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.Payment);
  const filtermin = allempdata.Payment.data;

  const [paymentStatisticData] = useState(PaymentStatisticData);

  // Open Add Job Modal
  const openAddPaymentModal = () => {
    setIsAddPaymentModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddPaymentModal = () => {
    setIsAddPaymentModalVisible(false);
  };

  // Open Add Job Modal
  const openEditPaymentModal = () => {
    setIsEditPaymentModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditPaymentModal = () => {
    setIsEditPaymentModalVisible(false);
  };

  // Open Add Job Modal
  const openViewPaymentModal = () => {
    setIsViewPaymentModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewPaymentModal = () => {
    setIsViewPaymentModalVisible(false);
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };

  useEffect(() => {
    dispatch(Getpay(id));
  }, []);

  useEffect(() => {
    if (filtermin) {
      setList(filtermin);
    }
  }, [filtermin]);

  const DeleteFun = async (exid) => {
    try {
      const response = await dispatch(deletePay(exid));
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(Getpay(id));
      setList(list.filter((item) => item.id !== exid));

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={openViewPaymentModal}>
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center" onClick={() => DeleteFun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    // },
    {
      title: "Project",
      dataIndex: "project",
      sorter: (a, b) => utils.antdTableSorter(a, b, "project"),
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      sorter: (a, b) => utils.antdTableSorter(a, b, "invoice"),
    },

    // {
    //   title: "Client",
    //   dataIndex: "client",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "client"),
    // },
    {
      title: "Order",
      dataIndex: "paidOn",
      sorter: (a, b) => utils.antdTableSorter(a, b, "paidOn"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) => (
        <span className="font-weight-semibold">
          <NumberFormat
            displayType={"text"}
            value={(Math.round(record.amount * 100) / 100).toFixed(2)}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "amount"),
    },
    {
      title: "Paid On",
      dataIndex: "paidOn",
      render: (_, record) => (
        <span>{dayjs.unix(record.paidOn).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "paidOn"),
    },
    {
      title: "Payment Gateway",
      dataIndex: "paymentMethod",
      sorter: (a, b) => utils.antdTableSorter(a, b, "paymentMethod"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getPaymentStatus(record.status)}>{record.status}</Tag>
        </>
      ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
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
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
        className="flex flex-wrap  gap-4"
      >
        <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              defaultValue="All"
              className="w-full"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="method"
            >
              <Option value="All">All method </Option>
              {paymentStatusList.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px" className="flex">
          <Button type="primary" className="ml-2" onClick={openAddPaymentModal}>
            <PlusOutlined />
            <span className="ml-2">New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <Card>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: 1200 }}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: "checkbox",
              preserveSelectedRowKeys: false,
              ...rowSelection,
            }}
          />
        </div>
      </Card>
      <Card>
        <Modal
          title="Add Payment"
          visible={isAddPaymentModalVisible}
          onCancel={closeAddPaymentModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddPayment onClose={closeAddPaymentModal} />
        </Modal>

        {/* <Modal
					title="Edit Payment"
					visible={isEditPaymentModalVisible}
					onCancel={closeEditPaymentModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<EditPayment onClose={closeEditPaymentModal} />
				</Modal> */}

        <Modal
          title="Payment Details"
          visible={isViewPaymentModalVisible}
          onCancel={closeViewPaymentModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <ViewPayment onClose={closeViewPaymentModal} />
        </Modal>
      </Card>
    </>
  );
};

export default PaymentList;
