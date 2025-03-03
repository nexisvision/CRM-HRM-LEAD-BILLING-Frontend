import React, { Component } from "react";
import { useState, useEffect } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from "components/shared-components/StatisticWidget";
// import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  message,
  Menu,
  Modal,
  Tag,
  DatePicker,
  Space,
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
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { getAllInvoices, deleteInvoice, getInvoiceById } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
// import NumberFormat from 'react-number-format';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";
import InvoiceView from "./InvoiceView";
import Invoice from "views/app-views/pages/invoice";
// import InvoiceView from "./InvoiceView";
// import AddInvoice from './AddInvoice';
// import ViewInvoice from './ViewInvoice';
import { ClientData } from 'views/app-views/Users/client-list/CompanyReducers/CompanySlice';
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
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
export const InvoiceList = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] =
    useState(false);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] =
    useState(false);
  const [ViewInvoiceModalVisible, setViewInvoiceModalVisible] = useState(false);
  // const [idd, setIdd] = useState("");
  const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] =
    useState(false);
  const { invoices, loading } = useSelector((state) => state.invoice);
  const [filteredData, setFilteredData] = useState(invoices);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [idd, setIdd] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const { RangePicker } = DatePicker;

  // Fetch invoices when component mounts
  useEffect(() => {
    console.log("Fetching invoices for ID:", id);
    dispatch(getAllInvoices(id));
    dispatch(ClientData());
    dispatch(GetProject());
  }, [dispatch]);

  // Update list when invoices change
  useEffect(() => {
    if (invoices) {
      setList(invoices);
    }
  }, [invoices]);

  const Editfunc = (id) => {
    openEditInvoiceModal();
    setIdd(id);
  };
  const Viewfunc = (id) => {
    // Find the specific invoice data
    const invoice = invoices.find(inv => inv.id === id);
    setSelectedInvoiceData(invoice);
    setIdd(id);
    openViewInvoiceModal();
  };
    
    const handleDelete = async (id) => {
        try {
            await dispatch(deleteInvoice(id));
            // const updatedData = await dispatch(Getexp(id));
            // setList(list.filter((item) => item.id !== exid));
            message.success({ content: "Deleted user successfully", duration: 2 });
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
  // Open Add Job Modal
  const openAddInvoiceModal = () => {
    setIsAddInvoiceModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddInvoiceModal = () => {
    setIsAddInvoiceModalVisible(false);
  };
  // Open Add Job Modal
  const openAddProjectModal = () => {
    setIsAddProjectModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddProjectModal = () => {
    setIsAddProjectModalVisible(false);
  };
  // Open Add Job Modal
  const openEditInvoiceModal = () => {
    setIsEditInvoiceModalVisible(true);
  };
  // Close Add Job Modal
  const closeEditInvoiceModal = () => {
    setIsEditInvoiceModalVisible(false);
  };
  const openViewInvoiceModal = () => {
    // setSelectedInvoice(invoice);
    setViewInvoiceModalVisible(true);
};
  // Open Add Job Modal
  // const openViewInvoiceModal = () => {
  //   setViewInvoiceModalVisible(true);
  // };
  // Close Add Job Modal
  const closeViewInvoiceModal = () => {
    setViewInvoiceModalVisible(false);
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (!value) {
      setList(invoices);
      return;
    }
    
    const filtered = getFilteredInvoices();
    setList(filtered);
  };
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    const filtered = getFilteredInvoices(dates);
    setList(filtered);
  };
  const handleClearFilters = () => {
    setSearchText('');
    setDateRange(null);
    setList(invoices);
  };
  const getFilteredInvoices = (dates = dateRange) => {
    if (!invoices) return [];
    
    let filtered = [...invoices];

    if (searchText) {
      filtered = filtered.filter(invoice => {
        const searchFields = [
          invoice.invoiceNumber,
          invoice.client,
          invoice.total?.toString(),
          invoice.tax?.toString(),
          dayjs(invoice.issueDate).format('DD/MM/YYYY'),
          dayjs(invoice.dueDate).format('DD/MM/YYYY')
        ];
        return searchFields.some(field => 
          field?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    if (dates && dates[0] && dates[1]) {
      const startRange = dayjs(dates[0]).startOf('day');
      const endRange = dayjs(dates[1]).endOf('day');
      
      filtered = filtered.filter(invoice => {
        const issueDate = dayjs(invoice.issueDate);
        const dueDate = dayjs(invoice.dueDate);
        
        return (
          (issueDate.isAfter(startRange) || issueDate.isSame(startRange)) && 
          (issueDate.isBefore(endRange) || issueDate.isSame(endRange)) ||
          (dueDate.isAfter(startRange) || dueDate.isSame(startRange)) && 
          (dueDate.isBefore(endRange) || dueDate.isSame(endRange))
        );
      });
    }

    return filtered;
  };
  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => Viewfunc(row.id)}>
          <EyeOutlined />
          {/* <EyeOutlined /> */}
          <span className="ml-2">View Invoice
          </span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => Editfunc(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => handleDelete(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );
  const tableColumns = [
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      sorter: (a, b) => a.invoiceNumber?.localeCompare(b.invoiceNumber),
      render: (text, record) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => Viewfunc(record.id)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Project",
      dataIndex: "project",
      sorter: (a, b) => {
        const projectNameA = projects.find(p => p.id === a.project)?.project_name || '';
        const projectNameB = projects.find(p => p.id === b.project)?.project_name || '';
        return projectNameA.localeCompare(projectNameB);
      },
      render: (projectId) => {
        const projectName = projects.find(p => p.id === projectId)?.project_name;
        return <span>{projectName || 'N/A'}</span>;
      },
    },
    {
      title: "Client",
      dataIndex: "client",
      sorter: (a, b) => {
        const clientNameA = clients.find(c => c.id === a.client)?.username || '';
        const clientNameB = clients.find(c => c.id === b.client)?.username || '';
        return clientNameA.localeCompare(clientNameB);
      },
      render: (clientId) => {
        const clientName = clients.find(c => c.id === clientId)?.username;
        return <span>{clientName || 'N/A'}</span>;
      },
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    // {
    //   title: "Tax",
    //   dataIndex: "tax",
    //   sorter: (a, b) => (a.tax || 0) - (b.tax || 0),
    //   render: (tax) => (
    //     <span>₹{(tax || 0).toLocaleString()}</span>
    //   ),
    // },
    {
      title: "Total",
      dataIndex: "total",
      sorter: (a, b) => (a.total || 0) - (b.total || 0),
      render: (total) => (
        <span>₹{(total || 0).toLocaleString()}</span>
      ),
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
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    };
    // const onSearch = e => {
    //  const value = e.currentTarget.value
    //  const searchArray = e.currentTarget.value ? list : OrderListData
    //  const data = utils.wildCardSearch(searchArray, value)
    //  setList(data)
    //  setSelectedRowKeys([])
    // }
    return (
        <> 
            <div>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input 
                                placeholder="Search by invoice #, client, amount..." 
                                prefix={<SearchOutlined />} 
                                onChange={handleSearch}
                                value={searchText}
                                allowClear
                                className="search-input"
                            />
                        </div>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0">
                            <RangePicker
                                onChange={handleDateRangeChange}
                                format="DD/MM/YYYY"
                                value={dateRange}
                                placeholder={['Start Date', 'End Date']}
                                className="date-range-picker"
                                allowClear={true}
                                style={{ width: '280px' }}
                            />
                            {/* <Button 
                                onClick={handleClearFilters}
                                type="default"
                                className="ml-2"
                            >
                                Clear Filters
                            </Button> */}
                        </div>
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <div className='flex gap-4'>
                            <Button type="primary" className="flex items-center" onClick={openAddInvoiceModal}>
                                <PlusOutlined />
                                <span className="ml-2">Create Invoice</span>
                            </Button>
                            <Button type="primary" icon={<FileExcelOutlined />} block>
                                Export All
                            </Button>
                        </div>
                    </Flex>
                </Flex>
            </div>
            <div className="container">
                <Card>
                    <div className="table-responsive">
                        <Table
                            columns={tableColumns}
                            dataSource={list.length > 0 ? list : invoices}
                            rowKey="id"
                            scroll={{ x: 1200 }}
                            locale={{
                                emptyText: searchText || dateRange ? (
                                    <div className="text-center my-4">
                                        <SearchOutlined style={{ fontSize: '24px' }} />
                                        <p>No results found for the selected criteria</p>
                                    </div>
                                ) : (
                                    <div className="text-center my-4">No data available</div>
                                )
                            }}
                        />
                    </div>
                    <Modal
                        title="Create Invoice"
                        visible={isAddInvoiceModalVisible}
                        onCancel={closeAddInvoiceModal}
                        footer={null}
                        width={1100}
                        className='mt-[-70px]'
                    >
                        <AddInvoice onClose={closeAddInvoiceModal} />
                    </Modal>
                    <Modal
                        title="Edit Invoice"
                        visible={isEditInvoiceModalVisible}
                        onCancel={closeEditInvoiceModal}
                        footer={null}
                        width={1100}
                        className='mt-[-70px]'
                    >
                        <EditInvoice onClose={closeEditInvoiceModal} idd={idd} />
                    </Modal>
          <Modal
            visible={ViewInvoiceModalVisible}
            onCancel={closeViewInvoiceModal}
            footer={null}
            width={1000}
        >
     <InvoiceView 
        onClose={closeViewInvoiceModal} 
        idd={idd}
        invoiceData={selectedInvoiceData}
    />
        </Modal>
                </Card>
            </div>
        </>
    );
}
export default InvoiceList