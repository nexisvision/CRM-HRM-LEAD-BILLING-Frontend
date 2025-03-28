/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Menu,
  Modal,
  message,
  Dropdown,
} from "antd";
import {
  FileExcelOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import { utils, writeFile } from "xlsx";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DeleteProdu, GetProdu } from "./ProductReducer/ProductsSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const allempdata = useSelector((state) => state.Product);
  const filtermin = allempdata.Product.data;
  const [list, setList] = useState([]);
  const [idd, setIdd] = useState("");
  const [isAddProductModalVisible, setIsAddProductModalVisible] =
    useState(false);
  const [isEditProductModalVisible, setIsEditProductModalVisible] =
    useState(false);
  const [isViewProductModalVisible, setIsViewProductModalVisible] =
    useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(GetProdu(id));
  }, [dispatch, id]);

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

  // Close Add Job Modal
  const closeViewProductModal = () => {
    setIsViewProductModalVisible(false);
  };


  const Deletefun = async (exid) => {
    try {
      const response = await dispatch(DeleteProdu(exid));
      if (response.error) {
        throw new Error(response.error.message);
      }
      setList(list.filter((item) => item.id !== exid));

    } catch (error) {
      console.error("Error deleting user:", error.message || error);
    }
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Product");
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

  const getDropdownItems = (row) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => editFun(row.id)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => Deletefun(row.id),
      danger: true
    }
  ];

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
      title: 'HSN/SAC',
      dataIndex: 'hsn_sac',
      sorter: (a, b) => utils.antdTableSorter(a, b, "hsn_sac"),
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


  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    // If search value is empty, show all data
    if (!value) {
      setList(filtermin);
      return;
    }

    // Filter the data based on product name
    const filtered = filtermin.filter(product =>
      product.name?.toLowerCase().includes(value)
    );

    setList(filtered);
  };

  const getFilteredProducts = () => {
    if (!list) return [];

    let filtered = list;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
        className="flex flex-wrap gap-4"
      >
        <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input
              placeholder="Search by product name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
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
            dataSource={getFilteredProducts()}
            rowKey="id"
            scroll={{ x: 1000 }}
            pagination={{
              total: getFilteredProducts().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </div>
      </Card>

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

  .ant-dropdown-menu {
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .ant-dropdown-menu-item {
    padding: 8px 16px;
  }
  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }
  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }
`;

const ProductListWithStyles = () => (
  <>
    <style>{styles}</style>
    <ProductList />
  </>
);

export default ProductListWithStyles;
