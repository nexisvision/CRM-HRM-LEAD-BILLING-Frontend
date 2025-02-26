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
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

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

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const tabledata = useSelector((state) => state.Meeting);

  const dataM = tabledata.Meeting.data.find((item) => item.id === meetid);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data || [];
  const filteredDept = datadept?.filter((item) => item.created_by === user);

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const allClients = useSelector((state) => state.SubClient);
  const clientData = allClients?.SubClient?.data || [];

  const [selectedDept, setSelectedDept] = useState(null);

  const filteredEmpData = empData?.filter((item) => item.created_by === user);

  const filteredEmpDataa = filteredEmpData.filter((emp) => emp.department === selectedDept);
  const [initialValues, setInitialValues] = useState({
    department: "",
    employee: [],
    title: "",
    date: null,
    startTime: null,
    endTime: null,
    status: "",
    meetingLink: "",
    description: "",
    client: "",
  });

  useEffect(() => {
    if (dataM) {
      try {
        // Parse the employee JSON string to array
        const employeeIds = JSON.parse(dataM.employee);
        
        setInitialValues({
          department: dataM.department || "",
          employee: employeeIds, // Set the parsed array directly
          title: dataM.title || "",
          date: dataM.date ? moment(dataM.date, "YYYY-MM-DD") : null,
          startTime: dataM.startTime ? moment(dataM.startTime, "HH:mm:ss") : null,
          endTime: dataM.endTime ? moment(dataM.endTime, "HH:mm:ss") : null,
          meetingLink: dataM.meetingLink || "",
          status: dataM.status || "",
          description: dataM.description || "",
          client: dataM.client || "",
        });

        // Set selected department to filter employees
        setSelectedDept(dataM.department);

      } catch (error) {
        console.error("Error parsing employee data:", error);
        message.error("Error loading employee data");
      }
    }
  }, [dataM]);

  const getEmployeeNames = (employeeIds) => {
    if (!employeeIds || !filteredEmpData) return [];
    
    return employeeIds.map(id => {
      const employee = filteredEmpData.find(emp => emp.id === id);
      console.log('employee',employee);
      return employee ? employee.username : "Unknown Employee";
    });
  };

  const onSubmit = (values) => {
    // Convert employee array back to JSON string
    const modifiedValues = {
      ...values,
      employee: JSON.stringify(values.employee)
    };

    dispatch(EditMeet({ meetid, values: modifiedValues }))
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
    employee: Yup.array().min(1, "Please select at least one employee."),
    title: Yup.string().required("Please enter a meeting title."),
    date: Yup.date().nullable().required("Event Start Date is required."),
    startTime: Yup.date().nullable().required("Meeting time is required."),
    endTime: Yup.date().nullable().required("Meeting time is required."),
    description: Yup.string().required("Please enter a description."),
    meetingLink: Yup.string().required("Please enter a meeting link."),
    status: Yup.string().required("Please select a status."),
    client: Yup.string().required("Please select a client."),
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
                  <label className="font-semibold">Department <span className="text-red-500">*</span></label>
                  <Field name="department">
                    {({ field, form }) => (
                      <Select
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Department"
                        className="w-full mt-1"
                        loading={!filteredDept}
                        value={form.values.department}
                        onChange={(value) => {
                          form.setFieldValue("department", value);
                          setSelectedDept(value); // ✅ Set selected department here
                          form.setFieldValue("employee", []); // Reset employee field when department changes
                        }}
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
                  <label className="font-semibold">Employee <span className="text-red-500">*</span></label>
                  <Field name="employee">
                    {({ field, form }) => (
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Employees"
                        className="w-full mt-1"
                        loading={!filteredEmpDataa}
                        value={form.values.employee}
                        onChange={(value) => form.setFieldValue("employee", value)}
                        onBlur={() => form.setFieldTouched("employee", true)}
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {filteredEmpDataa && filteredEmpDataa.length > 0 ? (
                          filteredEmpDataa.map((emp) => (
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
                  <label className="font-semibold">Meeting Title <span className="text-red-500">*</span></label>
                  <Field name="title" as={Input} placeholder="Meeting Title" className="w-full mt-1" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
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
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Meeting Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    className="w-full mt-1"
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
                  <label className="font-semibold">Meeting End Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    className="w-full mt-1"
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
                  <label className="font-semibold">Status <span className="text-red-500">*</span></label>
                  <Select
                    placeholder="Select Status"
                    value={values.status}
                    onChange={(value) => setFieldValue("status", value)}

                    className="w-full mt-1"
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
                  <label className="font-semibold">Meeting Note <span className="text-red-500">*</span></label>
                  <Field name="description">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.description}
                        className="w-full mt-1"
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
                  <label className="font-semibold">Meeting Link <span className="text-red-500">*</span></label>
                  <Field name="meetingLink" as={Input} placeholder="Meeting Link" className="w-full mt-1" />
                  <ErrorMessage
                    name="meetingLink"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Client <span className="text-red-500">*</span></label>
                  <Field name="client">
                    {({ field, form }) => (
                      <Select
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Client"
                        loading={!clientData}
                        value={form.values.client}
                        className="w-full mt-1"
                        onChange={(value) => form.setFieldValue("client", value)}
                        onBlur={() => form.setFieldTouched("client", true)}
                      >
                        {clientData && clientData.length > 0 ? (
                          clientData.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.username || "Unnamed Client"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Clients Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="client"
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
