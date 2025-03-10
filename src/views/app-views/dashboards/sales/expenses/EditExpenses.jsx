import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditExpenses = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming you use a dynamic route like '/expenses/edit/:id'
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);

    const [initialValues, setInitialValues] = useState({
        date: null,
        description: '',
        client: '',
        user: '',
        project: '',
        amount: '',
        status: '',
    });

    useEffect(() => {
        const fetchExpenseData = async () => {
            const expenseData = {
                date: '2024-01-01',
                description: '<p>Sample description</p>',
                client: 'John Doe',
                user: 'Jane Smith',
                project: 'Project Alpha',
                amount: 5000,
                status: 'xyz',
            };

            setInitialValues({
                ...expenseData,
                date: expenseData.date ? moment(expenseData.date, 'YYYY-MM-DD') : null,
            });

            setShowReceiptUpload(!!expenseData.receipt);
        };

        fetchExpenseData();
    }, [id]);

    const validationSchema = Yup.object({
        date: Yup.date().nullable().required('Date is required.'),
        description: Yup.string().required('Please enter a description.'),
        client: Yup.string().required('Please enter client name.'),
        user: Yup.string().required('Please enter a user name.'),
        project: Yup.string().required('Please enter project name.'),
        amount: Yup.number().required('Please enter amount.').min(1, 'Minimum value is 1.'),
        status: Yup.string().required('Please select a status.'),
    });

    const onSubmit = (values, { resetForm }) => {
        resetForm();
        navigate('/apps/sales/expenses');
    };

    return (
        <div className="edit-expenses-form">

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Date</label>
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

                            <Col span={24} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Description</label>
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        onBlur={() => setFieldTouched("description", true)}
                                        placeholder="Enter Description"
                                    />
                                    <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className="font-semibold">Client</label>
                                    <Field name="client" as={Input} placeholder="Enter Client Name" />
                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className="font-semibold">User</label>
                                    <Field name="user" as={Input} placeholder="Enter User Name" />
                                    <ErrorMessage name="user" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Project</label>
                                    <Field name="project" as={Input} placeholder="Enter Project Name" />
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Amount</label>
                                    <Field name="amount" type="number" as={Input} placeholder="Enter Amount" />
                                    <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className="mt-2">
                                <div className="form-item">
                                    <label className="font-semibold">Status</label>
                                    <Select
                                        className="w-full"
                                        placeholder="Select Status"
                                        value={values.status}
                                        onChange={(value) => setFieldValue('status', value)}
                                        onBlur={() => setFieldTouched("status", true)}
                                    >
                                        <Option value="xyz">XYZ</Option>
                                        <Option value="abc">ABC</Option>
                                    </Select>
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className="mt-2">
                                <div className="form-item flex justify-between">
                                    <label className="font-semibold">Add Receipt</label>
                                    <Switch
                                        checked={showReceiptUpload}
                                        onChange={(checked) => setShowReceiptUpload(checked)}
                                    />
                                </div>
                            </Col>

                            {showReceiptUpload && (
                                <Col span={12} className="mt-4">
                                    <Upload beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />}>Upload Receipt</Button>
                                    </Upload>
                                </Col>
                            )}
                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Update</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditExpenses;

