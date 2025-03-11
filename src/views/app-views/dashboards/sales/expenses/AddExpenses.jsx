import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddExpenses = () => {
    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);

    const initialValues = {
        client: '',
        user: '',
        project: '',
        amount: '',
        status: '',
        date: null,
        description: '',
    };

    const validationSchema = Yup.object({
        client: Yup.string().required('Please enter client name.'),
        user: Yup.string().required('Please enter a user name.'),
        project: Yup.string().required('Please enter project name.'),
        amount: Yup.number().required('Please enter amount.').min(1, "Minimum value is 1."),
        status: Yup.string().required('Please select a status.'),
        date: Yup.date().nullable().required('Date is required.'),
        description: Yup.string().required('Please enter a description.'),
    });

    const onSubmit = (values, { resetForm }) => {
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/apps/sales/expenses');
    };

    return (
        <div className="add-expenses-form">
            
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit,setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>Client</label>
                                    <Field name="client" as={Input} placeholder="Enter Client Name" />
                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>User</label>
                                    <Field name="user" as={Input} placeholder="Enter User Name" />
                                    <ErrorMessage name="user" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project" as={Input} placeholder="Enter Project Name" />
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Amount</label>
                                    <Field name="amount" type='number' as={Input} placeholder="Enter Amount" />
                                    <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Status</label>
                                    <Field name="status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Status"
                                                onChange={(value) => setFieldValue('status', value)}
                                                value={values.status}
                                                onBlur={() => setFieldTouched("status", true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Date</label>
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

                            <Col span={24} className='mt-2'>
                                <div className="form-item flex justify-between">
                                    <label className='font-semibold'>Add Receipt</label>
                                    <Switch
                                        checked={showReceiptUpload}
                                        onChange={(checked) => setShowReceiptUpload(checked)}
                                    />
                                </div>
                            </Col>

                            {showReceiptUpload && (
                                <Col span={12} className='mt-4'>
                                     <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Receipt</Button>
                            </Upload>
                                    {/* <Button
                                        type="dashed"
                                        icon={<UploadOutlined />}
                                        onClick={() => setShowReceiptUpload(false)}
                                    >
                                        Upload Receipt
                                    </Button> */}
                                </Col>
                            )}
                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                        {/* <Modal
                            title="Upload Receipt"
                            visible={uploadModalVisible}
                            onCancel={() => setUploadModalVisible(false)}
                            footer={null}
                        >
                            <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Modal> */}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddExpenses;

