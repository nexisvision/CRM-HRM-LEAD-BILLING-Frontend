import React, { Component } from "react";
import { useState, useEffect } from "react";
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
} from "antd";
import NumberFormat from "react-number-format";
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
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import { getAllInvoices, deleteInvoice } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from "dayjs";
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";
import InvoiceView from "./InvoiceView";
import { GetProject } from '../project-list/projectReducer/ProjectSlice';
import { ClientData } from 'views/app-views/Users/client-list/CompanyReducers/CompanySlice';
import { DatePicker } from 'antd';
const { Column } = Table;
const { Option } = Select;

export const InvoiceList = () => {
 
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] =
    useState(false);
  const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
    useState(false);
  const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] =
    useState(false);
  const [ViewInvoiceModalVisible, setViewInvoiceModalVisible] = useState(false);

  const { invoices, loading } = useSelector((state) => state.invoice);
  const projectsData = useSelector((state) => state.Project.Project.data || []);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [idd, setIdd] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const clientsData = useSelector((state) => state.SubClient);
  const clients = clientsData.SubClient.data || [];
  const [dateRange, setDateRange] = useState(null);

  // Fetch invoices and projects when component mounts
  useEffect(() => {
    dispatch(getAllInvoices(id));
    dispatch(ClientData());
    dispatch(GetProject());
  }, [dispatch]);

  // Function to get project name by ID
  const getProjectName = (projectId) => {
    const project = projectsData.find(project => project.id === projectId);
    return project ? project.project_name || project.name : 'N/A';
  };

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
  
  // Close Add Job Modal
  const closeViewInvoiceModal = () => {
    setViewInvoiceModalVisible(false);
  };
  const handleSearch = (e) => {
    const value = e.target.value?.toLowerCase() || '';
    setSearchText(value);
    filterInvoices(value, dateRange);
  };
  const filterInvoices = (searchValue = searchText, dates = dateRange) => {
    let filtered = [...invoices];

    // Apply text search filter
    if (searchValue) {
        filtered = filtered.filter((invoice) => {
            const clientName = clients.find(c => c.id === invoice.client)?.username || '';
            
            const searchableFields = [
                invoice.invoiceNumber,
                invoice.project,
                clientName,
                invoice.total?.toString(),
                invoice.tax?.toString(),
                dayjs(invoice.issueDate).format("DD/MM/YYYY"),
                dayjs(invoice.dueDate).format("DD/MM/YYYY")
            ];
            return searchableFields.some(field => 
                field?.toLowerCase().includes(searchValue)
            );
        });
    }

    // Apply date range filter
    if (dates && dates.length === 2) {
        const startDate = dayjs(dates[0]).startOf('day');
        const endDate = dayjs(dates[1]).endOf('day');

        filtered = filtered.filter(invoice => {
            const issueDate = dayjs(invoice.issueDate);
            const dueDate = dayjs(invoice.dueDate);

            // Check if either issueDate or dueDate falls within the selected range
            return (
                (issueDate.isAfter(startDate) || issueDate.isSame(startDate)) &&
                (issueDate.isBefore(endDate) || issueDate.isSame(endDate))
            ) || (
                (dueDate.isAfter(startDate) || dueDate.isSame(startDate)) &&
                (dueDate.isBefore(endDate) || dueDate.isSame(endDate))
            );
        });
    }

    setList(filtered);
  };
  useEffect(() => {
    filterInvoices(searchText, dateRange);
  }, [dateRange, invoices]);
  const dropdownMenu = (row) => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Invoice',
        onClick: () => Viewfunc(row.id)
      },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => Editfunc(row.id)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => handleDelete(row.id)
      }
    ]
  });
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
        const projectNameA = getProjectName(a.project) || '';
        const projectNameB = getProjectName(b.project) || '';
        return projectNameA.localeCompare(projectNameB);
      },
      render: (projectId) => (
        <span>{getProjectName(projectId)}</span>
      ),
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
   
    return (
        <> 
            <div>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input 
                                placeholder="Search by invoice #, client, amount, date..." 
                                prefix={<SearchOutlined />} 
                                onChange={handleSearch}
                                value={searchText}
                                className="search-input"
                            />
                        </div>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0">
                            <DatePicker.RangePicker
                                onChange={(dates) => setDateRange(dates)}
                                format="DD-MM-YYYY"
                                placeholder={['Issue Date', 'Due Date']}
                                allowClear
                                className="w-full md:w-auto"
                            />
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
                                emptyText: searchText ? (
                                    <div className="text-center my-4">
                                        <SearchOutlined style={{ fontSize: '24px' }} />
                                        <p>No results found for "{searchText}"</p>
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