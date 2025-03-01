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
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getcurren } from "../../../setting/currencies/currenciesSlice/currenciesSlice";
import { useDispatch, useSelector } from "react-redux";
import { editRevenue, getRevenue } from "./RevenueReducer/RevenueSlice";
import moment from "moment/moment";
import { Getcus } from "../customer/CustomerReducer/CustomerSlice";
import { AddLable, GetLable } from "../LableReducer/LableSlice";
import AddCustomer from "../customer/AddCustomer";

const { Option } = Select;

const EditRevenue = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
        labelType: "status",
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

  // State to manage AddCustomer modal visibility
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);

  // Function to open AddCustomer modal
  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

  // Function to close AddCustomer modal
  const closeAddCustomerModal = () => {
    setIsAddCustomerModalVisible(false);
  };

  const alldata = useSelector((state) => state.Revenue);
  const fnddata = alldata.Revenue.data;

  const fnd = fnddata.find((item) => item.id === idd);

  const currencies = useSelector((state) => state.currencies?.currencies?.data || []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        await dispatch(getcurren());
      } catch (error) {
        console.error('Error fetching currencies:', error);
        message.error('Failed to fetch currencies');
      }
    };

    fetchCurrencies();
  }, [dispatch]);

  const [initialValues, setInitialValues] = useState({
    date: null,
    amount: "",
    account: "",
    customer: "",
    currency: "",
    description: "",
    category: "",
    paymentReceipt: "",
  });

  useEffect(() => {
    // Fetch revenue data
    dispatch(getRevenue());
  }, [dispatch]);

  useEffect(() => {
    dispatch(Getcus());
  }, []);

  const customerdata = useSelector((state) => state.customers);
  const fnddatas = customerdata.customers.data;

  useEffect(() => {
    if (fnd) {
      setInitialValues({
        date: fnd.date ? moment(fnd.date, "YYYY-MM-DD") : null,
        amount: parseFloat(fnd.amount) || "",
        account: fnd.account || "",
        customer: fnd.customer || "",
        description: fnd.description || "",
        category: fnd.category || "",
        currency: fnd.currency || "",
        paymentReceipt: fnd.paymentReceipt || "",
      });
    }
  }, [fnd]);

  const onSubmit = (values) => {
    const formattedValues = {
      ...values,
      amount: parseFloat(values.amount) || 0,
    };

    dispatch(editRevenue({ idd, values: formattedValues })).then(() => {
      dispatch(getRevenue());
      onClose();
      message.success("Revenue updated successfully!");
    });
  };

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required("Date is required."),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be positive")
      .required("Please enter an amount."),
    account: Yup.string().required("Please select an account."),
    customer: Yup.string().required("Please select a customer."),
    description: Yup.string().required("Please enter a description."),
    category: Yup.string().required("Please select a category."),
    currency: Yup.string().required("Please select a currency."),
    paymentReceipt: Yup.mixed().nullable(),
  });

  return (
    <div className="add-job-form">
      <h2 className="mb-2 border-b font-medium"></h2>
      <div className="">
        <div className=" p-2">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
              <Form className="formik-form" onSubmit={handleSubmit}>
                <Row gutter={16}>
                  <Col span={12} className="">
                    <div className="form-item">
                      <label className="font-semibold"> Date</label>
                      <DatePicker
                        className="w-full mt-1"
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
                        type="number"
                        step="0.01"
                        min="0"
                        className="mt-1"
                        as={Input}
                        placeholder="Enter Amount"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/[^\d.]/g, '');
                          const formattedValue = numericValue.replace(/(\..*)\./g, '$1');
                          setFieldValue("amount", formattedValue);
                        }}
                        onBlur={() => setFieldTouched("amount", true)}
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Account</label>
                      <Field name="account">
                        {({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                            placeholder="Select Account"
                            maxLength={18}
                            // onChange={(e) => {
                            //   const value = e.target.value.replace(/\D/g, '');
                            //   setFieldValue("accountNumber", value);
                            // }}
                            onBlur={() => setFieldTouched("account", true)}


                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="account"
                        component="div"
                        className="error-message text-red-500 my-1"

                      />
                    </div>
                  </Col>
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Customer</label>
                      <Field name="customer">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full mt-1"
                            placeholder="Select Customer"
                            loading={!fnddatas} // Loading state
                            onChange={(value) =>
                              setFieldValue("customer", value)
                            }
                            value={values.customer}
                            onBlur={() => setFieldTouched("customer", true)}
                            dropdownRender={menu => (
                              <div>
                                {menu}
                                <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                                  <Button
                                    type="link"
                                    icon={<PlusOutlined />}
                                    className="w-full mt-2"
                                    onClick={openAddCustomerModal}
                                  >
                                    Add New Customer
                                  </Button>
                                </div>
                              </div>
                            )}
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
                        )}
                      </Field>
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={24} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Description</label>
                      <Field name="description">
                        {({ field }) => (
                          <ReactQuill
                            {...field}
                            className="mt-1"
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
                  <Col span={24}>
                    <div className="form-item mt-3">
                      <label className="font-semibold">Category</label>
                      <Select
                        style={{ width: "100%" }}
                        className="mt-1"
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
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Currency</label>
                      <div className="flex gap-2">
                        <Field name="currency">
                          {({ field, form }) => (
                            <Select
                              {...field}
                              className="w-full mt-1"
                              placeholder="Select Currency"
                              loading={!Array.isArray(currencies)}
                              onChange={(value) => {
                                const selectedCurrency = Array.isArray(currencies) && currencies.find(
                                  (c) => c.id === value
                                );
                                form.setFieldValue(
                                  "currency",
                                  selectedCurrency?.currencyCode || ""
                                );
                              }}
                              value={values.currency}
                            >
                              {Array.isArray(currencies) && currencies.length > 0 ? (
                                currencies.map((currency) => (
                                  <Option key={currency.id} value={currency.id}>
                                    {currency.currencyCode}
                                    ({currency.currencyIcon})
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
                  <Col span={12} className="mt-3">
                    <div className="form-item">
                      <label className="font-semibold">Payment Receipt</label>
                      <input
                        type="file"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          // Store the file name as a string
                          setFieldValue("paymentReceipt", file ? file.name : "");
                        }}
                        className="mt-2 w-full"
                      />
                      <ErrorMessage
                        name="paymentReceipt"
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
                    Update
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

      {/* AddCustomer Modal */}
      <Modal
        title="Add Customer"
        visible={isAddCustomerModalVisible}
        onCancel={closeAddCustomerModal}
        footer={null}
        width={1000}
      >
        <AddCustomer onClose={closeAddCustomerModal} />
      </Modal>
    </div>
  );
};

export default EditRevenue;
