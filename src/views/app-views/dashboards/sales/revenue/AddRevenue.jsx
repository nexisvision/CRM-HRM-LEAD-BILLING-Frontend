import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Modal,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddRevenues, getRevenue } from "./RevenueReducer/RevenueSlice";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import { useParams } from "react-router-dom";

const { Option } = Select;

const AddRevenue = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  // category start
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);

  const lid = AllLoggedData.loggedInUser.id;

  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueCategories = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchLables("category", setCategories);
  }, []);

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      message.error("Please enter a category name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newCategory.trim(),
        labelType: "category",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Category added successfully");
      setNewCategory("");
      setIsCategoryModalVisible(false);

      // Fetch updated categories
      await fetchLables();
    } catch (error) {
      console.error("Failed to add Category:", error);
      message.error("Failed to add Category");
    }
  };

  // category end

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await dispatch(getcurren());
        if (!response.payload) {
          message.error('Failed to fetch currencies');
        }
      } catch (error) {
        console.error('Error fetching currencies:', error);
        message.error('Failed to fetch currencies');
      }
    };

    fetchCurrencies();
  }, [dispatch]);

  const currencies = useSelector((state) => {
    return state.currencies?.currencies?.data || [];
  });

  useEffect(() => {
    console.log('Current currencies:', currencies);
  }, [currencies]);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddRevenues(values)).then(() => {
      dispatch(getRevenue());
      message.success("Revenue added successfully!");
      onClose();
      resetForm();
    });
  };

  const initialValues = {
    date: null,
    amount: "",
    account: "",
    customer: "",
    currency: "",
    description: "",
    category: "",
    // reference: "",
    paymentReceipt: "",
  };

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required("Date is required."),
    amount: Yup.string().required("Please enter a amount."),
    account: Yup.string().required("Please select account."),
    currency: Yup.string().required("Please select currency."),
    customer: Yup.string().required("Please select customer."),
    description: Yup.string().required("Please enter description."),
    category: Yup.string().required("Please select customer."),
    // reference: Yup.string().required("Please enter description."),
    paymentReceipt: Yup.string().optional("Please enter a paymentreceipt."),
  });

  return (
    <div className="add-job-form">
      <h2 className="mb-2 border-b font-medium"></h2>
      {/* <h2 className="mb-4">Create New Revenue</h2> */}
      <div className="">
        <div className=" p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              setFieldValue,
              handleSubmit,
              setFieldTouched,
              resetForm,
            }) => (
              <Form className="formik-form" onSubmit={handleSubmit}>
                <Row gutter={16}>
                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold"> Date</label>
                      <DatePicker
                        className="w-full"
                        format="DD-MM-YYYY"
                        value={values.date}
                        onChange={(date) => setFieldValue("date", date)}
                        onBlur={() => setFieldTouched("date", true)}
                      />
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold">Amount</label>
                      <Field
                        name="amount"
                        as={Input}
                        placeholder="Enter Amount"
                        onBlur={() => setFieldTouched("amount", true)}
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Account</label>
                      <Field name="account">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select Account"
                            onChange={(value) =>
                              setFieldValue("account", value)
                            }
                            value={values.account}
                            onBlur={() => setFieldTouched("account", true)}
                          >
                            <Option value="xyz">XYZ</Option>
                            <Option value="abc">ABC</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage
                        name="account"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Customer</label>
                      <Field name="name">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select Customer"
                            loading={!fnddata} // Loading state
                            onChange={(value) =>
                              setFieldValue("customer", value)
                            }
                            value={values.customer}
                            onBlur={() => setFieldTouched("customer", true)}
                          >
                            {fnddata && fnddata.length > 0 ? (
                              fnddata.map((client) => (
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
                        )}
                      </Field>
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  {/* <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Category</label>
                      <Field name="category">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select Category"
                            onChange={(value) =>
                              setFieldValue("category", value)
                            }
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
                    </div>
                  </Col> */}
                  <Col span={24}>
                    <div className="form-item mt-2">
                      <label className="font-semibold">Category</label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Select or add new category"
                        value={values.category}
                        onChange={(value) => setFieldValue("category", value)}
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                              <Button
                                type="link"
                                icon={<PlusOutlined />}
                                className="w-full mt-2"
                                onClick={() => setIsCategoryModalVisible(true)}
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
                        name="project_category"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

                  <Col span={12} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Currency</label>
                      <div className="flex gap-2">
                        <Field name="currency">
                          {({ field, form }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select Currency"
                              onChange={(value) => {
                                const selectedCurrency = Array.isArray(currencies) && currencies.find(
                                  (c) => c.id === value
                                );
                                form.setFieldValue(
                                  "currency",
                                  selectedCurrency?.currencyCode || ""
                                );
                              }}
                            >
                              {Array.isArray(currencies) && currencies.length > 0 ? (
                                currencies.map((currency) => (
                                  <Option key={currency.id} value={currency.id}>
                                    {currency.currencyCode}
                                  </Option>
                                ))
                              ) : (
                                <Option disabled>No currencies available</Option>
                              )}
                            </Select>
                          )}
                        </Field>
                      </div>
                      <ErrorMessage
                        name="currency"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  {/* <Col span={12}>
                    <div className="form-item mt-2">
                      <label className="font-semibold">Reference</label>
                      <Field
                        name="reference"
                        as={Input}
                        placeholder="Enter Reference"
                        type="number"
                      />
                      <ErrorMessage
                        name="reference"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col> */}
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Payment Receipt</label>
                      <Field
                        name="paymentReceipt"
                        type="file"
                        as={Input}
                        placeholder="Enter payment receipt"
                      />
                      <ErrorMessage
                        name="paymentReceipt"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-2">
                    <div className="form-item">
                      <label className="font-semibold">Description</label>
                      <Field name="description">
                        {({ field }) => (
                          <ReactQuill
                            {...field}
                            placeholder="Enter Description"
                            value={values.description}
                            onChange={(value) =>
                              setFieldValue("description", value)
                            }
                            onBlur={() => setFieldTouched("description", true)}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="form-buttons text-right mt-4">
                  <Button
                    type="default"
                    className="mr-2"
                    onClick={() => navigate("/apps/sales/expenses")}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal
        title="Add New Category"
        open={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        onOk={() => handleAddNewCategory("category", newCategory, setNewCategory, setIsCategoryModalVisible)}
        okText="Add Category"
      >
        <Input
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
      </Modal>

      {/* <Form
        layout="vertical"
        form={form}
        name="add-job"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          

          <Col span={12}>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'date is required.' }]}>
              <DatePicker style={{ width: '100%' }} placeholder='DD-MM-YYYY' format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
              <Input type='number' placeholder="Enter Amount" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="account" label="Account" rules={[{ required: true, message: 'Please select a Account.' }]}>
              <Select placeholder="Select Account">
                <Option value="all">All</Option>
                <Option value="branch1">Branch 1</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="customer" label="Customer" rules={[{ required: true, message: 'Please enter Customer Name.' }]}>
            <Select placeholder="--">
                <Option value="xyz">xyz</Option>
                <Option value="abc">abc</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Description">
              <ReactQuill placeholder="Enter Description" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter Category.' }]}>
            <Select placeholder="--">
                <Option value="xyz">Income</Option>
                <Option value="abc">Sales</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="reference" label="Reference" rules={[{ required: true, message: 'Please enter a Reference.' }]}>
              <Input type='number' placeholder="Enter Reference" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="paymentreceipt" label="Payment Receipt" rules={[{ required: true, message: 'Please enter a Reference.' }]}>
              <Input type='file'/>
            </Form.Item>
          </Col>

        </Row>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </Form.Item>
      </Form> */}
    </div>

  );
};

export default AddRevenue;
