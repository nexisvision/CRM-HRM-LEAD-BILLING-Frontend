import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddProjectReport = () => {
    const navigate = useNavigate();

    const initialValues = {
        subject: '',
        client: '',
        Projects: '',
        contractValue: '',
        startdate: null,
        enddate: null,
        skills: '',
        jobDescription: '',
    };

    const validationSchema = Yup.object({
      subject: Yup.string().required('Please enter a Subject Name.'),
      client: Yup.string().required('Please select Client.'),
      projects: Yup.mixed().required('Please select Projects.'),
      contractValue: Yup.number().required('Please enter Contract Value .').positive('Contract Value must be positive.'),
      startdate: Yup.date().nullable().required('Start date is required.'),
      enddate: Yup.date().nullable().required('End date is required.'),
      skills: Yup.string().required('Please enter a Skills.'),
      jobDescription: Yup.string().required('Please enter a Job Description.'),
    });


    const onSubmit = (values) => {
        message.success('Project added successfully!');
        navigate('/app/apps/project');
    };

    return (
        <div className="add-job-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, handleChange, }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <h2 className="mb-4 border-b pb-2 font-medium"></h2>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>Subject</label>
                                    <Field name="subject" as={Input} placeholder="Enter Subject Name" rules={[{ required: true }]} />
                                    <ErrorMessage name="subject" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} >
                                <div className="form-item">
                                    <label className='font-semibold'>Client</label>
                                    <Field name="client">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Client"
                                                onChange={(value) => setFieldValue('client', value)}
                                                value={values.client}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>

                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Projects</label>
                                    <Field name="projects">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Projects"
                                                onChange={(value) => setFieldValue('projects', value)}
                                                value={values.projects}
                                            >
                                                <Option value="Projects1">Projects1</Option>
                                                <Option value="Projects2">Projects2</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Contract Value</label>
                                    <Field name="contractValue" as={Input} placeholder="Enter Contract Value " type='number' />
                                    <ErrorMessage name="contractValue" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Start Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.startdate}
                                        onChange={(date) => setFieldValue('startdate', date)}
                                    />
                                    <ErrorMessage name="startdate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>End Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.enddate}
                                        onChange={(date) => setFieldValue('enddate', date)}
                                    />
                                    <ErrorMessage name="enddate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>                            

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Skills</label>
                                    <Field name="skills" as={Input}  placeholder="Enter Skills" />
                                    <ErrorMessage name="skills" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Job Description</label>
                                    <ReactQuill
                                        value={values.jobDescription}
                                        onChange={(value) => setFieldValue('jobDescription', value)}
                                        placeholder="Enter Job Description"
                                    />
                                    <ErrorMessage name="jobDescription" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/apps/project')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProjectReport;

