import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
import Flex from 'components/shared-components/Flex';
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { editInvoice, getInvoice } from "./InvoiceReducer/InvoiceSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { getAllTaxes } from "../../../setting/tax/taxreducer/taxSlice"
import { GetAllProdu } from '../../project/product/ProductReducer/ProductsSlice';
import AddCustomer from "../customer/AddCustomer";

const { Option } = Select;


const EditInvoice = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const alladatas = useSelector((state) => state?.salesInvoices);
  const fnddata = alladatas?.salesInvoices?.data;
  const fnd = fnddata.find((item) => item.id === idd);

  const customerdata = useSelector((state) => state.customers);
  const fnddatas = customerdata.customers.data;
  const AllLoggeddtaa = useSelector((state) => state.user);
  const [discountRate, setDiscountRate] = useState(0);
  const [selectedCurrencyIcon, setSelectedCurrencyIcon] = useState('₹');
  const { taxes } = useSelector((state) => state.tax);
  const [selectedTaxDetails, setSelectedTaxDetails] = useState({});

  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  const [globalDiscountValue, setGlobalDiscountValue] = useState(0);

  const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      discountType: 'percentage',
      discountValue: 0,
      tax: 0,
      amount: 0,
      description: "",
    }
  ]);

  const [initialValues, setInitialValues] = useState({
    customer: "",
    issueDate: null,
    dueDate: null,
    invoicenub: "",
    category: "",
    items: [],
    currency: "",
  });

  // Get currencies from the store
  const currencies = useSelector((state) => state.currencies.currencies.data);

  // Get products directly from Redux store
  const productsData = useSelector((state) => state.Product.Product);

  const [totals, setTotals] = useState({
    subtotal: "0.00",
    itemDiscount: "0.00",
    globalDiscount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00"
  });

  useEffect(() => {
    dispatch(getInvoice());
    dispatch(Getcus());
    dispatch(getcurren());
    dispatch(getAllTaxes());
    fetchTags();
  }, []);

  // Update local state when Redux store changes
  useEffect(() => {
    if (productsData?.data) {
      console.log("Products from Redux:", productsData.data);
      setProducts(productsData.data);
    }
  }, [productsData]);

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

  const fetchTags = async () => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;

      const response = await dispatch(GetLable(lid));
      if (response.payload?.data) {
        const uniqueTags = response.payload.data
          .filter((label) => label && label.name)
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          );
        setTags(uniqueTags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      message.error("Failed to load tags");
    }
  };

  useEffect(() => {
    if (fnd) {
      try {
        // Parse items from the invoice data
        const parsedItems = JSON.parse(fnd.items || '[]');
        
        // Convert items object to array if it's not already
        const itemsArray = Array.isArray(parsedItems) 
          ? parsedItems 
          : Object.values(parsedItems);
        
        // Set initial form values
        setInitialValues({
          customer: fnd.customer || '',
          issueDate: fnd.issueDate ? moment(fnd.issueDate) : null,
          dueDate: fnd.dueDate ? moment(fnd.dueDate) : null,
          category: fnd.category || '',
          invoicenub: fnd.salesInvoiceNumber || '',
          currency: fnd.currency || '',
          items: itemsArray || []
        });

        // Set table data with the parsed items
        const formattedTableData = itemsArray.map(item => ({
          id: Date.now() + Math.random(),
          item: item.item || '',
          quantity: Math.max(parseFloat(item.quantity) || 1, 1),
          price: parseFloat(item.price) || 0,
          discountType: item.discount_type || 'percentage',
          discountValue: parseFloat(item.discount_value) || 0,
          tax: item.tax_percentage ? {
            gstName: item.tax_name || '',
            gstPercentage: parseFloat(item.tax_percentage) || 0
          } : null,
          amount: parseFloat(item.amount) || 0,
          description: item.description || ''
        }));

        // If no items exist, provide a default empty row
        if (formattedTableData.length === 0) {
          formattedTableData.push({
            id: Date.now(),
            item: '',
            quantity: 1,
            price: 0,
            discountType: 'percentage',
            discountValue: 0,
            tax: null,
            amount: 0,
            description: ''
          });
        }

        setTableData(formattedTableData);
        
        // Set discount rate if it exists in the invoice
        setDiscountRate(parseFloat(fnd.discount) || 0);

        // Calculate totals with the loaded data
        calculateTotal(formattedTableData, parseFloat(fnd.discount) || 0);

        // Set currency icon if available
        if (fnd.currency && currencies) {
          const currencyData = currencies.find(c => c.currencyCode === fnd.currency);
          if (currencyData) {
            setSelectedCurrencyIcon(currencyData.currencyIcon);
          }
        }

      } catch (error) {
        console.error('Error parsing invoice data:', error);
        message.error('Error loading invoice data');
      }
    }
  }, [fnd, currencies]);

  // const [rows, setRows] = useState(initialValues.items);

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: 1,
        price: 0,
        discountType: 'percentage',
        discountValue: 0,
        tax: null,
        amount: 0,
        description: "",
        isNew: true,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
    } else {
      message.warning("At least one item is required");
    }
  };

  const calculateTotal = (data, globalDiscount, discountType) => {
    let subtotal = 0;
    let itemDiscount = 0;
    let totalTax = 0;
    let rowTotalSum = 0;

    data.forEach(row => {
        // Calculate base amount for each row (quantity * price)
        const quantity = parseFloat(row.quantity) || 0;
        const price = parseFloat(row.price) || 0;
        const rowTotal = quantity * price;
        rowTotalSum += rowTotal;

        // Calculate row discount
        const rowDiscountValue = parseFloat(row.discountValue) || 0;
        const rowDiscountAmount = row.discountType === 'percentage' 
            ? (rowTotal * rowDiscountValue) / 100 
            : rowDiscountValue;
        
        itemDiscount += rowDiscountAmount;

        // Calculate tax
        if (row.tax) {
            const taxRate = parseFloat(row.tax.gstPercentage) || 0;
            totalTax += ((rowTotal - rowDiscountAmount) * taxRate) / 100;
        }
    });

    // Set subtotal as sum of row totals (before tax and discounts)
    subtotal = rowTotalSum;

    // Calculate global discount
    const globalDiscountAmount = discountType === 'percentage'
        ? (subtotal * parseFloat(globalDiscount)) / 100
        : parseFloat(globalDiscount) || 0;

    // Calculate final total
    const finalTotal = subtotal - globalDiscountAmount - itemDiscount + totalTax;

    setTotals({
        subtotal: subtotal.toFixed(2),
        itemDiscount: itemDiscount.toFixed(2),
        globalDiscount: globalDiscountAmount.toFixed(2),
        totalTax: totalTax.toFixed(2),
        finalTotal: finalTotal.toFixed(2)
    });
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map(row => {
        if (row.id === id) {
            const updatedRow = { ...row, [field]: value };
            
            // Calculate base amount
            const quantity = parseFloat(updatedRow.quantity) || 0;
            const price = parseFloat(updatedRow.price) || 0;
            const baseAmount = quantity * price;
            
            // Calculate discount
            const discountValue = parseFloat(updatedRow.discountValue) || 0;
            const discountAmount = updatedRow.discountType === 'percentage' 
                ? (baseAmount * discountValue) / 100 
                : discountValue;
            
            // Calculate tax
            const taxPercentage = updatedRow.tax ? parseFloat(updatedRow.tax.gstPercentage) || 0 : 0;
            const taxableAmount = baseAmount - discountAmount;
            const taxAmount = (taxableAmount * taxPercentage) / 100;
            
            // Set final amount
            updatedRow.amount = (baseAmount - discountAmount + taxAmount).toFixed(2);
            
            return updatedRow;
        }
        return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, globalDiscountValue, globalDiscountType);
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

  const onSubmit = (values) => {
    const itemsForDatabase = tableData.reduce((acc, item, index) => {
      // Ensure quantity is at least 1
      const quantity = Math.max(parseFloat(item.quantity) || 1, 1);
      const price = parseFloat(item.price) || 0;
      const itemDiscountValue = parseFloat(item.discountValue) || 0;
      const taxPercentage = item.tax ? parseFloat(item.tax.gstPercentage) || 0 : 0;

      // Calculate amounts
      const baseAmount = quantity * price;
      const itemDiscountAmount = item.discountType === 'percentage'
          ? (baseAmount * itemDiscountValue) / 100
          : itemDiscountValue;
      const taxAmount = ((baseAmount - itemDiscountAmount) * taxPercentage) / 100;
      const finalAmount = baseAmount - itemDiscountAmount + taxAmount;

      acc[`item_${index + 1}`] = {
        item: item.item,
        quantity: quantity,
        price: price,
        tax_percentage: taxPercentage,
        tax_amount: taxAmount,
        tax_name: item.tax ? item.tax.gstName : '',
        discount_type: item.discountType,
        discount_value: itemDiscountValue,
        discount_amount: itemDiscountAmount,
        base_amount: baseAmount,
        final_amount: finalAmount,
        amount: finalAmount,
        description: item.description || ""
      };
      return acc;
    }, {});

    // Calculate global discount on subtotal
    const subtotal = Object.values(itemsForDatabase).reduce((sum, item) =>
      sum + item.final_amount, 0);
    const globalDiscountAmount = (subtotal * discountRate) / 100;
    const finalTotal = subtotal - globalDiscountAmount;

    const prepareInvoiceData = () => ({
      customer: values.customer,
      issueDate: values.issueDate.format("YYYY-MM-DD"),
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      category: values.category,
      items: itemsForDatabase,
      discount: discountRate.toFixed(2),
      tax: totals.totalTax,
      total: finalTotal.toFixed(2),
      status: "pending"
    });

    const selectedTag = tags.find((tag) => tag.name === values.category);

    if (!selectedTag) {
      const newTagPayload = { name: values.category.trim() };
      const lid = AllLoggeddtaa.loggedInUser.id;

      dispatch(AddLable({ lid, payload: newTagPayload }))
        .then(() => {
          const invoiceData = prepareInvoiceData();
          dispatch(editInvoice({ idd, values: invoiceData }))
            .then(() => {
              dispatch(getInvoice());
              onClose();
              // message.success("Invoice updated successfully!");
            })
            .catch((error) => {
              console.error("Failed to edit invoice:", error);
              message.error("Failed to update invoice. Please try again.");
            });
        })
        .catch((error) => {
          console.error("Failed to add tag:", error);
          message.error("Failed to add category.");
        });
    } else {
      const invoiceData = prepareInvoiceData();
      dispatch(editInvoice({ idd, values: invoiceData }))
        .then(() => {
          dispatch(getInvoice());
          onClose();
        })
        .catch((error) => {
          console.error("Failed to edit invoice:", error);
          message.error("Failed to update invoice. Please try again.");
        });
    }
  };

  useEffect(() => {
    if (tableData.length > 0) {
        calculateTotal(tableData, globalDiscountValue, globalDiscountType);
    }
  }, [tableData, globalDiscountValue, globalDiscountType]);

  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
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

  useEffect(() => {
    fetchLables("category", setCategories);
  }, []);

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error(`Please enter a ${lableType} name.`);
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
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
          // Update form field value using Formik's setFieldValue
          if (setFieldValue) {
            setFieldValue("category", newValue.trim());
          }
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
      <Card className="border-0">
      <h2 className="mb-4 border-b font-medium"></h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          // validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            setFieldTouched,
            isSubmitting,
            form,
          }) => (
            <>
              <Form onSubmit={handleSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold">Customer <span className="text-red-500">*</span></label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select Customer"
                        className="mt-2"
                        name="customer"
                        value={values.customer}
                        onChange={(value) => setFieldValue("customer", value)}
                        loading={!fnddatas}
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
                                icon={<PlusOutlined />}
                                onClick={() => setIsAddCustomerModalVisible(true)}
                              >
                                Add Customer
                              </Button>
                            </div>
                          </div>
                        )}
                      >
                        {fnddatas && fnddatas.length > 0 ? (
                          fnddatas.map((customer) => (
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
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12}>
                    <label className="font-semibold">Issue Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-2"
                      format="DD-MM-YYYY"

                      value={values.issueDate ? dayjs(values.issueDate) : null}
                      onChange={(issueDate) =>
                        setFieldValue("issueDate", issueDate)
                      }
                      onBlur={() => setFieldTouched("issueDate", true)}
                    />
                    <ErrorMessage
                      name="issueDate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </Col>

                  <Col span={12} className="mt-4">
                    <label className="font-semibold">Due Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-2"
                      format="DD-MM-YYYY"
                      value={values.dueDate ? dayjs(values.dueDate) : null}
                      onChange={(dueDate) => setFieldValue("dueDate", dueDate)}
                      onBlur={() => setFieldTouched("dueDate", true)}
                    />
                    <ErrorMessage
                      name="dueDate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </Col>

                  {/* <Col span={12} className="mt-2">
                    <label className="font-semibold">Invoice Number</label>
                    <Field
                      name="invoicenub"
                      as={Input}
                      placeholder="Enter Invoice Number"
                    />
                    <ErrorMessage
                      name="invoicenub"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </Col> */}

                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                      <Select
                        style={{ width: "100%" }}
                        className="mt-2"
                        placeholder="Select or add new category"
                        name="category"
                        value={values.category}
                        onChange={(value) => setFieldValue("category", value)}
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
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">Currency <span className="text-red-500">*</span></label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select Currency"
                        className="mt-2"
                        name="currency"
                        value={values.currency}
                        onChange={(value) => {
                          const selected = currencies?.find(c => c.currencyCode === value);
                          setSelectedCurrencyIcon(selected?.currencyIcon || '₹');
                          setFieldValue("currency", value);
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
                      <ErrorMessage
                        name="currency"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                </Row>

                <h4 className="font-semibold text-lg mb-3 mt-4">Product & Services</h4>
                <Flex alignItems="center" mobileFlex={false} className='flex mb-4 gap-4 mt-4'>
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
            <div className="mt-4">
             
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
                        Discount (%)
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
                            <input
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
                <div className="form-buttons text-left mb-2">
                <Button type="primary" onClick={handleAddRow}>
                  <PlusOutlined /> Add Items
                </Button>
              </div>
              </div>
            </div>

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
                              calculateTotal(tableData, globalDiscountValue);
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
                              calculateTotal(tableData, e.target.value);
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
         

              <div className="form-buttons text-right mt-4">
                <Button type="default" onClick={onClose} className="mr-2">
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </div>
            </Form>

            <Modal
              title="Add New Category"
              open={isCategoryModalVisible}
              onCancel={() => setIsCategoryModalVisible(false)}
              onOk={() => handleAddNewLable("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue)}
              okText="Add Category"
            >
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Modal>
          </>
        )}
      </Formik>

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
    </Card>
  </div>
);
};


export default EditInvoice;

