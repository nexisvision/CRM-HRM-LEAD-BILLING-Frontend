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
  Modal,
} from "antd";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { getDept } from "../Department/DepartmentReducers/DepartmentSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
import { AddMeet, MeetData } from "./MeetingReducer/MeetingSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import dayjs from 'dayjs';
import AddDepartment from '../Department/AddDepartment';

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

  useEffect(() => {
    dispatch(ClientData());
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

  const allClients = useSelector((state) => state.SubClient);
  const clientData = allClients?.SubClient?.data || [];

  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);

  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(true);
  };

  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(false);
  };

  const handleSubmit = (values, { resetForm }) => {
    // Format the time values
    const formattedValues = {
      ...values,
      startTime: values.startTime ? dayjs(values.startTime).format('HH:mm:ss') : null,
      endTime: values.endTime ? dayjs(values.endTime).format('HH:mm:ss') : null,
    };


    dispatch(AddMeet(formattedValues))
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
    client: "",
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
    client: Yup.string().required("Please select a client."),
  });

  return (
    <div className="add-job-form">
      <div className="mb-3 border-b pb-1 font-medium"></div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
        }) => {
          // Log current form values

          return (
            <Form className="formik-form" onSubmit={handleSubmit}>


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
                            setSelectedDept(value);
                            form.setFieldValue("employee", []);
                          }}
                          onBlur={() => form.setFieldTouched("department", true)}
                          dropdownRender={menu => (
                            <>
                              {menu}
                              <Button
                                type="link"
                                block
                                onClick={openAddDepartmentModal}
                              >
                                + Add New Department
                              </Button>
                            </>
                          )}
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

                <Col span={12} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">Start Time <span className="text-red-500">*</span></label>
                    <TimePicker
                      className="w-full mt-1"
                      format="HH:mm"
                      value={values.startTime ? dayjs(values.startTime, 'HH:mm:ss') : null}
                      onChange={(time) => {
                        setFieldValue("startTime", time);
                      }}
                      onBlur={() => setFieldTouched("startTime", true)}
                      // use12Hours
                      minuteStep={1}
                      showSecond={false}
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
                    <label className="font-semibold">End Time <span className="text-red-500">*</span></label>
                    <TimePicker
                      className="w-full mt-1"
                      format="HH:mm"
                      value={values.endTime ? dayjs(values.endTime, 'HH:mm:ss') : null}
                      onChange={(time) => {
                        setFieldValue("endTime", time);
                      }}
                      onBlur={() => setFieldTouched("endTime", true)}
                      // use12Hours
                      minuteStep={1}
                      showSecond={false}
                      disabledTime={() => ({
                        disabledHours: () => {
                          if (!values.startTime) return [];
                          const startHour = dayjs(values.startTime).hour();
                          return Array.from({ length: startHour }, (_, i) => i);
                        },
                        disabledMinutes: (selectedHour) => {
                          if (!values.startTime) return [];
                          const startHour = dayjs(values.startTime).hour();
                          const startMinute = dayjs(values.startTime).minute();

                          if (selectedHour === startHour) {
                            return Array.from({ length: startMinute }, (_, i) => i);
                          }
                          return [];
                        }
                      })}
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

                {/* Client Field */}
                <Col span={24} className="mt-3">
                  <div className="form-item">
                    <label className="font-semibold">
                      Client
                    </label>
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
                  Create
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Add Department Modal */}
      <Modal
        title="Add Department"
        visible={isAddDepartmentModalVisible}
        onCancel={closeAddDepartmentModal}
        footer={null}
        width={800}
      >
        <AddDepartment onClose={closeAddDepartmentModal} />
      </Modal>
    </div>
  );
};

export default AddMeeting;
