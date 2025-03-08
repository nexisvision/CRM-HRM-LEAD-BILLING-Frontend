import React, { useEffect, useState } from "react";
import { Input, Button, Select, Radio, message, Row, Col, Upload,Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import {
  Addjobapplication,
  getjobapplication,
} from "./JobapplicationReducer/JobapplicationSlice";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getallcountries } from "../../../setting/countries/countriesreducer/countriesSlice";
import { UploadOutlined,PlusOutlined } from "@ant-design/icons";
import AddCountries from "views/app-views/setting/countries/AddCountries";

const { Option } = Select;
const AddJobApplication = ({ onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetJobdata());
  }, []);

const user = useSelector((state) => state.user.loggedInUser.username);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data || [];

  const fnddtaa = fnddata.filter((item) => item.created_by === user);
  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const [isAddPhoneCodeModalVisible, setIsAddPhoneCodeModalVisible] = useState(false);

  const getInitialCountry = () => {
    if (countries?.length > 0) {
      const indiaCode = countries.find(c => c.countryCode === 'IN');
      return indiaCode?.phoneCode || "+91";
    }
    return "+91";
  };

  const onSubmit = async (values) => {
    try {
      dispatch(Addjobapplication(values)).then(() => {
        dispatch(getjobapplication());
        onClose();
        // message.success("Form submitted successfully");
      });
      // message.success("Job application added successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      message.error("An error occurred while submitting the job application.");
    }
  };
  const handlePhoneNumberChange = (e, setFieldValue) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setFieldValue('phone', value);
    }
  };
  const initialValues = {
    job: "",
    name: "",
    email: "",
    phone: "",
    phoneCode: getInitialCountry(),
    location: "",
    total_experience: "",
    current_location: "",
    notice_period: "",
    status: "active",
    applied_source: "",
    cover_letter: "",
    cv: null,
  };
  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job."),
    name: Yup.string().required("Please enter a name."),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email."),
    phone: Yup.string()
      .required("Please enter a phone number."),
    location: Yup.string().required("Please enter a location."),
    total_experience: Yup.string().required(
      "Please select your total experience."
    ),
    current_location: Yup.string().required(
      "Please enter your current location."
    ),
    notice_period: Yup.string().required("Please select your notice period."),
    status: Yup.string().required("Please select a status."),
    applied_source: Yup.string().required("Please enter the applied source."),
    cover_letter: Yup.string().required("Please enter a cover letter."),
    // cv: Yup.mixed().required("Please upload a CV."),
  });
  return (
    <div>
      <h2 className="mb-3 border-b pb-1 font-medium"></h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, setFieldTouched, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              {/* Job */}

              <Col span={12}>
                <div className="form-item">
               {/* <hr className="border-b-2 border-gray-300"></hr> */}
                  <label className="font-semibold">job <span className="text-red-500">*</span></label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select job"
                        loading={!fnddtaa} // Loading state
                        onChange={(value) => setFieldValue("job", value)}
                        value={values.customer}
                        onBlur={() => setFieldTouched("job", true)}
                      >
                        {fnddtaa && fnddtaa.length > 0 ? (
                          fnddtaa.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.title || "Unnamed job"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No job available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="job"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Name */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                  <Field name="name" as={Input} placeholder="Enter Name"  className="w-full mt-1"/>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Email */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                  <Field name="email" as={Input} placeholder="Enter Email"  className="w-full mt-2"/>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Phone */}
              <Col span={12}>
                <div className="form-group">
                  <label className="text-gray-600 font-semibold mb-2 block">Phone <span className="text-red-500">*</span></label>
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
                          // defaultValue={getInitialPhoneCode()}
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
                          // prefix={
                          //   values.phoneCode && (
                          //     <span className="text-gray-600 font-medium mr-1">
                          //       {values.phoneCode}
                          //     </span>
                          //   )
                          // }
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 mt-1 text-sm" />
                </div>
              </Col>
              {/* Location */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Location <span className="text-red-500">*</span></label>
                  <Field
                   className="w-full mt-1"
                    name="location"
                    as={Input}
                    placeholder="Enter Location"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Total Experience */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Total Experience <span className="text-red-500">*</span></label>
                  <Select
                   className="w-full mt-1"
                    placeholder="Select Total Experience"
                    value={values.total_experience}
                    onChange={(value) =>
                      setFieldValue("total_experience", value)
                    }
                  
                  >
                    <Option value="0-1">0-1 Years</Option>
                    <Option value="1-3">1-3 Years</Option>
                    <Option value="3-5">3-5 Years</Option>
                    <Option value="5+">5+ Years</Option>
                  </Select>
                  <ErrorMessage
                    name="total_experience"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Current Location */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Current Location <span className="text-red-500">*</span></label>
                  <Field
                   className="w-full mt-1"
                    name="current_location"
                    as={Input}
                    placeholder="Enter Current Location"
                  />
                  <ErrorMessage
                    name="current_location"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Notice Period */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Notice Period <span className="text-red-500">*</span></label>
                  <Select
                    placeholder="Select Notice Period"
                    value={values.notice_period}
                    onChange={(value) => setFieldValue("notice_period", value)}
                     className="w-full mt-1"
                  >
                    <Option value="immediate">Immediate</Option>
                    <Option value="15 days">15 Days</Option>
                    <Option value="1 month">1 Month</Option>
                    <Option value="2 months">2 Months</Option>
                  </Select>
                  <ErrorMessage
                    name="notice_period"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Status */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold grid grid-cols-1">Status </label>
                  <Radio.Group
                   className="w-full mt-2"
                    value={values.status}
                    onChange={(e) => setFieldValue("status", e.target.value)}
                  >
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Applied Source */}
              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Applied Sources <span className="text-red-500">*</span></label>
                  <Field
                   className="w-full mt-1"
                    name="applied_source"
                    as={Input}
                    placeholder="Enter Applied Sources"
                  />
                  <ErrorMessage
                    name="applied_source"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* CV Upload */}
              {/* <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Upload CV </label>
                  <Field name="cv">
                    {({ field, form }) => (
                      <Upload
                        className="w-full mt-1"
                        action="http://localhost:5500/api/users/upload-cv"
                        accept=".pdf"
                        maxCount={1}
                        showUploadList={{ showRemoveIcon: true }}
                        onChange={({ file }) => {
                          form.setFieldValue('cv', file);
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                      </Upload>
                    )}
                  </Field>
                  <ErrorMessage
                    name="cv"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              {/* Cover Letter */}
              <Col span={24}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Cover Letter <span className="text-red-500">*</span> </label>
                  <ReactQuill
                   className="w-full mt-1"
                    value={values.cover_letter}
                    onChange={(value) => setFieldValue("cover_letter", value)}
                    onBlur={() => setFieldTouched("cover_letter", true)}
                    placeholder="Enter Cover Letter"
                  />
                  <ErrorMessage
                    name="cover_letter"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
             
            </Row>
            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <Button style={{ marginRight: 8 }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
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
       
        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }

        .ant-select-dropdown .ant-select-item-option-content > div {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
        }

        //    .contract-select .ant-select-selection-item {
        //   display: flex !important;
        //   align-items: center !important;
        //   justify-content: center !important;
        //   font-size: 16px !important;
        // }

        // .contract-select .ant-select-selection-item > div {
        //   display: flex !important;
        //   align-items: center !important;
        // }

        // .contract-select .ant-select-selection-item span:not(:first-child) {
        //   display: none !important;
        // }

        .phone-code-select .ant-select-selector {
          // height: 32px !important;
          // padding: 0 8px !important;
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

        // .phone-input::-webkit-inner-spin-button,
        // .phone-input::-webkit-outer-spin-button {
        //   -webkit-appearance: none;
        //   margin: 0;
        // }

        // .phone-input {
        //   -moz-appearance: textfield;
        // }
      `}</style>

    </div>
  );
};
export default AddJobApplication;
