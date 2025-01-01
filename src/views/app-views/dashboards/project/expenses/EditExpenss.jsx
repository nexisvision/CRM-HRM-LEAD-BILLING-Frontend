import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const { Option } = Select;
const EditExpenses = () => {
    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        ItemName: '',
        Currency: '',
        ExchangeRate: '',
        Price: '',
        PurchaseDate: '',
        Employee: '',
        Project: '',
        ExpenseCategory: '',
        PurchasedFrom: '',
        BankAccount: '',
        Description: '',
        Bill: "",
        Status: ""
    };
    const validationSchema = Yup.object({
        ItemName: Yup.string().required('Please enter ItemName.'),
        Currency: Yup.string().required('Please enter Currency.'),
        ExchangeRate: Yup.string().required('Please enter ExchangeRate.'),
        Price: Yup.string().required('Please enter Price.'),
        PurchaseDate: Yup.date().nullable().required('Date is required.'),
        Employee: Yup.string().required('Please enter Employee.'),
        Project: Yup.string().required('Please enter Project.'),
        ExpenseCategory: Yup.string().required('Please enter ExpenseCategory.'),
        PurchasedFrom: Yup.string().required('Please enter PurchasedFrom.'),
        BankAccount: Yup.string().required('Please enter BankAccount.'),
        Description: Yup.string().required('Please enter a Description.'),
        Bill: Yup.string().required('Please enter Bill.'),
        description: Yup.string().required('Please enter a description.'),
        Status: Yup.string().required('Please enter a Status.'),
    });
    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/apps/sales/expenses');
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
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>ItemName</label>
                                    <Field name="ItemName" as={Input} placeholder="Enter ItemName" />
                                    <ErrorMessage name="ItemName" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Currency</label>
                                    <Field name="Currency">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Currency"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('Currency', value)}
                                                value={values.Currency}
                                                onBlur={() => setFieldTouched('Currency', true)}
                                                allowClear={false}
                                            >
                                                <Option value="INR">INR</Option>
                                                <Option value="USD">USD</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="Currency" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            {/* <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>ExchangeRate</label>
                                    <Field name="ExchangeRate" as={Input} placeholder="Enter ExchangeRate" />
                                    <ErrorMessage name="ExchangeRate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col> */}
                            <Col span={8} >
                                <div className="form-item">
                                    <label className='font-semibold'>Price</label>
                                    <Field name="Price" type='number' as={Input} placeholder="Enter Price" />
                                    <ErrorMessage name="Price" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Employee</label>
                                    <Field name="AddExpenseEmployee">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select AddExpenseEmployee"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('AddExpenseEmployee', value)}
                                                value={values.AddExpenseEmployee}
                                                onBlur={() => setFieldTouched('AddExpenseEmployee', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="Employee" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="AddExpenseProject">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select AddExpenseProject"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('AddExpenseProject', value)}
                                                value={values.AddExpenseProject}
                                                onBlur={() => setFieldTouched('AddExpenseProject', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="Project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>PurchasedFrom</label>
                                    <Field name="PurchasedFrom" as={Input} placeholder="Enter PurchasedFrom" />
                                    <ErrorMessage name="PurchasedFrom" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Status</label>
                                    <Field name="Status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Status"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('Status', value)}
                                                value={values.Status}
                                                onBlur={() => setFieldTouched('Status', true)}
                                                allowClear={false}
                                            >
                                                <Option value="Pending">Pending</Option>
                                                <Option value="Approved">Approved</Option>
                                                <Option value="Rejected">Rejected</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="Status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Description</label>
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        placeholder="Enter Description"
                                        onBlur={() => setFieldTouched("description", true)}
                                    />
                                    <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <div className='mt-4 w-full'>
                                <span className='block  font-semibold p-2'>Bill</span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10 '
                                    >
                                        <span className='text-xl'>Choose File</span>
                                        {/* <CloudUploadOutlined className='text-4xl' /> */}
                                    </Upload>
                                </Col>
                            </div>
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default EditExpenses;