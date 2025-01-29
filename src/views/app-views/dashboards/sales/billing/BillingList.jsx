import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
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
  Menu,
  Modal,
  Tag,
  message,
} from "antd";
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from "react-number-format";
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
// import NumberFormat from 'react-number-format';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils, writeFile } from "xlsx";
import AddBilling from "./AddBilling";
import EditBilling from "./EditBilling";
import ViewBilling from "./ViewBilling";
import { getInvoice } from "../invoice/InvoiceReducer/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";

import { deltebil, getbil } from "./billing2Reducer/billing2Slice";
import { delpropos } from "../../proposal/proposalReducers/proposalSlice";
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';

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

const paymentStatusList = ["Paid", "Pending", "Expired"];

export const BillingList = () => {
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddBillingModalVisible, setIsAddBillingModalVisible] =
    useState(false);
  const [isEditBillingModalVisible, setIsEditBillingModalVisible] =
    useState(false);
  const [isViewBillingModalVisible, setIsViewBillingModalVisible] =
    useState(false);
  const dispatch = useDispatch();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const AllLoggeddtaa = useSelector((state) => state.user);
  const lid = AllLoggeddtaa.loggedInUser.id;
  const [idd, setIdd] = useState("");

  const alldata = useSelector((state) => state.salesbilling);
  const fnddata = alldata.salesbilling.data;

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "paymentStatus";
      const data = utils.filterArray(OrderListData, key, value);
      setList(data);
    } else {
      setList(OrderListData);
    }
  };
  useEffect(() => {
    dispatch(getbil(lid));
  }, []);

  // useEffect(() => {
  //   dispatch(getAllBillings(lid));
  // }, []);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  // Open Add Job Modal
  const openAddBillingModal = () => {
    setIsAddBillingModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddBillingModal = () => {
    setIsAddBillingModalVisible(false);
  };

  // Open Add Job Modal
  const openEditBillingModal = () => {
    setIsEditBillingModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditBillingModal = () => {
    setIsEditBillingModalVisible(false);
  };

  // Open Add Job Modal
  const openViewBillingModal = () => {
    setIsViewBillingModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewBillingModal = () => {
    setIsViewBillingModalVisible(false);
  };

  const delfun = (iddd) => {
    dispatch(deltebil(iddd)).then(() => {
      dispatch(getbil(lid));
      setList(list.filter((item) => item.id !== iddd));
      message.success("Billing deleted successfully!");
    });
  };
  const exportToExcel = () => {
    try {
      // Format the data for Excel
      // const formattedData = list.map(row => ({
      //   ID: row.id,
      //   RelatedID: row.related_id,
      //   TaskName: row.taskName,
      //   Category: row.category,
      //   Project: row.project,
      //   StartDate: row.startDate,
      //   DueDate: row.dueDate,
      //   AssignedTo: JSON.parse(row.assignTo).join(", "), // Assuming assignTo is a JSON string
      //   Status: row.status,
      //   Priority: row.priority,
      //   Description: row.description.replace(/<[^>]+>/g, ''), // Remove HTML tags from description
      //   CreatedBy: row.created_by,
      //   CreatedAt: row.createdAt,
      //   UpdatedAt: row.updatedAt,
      // }));

      // Create a worksheet from the formatted data
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Billing"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "BillingData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const editfun = (idd) => {
    openEditBillingModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={openViewBillingModal}>
          <EyeOutlined />
          {/* <EyeOutlined /> */}
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add to remark</span>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center" onClick={() => editfun(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <TiPinOutline />
          <span className="ml-2">Pin</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => delfun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "billNumber",
      dataIndex: "billNumber",
      render: (_, record) => <span>{record.billNumber}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, "duedate"),
    },
    {
      title: "vendor",
      dataIndex: "vendor",
      sorter: {
        compare: (a, b) => a.vendor.length - b.vendor.length,
      },
    },
    {
      title: "billDate",
      dataIndex: "billDate",
      render: (_, record) => <span>{record.billDate}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, "billDate"),
    },

    {
      title: "note",
      dataIndex: "note",
      sorter: {
        compare: (a, b) => a.note.length - b.note.length,
      },
    },
    {
      title: "status",
      dataIndex: "status",
      render: (_, record) => <span>{record.status}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <div className="container">
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
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
                <Option value="All">All Billing </Option>
                {paymentStatusList.map((elm) => (
                  <Option key={elm} value={elm}>
                    {elm}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            <Button
              type="primary"
              className="flex items-center"
              onClick={openAddBillingModal}
            >
              <PlusOutlined />
              <span className="ml-2">New</span>
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
            scroll={{ x: 1200 }}
            // rowSelection={{
            // 	selectedRowKeys: selectedRowKeys,
            // 	type: 'checkbox',
            // 	preserveSelectedRowKeys: false,
            // 	...rowSelection,
            // }}
          />
        </div>

        <Modal
          title="Create Billing"
          visible={isAddBillingModalVisible}
          onCancel={closeAddBillingModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddBilling onClose={closeAddBillingModal} />
        </Modal>
        <Modal
          title="Edit Billing"
          visible={isEditBillingModalVisible}
          onCancel={closeEditBillingModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditBilling onClose={closeEditBillingModal} idd={idd} />
        </Modal>
        <Modal
          title="Billing"
          visible={isViewBillingModalVisible}
          onCancel={closeViewBillingModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <ViewBilling onClose={closeViewBillingModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default BillingList;
