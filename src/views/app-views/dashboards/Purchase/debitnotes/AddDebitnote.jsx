import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, message } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddDebitnote = ({ onClose }) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    bill: '',
    date: null,
    amount: '',
    description: '',
  };

  const validationSchema = Yup.object({
    bill: Yup.string().required('Please enter a bill'),
    date: Yup.date().required('Please select a date'),
    amount: Yup.number().required('Please enter an amount'),
    description: Yup.string().required('Please enter a description'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // Add your API call here
      console.log('Submitted values:', values);
      message.success('Debit note created successfully!');
      onClose();
    } catch (error) {
      message.error('Failed to create debit note');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="add-debitnote-form">
      <h1 className="border-b-2 border-gray-300"></h1>
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
                      <Input 
                        {...field}
                        placeholder="Enter bill"
                        className={`w-full mt-1 ${errors.bill && touched.bill ? 'border-red-500' : ''}`}
                      />
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