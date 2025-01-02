import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddTask = () => {
    const navigate = useNavigate();
    const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
    const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const initialValues = {
        taskName: '',
        taskCategory: '',
        project: '',
        startDate: null,
        dueDate: null,
        assignTo: [],
        description: '',
    };

    const validationSchema = Yup.object({
        taskName: Yup.string().required('Please enter TaskName.'),
        taskCategory: Yup.string().required('Please enter TaskCategory.'),
        project: Yup.string().required('Please enter Project.'),
        startDate: Yup.date().nullable().required('Date is required.'),
        dueDate: Yup.date().nullable().required('Date is required.'),
        assignTo: Yup.array().min(1, 'Please select at least one AssignTo.'),
        description: Yup.string().required('Please enter a Description.'),

    });

    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/app/dashboards/project/list');
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
                            <Col span={8} >
                                <div className="form-item">
                                    <label className='font-semibold'>Task Name</label>
                                    <Field name="taskName" as={Input} placeholder="Enter TaskName" className='mt-2' />
                                        <ErrorMessage name="taskName" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>Task Category</label>
                                    <Field name="taskCategory">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select TaskCategory"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('taskCategory', value)}
                                                value={values.taskCategory}
                                                onBlur={() => setFieldTouched('taskCategory', true)}
                                                allowClear={false}
                                            >
                                                <Option value="Task Category">Task Category</Option>
                                                <Option value="Task Category">Task Category</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="taskCategory" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project" as={Input} placeholder="Enter Project" className='mt-2' />
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className="mt-4">
                                <div className="form-item">
                                    <label className='font-semibold '>StartDate</label>
                                    <DatePicker
                                        name="startDate"
                                        className='w-full mt-2'
                                        placeholder="Select StartDate"
                                        onChange={(value) => setFieldValue('startDate', value)}
                                        value={values.startDate}
                                        onBlur={() => setFieldTouched('startDate', true)}
                                    />
                                    <ErrorMessage name="startDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-4' >
                                <div className="form-item">
                                    <label className='font-semibold '>DueDate</label>
                                    <DatePicker
                                        name="dueDate"
                                        className='w-full mt-2'
                                        placeholder="Select DueDate"
                                        onChange={(value) => setFieldValue('dueDate', value)}
                                        value={values.dueDate}
                                        onBlur={() => setFieldTouched('dueDate', true)}
                                    />
                                    <ErrorMessage name="dueDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>AssignTo</label>
                                    <Field name="AssignTo">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode='multiple' 
                                                placeholder="Select AssignTo"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('assignTo', value)}
                                                value={values.assignTo}
                                                onBlur={() => setFieldTouched('assignTo', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="assignTo"
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
                                    <div className="mt-6">
                                        <Row gutter={[16, 16]}>
                                            <Col span={9}>
                                                <div className="form-item">
                                                    <label className="font-semibold">Label</label>
                                                    <Field name="Label">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                placeholder="Nothing selected"
                                                                className="w-full mt-2"
                                                                onChange={(value) => setFieldValue('Label', value)}
                                                                value={values.Label}
                                                            >
                                                                <Option value="label1">Label 1</Option>
                                                                <Option value="label2">Label 2</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                </div>
                                            </Col>

                                            <Col span={9}>
                                                <div className="form-item">
                                                    <label className="font-semibold">Milestones</label>
                                                    <Field name="Milestones">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                placeholder="--"
                                                                className="w-full mt-2"
                                                                onChange={(value) => setFieldValue('Milestones', value)}
                                                                value={values.Milestones}
                                                            >
                                                                <Option value="milestone1">Milestone 1</Option>
                                                                <Option value="milestone2">Milestone 2</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                </div>
                                            </Col>

                                            <Col span={9}>
                                                <div className="form-item">
                                                    <label className="font-semibold mb-2">Status</label>
                                                    <Field name="Status">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full mt-2"
                                                                onChange={(value) => setFieldValue('Status', value)}
                                                                value={values.Status}
                                                            >
                                                                <Option value="Incomplete">
                                                                    <div className="flex items-center">
                                                                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                                                        Incomplete
                                                                    </div>
                                                                </Option>
                                                                <Option value="To Do">To Do</Option>
                                                                <Option value="In Progress">Doing</Option>
                                                                <Option value="Completed">Completed</Option>
                                                                <Option value="On Hold">Waiting Approval</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                </div>
                                            </Col>

                                            <Col span={10}>
                                                <div className="form-item">
                                                    <label className="font-semibold">Priority</label>
                                                    <Field name="Priority">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full mt-2"
                                                                onChange={(value) => setFieldValue('Priority', value)}
                                                                value={values.Priority}
                                                            >
                                                                <Option value="Medium">
                                                                    <div className="flex items-center">
                                                                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                                                        Medium
                                                                    </div>
                                                                </Option>
                                                                <Option value="High">High</Option>
                                                                <Option value="Low">Low</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                </div>
                                            </Col>

                                            <Col span={24}>
                                                <div className="mt-6 ">
                                                    <span className="block font-semibold text-gray-700 mb-2">Add File</span>
                                                    <Upload
                                                        action="http://localhost:5500/api/users/upload-cv"
                                                        listType="picture"
                                                        accept=".pdf"
                                                        maxCount={1}
                                                        showUploadList={{ showRemoveIcon: true }}
                                                        className="border-2 flex justify-center items-center p-10 w-full border-gray-300 rounded-md"
                                                    >
                                                        <span className="text-xl text-blue-500 cursor-pointer hover:text-blue-700 w-full">Choose File</span>
                                                    </Upload>
                                                </div>
                                            </Col>

                                        </Row>
                                    </div>
                                    // </div>
                                )}
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

export default AddTask;