import React, { useEffect, useState } from "react";
import { Input, Button, Select, Radio, message, Row, Col } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import {
  editjobapplication,
  getjobapplication,
} from "./JobapplicationReducer/JobapplicationSlice";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getallcountries } from "../../../setting/countries/countriesreducer/countriesSlice";

const { Option } = Select;
const EditJobApplication = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  const alldata = useSelector((state) => state.jobapplications);
  const fnddaa = alldata.jobapplications.data;

  const fnd = fnddaa.find((item) => item.id === idd);

  useEffect(() => {
    dispatch(GetJobdata());
  }, []);

  const countries = useSelector((state) => state.countries.countries);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data;

  useEffect(() => {
    if (fnd) {
      setInitialValues(fnd);
    }
  }, [fnd]);

  useEffect(() => {
    dispatch(getjobapplication());
  }, []);

  const onSubmit = async (values) => {
    try {
      dispatch(editjobapplication({ idd, values })).then(() => {
        dispatch(getjobapplication());
        onClose();
        message.success("Form submitted successfully");
      });
      message.success("Job application added successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      message.error("An error occurred while submitting the job application.");
    }
  };
  const [initialValues, setInitialValues] = useState({
    job: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    total_experience: "",
    current_location: "",
    notice_period: "",
    status: "",
    applied_source: "",
    cover_letter: "",
  });
  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job."),
    name: Yup.string().required("Please enter a name."),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email."),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits.")
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
  });
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
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
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">job</label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select job"
                        loading={!fnddata} // Loading state
                        onChange={(value) => setFieldValue("job", value)}
                        value={values.customer}
                        onBlur={() => setFieldTouched("job", true)}
                      >
                        {fnddata && fnddata.length > 0 ? (
                          fnddata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.title || "Unnamed job"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No customers available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="customer"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Name */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Name</label>
                  <Field name="name" as={Input} placeholder="Enter Name" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Email */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Email</label>
                  <Field name="email" as={Input} placeholder="Enter Email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Phone */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <div className="flex">
                    <Select
                      style={{ width: '30%', marginRight: '8px' }}
                      placeholder="Code"
                      name="phone"
                      onChange={(value) => setFieldValue('phone', value)}
                    >
                      {countries.map((country) => (
                        <Option key={country.id} value={country.phoneCode}>
                          (+{country.phoneCode})
                        </Option>
                      ))}
                    </Select>
                    <Field
                      name="phone"
                      as={Input}
                      style={{ width: '70%' }}
                      placeholder="Enter Phone"
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              {/* Location */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Location</label>
                  <Field
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
                <div className="form-item">
                  <label className="font-semibold">Total Experience</label>
                  <Select
                    placeholder="Select Total Experience"
                    value={values.total_experience}
                    onChange={(value) =>
                      setFieldValue("total_experience", value)
                    }
                    className="w-full"
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
                <div className="form-item">
                  <label className="font-semibold">Current Location</label>
                  <Field
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
                <div className="form-item">
                  <label className="font-semibold">Notice Period</label>
                  <Select
                    placeholder="Select Notice Period"
                    value={values.notice_period}
                    onChange={(value) => setFieldValue("notice_period", value)}
                    className="w-full"
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
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Radio.Group
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
                <div className="form-item">
                  <label className="font-semibold">Applied Sources</label>
                  <Field
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
              {/* Cover Letter */}
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Cover Letter</label>
                  <ReactQuill
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
    </div>
  );
};
export default EditJobApplication;
