import React, { useState } from "react";
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

import { useNavigate, useParams } from "react-router-dom";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddTasks, GetTasks } from "./TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import useSelection from "antd/es/table/hooks/useSelection";
import { assign } from "lodash";
import { AddLable, GetLable } from "./LableReducer/LableSlice";
// import { AddLable, GetLable } from "./LableReducer/LableSlice";

const { Option } = Select;

const AddTask = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [status, setStatus] = useState([]);

  const Statusdetail = useSelector((state) => state.Lable);
  const AllLoggeddtaa = useSelector((state) => state.user);
  const AllStatus = Statusdetail?.Lable?.data;
  // const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const initialValues = {
    taskName: "",
    category: "",
    project: "",
    startDate: null,
    dueDate: null,
    assignTo: [],
    description: "",
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter TaskName."),
    category: Yup.string().required("Please enter TaskCategory."),
    project: Yup.string().required("Please enter Project."),
    startDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    assignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    description: Yup.string().required("Please enter a Description."),
  });

  const { id } = useParams();

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data;

  const onSubmit = async (values, { resetForm }) => {
    if (Array.isArray(values.AssignTo) && values.AssignTo.length > 0) {
      values.AssignTo = { [values.AssignTo[0]]: undefined };
    }
    
    // Check if the selected tag is new or existing
    const selectedStatus = status.find(
      (status) => status.name === values.status
    );
  
    if (!selectedStatus) {
      // Call AddLable API only if the selected tag is new
      const lid = AllLoggeddtaa.loggedInUser.id;
        const newStatusPayload = { 
          name: values.status.trim(),
          // lableType: "task" 
        };
      
      try {
        await dispatch(AddLable({ lid, payload: newStatusPayload }));
        await dispatch(AddTasks({ id, values }));
        await dispatch(GetTasks(id));
        
        message.success("Task added successfully!");
        resetForm();
        onClose();
      } catch (error) {
        message.error("Failed to add task");
        console.error("Task API error:", error);
      }
    } else {
      // If tag already exists, just add the task
      try {
        await dispatch(AddTasks({ id, values }));
        await dispatch(GetTasks(id));
        
        message.success("Task added successfully!");
        resetForm();
        onClose();
      } catch (error) {
        message.error("Failed to add task");
        console.error("Task API error:", error);
      }
    }
  };

  // const onSubmit = async (values, { resetForm }) => {
  //   if (Array.isArray(values.AssignTo) && values.AssignTo.length > 0) {
  //     values.AssignTo = { [values.AssignTo[0]]: undefined };
  //   }

  //   dispatch(AddTasks({ id, values }))
  //     .then(() => {
  //       dispatch(GetTasks(id))
  //         .then(() => {
  //           message.success("Expenses added successfully!");
  //           resetForm();
  //           onClose();
  //         })
  //         .catch((error) => {
  //           message.error("Failed to fetch the latest meeting data.");
  //           console.error("MeetData API error:", error);
  //         });
  //     })
  //     .catch((error) => {
  //       message.error("Failed to add meeting.");
  //       console.error("AddMeet API error:", error);
  //     });
  // };

  const fetchStatus = async () => {
    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const response = await dispatch(GetLable(lid));

      if (response.payload && response.payload.data) {
        const uniqueStatus = response.payload.data
          .filter((label) => label && label.name) // Filter out invalid labels
          .map((label) => ({
            id: label.id,
            name: label.name.trim(),
          }))
          .filter(
            (label, index, self) =>
              index === self.findIndex((t) => t.name === label.name)
          ); // Remove duplicates

        setStatus(uniqueStatus);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
      message.error("Failed to load status");
    }
  };

  const handleAddNewStatus = async () => {
    if (!newStatus.trim()) {
      message.error("Please enter a status name");
      return;
    }

    try {
      const lid = AllLoggeddtaa.loggedInUser.id;
      const payload = {
        name: newStatus.trim(),
      };

      await dispatch(AddLable({ lid, payload }));
      message.success("Status added successfully");
      setNewStatus("");
      setIsStatusModalVisible(false);

      // Fetch updated status
      await fetchStatus();
    } catch (error) {
      console.error("Failed to add status:", error);
      message.error("Failed to add status");
    }
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
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Name</label>
                  <Field
                    name="taskName"
                    as={Input}
                    placeholder="Enter taskTitle"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="taskName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Category</label>
                  <Field name="category">
                    {({ field }) => (
                      <Select
                        {...field}
                        placeholder="Select category"
                        className="w-full mt-2"
                        onChange={(value) => setFieldValue("category", value)}
                        value={values.category}
                        onBlur={() => setFieldTouched("category", true)}
                        allowClear={false}
                      >
                        <Option value="Task Category">Task Category</Option>
                        <Option value="Task Category">Task Category</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Project</label>
                  <Field
                    name="project"
                    as={Input}
                    placeholder="Enter projectName"
                    className="mt-2"
                  />
                  <ErrorMessage
                    name="project"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={8} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold ">StartDate</label>
                  <DatePicker
                    name="startDate"
                    className="w-full mt-2"
                    placeholder="Select startDate"
                    onChange={(value) => setFieldValue("startDate", value)}
                    value={values.startDate}
                    onBlur={() => setFieldTouched("startDate", true)}
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
                  <Field name="assignTo">
                    {({ field }) => (
                      // <Select
                      //   {...field}
                      //   mode="multiple"
                      //   placeholder="Select assignTo"
                      //   className="w-full mt-2"
                      //   onChange={(value) => {
                      //     const assignToObjects = value.map((id) => ({
                      //       id,
                      //       name:
                      //         id === "xyz" ? "XYZ" : id === "abc" ? "ABC" : "",
                      //     }));
                      //     setFieldValue("assignTo", assignToObjects);
                      //   }}
                      //   value={values.assignTo.map((item) => item.id)}
                      //   onBlur={() => setFieldTouched("assignTo", true)}
                      //   allowClear={false}
                      // >
                      //   <Option value="xyz">XYZ</Option>
                      //   <Option value="abc">ABC</Option>
                      // </Select>

                      <Select
                        {...field}
                        className="w-full mt-2"
                        mode="multiple"
                        placeholder="Select AddProjectMember"
                        onChange={(value) => setFieldValue("assignTo", value)}
                        value={values.assignTo}
                        onBlur={() => setFieldTouched("assignTo", true)}
                      >
                        {empData && empData.length > 0 ? (
                          empData.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName ||
                                client.username ||
                                "Unnamed Client"}
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
                    name="assignTo"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
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

              <Col span={24} className="mt-4">
                    <div className="form-item">
                      <label className="font-semibold">status</label>
                      <div className="flex gap-2">
                        <Field name="status">
                          {({ field, form }) => (
                            <Select
                              {...field}
                              className="w-full"
                              placeholder="Select or add new status"
                              onChange={(value) =>
                                form.setFieldValue("status", value)
                              }
                              onBlur={() =>
                                form.setFieldTouched("status", true)
                              }
                              dropdownRender={(menu) => (
                                <div>
                                  {menu}
                                  <div
                                    style={{
                                      padding: "8px",
                                      borderTop: "1px solid #e8e8e8",
                                    }}
                                  >
                                    <Button
                                      type="link"
                                      // icon={<PlusOutlined />}
                                      onClick={() => setIsStatusModalVisible(true)}
                                      block
                                    >
                                      Add New Status
                                    </Button>
                                  </div>
                                </div>
                              )}
                            >
                              {status &&
                                status.map((status) => (
                                  <Option key={status.id} value={status.name}>
                                    {status.name}
                                  </Option>
                                ))}
                            </Select>
                          )}
                        </Field>
                      </div>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="error-message text-red-500 my-1"
                      />
                    </div>
                  </Col>

              <Col span={10}>
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

      <Modal
            title="Add New Status"
            open={isStatusModalVisible}
            onCancel={() => setIsStatusModalVisible(false)}
            onOk={handleAddNewStatus}
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

export default AddTask;
