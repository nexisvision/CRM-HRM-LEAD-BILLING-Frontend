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
import AddCustomer from "../customer/AddCustomer";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
// import { GetAccounts } from '../accounts/AccountReducer/AccountSlice';

const { Option } = Select;

const AddRevenue = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  // category start
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const AllLoggedData = useSelector((state) => state.user);

  const lid = AllLoggedData.loggedInUser.id;

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

  useEffect(() => {
    fetchLables("category", setCategories);
  }, []);

  const handleAddNewCategory = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error("Please enter a category name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType: "category"
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Category added successfully");
      setNewCategory("");
      setIsCategoryModalVisible(false);

      // Fetch updated categories and update form field
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredCategories = response.payload.data
          .filter((lable) => lable.lableType === "category")
          .map((lable) => ({ id: lable.id, name: lable.name.trim() }));
        setCategories(filteredCategories);
        setFieldValue("category", newValue.trim());
      }
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

  // Get accounts from Redux store
  const accountsData = useSelector((state) => state?.accounts?.accounts?.data || []);

  // Fetch accounts when component mounts
  // useEffect(() => {
  //   dispatch(GetAccounts());
  // }, [dispatch]);

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

  const initialValues = {
    date: null,
    amount: "",
    account: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    customer: "",
    currency: getInitialCurrency(),
    description: "",
    category: "",
    paymentReceipt: "",
  };

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required("Date is required."),
    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be positive")
      .required("Please enter an amount."),
    account: Yup.string().required("Please enter account."),
    accountNumber: Yup.string()
      .matches(/^\d{9,18}$/, "Account number must be between 9 and 18 digits")
      .required("Please enter account number."),
    bankName: Yup.string().required("Please enter bank name."),
    branchName: Yup.string().required("Please enter branch name."),
    currency: Yup.string().required("Please select currency."),
    customer: Yup.string().required("Please select customer."),
    description: Yup.string().required("Please enter description."),
    category: Yup.string().required("Please select category."),
    paymentReceipt: Yup.string().optional("Please enter a paymentreceipt."),
  });

  const onSubmit = (values, { resetForm }) => {
    // Convert amount to number before submitting
    const formattedValues = {
      ...values,
      amount: parseFloat(values.amount) || 0,
    };

    dispatch(AddRevenues(formattedValues)).then(() => {
      dispatch(getRevenue());
      message.success("Revenue added successfully!");
      onClose();
      resetForm();
    });
  };

  return (
    <div className="add-job-form">
      <h2 className="mb-2 border-b font-medium"></h2>
      <div className="">
        <div className="p-2">
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
              <>
                <Form className="formik-form" onSubmit={handleSubmit}>
                  <Row gutter={16}>
                    <Col span={12} className="">
                      <div className="form-item mt-3">
                        <label className="font-semibold"> Date <span className="text-red-500">*</span></label>
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
                      <div className="form-item mt-3">
                        <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
                        <Field
                          name="amount"
                          type="number"
                          step="0.01"
                          className="mt-1"
                          min="0"
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
                    <Col span={12} className="mt-2">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Account <span className="text-red-500">*</span></label>
                        <Field name="account">
                          {({ field }) => (
                            <Input
                              {...field}
                              placeholder="Select Account"
                              maxLength={18}
                              className="mt-1"
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
                    <Col span={12} className="mt-2">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                        <Field name="accountNumber">
                          {({ field }) => (
                            <Input
                              {...field}
                              className="mt-1"
                              placeholder="Enter Account Number"
                              maxLength={18}
                              onBlur={() => setFieldTouched("accountNumber", true)}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="accountNumber"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={12} className="mt-2">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                        <Field
                          name="bankName"
                          as={Input}
                          placeholder="Enter Bank Name"
                          className="mt-1"
                        />
                        <ErrorMessage
                          name="bankName"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={12} className="mt-2">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Branch Name <span className="text-red-500">*</span></label>
                        <Field
                          name="branchName"
                          as={Input}
                          placeholder="Enter Branch Name"
                          className="mt-1"
                        />
                        <ErrorMessage
                          name="branchName"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={12} className="">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Customer <span className="text-red-500">*</span></label>
                        <Field name="name">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="w-full mt-2"
                              placeholder="Select Customer"
                              loading={!fnddata} // Loading state
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
                    <Col span={12}>
                      <div className="form-item mt-3">
                        <label className="font-semibold">Category <span className="text-red-500">*</span></label>
                        <Select
                          className="mt-2"
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
                          name="category"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>

                    <Col span={12} className="">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Currency <span className="text-red-500">*</span> </label>
                        <div className="flex gap-2">
                          <Field name="currency">
                            {({ field, form }) => (
                              <Select
                                {...field}
                                className="w-full mt-1  "
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
                    <Col span={12} className="mt-3">
                      <div className="form-item">
                        <label className="font-semibold">Payment Receipt <span className="text-red-500">*</span></label>
                        <Field
                          name="paymentReceipt"
                          type="file"
                          placeholder="Enter payment receipt"
                          className="mt-2.5"
                        />
                        <ErrorMessage
                          name="paymentReceipt"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                      <Col span={24} className="">
                      <div className="form-item mt-3">
                        <label className="font-semibold">Description <span className="text-red-500">*</span>  </label>
                        <Field name="description" >
                          {({ field }) => (
                            <ReactQuill
                              {...field}
                              className="mt-2"
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

                {/* Add Category Modal */}
                <Modal
                  title="Add New Category"
                  open={isCategoryModalVisible}
                  onCancel={() => setIsCategoryModalVisible(false)}
                  onOk={() => handleAddNewCategory("category", newCategory, setNewCategory, setIsCategoryModalVisible, setFieldValue)}
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
              </>
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

       {/* Add Currency Modal */}
       <Modal
        title="Add New Currency"
        visible={isAddCurrencyModalVisible}
        onCancel={() => setIsAddCurrencyModalVisible(false)}
        footer={null}
        width={600}
      >
        <AddCurrencies
          onClose={() => {
            setIsAddCurrencyModalVisible(false);
            dispatch(getcurren()); // Refresh currency list after adding
          }}
        />
      </Modal>

      {/* Custom render for selected value */}
      <style jsx>{`
        .currency-select .ant-select-selection-item {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
        }

        .currency-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default AddRevenue;
