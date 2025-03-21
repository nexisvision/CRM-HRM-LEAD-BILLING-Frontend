import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col, Modal } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PlusOutlined } from "@ant-design/icons";
import { editJobonBoardingss, getJobonBoarding } from "./JobOnBoardingReducer/jobonboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddLable, GetLable } from "../../../dashboards/sales/LableReducer/LableSlice";
import moment from "moment/moment";
import dayjs from 'dayjs';

const { Option } = Select;

const EditJobOnBording = ({ idd, onClose }) => {
  const dispatch = useDispatch();
  const alldata = useSelector((state) => state.jobonboarding);
  const fnddtaa = alldata.jobonboarding.data || [];
  const fnd = fnddtaa.find((item) => item.id === idd);

  useEffect(() => {
    dispatch(getJobonBoarding());
  }, [dispatch]);

  // status start
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statuses, setStatuses] = useState([]);

  const AllLoggedData = useSelector((state) => state.user);
  const fetchLables = React.useCallback(async (lableType, setter) => {
    try {
      const lid = AllLoggedData.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueStatuses = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setStatuses(uniqueStatuses);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
      message.error("Failed to load statuses");
    }
  }, [AllLoggedData.loggedInUser.id, dispatch]);

  useEffect(() => {
    fetchLables("status", setStatuses);
  }, [fetchLables]);

  const handleAddNewStatus = async () => {
    if (!newStatus.trim()) {
      message.error("Please enter a status name");
      return;
    }

    try {
      const lid = AllLoggedData.loggedInUser.id;
      const payload = {
        name: newStatus.trim(),
        labelType: "status",
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Status added successfully");
      setNewStatus("");
      setIsStatusModalVisible(false);

      // Fetch updated statuses
      await fetchLables();
    } catch (error) {
      console.error("Failed to add Status:", error);
      message.error("Failed to add Status");
    }
  };


  useEffect(() => {
    if (fnd) {
      setInitialValues({
        related_id: fnd?.related_id,
        interviewer: fnd?.Interviewer,
        joiningDate: fnd?.JoiningDate ? new moment(fnd?.JoiningDate) : null,
        daysOfWeek: fnd?.DaysOfWeek,
        salary: fnd?.Salary,
        salaryType: fnd?.SalaryType,
        salaryDuration: fnd?.SalaryDuration,
        jobType: fnd?.JobType,
        status: fnd?.Status,
      });
    }
  }, [fnd]);

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

      dispatch(editJobonBoardingss({ idd, data })).then(() => {
        dispatch(getJobonBoarding());
        // message.success("Job Candidate added successfully!");
        resetForm();
        onClose();
      });
    } catch (error) {
      // message.error("Failed to add job candidate. Please try again.");
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
      <div className="mb-3 border-b pb-1 font-medium"></div>
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
                  <Field name="joiningDate">
                    {({ field }) => (
                      <input
                        type="date"
                        {...field}
                        className="w-full mt-1 p-2 border rounded"
                        value={values.joiningDate ? values.joiningDate.format('YYYY-MM-DD') : ''}
                        onChange={(e) => {
                          const date = dayjs(e.target.value);
                          setFieldValue('joiningDate', date);
                        }}
                        onBlur={() => setFieldTouched("joiningDate", true)}
                      />
                    )}
                  </Field>
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
                    className="w-full mt-1"
                    placeholder="Select or add new status"
                    value={values.status}
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
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        title="Add New Status"
        open={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={() => handleAddNewStatus("status", newStatus, setNewStatus, setIsStatusModalVisible)}
        okText="Add Status"
      >
        <Input
          placeholder="Enter new status name"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default EditJobOnBording;
