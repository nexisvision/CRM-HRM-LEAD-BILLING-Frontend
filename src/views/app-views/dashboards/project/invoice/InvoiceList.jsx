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
  // Fetch invoices when component mounts
  useEffect(() => {
    console.log("Fetching invoices for ID:", id);
    dispatch(getAllInvoices(id));
  }, [dispatch]);
  // Update list when invoices change
  useEffect(() => {
    console.log("Invoices updated:", invoices);
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
  //   console.log(idd, "idddd");
    
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
    const filtered = invoices.filter(
      (item) =>
        item.client.toLowerCase().includes(value) ||
        item._id.toLowerCase().includes(value)
    );
    setList(filtered);
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
      sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
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
      title: "Tax",
      dataIndex: "tax",
      // render: (total) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.tax - b.tax,
    },
    {
      title: "Total",
      dataIndex: "total",
      // render: (total) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.total - b.total,
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (status) => <Tag color={getPaymentStatus(status)}>{status}</Tag>,
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
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={handleSearch} />
                        </div>
                        <div className="mb-3">
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                // onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All payment </Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
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
                            dataSource={invoices}
                            rowKey="id"
                            scroll={{ x: 1200 }}
                        />
                    </div>
                    <Modal
                        title="Invoice Create"
                        visible={isAddInvoiceModalVisible}
                        onCancel={closeAddInvoiceModal}
                        footer={null}
                        width={1000}
                        className='mt-[-70px]'
                    >
                        <AddInvoice onClose={closeAddInvoiceModal} />
                    </Modal>
                    <Modal
                        title="Edit Invoice"
                        visible={isEditInvoiceModalVisible}
                        onCancel={closeEditInvoiceModal}
                        footer={null}
                        width={1000}
                        className='mt-[-70px]'
                    >
                        <EditInvoice onClose={closeEditInvoiceModal} idd={idd} />
                    </Modal>
          <Modal
            visible={ViewInvoiceModalVisible}
            onCancel={closeViewInvoiceModal}
            footer={null}
            width={800}
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












// import React, { Component } from "react";
// import { useState, useEffect } from "react";
// // import { PrinterOutlined } from '@ant-design/icons';
// import StatisticWidget from "components/shared-components/StatisticWidget";
// import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
// import {
//   Row,
//   Card,
//   Col,
//   Table,
//   Select,
//   Input,
//   Button,
//   message,
//   Menu,
//   Modal,
//   Tag,
// } from "antd";
// // import { invoiceData } from '../../../pages/invoice/invoiceData';
// // import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
// import NumberFormat from "react-number-format";
// // import React, {useState} from 'react'
// // import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
// import OrderListData from "../../../../../assets/data/order-list.data.json";
// import {
//   EyeOutlined,
//   FileExcelOutlined,
//   SearchOutlined,
//   PlusCircleOutlined,
//   EditOutlined,
//   PlusOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import { TiPinOutline } from "react-icons/ti";
// import userData from "assets/data/user-list.data.json";
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import Flex from 'components/shared-components/Flex'
// import { getAllInvoices, deleteInvoice, getInvoiceById } from '../../../dashboards/project/invoice/invoicereducer/InvoiceSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
// // import NumberFormat from 'react-number-format';
// import dayjs from "dayjs";
// import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
// import { utils, writeFile } from "xlsx";
// import AddInvoice from "./AddInvoice";
// import EditInvoice from "./EditInvoice";
// import InvoiceView from "./InvoiceView";
// import Invoice from "views/app-views/pages/invoice";
// // import InvoiceView from "./InvoiceView";
// // import AddInvoice from './AddInvoice';
// // import ViewInvoice from './ViewInvoice';

// const { Column } = Table;

// const { Option } = Select;

// const getPaymentStatus = (status) => {
//   if (status === "Paid") {
//     return "success";
//   }
//   if (status === "Pending") {
//     return "warning";
//   }
//   if (status === "Expired") {
//     return "error";
//   }
//   return "";
// };

// const getShippingStatus = (status) => {
//   if (status === "Ready") {
//     return "blue";
//   }
//   if (status === "Shipped") {
//     return "cyan";
//   }
//   return "";
// };

// const paymentStatusList = ["Paid", "Pending", "Expired"];

// export const InvoiceList = () => {

//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [annualStatisticData] = useState(AnnualStatisticData);
//   const [list, setList] = useState([]);
//   const [users, setUsers] = useState(userData);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] =
//     useState(false);
//   const [isAddProjectModalVisible, setIsAddProjectModalVisible] =
//     useState(false);
//   const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] =
//     useState(false);
//   const [ViewInvoiceModalVisible, setViewInvoiceModalVisible] = useState(false);
//   // const [idd, setIdd] = useState("");

//   const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] =
//     useState(false);
//   const { invoices, loading } = useSelector((state) => state.invoice);
//   const [filteredData, setFilteredData] = useState(invoices);
//   const dispatch = useDispatch();
//   const { id } = useParams();
//   const [idd, setIdd] = useState("");
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);

//   // Fetch invoices when component mounts
//   useEffect(() => {
//     console.log("Fetching invoices for ID:", id);
//     dispatch(getAllInvoices(id));
//   }, [dispatch]);

//   // Update list when invoices change
//   useEffect(() => {
//     console.log("Invoices updated:", invoices);
//     if (invoices) {
//       setList(invoices);
//     }
//   }, [invoices]);

//   const Editfunc = (id) => {
//     openEditInvoiceModal();
//     setIdd(id);
//   };

//   const exportToExcel = () => {
//     try {
//       // Format the data for Excel
//       // const formattedData = list.map(row => ({
//       //   ID: row.id,
//       //   RelatedID: row.related_id,
//       //   TaskName: row.taskName,
//       //   Category: row.category,
//       //   Project: row.project,
//       //   StartDate: row.startDate,
//       //   DueDate: row.dueDate,
//       //   AssignedTo: JSON.parse(row.assignTo).join(", "), // Assuming assignTo is a JSON string
//       //   Status: row.status,
//       //   Priority: row.priority,
//       //   Description: row.description.replace(/<[^>]+>/g, ''), // Remove HTML tags from description
//       //   CreatedBy: row.created_by,
//       //   CreatedAt: row.createdAt,
//       //   UpdatedAt: row.updatedAt,
//       // }));

//       // Create a worksheet from the formatted data
//       const ws = utils.json_to_sheet(list);
//       const wb = utils.book_new(); // Create a new workbook
//       utils.book_append_sheet(wb, ws, "Invoice"); // Append the worksheet to the workbook

//       // Write the workbook to a file
//       writeFile(wb, "InvoiceData.xlsx");
//       message.success("Data exported successfully!");
//     } catch (error) {
//       console.error("Error exporting to Excel:", error);
//       message.error("Failed to export data. Please try again.");
//     }
//   };


//   const Viewfunc = (id) => {
//     openViewInvoiceModal();
//     setIdd(id);
//   };
  


//   //   console.log(idd, "idddd");



//   const handleDelete = async (id) => {
//     try {
//       await dispatch(deleteInvoice(id));

//       // const updatedData = await dispatch(Getexp(id));

//       // setList(list.filter((item) => item.id !== exid));

//       message.success({ content: "Deleted user successfully", duration: 2 });
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   // Open Add Job Modal
//   const openAddInvoiceModal = () => {
//     setIsAddInvoiceModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddInvoiceModal = () => {
//     setIsAddInvoiceModalVisible(false);
//   };

//   // Open Add Job Modal
//   const openAddProjectModal = () => {
//     setIsAddProjectModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddProjectModal = () => {
//     setIsAddProjectModalVisible(false);
//   };

//   // Open Add Job Modal
//   const openEditInvoiceModal = () => {
//     setIsEditInvoiceModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeEditInvoiceModal = () => {
//     setIsEditInvoiceModalVisible(false);
//   };


//   const openViewInvoiceModal = () => {
//     // setSelectedInvoice(invoice);
//     setViewInvoiceModalVisible(true);
//   };



//   // Open Add Job Modal
//   // const openViewInvoiceModal = () => {
//   //   setViewInvoiceModalVisible(true);
//   // };

//   // Close Add Job Modal
//   const closeViewInvoiceModal = () => {
//     setViewInvoiceModalVisible(false);
//   };
//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     const filtered = invoices.filter(
//       (item) =>
//         item.client.toLowerCase().includes(value) ||
//         item._id.toLowerCase().includes(value)
//     );
//     setList(filtered);
//   };
//   const dropdownMenu = (row) => (
//     <Menu>
//       <Menu.Item>
//         <Flex alignItems="center" onClick={() => Viewfunc(row.id)}>
//           <EyeOutlined />
//           {/* <EyeOutlined /> */}
//           <span className="ml-2">View Invoice
//           </span>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center" onClick={() => Editfunc(row.id)}>
//           <EditOutlined />
//           {/* <EditOutlined /> */}
//           <span className="ml-2">Edit</span>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center" onClick={() => handleDelete(row.id)}>
//           <DeleteOutlined />
//           <span className="ml-2">Delete</span>
//         </Flex>
//       </Menu.Item>
//     </Menu>
//   );

//   const tableColumns = [
//     {
//       title: "Invoice Number",
//       dataIndex: "invoiceNumber",
//       sorter: (a, b) => a.invoiceNumber.localeCompare(b.invoiceNumber),
//     },

//     {
//       title: "Issue Date",
//       dataIndex: "issueDate",
//       render: (date) => dayjs(date).format("DD/MM/YYYY"),
//       sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate),
//     },
//     {
//       title: "Due Date",
//       dataIndex: "dueDate",
//       render: (date) => dayjs(date).format("DD/MM/YYYY"),
//       sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
//     },
//     {
//       title: "Total",
//       dataIndex: "total",
//       // render: (total) => `$${total.toFixed(2)}`,
//       sorter: (a, b) => a.total - b.total,
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (status) => <Tag color={getPaymentStatus(status)}>{status}</Tag>,
//     },
//     {
//       title: "Action",
//       dataIndex: "actions",
//       render: (_, elm) => (
//         <div className="text-center">
//           <EllipsisDropdown menu={dropdownMenu(elm)} />
//         </div>
//       ),
//     },
//   ];



//   const rowSelection = {
//     onChange: (key, rows) => {
//       setSelectedRows(rows)
//       setSelectedRowKeys(key)
//     }
//   };

//   // const onSearch = e => {
//   // 	const value = e.currentTarget.value
//   // 	const searchArray = e.currentTarget.value ? list : OrderListData
//   // 	const data = utils.wildCardSearch(searchArray, value)
//   // 	setList(data)
//   // 	setSelectedRowKeys([])
//   // }



//   return (
//     <>
//       <div>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
//           <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
//             <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={handleSearch} />
//             </div>
//             <div className="mb-3">
//               <Select
//                 defaultValue="All"
//                 className="w-100"
//                 style={{ minWidth: 180 }}
//                 // onChange={handleShowStatus}
//                 placeholder="Status"
//               >
//                 <Option value="All">All payment </Option>
//                 {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
//               </Select>
//             </div>
//           </Flex>
//           <Flex gap="7px" className="flex">
//             <div className='flex gap-4'>
//               <Button type="primary" className="flex items-center" onClick={openAddInvoiceModal}>
//                 <PlusOutlined />
//                 <span className="ml-2">Create Invoice</span>
//               </Button>
//               <Button
//                 type="primary"
//                 icon={<FileExcelOutlined />}
//                 onClick={exportToExcel} // Call export function when the button is clicked
//                 block
//               >
//                 Export All
//               </Button>
//             </div>

//           </Flex>
//         </Flex>
//       </div>
//       <div className="container">

//         <Card>

//           <div className="table-responsive">
//             <Table
//               columns={tableColumns}
//               dataSource={invoices}
//               rowKey="id"
//               scroll={{ x: 1200 }}
//             />
//           </div>

//           <Modal
//             title="Invoice Create"
//             visible={isAddInvoiceModalVisible}
//             onCancel={closeAddInvoiceModal}
//             footer={null}
//             width={1000}
//             className='mt-[-70px]'
//           >
//             <AddInvoice onClose={closeAddInvoiceModal} />
//           </Modal>
//           <Modal
//             title="Edit Invoice"
//             visible={isEditInvoiceModalVisible}
//             onCancel={closeEditInvoiceModal}
//             footer={null}
//             width={1000}
//             className='mt-[-70px]'
//           >
//             <EditInvoice onClose={closeEditInvoiceModal} idd={idd} />
//           </Modal>
//           <Modal
//             visible={ViewInvoiceModalVisible}
//             onCancel={closeViewInvoiceModal}
//             footer={null}
//             width={800}
//           >
//             <InvoiceView onClose={closeViewInvoiceModal} idd={idd} />
//           </Modal>
//         </Card>
//       </div>
//     </>
//   );
// }


// export default InvoiceList