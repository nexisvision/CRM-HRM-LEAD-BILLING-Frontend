import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Input, Button, DatePicker, Select, Upload, Row, Col, Card, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AddPayment = ({ onClose, billNumber }) => {
  const navigate = useNavigate();
  
  // Get billing data from Redux store
  const allBillingData = useSelector((state) => state?.salesbilling?.salesbilling?.data || []);
  
  // Find the specific billing using billNumber
  const currentBill = allBillingData.find(bill => bill.billNumber === billNumber);
  
  // Get the final total from the billing data
  const finalTotal = currentBill?.discription?.finalTotal || '';

  const initialValues = {
    billNumber: billNumber || '',
    date: null,
    amount: finalTotal, // Set initial amount to finalTotal
    account: '',
    reference: '',
    description: '',
    receipt: null
  };

  const validationSchema = Yup.object().shape({
    billNumber: Yup.string()
      .required('Bill Number is required'),
    date: Yup.date()
      .required('Date is required'),
    amount: Yup.number()
      .required('Amount is required')
      .min(0, 'Amount must be greater than or equal to 0')
      .max(finalTotal, `Amount cannot exceed ${finalTotal}`),
    account: Yup.string()
      .required('Account is required'),
    reference: Yup.string()
      .required('Reference is required'),
    description: Yup.string()
      .required('Description is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    console.log('Form values:', values);
    message.success('Payment added successfully!');
    resetForm();
    onClose();
  };

  return (
    <div className="add-payment-form p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Bill Number <span className="text-red-500">*</span></label>
                  <Field
                    name="billNumber"
                    as={Input}
                    disabled={!!billNumber}
                    placeholder="Enter Bill Number"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="billNumber"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    onChange={(date) => setFieldValue('date', date)}
                    value={values.date}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1"> Amount <span className="text-red-500">*</span></label>
                  <Field
                    name="amount" 
                    as={Input}
                    type="number"
                    placeholder="Enter Amount"
                    className="w-full"
                    value={finalTotal}
                    
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Account <span className="text-red-500">*</span></label>
                  <Field name="account">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Account"
                        onChange={(value) => setFieldValue('account', value)}
                      >
                        <Option value="CANARA BANK cash">CANARA BANK cash</Option>
                        <Option value="HDFC BANK">HDFC BANK</Option>
                        <Option value="SBI BANK">SBI BANK</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="account"
                    component="div"
                    className="text-red-500 mt-1"
                  />
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
                  <ErrorMessage
                    name="reference"
                    component="div"
                    className="text-red-500 mt-1"
                  />
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
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 mt-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="form-item mb-4">
                  <label className="block mb-1">Payment Receipt</label>
                  <Upload
                    beforeUpload={() => false}
                    onChange={({ file }) => setFieldValue('receipt', file)}
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Add Payment
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddPayment;
