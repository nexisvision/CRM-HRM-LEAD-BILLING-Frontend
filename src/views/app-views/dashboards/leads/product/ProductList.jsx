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
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils, writeFile } from "xlsx";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ViewProduct from "./ViewProduct";
import { PaymentStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DeleteProdu, GetProdu } from "./ProductReducer/ProductsSlice";

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

const ProductList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const allempdata = useSelector((state) => state.Product);

  const filtermin = allempdata.Product.data;
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [idd, setIdd] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [isEditProductModalVisible, setIsEditProductModalVisible] =
    useState(false);
  const [isViewProductModalVisible, setIsViewProductModalVisible] =
    useState(false);
  const [paymentStatisticData] = useState(PaymentStatisticData);

  useEffect(() => {
    dispatch(GetProdu(id));
  }, [dispatch]);

  useEffect(() => {
    if (filtermin) {
      setList(filtermin);
    }
  }, [filtermin]);

  // Open Add Job Modal
  const openAddProductModal = () => {
    setIsAddProductModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddProductModal = () => {
    setIsAddProductModalVisible(false);
  };

  // Open Add Job Modal
  const openEditProductModal = () => {
    setIsEditProductModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditProductModal = () => {
    setIsEditProductModalVisible(false);
  };

  // Open Add Job Modal
  const openViewProductModal = () => {
    setIsViewProductModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewProductModal = () => {
    setIsViewProductModalVisible(false);
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      setList(filtermin);
    }
  };

  const Deletefun = async (exid) => {
    try {
      const response = await dispatch(DeleteProdu(exid));
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(GetProdu(id));
      setList(list.filter((item) => item.id !== exid));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };
  const exportToExcel = () => {
    try {
      
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Product"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "ProductData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };
  const editFun = (idd) => {
    openEditProductModal();
    setIdd(idd);
  };

  const dropdownMenu = (row) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center" onClick={openViewProductModal}>
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item> */}

      <Menu.Item>
        <Flex alignItems="center" onClick={() => editFun(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>

      <Menu.Item>
        <Flex alignItems="center" onClick={() => Deletefun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
  
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => utils.antdTableSorter(a, b, "price"),
    },

    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      sorter: (a, b) => utils.antdTableSorter(a, b, "sku"),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
      sorter: (a, b) => a.description.length - b.description.length,
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : filtermin;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
        className="flex flex-wrap  gap-4"
      >
        <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
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
								{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div> */}
        </Flex>
        <Flex gap="7px" className="flex">
          <Button type="primary" className="ml-2" onClick={openAddProductModal}>
            <PlusOutlined />
            <span className="ml-2">Create Product</span>
          </Button>
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
      <Card>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: 1200 }}
         
          />
        </div>
      </Card>
      <Card>
        <Modal
          title="Add Product"
          visible={isAddProductModalVisible}
          onCancel={closeAddProductModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddProduct onClose={closeAddProductModal} idd={idd} />
        </Modal>

        <Modal
          title="Edit Product"
          visible={isEditProductModalVisible}
          onCancel={closeEditProductModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <EditProduct onClose={closeEditProductModal} idd={idd} />
        </Modal>

        <Modal
          title="Product Details"
          visible={isViewProductModalVisible}
          onCancel={closeViewProductModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <ViewProduct onClose={closeViewProductModal} />
        </Modal>
      </Card>
    </>
  );
};

export default ProductList;
