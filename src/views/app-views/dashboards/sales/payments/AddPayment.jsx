import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddPayment = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const initialValues = {
    invoiceiD: '',
    amount: '',
    date: null,
    paymentmethod: '',
    transactioniD: '',
    description: '',
  };

  const validationSchema = Yup.object({
    invoiceiD: Yup.string().required('Please enter Invoice ID.'),
    amount: Yup.string().required('Please enter a amount.'),
    date: Yup.date().nullable().required('Date is required.'),
    paymentmethod: Yup.string().required('Please select paymentmethod.'),
    transactioniD: Yup.string().required('Please Enter Transaction ID.'),
    description: isExpanded ? Yup.string().required("Description  are required") : Yup.string(),

  });
  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Job added successfully!');
    navigate('app/apps/sales/payments');
  };

  return (
    <div className="add-job-form">
      <h2 className="mb-4 border-b pb-[5px] font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className='font-semibold'>Invoice ID</label>
                  <div className='flex'>
                    <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>INV-</span>
                    <Field name="invoiceiD" as={Input} placeholder="Enter Invoice ID" onBlur={() => setFieldTouched("invoiceiD", true)} className=' rounded-e-lg rounded-s-none' />
                  </div>
                  <ErrorMessage name="invoiceiD" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Amount</label>
                  <div className='flex'>
                    <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>$</span>
                    <Field name="amount" as={Input} placeholder="Enter Amount" onBlur={() => setFieldTouched("amount", true)} className=' rounded-e-lg rounded-s-none' />
                  </div>
                  <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'> Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue('date', date)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Payment Method</label>
                  <Field name="paymentmethod">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select payment method"
                        onChange={(value) => setFieldValue('paymentmethod', value)}
                        value={values.paymentmethod}
                        onBlur={() => setFieldTouched("paymentmethod", true)}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="paymentmethod" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Transaction ID</label>
                  <Field name="transactioniD">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Transaction ID"
                        onChange={(value) => setFieldValue('transactioniD', value)}
                        value={values.transactioniD}
                        onBlur={() => setFieldTouched("transactioniD", true)}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="transactioniD" component="div" className="error-message text-red-500 my-1" type='number' />
                </div>
              </Col>

              <Col span={24} className='mt-4 '>
                <div className="flex justify-between items-center">
                  <label className="font-semibold">More Information</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isExpanded}
                      onChange={(e) => setIsExpanded(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Conditionally show Upload field */}
                {isExpanded && (
                  <>
                    
                    <Col span={24}>
                    <Field name="notes">
                        {({ field }) => (
                          <ReactQuill
                            {...field}
                            placeholder="Enter Notes"
                            className="mt-2"
                          />
                        )}
                      </Field>
                      <span className="text-sm text-gray-500">
                        **Private (not visible to the client)
                      </span>
                      <span className="flex gap-2 mt-4">
                  <div className="text-lg">
                    <Field type="checkbox" name="sendEmail" checked={values.sendEmail} />
                  </div>
                  <p>Send the client a payment receive email</p>
                </span>

                <span className="flex mt-2 items-center">
                  <h1 className="text-lg text-rose-400">*</h1>
                  <span className="ml-2 text-sm text-gray-600">Required</span>
                </span>

                    </Col>
                  </>
                )}
              </Col>

              {/* <Col span={24}>
                <div className="flex justify-between items-center">
                  <label className="font-semibold">More Information</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isExpanded}
                      onChange={(e) => setIsExpanded(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    <Form.Item name="notes" label="Notes**">
                      <Field name="notes">
                        {({ field }) => (
                          <ReactQuill
                            {...field}
                            placeholder="Enter Notes"
                            className="mt-2"
                          />
                        )}
                      </Field>
                      <span className="text-sm text-gray-500">
                        **Private (not visible to the client)
                      </span>
                    </Form.Item>
                  </div>
                )}

                <span className="flex gap-2 mt-4">
                  <div className="text-lg">
                    <Field type="checkbox" name="sendEmail" checked={values.sendEmail} />
                  </div>
                  <p>Send the client a payment receive email</p>
                </span>

                <span className="flex mt-2 items-center">
                  <h1 className="text-lg text-rose-400">*</h1>
                  <span className="ml-2 text-sm text-gray-600">Required</span>
                </span>
              </Col> */}

            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
              <Button type="primary" htmlType="submit">Create</Button>
            </div>
          </Form>
        )}
      </Formik>
      {/* <Form
        layout="vertical"
        form={form}
        name="add-job"
        onFinish={onFinish}
      >
        <Row gutter={16}>

          <Col span={24}>
            <Form.Item name="amount" label="Invoice ID" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
              <div className='flex'>
                <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>INV-</span>
                <Input type='number' className=' rounded-e-lg rounded-s-none' />
              </div>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
              <div className='flex'>
                <span className='border py-2 rounded-s-lg bg-[#f5f5f5] px-3'>$</span>
                <Input type='number' className=' rounded-e-lg rounded-s-none' />
              </div>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'ate is required.' }]}>
              <DatePicker style={{ width: '100%' }} placeholder='DD-MM-YYYY' format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="paymentmethod" label="Payment Method" rules={[{ required: true, message: 'Please select a Account.' }]}>
              <Select placeholder="Select Account">
                <Option value="all">All</Option>
                <Option value="branch1">Branch 1</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="transactioniD" label="Transaction ID" rules={[{ required: true, message: 'Please enter a Transaction ID.' }]}>
              <Input type='number' />
            </Form.Item>
          </Col>

          <Col span={24}>
          <div className="flex justify-between items-center">
            <label className="font-semibold">More Information</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isExpanded}
                onChange={(e) => setIsExpanded(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
                        </div>

                {isExpanded && (
                  <div className="mt-4">
                    <Form.Item name="notes" label="Notes**">
                      <ReactQuill placeholder="Enter Notes" className="mt-2" />
                      <span className="text-sm text-gray-500">
                        **Private (not visible to the client)
                      </span>
                    </Form.Item>
                  </div>
                )}

                <span className='flex gap-2 mt-4'>
                  <div className='text-lg'>
                  <input
                    type="checkbox"
                    defaultChecked
                    className=''
                  />
                  </div>
                  <p>Send the client a payment receive email</p>
                </span>

                <span className="flex mt-2 items-center">
                  <h1 className="text-lg text-rose-400">*</h1>
                  <span className="ml-2 text-sm text-gray-600">Required</span>
                </span>
          </Col>


        </Row>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </Form.Item>
      </Form> */}
    </div>
  );
};

export default AddPayment;



