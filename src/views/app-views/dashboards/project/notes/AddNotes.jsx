import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddNotes = () => {
    const [notetype, setNoteType] = useState('public');
  const [employees, setEmployees] = useState([]);

  const handleNoteTypeChange = (type) => {
    setNoteType(type);

    // Fetch employees based on note type (if applicable)
    if (type === 'private') {
      // Replace with your actual API call or data fetching logic
      fetch('/api/employees') 
        .then(response => response.json())
        .then(data => setEmployees(data));
    } else {
      setEmployees([]);
    }
  };
    const navigate = useNavigate();
    const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
    const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const initialValues = {
        notetitle: '',
        notetype: '',
        description: '',
    };

    const validationSchema = Yup.object({
        notetitle: Yup.string().required('Please enter NoteTitle.'),
        notetype: Yup.string().required('Please enter NoteType.'),
        description: Yup.string().required('Please enter Description.'),
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
                            <Col span={12} >
                                <div className="form-item">
                                    <label className='font-semibold'>Note Title</label>
                                    <Field name="notetitle" as={Input} placeholder="Enter NoteTitle" className='mt-2' />
                                    <ErrorMessage name="notetitle" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item ">
                                    <label className='font-semibold'>Note Type</label>
                                    <div className="flex items-center">
                                        <div className="flex items-center mr-4 mt-2">
                                            <input
                                                type="radio"
                                                name="notetype"
                                                id="public"
                                                value="public"
                                                checked={notetype === 'public'}
                                                onChange={() => handleNoteTypeChange('public')}
                                                className="mr-2"
                                            />
                                            <label htmlFor="public" className="text-gray-700">Public</label>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <input
                                                type="radio"
                                                name="notetype"
                                                id="private"
                                                value="private"
                                                checked={notetype === 'private'}
                                                onChange={() => handleNoteTypeChange('private')}
                                                className="mr-2"
                                            />
                                            <label htmlFor="private" className="text-gray-700">Private</label>
                                        </div>
                                    </div>
                                </div>
                            </Col> 
                            <Col span={24}>
                                        {notetype === 'private' && (
                                            <div className="mt-4">
                                              <label className='font-semibold'>Employees</label>
                                              <Field name="employees">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full mt-2"
                                                mode="multiple"
                                                placeholder="Select Employees"
                                                onChange={(value) => setFieldValue('employees', value)}
                                                value={values.employees}
                                                onBlur={() => setFieldTouched("employees", true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="employees" component="div" className="error-message text-red-500 my-1" />
                                                <ul>
                                                    {employees.map((employee) => (                                                        
                                                       <li key={employee.id}>{employee.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                            </Col>
                            
                            
            
                            <Col span={24} className='mt-5 '>
                                <div className="form-item">
                                    <label className='font-semibold'>Description</label>
                                    <ReactQuill
                                        name="description"
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        placeholder="Enter Description"
                                        onBlur={() => setFieldTouched("description", true)}
                                    />
                                    <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>


                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddNotes;

