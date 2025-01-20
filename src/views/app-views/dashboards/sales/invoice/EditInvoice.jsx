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

const { Option } = Select;

const EditInvoice = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const alladatas = useSelector((state) => state?.salesInvoices);
  const fnddata = alladatas?.salesInvoices?.data;
  const fnd = fnddata.find((item) => item.id === idd);

  const [initialValues, setInitialValues] = useState({
    customer: "",
    issueDate: null,
    dueDate: null,
    invoicenub: "",
    category: "",
    items: [],
  });

  useEffect(() => {
    dispatch(getInvoice());
  }, []);

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddatas = customerdata.customers.data;

  useEffect(() => {
    if (fnd) {
      const parsedItems = JSON.parse(fnd.items || "{}");

      setInitialValues({
        customer: fnd.customer,
        issueDate: fnd.issueDate ? moment(fnd.issueDate, "YYYY-MM-DD") : null,
        dueDate: fnd.dueDate ? moment(fnd.dueDate, "YYYY-MM-DD") : null,
        category: fnd.category,
        invoicenub: fnd.salesInvoiceNumber,
        items: parsedItems,
      });

      setRows([
        {
          id: Date.now(),
          item: parsedItems.item || "",
          quantity: parsedItems.quantity || "",
          price: parsedItems.price || "",
          discount: parsedItems.discount || "",
          tax: parsedItems.tax || "",
          amount: parsedItems.amount || "0",
          description: parsedItems.description || "",
          isNew: false,
        },
      ]);
    }
  }, [fnd]);

  const [rows, setRows] = useState(initialValues.items);

  const handleAddRow = () => {
    setRows([
      ...rows,
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
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
    alert("Are you sure you want to delete this element?");
  };

  const navigate = useNavigate();

  const onSubmit = (values) => {
    const invoiceData = {
      ...values,
      items: {
        itemsArray: rows,
      },
    };

    dispatch(editInvoice({ idd, values: invoiceData })).then(() => {
      dispatch(getInvoice());
      onClose();
      message.success("Invoice updated successfully!");
    });
  };

  const validationSchema = Yup.object({
    customer: Yup.string().required("Please select customer."),
    issueDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    invoicenub: Yup.string().required("Please enter invoicenub."),
    category: Yup.string().required("Please select category."),
  });

  const handleFieldChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, [field]: value, amount: calculateAmount(row) }
        : row
    );
    setRows(updatedRows);
  };

  const calculateAmount = (row) => {
    const { quantity, price, discount, tax } = row;
    const discountAmount = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const totalAmount = (priceAfterDiscount + taxAmount) * quantity;
    return totalAmount.toFixed(2);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    rows.forEach((row) => {
      const { quantity, price, discount, tax } = row;
      const discountAmount = (price * discount) / 100;
      const priceAfterDiscount = price - discountAmount;
      const taxAmount = (priceAfterDiscount * tax) / 100;

      subtotal += priceAfterDiscount * quantity;
      totalDiscount += discountAmount * quantity;
      totalTax += taxAmount * quantity;
    });

    const totalAmount = subtotal + totalTax - totalDiscount;

    return {
      subtotal: subtotal.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalTax: totalTax.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
    };
  };

  return (
    <div>
      <Card className="border-0 mt-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
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
                <Col span={12} className="mt-4">
                  <Form.Item
                    label="Customer"
                    name="customer"
                    rules={[
                      { required: true, message: "Please select a customer" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select Client"
                      value={values.customer} // Bind Formik's customer value to Select
                      onChange={(value) => setFieldValue("customer", value)} // Update Formik state when a customer is selected
                      loading={!fnddatas} // Show loading state if data is not fetched yet
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
                  </Form.Item>
                </Col>

                <Col span={8} className="mt-2">
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

                <Col span={8} className="mt-2">
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

                <Col span={8} className="mt-2">
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
                </Col>

                <Col span={8} className="mt-2">
                  <label className="font-semibold">Category</label>
                  <Field name="category">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Category"
                        onChange={(value) => setFieldValue("category", value)}
                        value={values.category}
                        onBlur={() => setFieldTouched("category", true)}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Col>
              </Row>

              {/* Product table rendering */}
              <div>
                <Button type="primary" onClick={handleAddRow}>
                  <PlusOutlined /> Add Items
                </Button>
                <table className="w-full border border-gray-200 bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>ITEMS</th>
                      <th>QUANTITY</th>
                      <th>PRICE</th>
                      <th>DISCOUNT</th>
                      <th>TAX (%)</th>
                      <th>AMOUNT</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <select
                            className="w-full p-2 border rounded"
                            value={row.item}
                            onChange={(e) =>
                              handleFieldChange(row.id, "item", e.target.value)
                            }
                          >
                            <option value="">--</option>
                            <option value="item1">Item 1</option>
                            <option value="item2">Item 2</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              handleFieldChange(
                                row.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.price}
                            onChange={(e) =>
                              handleFieldChange(
                                row.id,
                                "price",
                                Number(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.discount}
                            onChange={(e) =>
                              handleFieldChange(
                                row.id,
                                "discount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.tax}
                            onChange={(e) =>
                              handleFieldChange(
                                row.id,
                                "tax",
                                Number(e.target.value)
                              )
                            }
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td>{row.amount}</td>
                        <td>
                          <Button
                            danger
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div className="mt-3 flex flex-col items-end space-y-2">
                <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                  <span>Sub Total ($):</span>
                  <span>{calculateTotals().subtotal}</span>
                </div>
                <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                  <span>Discount ($):</span>
                  <span>{calculateTotals().totalDiscount}</span>
                </div>
                <div className="flex justify-between w-full sm:w-1/2 border-b pb-2">
                  <span>Tax ($):</span>
                  <span>{calculateTotals().totalTax}</span>
                </div>
                <div className="flex justify-between w-full sm:w-1/2">
                  <span>Total Amount ($):</span>
                  <span>{calculateTotals().totalAmount}</span>
                </div>
              </div>

              <div className="form-buttons text-right">
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
      </Card>
    </div>
  );
};

export default EditInvoice;
