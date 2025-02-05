import React, { useEffect, useState } from 'react';
import { Button, Col, Input, message, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updatecountries, getallcountries } from './countriesreducer/countriesSlice';

const EditCountries = ({ idd, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        countryName: '',
        shortcode: '',
        phonecode: '',
    });

    const alladats = useSelector((state) => state.countries.countries);

    // console.log("ppp",alladats)
    // console.log("ppp",idd)

    useEffect(() => {
        dispatch(getallcountries());
    }, [dispatch]);

    useEffect(() => {
        if (alladats && idd) {
            const data = alladats.find((x) => x.id === idd);
            // console.log("ppsssp",data)
            if (data) {
                setInitialValues({
                    countryName: data.countryName || '',
                    shortcode: data.countryCode || '',
                    phonecode: data.phoneCode || '',
                });
            }
        }
    }, [alladats, idd]);

    const onSubmit = (values) => {
        console.log('Submitted values:', values);

        dispatch(updatecountries({ idd, values }))
            .then(() => {
                dispatch(getallcountries()); // Refresh country data
                // message.success('Country updated successfully!');
                onClose(); // Close modal or perform any other action
            })
            .catch((error) => {
                // message.error('Failed to update country.');
                // console.error('Edit API error:', error);
            });
    };

    const validationSchema = Yup.object({
        countryName: Yup.string().required('Please enter name.'),
        shortcode: Yup.string().required('Please enter a short code.'),
        phonecode: Yup.string().required('Please enter a phone code.'),
    });

    return (
        <div>
            <h2 className="mb-1 border-b font-medium"></h2>

            <div className="p-2">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    enableReinitialize
                >
                    {({ values, handleSubmit }) => (
                        <Form className="formik-form" onSubmit={handleSubmit}>
                            <Row gutter={16}>
                                <Col span={24} className="mt-2"> 
                                    <div className="form-item">
                                        <label className="font-semibold">Name</label>
                                        <Field
                                            name="countryName"
                                            as={Input}
                                            placeholder="Enter Name"
                                        />
                                        <ErrorMessage
                                            name="countryName"
                                            component="div"
                                            className="error-message text-red-500 my-1"
                                        />
                                    </div>
                                </Col>

                                <Col span={24} className="mt-2">
                                    <div className="form-item">
                                        <label className="font-semibold">Short Code</label>
                                        <Field
                                            name="shortcode"
                                            as={Input}
                                            placeholder="Enter Short Code"
                                        />
                                        <ErrorMessage
                                            name="shortcode"
                                            component="div"
                                            className="error-message text-red-500 my-1"
                                        />
                                    </div>
                                </Col>

                                <Col span={24} className="mt-2">
                                    <div className="form-item">
                                        <label className="font-semibold">Phone Code</label>
                                        <Field
                                            name="phonecode"
                                            as={Input}
                                            placeholder="Enter Phone Code"
                                        />
                                        <ErrorMessage
                                            name="phonecode"
                                            component="div"
                                            className="error-message text-red-500 my-1"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {/* Buttons */}
                            <div className="form-buttons text-right">
                                <Button
                                    type="default"
                                    className="mr-2"
                                    onClick={() => navigate('/app/setting/countries')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Update Country
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default EditCountries;
