import React, { useState } from 'react';
import { Input, Button, DatePicker, Row, Col, message } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditDebitnote = ({ onClose, debitnoteData }) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    bill: debitnoteData?.bill || '',
    date: debitnoteData?.date ? moment(debitnoteData.date) : null,
    amount: debitnoteData?.amount || '',
    description: debitnoteData?.description || '',
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
      // Add your update API call here
      message.success('Debit note updated successfully!');
      onClose();
    } catch (error) {
      message.error('Failed to update debit note');
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-debitnote-form">
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <FormikForm onSubmit={handleSubmit}>
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
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        className="mt-1"
                        value={field.value}
                        onChange={(value) => setFieldValue('description', value)}
                      />
                    )}
                  </Field>
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
                Update
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default EditDebitnote;