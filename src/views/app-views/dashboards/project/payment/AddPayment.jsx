import React, { useState } from "react";
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
import { CloudUploadOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddPay, Getpay } from "./PaymentReducer/paymentSlice";
const { Option } = Select;
const AddPayment = ({ onClose }) => {
  const navigate = useNavigate();
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);

  const dispatch = useDispatch();
  const { id } = useParams();


    const allproject = useSelector((state) => state.Project);
    const fndrewduxxdaa = allproject.Project.data
    const fnddata = fndrewduxxdaa?.find((project) => project?.id === id);
    

  // const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const initialValues = {
    project: fnddata?.id || "",
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
    project: Yup.string().optional("Please enter Project."),
    invoice: Yup.string().optional("Please enter Invoice."),
    paidOn: Yup.string().optional("Please enter Paid On."),
    amount: Yup.string().optional("Please enter Amount."),
    currency: Yup.string().optional("Please enter Currency."),
    exchangeRate: Yup.string().optional("Please enter Exchange Rate."),
    transactionId: Yup.string().optional("Please enter Transaction Id."),
    paymentMethod: Yup.string().optional("Please enter Payment Gateway."),
    bankAccount: Yup.string().optional("Please enter Bank Account."),
    receipt: Yup.string().optional("Please enter Receipt."),
    remark: Yup.string().optional("Please enter Remark."),
  });
  const onSubmit = (values, { resetForm }) => {
    dispatch(AddPay({ id, values }))
      .then(() => {
        dispatch(Getpay(id));
        message.success("Milestone added successfully!");
        resetForm();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to add Leads.");
        console.error("Add API error:", error);
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
              <Col span={6}>
                <div className="form-item">
                  <label className="font-semibold">Project</label>
                  <Field
                    name="project"
                    as={Input}
                    placeholder="Enter Project"
                    className="mt-2"
                    initialValue={fnddata?.project_name}
                    value={fnddata?.project_name}
                    disabled
                  />
                </div>
              </Col>
              <Col span={6}>
                <div className="form-item">
                  <label className="font-semibold">Invoice</label>
                  <Field name="invoice">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Invoice"
                        className="w-full"
                        onChange={(value) => setFieldValue("invoice", value)}
                        value={values.invoice}
                        onBlur={() => setFieldTouched("invoice", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
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
              <Col span={6}>
                <div className="form-item">
                  <label className="font-semibold">Paid On</label>
                  <DatePicker
                    className="w-full"
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
              <Col span={6}>
                <div className="form-item">
                  <label className="font-semibold">Amount </label>
                  <Field name="amount" as={Input} placeholder="Enter Amount" />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={6} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Currency</label>
                  <Field name="currency">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Currency"
                        className="w-full"
                        onChange={(value) => setFieldValue("currency", value)}
                        value={values.currency}
                        onBlur={() => setFieldTouched("currency", true)}
                        allowClear={false}
                      >
                        <Option value="INR">INR</Option>
                        <Option value="USD">USD</Option>
                      </Select>
                    )}
                  </Field>
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
              <Col span={6}>
                <div className="form-item">
                  <label className="font-semibold">Transaction Id</label>
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
              <Col span={6} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Payment Gateway</label>
                  <Field name="paymentMethod">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select Payment Gateway"
                        className="w-full"
                        onChange={(value) =>
                          setFieldValue("paymentMethod", value)
                        }
                        value={values.paymentMethod}
                        onBlur={() => setFieldTouched("paymentMethod", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
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
                <span className="block  font-semibold p-2">
                  Receipt <QuestionCircleOutlined />
                </span>
                <Col span={24}>
                  <Upload
                    action="http://localhost:5500/api/users/upload-cv"
                    listType="picture"
                    accept=".pdf"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    className="border-2 flex justify-center items-center p-10 "
                  >
                    <CloudUploadOutlined className="text-4xl" />
                    <span className="text-xl">Choose File</span>
                  </Upload>
                </Col>
              </div>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Remark</label>
                  <ReactQuill
                    value={values.remark}
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
