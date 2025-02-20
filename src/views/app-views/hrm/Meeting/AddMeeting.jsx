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
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { AddMeet, MeetData } from "./MeetingReducer/MeetingSlice";

const { Option } = Select;

const AddMeeting = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const AllDepart = useSelector((state) => state.Department);
  const datadept = AllDepart.Department.data || [];
  const filteredDept = datadept?.filter((item) => item.created_by === user);



  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const [selectedDept, setSelectedDept] = useState(null);


  const filteredEmpData = empData?.filter((item) => item.created_by === user);

  const filteredEmpDataa = filteredEmpData.filter((emp) => emp.department === selectedDept);

// console.log('filteredEmpDataa',filteredEmpDataa);
// console.log('selectedDept',selectedDept);

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddMeet(values))
      .then(() => {
        dispatch(MeetData())
          .then(() => {
            message.success("Meeting added successfully!");
            resetForm();
            onClose();
            navigate("/app/hrm/meeting");
          })
          .catch((error) => {
            message.error("Failed to fetch the latest meeting data.");
            console.error("MeetData API error:", error);
          });
      })
      .catch((error) => {
        message.error("Failed to add meeting.");
        console.error("AddMeet API error:", error);
      });
  };

  const initialValues = {
    department: "",
    employee: [],
    title: "",
    date: null,
    startTime: null,
    endTime: null,
    meetingLink: "",
    status: "",
    description: "",
  };

  const validationSchema = Yup.object({
    department: Yup.string().required("Please Select a department."),
    employee: Yup.array().min(1, "Please select at least one employee."),
    title: Yup.string().required("Please enter a meeting title."),
    date: Yup.date().nullable().required("Event Start Date is required."),
    startTime: Yup.date().nullable().required("Meeting time is required."),
    endTime: Yup.date().nullable().required("Meeting time is required."),
    description: Yup.string().required("Please enter a description."),
    status: Yup.string().required("Please select a status."),
    meetingLink: Yup.string().required("Please enter a description."),
  });

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnSubmit={true}
      >
        {({
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          isSubmitting,
          isValid,
          dirty,
        }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

            <Row gutter={16}>
              {/* Department Field */}
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Department <span className="text-red-500">*</span></label>
                  <Field name="department">
                    {({ field, form }) => (
                      <Select
                      style={{ width: "100%" }}
                      {...field}
                      placeholder="Select Department"
                      loading={!filteredDept}
                      className="w-full mt-1"
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
                            {/* No Department Available */}
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

              {/* Employee Field */}
              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">
                    Employees <span className="text-red-500">*</span>
                  </label>
                  <Field name="employee">
                    {({ field, form }) => (
                      <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        {...field}
                        placeholder="Select Employees"
                        loading={!filteredEmpDataa}
                        value={form.values.employee}
                        className="w-full mt-1"
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

              {/* Meeting Title Field */}
              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Meeting Title <span className="text-red-500">*</span></label>
                  <Field name="title" as={Input} placeholder="Event Title" className="w-full mt-1" />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Meeting Date Field */}
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Meeting Date <span className="text-red-500">*</span></label>
                  <DatePicker
                    className="w-full mt-1"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Meeting Time Field */}
              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Meeting Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    className="w-full mt-1"
                    format="HH:mm"
                    value={values.startTime}
                    onChange={(startTime) =>
                      setFieldValue("startTime", startTime)
                    }
                    onBlur={() => setFieldTouched("startTime", true)}
                  />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Meeting end Time <span className="text-red-500">*</span></label>
                  <TimePicker
                    className="w-full mt-1"
                    format="HH:mm"
                    value={values.endTime}
                    onChange={(endTime) =>
                      setFieldValue("endTime", endTime)
                    }
                    onBlur={() => setFieldTouched("endTime", true)}
                  />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="form-item mt-3">
                  <label className="font-semibold">Status <span className="text-red-500">*</span> </label>
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
              {/* Meeting Notes Field */}
                <Col span={24} className="mt-3">
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

              <Col span={24} className="mt-3">
                <div className="form-item">
                    <label className="font-semibold">meetingLink Title <span className="text-red-500">*</span></label>
                  <Field name="meetingLink" as={Input} placeholder="Event meetingLink" className="w-full mt-1" />
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
                Create
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMeeting;
