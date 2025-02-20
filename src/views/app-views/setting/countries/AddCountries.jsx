import React from "react";
import { Card, Form, Input, Button, notification, message } from "antd";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCountry, getallcountries } from './countriesreducer/countriesSlice';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Row, Col } from 'antd';

const validationSchema = Yup.object().shape({
  countryName: Yup.string().required('Please enter country name'),
  countryCode: Yup.string().required('Please enter country code'),
  phoneCode: Yup.string().required('Please enter phone code')
});

const AddCountries = ({onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    countryName: '',
    countryCode: '',
    phoneCode: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await dispatch(addCountry(values)).unwrap();
      await dispatch(getallcountries());
      // notification.success({
      //   message: 'Success',
      //   description: 'Country added successfully.',
      // });
      message.success('Country added successfully.');
      resetForm();
      onClose();
    } catch (error) {
      // notification.error({
      //   message: 'Error',
      //   description: error.message || 'Failed to add country.',
      // });
      message.error('Failed to add country.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Country Name <span className="text-red-500">*</span></label>
                  <Field
                    name="countryName"
                    as={Input}
                    placeholder="Enter country name"
                  />
                  <ErrorMessage
                    name="countryName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Country Code <span className="text-red-500">*</span></label>
                  <Field
                    name="countryCode"
                    as={Input}
                    placeholder="Enter country code"
                  />
                  <ErrorMessage
                    name="countryCode"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Phone Code <span className="text-red-500">*</span></label>
                  <Field
                    name="phoneCode"
                    as={Input}
                    placeholder="Enter phone code"
                  />
                  <ErrorMessage
                    name="phoneCode"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="default"
                onClick={onClose}
                style={{ marginRight: '8px' }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
              >
                Create
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AddCountries;

