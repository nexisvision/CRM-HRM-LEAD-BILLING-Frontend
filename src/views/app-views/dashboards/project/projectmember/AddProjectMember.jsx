import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const { Option } = Select;
const AddProjectMember = () => {
    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        AddProjectMember: ''
    };
    const validationSchema = Yup.object({
        AddProjectMember: Yup.string().required('Please enter AddProjectMember name.')
    });
    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/apps/project/projectmember');
    };
    return (
        <div className="add-project-member-form">
            <hr style={{ marginBottom: '20px', border: '1px solid #E8E8E8' }} />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold text-[12] text-dark-gray-500 '>AddProjectMember</label>
                                    <Field name="AddProjectMember">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full mt-2"
                                                mode="multiple"
                                                placeholder="Select AddProjectMember"
                                                onChange={(value) => setFieldValue('AddProjectMember', value)}
                                                value={values.AddProjectMember}
                                                onBlur={() => setFieldTouched("AddProjectMember", true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="AddProjectMember" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/apps/project/projectmember')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default AddProjectMember;