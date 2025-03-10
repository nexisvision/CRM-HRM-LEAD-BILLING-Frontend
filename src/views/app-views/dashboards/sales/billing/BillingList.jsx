import React, { Component, useEffect } from "react";
import { useState } from "react";
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
  DatePicker,
} from "antd";
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
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import { utils, writeFile } from "xlsx";
import AddBilling from "./AddBilling";
import EditBilling from "./EditBilling";
import ViewBilling from "./ViewBilling";
import { getInvoice } from "../invoice/InvoiceReducer/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";

import { deltebil, getbil } from "./billing2Reducer/billing2Slice";


const { Option } = Select;

export const BillingList = () => {
  const [list, setList] = useState(OrderListData);
  const [isAddBillingModalVisible, setIsAddBillingModalVisible] =
    useState(false);
  const [isEditBillingModalVisible, setIsEditBillingModalVisible] =
    useState(false);
  const [isViewBillingModalVisible, setIsViewBillingModalVisible] =
    useState(false);
  const dispatch = useDispatch();

  const AllLoggeddtaa = useSelector((state) => state.user);
  const lid = AllLoggeddtaa.loggedInUser.id;
  const [idd, setIdd] = useState("");

  const alldata = useSelector((state) => state.salesbilling);
  const fnddata = alldata.salesbilling.data;

  const [selectedBillingId, setSelectedBillingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [statusOptions, setStatusOptions] = useState(['All']);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(getbil(lid));
  }, []);


  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  useEffect(() => {
    if (fnddata && fnddata.length > 0) {
      const uniqueStatuses = [...new Set(fnddata.map(bill => bill.status))].filter(Boolean);
      setStatusOptions(['All', ...uniqueStatuses]);
    }
  }, [fnddata]);

  const openAddBillingModal = () => {
    setIsAddBillingModalVisible(true);
  };

  const closeAddBillingModal = () => {
    setIsAddBillingModalVisible(false);
  };

  const openEditBillingModal = () => {
    setIsEditBillingModalVisible(true);
  };

  const closeEditBillingModal = () => {
    setIsEditBillingModalVisible(false);
  };

  const openViewBillingModal = () => {
    setIsViewBillingModalVisible(true);
  };

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
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Billing"); // Append the worksheet to the workbook

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

            const roleId = useSelector((state) => state.user.loggedInUser.role_id);
            const roles = useSelector((state) => state.role?.role?.data);
            const roleData = roles?.find(role => role.id === roleId);
        
            const whorole = roleData.role_name;
        
            const parsedPermissions = Array.isArray(roleData?.permissions)
            ? roleData.permissions
            : typeof roleData?.permissions === 'string'
            ? JSON.parse(roleData.permissions)
            : [];
          
          
            let allpermisson;  
        
            if (parsedPermissions["dashboards-sales-billing"] && parsedPermissions["dashboards-sales-billing"][0]?.permissions) {
              allpermisson = parsedPermissions["dashboards-sales-billing"][0].permissions;
            
            } else {
            }
            
            const canCreateClient = allpermisson?.includes('create');
            const canEditClient = allpermisson?.includes('edit');
            const canDeleteClient = allpermisson?.includes('delete');
            const canViewClient = allpermisson?.includes('view');
  

  const dropdownMenu = (row) => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => {
          setSelectedBillingId(row.id);
          openViewBillingModal();
        }
      },
      
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editfun(row.id)
      }] : []),
      
      ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => delfun(row.id)
      }] : [])
    ]
  });

  const tableColumns = [
    {
      title: "billNumber",
      dataIndex: "billNumber",
      render: (text, record) => (
        <span
          className=" cursor-pointer hover:underline"
          onClick={() => {
            // Check if user has view permission
            if (whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) {
              setSelectedBillingId(record.id);
              openViewBillingModal();
            }
          }}
        >
          {record.billNumber}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "billNumber"),
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
      render: (_, record) => (
        <span>
          {record.billDate ? dayjs(record.billDate).format('DD-MM-YYYY') : ''}
        </span>
      ),
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

  const filterBillings = (text, date, status) => {
    if (!fnddata) return;

    let filtered = [...fnddata];

    if (text) {
      filtered = filtered.filter(bill => 
        bill.billNumber?.toLowerCase().includes(text.toLowerCase())
      );
    }

    if (date) {
      const selectedDate = dayjs(date).startOf('day');
      filtered = filtered.filter(bill => {
        if (!bill.billDate) return false;
        const billDate = dayjs(bill.billDate).startOf('day');
        return billDate.isSame(selectedDate, 'day');
      });
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(bill => 
        bill.status === status
      );
    }

    setList(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    filterBillings(searchText, date, selectedStatus);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterBillings(value, selectedDate, selectedStatus);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    filterBillings(searchText, selectedDate, value);
  };

  const getFilteredBillings = () => {
    if (!list) return [];
    return list;
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
                placeholder="Search by bill number..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mb-3">
              <DatePicker
                onChange={handleDateChange}
                format="DD-MM-YYYY"
                placeholder="Select Date"
                className="w-100"
                style={{ minWidth: 200 }}
                allowClear
                value={selectedDate}
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-100"
                style={{ minWidth: 180 }}
              >
                {statusOptions.map((status) => (
                  <Option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            

             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                <Button
                                                type="primary"
                                                className="flex items-center"
                                                onClick={openAddBillingModal}
                                              >
                                                <PlusOutlined />
                                                <span className="ml-2">New</span>
                                              </Button>
                                                ) : null}

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


           {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                           <Table
                                           columns={tableColumns}
                                           dataSource={getFilteredBillings()}
                                           rowKey="id"
                                           scroll={{ x: 1200 }}
                                           pagination={{
                                             total: getFilteredBillings().length,
                                             pageSize: 10,
                                             showSizeChanger: true,
                                             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                           }}
                                         />
                                          ) : null}
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
          <ViewBilling 
            onClose={closeViewBillingModal} 
            billingId={selectedBillingId} 
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

const BillingListWithStyles = () => (
  <>
    <style>{styles}</style>
    <BillingList />
  </>
);

export default BillingListWithStyles;
