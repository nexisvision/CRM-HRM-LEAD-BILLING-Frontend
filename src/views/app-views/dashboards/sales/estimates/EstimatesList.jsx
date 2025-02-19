/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Row,
  Col,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  message
} from "antd";
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { getallquotations, getquotationsById, deletequotations } from "../estimates/estimatesReducer/EstimatesSlice";
import { utils, writeFile } from "xlsx";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import AddEstimates from "./AddEstimates";
import EditEstimates from "./EditEstimates";
import ViewEstimates from "./ViewEstimates";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
const { Option } = Select;
const getShippingStatus = (orderStatus) => {
  if (orderStatus === "Ready") {
    return "blue";
  }
  if (orderStatus === "Shipped") {
    return "cyan";
  }
  return "";
};
const orderStatusList = ["Ready", "Shipped"];
const EstimatesList = () => {
  const { salesquotations, loading, error } = useSelector((state) => state.estimate);
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedquotations, setSelectedquotations] = useState(null);
  const [isAddEstimatesModalVisible, setIsAddEstimatesModalVisible] =
    useState(false);
  const [isEditEstimatesModalVisible, setIsEditEstimatesModalVisible] =
    useState(false);
  const [isViewEstimatesModalVisible, setIsViewEstimatesModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [idd, setIdd] = useState("");
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);

  const customerData = useSelector((state) => state.customers);
  const fnddataCustomers = customerData.customers.data;


  // Fetch estimate when component mounts
  useEffect(() => {
    dispatch(getallquotations());
    dispatch(Getcus()); // Fetch customer data
  }, []);
  // useEffect(() => {
  //   setList(salesquotations); // Update list when estimates change
  // }, [salesquotations]);

  const allsdata = useSelector((state)=>state.salesquotation.salesquotations)


  useEffect(() => {
    setFilteredData(allsdata);
  }, [allsdata]);
  // Search function
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    
    // If no salesquotations data, return empty array
    if (!Array.isArray(salesquotations)) {
      setFilteredData([]);
      return;
    }

    // If search value is empty, show all data
    if (!value) {
      setFilteredData(allsdata);
      return;
    }

    // Filter the data based on search value
    const filtered = allsdata.filter(item =>
      item.customer?.toLowerCase().includes(value) ||
      item.category?.toLowerCase().includes(value) 
      // item.phoneCode?.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Open Add Job Modal
  const openAddEstimatesModal = () => {
    setIsAddEstimatesModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddEstimatesModal = () => {
    setIsAddEstimatesModalVisible(false);
  };
  // Open Add Job Modal
  const openEditEstimatesModal = () => {
    setIsEditEstimatesModalVisible(true);
  };
  // Close Add Job Modal
  const closeEditEstimatesModal = () => {
    setIsEditEstimatesModalVisible(false);
  };
  const openviewEstimatesModal = () => {
    setIsViewEstimatesModalVisible(true);
  };
  // Close Add Job Modal
  const closeViewEstimatesModal = () => {
    setIsViewEstimatesModalVisible(false);
  };
  const EditFun = (id) => {
    openEditEstimatesModal();
    setIdd(id);
    console.log("iddd",id);
    
};
  // Update the exportToExcel function to use filteredData instead of list
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(filteredData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Estimates");
      writeFile(wb, "EstimatesData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };
  const DeleteFun = async (id) => {
    try {
      await dispatch(deletequotations(id));
      await dispatch(getallquotations());
      setList(list.filter((item) => item.id !== id));
      message.success("Deleted user successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
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
            
                if (parsedPermissions["dashboards-sales-estimates"] && parsedPermissions["dashboards-sales-estimates"][0]?.permissions) {
                  allpermisson = parsedPermissions["dashboards-sales-estimates"][0].permissions;
                  console.log('Parsed Permissions:', allpermisson);
                
                } else {
                  console.log('dashboards-sales-estimates is not available');
                }
                
                const canCreateClient = allpermisson?.includes('create');
                const canEditClient = allpermisson?.includes('edit');
                const canDeleteClient = allpermisson?.includes('delete');
                const canViewClient = allpermisson?.includes('view');
      
                ///endpermission


  const dropdownMenu = (row) => (
    <Menu>
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item onClick={() => {
                              console.log("View Quotation:", row); // Debug log
                              setSelectedQuotationId(row.id);
                              openviewEstimatesModal();
                          }}>
            <Flex alignItems="center">
                <EyeOutlined />
                <span className="ml-2">View Details</span>
            </Flex>
        </Menu.Item>
        ) : null}
        <Menu.Item>
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
        </Menu.Item>
       

        
        {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
           <Menu.Item onClick={() => EditFun(row.id)}>
           <Flex alignItems="center">
               <EditOutlined />
               <span className="ml-2">Edit</span>
           </Flex>
       </Menu.Item>
                      ) : null}
        
        
        {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                        <Menu.Item>
                        <Flex alignItems="center" onClick={() => DeleteFun(row.id)}>
                          <DeleteOutlined />
                          <span className="ml-2" >Delete</span>
                        </Flex>
                      </Menu.Item>
                      ) : null}


    </Menu>
  );
  const tableColumns = [
    {
      title: "Quotation Number",
      dataIndex: "salesQuotationNumber",
      render: (text, record) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
            // Check if user has view permission
            if (whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) {
              setSelectedQuotationId(record.id);
              openviewEstimatesModal();
            }
          }}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "salesQuotationNumber"),
    },
    {
      title: "Issue  Date",
      dataIndex: "issueDate",
      render: (_, record) => (
        <span>
          {record.issueDate ? dayjs(record.issueDate).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "issueDate"),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus size={30} src={record.image} name={record.created_by} />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "created_by"),
    },
    // {
    //   title: "Client",
    //   dataIndex: "client",
    //   key: "client",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "client"),
    // },
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
    // {
    //   title: "Currency",
    //   dataIndex: "currency",
    //   key: "currency",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "currency"),
    // },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
    },
    // {
    //   title: "Project",
    //   dataIndex: "project",
    //   key: "project",
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "project"),
    // },
    // {
    //  title: 'Company Name',
    //  dataIndex: 'company',
    //  sorter: {
    //      compare: (a, b) => a.company.length - b.company.length,
    //  },
    // },
    {
      title: "Amount",
      dataIndex: "total",
      render: (_, record) => (
        <span className="font-weight-semibold">
          <NumberFormat
            displayType={"text"}
            value={(Math.round(record.total * 100) / 100).toFixed(2)}
            prefix={"$"}
            thousandSeparator={true}
          />
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "total"),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (_, record) => (
    //     <>
    //       <Tag color={getShippingStatus(record.status)}>
    //         {record.orderStatus}
    //       </Tag>
    //     </>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
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
 
  // const onSearch = (e) => {
  //   const value = e.currentTarget.value;
  //   const searchArray = e.currentTarget.value ? list : OrderListData;
  //   const data = utils.wildCardSearch(searchArray, value);
  //   setList(data);
  //   setSelectedRowKeys([]);
  // };

  // Ensure filteredData is always an array
  const safeFilteredData = React.useMemo(() => {
    if (!Array.isArray(filteredData)) {
      console.warn('filteredData is not an array:', filteredData);
      return [];
    }
    return filteredData;
  }, [filteredData]);

  return (
    <>
      <Card>
        {/* <Row gutter={16}>
          {annualStatisticData.map((elm, i) => (
            <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
              <StatisticWidget
                title={elm.title}
                value={elm.value}
                status={elm.status}
                subtitle={elm.subtitle}
              />
            </Col>
          ))}
        </Row> */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            cclassName="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48 me-2">
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={e => onSearch(e)}
              />
            </div>
            <div className="w-full md:w-48 ">
              <Col span={12}>
                <Select
                  defaultValue="All"
                  style={{ width: "100%" }}
                  onChange={(value) =>
                    setFilteredData(
                      allsdata.filter(
                        (item) => value === "All" || item.orderStatus === value
                      )
                    )
                  }
                >
                  <Option value="All">All</Option>
                  <Option value="Ready">Ready</Option>
                  <Option value="Shipped">Shipped</Option>
                </Select>
              </Col>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
        

               {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                              <Button
                                                                              type="primary"
                                                                              className="flex items-center"
                                                                              onClick={openAddEstimatesModal}
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
                                                              dataSource={safeFilteredData}
                                                              rowKey="id"
                                                              scroll={{ x: 1200 }}
                                                              loading={loading}
                                                            />
                                                              ) : null}


        
        </div>
      </Card>
      <Card>
        <Modal
          title="Add Estimate"
          visible={isAddEstimatesModalVisible}
          onCancel={closeAddEstimatesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddEstimates onClose={closeAddEstimatesModal} />
        </Modal>
        <Modal
          title="Edit Estimate"
          visible={isEditEstimatesModalVisible}
          onCancel={closeEditEstimatesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditEstimates onClose={closeEditEstimatesModal} idd={idd} />
        </Modal>
        <Modal
          title="View Estimate"
          visible={isViewEstimatesModalVisible}
          onCancel={() => {
            setSelectedQuotationId(null);
            closeViewEstimatesModal();
          }}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          {selectedQuotationId && (
            <ViewEstimates 
              quotationId={selectedQuotationId} 
              onClose={closeViewEstimatesModal} 
            />
          )}
        </Modal>
      </Card>
    </>
  );
};
export default EstimatesList;
