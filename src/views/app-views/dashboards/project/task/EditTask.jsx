import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Switch,
  Upload,
  Modal,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { EditTasks, GetTasks } from "./TaskReducer/TaskSlice";
import { useDispatch } from "react-redux";
import moment from "moment";

const { Option } = Select;

const EditTask = ({ idd, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  // const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const [initialValues, setInitialValues] = useState({
    taskTitle: "",
    TaskCategory: "",
    projectName: "",
    taskDate: null,
    dueDate: null,
    AssignTo: [],
    taskDescription: "",
  });

  const validationSchema = Yup.object({
    taskTitle: Yup.string().required("Please enter TaskName."),
    TaskCategory: Yup.string().required("Please enter TaskCategory."),
    projectName: Yup.string().required("Please enter Project."),
    taskDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    AssignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    taskDescription: Yup.string().required("Please enter a Description."),
  });

  const allempdata = useSelector((state) => state.Tasks);
  const Expensedata = allempdata?.Tasks?.data || [];

  useEffect(() => {
    if (idd) {
      const milestone = Expensedata.find((item) => item.id === idd);

      if (milestone) {
        const updatedValues = {
          taskTitle: milestone.taskTitle || "",
          TaskCategory: milestone.TaskCategory || "",
          projectName: milestone.projectName || "",
          taskDate: milestone.taskDate ? moment(milestone.taskDate) : null, // Ensure date values are compatible with DatePicker
          dueDate: milestone.dueDate ? moment(milestone.dueDate) : null,
          AssignTo: milestone.AssignTo || [],
          taskDescription: milestone.taskDescription || "",
          taskStatus: milestone.taskStatus || "",
          taskPriority: milestone.taskPriority || "",
        };

        setInitialValues(updatedValues); // Update the initial values state
      } else {
        message.error("Task not found!");
      }
    }
  }, [idd, Expensedata]); // Dependencies ensure this runs when `idd` or `Expensedata` changes

  const onSubmit = (values, { resetForm }) => {
    dispatch(EditTasks({ idd, values }))
      .then(() => {
        dispatch(GetTasks());
        message.success("Expenses added successfully!");

        onClose();
      })
      .catch((error) => {
        message.error("Failed to update Employee.");
        console.error("Edit API error:", error);
      });
  };

  const handleCheckboxChange = () => {
    setIsWithoutDueDate(!isWithoutDueDate);
  };

  const toggleOtherDetails = () => {
    setIsOtherDetailsVisible(!isOtherDetailsVisible);
  };

  return (
    <div className="add-expenses-form">
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
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Name</label>
                  <Field
                    name="taskTitle"
                    as={Input}
                    placeholder="Enter taskTitle"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="taskTitle"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Category</label>
                  <Field name="TaskCategory">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select TaskCategory"
                        className="w-full mt-2"
                        onChange={(value) =>
                          setFieldValue("TaskCategory", value)
                        }
                        value={values.TaskCategory}
                        onBlur={() => setFieldTouched("TaskCategory", true)}
                        allowClear={false}
                      >
                        <Option value="Task Category">Task Category</Option>
                        <Option value="Task Category">Task Category</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="TaskCategory"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project</label>
                  <Field
                    name="projectName"
                    as={Input}
                    placeholder="Enter projectName"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="projectName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold ">StartDate</label>
                  <DatePicker
                    name="taskDate"
                    className="w-full mt-2"
                    placeholder="Select taskDate"
                    onChange={(value) => setFieldValue("taskDate", value)}
                    value={values.taskDate}
                    onBlur={() => setFieldTouched("taskDate", true)}
                  />
                  <ErrorMessage
                    name="taskDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold ">DueDate</label>
                  <DatePicker
                    name="dueDate"
                    className="w-full mt-2"
                    placeholder="Select DueDate"
                    onChange={(value) => setFieldValue("dueDate", value)}
                    value={values.dueDate}
                    onBlur={() => setFieldTouched("dueDate", true)}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">AssignTo</label>
                  <Field name="AssignTo">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        placeholder="Select AssignTo"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("AssignTo", value)}
                        value={values.AssignTo}
                        onBlur={() => setFieldTouched("AssignTo", true)}
                        allowClear={false}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="AssignTo"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.taskDescription}
                    onChange={(value) =>
                      setFieldValue("taskDescription", value)
                    }
                    placeholder="Enter taskDescription"
                    onBlur={() => setFieldTouched("taskDescription", true)}
                  />
                  <ErrorMessage
                    name="taskDescription"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={9}>
                <div className="form-item">
                  <label className="font-semibold mb-2">Status</label>
                  <Field name="taskStatus">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("taskStatus", value)}
                        value={values.taskStatus}
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

              <Col span={10}>
                <div className="form-item">
                  <label className="font-semibold">Priority</label>
                  <Field name="taskPriority">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-2"
                        onChange={(value) =>
                          setFieldValue("taskPriority", value)
                        }
                        value={values.taskPriority}
                      >
                        <Option value="Medium">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
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
            </Row>

            <div className="form-buttons text-right mt-4">
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

export default EditTask;
