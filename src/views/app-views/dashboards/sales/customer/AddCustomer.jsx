import React, { useEffect, useState } from "react";
import { Input, Button, message, Row, Col, Select, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addcus, Getcus } from "./CustomerReducer/CustomerSlice";
import { getallcountries } from "../../../setting/countries/countriesreducer/countriesSlice";
import AddCountries from "views/app-views/setting/countries/AddCountries";


const { Option } = Select;

const AddCustomer = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countries = useSelector((state) => state.countries.countries);
  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

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

  const initialValues = {
    name: "",
    contact: "",
    email: "",
    taxnumber: "",
    country_code: getInitialCountry(),
    alternate_country_code: getInitialCountry(),
    billing_country_code: getInitialCountry(),
    shipping_country_code: getInitialCountry(),
    alternatemobilenumber: "",
    billing_name: "",
    billing_phone: "",
    billing_address: "",
    
    billing_city: "",
    billing_state: "",
    billing_country: "",
    billing_zipcode: "",
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    shipping_zipcode: "",
    country_code: "",
    // billing_country_code: "",
    // shipping_country_code: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter a Name."),
    country_code: Yup.string().optional("Country code is required"),
    contact: Yup.string()
      .required("Please enter a Contact Number")
      .matches(/^\d+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits"),
    email: Yup.string()
      .email("Please enter a valid email address with @.")
      .required("please enter a email"),
    taxnumber: Yup.string().optional("Please enter a Tax Number."),
    alternatemobilenumber: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .optional("Please enter an Alternate Number"),
    billing_name: Yup.string().optional("Please enter a Name."),
    billing_country_code: Yup.string().optional("Country code is required"),
    billing_phone: Yup.string()
      .optional("Please enter a phone number"),
    billing_address: Yup.string().optional("Please enter a Billing Address."),
    billing_city: Yup.string().optional("Please enter a City."),
    billing_state: Yup.string().optional("Please enter a State."),
    billing_country: Yup.string().optional("Please enter a Country."),
    billing_zipcode: Yup.string().optional("Please enter a Zip Code."),
    shipping_name: Yup.string().optional("Please enter a Name."),
    shipping_country_code: Yup.string().optional("Country code is required"),
    shipping_phone: Yup.string()
      .optional("Please enter a phone number"),
    shipping_address: Yup.string().optional("Please enter a Shipping Address."),
    shipping_city: Yup.string().optional("Please enter a City."),
    shipping_state: Yup.string().optional("Please enter a State."),
    shipping_country: Yup.string().optional("Please enter a Country."),
    shipping_zipcode: Yup.string().optional("Please enter a Zip Code."),
  });

  const handlePhoneNumberChange = (e, setFieldValue, fieldName) => {
    const value = e.target.value;
    // Only allow numbers and limit length to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setFieldValue(fieldName, value);
    }
  };

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      name: values.name,
      contact: values.contact,
      email: values.email,
      tax_number: values.taxnumber,
      alternate_number: values.alternatemobilenumber.toString(),
      billing_address: {
        street: values.billing_address,
        city: values.billing_city,
        state: values.billing_state,
        zip: values.billing_zipcode,
        country: values.billing_country,
      },
      shipping_address: {
        street: values.shipping_address,
        city: values.shipping_city,
        state: values.shipping_state,
        zip: values.shipping_zipcode,
        country: values.shipping_country,
      },
    };

    dispatch(addcus(payload))
      .then(() => {
        dispatch(Getcus());
        onClose();
        resetForm();
        // message.success("Customer added successfully!");
      })
      .catch((error) => {
        console.error("Error adding customer:", error);
        message.error("Failed to add customer. Please try again.");
      });
  };

  return (
    <div className="add-job-form">
      <div className=" ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h1 className="mb-4 border-b pb-4 font-medium"></h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            setFieldTouched,
            resetForm,
          }) => (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16} className="mt-4">
                <Col span={24}>
                  <h1 className="font-semibold text-lg">Basic Info</h1>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                    <Field name="name" as={Input} placeholder="Enter Name" className="mt-1" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message text-red-500 my-1 "
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Contact <span className="text-red-500">*</span></label>
                    <div className="flex gap-0">
                      <Field name="country_code">
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
                                setFieldValue('country_code', value);
                              }
                            }}
                            value={values.country_code || getInitialCountry()}
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
                        {({ field, form }) => (
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
                            maxLength={10}
                            placeholder="Enter phone number"
                            onChange={(e) => handlePhoneNumberChange(e, setFieldValue, 'contact')}
                            onKeyPress={(e) => {
                              // Allow only number keys
                              const charCode = e.which ? e.which : e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                            value={values.contact}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="contact" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                <Col span={8} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                    <Field name="email" as={Input} placeholder="Enter Email" className="mt-1" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Tax Number
                    </label>
                    <Field
                      name="taxnumber"
                      as={Input}
                      placeholder="Enter Tax Number"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="taxnumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={8} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Alternate Mobile Number</label>
                    <div className="flex gap-0">
                      <Field name="alternate_country_code">
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
                            onChange={(value) => setFieldValue('alternate_country_code', value)}
                            value={values.alternate_country_code}
                            dropdownStyle={{ minWidth: '180px' }}
                            suffixIcon={<span className="text-gray-400 text-xs">▼</span>}
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
                      <Field name="alternatemobilenumber">
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
                            type="number"
                            placeholder="Enter alternate number"
                            onChange={(e) => handlePhoneNumberChange(e, setFieldValue, 'alternatemobilenumber')}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="alternatemobilenumber" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                <Col span={24} className="mt-4">
                  <h1 className="font-semibold text-lg">Billing Address</h1>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Name</label>
                    <Field
                      name="billing_name"
                      as={Input}
                      placeholder="Enter Name"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="billing_name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Phone  </label>
                    <div className="flex">
                      <Select
                        className="mt-1"
                        style={{ width: '30%', marginRight: '8px' }}
                        placeholder="Code"
                        name="billing_country_code"
                        onChange={(value) => setFieldValue('billing_country_code', value)}
                        value={values.billing_country_code}
                      >
                        {countries.map((country) => (
                          <Option key={country.id} value={country.phoneCode}>
                            {country.phoneCode}
                          </Option>
                        ))}
                      </Select>
                      <Field
                        name="billing_phone"
                        as={Input}
                        type="number"
                        className="mt-1"
                        maxLength={10}
                        style={{ width: '70%' }}
                        placeholder="Enter phone"
                        onChange={(e) => handlePhoneNumberChange(e, setFieldValue, 'billing_phone')}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <ErrorMessage
                      name="billing_phone"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col> */}

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                    <div className="flex gap-0">
                      <Field name="billing_country_code">
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
                                setFieldValue('billing_country_code', value);
                              }
                            }}
                            value={values.billing_country_code}
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
                      <Field name="billing_phone">
                        {({ field, form }) => (
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
                            maxLength={10}
                            placeholder="Enter phone number"
                            onChange={(e) => handlePhoneNumberChange(e, setFieldValue, 'billing_phone')}
                            onKeyPress={(e) => {
                              const charCode = e.which ? e.which : e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                            value={values.billing_phone}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="billing_phone" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Address  </label>
                    <Field name="billing_address" as={Input} placeholder="Enter Address" className="mt-1" />
                    <ErrorMessage
                      name="billing_address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">City   </label>
                    <Field
                      name="billing_city"
                      as={Input}
                      placeholder="Enter City"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="billing_city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">State  </label>
                    <Field
                      name="billing_state"
                      as={Input}
                      placeholder="Enter State"
                      className="mt-1"
                    />

                    <ErrorMessage
                      name="billing_state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Country  </label>
                    <Select
                      className="mt-1 w-full"
                      placeholder="Select Country"
                      name="billing_country"
                      onChange={(value) => setFieldValue('billing_country', value)}
                      value={values.billing_country}
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.countryName}>
                          {country.countryName}
                        </Option>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="billing_country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3 mb-4">
                  <div className="form-item">
                    <label className="font-semibold">Zip Code   </label>
                    <Field
                      name="billing_zipcode"
                      as={Input}
                      placeholder="Enter Zip Code"
                      className="mt-1"
                    />

                    <ErrorMessage
                      name="billing_zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={24}>
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold mb-2 text-lg">
                      Shipping Address
                    </h1>
                    <Button
                      style={{
                        backgroundColor: 'rgb(107 114 128)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}
                      className="mb-3 "
                      onClick={() => {
                        setFieldValue('shipping_name', values.billing_name);
                        setFieldValue('shipping_country_code', values.billing_country_code);
                        setFieldValue('shipping_phone', values.billing_phone);
                        setFieldValue('shipping_address', values.billing_address);
                        setFieldValue('shipping_city', values.billing_city);
                        setFieldValue('shipping_state', values.billing_state);
                        setFieldValue('shipping_country', values.billing_country);
                        setFieldValue('shipping_zipcode', values.billing_zipcode);
                      }}
                    >
                      Shipping Same As Billing
                    </Button>
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Name   </label>
                    <Field
                      name="shipping_name"
                      as={Input}
                      placeholder="Enter Name"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="shipping_name"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Phone <span className="text-red-500">*</span></label>
                    <div className="flex gap-0">
                      <Field name="shipping_country_code">
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
                                setFieldValue('shipping_country_code', value);
                              }
                            }}
                            value={values.shipping_country_code}
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
                      <Field name="shipping_phone">
                        {({ field, form }) => (
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
                            maxLength={10}
                            placeholder="Enter phone number"
                            onChange={(e) => handlePhoneNumberChange(e, setFieldValue, 'shipping_phone')}
                            onKeyPress={(e) => {
                              const charCode = e.which ? e.which : e.keyCode;
                              if (charCode < 48 || charCode > 57) {
                                e.preventDefault();
                              }
                            }}
                            value={values.shipping_phone}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="shipping_phone" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Address  </label>
                    <Field name="shipping_address" as={Input} placeholder="Enter Address" className="mt-1" />
                    <ErrorMessage
                      name="shipping_address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">City   </label>
                    <Field
                      name="shipping_city"
                      as={Input}
                      placeholder="Enter City"
                      className="mt-1"
                    />

                    <ErrorMessage
                      name="shipping_city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">State  </label>
                    <Field
                      name="shipping_state"
                      as={Input}
                      placeholder="Enter State"
                      className="mt-1"
                    />

                    <ErrorMessage
                      name="shipping_state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Country  </label>
                    <Select
                      className="mt-1 w-full"
                      placeholder="Select Country"
                      name="shipping_country"
                      onChange={(value) => setFieldValue('shipping_country', value)}
                      value={values.shipping_country}
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.countryName}>
                          {country.countryName}
                        </Option>
                      ))}
                    </Select>
                    <ErrorMessage
                      name="shipping_country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Zip Code      </label>
                    <Field
                      name="shipping_zipcode"
                      as={Input}
                      placeholder="Enter Zip Code"
                      className="mt-1"
                    />

                    <ErrorMessage
                      name="shipping_zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>
              </Row>
              <div className="form-buttons text-right mt-4 mb-4">
                <Button type="default" className="mr-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form>
          )}
        </Formik>

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
          font-size: 14px !important;
          font-weight: 500 !important;
          color: rgba(0, 0, 0, 0.88) !important;
        }

        .phone-code-select .ant-select-selection-item > div {
          display: flex !important;
          align-items: center !important;
        }

        .phone-code-select .ant-select-selection-item span:not(:first-child) {
          display: none !important;
        }

        .phone-code-select .ant-select-arrow {
          color: rgba(0, 0, 0, 0.25) !important;
          font-size: 10px !important;
          right: 8px !important;
        }

        .phone-code-select:hover .ant-select-selector {
          border-color: #d9d9d9 !important;
        }

        .phone-code-select.ant-select-focused .ant-select-selector {
          border-color: #4096ff !important;
          box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1) !important;
        }

        .phone-input::-webkit-inner-spin-button,
        .phone-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .phone-input {
          -moz-appearance: textfield;
        }

        .phone-input:focus {
          outline: none;
          border-color: #4096ff;
          box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
        }
      `}</style>
      </div>
    </div>
  );
};

export default AddCustomer;

