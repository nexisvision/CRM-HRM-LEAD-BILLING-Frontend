import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddDebitBill = () => {
    const navigate = useNavigate();

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Job added successfully!');
        navigate('/apps/sales/billing/');
    };

    const initialValues = {
        date: null,
        amount: '',
        description: '',
    };

    const validationSchema = Yup.object({
        date: Yup.date().nullable().required('Date is required.'),
        amount: Yup.number().min(1, 'Please enter amount.').required('Please enter amount.'),
        description: Yup.string().required('Please enter a description.'),
    });

    return (
        <>
            <div>
                <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                   
                        <div className="">
                            <div className=" p-2">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={onSubmit}
                                >
                                    {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                                        <Form className="formik-form " onSubmit={handleSubmit}>
                                            <Row gutter={16}>
                                            

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

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Amount</label>
                                                        <Field name="amount" as={Input} placeholder="Enter Amount" />
                                                        <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={24} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className="font-semibold">Description</label>
                                                        <Field name="description">
                                                            {({ field }) => (
                                                                <ReactQuill
                                                                    {...field}
                                                                    placeholder='Enter Description'
                                                                    value={values.description}
                                                                    onChange={(value) => setFieldValue('description', value)}
                                                                    onBlur={() => setFieldTouched("description", true)}
                                                                />
                                                            )}
                                                        </Field>
                                                        <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                              
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                   

                    <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/dashboards/sales/billing')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddDebitBill;
