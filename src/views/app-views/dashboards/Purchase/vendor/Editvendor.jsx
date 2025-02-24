import React, { useState } from 'react';
import { Button, Row, Col, Input, Checkbox, message } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
// Import your vendor actions here

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  contact: Yup.string().required('Contact is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  taxNumber: Yup.string(),
  billingName: Yup.string().required('Billing name is required'),
  billingPhone: Yup.string().required('Billing phone is required'),
  billingAddress: Yup.string().required('Billing address is required'),
  billingCity: Yup.string().required('City is required'),
  billingState: Yup.string().required('State is required'),
  billingCountry: Yup.string().required('Country is required'),
  billingZipCode: Yup.string().required('Zip code is required'),
  shippingName: Yup.string().when('shippingSameAsBilling', {
    is: false,
    then: Yup.string().required('Shipping name is required'),
  }),
  shippingPhone: Yup.string().when('shippingSameAsBilling', {
    is: false,
    then: Yup.string().required('Shipping phone is required'),
  }),
  // ... add other shipping validations similarly
});

const EditVendor = ({ onClose, vendorData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: vendorData?.name || '',
    contact: vendorData?.contact || '',
    email: vendorData?.email || '',
    taxNumber: vendorData?.taxNumber || '',
    billingName: vendorData?.billingName || '',
    billingPhone: vendorData?.billingPhone || '',
    billingAddress: vendorData?.billingAddress || '',
    billingCity: vendorData?.billingCity || '',
    billingState: vendorData?.billingState || '',
    billingCountry: vendorData?.billingCountry || '',
    billingZipCode: vendorData?.billingZipCode || '',
    shippingSameAsBilling: vendorData?.shippingSameAsBilling || false,
    shippingName: vendorData?.shippingName || '',
    shippingPhone: vendorData?.shippingPhone || '',
    shippingAddress: vendorData?.shippingAddress || '',
    shippingCity: vendorData?.shippingCity || '',
    shippingState: vendorData?.shippingState || '',
    shippingCountry: vendorData?.shippingCountry || '',
    shippingZipCode: vendorData?.shippingZipCode || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // Add your update API call here
      console.log('Updated values:', values);
      message.success('Vendor updated successfully!');
      onClose();
    } catch (error) {
      message.error('Failed to update vendor');
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
      {({ values, errors, touched, setFieldValue }) => (
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
                <label className='font-semibold'>Tax Number <span className='text-red-500'>*</span></label>
                <Field
                  name="taxNumber"
                  as={Input}
                  className='mt-1'
                  placeholder="Enter Tax Number"
                />
              </div>
            </Col>
          </Row>

          <h2 className="mt-4 font-bold text-2xl">Billing Address</h2>
          <Row gutter={16}>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Name <span className="text-red-500">*</span></label>
                <Field
                  name="billingName"
                  as={Input}
                  placeholder="Enter Name"
                  className={errors.billingName && touched.billingName ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingName && touched.billingName && (
                  <div className="text-red-500">{errors.billingName}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Phone <span className="text-red-500">*</span></label>
                <Field
                  name="billingPhone"
                  as={Input}
                  placeholder="Enter Phone"
                  className={errors.billingPhone && touched.billingPhone ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingPhone && touched.billingPhone && (
                  <div className="text-red-500">{errors.billingPhone}</div>
                )}
              </div>
            </Col>
            <Col span={24}>
              <div className="form-group mt-3">
                    <label className='font-semibold'>Address <span className="text-red-500">*</span></label>
                <Field
                  name="billingAddress"
                  as={Input.TextArea}
                  rows={4}
                  placeholder="Enter Address"
                  className={errors.billingAddress && touched.billingAddress ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingAddress && touched.billingAddress && (
                  <div className="text-red-500">{errors.billingAddress}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>City <span className="text-red-500">*</span></label>
                <Field
                  name="billingCity"
                  as={Input}
                  placeholder="Enter City"
                  className={errors.billingCity && touched.billingCity ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingCity && touched.billingCity && (
                  <div className="text-red-500">{errors.billingCity}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>State <span className="text-red-500">*</span></label>
                <Field
                  name="billingState"
                  as={Input}
                  placeholder="Enter State"
                  className={errors.billingState && touched.billingState ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingState && touched.billingState && (
                  <div className="text-red-500">{errors.billingState}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                <label className='font-semibold'>Country <span className="text-red-500">*</span></label>
                <Field
                  name="billingCountry"
                  as={Input}
                  placeholder="Enter Country"
                  className={errors.billingCountry && touched.billingCountry ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingCountry && touched.billingCountry && (
                  <div className="text-red-500">{errors.billingCountry}</div>
                )}
              </div>
            </Col>
            <Col span={12}>
              <div className="form-group mt-3">
                    <label className='font-semibold'>Zip Code <span className="text-red-500">*</span></label>
                <Field
                  name="billingZipCode"
                  as={Input}
                  placeholder="Enter Zip Code"
                  className={errors.billingZipCode && touched.billingZipCode ? 'is-invalid' : 'mt-1'}
                />
                {errors.billingZipCode && touched.billingZipCode && (
                  <div className="text-red-500">{errors.billingZipCode}</div>
                )}
              </div>
            </Col>
          </Row>

          <div className="my-4">
            <Checkbox
              checked={values.shippingSameAsBilling}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setFieldValue('shippingSameAsBilling', isChecked);
                if (isChecked) {
                  setFieldValue('shippingName', values.billingName);
                  setFieldValue('shippingPhone', values.billingPhone);
                  setFieldValue('shippingAddress', values.billingAddress);
                  setFieldValue('shippingCity', values.billingCity);
                  setFieldValue('shippingState', values.billingState);
                  setFieldValue('shippingCountry', values.billingCountry);
                  setFieldValue('shippingZipCode', values.billingZipCode);
                }
              }}
            >
              Shipping Same As Billing
            </Checkbox>
          </div>

          {!values.shippingSameAsBilling && (
            <>
              <h2 className="mt-4 font-bold text-2xl">Shipping Address</h2>
              <Row gutter={16}>
                <Col span={12}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>Name <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingName"
                      as={Input}
                      placeholder="Enter Name"
                      className={errors.shippingName && touched.shippingName ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingName && touched.shippingName && (
                      <div className="text-red-500">{errors.shippingName}</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>Phone <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingPhone"
                      as={Input}
                      placeholder="Enter Phone"
                      className={errors.shippingPhone && touched.shippingPhone ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingPhone && touched.shippingPhone && (
                      <div className="text-red-500">{errors.shippingPhone}</div>
                    )}
                  </div>
                </Col>
                <Col span={24}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>Address <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingAddress"
                      as={Input.TextArea}
                      rows={4}
                      placeholder="Enter Address"
                      className={errors.shippingAddress && touched.shippingAddress ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingAddress && touched.shippingAddress && (
                      <div className="text-red-500">{errors.shippingAddress}</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>City <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingCity"
                      as={Input}
                      placeholder="Enter City"
                      className={errors.shippingCity && touched.shippingCity ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingCity && touched.shippingCity && (
                      <div className="text-red-500">{errors.shippingCity}</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>State <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingState"
                      as={Input}
                      placeholder="Enter State"
                      className={errors.shippingState && touched.shippingState ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingState && touched.shippingState && (
                      <div className="text-red-500">{errors.shippingState}</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-group mt-3">
                    <label className='font-semibold'>Country <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingCountry"
                      as={Input}
                      placeholder="Enter Country"
                      className={errors.shippingCountry && touched.shippingCountry ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingCountry && touched.shippingCountry && (
                      <div className="text-red-500">{errors.shippingCountry}</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div className="form-group mt-3">
                        <label className='font-semibold'>Zip Code <span className="text-red-500">*</span></label>
                    <Field
                      name="shippingZipCode"
                      as={Input}
                      placeholder="Enter Zip Code"
                      className={errors.shippingZipCode && touched.shippingZipCode ? 'is-invalid' : 'mt-1'}
                    />
                    {errors.shippingZipCode && touched.shippingZipCode && (
                      <div className="text-red-500">{errors.shippingZipCode}</div>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}

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