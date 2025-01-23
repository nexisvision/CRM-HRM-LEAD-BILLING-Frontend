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
    dispatch(Getcus());
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
    const { subtotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

    const prepareInvoiceData = () => ({
      customer: values.customer,
      issueDate: values.issueDate.format("YYYY-MM-DD"),
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      category: values.category,
      items: { itemsArray: rows },
      discount: Number(totalDiscount),
      tax: Number(totalTax),
      total: Number(totalAmount),
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
              message.success("Invoice updated successfully!");
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
          message.success("Invoice updated successfully!");
        })
        .catch((error) => {
          console.error("Failed to edit invoice:", error);
          message.error("Failed to update invoice. Please try again.");
        });
    }
  };


  return (
    <div>
      <Card className="border-0 mt-4">
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
