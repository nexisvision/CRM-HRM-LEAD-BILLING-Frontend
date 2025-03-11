import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Select, Row, Col, message } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { createDebitNote, clearState } from './debitReducer/DebitSlice';
import { getbil } from '../../sales/billing/billing2Reducer/billing2Slice';

const AddDebitnote = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.debitNotes);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const { salesbilling } = useSelector((state) => state.salesbilling);
  const lid = AllLoggeddtaa.loggedInUser.id;
  const [selectedBillAmount, setSelectedBillAmount] = useState(0);

  useEffect(() => {
    dispatch(getbil(lid));
  }, [dispatch, lid]);

  useEffect(() => {
    if (success) {
      onClose();
      dispatch(clearState());
    }
  }, [success, dispatch, onClose]);

  const initialValues = {
    bill: '',
    date: null,
    amount: '',
    description: '',
  };

  const validationSchema = Yup.object({
    bill: Yup.string().required('Please select a bill'),
    date: Yup.date().required('Please select a date'),
    amount: Yup.number()
      .required('Please enter an amount')
      .positive('Amount must be positive')
      .max(selectedBillAmount, `Amount cannot exceed bill total of ₹${selectedBillAmount}`),
    description: Yup.string().required('Please enter a description'),
  });

  const handleBillChange = (value, setFieldValue) => {
    const selectedBill = salesbilling?.data?.find(bill => bill.id === value);
    if (selectedBill) {
      setSelectedBillAmount(selectedBill.total);
      setFieldValue('amount', selectedBill.total);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (parseFloat(values.amount) > selectedBillAmount) {
      message.error(`Debit amount cannot exceed bill total of ₹${selectedBillAmount}`);
      setSubmitting(false);
      return;
    }

    const formattedData = {
      ...values,
      date: moment(values.date).format('YYYY-MM-DD'),
      amount: parseFloat(values.amount),
    };

    dispatch(createDebitNote(formattedData));
    setSubmitting(false);
  };

  return (
    <div className="add-debitnote-form">
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <FormikForm>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-group mt-3">
                  <label className="font-semibold">
                    Bill <span className="text-red-500">*</span>
                  </label>
                  <Field name="bill">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select bill"
                        className={`w-full mt-1 ${errors.bill && touched.bill ? 'border-red-500' : ''}`}
                        onChange={(value) => {
                          setFieldValue('bill', value);
                          handleBillChange(value, setFieldValue);
                        }}
                        loading={loading}
                      >
                        {Array.isArray(salesbilling?.data) && salesbilling?.data.map((bill) => (
                          <Select.Option key={bill.id} value={bill.id}>
                            {bill.billNumber}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  {errors.bill && touched.bill && (
                    <div className="text-red-500 mt-1">{errors.bill}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-3">
                  <label className="font-semibold">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    className={`w-full mt-1 ${errors.date && touched.date ? 'border-red-500' : ''}`}
                    value={values.date}
                    onChange={(date) => setFieldValue('date', date)}
                    format="YYYY-MM-DD"
                    placeholder="Select date"
                  />
                  {errors.date && touched.date && (
                    <div className="text-red-500 mt-1">{errors.date}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div className="form-group mt-3">
                  <label className="font-semibold">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <Field name="amount">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter amount"
                        className={`w-full mt-1 ${errors.amount && touched.amount ? 'border-red-500' : ''}`}
                        max={selectedBillAmount}
                        value={values.amount}
                      // disabled
                      />
                    )}
                  </Field>
                  {errors.amount && touched.amount && (
                    <div className="text-red-500 mt-1">{errors.amount}</div>
                  )}
                </div>
              </Col>

              <Col span={24}>
                <div className="form-group mt-3">
                  <label className="font-semibold">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue('description', value)}
                    className="mt-1"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 mt-1">{errors.description}</div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="text-right mt-4">
              <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddDebitnote;