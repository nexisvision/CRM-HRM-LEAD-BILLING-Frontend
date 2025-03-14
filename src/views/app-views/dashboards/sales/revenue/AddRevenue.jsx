import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Modal
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
import AddCustomer from "../customer/AddCustomer";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';
import dayjs from "dayjs";

const { Option } = Select;

const AddRevenue = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };
  const AllLoggedData = useSelector((state) => state.user);

  const fetchLables = React.useCallback(async (lableType, setter) => {
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
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLables("category", setCategories);
  }, [fetchLables]);

  const handleAddNewLable = async (lableType, newValue, setter, modalSetter, setFieldValue) => {
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


  useEffect(() => {
    dispatch(Getcus());
  }, [dispatch]);

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
  }, [currencies]);

  const customerdata = useSelector((state) => state.customers);
  const fnddata = customerdata.customers.data;

  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);

  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

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
      .required("Please enter an amount"),
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
    const formattedValues = {
      ...values,
      amount: parseFloat(values.amount) || 0,
      date: values.date // Use the date string directly
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
     <div className="border-b pb-[10px] font-medium"></div>
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
            }) => (
              <>
                <Form className="formik-form" onSubmit={handleSubmit}>
                  <Row gutter={16}>
                    <Col span={12} className="">
                      <div className="form-item mt-3">
                        <label className="font-semibold"> Date <span className="text-red-500">*</span></label>
                        <input 
                          type="date"
                          className="w-full mt-1 p-2 border rounded"
                          value={values.date ? dayjs(values.date).format('YYYY-MM-DD') : ''}
                          min={dayjs().format('YYYY-MM-DD')}
                          onChange={(e) => {
                            const selectedDate = e.target.value;
                            setFieldValue('date', selectedDate);
                          }}
                          onBlur={() => setFieldTouched("date", true)}
                        />
                        <ErrorMessage
                          name="date"
                          component="div"
                          className="error-message text-red-500 my-1"
                        />
                      </div>
                    </Col>
                    <Col span={12} className="mt-3">
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
                              loading={!fnddata}
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
            dispatch(getcurren());
          }}
        />
      </Modal>

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
