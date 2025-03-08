import React from 'react';
import { Input, Button, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createTax } from '../tax/taxreducer/taxSlice';



const AddTax = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        gstName: '',
        gstPercentage: '',
    };

    const validationSchema = Yup.object().shape({
        gstName: Yup.string()
            .required('GST name is required')
            .min(2, 'GST name must be at least 2 characters'),
        gstPercentage: Yup.number()
            .required('GST percentage is required')
            .min(0, 'Percentage cannot be negative')
            .max(100, 'Percentage cannot exceed 100'),
    });

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(createTax(values)).unwrap();
            resetForm();
            message.success('Tax added successfully!');
            onClose();
            navigate('/app/setting/tax');
        } catch (error) {
            message.error('Failed to add tax: ' + (error.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-tax-form">
          <h2 className="mb-3 border-b pb-1 font-medium"></h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouche }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className="font-semibold">Gst Name <span className="text-red-500">*</span></label>
                                    <Field name="gstName" as={Input} placeholder="Enter GST Name" />
                                    <ErrorMessage
                                        name="gstName"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item">
                                    <label className="font-semibold">Gst Percentage <span className="text-red-500">*</span></label>
                                    <Field name="gstPercentage" as={Input} placeholder="Enter GST Percentage" />
                                    <ErrorMessage
                                        name="gstPercentage"
                                        component="div"
                                        className="error-message text-red-500 my-1"
                                    />
                                </div>
                            </Col>

                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button
                                type="default"
                                className="mr-2"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Create
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTax;

