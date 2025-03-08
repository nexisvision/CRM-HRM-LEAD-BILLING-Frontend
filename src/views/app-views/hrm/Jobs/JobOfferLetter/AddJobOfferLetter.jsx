import React, { useEffect, useState } from "react";
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
    rate: Yup.string().required("Please enter a rate"),
    offer_expiry: Yup.date().required("Please select an offer expiry date"),
    expected_joining_date: Yup.date().required("Please select an expected joining date"),
    salary: Yup.string().required("Please enter a salary"),
    description: Yup.string().required("Please enter a description"),
  });

  const [fileList, setFileList] = useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

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
          // Validate file type and size before appending
          const file = formattedValues[key];
          const isValidFileType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
          const isValidFileSize = file.size / 1024 / 1024 < 5;

          if (!isValidFileType) {
            throw new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.');
          }
          if (!isValidFileSize) {
            throw new Error('File size must be less than 5MB.');
          }

          formData.append('file', file);
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
              // padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Job Application <span className="text-red-500">*</span></label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
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

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Job <span className="text-red-500">*</span></label>
                  <Field name="job_applicant">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
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

              <Col span={12} className='mt-3'>
                <div className="form-item">
                  <label className='font-semibold'>Offer Expire On <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
                    format="DD-MM-YYYY"
                    value={values.offer_expiry}
                    onChange={(date) => {
                      setFieldValue('offer_expiry', date);
                      // Clear expected joining date if it's before the new offer expiry date
                      if (values.expected_joining_date && date && values.expected_joining_date.isBefore(date)) {
                        setFieldValue('expected_joining_date', null);
                      }
                    }}
                    onBlur={() => setFieldTouched("offer_expiry", true)}
                  />
                  <ErrorMessage name="offer_expiry" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-3'>
                <div className="form-item">
                  <label className='font-semibold'>Expected Joining Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
                    format="DD-MM-YYYY"
                    value={values.expected_joining_date}
                    onChange={(date) => setFieldValue('expected_joining_date', date)}
                    onBlur={() => setFieldTouched("expected_joining_date", true)}
                    disabledDate={(current) => {
                      // Disable dates before offer expiry date
                      return values.offer_expiry ? current && current < values.offer_expiry.startOf('day') : false;
                    }}
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
                <div className="form-item mt-3">
                  <label className="font-semibold">Salary <span className="text-red-500">*</span></label>
                  <Field
                    name="salary"
                    as={Input}
                    className="mt-1 w-full"
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
                <div className="form-item mt-3">
                  <label className="font-semibold">Rate <span className="text-red-500">*</span></label>
                  <Field
                    name="rate"
                    as={Input}
                    className="mt-1 w-full"
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
                <div className="form-item mt-3">
                  <label className="font-semibold">Description <span className="text-red-500">*</span></label>
                  <ReactQuill
                    theme="snow"
                    className="mt-1 w-full"
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

              <Col span={24}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment 
                  </label>
                  <Upload
                    beforeUpload={(file) => {
                      const isValidFileType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
                      const isValidFileSize = file.size / 1024 / 1024 < 5;

                      if (!isValidFileType) {
                        message.error('You can only upload JPG/PNG/PDF files!');
                        return Upload.LIST_IGNORE;
                      }
                      if (!isValidFileSize) {
                        message.error('File must be smaller than 5MB!');
                        return Upload.LIST_IGNORE;
                      }

                      setFieldValue("file", file);
                      return false;
                    }}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />} className="bg-white">
                      Select File
                    </Button>
                  </Upload>
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

export default AddJobOfferLetter;
