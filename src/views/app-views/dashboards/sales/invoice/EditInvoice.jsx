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

const { Option } = Select;


const EditInvoice = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);

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



   const [tableData, setTableData] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: 1,
      price: 0,
      tax: 0,
      amount: 0,
      description: "",
    },
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

  useEffect(() => {
    dispatch(getInvoice());
    dispatch(Getcus());
    dispatch(getcurren());
    dispatch(getAllTaxes());
    fetchTags();
  }, []);

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
          quantity: item.quantity || 1,
          price: item.price || 0,
          discount: item.discount_percentage || 0,
          tax: item.tax_percentage || 0,
          amount: item.final_amount || 0,
          description: item.description || ''
        }));

        // If no items exist, provide a default empty row
        if (formattedTableData.length === 0) {
          formattedTableData.push({
            id: Date.now(),
            item: '',
            quantity: 1,
            price: 0,
            discount: 0,
            tax: 0,
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
  const [totals, setTotals] = useState({
    subtotal: "0.00",
    discount: "0.00",
    totalTax: "0.00",
    finalTotal: "0.00",
  });

  const handleAddRow = () => {
    setTableData([
      ...tableData,
      {
        id: Date.now(),
        item: "",
        quantity: "",
        price: "",
        discount: "",
        tax: "",
        amount: "0",
        description: "",
        isNew: true,
      },
    ]);
  };

  const handleDeleteRow = (id) => {
    if (tableData.length > 1) {
      const updatedData = tableData.filter((row) => row.id !== id);
      setTableData(updatedData);
      calculateTotal(updatedData, discountRate);
    } else {
      message.warning("At least one item is required");
    }
  };

  const calculateTotal = (data,discountRate) => {
    const totals = data.reduce((acc, row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      const itemDiscountPercentage = parseFloat(row.discount) || 0;
      const taxPercentage = parseFloat(row.tax) || 0;

      const baseAmount = quantity * price;
      const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
      const taxAmount = (baseAmount * taxPercentage) / 100;

      // Calculate item total after individual discount and tax
      const itemTotal = baseAmount - itemDiscountAmount + taxAmount;

      return {
        subtotal: acc.subtotal + itemTotal,
        itemDiscount: acc.itemDiscount + itemDiscountAmount,
        tax: acc.tax + taxAmount,
        baseTotal: acc.baseTotal + baseAmount
      };
    }, { subtotal: 0, itemDiscount: 0, tax: 0, baseTotal: 0 });

    // Calculate global discount rate amount
    const globalDiscountAmount = (totals.subtotal * discountRate) / 100;

    // Calculate final total after both discounts
    const finalTotal = totals.subtotal - globalDiscountAmount;

    setTotals({
      subtotal: totals.subtotal.toFixed(2),
      itemDiscount: totals.itemDiscount.toFixed(2),
      globalDiscount: globalDiscountAmount.toFixed(2),
      totalTax: totals.tax.toFixed(2),
      finalTotal: finalTotal.toFixed(2)
    });
  };

  const handleTableDataChange = (id, field, value) => {
    const updatedData = tableData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        if (field === 'tax' && taxes?.data) {
          const selectedTax = taxes.data.find(tax => tax.gstPercentage.toString() === value.toString());
          if (selectedTax) {
            setSelectedTaxDetails(prev => ({
              ...prev,
              [id]: {
                gstName: selectedTax.gstName,
                gstPercentage: selectedTax.gstPercentage
              }
            }));
          }
        }
        // Recalculate amount when quantity, price, or tax changes
        // Calculate individual item amounts
        const quantity = parseFloat(updatedRow.quantity) || 0;
        const price = parseFloat(updatedRow.price) || 0;
        const itemDiscountPercentage = parseFloat(updatedRow.discount) || 0;
        const taxPercentage = parseFloat(updatedRow.tax) || 0;

        const baseAmount = quantity * price;
        const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
        const taxAmount = (baseAmount * taxPercentage) / 100;

        // Calculate final amount with individual discount
        const finalAmount = baseAmount - itemDiscountAmount + taxAmount;

        updatedRow.amount = finalAmount.toFixed(2);
        return updatedRow;
      }
      return row;
    });

    setTableData(updatedData);
    calculateTotal(updatedData, discountRate);
  };

 

  // const calculateTotals = () => {
  //   let subtotal = 0;
  //   let totalDiscount = 0;
  //   let totalTax = 0;

  //   rows.forEach((row) => {
  //     const { quantity, price, discount, tax } = row;
  //     const discountAmount = (price * discount) / 100;
  //     const priceAfterDiscount = price - discountAmount;
  //     const taxAmount = (priceAfterDiscount * tax) / 100;

  //     subtotal += priceAfterDiscount * quantity;
  //     totalDiscount += discountAmount * quantity;
  //     totalTax += taxAmount * quantity;
  //   });

  //   const totalAmount = subtotal + totalTax - totalDiscount;

  //   return {
  //     subtotal: subtotal.toFixed(2),
  //     totalDiscount: totalDiscount.toFixed(2),
  //     totalTax: totalTax.toFixed(2),
  //     totalAmount: totalAmount.toFixed(2),
  //   };
  // };

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
    // const { subtotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

    const itemsForDatabase = tableData.reduce((acc, item, index) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      const itemDiscountPercentage = parseFloat(item.discount) || 0;
      const taxPercentage = parseFloat(item.tax) || 0;

      const baseAmount = quantity * price;
      const itemDiscountAmount = (baseAmount * itemDiscountPercentage) / 100;
      const taxAmount = (baseAmount * taxPercentage) / 100;
      const itemTotal = baseAmount - itemDiscountAmount + taxAmount;

       // Get tax details for the current item
       const taxDetails = selectedTaxDetails[item.id];

      acc[`item_${index + 1}`] = {
        item: item.item,
        quantity: quantity,
        price: price,
        tax_percentage: taxPercentage,
        tax_amount: taxAmount,
        tax_name: taxDetails ? taxDetails.gstName : '', // Use tax details if available
        discount_percentage: itemDiscountPercentage,
        discount_amount: itemDiscountAmount,
        base_amount: baseAmount,
        final_amount: itemTotal,
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


  return (
    <div>
      <Card className="border-0">
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
          }) => (
            <Form onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={12} >
                  <div className="form-item">
                    <label className="font-semibold">Customer</label>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Client"
                      name="customer"
                      value={values.customer}
                      onChange={(value) => setFieldValue("customer", value)}
                      loading={!fnddatas}
                    >
                      {fnddatas && fnddatas.length > 0 ? (
                        fnddatas.map((client) => (
                          <Option key={client.id} value={client.id}>
                            {client.name || "Unnamed Client"}
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

                <Col span={12} >
                  <label className="font-semibold">Issue Date</label>
                  <DatePicker
                    className="w-full"
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

                <Col span={12} className="mt-2">
                  <label className="font-semibold">Due Date</label>
                  <DatePicker
                    className="w-full"
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

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Category</label>
                    <Select
                      style={{ width: "100%" }}
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
                              onClick={() => setIsTagModalVisible(true)}
                              block
                            >
                              Add New Category
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {tags && tags.map((tag) => (
                        <Option key={tag.id} value={tag.name}>
                          {tag.name}
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
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Currency</label>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Currency"
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

         
          <div className="mt-4">
            <div className="form-buttons text-right mb-2">
              <Button type="primary" onClick={handleAddRow}>
                <PlusOutlined /> Add Items
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Description<span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Quantity<span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Unit Price<span className="text-red-500">*</span>
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Discount (%)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      TAX (%)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="text"
                            value={row.item}
                            onChange={(e) => handleTableDataChange(row.id, "item", e.target.value)}
                            placeholder="Item Name"
                            className="w-full p-2 border rounded-s"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="1"
                            value={row.quantity}
                            onChange={(e) => handleTableDataChange(row.id, "quantity", e.target.value)}
                            placeholder="Qty"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
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
                        <td className="px-4 py-2 border-b">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.discount || 0}
                            onChange={(e) => handleTableDataChange(row.id, "discount", e.target.value)}
                            placeholder="0"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <select
                            value={row.tax}
                            onChange={(e) => handleTableDataChange(row.id, "tax", e.target.value)}
                            className="w-full p-2 border"
                          >
                            <option value="0">Nothing Selected</option>
                            {taxes && taxes.data && taxes.data.map(tax => (
                              <option key={tax.id} value={tax.gstPercentage}>
                                {tax.gstName}: {tax.gstPercentage}%
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2 border-b">
                        <span>{selectedCurrencyIcon} {parseFloat(row.amount || 0).toFixed(2)}</span>
                        </td>
                        <td className="px-2 py-1 border-b text-center">
                          <Button danger onClick={() => handleDeleteRow(row.id)}>
                            <DeleteOutlined />
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="px-4 py-2 border-b">
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
            </div>
          </div>

          <div className="mt-3 flex flex-col justify-end items-end border-t-2 space-y-2">
            <table className="w-full lg:w-[50%] p-2">
              <tbody>
                <tr className="flex justify-between px-2 py-2 border-x-2">
                  <td className="font-medium">Sub Total</td>
                  <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.subtotal}</td>
                </tr>

                <tr className="flex px-2 justify-between items-center py-2 border-x-2 border-y-2">
                <td className="font-medium">Item Discount</td>
                <td className="flex items-center space-x-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Item Discount Rate (%)
                      </label>
                      <input
                        type="number"
                        value={discountRate}
                        onChange={(e) => {
                          setDiscountRate(parseFloat(e.target.value) || 0);
                          calculateTotal(tableData, parseFloat(e.target.value) || 0); // Recalculate with new discount rate
                        }}
                        className="mt-1 block w-full p-2 border rounded"
                      />
                    </div>
                  </td>
                </tr>

                {parseFloat(totals.itemDiscount) > 0 && (
                  <tr className="flex justify-between px-2 py-2 border-x-2">
                    <td className="font-medium">Total Item Discount Amount</td>
                    <td className="font-medium px-4 py-2 text-red-500">-₹{totals.itemDiscount}</td>
                  </tr>
                )}

                    <tr className="flex justify-between px-2 py-2 border-x-2 border-b-2">
                      <td className="font-medium">Global Discount</td>
                      <td className="font-medium px-4 py-2">{selectedCurrencyIcon} {totals.globalDiscount}</td>
                    </tr>

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
      </Card>
    </div>
  );
};


export default EditInvoice;
