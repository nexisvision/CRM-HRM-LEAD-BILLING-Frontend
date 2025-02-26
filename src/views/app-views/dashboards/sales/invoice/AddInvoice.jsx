import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Select,
  DatePicker,
  Input,
  message,
  Row,
  Modal,
  Col,
} from "antd";
import Flex from 'components/shared-components/Flex';
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form } from "antd";
import { AddInvoices, getInvoice } from "./InvoiceReducer/InvoiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { ErrorMessage, Field } from "formik";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { useParams } from "react-router-dom";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { GetProdu, GetAllProdu } from "../../project/product/ProductReducer/ProductsSlice";

const { Option } = Select;

const AddInvoice = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);
  const [newTag, setNewTag] = useState("");
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const Tagsdetail = useSelector((state) => state.Lable);

  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  const [globalDiscountValue, setGlobalDiscountValue] = useState(0);

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      tax: 0,
      discountType: 'percentage',
      discountValue: 0,
      amount: 0,
      description: "",
    },
  ]);

  // Get currencies from the store
  const currencies = useSelector((state) => state.currencies.currencies.data);

  // Add this to get taxes from Redux store
  const { taxes } = useSelector((state) => state.tax);

  // Add this state to track selected tax details
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

  // Add loading state
  const [loading, setLoading] = useState(false);

  // Get products directly from Redux store
  const productsData = useSelector((state) => state.Product.Product);

  // Fetch currencies when component mounts
  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  // Add this useEffect to fetch taxes when component mounts
  useEffect(() => {
    dispatch(getAllTaxes());
  }, [dispatch]);

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        tax: 0,
        discountType: 'percentage',
        discountValue: 0,
        amount: 0,
        description: "",
      },
    ]);
  };

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
    } else {
      message.warning("At least one item is required");
    }
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };

        // If the field is tax, store the tax details
        if (field === 'tax' && taxes?.data) {
          const selectedTax = taxes.data.find(tax => tax.gstPercentage.toString() === value.toString());
          if (selectedTax) {
            setSelectedTaxDetails(prevDetails => ({
              ...prevDetails,
              [id]: {
                gstName: selectedTax.gstName,
                gstPercentage: selectedTax.gstPercentage
              }
            }));
          }
        }

        // Calculate individual item amounts
        const quantity = parseFloat(updatedRow.quantity) || 0;
        const price = parseFloat(updatedRow.price) || 0;
        const taxPercentage = parseFloat(updatedRow.tax) || 0;
        
        // Calculate item discount based on type
        const itemDiscountValue = parseFloat(updatedRow.discountValue) || 0;
        let itemDiscountAmount = 0;
        
        if (updatedRow.discountType === 'percentage') {
          itemDiscountAmount = (quantity * price * itemDiscountValue) / 100;
        } else {
          itemDiscountAmount = itemDiscountValue;
        }

        const baseAmount = quantity * price;
        const taxAmount = ((baseAmount - itemDiscountAmount) * taxPercentage) / 100;
        const finalAmount = baseAmount - itemDiscountAmount + taxAmount;
        
        updatedRow.amount = finalAmount.toFixed(2);
        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
  };

  const calculateTotal = (data, globalDiscValue, globalDiscType) => {
    // Ensure globalDiscValue is a number
    const globalDiscountValueNum = parseFloat(globalDiscValue) || 0;

    const totals = data.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const baseAmount = quantity * price;
      
      // Calculate item discount
      const itemDiscountValue = parseFloat(row.discountValue) || 0;
      let itemDiscountAmount = 0;
      
      if (row.discountType === 'percentage') {
        itemDiscountAmount = (baseAmount * itemDiscountValue) / 100;
      } else {
        itemDiscountAmount = itemDiscountValue;
      }

      const taxPercentage = parseFloat(row.tax) || 0;
      const taxAmount = ((baseAmount - itemDiscountAmount) * taxPercentage) / 100;
      const finalAmount = baseAmount - itemDiscountAmount + taxAmount;
      
      return {
        subtotal: acc.subtotal + finalAmount,
        itemDiscount: acc.itemDiscount + itemDiscountAmount,
        tax: acc.tax + taxAmount
      };
    }, { subtotal: 0, itemDiscount: 0, tax: 0 });

    // Calculate global discount
    let globalDiscountAmount = 0;
    if (globalDiscType === 'percentage') {
      globalDiscountAmount = (totals.subtotal * globalDiscountValueNum) / 100;
    } else {
      globalDiscountAmount = globalDiscountValueNum;
    }

    const finalTotal = totals.subtotal - globalDiscountAmount;

    // Ensure all values are numbers before using toFixed
    setTotals({
      subtotal: Number(totals.subtotal).toFixed(2),
      itemDiscount: Number(totals.itemDiscount).toFixed(2),
      globalDiscount: Number(globalDiscountAmount).toFixed(2),
      totalTax: Number(totals.tax).toFixed(2),
      finalTotal: Number(finalTotal).toFixed(2)
    });
  };

  const [totals, setTotals] = useState({
    subtotal: "0.00",
    itemDiscount: "0.00",
    globalDiscount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00"
  });

  const handleFinish = async () => {
    try {
        setLoading(true);
        
        // Get form values
        const formValues = await form.validateFields();
        
        const items = {};
        tableData.forEach((item, index) => {
            items[`item_${index + 1}`] = {
                item: item.item,
                description: item.description || '',
                quantity: parseFloat(item.quantity) || 0,
                price: parseFloat(item.price) || 0,
                tax_name: selectedTaxDetails[item.id]?.gstName || '',
                tax: parseFloat(item.tax) || 0,
                amount: parseFloat(item.amount) || 0,
                discountType: item.discountType || 'percentage',
                discountValue: parseFloat(item.discountValue) || 0
            };
        });

        // Calculate global discount
        const subtotal = parseFloat(totals.subtotal) || 0;
        const globalDiscountValueNum = parseFloat(globalDiscountValue) || 0;
        let globalDiscountAmount = 0;

        if (globalDiscountType === 'percentage') {
            globalDiscountAmount = (subtotal * globalDiscountValueNum) / 100;
        } else {
            globalDiscountAmount = globalDiscountValueNum;
        }

        const updatedValues = {
            ...formValues,
            issueDate: formValues.issueDate ? formValues.issueDate.format('YYYY-MM-DD') : null,
            items: items,
            discountType: globalDiscountType,
            discountValue: globalDiscountValueNum,
            discount: parseFloat(globalDiscountAmount) || 0,
            itemDiscount: parseFloat(totals.itemDiscount) || 0,
            tax: parseFloat(totals.totalTax) || 0,
            total: parseFloat(totals.finalTotal) || 0
        };

        await dispatch(AddInvoices(updatedValues));
        message.success("Invoice created successfully!");
        dispatch(getInvoice());
        form.resetFields();
        setTableData([
            {
                id: Date.now(),
                item: "",
                quantity: 1,
                price: 0,
                tax: 0,
                discountType: 'percentage',
                discountValue: 0,
                amount: 0,
                description: "",
            }
        ]);
        setTotals({
            subtotal: "0.00",
            itemDiscount: "0.00",
            globalDiscount: "0.00",
            totalTax: "0.00",
            finalTotal: "0.00",
        });
        onClose();
    } catch (error) {
        console.error('Error creating invoice:', error);
        message.error("Failed to create invoice: " + (error.message || "Unknown error"));
    } finally {
        setLoading(false);
    }
};

  const fetchTags = async () => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueTags = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) {
      message.error("Please enter a tag name");
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newTag.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Status added successfully");
      setNewTag("");
      setIsTagModalVisible(false);

      // Fetch updated tags
      await fetchTags();
    } catch (error) {
      console.error("Failed to add Status:", error);
      message.error("Failed to add Status");
    }
  };

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dispatch(GetAllProdu());
        console.log("Products response:", response); // Debug log
        
        if (response?.payload?.data) {
          setProducts(response.payload.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to load products");
      }
    };

    fetchProducts();
  }, [dispatch]);

  // Update local state when Redux store changes
  useEffect(() => {
    if (productsData?.data) {
      console.log("Products from Redux:", productsData.data);
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Product selection handler
  const handleProductChange = (productId) => {
    console.log("Selected product ID:", productId); // Debug log
    
    if (productId) {
      const selectedProd = products.find(p => p.id === productId);
      console.log("Found product:", selectedProd); // Debug log
      
      if (selectedProd) {
        const updatedData = tableData.map((row, index) => {
          if (index === tableData.length - 1 && !row.item) {
            return {
              ...row,
              item: selectedProd.name,
              description: selectedProd.description || "",
              price: selectedProd.price || 0,
              hsn_sac: selectedProd.hsn_sac || "",
            };
          }
          return row;
        });

        setTableData(updatedData);
        setSelectedProduct(productId);
        calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
      }
    }
  };

  // Add a reset function that can be called independently if needed
  const resetForm = () => {
    form.resetFields();
    setTableData([
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        tax: 0,
        discountType: 'percentage',
        discountValue: 0,
        amount: 0,
        description: "",
      }
    ]);
    setTotals({
      subtotal: "0.00",
      itemDiscount: "0.00",
      globalDiscount: "0.00",
      totalTax: "0.00",
      finalTotal: "0.00",
    });
  };

  return (
    <div>
      <Form form={form} layout="vertical">
      <h2 className="mb-2 border-b pb-[20px] font-medium"></h2>
        <Card className="border-0">
          <Row gutter={16}>
            <Col span={12} className="mt-1">
              <Form.Item
                label="Customer"
                name="customer"
                rules={[
                  { required: true, message: "Please select a customer" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Customer"
                  loading={!fnddata}
                >
                  {fnddata && fnddata.length > 0 ? (
                    fnddata.map((customer) => (
                      <Option key={customer.id} value={customer.id}>
                        {customer.name || "Unnamed Customer"}
                      </Option>
                    ))
                  ) : (
                    <Option value="" disabled>
                      No customers available
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12} className="mt-1">
              <Form.Item
                label="Issue Date"
                name="issueDate"
                rules={[
                  { required: true, message: "Please select issue date" },
                ]}

              >
                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Due Date"
                name="dueDate"
                rules={[{ required: true, message: "Please select due date" }]}
              >

                <DatePicker className="w-full" format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12} className="">
              <Form.Item
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please select or add a category",
                  },
                ]}
              >
                <Select
                  placeholder="Select or add new category"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div
                        style={{
                          padding: "8px",
                          borderTop: "1px solid #e8e8e8",
                        }}
                      >
                        <Button
                          type="link"
                          onClick={() => setIsTagModalVisible(true)}
                          block
                        >
                          Add New Category
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {tags &&
                    tags.map((tag) => (
                      <Option key={tag.id} value={tag.name}>
                        {tag.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reference Number"
                name="refnumber"
               
              >
                <Input placeholder="Enter Reference Number" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Currency"
                name="currency"
                rules={[{ required: true, message: 'Please select currency' }]}
              >
                <Select
                  placeholder="Select Currency"
                  onChange={(value) => {
                    const selected = currencies?.find(c => c.currencyCode === value);
                    setSelectedCurrencyIcon(selected?.currencyIcon || '₹');
                  }}
                >
                  {currencies?.map((currency) => (
                    <Option
                      key={currency.id}
                      value={currency.currencyCode}
                    >
                       {currency.currencyCode}
                       ({currency.currencyIcon})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>
        </Card>

        <Card>
          <h4 className="font-semibold text-lg mb-3">Product & Services</h4>
          <div>
            <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4'>
              <Flex className="flex" mobileFlex={false}>
                <div className="w-full flex gap-4">
                  <div>
                    <Select
                      value={selectedProduct}
                      onChange={handleProductChange}
                      className="w-full !rounded-none"
                      placeholder="Select Product"
                      rootClassName="!rounded-none"
                      allowClear
                      loading={!products.length}
                    >
                      {products && products.length > 0 ? (
                        products.map((product) => (
                          <Option key={product.id} value={product.id}>
                            {product.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No products available</Option>
                      )}
                    </Select>
                  </div>
                </div>

              </Flex>
            </Flex>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Description<span className="text-red-500">*</span>
                    </th>
                    
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Quantity<span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Unit Price<span className="text-red-500">*</span>
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      HSN/SAC
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Discount
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      TAX (%)
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Amount
                    </th>
                    <th className="px-2 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr>
                        <td className="px-2 py-2 border-b">
                          <input
                            type="text"
                            value={row.item}
                            onChange={(e) => handleTableDataChange(row.id, "item", e.target.value)}
                            placeholder="Item Name"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                       
                        <td className="px-2 py-2 border-b">
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                            placeholder="Qty"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-2 py-2 border-b">
                          <Input
                            prefix={selectedCurrencyIcon}
                            type="number"
                            min="0"
                            value={row.price}
                            onChange={(e) => handleTableDataChange(row.id, "price", e.target.value)}
                            placeholder="Price"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-2 py-2 border-b">
                          <input
                            type="text"
                            value={row.hsn_sac}
                            onChange={(e) => handleTableDataChange(row.id, "hsn_sac", e.target.value)}
                            placeholder="HSN/SAC"
                            className="w-full p-2 border rounded"
                            readOnly
                          />
                        </td>
                        <td className="px-2 py-2 border-b">
                          <div className="flex space-x-2">
                            <Select
                              value={row.discountType}
                              onChange={(value) => handleTableDataChange(row.id, "discountType", value)}
                              style={{ width: '100px' }}
                            >
                              <Option value="percentage">Percentage</Option>
                              <Option value="fixed">Fixed</Option>
                            </Select>
                            <Input
                              type="number"
                              min="0"
                              value={row.discountValue}
                              onChange={(e) => handleTableDataChange(row.id, "discountValue", e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </td>
                        <td className="py-2 border-b">
                          <Select
                            value={row.tax}
                            onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
                            className="w-[100px] p-2"
                          >
                            <Option value="0">No Tax</Option>
                            {taxes && taxes.data && taxes.data.map(tax => (
                              <Option key={tax.id} value={tax.gstPercentage}>
                                {tax.gstName} ({tax.gstPercentage}%)
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-2 py-2 border-b">
                          <span>{selectedCurrencyIcon} {parseFloat(row.amount || 0).toFixed(2)}</span>
                        </td>
                        <td className="px-2 py-1 border-b text-center">
                          <Button danger onClick={() => handleDeleteRow(row.id)}>
                            <DeleteOutlined />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="px-2 py-2 border-b">
                          <textarea
                            rows={2}
                            value={row.description}
                            onChange={(e) => handleTableDataChange(row.id, "description", e.target.value)}
                            placeholder="Description"
                            className="w-[70%] p-2 border"
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <div className="form-buttons text-left mt-2">
              <Button type="primary" onClick={handleAddRow}>
                <PlusOutlined /> Add Items
              </Button>
            </div>
            </div>
          </div>

          {/* summary */}

          <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
            <table className="w-full lg:w-[50%] p-2">
              <tbody>
                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Sub Total</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.subtotal}</td>
                </tr>

                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Item Discount</td>
                  <td className="flex items-center space-x-2">
                    <Select
                      value={globalDiscountType}
                      onChange={(value) => {
                        setGlobalDiscountType(value);
                        calculateTotal(tableData, globalDiscountValue, value);
                      }}
                      style={{ width: '100px' }}
                    >
                      <Option value="percentage">Percentage</Option>
                      <Option value="fixed">Fixed</Option>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      value={globalDiscountValue}
                      onChange={(e) => {
                        setGlobalDiscountValue(e.target.value);
                        calculateTotal(tableData, e.target.value, globalDiscountType);
                      }}
                      placeholder="0"
                    />
                  </td>
                </tr>


                {parseFloat(totals.itemDiscount) > 0 && (
                  <tr className="flex justify-between px-2 py-2 border-x-2">
                    <td className="font-medium">Total Item Discount Amount</td>
                    <td className="font-medium px-4 py-2 text-red-500">-₹{totals.itemDiscount}</td>
                  </tr>
                )}


                <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                  <td className="font-medium">Total Tax</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.totalTax}</td>
                </tr>

                <tr className="flex justify-between px-2 py-3 bg-gray-100 border-x-2 border-b-2">
                  <td className="font-bold text-lg">Total Amount</td>
                  <td className="font-bold text-lg px-4">{selectedCurrencyIcon} {totals.finalTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="form-buttons text-right mt-4">
          <Button type="default" className="mr-2" onClick={() => {
            resetForm();
            onClose();
          }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleFinish}>
            Create
          </Button>
        </div>
      </Form>
      <Modal
        title="Add New Category"
        open={isTagModalVisible}
        onCancel={() => setIsTagModalVisible(false)}
        onOk={handleAddNewTag}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new Category"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default AddInvoice;