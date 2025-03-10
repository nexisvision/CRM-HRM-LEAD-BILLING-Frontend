import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Upload,
  Modal,
} from "antd";
import {PlusOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
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
import AddCurrencies from "views/app-views/setting/currencies/AddCurrencies";
const { Option } = Select;
const AddPayment = ({ onClose}) => {
 
  const dispatch = useDispatch();
  const { id } = useParams();

  const { currencies } = useSelector((state) => state.currencies);
  const curren = currencies?.data || [];

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
    } 
  }, [dispatch, id]);

  const allproject = useSelector((state) => state.Project);
  const fndrewduxxdaa = allproject.Project.data
  const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);

  const [selectedType, setSelectedType] = useState(null);
  const [isAddCurrencyModalVisible, setIsAddCurrencyModalVisible] = useState(false);

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

  const getInitialCurrency = () => {
    if (curren?.length > 0) {
      const inrCurrency = curren.find(c => c.currencyCode === 'INR');
      return inrCurrency?.id || curren[0]?.id;
    }
    return '';
  };

  const initialValues = {
    project_name: fnddata?.id || "",
    invoice: "",
    estimate: "",
    expense: "",
    paidOn: "",
    amount: "",
    currency: getInitialCurrency(),
    exchangeRate: "",
    transactionId: "",
    paymentMethod: "",
    bankAccount: "",
    receipt: "",
    remark: "",
    selectedType: null,
  };
  const onSubmit = (values, { resetForm }) => {
    const data = {
      project_name: values.project_name,
      paidOn: values.paidOn ? values.paidOn.format('YYYY-MM-DD') : '',
      amount: values.amount || '',
      currency: values.currency || '',
      transactionId: values.transactionId || '',
      paymentMethod: values.paymentMethod || '',
      exchangeRate: values.exchangeRate || '',
      bankAccount: values.bankAccount || '',
      remark: values.remark || ''
    };
    data.invoice = values.selectedType === 'invoice' && values.invoice ? values.invoice : null;
    data.estimate = values.selectedType === 'estimate' && values.estimate ? values.estimate : null;
    data.expense = values.selectedType === 'expense' && values.expense ? values.expense : null;

    console.log("Form Data Object:", data);

    const formData = new FormData();

    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    if (values.receipt instanceof File) {
      formData.append('receipt', values.receipt);
    }

    dispatch(AddPay({ id, formData })).then(() => {
      dispatch(Getpay(id));
      onClose();
      resetForm();
    });
  };

  return (
    <div className="add-expenses-form">
<h2 className="border-b pb-[-10px] mb-[10px] font-medium"></h2>
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
                    <label className="font-semibold">Invoice </label>
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
                    <label className="font-semibold">Estimate </label>
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
                    <label className="font-semibold">Expense </label>
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
                              {expense.item} 
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
                  <div className="form-group">
                    <label className="text-gray-600 font-semibold mb-1 block">Amount & Currency <span className="text-red-500">*</span></label>
                    <div className="flex gap-0">
                      <Field name="currency">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="currency-select"
                            style={{
                              width: '70px',
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
                            loading={!curren}
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
                            {curren?.map((currency) => (
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
                                form.setFieldValue('amount', value);
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
                                  {curren?.find(c => c.id === values.currency)?.currencyIcon}
                                </span>
                              )
                            }
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="amount" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>
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
 
    </div>
  );
};
export default AddPayment;
