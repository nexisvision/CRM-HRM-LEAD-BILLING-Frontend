import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Title from 'antd/es/skeleton/Title';

const { Option } = Select;

const EditTask = () => {
    const navigate = useNavigate();
    const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
    const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const initialValues = {
        Title: '',
        TaskCategory: '',
        Project: '',
        StartDate: '',
        dueDate: '',
        AssignTo: [],
        description: '',
    };

    const validationSchema = Yup.object({
        Title: Yup.string().required('Please enter Title.'),
        TaskCategory: Yup.string().required('Please enter TaskCategory.'),
        Project: Yup.string().required('Please enter Project.'),
        StartDate: Yup.date().nullable().required('Date is required.'),
        dueDate: Yup.date().nullable().required('Date is required.'),
        AssignTo: Yup.array().min(1, 'Please select at least one AssignTo.'),
        description: Yup.string().required('Please enter a Description.'),

    });

    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/apps/sales/expenses');
    };


    const handleCheckboxChange = () => {
        setIsWithoutDueDate(!isWithoutDueDate);
    };

    const toggleOtherDetails = () => {
        setIsOtherDetailsVisible(!isOtherDetailsVisible);
    };

    return (
        <div className="add-expenses-form">
            <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
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
                                    <label className='font-semibold'>Title</label>
                                    <Field name="Title" as={Input} placeholder="Enter Title" />
                                    <ErrorMessage name="Title" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>TaskCategory</label>
                                    <Field name="TaskCategory">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select TaskCategory"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('TaskCategory', value)}
                                                value={values.TaskCategory}
                                                onBlur={() => setFieldTouched('TaskCategory', true)}
                                                allowClear={false}
                                            >
                                                <Option value="TaskCategory">TaskCategory</Option>
                                                <Option value="TaskCategory">TaskCategory</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="TaskCategory" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24}>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="Project" as={Input} placeholder="Enter Project" />
                                    <ErrorMessage name="Project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8}  >
                                <div className="form-item">
                                    <label className='font-semibold '>StartDate</label>
                                    <DatePicker
                                        name="StartDate"
                                        className='w-full '
                                        placeholder="Select StartDate"
                                        onChange={(value) => setFieldValue('StartDate', value)}
                                        value={values.StartDate}
                                        onBlur={() => setFieldTouched('StartDate', true)}
                                    />
                                    <ErrorMessage name="StartDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8}  >
                                <div className="form-item">
                                    <label className='font-semibold '>DueDate</label>
                                    <DatePicker
                                        name="dueDate"
                                        className='w-full '
                                        placeholder="Select DueDate"
                                        onChange={(value) => setFieldValue('dueDate', value)}
                                        value={values.dueDate}
                                        onBlur={() => setFieldTouched('dueDate', true)}
                                    />
                                    <ErrorMessage name="dueDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>AssignTo</label>
                                    <Field name="AssignTo">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode='multiple'
                                                placeholder="Select AssignTo"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('AssignTo', value)}
                                                value={values.AssignTo}
                                                onBlur={() => setFieldTouched('AssignTo', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="AssignTo"
                                        component="div"
                                        className="error-message text-red-500 my-1" />
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






                            <div className="mt-4">
                                <button
                                    className="text-gray-700 font-semibold flex items-center text-xl"
                                    onClick={toggleOtherDetails}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 mr-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Other Details
                                </button>

                                {isOtherDetailsVisible && (
                                    <div className="mt-4">
                                        <div className=" grid grid-cols-3 gap-4">
                                            <Col span={24}>
                                                <div className="form-item">
                                                    <label className='font-semibold'>Label</label>
                                                    <Field name="Label">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                placeholder="Select Label"
                                                                className="w-full"
                                                                onChange={(value) => setFieldValue('Label', value)}
                                                                value={values.Label}
                                                                onBlur={() => setFieldTouched('Label', true)}
                                                                allowClear={false}
                                                            >
                                                                <Option value="Label">Label</Option>
                                                                <Option value="Label">Label</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="Label" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>

                                            <Col span={24}>
                                                <div className="form-item">
                                                    <label className='font-semibold'>Milestones</label>
                                                    <Field name="Milestones">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                placeholder="Select Milestones"
                                                                className="w-full"
                                                                onChange={(value) => setFieldValue('Milestones', value)}
                                                                value={values.Milestones}
                                                                onBlur={() => setFieldTouched('Milestones', true)}
                                                                allowClear={false}
                                                            >
                                                                <Option value="Milestones">Milestones</Option>
                                                                <Option value="Milestones">Milestones</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="Milestones" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>

                                            <Col span={24}>
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
                                                                <Option value="Incomplete">Incomplete</Option>
                                                                <Option value="To Do">To Do</Option>
                                                                <Option value="In Progress">Doing</Option>
                                                                <Option value="Completed">Completed</Option>
                                                                <Option value="On Hold">Waiting Approval</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="Status" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>

                                            <Col span={24}>
                                                <div className="form-item">
                                                    <label className='font-semibold'>Priority</label>
                                                    <Field name="Priority">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                placeholder="Select Priority"
                                                                className="w-full"
                                                                onChange={(value) => setFieldValue('Priority', value)}
                                                                value={values.Priority}
                                                                onBlur={() => setFieldTouched('Priority', true)}
                                                                allowClear={false}
                                                            >
                                                                <Option value="High">High</Option>
                                                                <Option value="Medium">Medium</Option>
                                                                <Option value="Low">Low</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="Priority" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            

                                                <div className="mt-6 ">
                                                    <span className="block font-semibold text-gray-700 mb-2">Add File</span>
                                                    <Upload
                                                        action="http://localhost:5500/api/users/upload-cv"
                                                        listType="picture"
                                                        accept=".pdf"
                                                        maxCount={1}
                                                        showUploadList={{ showRemoveIcon: true }}
                                                        className="border-2 flex justify-center items-center p-10 w-[100%] border-gray-300 rounded-md"
                                                    >
                                                        <span className="text-xl text-blue-500">Choose File</span>
                                                    </Upload>
                                                </div>
                                            </Col>
                                            
                                        </div>
                                    </div>
                                )}
                            </div>
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

export default EditTask;