import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Modal,
} from "antd";
import { CloudUploadOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddPay, Getpay } from "./PaymentReducer/paymentSlice";
import { getAllInvoices } from '../invoice/invoicereducer/InvoiceSlice';
import { getallestimate } from '../estimates/estimatesReducer/EstimatesSlice';
import { Getexp } from '../expenses/Expencereducer/ExpenseSlice';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
const { Option } = Select;
const AddPayment = ({ onClose }) => {
  const navigate = useNavigate();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();

  const [invoices, setInvoices] = useState([]);



  const user = useSelector((state) => state.user.loggedInUser.username);

  const { currencies } = useSelector((state) => state.currencies);
const curren = currencies?.data || [];

// const curren = curr?.filter((item) => item.created_by === user);

  // Safely access the expense data with optional chaining
  const invoiceData = useSelector((state) => state.invoice?.invoices) || [];
  const estimateData = useSelector((state) => state.estimate?.estimates) || [];
  const expenseState = useSelector((state) => state.Expense);
  const expenseData = expenseState?.Expense?.data || [];

  useEffect(() => {
    dispatch(getAllInvoices(id));
    dispatch(getallestimate(id));
    dispatch(Getexp(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      dispatch(getcurren());
    } else {
      // message.error("Milestone ID is not defined.");
    }
  }, [dispatch, id]);

  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);


  // const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const validationSchema = Yup.object({
    project_name: Yup.string().required("Project is required."),
    invoice: Yup.string().when('selectedType', {
      is: 'invoice',
      then: () => Yup.string().required("Invoice is required."),
      otherwise: () => Yup.string().optional()
    }),
    estimate: Yup.string().when('selectedType', {
      is: 'estimate',
      then: () => Yup.string().required("Estimate is required."),
      otherwise: () => Yup.string().optional()
    }),
    expense: Yup.string().when('selectedType', {
      is: 'expense',
      then: () => Yup.string().required("Expense is required."),
      otherwise: () => Yup.string().optional()
    }),
    paidOn: Yup.string().required("Paid On is required."),
    amount: Yup.number()
      .required("Amount is required.")
      .min(0, "Amount must be greater than or equal to 0")
      .typeError("Amount must be a number"),
    currency: Yup.string().required("Currency is required."),
    exchangeRate: Yup.string().optional(),
    transactionId: Yup.string().required("Transaction Id is required."),
    paymentMethod: Yup.string().required("Payment Gateway is required."),
    bankAccount: Yup.string().optional(),
    receipt: Yup.string().optional(),
    remark: Yup.string().optional(),
  });

  const initialValues = {
    project_name: fnddata?.id || "",
    invoice: "",
    estimate: "",
    expense: "",
    paidOn: "",
    amount: "",
    currency: "",
    exchangeRate: "",
    transactionId: "",
    paymentMethod: "",
    bankAccount: "",
    receipt: "",
    remark: "",
    selectedType: null,
  };

  const onSubmit = (values, { resetForm }) => {
    // dispatch(AddPay({ id, values }))
    //   .then(() => {
    //     dispatch(Getpay(id));
    //     // message.success("Milestone added successfully!");
    //     resetForm();
    //     onClose();
    //   })
    //   .catch((error) => {
    //     // message.error("Failed to add Leads.");
    //     console.error("Add API error:", error);
    //   });

            const formData = new FormData();
                for (const key in values) {
                  formData.append(key, values[key]);
                }
            
                dispatch(AddPay({ id, formData })).then(() => {
                  dispatch(Getpay(id));
                  onClose();
                  resetForm();
                });
  };

  return (
    <div className="add-expenses-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => {
           const handleInvoiceChange = (invoiceId) => {
            if (!invoiceId) {
              setSelectedType(null);
              setFieldValue("selectedType", null);
              setFieldValue("invoice", "");
              setFieldValue("amount", "");
              return;
            }
        
            const selectedInvoice = invoiceData?.find(invoice => invoice.id === invoiceId);
            if (selectedInvoice) {
              setSelectedType('invoice');
              setFieldValue("selectedType", 'invoice');
              setFieldValue("invoice", invoiceId);
              const amount = parseFloat(selectedInvoice.finalTotal || selectedInvoice.total || 0);
              setFieldValue("amount", amount.toString());
            }
          };
        
          const handleEstimateChange = (estimateId) => {
            if (!estimateId) {
              setSelectedType(null);
              setFieldValue("selectedType", null);
              setFieldValue("estimate", "");
              setFieldValue("amount", "");
              return;
            }
        
            const selectedEstimate = estimateData?.find(estimate => estimate.id === estimateId);
            if (selectedEstimate) {
              setSelectedType('estimate');
              setFieldValue("selectedType", 'estimate');
              setFieldValue("estimate", estimateId);
              const amount = parseFloat(selectedEstimate.finalTotal || selectedEstimate.total || 0);
              setFieldValue("amount", amount.toString());
            }
          };
        
          const handleExpenseChange = (expenseId) => {
            if (!expenseId) {
              setSelectedType(null);
              setFieldValue("selectedType", null);
              setFieldValue("expense", "");
              setFieldValue("amount", "");
              return;
            }
        
            const selectedExpense = expenseData?.find(expense => expense.id === expenseId);
            if (selectedExpense) {
              setSelectedType('expense');
              setFieldValue("selectedType", 'expense');
              setFieldValue("expense", expenseId);
              const amount = parseFloat(selectedExpense.price || 0);
              setFieldValue("amount", amount.toString());
            }
          };
          return (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Project <span className="text-red-500">*</span></label>
                    <Field
                      name="project_name"
                      as={Input}
                      placeholder="Enter Project"
                      className="mt-1"
                      initialValue={fnddata?.project_name}
                      value={fnddata?.project_name} 
                      disabled
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-item">
                    <label className="font-semibold">Invoice <span className="text-red-500">*</span></label>
                    <Field name="invoice">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select Invoice"
                          className="w-full mt-1"
                          onChange={(value) => handleInvoiceChange(value)}
                          value={values.invoice}
                          disabled={selectedType && selectedType !== 'invoice'}
                          onBlur={() => setFieldTouched("invoice", true)}
                          allowClear={true}
                        >
                          {invoiceData?.map((invoice) => (
                            <Option key={invoice.id} value={invoice.id}>
                              {invoice.invoiceNumber}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="invoice"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Estimate <span className="text-red-500">*</span></label>
                    <Field name="estimate">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select Estimate"
                          className="w-full mt-1"
                          onChange={(value) => handleEstimateChange(value)}
                          value={values.estimate}
                          disabled={selectedType && selectedType !== 'estimate'}
                          onBlur={() => setFieldTouched("estimate", true)}
                          allowClear={true}
                        >
                          {estimateData?.map((estimate) => (
                            <Option 
                              key={estimate.id} 
                              value={estimate.id}
                            >
                              {estimate.quotationNumber} 
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="estimate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Expense <span className="text-red-500">*</span></label>
                    <Field name="expense">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select Expense"
                          className="w-full mt-1"
                          onChange={(value) => handleExpenseChange(value)}
                          value={values.expense}
                          disabled={selectedType && selectedType !== 'expense'}
                          onBlur={() => setFieldTouched("expense", true)}
                          allowClear={true}
                        >
                          {expenseData && expenseData.map((expense) => (
                            <Option key={expense.id} value={expense.id}>
                              {expense.item} - {expense.price}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="estimate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Paid On <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
                      format="DD-MM-YYYY"
                      value={values.paidOn}
                      onChange={(date) => setFieldValue("paidOn", date)}
                      onBlur={() => setFieldTouched("paidOn", true)}
                    />
                    <ErrorMessage
                      name="paidOn"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
                    <Field name="amount">
                      {({ field, form }) => (
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Enter Amount"
                          className="mt-1"
                          value={field.value || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue("amount", value ? parseFloat(value) : '');
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="amount"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                      <div className="form-item">
                        <label className="font-semibold">Currency <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          <Field name="currency">
                            {({ field, form }) => (
                              <Select
                                {...field}
                                className="w-full mt-1"
                                placeholder="Select Currency"
                                onChange={(value) => {
                                  const selectedCurrency = curren.find(
                                    (c) => c.id === value
                                  );
                                  form.setFieldValue(
                                    "currency",
                                    selectedCurrency?.currencyCode || ""
                                  );
                                }}
                              >
                                {curren.map((currency) => (
                                  <Option key={currency.id} value={currency.id}>
                                    {currency.currencyCode}
                                    ({currency.currencyIcon})
                                  </Option>
                                ))}
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
                {/* <Col span={6}>
                  <div className="form-item">
                    <label className="font-semibold">Exchange Rate </label>
                    <Field
                      name="exchangeRate"
                      as={Input}
                      placeholder="Enter Exchange Rate"
                    />
                    <ErrorMessage
                      name="exchangeRate"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col> */}
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Transaction Id <span className="text-red-500">*</span></label>
                    <Field
                      name="transactionId"
                      type="number"
                      as={Input}
                      placeholder="Enter Transaction Id"
                    />
                    <ErrorMessage
                      name="transactionId"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                <Col span={12} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Payment Method <span className="text-red-500">*</span></label>
                    <Field name="paymentMethod">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select Payment Method"
                          className="w-full mt-1"
                          onChange={(value) =>
                            setFieldValue("paymentMethod", value)
                          }
                          value={values.paymentMethod}
                          onBlur={() => setFieldTouched("paymentMethod", true)}
                          allowClear={false}
                        >
                          <Option value="online">Online Payment</Option>
                          <Option value="offline">Offline Payment</Option>
                        </Select>


                      )}
                    </Field>
                    <ErrorMessage
                      name="paymentMethod"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
                {/* <Col span={6} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Bank Account</label>
                    <Field name="bankAccount">
                      {({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select Bank Account"
                          className="w-full"
                          onChange={(value) =>
                            setFieldValue("bankAccount", value)
                          }
                          value={values.bankAccount}
                          onBlur={() => setFieldTouched("bankAccount", true)}
                          allowClear={false}
                        >
                          <Option value="xyz">XYZ</Option>
                          <Option value="abc">ABC</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="bankAccount"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col> */}

                <div className="mt-4 w-full">
                  <span className="block  font-semibold ps-1">
                    Receipt <QuestionCircleOutlined />
                  </span>
                  <Col span={24} className="mt-1">
                  <Field name="receipt">
                    {({ field }) => (
                      <div>
                        <Upload
                          beforeUpload={(file) => {
                            setFieldValue("receipt", file);
                            return false;
                          }}
                          showUploadList={true}
                          maxCount={1}
                          listType="text"
                        >
                          <Button icon={<UploadOutlined />}>Choose File</Button>
                        </Upload>
                      </div>
                    )}
                  </Field>
                </Col>
                </div>
                <Col span={24} className="mt-4">
                  <div className="form-item">
                    <label className="font-semibold">Remark</label>
                    <ReactQuill
                      value={values.remark}
                      className="mt-1"
                      onChange={(value) => setFieldValue("remark", value)}
                      placeholder="Enter Remark"
                      onBlur={() => setFieldTouched("remark", true)}
                    />
                    <ErrorMessage
                      name="remark"
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
                  Create
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default AddPayment;
