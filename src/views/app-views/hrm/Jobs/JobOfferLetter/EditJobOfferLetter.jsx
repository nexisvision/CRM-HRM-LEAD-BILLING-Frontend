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
} from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { GetJobdata } from "../JobReducer/JobSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
import {
  Addjobofferss,
  editjobofferss,
  getjobofferss,
} from "./jobOfferletterReducer/jobofferlateerSlice";
import moment from "moment/moment";
const { Option } = Select;

const EditJobOfferLetter = ({ idd, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetJobdata());
  }, [dispatch]);

  const customerdata = useSelector((state) => state.Jobs);
  const fnddata = customerdata.Jobs.data;

  useEffect(() => {
    dispatch(getjobapplication());
  }, [dispatch]);

  const customerdatass = useSelector((state) => state.jobapplications);
  const fnddatass = customerdatass.jobapplications.data;

  useEffect(() => {
    dispatch(getjobapplication());
  }, [dispatch]);

  const customerdatassss = useSelector((state) => state.joboffers);
  const fnddatassss = customerdatassss.joboffers.data;

  useEffect(() => {
    if (fnddatassss) {
      const findofferdatas = fnddatassss.find((item) => item.id === idd);
      if (findofferdatas) {
        setInitialValues({
          job: findofferdatas.job,
          job_applicant: findofferdatas.job_applicant,
          offer_expiry: moment(findofferdatas.offer_expiry, "YYYY-MM-DD"),
          expected_joining_date: moment(
            findofferdatas.expected_joining_date,
            "YYYY-MM-DD"
          ), // Ensure moment conversion
          salary: findofferdatas.salary,
          description: findofferdatas.description,
          file: null,
        });
      }
    }
  }, [fnddatassss]);

  const onSubmit = async (values, { resetForm }) => {
    try {
      // Check for file and convert to base64 if present
      let fileBase64 = null;
      if (values.file) {
        const reader = new FileReader();
        reader.readAsDataURL(values.file.file);
        reader.onloadend = async () => {
          fileBase64 = reader.result;

          // Prepare the payload object
          const payload = {
            job: values.job,
            job_applicant: values.job_applicant,
            offer_expiry: values.offer_expiry,
            expected_joining_date: values.expected_joining_date,
            salary: values.salary,
            description: values.description,
            file: fileBase64,
          };

          const response = await dispatch(editjobofferss({ idd, payload }));

          if (response && response.payload) {
            dispatch(getjobofferss());
            onClose();
            resetForm();
            message.success("Job offer letter added successfully!");
          } else {
            message.error("Failed to add the job offer letter.");
          }
        };
      } else {
        const payload = {
          job: values.job,
          job_applicant: values.job_applicant,
          offer_expiry: values.offer_expiry,
          expected_joining_date: values.expected_joining_date,
          salary: values.salary,
          description: values.description,
        };

        const response = await dispatch(editjobofferss({ idd, payload }));

        if (response && response.payload) {
          dispatch(getjobofferss());
          onClose();
          resetForm();
          message.success("Job offer letter added successfully!");
        } else {
          message.error("Failed to add the job offer letter.");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error("An error occurred while submitting the job offer letter.");
    }
  };

  const [initialValues, setInitialValues] = useState({
    job: "",
    job_applicant: "",
    offer_expiry: "",
    expected_joining_date: "",
    salary: "",
    description: "",
    file: null,
  });

  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job."),
    job_applicant: Yup.string().required("Please enter a job Application."),
    offer_expiry: Yup.string().required("Please enter an offer_expiry."),
    expected_joining_date: Yup.string().required(
      "Please enter a phone expected Joining Date."
    ),
    salary: Yup.string().required("Please enter a salary."),
    description: Yup.string().required("Please enter a description."),
  });

  return (
    <div>
      <hr style={{ marginBottom: "20px", border: "1px solid #E8E8E8" }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          resetForm,
        }) => (
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
                        className="w-full"
                        placeholder="Select job"
                        loading={!fnddatass}
                        onChange={(value) => setFieldValue("job", value)}
                        value={values.job}
                        onBlur={() => setFieldTouched("job", true)}
                      >
                        {fnddatass && fnddatass.length > 0 ? (
                          fnddatass.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.name || "Unnamed job"}
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
                        className="w-full"
                        placeholder="Select job application"
                        loading={!fnddata}
                        onChange={(value) =>
                          setFieldValue("job_applicant", value)
                        }
                        value={values.job_applicant}
                        onBlur={() => setFieldTouched("job_applicant", true)}
                      >
                        {fnddata && fnddata.length > 0 ? (
                          fnddata.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.title || "Unnamed job application"}
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
                    name="job_applicant"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label >Offer Expire On</label>
                  <DatePicker
                    className="w-full mt-2"
                    format="DD-MM-YYYY"
                    value={values.offer_expiry}
                    onChange={(date) => setFieldValue("offer_expiry", date)}
                    onBlur={() => setFieldTouched("offer_expiry", true)}
                  />
                  <ErrorMessage
                    name="offer_expiry"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label >Expected Joining Date</label>
                 
                  <DatePicker
                    className="w-full mt-2"
                    format="DD-MM-YYYY"
                    value={values.expected_joining_date}
                    onChange={(date) =>
                      setFieldValue("expected_joining_date", date)
                    }
                    onBlur={() =>
                      setFieldTouched("expected_joining_date", true)
                    }
                  />
                  <ErrorMessage
                    name="expected_joining_date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label >Salary</label>
                  <Field
                  className="mt-2"
                    name="salary"
                    as={Input}
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
                  <label>Rate</label>
                  <Field
                  className="mt-2"
                    name="rate"
                    as={Input}
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
                  <label >Description</label>
                  <ReactQuill
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

              <div className="mt-2 w-full">
                <span className="block p-2">Add File</span>
                <Col span={24}>
                  <Upload
                    listType="picture"
                    accept=".pdf"
                    maxCount={1}
                    showUploadList={{ showRemoveIcon: true }}
                    className="border-2 flex justify-center items-center p-10 mt-2"
                  >
                    <span className="text-xl">Choose File</span>
                  </Upload>
                </Col>
              </div>
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

export default EditJobOfferLetter;
