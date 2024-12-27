import React, { useState } from 'react';
import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal, Select, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import { Card, Table,  Badge, Menu, Tag,Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
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

const AddPipeLine = () => {
    const [users, setUsers] = useState(userData);

    const navigate = useNavigate();

    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Country added successfully!');
        navigate('/app/systemsetup/pipeline/');
    };

    const initialValues = {
        pipelinename: '',
    };

    const validationSchema = Yup.object({
        pipelinename: Yup.string().required('Please enter pipelinename.'),
    });

    return (
        <>
            <div>
                <div className=''>
                    <h2 className="mb-1 border-b font-medium"></h2>
                   
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
                    
                                                <Col span={24} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold'>Pipeline Name</label>
                                                        <Field name="pipelinename" as={Input} placeholder="Enter Pipeline Name" />
                                                        <ErrorMessage name="pipelinename" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>

                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>


                    <div className="form-buttons text-right">
                        <Button type="default" className="mr-2">Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddPipeLine;
