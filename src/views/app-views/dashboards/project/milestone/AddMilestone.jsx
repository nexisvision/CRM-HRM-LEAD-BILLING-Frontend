import React, { useState, useEffect } from 'react';
import { Row, Col, Input, message, Button, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
const { Option } = Select;

const AddMilestone = ({ onClose }) => {


    const navigate = useNavigate();
    const { currencies } = useSelector((state) => state.currencies);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);



    // const onSubmit = (values, { setSubmitting }) => {
    //     try {
    //         // Add your API call here
    //         console.log('Submitted values:', values);

    //         message.success('Milestone added successfully!');
    //         onClose(); // Close the modal after successful submission
    //     } catch (error) {
    //         message.error('Failed to add milestone');
    //         console.error('Error:', error);
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Milestone added successfully!');
        onClose();
        navigate('/app/dashboards/project/list');
    };

    const initialValues = {
        milestoneTitle: '',
        milestoneCost: '',
        currency: '',
        status: '',
        addCostToProjectBudget: '',
        milestoneSummary: '',
        startDate: null,
        endDate: null,
        paymentReceived: false,
        paymentGateway: '',
        transactionId: '',
    };

    const validationSchema = Yup.object({
        milestoneTitle: Yup.string().required('Please enter milestone title.'),
        milestoneCost: Yup.string().required('Please enter milestone cost.'),
        currency: Yup.string().required('Please select currency.'),
        status: Yup.string().required('Please select status.'),
        addCostToProjectBudget: Yup.string().required('Please select add cost to project budget.'),
        milestoneSummary: Yup.string().required('Please enter milestone summary.'),
        startDate: Yup.date().nullable().required('Start Date is required.'),
        endDate: Yup.date().nullable().required('End Date is required.'),

    });


    return (
        <>
            <div>
                <div className=' ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
                    <h2 className=" border-b pb-[30px] font-medium"></h2>

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
                                            <Col span={12} className="mt-4">
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Milestone Title </label>
                                                    <div className='flex'>
                                                        <Field name="milestoneTitle" as={Input} placeholder="Enter Milestone Title" onBlur={() => setFieldTouched("milestoneTitle", true)} className=' rounded-e-lg rounded-s-none mt-2' />
                                                    </div>
                                                    <ErrorMessage name="milestoneTitle" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                            <Col span={12} className="mt-4">
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Milestone Cost </label>
                                                    <div className='flex'>
                                                        <Field name="milestoneCost" as={Input} placeholder="Enter Milestone Cost" onBlur={() => setFieldTouched("milestoneCost", true)} className=' rounded-e-lg rounded-s-none mt-2' />
                                                    </div>
                                                    <ErrorMessage name="milestoneCost" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>

                                            <Col span={12} className="mt-4">
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Currency</label>
                                                    <div className="flex gap-2">
                                                        <Field name="currency">
                                                            {({ field, form }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full mt-2"
                                                                    placeholder="Select Currency"
                                                                    onChange={(value) => {
                                                                        const selectedCurrency = currencies.find(c => c.id === value);
                                                                        form.setFieldValue("currency", selectedCurrency?.currencyCode || '');
                                                                    }}
                                                                >
                                                                    {currencies?.map((currency) => (
                                                                        <Option
                                                                            key={currency.id}
                                                                            value={currency.id}
                                                                        >
                                                                            {currency.currencyCode}
                                                                        </Option>
                                                                    ))}
                                                                </Select>
                                                            )}
                                                        </Field>
                                                    </div>
                                                    <ErrorMessage
                                                        name="currency"
                                                        component="div"
                                                        className="error-message text-red-500 my-1"
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={12} className='mt-4'>
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Status</label>
                                                    <Field name="status">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full mt-2"
                                                                placeholder="Select Status"
                                                                onChange={(value) => setFieldValue('status', value)}
                                                                value={values.status}
                                                                onBlur={() => setFieldTouched("status", true)}
                                                            >
                                                                <Option value="active">Active</Option>
                                                                <Option value="inactive">Inactive</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                            <Col span={12} className='mt-4'>
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Add Cost To Project Budget</label>
                                                    <Field name="addCostToProjectBudget">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full mt-2"
                                                                placeholder="Select Add Cost To Project Budget"
                                                                onChange={(value) => setFieldValue('addCostToProjectBudget', value)}
                                                                value={values.addCostToProjectBudget}
                                                                onBlur={() => setFieldTouched("addCostToProjectBudget", true)}
                                                            >
                                                                <Option value="no">No</Option>
                                                                <Option value="yes">Yes</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="addCostToProjectBudget" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                            <Col span={24} className='mt-4'>
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Milestone Summary</label>
                                                    <ReactQuill
                                                        value={values.milestoneSummary}
                                                        onChange={(value) => setFieldValue('milestoneSummary', value)}
                                                        placeholder="Enter Milestone Summary"
                                                        className='mt-2'
                                                    />
                                                    <ErrorMessage name="milestoneSummary" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>

                                            <Col span={12} className='mt-4'>
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>Start Date</label>
                                                    <DatePicker
                                                        className="w-full mt-2"
                                                        format="DD-MM-YYYY"
                                                        value={values.startDate}
                                                        onChange={(startDate) => setFieldValue('startDate', startDate)}
                                                        onBlur={() => setFieldTouched("startDate", true)}
                                                    />
                                                    <ErrorMessage name="startDate" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                            <Col span={12} className='mt-4'>
                                                <div className="form-item">
                                                    <label className='font-semibold mb-2'>End Date</label>
                                                    <DatePicker
                                                        className="w-full mt-2"
                                                        format="DD-MM-YYYY"
                                                        value={values.endDate}
                                                        onChange={(endDate) => setFieldValue('endDate', endDate)}
                                                        onBlur={() => setFieldTouched("endDate", true)}
                                                    />
                                                    <ErrorMessage name="endDate" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>


                    <div className="form-buttons text-right py-2">
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMilestone;

