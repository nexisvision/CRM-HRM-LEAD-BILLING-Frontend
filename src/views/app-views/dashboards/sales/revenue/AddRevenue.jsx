import React from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';

const { Option } = Select;

const AddRevenue = () => {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Job added successfully!');
    navigate('/app/hrm/jobs');
  };


  const initialValues = {
    date: null,
    amount: '',
    account: '',
    customer: '',
    description: '',
    category: '',
    reference:'',
    paymentreceipt: '',
  };

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required('Date is required.'),
    amount: Yup.string().required('Please enter a amount.'),
    account: Yup.string().required('Please select account.'),
    customer: Yup.string().required('Please select customer.'),
    description: Yup.string().required('Please enter description.'),
    category: Yup.string().required('Please select customer.'),
    reference: Yup.string().required('Please enter description.'),
    paymentreceipt: Yup.string().required('Please enter a paymentreceipt.'),
  });

  return (
    <div className="add-job-form">
      <h2 className="mb-4 border-b pb-[5px] font-medium"></h2>
      {/* <h2 className="mb-4">Create New Revenue</h2> */}
      <div className="">
        <div className=" p-2">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
              <Form className="formik-form" onSubmit={handleSubmit}>
                <Row gutter={16}>
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
                      <label className='font-semibold'>Amount</label>
                      <Field name="amount" as={Input} placeholder="Enter Amount" onBlur={() => setFieldTouched("amount", true)}/>
                      <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={12} className='mt-2'>
                    <div className="form-item">
                      <label className='font-semibold'>Account</label>
                      <Field name="account">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select Account"
                            onChange={(value) => setFieldValue('account', value)}
                            value={values.account}
                            onBlur={() => setFieldTouched("account", true)}
                          >
                            <Option value="xyz">XYZ</Option>
                            <Option value="abc">ABC</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="account" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={12} className='mt-2'>
                    <div className="form-item">
                      <label className='font-semibold'>Customer</label>
                      <Field name="customer">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select customer"
                            onChange={(value) => setFieldValue('customer', value)}
                            value={values.category}
                            onBlur={() => setFieldTouched("customer", true)}
                          >
                            <Option value="xyz">XYZ</Option>
                            <Option value="abc">ABC</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="customer" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={24} className='mt-2'>
                    <div className="form-item">
                      <label className="font-semibold">Description</label>
                      <Field name="description">
                        {({ field }) => (
                          <ReactQuill
                            {...field}
                            value={values.notes}
                            onChange={(value) => setFieldValue('description', value)}
                            onBlur={() => setFieldTouched("description", true)}
                          />
                        )}
                      </Field>
                      <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={12} className='mt-2'>
                    <div className="form-item">
                      <label className='font-semibold'>Category</label>
                      <Field name="category">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="w-full"
                            placeholder="Select Category"
                            onChange={(value) => setFieldValue('category', value)}
                            value={values.category}
                            onBlur={() => setFieldTouched("category", true)}
                          >
                            <Option value="xyz">XYZ</Option>
                            <Option value="abc">ABC</Option>
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="form-item">
                      <label className="font-semibold">Reference</label>
                      <Field name="reference" as={Input} placeholder="Enter Reference" type='number' />
                      <ErrorMessage name="reference" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
                  <Col span={12} className='mt-2'>
                    <div className="form-item">
                      <label className="font-semibold">Payment Receipt</label>
                      <Field name="paymentreceipt" type='file' as={Input} placeholder="Enter payment receipt" />
                      <ErrorMessage name="paymentreceipt" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>


                </Row>

                <div className="form-buttons text-right mt-4">
                  <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Create</Button>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* <Form
        layout="vertical"
        form={form}
        name="add-job"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          

          <Col span={12}>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'date is required.' }]}>
              <DatePicker style={{ width: '100%' }} placeholder='DD-MM-YYYY' format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
              <Input type='number' placeholder="Enter Amount" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="account" label="Account" rules={[{ required: true, message: 'Please select a Account.' }]}>
              <Select placeholder="Select Account">
                <Option value="all">All</Option>
                <Option value="branch1">Branch 1</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="customer" label="Customer" rules={[{ required: true, message: 'Please enter Customer Name.' }]}>
            <Select placeholder="--">
                <Option value="xyz">xyz</Option>
                <Option value="abc">abc</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Description">
              <ReactQuill placeholder="Enter Description" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter Category.' }]}>
            <Select placeholder="--">
                <Option value="xyz">Income</Option>
                <Option value="abc">Sales</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="reference" label="Reference" rules={[{ required: true, message: 'Please enter a Reference.' }]}>
              <Input type='number' placeholder="Enter Reference" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="paymentreceipt" label="Payment Receipt" rules={[{ required: true, message: 'Please enter a Reference.' }]}>
              <Input type='file'/>
            </Form.Item>
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

export default AddRevenue;



