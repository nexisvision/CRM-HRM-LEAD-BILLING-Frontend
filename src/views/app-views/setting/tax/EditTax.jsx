import React, { useEffect } from 'react';
import { Input, Button, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateTax, getAllTaxes } from '../tax/taxreducer/taxSlice';

const EditTax = ({ idd, tax, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { id } = useParams();
    const { loading } = useSelector((state) => state.tax);

    const initialValues = {
        gstName: tax?.gstName || '',
        gstPercentage: tax?.gstPercentage || '',
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

    const alladats = useSelector((state) => state.tax.taxes);

    useEffect(() => {
        dispatch(getAllTaxes());
    }, [dispatch]);


    const onSubmit = async (values, { setSubmitting }) => {
        try {
            if (!idd) {
                throw new Error('Tax ID is missing');
            }
            await dispatch(updateTax({ idd, values })).unwrap();
            message.success('Tax updated successfully');
            dispatch(getAllTaxes());
            onClose();
        } catch (error) {
            message.error('Failed to update tax: ' + (error.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-tax-form">
            {/* <h2 className="mb-4">Create Tax</h2> */}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
            >
                {({ handleSubmit }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className="font-semibold">GST Name</label>
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
                                    <label className="font-semibold">GST Percentage</label>
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
                                loading={loading}
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditTax;

