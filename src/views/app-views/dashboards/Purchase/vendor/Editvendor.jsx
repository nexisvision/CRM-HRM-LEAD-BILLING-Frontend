import React, { useState } from 'react';
import { Button, Row, Col, Input, Checkbox, message } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { vendordataedata, vendordataeditt } from './vendorReducers/vendorSlice';
// Import your vendor actions here

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  contact: Yup.string().required('Contact is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  taxNumber: Yup.string().required('Tax Number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipcode: Yup.string().required('Zip code is required'),
});

const EditVendor = ({ onClose, vendorData, idd }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  console.log("vendorData", vendorData);

  const initialValues = {
    name: vendorData?.name || '',
    contact: vendorData?.contact || '',
    email: vendorData?.email || '',
    taxNumber: vendorData?.taxNumber || '',
    address: vendorData?.address || '',
    city: vendorData?.city || '',
    state: vendorData?.state || '',
    country: vendorData?.country || '',
    zipcode: vendorData?.zipcode || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // Add your update API call here
      const response = await dispatch(vendordataeditt({ idd, values }));
      if (response.error) {
        throw new Error(response.error.message);
      }
      await dispatch(vendordataedata());
      // console.log('Updated values:', values);
      // message.success('Vendor updated successfully!');
      onClose();
    } catch (error) {
      // message.error('Failed to update vendor: ' + error.message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ values, errors, touched }) => (
        <Form className="edit-vendor-form">
          <h1 className='border-b-2 border-gray-300'></h1>
          <h2 className='text-2xl font-bold mt-2'>Basic Info</h2>
          <Row gutter={16}>
            <Col span={8}>
              <div className="form-group mt-3">
                <label className='font-semibold'>
                  Name <span className="text-red-500">*</span>
                </label>
                <Field
                  name="name"
                  as={Input}
                  placeholder="Enter Name"
                  className={errors.name && touched.name ? 'is-invalid' : 'mt-1'}
                />
                {errors.name && touched.name && (
                  <div className="text-red-500">{errors.name}</div>
                )}
              </div>
            </Col>
            <Col span={8}>
              <div className="form-group mt-3">
                <label className='font-semibold'>
                  Contact <span className="text-red-500">*</span>
                </label>
                <Field
                  name="contact"
                  as={Input}
                  placeholder="Enter Contact"
                  className={errors.contact && touched.contact ? 'is-invalid' : 'mt-1'}
                />
                {errors.contact && touched.contact && (
                  <div className="text-red-500">{errors.contact}</div>
                )}
              </div>
            </Col>
            <Col span={8}>
              <div className="form-group mt-3">
                <label className='font-semibold'>
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  as={Input}
                  placeholder="Enter email"
                  type="email"
                  className={errors.email && touched.email ? 'is-invalid' : 'mt-1'}
                />
                {errors.email && touched.email && (
                  <div className="text-red-500">{errors.email}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Tax Number</label>
                <Field
                  name="taxNumber"
                  as={Input}
                  className='mt-1'
                  placeholder="Enter Tax Number"
                />
              </div>
            </Col>
          </Row>

          <h2 className="mt-4 font-bold text-2xl">Address</h2>
          <Row gutter={16}>
            <Col span={24}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Address <span className="text-red-500">*</span></label>
                <Field
                  name="address"
                  as={Input.TextArea}
                  rows={4}
                  placeholder="Enter Address"
                  className={errors.address && touched.address ? 'is-invalid' : 'mt-1'}
                />
                {errors.address && touched.address && (
                  <div className="text-red-500">{errors.address}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>City <span className="text-red-500">*</span></label>
                <Field
                  name="city"
                  as={Input}
                  placeholder="Enter City"
                  className={errors.city && touched.city ? 'is-invalid' : 'mt-1'}
                />
                {errors.city && touched.city && (
                  <div className="text-red-500">{errors.city}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>State <span className="text-red-500">*</span></label>
                <Field
                  name="state"
                  as={Input}
                  placeholder="Enter State"
                  className={errors.state && touched.state ? 'is-invalid' : 'mt-1'}
                />
                {errors.state && touched.state && (
                  <div className="text-red-500">{errors.state}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Country <span className="text-red-500">*</span></label>
                <Field
                  name="country"
                  as={Input}
                  placeholder="Enter Country"
                  className={errors.country && touched.country ? 'is-invalid' : 'mt-1'}
                />
                {errors.country && touched.country && (
                  <div className="text-red-500">{errors.country}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Zip Code <span className="text-red-500">*</span></label>
                <Field
                  name="zipcode"
                  as={Input}
                  placeholder="Enter Zip Code"
                  className={errors.zipcode && touched.zipcode ? 'is-invalid' : 'mt-1'}
                />
                {errors.zipcode && touched.zipcode && (
                  <div className="text-red-500">{errors.zipcode}</div>
                )}
              </div>
            </Col>
          </Row>

          <div className="text-right mt-4">
            <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EditVendor;