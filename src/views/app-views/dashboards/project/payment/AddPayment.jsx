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
const curr = currencies?.data || [];

const curren = curr?.filter((item) => item.created_by === user);

  // Get invoices from Redux store
  const invoiceData = useSelector((state) => state.invoice.invoices);

  useEffect(() => {
    dispatch(getAllInvoices(id));
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
  const initialValues = {
    project_name: fnddata?.id || "",
    invoice: "",
    paidOn: "",
    amount: "", 
    currency: "",
    exchangeRate: "",
    transactionId: "",   
    paymentMethod: "",
    bankAccount: "",
    receipt: "",
    remark: "",
  };
  const validationSchema = Yup.object({
    project_name: Yup.string().optional("Please enter Project."),
    invoice: Yup.string().optional("Please enter Invoice."),
    paidOn: Yup.string().optional("Please enter Paid On."),
    amount: Yup.string().optional("Please enter Amount."),
    currency: Yup.string().optional("Please enter Currency."),
    exchangeRate: Yup.string().optional("Please enter Exchange Rate."),
    transactionId: Yup.number().optional("Please enter Transaction Id."),
    paymentMethod: Yup.string().optional("Please enter Payment Gateway."),
    bankAccount: Yup.string().optional("Please enter Bank Account."),
    receipt: Yup.string().optional("Please enter Receipt."),
    remark: Yup.string().optional("Please enter Remark."),
  });
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
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
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
                        onChange={(value) => setFieldValue("invoice", value)}
                        value={values.invoice}
                        onBlur={() => setFieldTouched("invoice", true)}
                        allowClear={false}
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
                  <Field name="amount" as={Input} placeholder="Enter Amount" className="mt-1" />
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
                  <label className="font-semibold">Payment Gateway <span className="text-red-500">*</span></label>
                  <Field name="paymentMethod">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Payment Gateway"
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
                {/* <span className="block font-semibold p-2">
                  Add <QuestionCircleOutlined />
                </span> */}
                <Field name="receipt">
                  {({ field }) => (
                    <div>
                      <Upload
                        beforeUpload={(file) => {
                          setFieldValue("receipt", file); // Set file in Formik state
                          return false; // Prevent auto upload
                        }}
                        showUploadList={false}
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
        )}
      </Formik>
    </div>
  );
};
export default AddPayment;
