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
import { utils, writeFile } from "xlsx";
import AddRevenue from "./AddRevenue";
import EditRevenue from "./EditRevenue";
import { deleteRevenue, getRevenue } from "./RevenueReducer/RevenueSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const getRevenueStatus = (status) => {
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

// const getShippingStatus = status => {
// 	if(status === 'Ready') {
// 		return 'blue'
// 	}
// 	if(status === 'Shipped') {
// 		return 'cyan'
// 	}
// 	return ''
// }

const revenueStatusList = ["Paid", "Pending", "Expired"];

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
  // const [selectedStatus, setSelectedStatus] = useState('All');
  // const [statusOptions, setStatusOptions] = useState(['All']);
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
                console.log('Parsed Permissions:', allpermisson);
              
              } else {
                console.log('dashboards-sales-revenue is not available');
              }
              
              const canCreateClient = allpermisson?.includes('create');
              const canEditClient = allpermisson?.includes('edit');
              const canDeleteClient = allpermisson?.includes('delete');
              const canViewClient = allpermisson?.includes('view');
    
              ///endpermission



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

  const dropdownMenu = (row) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add to remark</span>
        </Flex>
      </Menu.Item>


      <Menu.Item>
        <Flex alignItems="center">
          <TiPinOutline />
          <span className="ml-2">Pin</span>
        </Flex>
      </Menu.Item> */}
      

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                           <Menu.Item>
                           <Flex alignItems="center" onClick={() => editfun(row.id)}>
                             {<EditOutlined />}
                             <span className="ml-2">Edit</span>
                           </Flex>
                         </Menu.Item>
                    ) : null}
      
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                      <Menu.Item>
                      <Flex alignItems="center" onClick={() => dletefun(row.id)}>
                        <DeleteOutlined />
                        <span className="ml-2">Delete</span>
                      </Flex>
                    </Menu.Item>
                    ) : null}


    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "Date",
    //   dataIndex: "date",
    //   render: (_, record) => (
    //     <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "date"),
    // },
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
    // {
    //   title: "Reference",
    //   dataIndex: "reference",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "reference"),
    // },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   sorter: {
    //     compare: (a, b) => a.description.length - b.description.length,
    //   },
    // },
    // {
    //   title: "Payment Receipt",
    //   dataIndex: "paymentreceipt",
    //   sorter: {
    //     compare: (a, b) => a.method.length - b.method.length,
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
      setList(fnddata);
      return;
    }
    
    // Filter the data based on customer name
    const filtered = fnddata.filter(revenue => {
      const customerName = fnddataCustomers?.find(cust => 
        cust.id === revenue.customer
      )?.name?.toLowerCase();
      
      return customerName?.includes(value);
    });
    
    setList(filtered);
  };

  // const handleStatusChange = (value) => {
  //   setSelectedStatus(value);
    
  //   if (value === 'All') {
  //     setList(fnddata);
  //     return;
  //   }

  //   const filtered = fnddata.filter(revenue => 
  //     revenue.status === value
  //   );
  //   setList(filtered);
  // };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    
    if (value === 'All') {
      setList(fnddata);
      return;
    }

    const filtered = fnddata.filter(revenue => 
      revenue.category === value
    );
    setList(filtered);
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

    // Apply status filter
    // if (selectedStatus !== 'All') {
    //   filtered = filtered.filter(revenue => 
    //     revenue.status === selectedStatus
    //   );
    // }

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
            <div className="mb-3">
              {/* <Select
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
              </Select> */}
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
