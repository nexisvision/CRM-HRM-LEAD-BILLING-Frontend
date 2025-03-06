import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Checkbox, message, Select, Modal } from 'antd';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { vendordataeaddd, vendordataedata } from './vendorReducers/vendorSlice';
import { PlusOutlined } from '@ant-design/icons';
import AddCountries from "views/app-views/setting/countries/AddCountries";
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';
// Import your vendor actions here

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  contact: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Contact is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  taxNumber: Yup.string().required('Tax number is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  zipcode: Yup.string().required('Zip code is required'),
  phoneCode: Yup.string().required('Country code is required'),
});

const { Option } = Select;

const AddVendor = ({ onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
  const countries = useSelector((state) => state.countries?.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('contact', value);
    }
  };

  const initialValues = {
    name: '',
    contact: '',
    email: '',
    taxNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    phoneCode: getInitialCountry(),
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      await dispatch(vendordataeaddd(values))
        .then(()=>{
          dispatch(vendordataedata())
          // message.success('Vendor created successfully!');
          onClose();
        })
   
    } catch (error) {
      // message.error('Failed to create vendor');
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
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form className="create-vendor-form">
          <h1 className='border-b-2 border-gray-300 '></h1>
          <h2 className='text-2xl font-bold mt-2'> Basic Info</h2>
          <Row gutter={16}>
            <Col span={8}>
              <div className="form-group mt-3">
                <label className=' font-semibold'>
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
                <label className="font-semibold mb-1">Contact <span className="text-red-500">*</span></label>
                <div className="flex gap-0">
                  <Field name="phoneCode">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="phone-code-select"
                        style={{
                          width: '80px',
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                          borderRight: 0,
                          backgroundColor: '#f8fafc',
                        }}
                        placeholder={<span className="text-gray-400">+91</span>}
                        onChange={(value) => {
                          if (value === 'add_new') {
                            setIsAddPhoneCodeModalVisible(true);
                          } else {
                            setFieldValue('phoneCode', value);
                          }
                        }}
                        value={values.phoneCode}
                        dropdownStyle={{ minWidth: '180px' }}
                        suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
                        dropdownRender={menu => (
                          <div>
                            <div
                              className="text-blue-600 flex items-center justify-center py-2 px-3 border-b hover:bg-blue-50 cursor-pointer sticky top-0 bg-white z-10"
                              onClick={() => setIsAddPhoneCodeModalVisible(true)}
                            >
                              <PlusOutlined className="mr-2" />
                              <span className="text-sm">Add New</span>
                            </div>
                            {menu}
                          </div>
                        )}
                      >
                        {countries?.map((country) => (
                          <Option key={country.id} value={country.phoneCode}>
                            <div className="flex items-center w-full px-1">
                              <span className="text-base min-w-[40px]">{country.phoneCode}</span>
                              <span className="text-gray-600 text-sm ml-3">{country.countryName}</span>
                              <span className="text-gray-400 text-xs ml-auto">{country.countryCode}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Field>
                  <Field name="contact">
                    {({ field }) => (
                      <Input
                        {...field}
                        className="phone-input"
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                          borderLeft: '1px solid #d9d9d9',
                          width: 'calc(100% - 80px)'
                        }}
                        type="tel"
                        placeholder="Enter 10-digit number"
                        onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                        maxLength={15}
                      />
                    )}
                  </Field>
                </div>
                {errors.contact && touched.contact && (
                  <div className="text-red-500">{errors.contact}</div>
                )}
              </div>
            </Col>
            <Col span={8}>
              <div className="form-group mt-3">
                <label className=' font-semibold'>
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
                <label className=' font-semibold'>Tax Number <span className='text-red-500'>*</span></label>
                <Field
                  name="taxNumber"
                  as={Input}
                  className='mt-1'
                  placeholder="Enter Tax Number"
                />
                {errors.taxNumber && touched.taxNumber && (
                  <div className="text-red-500">{errors.taxNumber}</div>
                )}
              </div>
            </Col>
          </Row>

          <h2 className="mt-4 font-bold text-2xl">Address</h2>
          <Row gutter={16}>
            <Col span={24}>
              <div className="form-group mt-3">
                <label className=' font-semibold'>Address <span className="text-red-500">*</span></label>
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
                <label className=' font-semibold'>City <span className="text-red-500">*</span></label>
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
                <label className=' font-semibold'>State <span className="text-red-500">*</span></label>
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
                <label className=' font-semibold'>Country <span className="text-red-500">*</span></label>
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
                <label className=' font-semibold'>Zip Code <span className="text-red-500">*</span></label>
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
              Submit
            </Button>
          </div>

          <Modal
            title="Add New Country"
            visible={isAddPhoneCodeModalVisible}
            onCancel={() => setIsAddPhoneCodeModalVisible(false)}
            footer={null}
            width={600}
          >
            <AddCountries
              onClose={() => {
                setIsAddPhoneCodeModalVisible(false);
                dispatch(getallcountries());
              }}
            />
          </Modal>

          <style jsx>{`
            .phone-code-select .ant-select-selector {
              background-color: #f8fafc !important;
              border-top-right-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
              border-right: 0 !important;
            }

            .phone-code-select .ant-select-selection-item {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-size: 16px !important;
            }

            .phone-code-select .ant-select-selection-item > div {
              display: flex !important;
              align-items: center !important;
            }

            .phone-code-select .ant-select-selection-item span:not(:first-child) {
              display: none !important;
            }
          `}</style>
        </Form>
      )}
    </Formik>
  );
};

export default AddVendor;