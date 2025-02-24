import React from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
const { Option } = Select;

const EditTransfer = ({ onClose }) => {
    const navigate = useNavigate();

    const initialValues = {
        date: '',
        fromaccount: '',
        toaccount: '',
        amount: '',
        description: '',
    };

    const validationSchema = Yup.object({
        date: Yup.string().required('Please enter a date.'),
        fromaccount: Yup.string().required('Please enter a from account.'),
        toaccount: Yup.string().required('Please enter a to account.'),
        amount: Yup.string().required('Please enter a amount.'),
        description: Yup.string().required('Please enter a description.'),
        bankaddress: Yup.string().required('Please enter a bank address.'),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            // Add your API call here
            console.log('Form values:', values);
            message.success('Account created successfully!');
            onClose();
            navigate('/app/dashboards/banking/transfer'); // Updated to always navigate to account list
        } catch (error) {
            message.error('Failed to create account');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="create-account-form">
            {/* <h2>Create Job</h2> */}
            <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ handleSubmit, isSubmitting, setFieldValue, values, setFieldTouched }) => (
                    <FormikForm onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-group">
                                    <label className="font-semibold">Date <span className="text-red-500">*</span></label>
                                    <Field name="date">
                                        {({ field }) => (
                                            <DatePicker
                                                {...field}
                                                className="w-full mt-1"
                                                placeholder="Select date"
                                                onChange={(date) => field.onChange(date)}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="date"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-group">
                                    <label className="font-semibold">From Account <span className="text-red-500">*</span></label>
                                    <Field name="fromaccount">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                onChange={(value) => setFieldValue('fromaccount', value)}
                                                placeholder="Select from account"
                                                className="w-full mt-1"
                                            >
                                                <Option value="sbi">State Bank of India</Option>
                                                <Option value="hdfc">HDFC Bank</Option>
                                                <Option value="icici">ICICI Bank</Option>
                                                <Option value="axis">Axis Bank</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="bankname"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-group mt-2">
                                    <label className="font-semibold">To Account <span className="text-red-500">*</span></label>
                                    <Field name="toaccount">
                                        {({ field }) => (
                                            <Input {...field} placeholder="Enter to account" className="w-full mt-1" />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="toaccount"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-group mt-2">
                                    <label className="font-semibold">Amount <span className="text-red-500">*</span></label>
                                    <Field name="amount">
                                        {({ field }) => (
                                            <Input {...field} type="number" placeholder="Enter amount" className="w-full mt-1" />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="amount"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            

                            <Col span={24}>
                                <div className="form-group mt-2">
                                    <label className="font-semibold">Bank Address <span className="text-red-500">*</span></label>
                                    <Field
                                        name="bankaddress"
                                        as={Input}
                                        placeholder="Enter bank address"
                                        className="w-full mt-1"
                                    />
                                    <ErrorMessage
                                        name="bankaddress"
                                        component="div"
                                        className="text-red-500 mt-1"
                                    />
                                </div>
                            </Col>

                            <Col span={24} className="">
                                <div className="form-item mt-3">
                                    <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                                    <Field name="description">
                                        {({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                className="mt-2"
                                                placeholder="Enter Description"
                                                value={values.description}
                                                onChange={(value) => setFieldValue("description", value)}
                                                onBlur={() => setFieldTouched("description", true)}
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>
                        </Row>

                        <div className="text-right mt-4">
                            <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={isSubmitting}>
                                Submit
                            </Button>
                        </div>
                    </FormikForm>
                )}
            </Formik>
        </div>
    );
};

export default EditTransfer;