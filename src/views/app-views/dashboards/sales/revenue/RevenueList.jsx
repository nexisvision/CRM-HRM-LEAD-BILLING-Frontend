/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Menu,
  Tag,
  Modal,
  message,
  DatePicker,
} from "antd";
import {
  FileExcelOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import { utils, writeFile } from "xlsx";
import AddRevenue from "./AddRevenue";
import EditRevenue from "./EditRevenue";
import { deleteRevenue, getRevenue } from "./RevenueReducer/RevenueSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const RevenueList = () => {
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddRevenueModalVisible, setIsAddRevenueModalVisible] =
    useState(false);
  const [isEditRevenueModalVisible, setIsEditRevenueModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryOptions, setCategoryOptions] = useState(['All']);

  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customers);
  const fnddataCustomers = customerData.customers.data;

  const alldatas = useSelector((state) => state.Revenue);
  const fnddata = alldatas.Revenue.data;

  useEffect(() => {
    dispatch(getRevenue());
    dispatch(Getcus());
  }, []);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  useEffect(() => {
    if (fnddata && fnddata.length > 0) {
      const uniqueCategories = [...new Set(fnddata.map(revenue => revenue.category))].filter(Boolean);
      setCategoryOptions(['All', ...uniqueCategories]);
    }
  }, [fnddata]);

  // Open Add Job Modal
  const openAddRevenueModal = () => {
    setIsAddRevenueModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddRevenueModal = () => {
    setIsAddRevenueModalVisible(false);
  };

  // Open Add Job Modal
  const openEditRevenueModal = () => {
    setIsEditRevenueModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditRevenueModal = () => {
    setIsEditRevenueModalVisible(false);
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "revenueStatus";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      setList(fnddata);
    }
  };

   //// permission
    
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
          
              if (parsedPermissions["dashboards-sales-revenue"] && parsedPermissions["dashboards-sales-revenue"][0]?.permissions) {
                allpermisson = parsedPermissions["dashboards-sales-revenue"][0].permissions;
              
              } else {
              }
              
              const canCreateClient = allpermisson?.includes('create');
              const canEditClient = allpermisson?.includes('edit');
              const canDeleteClient = allpermisson?.includes('delete');
              const canViewClient = allpermisson?.includes('view');
    
              ///endpermission



  const exportToExcel = () => {
    try {
      // Create a worksheet from the formatted data
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Revenue"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "RevenueData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };
  const dletefun = (userId) => {
    dispatch(deleteRevenue(userId)).then(() => {
      dispatch(getRevenue());
      setList(list.filter((item) => item.id !== userId));
      message.success("revenue deleted successfully.");
    });
  };

  const editfun = (idd) => {
    openEditRevenueModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => ({
    items: [
      // Conditionally add edit menu item
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editfun(row.id)
      }] : []),
      
      // Conditionally add delete menu item
      ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => dletefun(row.id)
      }] : [])
    ]
  });

  const tableColumns = [
   
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: (a, b) => utils.antdTableSorter(a, b, "amount"),
    },
    {
      title: "Account",
      dataIndex: "account",
      sorter: (a, b) => utils.antdTableSorter(a, b, "account"),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      render: (_, record) => {
        // Find the customer from customers data
        const customerData = fnddataCustomers?.find(cust => cust.id === record.customer);
        return <span>{customerData?.name || "Unknown Customer"}</span>;
      },
      sorter: (a, b) => {
        const customerA = fnddataCustomers?.find(cust => cust.id === a.customer)?.name || '';
        const customerB = fnddataCustomers?.find(cust => cust.id === b.customer)?.name || '';
        return customerA.localeCompare(customerB);
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (
        <span>
          {record.date ? dayjs(record.date).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "date"),
    },
    {
        title: "Description",
        dataIndex: "description",
        render: (description) => (
            <div
                dangerouslySetInnerHTML={{
                    __html: description || 'N/A'
                }}
                style={{
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            />
        ),
        sorter: (a, b) => {
            const descA = a.description?.replace(/<[^>]+>/g, '') || '';
            const descB = b.description?.replace(/<[^>]+>/g, '') || '';
            return descA.localeCompare(descB);
        }
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

  const filterRevenues = (text, date, category) => {
    if (!fnddata) return;

    let filtered = [...fnddata];

    // Apply text search filter
    if (text) {
      filtered = filtered.filter(revenue => {
        const customerName = fnddataCustomers?.find(cust => 
          cust.id === revenue.customer
        )?.name?.toLowerCase();
        const plainDescription = revenue.description?.replace(/<[^>]+>/g, '').toLowerCase() || '';
        
        return customerName?.includes(text.toLowerCase()) || plainDescription.includes(text.toLowerCase());
      });
    }

    // Apply date filter
    if (date) {
      const selectedDate = dayjs(date).startOf('day');
      filtered = filtered.filter(revenue => {
        if (!revenue.date) return false;
        const revenueDate = dayjs(revenue.date).startOf('day');
        return revenueDate.isSame(selectedDate, 'day');
      });
    }

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(revenue => 
        revenue.category === category
      );
    }

    setList(filtered);
  };

  const handleDateChange = (date) => {
    setDateRange(date);
    filterRevenues(searchText, date, selectedCategory);
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    filterRevenues(value, dateRange, selectedCategory);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    filterRevenues(searchText, dateRange, value);
  };

  const getFilteredRevenues = () => {
    if (!list) return [];
    
    let filtered = list;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(revenue => {
        const customerName = fnddataCustomers?.find(cust => 
          cust.id === revenue.customer
        )?.name?.toLowerCase();
        
        return customerName?.includes(searchText.toLowerCase());
      });
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(revenue => 
        revenue.category === selectedCategory
      );
    }

    return filtered;
  };

  return (
    <>
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap gap-4"
        >
          <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search by customer name..."
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
              />
            </div>
            <div className="mb-3">
              <Select
                defaultValue="All"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-100"
                style={{ minWidth: 180 }}
                placeholder="Select Category"
              >
                {categoryOptions.map((category) => (
                  <Option key={category} value={category}>
                    {category === 'All' ? 'All Categories' : category}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
        

               {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                               <Button
                                                               type="primary"
                                                               className="ml-2"
                                                               onClick={openAddRevenueModal}
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
                                                    dataSource={getFilteredRevenues()}
                                                    rowKey="id"
                                                    pagination={{
                                                      total: getFilteredRevenues().length,
                                                      pageSize: 10,
                                                      showSizeChanger: true,
                                                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                                    }}
                                                  />
                                                    ) : null}

          
        </div>
      </Card>
      
        <Modal
          title="Create Revenue"
          visible={isAddRevenueModalVisible}
          onCancel={closeAddRevenueModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddRevenue onClose={closeAddRevenueModal} />
        </Modal>

        <Modal
          title="Edit Revenue"
          visible={isEditRevenueModalVisible}
          onCancel={closeEditRevenueModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <EditRevenue onClose={closeEditRevenueModal} idd={idd} />
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

  .ant-select {
    min-width: 180px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-select {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
`;

const RevenueListWithStyles = () => (
  <>
    <style>{styles}</style>
    <RevenueList />
  </>
);

export default RevenueListWithStyles;
