import React, { useEffect, useState } from "react";
import { Row, Col, Input, message, Button, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Addcreditnote,
  getcreditnote,
} from "./CustomerReducer/CreditnoteSlice";
import { getInvoice } from "../invoice/InvoiceReducer/InvoiceSlice";

const { Option } = Select;

const AddCrediteNotes = ({ onClose }) => {
  const dispatch = useDispatch();
  
  // Get invoices data
  const invoicesData = useSelector((state) => state.salesInvoices.salesInvoices.data);

  useEffect(() => {
    dispatch(getInvoice());
  }, [dispatch]);

  const [rows, setRows] = useState([
    {
      id: Date.now(),
      item: "",
      quantity: "",
      price: "",
      discount: "",
      tax: "",
      amount: "0",
      description: "",
      isNew: false,
    },
  ]);

  const onSubmit = (values, { resetForm }) => {
    // Find the matching invoice
    const selectedInvoice = invoicesData.find(invoice => invoice.id === values.invoice);
    
    const submitData = {
      ...values,
      salesInvoiceNumber: selectedInvoice ? selectedInvoice.salesInvoiceNumber : null,
      invoice: values.invoice // This is the invoice ID
    };

    dispatch(Addcreditnote(submitData))
      .then(() => {
        dispatch(getcreditnote());
        onClose();
        resetForm();
        message.success("Credit note added successfully!");
      })
      .catch(() => {
        message.error("Failed to add credit note.");
      });
  };

  const initialValues = {
    invoice: "",
    amount: "",
    date: null,
    description: "",
  };

  const validationSchema = Yup.object({
    invoice: Yup.string().required("Please select invoice."),
    amount: Yup.string()
      .min(1, "please enter minimum 1 amount")
      .required("Please enter a amount."),
    date: Yup.date().nullable().required("Date is required."),
    description: Yup.string().required("Please enter a description."),
  });

  // Add this function to handle invoice selection
  const handleInvoiceSelect = (invoiceId, setFieldValue) => {
    if (invoiceId) {
      const selectedInvoice = invoicesData.find(invoice => invoice.id === invoiceId);
      if (selectedInvoice) {
        // Set the invoice field
        setFieldValue("invoice", invoiceId);
        // Set the amount field with the invoice's total amount
        setFieldValue("amount", selectedInvoice.total || selectedInvoice.amount || 0);
      }
    } else {
      // Clear both fields if no invoice is selected
      setFieldValue("invoice", "");
      setFieldValue("amount", "");
    }
  };

  return (
    <>
      <div>
        <div className="">
          <h2 className="mb-3 border-b pb-[5px] font-medium"></h2>
          <div className="">
            <div className="">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                resetForm
              >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                  <Form className="formik-form" onSubmit={handleSubmit}>
                    <Row gutter={16}>
                      
                      <Col span={24} className="">
                        <div className="form-item">
                          <label className="font-semibold">Invoice <span className="text-red-500">*</span></label>
                          <Field name="invoice">
                            {({ field }) => (
                              <Select
                                {...field}
                                className="w-full mt-1"
                                placeholder="Select invoice"
                                onChange={(value) => handleInvoiceSelect(value, setFieldValue)}
                                value={values.invoice}
                                onBlur={() => setFieldTouched("invoice", true)}
                              >
                                {invoicesData && invoicesData.length > 0 ? (
                                  invoicesData.map((invoice) => (
                                    <Option key={invoice.id} value={invoice.id}>
                                      {invoice.salesInvoiceNumber || "Unnamed Invoice"}
                                    </Option>
                                  ))
                                ) : (
                                  <Option value="" disabled>
                                    No Invoices Available
                                  </Option>
                                )}
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

                      <Col span={12} className="mt-3">
                        <div className="form-item">
                          <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
                          <Field
                            name="amount"
                            as={Input}
                            className="mt-1"
                            placeholder="Enter Amount"
                            type="number"
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
                          <label className="font-semibold">Issue Date <span className="text-red-500">*</span></label>
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

                      <Col span={24} className="mt-3">
                        <div className="form-item">
                          <label className="font-semibold">Description <span className="text-red-500">*</span>  </label>
                          <Field name="description">
                            {({ field }) => (
                              <ReactQuill
                                {...field}
                                placeholder="Enter Description"
                                value={values.description}
                                className="mt-1"
                                onChange={(value) =>
                                  setFieldValue("description", value)
                                }
                                onBlur={() =>
                                  setFieldTouched("description", true)
                                }
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCrediteNotes;
