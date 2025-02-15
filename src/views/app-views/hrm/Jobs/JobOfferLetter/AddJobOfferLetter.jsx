import React, { useEffect } from "react";
import {
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Upload,
  Form as AntForm,
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
import {
  Addjobofferss,
  getjobofferss,
} from "./jobOfferletterReducer/jobofferlateerSlice";
import { QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Option } = Select;

const AddJobOfferLetter = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);

  useEffect(() => {
    dispatch(GetJobdata());
    dispatch(getjobapplication());
  }, [dispatch]);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data || [];
  const fnd = fnddata.filter((item) => item.created_by === user);

  const customerdatass = useSelector((state) => state.jobapplications);
  const fnddatass = customerdatass.jobapplications.data || [];
  const fnddtaa = fnddatass.filter((item) => item.created_by === user);

  const initialValues = {
    job: "",
    job_applicant: "",
    offer_expiry: null,
    expected_joining_date: null,
    salary: "",
    rate: "",
    description: "",
    file: null,
  };

  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job"),
    job_applicant: Yup.string().required("Please select a job application"),
    offer_expiry: Yup.date().required("Please select an offer expiry date"),
    expected_joining_date: Yup.date().required("Please select an expected joining date"),
    salary: Yup.string().required("Please enter a salary"),
    description: Yup.string().required("Please enter a description"),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      
      // Format dates
      const formattedValues = {
        ...values,
        offer_expiry: values.offer_expiry ? moment(values.offer_expiry).format('YYYY-MM-DD') : null,
        expected_joining_date: values.expected_joining_date ? moment(values.expected_joining_date).format('YYYY-MM-DD') : null,
      };

      // Append all form values to FormData
      Object.keys(formattedValues).forEach(key => {
        if (key === 'file' && formattedValues[key]) {
          formData.append('file', formattedValues[key]);
        } else if (formattedValues[key] !== null && formattedValues[key] !== undefined) {
          formData.append(key, formattedValues[key]);
        }
      });

      await dispatch(Addjobofferss(formData)).unwrap();
      await dispatch(getjobofferss());
      message.success('Job offer letter added successfully');
      onClose();
      resetForm();
    } catch (error) {
      message.error(error?.message || 'Failed to add job offer letter');
    }
  };

  return (
    <div>
      <hr style={{ border: "1px solid #E8E8E8" }} />
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
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Job Application</label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select job"
                        loading={!fnddtaa}
                        onChange={(value) => setFieldValue("job", value)}
                        onBlur={() => setFieldTouched("job", true)}
                      >
                        {fnddtaa?.length > 0 ? (
                          fnddtaa.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.name || "Unnamed job"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No job applications available
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

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Job</label>
                  <Field name="job_applicant">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        placeholder="Select job"
                        loading={!fnd}
                        onChange={(value) => setFieldValue("job_applicant", value)}
                        onBlur={() => setFieldTouched("job_applicant", true)}
                      >
                        {fnd?.length > 0 ? (
                          fnd.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.title || "Unnamed job"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No jobs available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="job_applicant"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Offer Expire On</label>
                  <DatePicker
                    className="w-full mt-2"
                    format="YYYY-MM-DD"
                    value={values.offer_expiry ? moment(values.offer_expiry) : null}
                    onChange={(date) => setFieldValue("offer_expiry", date)}
                    onBlur={() => setFieldTouched("offer_expiry", true)}
                  />
                  <ErrorMessage
                    name="offer_expiry"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Offer Expire On</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.offer_expiry}
                    onChange={(offer_expiry) => setFieldValue('offer_expiry', offer_expiry)}
                    onBlur={() => setFieldTouched("offer_expiry", true)}
                  />
                  <ErrorMessage name="offer_expiry" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Expected Joining Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.expected_joining_date}
                    onChange={(expected_joining_date) => setFieldValue('expected_joining_date', expected_joining_date)}
                    onBlur={() => setFieldTouched("expected_joining_date", true)}
                  />
                  <ErrorMessage name="expected_joining_date" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Expected Joining Date</label>
                  <DatePicker
                    className="w-full mt-2"
                    format="YYYY-MM-DD"
                    value={values.expected_joining_date ? moment(values.expected_joining_date) : null}
                    onChange={(date) => setFieldValue("expected_joining_date", date)}
                    onBlur={() => setFieldTouched("expected_joining_date", true)}
                  />
                  <ErrorMessage
                    name="expected_joining_date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Salary</label>
                  <Field
                    name="salary"
                    as={Input}
                    className="mt-2"
                    placeholder="Enter Salary"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Rate</label>
                  <Field
                    name="rate"
                    as={Input}
                    className="mt-2 w-full"
                    placeholder="Enter Rate"
                  />
                  <ErrorMessage
                    name="rate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    theme="snow"
                    className="mt-2"
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    onBlur={() => setFieldTouched("description", true)}
                    placeholder="Enter Description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <span className="block font-semibold p-2">
                  Add <QuestionCircleOutlined />
                </span>
                <Field name="file">
                  {({ field }) => (
                    <div>
                      <Upload
                        beforeUpload={(file) => {
                          setFieldValue("file", file); // Set file in Formik state
                          return false; // Prevent auto upload
                        }}
                        showUploadList={false}
                      >
                        <Button icon={<UploadOutlined />}>Choose File</Button>
                      </Upload>
                    </div>
                  )}
                </Field>
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

export default AddJobOfferLetter;
