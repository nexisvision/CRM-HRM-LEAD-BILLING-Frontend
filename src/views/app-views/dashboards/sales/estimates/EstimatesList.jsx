/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Menu,
  Modal,
  message,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { getallquotations, deletequotations } from "../estimates/estimatesReducer/EstimatesSlice";
import { utils, writeFile } from "xlsx";
import { useSelector, useDispatch } from "react-redux";
import AddEstimates from "./AddEstimates";
import EditEstimates from "./EditEstimates";
import ViewEstimates from "./ViewEstimates";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
const { Option } = Select;
const EstimatesList = () => {
  const [list, setList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isAddEstimatesModalVisible, setIsAddEstimatesModalVisible] =
    useState(false);
  const [isEditEstimatesModalVisible, setIsEditEstimatesModalVisible] =
    useState(false);
  const [isViewEstimatesModalVisible, setIsViewEstimatesModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [idd, setIdd] = useState("");
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryOptions, setCategoryOptions] = useState(['All']);

  const customerData = useSelector((state) => state.customers);
  const fnddataCustomers = customerData.customers.data;
  useEffect(() => {
    dispatch(getallquotations());
    dispatch(Getcus());
  }, [dispatch]);

  const allsdata = useSelector((state) => state.salesquotation.salesquotations)


  useEffect(() => {
    setFilteredData(allsdata);
  }, [allsdata]);

  useEffect(() => {
    if (allsdata && allsdata.length > 0) {
      const uniqueCategories = [...new Set(allsdata.map(item => item.category))].filter(Boolean);
      setCategoryOptions(['All', ...uniqueCategories]);
    }
  }, [allsdata]);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    // If no data or empty search, show all data
    if (!value || !allsdata) {
      setFilteredData(allsdata);
      return;
    }

    // Filter the data based on Quotation Number
    const filtered = allsdata.filter(estimate =>
      estimate.salesQuotationNumber?.toString().toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

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
  };
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

  const whorole = roleData?.role_name;

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


  const getDropdownItems = (row) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => {
          setSelectedQuotationId(row.id);
          openviewEstimatesModal();
        }
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => EditFun(row.id)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => DeleteFun(row.id),
        danger: true
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Quotation Number",
      dataIndex: "salesQuotationNumber",
      render: (text, record) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
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

    {
      title: "Customer",
      dataIndex: "customer",
      render: (_, record) => {
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
      key: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
    },

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

    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    if (value === 'All') {
      setFilteredData(allsdata);
      return;
    }

    const filtered = allsdata.filter(item =>
      item.category === value
    );
    setFilteredData(filtered);
  };

  const getFilteredEstimates = () => {
    if (!filteredData) return [];

    let filtered = filteredData;

    if (searchText) {
      filtered = filtered.filter(item =>
        item.salesQuotationNumber?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item =>
        item.category === selectedCategory
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
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search by quotation number..."
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
              dataSource={getFilteredEstimates()}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                total: getFilteredEstimates().length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              }}
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
        <style>{`
          .ant-dropdown-menu {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 4px;
          }
          .ant-dropdown-menu-item {
            padding: 8px 16px;
            border-radius: 4px;
            margin: 2px 0;
            transition: all 0.3s;
          }
          .ant-dropdown-menu-item:hover {
            background-color: #f5f5f5;
          }
          .ant-dropdown-menu-item-danger:hover {
            background-color: #fff1f0;
          }
          .ant-dropdown-menu-item .anticon {
            font-size: 16px;
            margin-right: 8px;
          }
        `}</style>
      </Card>
    </>
  );
};
export default EstimatesList;
