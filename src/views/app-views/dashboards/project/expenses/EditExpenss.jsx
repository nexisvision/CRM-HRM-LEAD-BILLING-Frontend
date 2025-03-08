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
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { EditExp, Getexp } from "./Expencereducer/ExpenseSlice";
import dayjs from "dayjs";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import AddCurrencies from '../../../setting/currencies/AddCurrencies';

const { Option } = Select;

const EditExpenses = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const allempdata = useSelector((state) => state.Expense);
  const Expensedata = allempdata?.Expense?.data || [];

  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data;
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);


  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  const allempdatass = useSelector((state) => state.currencies);
  const fnddatass = allempdatass?.currencies?.data;

  const getInitialCurrency = () => {
    if (fnddatass?.length > 0) {
      const inrCurrency = fnddatass.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || fnddatass[0]?.id;
    }
    return '';
  };

  const [initialValues, setInitialValues] = useState({
    item: "",
    currency: getInitialCurrency(),
    ExchangeRate: "",
    price: "",
    purchase_date: null,
    project: "",
    ExpenseCategory: "",
    PurchasedFrom: "",
    BankAccount: "",
    description: "",
    bill: "",
  });

  useEffect(() => {
    // Fetch expense data if not already available
    if (!Expensedata.length) {
      dispatch(Getexp());
    }
  }, [dispatch]);


  useEffect(() => {
    if (Expensedata.length > 0 && idd) {
      const expdata = Expensedata.find((item) => item.id === idd);

      if (expdata) {
        // Convert the date string to dayjs object if it exists
        const purchaseDate = expdata.purchase_date
          ? dayjs(expdata.purchase_date)
          : null;

        setInitialValues({
          id: idd,
          item: expdata.item || "",
          currency: expdata.currency || "",
          ExchangeRate: expdata.ExchangeRate || "",
          price: expdata.price ? expdata.price.toString() : "", 
          purchase_date: purchaseDate,
          project: fnddata?.id || "",
          ExpenseCategory: expdata.ExpenseCategory || "",
          PurchasedFrom: expdata.PurchasedFrom || "",
          BankAccount: expdata.BankAccount || "",
          description: expdata.description || "", 
          bill: expdata.bill || "",
        });
      } else {
        message.error("Expense not found!");
        navigate("/apps/sales/expenses");
      }
    }
  }, [idd, Expensedata, navigate]);

  const onSubmit = async (values, { resetForm }) => {
    const updatedValues = {
      ...values,
      price: parseFloat(values.price),
      purchase_date: values.purchase_date
        ? values.purchase_date.format("YYYY-MM-DD")
        : null,
    };

    try {
      await dispatch(EditExp({ id: idd, values: updatedValues })).unwrap();
      message.success("Expenses updated successfully!");
      dispatch(Getexp(id));
      onClose();
      resetForm();
    } catch (error) {
      message.error("Failed to update expenses. Please try again.");
    }
  };

  const validationSchema = Yup.object({
    item: Yup.string().required("Item is required."),
    currency: Yup.string().required("Currency is required."),
    price: Yup.string().required("Price is required"),
    purchase_date: Yup.mixed().required("Date is required."),
    description: Yup.string().optional("Description is required."),
  });

  return (
    <div className="Edit-expenses-form">
      <h2 className="border-b pb-[-10px] mb-[10px] font-medium"></h2>
      <Formik
        enableReinitialize 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">ItemName <span className="text-red-500">*</span></label>
                  <Field name="item" as={Input} placeholder="Enter item" className="mt-1" />
                  <ErrorMessage
                    name="item"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Currency <span className="text-red-500">*</span></label>
                  <div className="flex gap-0">
                    <Field name="currency">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="currency-select"
                          style={{
                            width: '80px',
                            height: '40px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: 0,
                            backgroundColor: '#f8fafc',
                          }}
                          placeholder={<span className="text-gray-400">₹</span>}
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
                          loading={!fnddatass}
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
                    <Field name="price">
                      {({ field, form }) => (
                        <Input
                          {...field}
                          className="price-input"
                          style={{
                            height: '40px',
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderLeft: '1px solid #d9d9d9',
                            width: 'calc(100% - 80px)'
                          }}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                              form.setFieldValue('price', value);
                            }
                          }}
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
                  <ErrorMessage name="price" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>
             
              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">PurchaseDate <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
                    format="DD-MM-YYYY"
                    value={values.purchase_date}
                    onChange={(date) => setFieldValue("purchase_date", date)}
                    onBlur={() => setFieldTouched("purchase_date", true)}
                  />
                  <ErrorMessage
                    name="purchase_date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
             
              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project <span className="text-red-500">*</span></label>

                  <Field name="project">
                    {({ field }) => (
                      <Input
                        {...field}
                        value={fnddata?.project_name || ''}
                        disabled
                        placeholder="Project name will appear here"
                        className="mt-1"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="project"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">PurchasedFrom <span className="text-red-500">*</span></label>

                  <Field
                    name="PurchasedFrom"
                    as={Input}
                    placeholder="Enter PurchasedFrom"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="PurchasedFrom"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    className="mt-1"
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter Description"
                    onBlur={() => setFieldTouched("description", true)}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

            </Row>
            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
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
        .currency-select .ant-select-selector {
            height: 40px !important;
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            display: flex !important;
            align-items: center !important;
        }

        .currency-select .ant-select-selection-item {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            line-height: 32px !important;
        }

        .currency-select .ant-select-selection-item > div {
            display: flex !important;
            align-items: center !important;
        }

        .currency-select .ant-select-selection-item span:not(:first-child) {
            display: none !important;
        }

        .price-input {
            height: 40px !important;
        }

        .ant-select-dropdown .ant-select-item {
            padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
            display: flex !important;
            align-items: center !important;
            width: 100% !important;
        }

        .ant-input-number-input {
            height: 40px !important;
            line-height: 40px !important;
        }
      `}</style>
    </div>
  );
};

export default EditExpenses;
