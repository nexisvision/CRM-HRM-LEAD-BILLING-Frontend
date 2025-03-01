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
import { deletePay, Getpay } from "./PaymentReducer/paymentSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { GetProject } from '../project-list/projectReducer/ProjectSlice';
import { getAllInvoices } from '../invoice/invoicereducer/InvoiceSlice';

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
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] =
    useState(false);
  const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] =
    useState(false);
  const [isViewPaymentModalVisible, setIsViewPaymentModalVisible] =
    useState(false);
  const [searchText, setSearchText] = useState('');

  const { id } = useParams();
  const dispatch = useDispatch();

  const allempdata = useSelector((state) => state.Payment);
  const filtermin = allempdata.Payment.data;

  // Add new states for projects and invoices
  const [projectsList, setProjectsList] = useState([]);
  const [invoicesList, setInvoicesList] = useState([]);
  
  // Get data from redux store
  const projectsData = useSelector((state) => state.Project.Project.data || []);
  const invoicesData = useSelector((state) => state.invoice);
  const tabledata = useSelector((state) => state.Payment);

  const [selectedPayment, setSelectedPayment] = useState(null);

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
      const data = utils.filterArray(list, value);
    } else {
      setList(list);
    }
  };

  useEffect(() => {
    // Fetch payments, projects and invoices data
    dispatch(Getpay(id));
    dispatch(GetProject());
    dispatch(getAllInvoices(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (projectsData && projectsData.length > 0) {
      setProjectsList(projectsData);
    }
  }, [projectsData]);

  useEffect(() => {
    if (invoicesData && invoicesData.invoices) {
      setInvoicesList(invoicesData.invoices);
    }
  }, [invoicesData]);

  // Function to get project name by ID
  const getProjectName = (projectId) => {
    const project = projectsData.find(project => project.id === projectId);
    return project ? project.project_name : 'N/A';
  };

  // Function to get invoice number by ID
  const getInvoiceNumber = (invoiceId) => {
    const invoice = invoicesList.find(invoice => invoice.id === invoiceId);
    return invoice ? invoice.invoiceNumber : 'N/A';
  };

  const DeleteFun = async (exid) => {
    try {
      const response = await dispatch(deletePay(exid));
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(Getpay(id));
      setList(list.filter((item) => item.id !== exid));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => {
          setSelectedPayment(row);
          openViewPaymentModal();
        }}>
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
    {
      title: "Project",
      dataIndex: "project_name",
      render: (_, record) => (
        <span 
          className=" cursor-pointer hover:underline"
          onClick={() => {
            setSelectedPayment(record);
            openViewPaymentModal();
          }}
        >
          {getProjectName(record.project_name)}
        </span>
      ),
      sorter: (a, b) => {
        const nameA = getProjectName(a.project_name);
        const nameB = getProjectName(b.project_name);
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      render: (invoiceId) => getInvoiceNumber(invoiceId),
      sorter: (a, b) => {
        const invoiceNumA = getInvoiceNumber(a.invoice);
        const invoiceNumB = getInvoiceNumber(b.invoice);
        return invoiceNumA.localeCompare(invoiceNumB);
      },
    },
    {
      title: "Order",
      dataIndex: "paidOn",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.paidOn) - new Date(b.paidOn),
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
    // {
    //   title: "Paid On",
    //   dataIndex: "paidOn",
    //   render: (_, record) => (
    //     <span>{dayjs.unix(record.paidOn).format(DATE_FORMAT_DD_MM_YYYY)}</span>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "paidOn"),
    // },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      sorter: (a, b) => utils.antdTableSorter(a, b, "paymentMethod"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (_, record) => (
    //     <>
    //       <Tag color={getPaymentStatus(record.status)}>{record.status}</Tag>
    //     </>
    //   ),
    //   sorter: {
    //     compare: (a, b) => a.status.length - b.status.length,
    //   },
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
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    // If search value is empty, show all data
    if (!value) {
      setList(filtermin);
      return;
    }
    
    // Filter the data based on project name
    const filtered = filtermin.filter(payment => {
      const projectName = getProjectName(payment.project_name)?.toLowerCase();
      return projectName?.includes(value);
    });
    
    setList(filtered);
  };

  // Update the filter function to include search
  const getFilteredPayments = () => {
    if (!list) return [];
    
    let filtered = list;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(payment => {
        const projectName = getProjectName(payment.project_name)?.toLowerCase();
        return projectName?.includes(searchText.toLowerCase());
      });
    }

    return filtered;
  };

  // Update the list when payment data changes
  useEffect(() => {
    if (tabledata && tabledata.Payment && tabledata.Payment.data) {
      setList(tabledata.Payment.data);
    }
  }, [tabledata]);

  return (
    <>
    <Card>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
        className="flex flex-wrap  gap-4"
      >
        <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input
              placeholder="Search by project name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          {/* <div className="w-full md:w-48">
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
          </div> */}
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
      {/* <Card> */}
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={getFilteredPayments()}
            rowKey="id"
            pagination={{
              total: getFilteredPayments().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </div>
      {/* </Card> */}
      </Card>
     
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
          title="View Payment"
          visible={isViewPaymentModalVisible}
          onCancel={closeViewPaymentModal}
          footer={null}
          width={800}
        >
          <ViewPayment 
            data={selectedPayment} 
            onClose={closeViewPaymentModal} 
          />
        </Modal>
   
    </>
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

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
`;

const PaymentListWithStyles = () => (
  <>
    <style>{styles}</style>
    <PaymentList />
  </>
);

export default PaymentListWithStyles;
