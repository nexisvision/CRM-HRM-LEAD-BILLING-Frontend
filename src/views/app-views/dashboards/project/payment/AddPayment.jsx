import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { CloudUploadOutlined,QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const { Option } = Select;
const AddPayment = () => {
    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        project: '',
        invoice: '',
        paidon: '',
        amount: '',
        currency: '',
        exchangeRate: '',
        transactionId: '',
        paymentGateway: '',
        bankAccount: '',
        receipt: '',
        remark: '',
    };
    const validationSchema = Yup.object({
        project: Yup.string().required('Please enter Project.'),
        invoice: Yup.string().required('Please enter Invoice.'),
        paidon: Yup.string().required('Please enter Paid On.'),
        amount: Yup.string().required('Please enter Amount.'),
        currency: Yup.string().required('Please enter Currency.'),
        exchangeRate: Yup.string().required('Please enter Exchange Rate.'),
        transactionId: Yup.string().required('Please enter Transaction Id.'),
        paymentGateway: Yup.string().required('Please enter Payment Gateway.'),
        bankAccount: Yup.string().required('Please enter Bank Account.'),
        receipt: Yup.string().required('Please enter Receipt.'),
        remark: Yup.string().required('Please enter Remark.'),
    });
    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Payment added successfully!');
        resetForm();
        navigate('/app/dashboards/project/list');
    };
    return (
        <div className="add-expenses-form">
            <hr style={{ marginBottom: '20px', border: '1px solid #E8E8E8' }} />
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
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project" as={Input} placeholder="Enter Project" />
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>Invoice</label>
                                    <Field name="invoice">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Invoice"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('invoice', value)}
                                                value={values.invoice}
                                                onBlur={() => setFieldTouched('invoice', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="invoice" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>Paid On</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.paidon}
                                        onChange={(date) => setFieldValue('paidon', date)}
                                        onBlur={() => setFieldTouched("paidon", true)}
                                    />
                                    <ErrorMessage name="paidon" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="form-item">
                                    <label className='font-semibold'>Amount </label>
                                    <Field name="amount" as={Input} placeholder="Enter Amount" />
                                    <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Currency</label>
                                    <Field name="currency">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Currency"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('currency', value)}
                                                value={values.currency}
                                                onBlur={() => setFieldTouched('currency', true)}
                                                allowClear={false}
                                            >
                                                <Option value="INR">INR</Option>
                                                <Option value="USD">USD</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="currency" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="form-item">
                                    <label className='font-semibold'>Exchange Rate  </label>
                                    <Field name="exchangeRate" as={Input} placeholder="Enter Exchange Rate" />
                                    <ErrorMessage name="exchangeRate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>Transaction Id</label>
                                    <Field name="transactionId" type='number' as={Input} placeholder="Enter Transaction Id" />
                                    <ErrorMessage name="transactionId" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Payment Gateway</label>
                                    <Field name="paymentGateway">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Payment Gateway"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('paymentGateway', value)}
                                                value={values.paymentGateway}
                                                onBlur={() => setFieldTouched('paymentGateway', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="paymentGateway" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={6} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Bank Account</label>
                                    <Field name="bankAccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Bank Account"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('bankAccount', value)}
                                                value={values.bankAccount}
                                                onBlur={() => setFieldTouched('bankAccount', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="bankAccount" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <div className='mt-4 w-full'>
                                <span className='block  font-semibold p-2'>Receipt <QuestionCircleOutlined /></span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10 '
                                    >
                                        <CloudUploadOutlined className='text-4xl' />
                                        <span className='text-xl'>Choose File</span>
                                    </Upload>
                                </Col>
                            </div>
                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Remark</label>
                                    <ReactQuill
                                        value={values.remark}
                                        onChange={(value) => setFieldValue('remark', value)}
                                        placeholder="Enter Remark"
                                        onBlur={() => setFieldTouched("remark", true)}
                                    />
                                    <ErrorMessage name="remark" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default AddPayment;