import React, { useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import { Card, Table, Input, Button, Modal, DatePicker } from "antd";
import ViewInvoice from "./ViewInvoice";
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import utils from "utils";
import AddInvoice from "./AddInvoice";
import EditInvoice from "./EditInvoice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteInvoice, getInvoice } from "./InvoiceReducer/InvoiceSlice";

const { RangePicker } = DatePicker;

export const InvoiceList = () => {
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] =
    useState(false);
  const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] =
    useState(false);
  const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] =
    useState(false);
  const [idd, setIdd] = useState("");
  const [selectedInvoiceData, setSelectedInvoiceData] = useState(null);
  const alldata = useSelector((state) => state.salesInvoices);
  const fnddata = alldata.salesInvoices.data;

  const customerData = useSelector((state) => state.customers);
  const fnddataCustomers = customerData.customers.data;

  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    dispatch(getInvoice());
    dispatch(Getcus());
  }, []);
  useEffect(() => {
    dispatch(getInvoice());
  }, []);
  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const filterInvoices = (text, dates) => {
    if (!fnddata) return;

    let filtered = [...fnddata];

    if (text) {
      filtered = filtered.filter((invoice) =>
        invoice.salesInvoiceNumber?.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (dates && dates[0] && dates[1]) {
      const startDate = dayjs(dates[0]).startOf("day");
      const endDate = dayjs(dates[1]).endOf("day");

      filtered = filtered.filter((invoice) => {
        if (!invoice.issueDate) return false;
        const issueDate = dayjs(invoice.issueDate);
        return (
          (issueDate.isAfter(startDate) ||
            issueDate.isSame(startDate, "day")) &&
          (issueDate.isBefore(endDate) || issueDate.isSame(endDate, "day"))
        );
      });
    }

    setList(filtered);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates === null) {
      filterInvoices(searchText, null);
    } else {
      filterInvoices(searchText, dates);
    }
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterInvoices(value, dateRange);
  };

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
    ? JSON.parse(roleData.permissions)
    : {};

  let salesInvoicePermissions = [];
  if (
    parsedPermissions["dashboards-sales-invoice"] &&
    parsedPermissions["dashboards-sales-invoice"][0]?.permissions
  ) {
    salesInvoicePermissions =
      parsedPermissions["dashboards-sales-invoice"][0].permissions;
  }

  const canView =
    whorole === "super-admin" ||
    whorole === "client" ||
    salesInvoicePermissions.includes("view");
  const canCreate =
    whorole === "super-admin" ||
    whorole === "client" ||
    salesInvoicePermissions.includes("create");
  const canUpdate =
    whorole === "super-admin" ||
    whorole === "client" ||
    salesInvoicePermissions.includes("update");
  const canDelete =
    whorole === "super-admin" ||
    whorole === "client" ||
    salesInvoicePermissions.includes("delete");

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
  // Open Add Job Modal
  const openViewInvoiceModal = () => {
    setIsViewInvoiceModalVisible(true);
  };
  // Close Add Job Modal
  const closeViewInvoiceModal = () => {
    setIsViewInvoiceModalVisible(false);
  };
  const Viewfunc = (id) => {
    // Find the specific invoice data
    const invoice = fnddata.find((inv) => inv.id === id);
    setSelectedInvoiceData(invoice);
    setIdd(id);
    openViewInvoiceModal();
  };

  const delfun = (idd) => {
    dispatch(deleteInvoice(idd)).then(() => {
      dispatch(getInvoice());
      setList(list.filter((item) => item.id !== idd));
    });
  };
  const editfun = (idd) => {
    openEditInvoiceModal();
    setIdd(idd);
  };
  const dropdownMenu = (row) => ({
    items: [
      ...(canView
        ? [
            {
              key: "view",
              icon: <EyeOutlined />,
              label: "View Invoice",
              onClick: () => Viewfunc(row.id),
            },
          ]
        : []),
      ...(canUpdate
        ? [
            {
              key: "edit",
              icon: <EditOutlined />,
              label: "Edit",
              onClick: () => editfun(row.id),
            },
          ]
        : []),
      ...(canDelete
        ? [
            {
              key: "delete",
              icon: <DeleteOutlined />,
              label: "Delete",
              onClick: () => delfun(row.id),
            },
          ]
        : []),
    ],
  });
  const tableColumns = [
    {
      title: "Invoice Number",
      dataIndex: "salesInvoiceNumber",
      render: (text, record) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
            if (canView) {
              Viewfunc(record.id);
            }
          }}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "salesInvoiceNumber"),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (_, record) => {
        const customerData =
          fnddataCustomers?.find((cust) => cust.id === record.customer)?.name ||
          "Unknown Customer";
        return <span>{customerData}</span>;
      },
      sorter: (a, b) => {
        const customerA =
          fnddataCustomers?.find((cust) => cust.id === a.customer)?.name || "";
        const customerB =
          fnddataCustomers?.find((cust) => cust.id === b.customer)?.name || "";
        return customerA.localeCompare(customerB);
      },
    },
    {
      title: "Issue  Date",
      dataIndex: "issueDate",
      render: (_, record) => (
        <span>
          {record.issueDate ? dayjs(record.issueDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "issueDate"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (_, record) => (
        <span>
          {record.dueDate ? dayjs(record.dueDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "dueDate"),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => <span>{category || "N/A"}</span>,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (_, record) => <span>{record.tax}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, "tax"),
    },
    {
      title: "Total",
      dataIndex: "total",
      render: (_, record) => <span>{record.total}</span>,
      sorter: (a, b) => utils.antdTableSorter(a, b, "total"),
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
                placeholder="Search by invoice number..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mb-3">
              <RangePicker
                onChange={handleDateRangeChange}
                format="DD-MM-YYYY"
                placeholder={["Start Date", "End Date"]}
                className="w-100"
                style={{ minWidth: 250 }}
              />
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            {canCreate && (
              <Button
                type="primary"
                className="flex items-center"
                onClick={openAddInvoiceModal}
              >
                <PlusOutlined />
                <span className="ml-2">New</span>
              </Button>
            )}
            <Button type="primary" icon={<FileExcelOutlined />} block>
              Export All
            </Button>
          </Flex>
        </Flex>
        <div className="table-responsive">
          {canView && (
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
          )}
        </div>
        <Modal
          title="Invoice Create"
          visible={isAddInvoiceModalVisible}
          onCancel={closeAddInvoiceModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddInvoice onClose={closeAddInvoiceModal} />
        </Modal>
        <Modal
          title="Edit Invoice"
          visible={isEditInvoiceModalVisible}
          onCancel={closeEditInvoiceModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditInvoice onClose={closeEditInvoiceModal} idd={idd} />
        </Modal>

        <Modal
          visible={isViewInvoiceModalVisible}
          onCancel={closeViewInvoiceModal}
          footer={null}
          width={1000}
        >
          <ViewInvoice
            onClose={closeViewInvoiceModal}
            idd={idd}
            invoiceData={selectedInvoiceData}
          />
        </Modal>
      </Card>
    </div>
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

const InvoiceListWithStyles = () => (
  <>
    <style>{styles}</style>
    <InvoiceList />
  </>
);

export default InvoiceListWithStyles;

// import React from "react";
// import InvoiceList from "../../project/invoice/InvoiceList";

// const styles = `
//   .search-input {
//     transition: all 0.3s;
//     min-width: 200px;
//   }

//   .search-input:hover,
//   .search-input:focus {
//     border-color: #40a9ff;
//     box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
//   }

//   @media (max-width: 768px) {
//     .search-input {
//       width: 100%;
//       margin-bottom: 1rem;
//     }
//   }
// `;

// const InvoiceListWithStyles = () => (
//   <>
//     <style>{styles}</style>
//     <InvoiceList />
//   </>
// );

// export default InvoiceListWithStyles;
