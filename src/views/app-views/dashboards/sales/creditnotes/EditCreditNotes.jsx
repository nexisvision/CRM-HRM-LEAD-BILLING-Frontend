import React, { useState } from 'react';
import { Row, Col, Input, message, Button, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import userData from 'assets/data/user-list.data.json';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditCrediteNotes = () => {
    const navigate = useNavigate();

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Job added successfully!');
        navigate('/apps/sales/estimates/');
    };

    const initialValues = {
        amount: '',
        date: null,
        description: '',
    };

    const validationSchema = Yup.object({
        amount: Yup.string().min(1, "please enter minimum 1 amount").required('Please enter a amount.'),
        date: Yup.date().nullable().required('Date is required.'),
        description: Yup.string().required('Please enter a description.'),
    });

    return (
        <>
            <div>
                <div className='' >
                    <h2 className="mb-3 border-b pb-[5px] font-medium"></h2>
                        <div className="">
                            <div className="">
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
                                                        <label className='font-semibold'>Amount</label>
                                                        <Field name="amount" as={Input} placeholder="Enter Amount" type="number" />
                                                        <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Issue Date</label>
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

                                            <div className="form-buttons text-right mt-4">
                                                <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                                                <Button type="primary" htmlType="submit">Update</Button>
                                            </div>

                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                   
                </div>
            </div>
        </>
    );
};

export default EditCrediteNotes;



