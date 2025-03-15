import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col, Upload, Tag } from "antd";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddTasks, GetTasks } from "../project/task/TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";

const { Option } = Select;

const AddTask = ({ onClose }) => {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  useEffect(() => {
    dispatch(GetUsers());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];
  const loggedInUser = useSelector((state) => state.user.loggedInUser);
  const roles = useSelector((state) => state.role?.role?.data);
  const userRole = roles?.find(role => role.id === loggedInUser.role_id);

  const fndassine = empData.filter(emp => {
    if (userRole?.role_name === 'client') {
      return emp.client_id === loggedInUser.id;
    } else {
      return emp.client_id === loggedInUser.client_id;
    }
  });


  const allloggeduserdata = useSelector((state) => state.user);
  const loggedUserData = allloggeduserdata?.loggedInUser || {};
  const id = loggedUserData?.id;

  const initialValues = {
    taskName: "",
    startDate: null,
    dueDate: null,
    status: "",
    priority: "",
    assignTo: [],
    description: "",
    task_reporter: "",
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter TaskName."),
    startDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    status: Yup.string().required("Please select status."),
    priority: Yup.string().required("Please select priority."),
    assignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    description: Yup.string().required("Please enter a Description."),
    task_reporter: Yup.string().required("Please select a Task Reporter."),
  });

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // File type validation
      const isValidType = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(file.type);

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isValidType) {
        message.error('You can only upload JPG/PNG/PDF/DOC files!');
        return false;
      }

      if (!isLt2M) {
        message.error('File must be smaller than 2MB!');
        return false;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    multiple: true,
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const assignToObject = {
        assignedUsers: Array.isArray(values.assignTo)
          ? values.assignTo.filter(id => id && id.trim() !== '')
          : []
      };

      const payload = {
        ...values,
        assignTo: assignToObject
      };


      const response = await dispatch(AddTasks({ id, payload }));
      if (response.error) {
        throw new Error(response.error.message);
      }
      await dispatch(GetTasks(id));
      resetForm();
      setFileList([]);
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
      message.error(error.message || "Failed to add Task.");
    }
  };

  return (
    <div className="add-expenses-form">
          <div className="mb-3 border-b pb-[-10px] font-medium"></div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item ">
                  <label className="font-semibold">Task Name <span className="text-rose-500">*</span></label>
                  <Field
                    name="taskName"
                    as={Input}
                    placeholder="Enter task Title"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="taskName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold ">StartDate <span className="text-rose-500">*</span></label>
                  <DatePicker
                    name="startDate"
                    className="w-full mt-1"
                    placeholder="Select startDate"
                    format="DD-MM-YYYY"
                    onChange={(date) => {
                      setFieldValue("startDate", date);
                      if (values.dueDate && date && values.dueDate.isBefore(date)) {
                        setFieldValue("dueDate", null);
                      }
                    }}
                    value={values.startDate}
                    onBlur={() => setFieldTouched("startDate", true)}
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold ">DueDate <span className="text-rose-500">*</span></label>
                  <DatePicker
                    name="dueDate"
                    className="w-full mt-1"
                    placeholder="Select DueDate"
                     format="DD-MM-YYYY"
                    onChange={(value) => setFieldValue("dueDate", value)}
                    value={values.dueDate}
                    onBlur={() => setFieldTouched("dueDate", true)}
                    disabledDate={(current) => {
                      return values.startDate ? current && current < values.startDate.startOf('day') : false;
                    }}
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">AssignTo <span className="text-rose-500">*</span></label>
                  <Field name="assignTo">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        mode="multiple"
                        placeholder="Select AddProjectMember"
                        onChange={(value) => {
                          const arrayValue = Array.isArray(value) ? value : [value];
                          setFieldValue("assignTo", arrayValue);
                        }}
                        value={values.assignTo}
                        onBlur={() => setFieldTouched("assignTo", true)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) => {
                          if (!option?.children) return false;
                          return option.children.toLowerCase().includes(input.toLowerCase());
                        }}
                      >
                        {Array.isArray(fndassine) && fndassine.length > 0 ? (
                          fndassine.map((client) => {
                            const displayName = client.firstName || client.username || "Unnamed Client";
                            return (
                              <Option key={client.id} value={client.id}>
                                {displayName}
                              </Option>
                            );
                          })
                        ) : (
                          <Option value="" disabled>
                            No Members Available
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

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Task Reporter <span className="text-rose-500">*</span></label>
                  <Field name="task_reporter">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        placeholder="Select Task Reporter"
                        onChange={(value) => setFieldValue("task_reporter", value)}
                        value={values.task_reporter}
                      >
                        {Array.isArray(fndassine) && fndassine.length > 0 ? (
                          fndassine.map((client) => (
                            <Option key={client.id} value={client.id}>
                              {client.firstName || client.username || "Unnamed Client"}
                            </Option>
                          ))
                        ) : (
                          <Option value="" disabled>
                            No Members Available
                          </Option>
                        )}
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="task_reporter"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold mb-2">Status <span className="text-rose-500">*</span></label>
                  <Field name="status">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        onChange={(value) => setFieldValue("status", value)}
                        value={values.status}
                      >
                        <Option value="Incomplete">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            Incomplete
                          </div>
                        </Option>
                        <Option value="To Do">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                            To Do
                          </div>
                        </Option>
                        <Option value="In Progress">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-orange-500 mr-2"></span>
                            In Progress
                          </div>
                        </Option>
                        <Option value="Completed">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Completed
                          </div>
                        </Option>
                        <Option value="On Hold">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                            Waiting Approval
                          </div>
                        </Option>
                      </Select>
                      // </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Priority <span className="text-rose-500">*</span></label>
                  <Field name="priority">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full mt-1"
                        onChange={(value) => setFieldValue("priority", value)}
                        value={values.priority}
                      >
                        <Option value="Medium">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                            Medium
                          </div>
                        </Option>
                        <Option value="High">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                            High
                          </div>
                        </Option>
                        <Option value="Low">
                          <div className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Low
                          </div>
                        </Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Description <span className="text-rose-500">*</span></label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter description"
                    className="mt-1"
                    onBlur={() => setFieldTouched("description", true)}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* Add File Upload field */}
              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Attachments <span className="text-rose-500">*</span></label><br />
                  <Upload {...uploadProps} className="mt-3">
                    <Button icon={<UploadOutlined />} className="hover:bg-gray-50">
                      Click to Upload Files
                    </Button>
                  </Upload>
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

export default AddTask;
