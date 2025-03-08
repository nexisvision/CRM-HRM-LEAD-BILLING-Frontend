import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col, Upload, Tag } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AddTasks, EditTaskss, GetTasks } from "../project/task/TaskReducer/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import moment from "moment/moment";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { GetUsers } from "views/app-views/Users/UserReducers/UserSlice";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditTask = ({ onClose, idd, projectId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  const allloggeduserdata = useSelector((state) => state.user);
  const loggedUserData = allloggeduserdata?.loggedInUser || {};
  const id = loggedUserData?.id;

  useEffect(() => {
    dispatch(GetUsers());

  }, [dispatch]);

  useEffect(() => {
    dispatch(GetTasks(id))
  }, [])

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

  const taskadata = useSelector((state) => state.Tasks.Tasks);

  const fndatatask = taskadata?.data || [];

  const [initialValues, setInitialValues] = useState({
    taskName: "",
    startDate: null,
    dueDate: null,
    status: "",
    priority: "",
    assignTo: [],
    description: "",
    task_reporter: "",
  });

  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        const response = await dispatch(GetTasks(id));
        if (!response.payload || !response.payload.data) {
          throw new Error('No data received from API');
        }

        const taskData = response.payload.data.find(task => task.id === idd || task._id === idd);
        if (!taskData) {
          throw new Error('Task not found');
        }

        let assignToArray = [];
        try {
          if (taskData.assignTo) {
            if (typeof taskData.assignTo === 'string') {
              const parsed = JSON.parse(taskData.assignTo);
              assignToArray = parsed.assignedUsers || [];
            } else if (taskData.assignTo?.assignedUsers) {
              assignToArray = taskData.assignTo.assignedUsers;
            } else if (Array.isArray(taskData.assignTo)) {
              assignToArray = taskData.assignTo;
            } else {
              assignToArray = [taskData.assignTo];
            }
          }
        } catch (error) {
          console.error("Error parsing assignTo:", error);
          assignToArray = [];
        }


        setInitialValues({
          taskName: taskData.taskName || "",
          startDate: taskData.startDate ? dayjs(taskData.startDate) : null,
          dueDate: taskData.dueDate ? dayjs(taskData.dueDate) : null,
          assignTo: assignToArray,
          description: taskData.description || "",
          status: taskData.status || "",
          priority: taskData.priority || "",
          task_reporter: taskData.task_reporter || "",
        });

        // If there are files, set them in the fileList state
        if (taskData.task_file) {
          setFileList([
            {
              uid: '-1',
              name: 'Current File',
              status: 'done',
              url: taskData.task_file
            }
          ]);
        }

      } catch (error) {
        console.error("Error fetching task data:", error);
        message.error("Failed to fetch task data");
      } finally {
        setLoading(false);
      }
    };

    if (idd) {
      fetchTaskData();
    }
  }, [dispatch, idd, id]);

  useEffect(() => {
   
  }, [loading, taskadata, fndatatask, idd, projectId]);

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

  const onSubmit = async (values, { resetForm }) => {
    try {
      if (!idd) {
        message.error("Task ID is missing or invalid");
        return;
      }

      // Convert assignTo array to object with array values
      const assignToObject = {
        assignedUsers: Array.isArray(values.assignTo)
          ? values.assignTo.filter(id => id && id.trim() !== '')
          : []
      };

      // Create payload with assignTo as object
      const payload = {
        ...values,
        assignTo: assignToObject
      };


      const response = await dispatch(EditTaskss({ idd, values: payload }));

      if (response.error) {
        throw new Error(response.error.message || 'Failed to update task');
      }

      message.success("Task updated successfully!");
      await dispatch(GetTasks(id));
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      message.error(error.message || "Failed to update task");
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-expenses-form">
      <h2 className="mb-4 border-b pb-2 font-medium"></h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
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
                  {/* Display selected users as tags */}
                  
                  <ErrorMessage
                    name="assignTo"
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
                  <label className="font-semibold">Priority</label>
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

              <Col span={24} className="mt-3">
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

              <Col span={24} className="mt-3">
                <div className="form-item">
                  <label className="font-semibold">Attachments</label><br />
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

EditTask.propTypes = {
  onClose: PropTypes.func.isRequired,
  idd: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

export default EditTask;
