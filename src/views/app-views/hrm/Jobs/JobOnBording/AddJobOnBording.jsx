import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col, Modal } from "antd";
import { useNavigate } from "react-router-dom";

import { PlusOutlined } from "@ant-design/icons";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios"; // Import axios for API requests
import {
  AddJobonBoarding,
  getJobonBoarding,
} from "./JobOnBoardingReducer/jobonboardingSlice";
import { useDispatch , useSelector} from "react-redux";
import { AddLable, GetLable } from "../../../dashboards/sales/LableReducer/LableSlice";

const { Option } = Select;

const AddJobOnBoarding = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // status start
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);

  const lid = AllLoggedData.loggedInUser.id;
  const fetchLables = async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));
  
      if (response.payload && response.payload.data) {
        const uniqueStatuses = response.payload.data
          .filter((label) => label && label.name && label.lableType === lableType) // Filter by lableType
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name) // Remove duplicates
          );
  
        setter(uniqueStatuses);
      }
    } catch (error) {
      console.error(`Failed to fetch ${lableType}:`, error);
      message.error(`Failed to load ${lableType}`);
    }
  };
  
  useEffect(() => {
    fetchLables("job-on-bording-status", setStatuses);
  }, []);
  
  const handleAddNewStatus = async (newValue, setter, modalSetter, setFieldValue) => {
    if (!newValue.trim()) {
      message.error("Please enter a Job On Boarding Status name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newValue.trim(),
        lableType: "job-on-bording-status",
      };

      await dispatch(AddLable(lid, payload));
      message.success("Job On Boarding Status added successfully");
      setter(""); // Reset input field
      modalSetter(false); // Close modal

      // Fetch updated statuses and update the form field
      const response = await dispatch(GetLable(lid));
      if (response.payload && response.payload.data) {
        const filteredStatuses = response.payload.data
          .filter((label) => label.lableType === "job-on-bording-status")
          .map((label) => ({ id: label.id, name: label.name.trim() }));
        
        setStatuses(filteredStatuses);
        setFieldValue("status", newValue.trim()); // Set the newly created status in the form
      }
    } catch (error) {
      console.error("Failed to add Job On Boarding Status:", error);
      message.error("Failed to add Job On Boarding Status");
    }
  };

  // status end

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

      dispatch(AddJobonBoarding(data)).then(() => {
        dispatch(getJobonBoarding());
        // message.success("Job Boarding added successfully!");
        resetForm();
        onClose();
      });
    } catch (error) {
      // message.error("Failed to add job boarding. Please try again.");
      console.error(error);
    }
  };

  const initialValues = {
    related_id: "",
    interviewer: "",
    joiningDate: null,
    daysOfWeek: "",
    salary: "",
    salaryType: "",
    salaryDuration: "",
    jobType: "",
    status: "",
  };

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
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          resetForm,
        }) => (
          <>
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
                    <label className="font-semibold">Interviewer <span className="text-red-500">*</span></label>
                    <Field name="interviewer">
                      {({ field }) => (
                        <Input
                          {...field}
                          className="w-full mt-1"
                          placeholder="Enter Interviewer Name"
                          onChange={(e) => setFieldValue("interviewer", e.target.value)}
                          onBlur={() => setFieldTouched("interviewer", true)}
                        />
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
                    <label className="font-semibold">Joining Date <span className="text-red-500">*</span></label>
                    <DatePicker
                      className="w-full mt-1"
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
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Days Of Week <span className="text-red-500">*</span></label>
                    <Field
                      name="daysOfWeek"
                      as={Input}
                      className="w-full mt-1"
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
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Salary <span className="text-red-500">*</span></label>
                    <Field name="salary" as={Input} placeholder="Enter Salary" className="w-full mt-1" />
                    <ErrorMessage
                      name="salary"
                      component="div"
                      className="error-message text-red-500 my-1"
                    />
                  </div>
                </Col>

                {/* Salary Type */}
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Salary Type <span className="text-red-500">*</span></label>
                    <Field name="salaryType">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Salary Duration <span className="text-red-500">*</span></label>
                    <Field name="salaryDuration">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Job Type <span className="text-red-500">*</span></label>
                    <Field name="jobType">
                      {({ field }) => (
                        <Select
                          {...field}
                          className="w-full mt-1"
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
                <Col span={12}>
                  <div className="form-item mt-3">
                    <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Select or add new status"
                      value={values.status}
                      className="w-full mt-1"
                      onChange={(value) => setFieldValue("status", value)}
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          <div style={{ padding: 8, borderTop: "1px solid #e8e8e8" }}>
                            <Button
                              type="link"
                              icon={<PlusOutlined />}
                              className="w-full mt-1"
                              onClick={() => setIsStatusModalVisible(true)}
                            >
                              Add New Status
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {statuses.map((status) => (
                        <Option key={status.id} value={status.name}>
                          {status.name}
                        </Option>
                      ))}
                    </Select>
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

            <Modal
              title="Add New Status"
              open={isStatusModalVisible}
              onCancel={() => setIsStatusModalVisible(false)}
              onOk={() => handleAddNewStatus(newStatus, setNewStatus, setIsStatusModalVisible, setFieldValue)}
              okText="Add Status"
            >
              <Input
                placeholder="Enter new status name"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />
            </Modal>
          </>
        )}
      </Formik>
    </div>
  );
};

export default AddJobOnBoarding;
