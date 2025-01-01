import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Upload, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, CloudUploadOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import OrderListData from 'assets/data/order-list.data.json';
import Flex from 'components/shared-components/Flex'
import utils from 'utils';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import dayjs from 'dayjs';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddMilestone = () => {


    const navigate = useNavigate();

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Milestone added successfully!');
        navigate('/app/dashboards/project/milestone');
    };

    const initialValues = {
        milestoneTitle: '',
        milestoneCost: '',
        status: '',
        addCostToProjectBudget: '',
        milestoneSummary: '',
        startDate: null,
        endDate: null,
    };

    const validationSchema = Yup.object({
        milestoneTitle: Yup.string().required('Please enter milestone title.'),
        milestoneCost: Yup.string().required('Please enter milestone cost.'),
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
                                                <Col span={12}>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Milestone Title </label>
                                                        <div className='flex'>
                                                            <Field name="milestoneTitle" as={Input} placeholder="Enter Milestone Title" onBlur={() => setFieldTouched("milestoneTitle", true)} className=' rounded-e-lg rounded-s-none' />
                                                        </div>
                                                        <ErrorMessage name="milestoneTitle" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Milestone Cost </label>
                                                        <div className='flex'>
                                                            <Field name="milestoneCost" as={Input} placeholder="Enter Milestone Cost" onBlur={() => setFieldTouched("milestoneCost", true)} className=' rounded-e-lg rounded-s-none' />
                                                        </div>
                                                        <ErrorMessage name="milestoneCost" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Status</label>
                                                        <Field name="currency">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
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
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Add Cost To Project Budget</label>
                                                        <Field name="addCostToProjectBudget">
                                                            {({ field }) => (
                                                                <Select
                                                                    {...field}
                                                                    className="w-full"
                                                                    placeholder="Select Status"
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
                                                <Col span={24} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Milestone Summary</label>
                                                        <ReactQuill
                                                            value={values.milestoneSummary}
                                                            onChange={(value) => setFieldValue('milestoneSummary', value)}
                                                            placeholder="Enter Milestone Summary"
                                                        />
                                                        <ErrorMessage name="milestoneSummary" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Start Date</label>
                                                        <DatePicker
                                                            className="w-full"
                                                            format="DD-MM-YYYY"
                                                            value={values.startDate}
                                                            onChange={(startDate) => setFieldValue('startDate', startDate)}
                                                            onBlur={() => setFieldTouched("startDate", true)}
                                                        />
                                                        <ErrorMessage name="startDate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>End Date</label>
                                                        <DatePicker
                                                            className="w-full"
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
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/milestone')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMilestone;

