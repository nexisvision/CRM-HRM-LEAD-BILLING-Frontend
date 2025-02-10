import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import dayjs from "dayjs";
import * as Yup from "yup";
import {
  AddTasks,
  EditTasks,
  GetTasks,
} from "../project/task/TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import moment from "moment/moment";

const { Option } = Select;

const EditTask = ({ iddd, onClose }) => {
  const dispatch = useDispatch();
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);

  const alltaskdata = useSelector((state) => state.Tasks);
  const fndatatask = alltaskdata.Tasks.data;

  const { id } = useParams();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const loggedusername = useSelector((state) => state.user.loggedInUser.username)
  
    const fndassine = empData.filter(((item)=>item.created_by === loggedusername))

  const allloggeduserdata = useSelector((state) => state.user);
  const loggedUserData = allloggeduserdata?.loggedInUser;

  const idd = loggedUserData.id;

  useEffect(() => {
    dispatch(GetTasks(idd));
  }, [dispatch, idd]);

  const [initialValues, setInitialValues] = useState({
    taskName: "",
    startDate: null,
    dueDate: null,
    assignTo: {},
    description: "",
    priority: "",
    status: "",
  });

  useEffect(() => {
    if (fndatatask && iddd) {
      const task = fndatatask.find((task) => task.id === iddd);
      if (task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        setIsWithoutDueDate(dueDate === null);
        setIsOtherDetailsVisible(task.otherDetailsVisible);

        let assignToArray = [];
        try {
          if (task.assignTo) {
            if (typeof task.assignTo === 'string') {
              assignToArray = JSON.parse(task.assignTo);
            } else if (Array.isArray(task.assignTo)) {
              assignToArray = task.assignTo;
            } else {
              assignToArray = [task.assignTo];
            }
          }
        } catch (error) {
          console.error("Error parsing assignTo:", error);
          assignToArray = [];
        }

        if (!Array.isArray(assignToArray)) {
          assignToArray = [assignToArray];
        }

        setInitialValues({
          taskName: task.taskName || "",
          startDate: task.startDate ? new Date(task.startDate) : null,
          dueDate,
          assignTo: assignToArray,
          description: task.description || "",
          status: task.status || "",
          priority: task.priority || "",
        });

        console.log("Parsed assignTo values:", assignToArray);
      } else {
        message.error("Task not found.");
      }
    }
  }, [fndatatask, iddd]);

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter TaskName."),
    startDate: Yup.date().nullable().required("Start Date is required."),
    dueDate: Yup.date().nullable().required("Due Date is required."),
    assignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    description: Yup.string().required("Please enter a Description."),
  });

  const onSubmit = async (values, { resetForm }) => {
    const payload = {
      ...values,
      assignTo: JSON.stringify(values.assignTo)
    };

    dispatch(EditTasks({ iddd, values: payload }))
      .then(() => {
        dispatch(GetTasks(idd))
          .then(() => {
            // message.success("Task updated successfully!");
            resetForm();
            onClose();
          })
          .catch((error) => {
            // message.error("Failed to fetch the latest task data.");
            console.error("GetTasks API error:", error);
          });
      })
      .catch((error) => {
        // message.error("Failed to update task.");
        console.error("AddTask API error:", error);
      });
  };

  return (
    <div className="edit-task-form">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Task Name</label>
                  <Field
                    name="taskName"
                    as={Input}
                    placeholder="Enter task Title"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="taskName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date</label>
                  <DatePicker
                    name="startDate"
                    className="w-full mt-2"
                    placeholder="Select Start Date"
                    onChange={(value) => setFieldValue("startDate", value)}
                    value={values.startDate ? moment(values.startDate) : null}
                    onBlur={() => setFieldTouched("startDate", true)}
                    format="YYYY-MM-DD"
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}

              <Col span={12} className="mt-4">
                <label className="font-semibold">Start Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.startDate ? dayjs(values.startDate) : null}

                  onChange={(startDate) =>
                    setFieldValue("startDate", startDate)
                  }
                  onBlur={() => setFieldTouched("startDate", true)}

                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="error-message text-red-500 my-1"

                />
              </Col>

              {/* <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Due Date</label>
                  <DatePicker
                    name="dueDate"
                    className="w-full mt-2"
                    placeholder="Select Due Date"
                    onChange={(value) => setFieldValue("dueDate", value)}
                    value={values.dueDate ? moment(values.dueDate) : null}
                    onBlur={() => setFieldTouched("dueDate", true)}
                    format="YYYY-MM-DD"
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col> */}
               <Col span={12} className="mt-4">
                  <label className="font-semibold">Due Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.dueDate ? dayjs(values.dueDate) : null}
                    onChange={(dueDate) => setFieldValue("dueDate", dueDate)}
                    onBlur={() => setFieldTouched("dueDate", true)}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Assign To</label>
                  <Field name="assignTo">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select Assign To"
                        onChange={(value) => setFieldValue("assignTo", value)}
                        value={values.assignTo}
                        onBlur={() => setFieldTouched("assignTo", true)}
                      >
                        {fndassine && fndassine.length > 0 ? (
                          fndassine.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName ||
                                client.username ||
                                "Unnamed Client"}
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
                    name="assignTo"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={9} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold mb-2">Status</label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                      >
                        <Option value="Incomplete">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            Incomplete
                          </div>
                        </Option>
                        <Option value="To Do">To Do</Option>
                        <Option value="In Progress">Doing</Option>
                        <Option value="Completed">Completed</Option>
                        <Option value="On Hold">Waiting Approval</Option>
                      </Select>
                    )}
                  </Field>
                </div>
              </Col>

              <Col span={10} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Priority</label>
                  <Field name="priority">    
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("priority", value)}
                        value={values.priority}
                      >
                        <Option value="Medium">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-`full bg-yellow-500 mr-2"></span>
                            Medium
                          </div>
                        </Option>
                        <Option value="High">High</Option>
                        <Option value="Low">Low</Option>
                      </Select>
                    )}
                  </Field>
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter description"
                    onBlur={() => setFieldTouched("description", true)}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Task
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditTask;
