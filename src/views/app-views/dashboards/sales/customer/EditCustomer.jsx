import React, { useEffect, useState } from "react";
import { Input, Button, message, Row, Col, Select, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusOutlined } from "@ant-design/icons";
import { editcus, Getcus } from "./CustomerReducer/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import { getallcountries } from "../../../setting/countries/countriesreducer/countriesSlice";
import AddCountries from "views/app-views/setting/countries/AddCountries";


const { Option } = Select;

const EditCustomer = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const alldat = useSelector((state) => state.customers);
  const fndata = alldat.customers.data;
  const finddata = fndata.find((item) => item.id === idd);

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  // State to hold initial values
  const [initialValues, setInitialValues] = useState({
    name: "",
    contact: "",
    email: "",
    country_code: getInitialCountry(),
    alternate_country_code: getInitialCountry(),
    billing_country_code: getInitialCountry(),
    shipping_country_code: getInitialCountry(),
    taxnumber: "",
    phoneCode: "",
    alternate_number: "",
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
  });

  // Fetch customer data
  useEffect(() => {
    dispatch(Getcus());
  }, [dispatch]);

  // Update initialValues when finddata is available
  useEffect(() => {
    if (finddata) {
      // Parse JSON strings for billing and shipping addresses
      const billingAddress = JSON.parse(finddata.billing_address || "{}");
      const shippingAddress = JSON.parse(finddata.shipping_address || "{}");

      setInitialValues({
        name: finddata.name || "",
        contact: finddata.contact || "",
        email: finddata.email || "",
        taxnumber: finddata.tax_number || "",
        phoneCode: finddata.phoneCode || "",
        alternate_number: finddata.alternate_number || "",
        billing_name: finddata.name || "",
        billing_phone: finddata.contact || "",
        billing_address: billingAddress.street || "",
        billing_city: billingAddress.city || "",
        billing_state: billingAddress.state || "",
        billing_country: billingAddress.country || "",
        billing_zipcode: billingAddress.zip || "",
        shipping_name: finddata.name || "",
        shipping_phone: finddata.contact || "",
        shipping_address: shippingAddress.street || "",
        shipping_city: shippingAddress.city || "",
        shipping_state: shippingAddress.state || "",
        shipping_country: shippingAddress.country || "",
        shipping_zipcode: shippingAddress.zip || "",
      });
    }
  }, [finddata]);

  const handlePhoneNumberChange = (e, setFieldValue, fieldName) => {
    const value = e.target.value.replace(/\D/g, '');
    setFieldValue(fieldName, value);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Please enter a Name."),
    contact: Yup.string()
      .required("Please enter a Contact Number"),
    email: Yup.string()
      .email("Please enter a valid email address with @.")
      .required("Please enter an email"),
    taxnumber: Yup.string().required("Please enter a Tax Number."),
    alternate_number: Yup.string()
      .nullable()
      .transform((value) => (value === "" ? null : value))
      .required("Please enter an Alternate Number"),
    billing_phone: Yup.string()
      .required("Please enter a phone number"),
    shipping_phone: Yup.string()
      .required("Please enter a phone number"),
    billing_address: Yup.string().required("Please enter a Billing Address."),
    billing_city: Yup.string().required("Please enter a City."),
    billing_state: Yup.string().required("Please enter a State."),
    billing_country: Yup.string().required("Please enter a Country."),
    billing_zipcode: Yup.string().required("Please enter a Zip Code."),
    shipping_name: Yup.string().required("Please enter a Name."),
    shipping_address: Yup.string().required("Please enter a Shipping Address."),
    shipping_city: Yup.string().required("Please enter a City."),
    shipping_state: Yup.string().required("Please enter a State."),
    shipping_country: Yup.string().required("Please enter a Country."),
    shipping_zipcode: Yup.string().required("Please enter a Zip Code."),
  });

  const onSubmit = (values, { resetForm }) => {
    const payload = {
      name: values.name,
      contact: values.contact,
      email: values.email,
      tax_number: values.taxnumber,
      phoneCode: values.phoneCode,
      alternate_number: values.alternate_number,
      billing_address: {
        name: values.billing_name,
        phone: values.billing_phone,
        street: values.billing_address,
        city: values.billing_city,
        state: values.billing_state,
        zip: values.billing_zipcode,
        country: values.billing_country,
      },
      shipping_address: {
        name: values.shipping_name,
        phone: values.shipping_phone,
        street: values.shipping_address,
        city: values.shipping_city,
        state: values.shipping_state,
        zip: values.shipping_zipcode,
        country: values.shipping_country,
      },
    };

    dispatch(editcus({ idd, payload }));
    dispatch(Getcus());
    dispatch(Getcus());
    onClose();

    message.success("Customer updated successfully!");
  };

  if (!finddata) return null;

  return (
    <div className="add-job-form">
      <div className=" ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4">
        <h1 className="mb-4 border-b pb-4 font-medium"></h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
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
                            className="phone-code-select mt-1"
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
                            className="phone-input mt-1"
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
                    <label className="font-semibold">Tax Number</label>
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
                            className="phone-code-select mt-1"
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
                            className="phone-input mt-1"
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
                    <label className="font-semibold">Name </label>
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

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Phone </label>
                    <div className="flex gap-0">
                      <Field name="billing_country_code">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="phone-code-select mt-1"
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
                            className="phone-input mt-1"
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
                    <label className="font-semibold">Address </label>
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
                    <label className="font-semibold">City </label>
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
                    <label className="font-semibold">State </label>
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
                    <label className="font-semibold">Country </label>
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
                    <label className="font-semibold">Zip Code </label>
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
                  <h1 className="font-semibold mb-2 text-lg">
                    Shipping Address
                  </h1>
                </Col>

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Name </label>
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
                    <label className="font-semibold">Phone </label>
                    <div className="flex gap-0">
                      <Field name="shipping_country_code">
                        {({ field }) => (
                          <Select
                            {...field}
                            className="phone-code-select mt-1"
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
                            className="phone-input mt-1"
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
                    <label className="font-semibold">Address </label>
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
                    <label className="font-semibold">City </label>
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
                    <label className="font-semibold">State </label>
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
                    <label className="font-semibold">Country </label>
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
                    <label className="font-semibold">Zip Code </label>
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
                <Button
                  type="default"
                  className="mr-2"
                  onClick={() => navigate("/app/hrm/jobs")}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  UpDate
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

export default EditCustomer;
