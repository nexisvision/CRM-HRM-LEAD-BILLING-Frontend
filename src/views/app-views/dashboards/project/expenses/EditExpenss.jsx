import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';

const { Option } = Select;

const EditExpenses = () => {

    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    const { currencies } = useSelector((state) => state.currencies);
    const dispatch = useDispatch();

    
    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);

    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        itemName: '',
        currency: '',
        price: '',
        employee: '',
        project: '',    
        purchasedFrom: '',
        purchaseDate: '',
        status: "",
        description: '',

        // bill: "",
    };
    const validationSchema = Yup.object({
        itemName: Yup.string().required('Please enter ItemName.'),
        currency: Yup.string().required('Please enter Currency.'),
        // ExchangeRate: Yup.string().required('Please enter ExchangeRate.'),
        price: Yup.string().required('Please enter Price.'),
        employee: Yup.string().required('Please enter Employee.'),
        project: Yup.string().required('Please enter Project.'),
        purchaseDate: Yup.string().required('Please enter PurchaseDate.'),
        purchasedFrom: Yup.string().required('Please enter PurchasedFrom.'),
        status: Yup.string().required('Please enter a Status.'),
        description: Yup.string().required('Please enter a Description.'),
        // bill: Yup.string().required('Please enter Bill.'),
    });
    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/app/dashboards/project/list');
    };
    return (
        <div className="add-expenses-form">
            <hr style={{ marginBottom: '20px', border: '1px solid #E8E8E8' }} />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>ItemName</label>
                                    <Field name="itemName" as={Input} placeholder="Enter ItemName" />
                                    <ErrorMessage name="itemName" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className="">
                                <div className="form-item">
                                    <label className="font-semibold">Currency</label>
                                    <div className="flex gap-2">
                                        <Field name="currency">
                                            {({ field, form }) => (
                                                <Select
                                                    {...field}
                                                    className="w-full"
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
                            {/* <Col span={6} >
                                <div className="form-item">
                                    <label className='font-semibold'>ExchangeRate</label>
                                    <Field name="ExchangeRate" as={Input} placeholder="Enter ExchangeRate" />
                                    <ErrorMessage name="ExchangeRate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col> */}
                            <Col span={8} >
                                <div className="form-item">
                                    <label className='font-semibold'>Price</label>
                                    <Field name="price" type='number' as={Input} placeholder="Enter Price" />
                                    <ErrorMessage name="price" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>PurchaseDate</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.purchaseDate}
                                        onChange={(date) => setFieldValue('purchaseDate', date)}
                                        onBlur={() => setFieldTouched("purchaseDate", true)}
                                    />
                                    <ErrorMessage name="purchaseDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Employee</label>
                                    <Field name="employee">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Employee"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('employee', value)}
                                                value={values.employee}
                                                onBlur={() => setFieldTouched('employee', true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="employee" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Project"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('project', value)}
                                                value={values.project}
                                                onBlur={() => setFieldTouched('project', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>PurchasedFrom</label>
                                    <Field name="purchasedFrom" as={Input} placeholder="Enter PurchasedFrom" />
                                    <ErrorMessage name="purchasedFrom" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Status</label>
                                    <Field name="Status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select Status"
                                                className="w-full"
                                                onChange={(value) => setFieldValue('status', value)}
                                                value={values.status}
                                                onBlur={() => setFieldTouched('status', true)}
                                                allowClear={false}
                                            >
                                                <Option value="Pending">Pending</Option>
                                                <Option value="Approved">Approved</Option>
                                                <Option value="Rejected">Rejected</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
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
                            <div className='mt-4 w-full'>
                                <span className='block  font-semibold p-2'>Bill</span>
                                <Col span={24} >
                                    <Upload
                                        action="http://localhost:5500/api/users/upload-cv"
                                        listType="picture"
                                        accept=".pdf"
                                        maxCount={1}
                                        showUploadList={{ showRemoveIcon: true }}
                                        className='border-2 flex justify-center items-center p-10 '
                                    >
                                        <span className='text-xl'>Choose File</span>
                                        {/* <CloudUploadOutlined className='text-4xl' /> */}
                                    </Upload>
                                </Col>
                            </div>
                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/expenses')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default EditExpenses;