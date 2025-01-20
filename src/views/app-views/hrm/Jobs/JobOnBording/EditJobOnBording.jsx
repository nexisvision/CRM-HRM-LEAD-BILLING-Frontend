import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Import axios for API requests
import { getJobonBoarding } from "./JobOnBoardingReducer/jobonboardingSlice";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const EditJobOnBording = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const alldata = useSelector((state) => state.jobonboarding);
  const fnddtaa = alldata.jobonboarding.data;

  const fnd = fnddtaa.find((item) => item.id === idd);

  useEffect(() => {
    dispatch(getJobonBoarding());
  }, []);

  useEffect(() => {
    if (fnd) {
      setInitialValues({
        related_id: fnd.related_id,
        interviewer: fnd.interviewer,
        joiningDate: fnd.joiningDate ? new Date(fnd.joiningDate) : null,
        daysOfWeek: fnd.daysOfWeek,
        salary: fnd.salary,
        salaryType: fnd.salaryType,
        salaryDuration: fnd.salaryDuration,
        jobType: fnd.jobType,
        status: fnd.status,
      });
    }
  }, [fnd]);

  // Submit the form data
  const onSubmit = async (values, { resetForm }) => {
    try {
      const data = {
        related_id: values.related_id,
        Interviewer: values.interviewer,
        JoiningDate: values.joiningDate
          ? values.joiningDate.format("YYYY-MM-DD")
          : null,
        DaysOfWeek: values.daysOfWeek,
        Salary: values.salary,
        SalaryType: values.salaryType,
        SalaryDuration: values.salaryDuration,
        JobType: values.jobType,
        Status: values.status,
      };

      dispatch(EditJobOnBording(data)).then(() => {
        dispatch(getJobonBoarding());
        message.success("Job Candidate added successfully!");
        resetForm();
        onClose();
      });
    } catch (error) {
      message.error("Failed to add job candidate. Please try again.");
      console.error(error);
    }
  };

  const [initialValues, setInitialValues] = useState({
    related_id: "",
    interviewer: "",
    joiningDate: null,
    daysOfWeek: "",
    salary: "",
    salaryType: "",
    salaryDuration: "",
    jobType: "",
    status: "",
  });

  const validationSchema = Yup.object({
    interviewer: Yup.string().required("Please Select a interviewer."),
    joiningDate: Yup.date().nullable().required("Joining Date is required."),
    daysOfWeek: Yup.string().required("Please enter days of the week."),
    salary: Yup.string().required("Please enter a salary."),
    salaryType: Yup.string().required("Please select salary type."),
    salaryDuration: Yup.string().required("Please select a salary duration."),
    jobType: Yup.string().required("Please select a job type."),
    status: Yup.string().required("Please select a status."),
  });

  return (
    <div className="add-job-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
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
          <Form
            layout="vertical"
            name="add-job"
            className="formik-form"
            onSubmit={handleSubmit}
          >
            <Row gutter={16}>
              {/* Interviewer */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Interviewer</label>
                  <Field name="interviewer">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Interviewer"
                        onChange={(value) =>
                          setFieldValue("interviewer", value)
                        }
                        value={values.interviewer}
                        onBlur={() => setFieldTouched("interviewer", true)}
                      >
                        <Option value="interviewer1">Interviewer 1</Option>
                        <Option value="interviewer2">Interviewer 2</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="interviewer"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Joining Date */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Joining Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.joiningDate}
                    onChange={(joiningDate) =>
                      setFieldValue("joiningDate", joiningDate)
                    }
                    onBlur={() => setFieldTouched("joiningDate", true)}
                  />
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Days of Week */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Days Of Week</label>
                  <Field
                    name="daysOfWeek"
                    as={Input}
                    placeholder="Enter Days Of Week"
                  />
                  <ErrorMessage
                    name="daysOfWeek"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Salary */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Salary</label>
                  <Field name="salary" as={Input} placeholder="Enter Salary" />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Salary Type */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Salary Type</label>
                  <Field name="salaryType">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Salary Type"
                        onChange={(value) => setFieldValue("salaryType", value)}
                        value={values.salaryType}
                        onBlur={() => setFieldTouched("salaryType", true)}
                      >
                        <Option value="hourly">Hourly Payslip</Option>
                        <Option value="monthly">Monthly Payslip</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="salaryType"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Salary Duration */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Salary Duration</label>
                  <Field name="salaryDuration">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Salary Duration"
                        onChange={(value) =>
                          setFieldValue("salaryDuration", value)
                        }
                        value={values.salaryDuration}
                        onBlur={() => setFieldTouched("salaryDuration", true)}
                      >
                        <Option value="weekly">Weekly</Option>
                        <Option value="biweekly">Biweekly</Option>
                        <Option value="monthly">Monthly</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="salaryDuration"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Job Type */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Job Type</label>
                  <Field name="jobType">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Job Type"
                        onChange={(value) => setFieldValue("jobType", value)}
                        value={values.jobType}
                        onBlur={() => setFieldTouched("jobType", true)}
                      >
                        <Option value="fulltime">Full Time</Option>
                        <Option value="parttime">Part Time</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="jobType"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Status */}
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Status"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                        onBlur={() => setFieldTouched("status", true)}
                      >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-2">
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
    </div>
  );
};

export default EditJobOnBording;
