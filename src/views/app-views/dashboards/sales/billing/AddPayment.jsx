import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input, Button, DatePicker, Select, Upload, Row, Col, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPayment } from './paymentReducer/PaymentSlice';
import { getAccounts, getAllAccounts } from '../../banking/account/AccountReducer/AccountSlice';
import dayjs from 'dayjs';

const { Option } = Select;

const AddPayment = ({ onClose, billNumber }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get billing data
  const allBillingData = useSelector((state) => state?.salesbilling?.salesbilling?.data || []);
  const currentBill = allBillingData.find(bill => bill.billNumber === billNumber);
  const billAmount = currentBill?.total || 0;

  // Get accounts data
  const accounts = useSelector((state) => state.account?.account?.data || []);

  useEffect(() => {
    dispatch(getAccounts());
  }, []);


  
  const initialValues = {
    billNumber: billNumber || '',
    date: null,
    amount: billAmount, // Set initial amount to bill amount
    account: '',
    reference: '',
    description: '',
  };


  const validationSchema = Yup.object().shape({
    billNumber: Yup.string()
      .required('Bill Number is required'),
    date: Yup.mixed()
      .required('Date is required')
      .test('is-date', 'Invalid date', value => dayjs.isDayjs(value) || value instanceof Date),
    amount: Yup.number()
      .typeError('Amount must be a number')
      .required('Amount is required')
      .min(0, 'Amount must be greater than or equal to 0'),
      // .max(finalTotal, `Amount cannot exceed ${finalTotal}`),
    account: Yup.string()
      .required('Account is required'),
    reference: Yup.string()
      .required('Reference is required'),
    description: Yup.string()
      .required('Description is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Find the selected account
      const selectedAccount = accounts.find(acc => acc.id === values.account);
      
      const paymentData = {
        bill: currentBill.id,
        date: dayjs(values.date).format('YYYY-MM-DD'),
        amount: parseFloat(values.amount),
        account: values.account, // This will be the account ID
        reference: values.reference,
        description: values.description
      };

      const response = await dispatch(createPayment(paymentData)).unwrap();
      
      if (response) {
        message.success('Payment added successfully!');
        resetForm();
        onClose();
      }
    } catch (error) {
      message.error(error?.message || 'Failed to create payment');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="add-payment-form p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Bill Number <span className="text-red-500">*</span></label>
                  <Field
                    name="billNumber"
                    as={Input}
                    disabled={true}
                    className="w-full"
                  />
                  <ErrorMessage name="billNumber" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue('date', date)}
                  />
                  {errors.date && touched.date && (
                    <div className="text-red-500 mt-1">{errors.date}</div>
                  )}
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">
                    Amount <span className="text-red-500">*</span>
                  
                  </label>
                  <Input
                    name="amount"
                    type="number"
                    className="w-full"
                    placeholder="Enter Amount"
                    value={values.amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('amount', value);
                    }}
                  />
                  <ErrorMessage name="amount" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Account <span className="text-red-500">*</span></label>
                  <Select
                    className="w-full"
                    placeholder="Select Account"
                    value={values.account}
                    onChange={(value) => setFieldValue('account', value)}
                  >
                    {accounts && accounts.map((account) => (
                      <Option key={account.id} value={account.id}>
                        {account.bankName} 
                      </Option>
                    ))}
                  </Select>
                  <ErrorMessage name="account" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Reference <span className="text-red-500">*</span></label>
                  <Field
                    name="reference"
                    as={Input}
                    placeholder="Enter Reference"
                    className="w-full"
                  />
                  <ErrorMessage name="reference" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>

              <Col span={24}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Description <span className="text-red-500">*</span></label>
                  <Field
                    name="description"
                    as={Input.TextArea}
                    placeholder="Enter Description"
                    className="w-full"
                    rows={4}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">Add Payment</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPayment;
