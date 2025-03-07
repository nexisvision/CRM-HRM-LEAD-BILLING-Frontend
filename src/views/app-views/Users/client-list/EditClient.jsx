import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  message,
  Row,
  Col,
  Select,
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { ClientData, Editclient } from "./CompanyReducers/CompanySlice";
import Upload from "antd/es/upload/Upload";
import { UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons";
import { getallcountries } from "views/app-views/setting/countries/countriesreducer/countriesSlice";
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;

const EditClient = ({ comnyid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClientData());
  }, []);

  const AllSubClient = useSelector((state) => state.SubClient);
  const fnddatas = AllSubClient.SubClient.data;

  useEffect(() => {
    const clientData = fnddatas.find((item) => item.id === comnyid);

    if (clientData) {
      setInitialValues({
        // Personal Information
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        username: clientData.username || "",
        gender: clientData.gender || "other",
        phoneCode: clientData.phoneCode || "+91",
        phone: clientData.phone || "",

        // Bank Details
        bankname: clientData.bankname || "",
        ifsc: clientData.ifsc || "",
        banklocation: clientData.banklocation || "",
        accountholder: clientData.accountholder || "",
        accountnumber: clientData.accountnumber || "",
        accounttype: clientData.accounttype || "",

        // Business Information
        website: clientData.website || "",
        gstIn: clientData.gstIn || "",
        e_signature: clientData.e_signature || "",

        // Address Information
        address: clientData.address || "",
        city: clientData.city || "",
        state: clientData.state || "",
        country: clientData.country || "",
        zipcode: clientData.zipcode || "",

        // Profile Picture
        profilePic: clientData.profilePic || "",
      });
    }
  }, [fnddatas]);

  const onSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    dispatch(Editclient({ comnyid, formData }))
      .then(() => {
        dispatch(ClientData());
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error("Error during submit:", error);
        message.error("Failed to edit client");
      });
  };

  const [initialValues, setInitialValues] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    username: "",
    gender: "other",
    phoneCode: "+91",
    phone: "",

    // Bank Details
    bankname: "",
    ifsc: "",
    banklocation: "",
    accountholder: "",
    accountnumber: "",
    accounttype: "",

    // Business Information
    website: "",
    gstIn: "",
    e_signature: "",

    // Address Information
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",

    // Profile Picture
    profilePic: "",
  });

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);
  const countries = useSelector((state) => state.countries?.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phone', value);
    }
  };

  const validationSchema = Yup.object().shape({
    // Personal Information
    firstName: Yup.string()
      .required("Please enter a First Name.")
      .min(2, "First Name must be at least 2 characters long."),
    lastName: Yup.string()
      .required("Please enter a Last Name.")
      .min(2, "Last Name must be at least 2 characters long."),
    username: Yup.string()
      .required("Please enter a username")
      .min(3, "Username must be at least 3 characters long"),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other'], "Please select a valid gender"),
    phoneCode: Yup.string(),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits"),

    // Bank Details
    bankname: Yup.string()
      .required("Please enter a Bank Name.")
      .min(3, "Bank Name must be at least 3 characters long."),
    ifsc: Yup.string()
      .required("Please enter an IFSC."),
    banklocation: Yup.string()
      .required("Please enter a Bank Location."),
    accountholder: Yup.string()
      .required("Please enter an Account Holder."),
    accountnumber: Yup.string()
      .required("Please enter an Account Number."),
    accounttype: Yup.string(),

    // Business Information
    website: Yup.string()
      .url("Please enter a valid URL"),
    gstIn: Yup.string()
      .required("Please enter a GSTIN."),
    e_signature: Yup.string(),

    // Address Information
    address: Yup.string()
      .required("Please enter an Address."),
    city: Yup.string()
      .required("Please enter a City."),
    state: Yup.string()
      .required("Please enter a State."),
    country: Yup.string()
      .required("Please enter a Country."),
    zipcode: Yup.string()
      .required("Please enter a Zipcode."),
  });

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
        validateOnSubmit={true}
      >
        {({
          values,
          handleSubmit,
          isSubmitting,
          isValid,
          dirty,
          setFieldValue,
          errors,
        }) => {
  

          return (
            <Form className="formik-form" onSubmit={handleSubmit}>
              <Row gutter={16}>
                {/* Personal Information Section */}
                <Col span={24}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h3>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">First Name <span className="text-red-500">*</span></label>
                    <Field
                      name="firstName"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Last Name <span className="text-red-500">*</span></label>
                    <Field
                      name="lastName"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Username <span className="text-red-500">*</span></label>
                    <Field
                      name="username"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Gender</label>
                    <Field name="gender">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Gender"
                          onChange={(value) => form.setFieldValue("gender", value)}
                        >
                          <Option value="male">Male</Option>
                          <Option value="female">Female</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-group">
                    <label className="text-gray-600 font-semibold mb-2 block">Phone</label>
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
                                setFieldValue('phoneCode', value || '+91');
                              }
                            }}
                            value={values.phoneCode || '+91'}
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
                      <Field name="phone">
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
                            placeholder="Enter phone number"
                            onChange={(e) => handlePhoneNumberChange(e, setFieldValue)}
                          />
                        )}
                      </Field>
                    </div>
                    <ErrorMessage name="phone" component="div" className="text-red-500 mt-1 text-sm" />
                  </div>
                </Col>

                {/* Bank Details Section */}
                <Col span={24} className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Bank Details</h3>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Bank Name <span className="text-red-500">*</span></label>
                    <Field
                      name="bankname"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Bank Name"
                    />
                    <ErrorMessage
                      name="bankname"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">IFSC <span className="text-red-500">*</span></label>
                    <Field
                      name="ifsc"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter IFSC"
                    />
                    <ErrorMessage
                      name="ifsc"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Bank Location <span className="text-red-500">*</span></label>
                    <Field
                      name="banklocation"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Bank Location"
                    />
                    <ErrorMessage
                      name="banklocation"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Account Holder <span className="text-red-500">*</span></label>
                    <Field
                      name="accountholder"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Account Holder"
                    />
                    <ErrorMessage
                      name="accountholder"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Account Number <span className="text-red-500">*</span></label>
                    <Field
                      name="accountnumber"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Account Number"
                    />
                    <ErrorMessage
                      name="accountnumber"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Account Type <span className="text-red-500">*</span></label>
                    <Field name="accounttype">
                      {({ field, form }) => (
                        <Select
                          {...field}
                          className="w-full mt-2"
                          placeholder="Select Account Type"
                          onChange={(value) => form.setFieldValue("accounttype", value)}
                        >
                          <Option value="savings">Savings</Option>
                          <Option value="current">Current</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      )}
                    </Field>
                    <ErrorMessage
                      name="accounttype"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* Business Information Section */}
                <Col span={24} className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Business Information</h3>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Website</label>
                    <Field
                      name="website"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Website URL"
                    />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">GSTIN <span className="text-red-500">*</span></label>
                    <Field
                      name="gstIn"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter GSTIN"
                    />
                    <ErrorMessage
                      name="gstIn"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* Address Information Section */}
                <Col span={24} className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Address Information</h3>
                </Col>

                <Col span={24} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Address <span className="text-red-500">*</span></label>
                    <Field
                      name="address"
                      as={Input.TextArea}
                      className="w-full mt-2"
                      placeholder="Enter Address"
                      rows={4}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">City <span className="text-red-500">*</span></label>
                    <Field
                      name="city"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter City"
                    />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">State <span className="text-red-500">*</span></label>
                    <Field
                      name="state"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter State"
                    />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Country <span className="text-red-500">*</span></label>
                    <Field
                      name="country"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Country"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                <Col span={12} className="mt-2">
                  <div className="form-item">
                    <label className="font-semibold">Zipcode <span className="text-red-500">*</span></label>
                    <Field
                      name="zipcode"
                      as={Input}
                      className="w-full mt-2"
                      placeholder="Enter Zipcode"
                    />
                    <ErrorMessage
                      name="zipcode"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* Profile Picture Section */}
                <Col span={24} className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Profile Picture</h3>
                </Col>

                <Col span={24} className="mt-2">
                  <Field name="profilePic">
                    {({ field }) => (
                      <div>
                        <Upload
                          beforeUpload={(file) => {
                            setFieldValue("profilePic", file);
                            return false;
                          }}
                          showUploadList={false}
                        >
                          <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
                        </Upload>
                      </div>
                    )}
                  </Field>
                </Col>
              </Row>

              <div className="form-buttons text-right mt-2">
                <Button type="default" className="mr-2" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  Save Changes
                </Button>
              </div>

              {/* Add Modal for Country Code */}
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

              {/* Add styles */}
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
          );
        }}
      </Formik>
    </div>
  );
};

export default EditClient;
