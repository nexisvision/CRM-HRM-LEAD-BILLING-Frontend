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
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { GetAllProdu } from "../../project/product/ProductReducer/ProductsSlice";
import AddCustomer from "../customer/AddCustomer";

const { Option } = Select;

const AddInvoice = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [tags, setTags] = useState([]);
  const AllLoggeddtaa = useSelector((state) => state.user);

  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  const [globalDiscountValue, setGlobalDiscountValue] = useState(0);

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: "0",
      tax: 0,
      discountType: 'percentage',
      discountValue: "0",
      amount: "0.00",
      description: "",
    },
  ]);

  // Get currencies from the store
  const currencies = useSelector((state) => state.currencies.currencies.data);

  // Add this to get taxes from Redux store
  const { taxes } = useSelector((state) => state.tax);


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
        price: "0",
        tax: 0,
        discountType: 'percentage',
        discountValue: "0",
        amount: "0.00",
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
            const updatedRow = { ...row };
            
            // Handle empty values for numeric fields
            if (field === 'price' || field === 'discountValue') {
                updatedRow[field] = value === '' ? '0' : value;
            } else if (field === 'quantity') {
                updatedRow[field] = value === '' ? 1 : parseFloat(value);
            } else {
                updatedRow[field] = value;
            }
            
            // Calculate amount if quantity, price, or tax changes
            if (field === 'quantity' || field === 'price' || field === 'tax' || field === 'discountType' || field === 'discountValue') {
                const quantity = parseFloat(updatedRow.quantity) || 0;
                const price = parseFloat(updatedRow.price) || 0;
                const baseAmount = quantity * price;
                
                // Calculate item discount
                let itemDiscountAmount = 0;
                const discountValue = parseFloat(updatedRow.discountValue) || 0;
                if (updatedRow.discountType === 'percentage') {
                    itemDiscountAmount = (baseAmount * discountValue) / 100;
                } else {
                    itemDiscountAmount = Math.min(discountValue, baseAmount);
                }

                // Calculate tax on amount after discount
                const amountAfterDiscount = baseAmount - itemDiscountAmount;
                const tax = field === 'tax' ? 
                    (value ? parseFloat(value.gstPercentage) : 0) : 
                    (row.tax ? parseFloat(row.tax.gstPercentage) : 0);
                const taxAmount = (amountAfterDiscount * tax) / 100;
                
                // Calculate final amount
                const finalAmount = amountAfterDiscount + taxAmount;
                updatedRow.amount = finalAmount.toFixed(2);
            }
            
            return updatedRow;
        }
        return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
};


  const calculateTotal = (data, globalDiscountValue, discountType) => {
    // Calculate item-level totals
    const calculations = data.reduce((acc, row) => {
        const quantity = parseFloat(row.quantity) || 0;
        const price = row.price === '' ? 0 : (parseFloat(row.price) || 0);
        const baseAmount = quantity * price;
        
        // Calculate item discount
        let itemDiscountAmount = 0;
        const discountValue = row.discountValue === '' ? 0 : (parseFloat(row.discountValue) || 0);
        if (row.discountType === 'percentage') {
            itemDiscountAmount = (baseAmount * discountValue) / 100;
        } else {
            itemDiscountAmount = Math.min(discountValue, baseAmount);
        }

        // Calculate tax
        const amountAfterDiscount = baseAmount - itemDiscountAmount;
        const taxPercentage = row.tax ? parseFloat(row.tax.gstPercentage) || 0 : 0;
        const taxAmount = (amountAfterDiscount * taxPercentage) / 100;

        return {
            totalBaseAmount: acc.totalBaseAmount + baseAmount,
            totalItemDiscount: acc.totalItemDiscount + itemDiscountAmount,
            totalTax: acc.totalTax + taxAmount,
            subtotal: acc.subtotal + amountAfterDiscount + taxAmount
        };
    }, { totalBaseAmount: 0, totalItemDiscount: 0, totalTax: 0, subtotal: 0 });

    // Calculate global discount
    let globalDiscountAmount = 0;
    const validGlobalDiscountValue = globalDiscountValue === '' ? 0 : (parseFloat(globalDiscountValue) || 0);
    
    if (discountType === 'percentage') {
        globalDiscountAmount = (calculations.subtotal * validGlobalDiscountValue) / 100;
    } else {
        globalDiscountAmount = validGlobalDiscountValue;
    }

    // Calculate final total
    const finalTotal = Math.max(0, calculations.subtotal - globalDiscountAmount);

    // Update totals state
    setTotals({
        subtotal: calculations.subtotal.toFixed(2),
        itemDiscount: calculations.totalItemDiscount.toFixed(2),
        globalDiscount: globalDiscountAmount.toFixed(2),
        totalTax: calculations.totalTax.toFixed(2),
        finalTotal: finalTotal.toFixed(2)
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
        const formValues = await form.validateFields();
        
        const items = {};
        tableData.forEach((item, index) => {
            const quantity = parseFloat(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const baseAmount = quantity * price;
            
            // Calculate item discount
            let itemDiscountAmount = 0;
            const discountValue = parseFloat(item.discountValue) || 0;
            if (item.discountType === 'percentage') {
                itemDiscountAmount = (baseAmount * discountValue) / 100;
            } else {
                itemDiscountAmount = Math.min(discountValue, baseAmount);
            }

            // Calculate tax
            const amountAfterDiscount = baseAmount - itemDiscountAmount;
            const taxPercentage = item.tax ? parseFloat(item.tax.gstPercentage) || 0 : 0;
            const taxAmount = (amountAfterDiscount * taxPercentage) / 100;
            
            items[`item_${index + 1}`] = {
                item: item.item,
                description: item.description || '',
                quantity: quantity,
                price: price,
                tax_name: item.tax?.gstName || '',
                tax_percentage: taxPercentage,
                tax_amount: taxAmount,
                discount_type: item.discountType,
                discount_percentage: item.discountType === 'percentage' ? discountValue : 0,
                discount_amount: itemDiscountAmount,
                base_amount: baseAmount,
                amount_after_discount: amountAfterDiscount,
                final_amount: amountAfterDiscount + taxAmount,
                hsn_sac: item.hsn_sac || ''
            };
        });

        // Calculate final values from totals state
        const subtotal = Object.values(items).reduce((sum, item) => sum + item.final_amount, 0);
        const itemDiscount = parseFloat(totals.itemDiscount);
        const globalDiscount = parseFloat(totals.globalDiscount);
        const totalTax = parseFloat(totals.totalTax);
        const finalTotal = parseFloat(totals.finalTotal);

        const updatedValues = {
            ...formValues,
            issueDate: formValues.issueDate.format('YYYY-MM-DD'),
            dueDate: formValues.dueDate.format('YYYY-MM-DD'),
            items: items,
            discountType: globalDiscountType,
            discountValue: parseFloat(globalDiscountValue) || 0,
            discount: globalDiscount,
            itemDiscount: itemDiscount,
            tax: totalTax,
            subtotal: subtotal,
            total: finalTotal // This will now store the actual final total
        };

        await dispatch(AddInvoices(updatedValues));
        message.success("Invoice created successfully!");
        dispatch(getInvoice());
        resetForm();
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

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await dispatch(GetAllProdu());
        
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
      setProducts(productsData.data);
    }
  }, [productsData]);

  // Product selection handler
  const handleProductChange = (productId) => {
    
    if (productId) {
        const selectedProd = products.find(p => p.id === productId);
        
        if (selectedProd) {
            const updatedData = tableData.map((row, index) => {
                if (index === tableData.length - 1) {
                    // Calculate initial amount based on product price and default quantity
                    const quantity = 1;
                    const price = selectedProd.price || 0;
                    const baseAmount = quantity * price;
                    
                    // Calculate tax if available
                    const taxPercentage = selectedProd.tax ? parseFloat(selectedProd.tax.gstPercentage) || 0 : 0;
                    const taxAmount = (baseAmount * taxPercentage) / 100;
                    
                    return {
                        ...row,
                        item: selectedProd.name,
                        description: selectedProd.description || "",
                        price: price,
                        quantity: quantity,
                        hsn_sac: selectedProd.hsn_sac || "",
                        tax: selectedProd.tax || null,
                        amount: (baseAmount + taxAmount).toFixed(2)
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
        price: "0",
        tax: 0,
        discountType: 'percentage',
        discountValue: "0",
        amount: "0.00",
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
    setGlobalDiscountValue("0");
    setGlobalDiscountType("percentage");
  };

  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);

  // Update category related states
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);

  // Add fetchLables function
  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredLables = response.payload.data
          .filter((lable) => lable.lableType === lableType)
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setter(filteredLables);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };

  // Add useEffect to fetch categories
  useEffect(() => {
    fetchLables("category", setCategories);
  }, []);

  // Update handleAddNewLable function
  const handleAddNewLable = async (lableType, newValue, setter, modalSetter) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType,
      };
      
      const response = await dispatch(AddLable({ lid, payload }));
      
      if (response.payload && response.payload.success) {
        message.success(`${lableType} added successfully.`);
        
        // Refresh the labels immediately after adding
        const labelsResponse = await dispatch(GetLable(lid));
        if (labelsResponse.payload && labelsResponse.payload.data) {
          const filteredLables = labelsResponse.payload.data
            .filter((lable) => lable.lableType === lableType)
            .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
          
          setCategories(filteredLables);
          // Update form field value
          form.setFieldValue("category", newValue.trim());
        }
        
        // Reset input and close modal
        setter("");
        modalSetter(false);
      } else {
        throw new Error('Failed to add label');
      }
    } catch (error) {
      console.error(`Failed to add ${lableType}:`, error);
      message.error(`Failed to add ${lableType}. Please try again.`);
    }
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
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px',
                          borderTop: '1px solid #e8e8e8',
                        }}
                      >
                        <Button
                          type="link"
                          // icon={<PlusOutlined />}
                          className="w-full"
                          onClick={() => setIsAddCustomerModalVisible(true)}
                        >
                         + Add Customer
                        </Button>
                      </div>
                    </div>
                  )}
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
                <DatePicker 
                  className="w-full" 
                  format="DD-MM-YYYY" 
                  onChange={(date) => {
                    form.setFieldsValue({ issueDate: date });
                    // Clear due date if it's before the new issue date
                    const dueDate = form.getFieldValue('dueDate');
                    if (dueDate && date && dueDate.isBefore(date)) {
                      form.setFieldsValue({ dueDate: null });
                    }
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Due Date"
                name="dueDate"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <DatePicker 
                  className="w-full" 
                  format="DD-MM-YYYY"
                  disabledDate={(current) => {
                    // Get the issue date from form
                    const issueDate = form.getFieldValue('issueDate');
                    // Disable dates before issue date
                    return issueDate ? current && current < issueDate.startOf('day') : false;
                  }}
                />

            
              </Form.Item>
            </Col>

            <Col span={12} className="">
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select or add a category" }]}
              >
                <Select
                  placeholder="Select or add new category"
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setIsCategoryModalVisible(true)}
                          block
                        >
                          Add New Category
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reference Number"
                name="refnumber"
                rules={[
                  { required: true, message: "Please enter reference number" },
                ]}
               
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
                      Item<span className="text-red-500">*</span>
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
                            value={row.price}
                            onChange={(e) => {
                              const value = e.target.value;
                              // If user starts typing and current value is "0", clear it
                              if (row.price === "0" && value !== "") {
                                handleTableDataChange(row.id, "price", value.replace(/^0+/, ''));
                              } else {
                                handleTableDataChange(row.id, "price", value || "0");
                              }
                            }}
                            placeholder="0"
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
                              value={row.discountValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                // If user starts typing and current value is "0", clear it
                                if (row.discountValue === "0" && value !== "") {
                                  handleTableDataChange(row.id, "discountValue", value.replace(/^0+/, ''));
                                } else {
                                  handleTableDataChange(row.id, "discountValue", value || "0");
                                }
                              }}
                              placeholder="0"
                              prefix={row.discountType === 'fixed' ? selectedCurrencyIcon : ''}
                              suffix={row.discountType === 'percentage' ? '%' : ''}
                            />
                          </div>
                        </td>
                        <td className="px-2 py-2 border-b">
                            <Select
                                value={row.tax?.gstPercentage ? `${row.tax.gstName}|${row.tax.gstPercentage}` : '0'}
                                onChange={(value) => {
                                    if (!value || value === '0') {
                                        handleTableDataChange(row.id, "tax", null);
                                        return;
                                    }
                                    const [gstName, gstPercentage] = value.split('|');
                                    handleTableDataChange(row.id, "tax", {
                                        gstName,
                                        gstPercentage: parseFloat(gstPercentage) || 0
                                    });
                                }}
                                placeholder="Select Tax"
                                className="w-[100px]"
                                allowClear
                            >
                                {/* <Option value="0">0</Option> */}
                                {taxes && taxes.data && taxes.data.map(tax => (
                                    <Option key={tax.id} value={`${tax.gstName}|${tax.gstPercentage}`}>
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
                         <td colSpan={8} className="px-2 py-2 border-b">
                        <textarea
                            rows={2}
                            value={row.description ? row.description.replace(/<[^>]*>/g, '') : ''} // Remove HTML tags
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
                      value={globalDiscountValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        // If user starts typing and current value is 0, clear it
                        if (globalDiscountValue === 0 && value !== "") {
                          setGlobalDiscountValue(parseFloat(value));
                          calculateTotal(tableData, parseFloat(value), globalDiscountType);
                        } else {
                          setGlobalDiscountValue(value === "" ? 0 : parseFloat(value));
                          calculateTotal(tableData, value === "" ? 0 : parseFloat(value), globalDiscountType);
                        }
                      }}
                      placeholder="0"
                      prefix={globalDiscountType === 'fixed' ? selectedCurrencyIcon : ''}
                      suffix={globalDiscountType === 'percentage' ? '%' : ''}
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
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>
      <Modal
        title="Add Customer"
        visible={isAddCustomerModalVisible}
        onCancel={() => setIsAddCustomerModalVisible(false)}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddCustomer onClose={() => setIsAddCustomerModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default AddInvoice;