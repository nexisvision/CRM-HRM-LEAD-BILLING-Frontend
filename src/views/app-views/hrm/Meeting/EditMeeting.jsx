import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import moment from "moment";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { EditMeet, MeetData } from "./MeetingReducer/MeetingSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const EditMeeting = ({ editData, meetid, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MeetData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  const tabledata = useSelector((state) => state.Meeting);

  const dataM = tabledata.Meeting.data.find((item) => item.id === meetid);

  const user = useSelector((state) => state.user.loggedInUser.username);
  
  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data || [];
  const filteredDept = datadept?.filter((item) => item.created_by === user);

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];
  const filteredEmpData = empData?.filter((item) => item.created_by === user);

  const [initialValues, setInitialValues] = useState({
    department: "",
    employee: "",
    title: "",
    date: null,
    startTime: null,
    endTime: null,
    status: "",
    meetingLink: "",
    description: "",
  });

  useEffect(() => {
    if (dataM) {
      setInitialValues({
        department: dataM.department || "",
        employee: dataM.employee || "",
        title: dataM.title || "",
        date: dataM.date ? moment(dataM.date, "DD-MM-YYYY") : null,
        startTime: dataM.startTime ? moment(dataM.startTime, "HH:mm") : null,
        endTime: dataM.endTime ? moment(dataM.endTime, "HH:mm") : null,
        meetingLink: dataM.meetingLink || "",
        status: dataM.status || "",
        description: dataM.description || "",

      });
    }
  }, [dataM]);

  const onSubmit = (values) => {
    dispatch(EditMeet({ meetid, values }))
      .then(() => {
        dispatch(MeetData());
        message.success("Meeting details updated successfully!");
        onClose();
        navigate("/app/hrm/meeting");
      })
      .catch((error) => {
        message.error("Failed to update Meeting.");
        console.error("Edit API error:", error);
      });
  };

  const validationSchema = Yup.object({
    department: Yup.string().required("Please Select a department."),
    employee: Yup.string().required("Please select an employee."),
    title: Yup.string().required("Please enter a meeting title."),
    date: Yup.date().nullable().required("Event Start Date is required."),
    startTime: Yup.date().nullable().required("Meeting time is required."),
    endTime: Yup.date().nullable().required("Meeting time is required."),
    description: Yup.string().required("Please enter a description."),
    meetingLink: Yup.string().required("Please enter a meeting link."),
    status: Yup.string().required("Please select a status."),
  });

  return (
    <div className="edit-meeting-form">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Department</label>
                  <Field name="department">
                    {({ field, form }) => (
                      <Select
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Department"
                        loading={!filteredDept}
                        value={form.values.department}
                        onChange={(value) => form.setFieldValue("department", value)}
                        onBlur={() => form.setFieldTouched("department", true)}
                      >
                        {filteredDept && filteredDept.length > 0 ? (
                          filteredDept.map((dept) => (
                            <Option key={dept.id} value={dept.id}>
                              {dept.department_name || "Unnamed Department"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Department Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Employee</label>
                  <Field name="employee">
                    {({ field, form }) => (
                      <Select
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Employee"
                        loading={!filteredEmpData}
                        value={form.values.employee}
                        onChange={(value) => form.setFieldValue("employee", value)}
                        onBlur={() => form.setFieldTouched("employee", true)}
                      >
                        {filteredEmpData && filteredEmpData.length > 0 ? (
                          filteredEmpData.map((emp) => (
                            <Option key={emp.id} value={emp.id}>
                              {emp.username || "Unnamed Employee"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Employees Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Title</label>
                  <Field name="title" as={Input} placeholder="Meeting Title" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <label className="font-semibold">Meeting Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.date ? dayjs(values.date) : null}
                  onChange={(date) =>
                    setFieldValue("date", date)
                  }
                  onBlur={() => setFieldTouched("date", true)}
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="error-message text-red-500 my-1"
                />
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    value={values.startTime}
                    onChange={(time) => setFieldValue("startTime", time)}
                    onBlur={() => setFieldTouched("startTime", true)}
                  />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting End Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    value={values.endTime}
                    onChange={(time) => setFieldValue("endTime", time)}
                    onBlur={() => setFieldTouched("endTime", true)}
                  />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Select
                    placeholder="Select Status"
                    value={values.status}
                    onChange={(value) => setFieldValue("status", value)}

                     className="w-full"
                  >
                    <Option value="scheduled">scheduled</Option>
                    <Option value="completed">completed</Option>
                    <Option value="cancelled">cancelled</Option>
                  </Select>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Note</label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.description}
                        onChange={(value) =>
                          setFieldValue("description", value)
                        }
                        onBlur={() => setFieldTouched("description", true)}
                        placeholder="Write here..."
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Link</label>
                  <Field name="meetingLink" as={Input} placeholder="Meeting Link" />
                  <ErrorMessage
                    name="meetingLink"
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
    </div>
  );
};

export default EditMeeting;
