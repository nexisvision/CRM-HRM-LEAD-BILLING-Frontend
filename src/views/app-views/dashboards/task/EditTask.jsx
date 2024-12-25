import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditTask = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState(false);
    const [info, setInfo] = useState(false);
    const [option, setOption] = useState(false);

    const initialValues = {
        project: '',
        title: '',
        status: '',
        priority: '',
        assigneduser: '',
        assignedclient: '',
        description: '',
        imagequality: '',
        targetdevice:'',
        wordcount:'',
        imagecount:'',
        checkbox:'',
        comments:'',
        targetdate:null,
        tags:'',
        visible:'',
        billable:''
    };

    const validationSchema = Yup.object({
        project: Yup.string().required('Please Select Project.'),
        title: Yup.string().required('Please enter a Title.'),
        status: Yup.string().required('Please select status.'),
        priority: Yup.string().required('please select a Priority'),
        assigneduser: Yup.string(),
        assignedclient: Yup.string(),
        description: description ? Yup.string().required("Description are required") : Yup.string(),
        imagequality: info ? Yup.string().required("Please select Image Quality") : Yup.string(),
        targetdevice: info ? Yup.string().required("Target device are required") : Yup.date(),
        wordcount: info ? Yup.string().required("Word Count are required") : Yup.string(),
        imagecount: info ? Yup.string().required("Image Count are required") : Yup.string(),
        checkbox: info ? Yup.string().required("checkbox are required") : Yup.string(),
        comments: info ? Yup.string().required("Comments are required") : Yup.string(),
        targetdate: option ? Yup.date().nullable().required("Target Date are required") : Yup.date(),
        tags: option ? Yup.string().required("Tags are required") : Yup.string(),
        visible: option ? Yup.string().required("Visible are required") : Yup.string(),
        billable: option ? Yup.string().required("Billable are required") : Yup.string(),
    });


    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Project added successfully!');
        navigate('/app/apps/project');
    };
    // console.log("object",Option)

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
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Project"
                                                onChange={(value) => setFieldValue('project', value)}
                                                value={values.project}
                                            >
                                                <Option value="faithhamilton">Faith Hamilton</Option>
                                                <Option value="stevenmallet">Steven Mallet</Option>
                                                <Option value="edwincook">Edwin Cook</Option>
                                                <Option value="anniemilton">Annie Milton</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Title<h1 className='text-rose-500'>*</h1></label>
                                    <Field name="title" as={Input} placeholder="Enter Title Name" />
                                    <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Status <h1 className='text-rose-500'>*</h1></label>
                                    <Field name="status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Status"
                                                onChange={(value) => setFieldValue('status', value)}
                                                value={values.status}
                                            >
                                                <Option value="new">New</Option>
                                                <Option value="converted">Converted</Option>
                                                <Option value="qualified">Qualified</Option>
                                                <Option value="proposalsent">Proposal Sent</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold flex'>Priority <h1 className='text-rose-500'>*</h1></label>
                                    <Field name="priority">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Priority"
                                                onChange={(value) => setFieldValue('priority', value)}
                                                value={values.priority}
                                            >
                                                <Option value="new">New</Option>
                                                <Option value="converted">Converted</Option>
                                                <Option value="qualified">Qualified</Option>
                                                <Option value="proposalsent">Proposal Sent</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="priority" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                                            <div className="form-item">
                                                                <label className='font-semibold'>Assigned User <ExclamationCircleOutlined className='text-red-500' /></label>
                                                                <Field name="project">
                                                                    {({ field }) => (
                                                                        <Select
                                                                            {...field}
                                                                            className="w-full"
                                                                            placeholder="Select Assigned User "
                                                                            disabled={!values.title} 
                                                                            mode='multiple'
                                                                            onChange={(value) => setFieldValue('assigneduser', value)}
                                                                            value={values.assigneduser}
                                                                        >
                                                                            <Option value="stevenmallet">Steven Mallet</Option>
                                                                            <Option value="anniemilton">Annie Milton</Option>
                                                                        </Select>
                                                                    )}
                                                                </Field>
                                                                {/* <Field name="assigneduser" as={Input} placeholder="Enter Assigned User" disabled={!values.title} /> */}
                                                                <ErrorMessage name="assigneduser" component="div" className="error-message text-red-500 my-1" />
                                                            </div>
                                                        </Col>
                            
                                                        <Col span={12} className='mt-2'>
                                                            <div className="form-item">
                                                                <label className='font-semibold'>Assigned Client <ExclamationCircleOutlined className='text-red-500' /></label>
                                                                <Field name="project">
                                                                    {({ field }) => (
                                                                        <Select
                                                                            {...field}
                                                                            className="w-full"
                                                                            placeholder="Select Assigned Client "
                                                                            mode='multiple'
                                                                            disabled={!values.title} 
                                                                            onChange={(value) => setFieldValue('assigneduser', value)}
                                                                            value={values.assigneduser}
                                                                        >
                                                                            <Option value="stevenmallet">Steven Mallet</Option>
                                                                            <Option value="anniemilton">Annie Milton</Option>
                                                                        </Select>
                                                                    )}
                                                                </Field>
                                                                {/* <Field name="assignedclient" as={Input} placeholder="Enter Assigned Client" disabled={!values.title} /> */}
                                                                <ErrorMessage name="assigned" component="div" className="error-message text-red-500 my-1" />
                                                            </div>
                                                        </Col>

                            {/* Toggle button for Receipt Upload */}

                            <Col span={24} className='mt-4 border-t pt-4'>
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold">Description</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={description}
                                            onChange={(e) => setDescription(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                    </label>
                                </div>

                                {/* Conditionally show Upload field */}
                                {description && (
                                    <>
                                        <Col span={24}>
                                            <div className="mt-2">
                                                <ReactQuill
                                                    value={values.notes}
                                                    onChange={(value) => setFieldValue("description", value)}
                                                    placeholder="Enter Description"
                                                    className="mt-2 bg-white rounded-md"
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="error-message text-red-500 my-1"
                                                />
                                            </div>
                                        </Col>
                                    </>
                                )}
                            </Col>

                            <Col span={24} className='mt-4 '>
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold">More Information</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={info}
                                            onChange={(e) => setInfo(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                    </label>
                                </div>

                                {/* Conditionally show Upload field */}
                                {info && (
                                    <>
                                        <div className="mt-2">
                                            <Col span={24}>
                                                <Card className='w-full border-l-4 border-l-cyan-300 rounded-sm '>
                                                    <div >
                                                        <div className='flex gap-2'>
                                                            <ExclamationCircleOutlined className='text-xl text-cyan-300' />
                                                            <h1 className='text-xl text-cyan-300'>Demo Info</h1>
                                                        </div>
                                                        <div>
                                                            <p>These are custom fields. You can change them or create your own.</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                        </div>
                                        <div className='mt-2'>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item">
                                                    <label className='font-semibold'>Image Quality</label>
                                                    <Field name="imagequality">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full"
                                                                placeholder="Select Image Quality"
                                                                onChange={(value) => setFieldValue('imagequality', value)}
                                                                value={values.imagequality}
                                                            >
                                                                <Option value="hd">HD</Option>
                                                                <Option value="highsolution">High Solution</Option>
                                                                <Option value="Lowsolution">Low Solution</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="imagequality" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div className='mt-2'>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item">
                                                    <label className='font-semibold'>Target Device</label>
                                                    <Field name="targetdevice">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full"
                                                                placeholder="Select Target Device"
                                                                onChange={(value) => setFieldValue('targetdevice', value)}
                                                                value={values.targetdevice}
                                                            >
                                                                <Option value="mobile">Mobile</Option>
                                                                <Option value="tablet">Tablet</Option>
                                                                <Option value="alldevices">All Devices</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="targetdevice" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item mt-2">
                                                    <label className='font-semibold'>Word Count</label>
                                                    <Field name="wordcount" as={Input} placeholder="Enter Word Count" />
                                                    <ErrorMessage name="wordcount" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item mt-2">
                                                    <label className='font-semibold'>Image Count</label>
                                                    <Field name="imagecount" as={Input} placeholder="Enter Image  Count" />
                                                    <ErrorMessage name="imagecount" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item mt-2 flex gap-3 items-center">
                                                    <label className='font-semibold'>Plagiarism Check</label>
                                                    <Field name="checkbox"  type="checkbox" />
                                                    <ErrorMessage name="checkbox" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                        <Col span={24}>
                                            <div className="mt-2 form-item">
                                            <label className='font-semibold'>Comment</label>
                                                <ReactQuill
                                                    value={values.comment}
                                                    onChange={(value) => setFieldValue("comment", value)}
                                                    placeholder="Enter Comment"
                                                    className="mt-2 bg-white rounded-md"
                                                />
                                                <ErrorMessage
                                                    name="comment"
                                                    component="div"
                                                    className="error-message text-red-500 my-1"
                                                />
                                            </div>
                                        </Col>
                                        </div>
                                    </>
                                )}
                            </Col>



                            <Col span={24} className='mt-4 '>
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold">Option</label>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={option}
                                            onChange={(e) => setOption(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                    </label>
                                </div>

                                {/* Conditionally show Upload field */}
                                {option && (
                                    <>
                                        <div className='mt-2'>
                                            <Col span={24}>
                                                        <div className="form-item  mt-2 border-b pb-3">
                                                                                <label className='font-semibold'>Target Date</label>
                                                                                <DatePicker
                                                                                    className="w-full"
                                                                                    format="DD-MM-YYYY"
                                                                                    value={values.targetdate}
                                                                                    onChange={(date) => setFieldValue('targetdate', date)}
                                                                                />
                                                                                <ErrorMessage name="targetdate" component="div" className="error-message text-red-500 my-1" />
                                                                            </div>
                                                                              
                                                        </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item  mt-2">
                                                    <label className='font-semibold'>Tags</label>
                                                    <Field name="tags">
                                                        {({ field }) => (
                                                            <Select
                                                                {...field}
                                                                className="w-full"
                                                                placeholder="Select Tags"
                                                                onChange={(value) => setFieldValue('tags', value)}
                                                                value={values.tags}
                                                            >
                                                                <Option value="android">android</Option>
                                                                <Option value="blogpost">blog-post</Option>
                                                            </Select>
                                                        )}
                                                    </Field>
                                                    <ErrorMessage name="tags" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item mt-2 flex gap-3 items-center">
                                                    <label className='font-semibold'>Visible To Client</label>
                                                    <Field name="visible"  type="checkbox" />
                                                    <ErrorMessage name="visible" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>
                                        <div>
                                            <Col span={24} className='mt-2'>
                                                <div className="form-item mt-2 flex gap-3 items-center">
                                                    <label className='font-semibold'>Billable</label>
                                                    <Field name="billable"  type="checkbox" />
                                                    <ErrorMessage name="billable" component="div" className="error-message text-red-500 my-1" />
                                                </div>
                                            </Col>
                                        </div>

                                    </>
                                )}
                            </Col>

                            <Col className='mt-2'>
                                <h5 className='flex'><h1 className='text-rose-500'>*</h1> Required</h5>
                            </Col>

                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" htmlType='submit' className="mr-2" onClick={() => navigate('/app/apps/project/lead')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditTask;