import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Modal,
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
import AddCurrencies from '../../../setting/currencies/AddCurrencies';

const { Option } = Select;

const EditRevenue = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);
  const AllLoggedData = useSelector((state) => state.user);
  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const usdCurrency = fnddatass.find(c => c.currencyCode === 'USD');
      return usdCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const fetchLables = React.useCallback(async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueCategories = response.payload.data
          .filter((label) => label && label.name)
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          );

        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to load categories");
    }
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLables("category", setCategories);
  }, [fetchLables]);

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

      await fetchLables();
    } catch (error) {
      console.error("Failed to add Category:", error);
      message.error("Failed to add Category");
    }
  };

  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);

  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

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
    currency: getInitialCurrency(),
    description: "",
    category: "",
    paymentReceipt: "",
  });

  useEffect(() => {
    dispatch(getRevenue());
  }, [dispatch]);

  useEffect(() => {
    dispatch(Getcus());
  }, [dispatch]);

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
      <hr className="mb-2 border-b font-medium"></hr>
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
                      <label className="font-semibold"> Date <span className="text-red-500">*</span></label>
                      <Field name="date">
                        {({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            className="w-full "
                            value={values.date ? moment(values.date).format('YYYY-MM-DD') : ''}
                            onChange={(e) => setFieldValue("date", moment(e.target.value))}
                            onBlur={() => setFieldTouched("date", true)}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="date"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>
                  <Col span={12} className="">
                    <div className="form-group">
                      <label className="text-gray-600 font-semibold mb-1 block">Currency & Amount <span className="text-red-500">*</span></label>
                      <div className="flex gap-0" style={{ display: 'flex' }}>
                        <Field name="currency">
                          {({ field }) => (
                            <Select
                              {...field}
                              className="currency-select"
                              style={{
                                width: '80px',
                                minWidth: '80px',
                                flex: '0 0 80px',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                borderRight: 0,
                                backgroundColor: '#f8fafc',
                              }}
                              placeholder={<span className="text-gray-400">$</span>}
                              onChange={(value) => {
                                if (value === 'add_new') {
                                  setIsAddCurrencyModalVisible(true);
                                } else {
                                  setFieldValue("currency", value);
                                }
                              }}
                              value={values.currency}
                              dropdownStyle={{ minWidth: '180px' }}

                              suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                              loading={!currencies}
                              dropdownRender={menu => (
                                <div>
                                  <div
                                    className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                                    onClick={() => setIsAddCurrencyModalVisible(true)}
                                  >
                                    <PlusOutlined className="mr-2" />
                                    <span className="text-sm">Add New</span>
                                  </div>
                                  {menu}
                                </div>
                              )}
                            >
                              {fnddatass?.map((currency) => (
                                <Option key={currency.id} value={currency.id}>
                                  <div className="flex items-center w-full px-1">
                                    <span className="text-base min-w-[24px]">{currency.currencyIcon}</span>
                                    <span className="text-gray-600 text-sm ml-3">{currency.currencyName}</span>
                                    <span className="text-gray-400 text-xs ml-auto">{currency.currencyCode}</span>
                                  </div>
                                </Option>
                              ))}
                            </Select>
                          )}
                        </Field>
                        <Field name="amount">
                          {({ field, form }) => (
                            <Input
                              {...field}
                              className="price-input"
                              style={{
                                flex: 1,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                borderLeft: '1px solid #d9d9d9',
                              }}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                  setFieldValue('amount', value);
                                }
                              }}
                              onBlur={() => setFieldTouched("amount", true)}
                              onKeyPress={(e) => {
                                const charCode = e.which ? e.which : e.keyCode;
                                if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                                  e.preventDefault();
                                }
                                if (charCode === 46 && field.value.includes('.')) {
                                  e.preventDefault();
                                }
                              }}
                              prefix={
                                values.currency && (
                                  <span className="text-gray-600 font-medium mr-1">
                                    {fnddatass?.find(c => c.id === values.currency)?.currencyIcon}
                                  </span>
                                )
                              }
                            />
                          )}
                        </Field>
                      </div>
                      <ErrorMessage name="amount" component="div" className="text-red-500 mt-1 text-sm" />
                      <ErrorMessage name="currency" component="div" className="text-red-500 mt-1 text-sm" />
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
                      <label className="font-semibold">Payment Receipt</label>
                      <input
                        type="file"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
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

export default EditRevenue;
