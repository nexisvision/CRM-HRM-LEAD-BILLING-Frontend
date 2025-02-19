import React, { useEffect, useState } from "react";
import { Input, Button, DatePicker, Select, message, Row, Col } from "antd";
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

const { Option } = Select;

const EditTask = ({ onClose, idd, projectId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);

  const allloggeduserdata = useSelector((state) => state.user);
  const loggedUserData = allloggeduserdata?.loggedInUser || {};
  const id = loggedUserData?.id;

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(GetTasks(id))
  },[])

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const loggedusername = useSelector((state) => state.user.loggedInUser.username || [])
 
    const fndassine = empData.filter(((item)=>item.created_by === loggedusername || []))


  const taskadata = useSelector((state)=>state.Tasks.Tasks);

  const fndatatask = taskadata?.data || [];

  const [initialValues, setInitialValues] = useState({


    
    taskName: "",
    startDate: null,
    dueDate: null,
    status: "",
    priority: "",
    assignTo: [],
    description: "",
  });

  // First fetch the task data
  useEffect(() => {
    const fetchTaskData = async () => {
      setLoading(true);
      try {
        // If projectId exists, use it in the GetTasks call
        const response = await dispatch(GetTasks(projectId || idd));
        console.log("Task data fetch response:", response);
        
        if (!response.payload || !response.payload.data) {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error("Error fetching task data:", error);
        message.error("Failed to fetch task data");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [dispatch, idd, projectId]);

  // Then set the initial values once we have the data
  useEffect(() => {
    if (!loading && fndatatask.length > 0) {
      console.log("Finding task with ID:", idd);
      console.log("Available tasks:", fndatatask);
      
      // Try to find the task by both id and _id
      const task = fndatatask.find((t) => t.id === idd || t._id === idd);
      
      if (!task) {
        console.error("Task not found:", { 
          taskId: idd, 
          availableTasks: fndatatask,
          taskIds: fndatatask.map(t => ({ id: t.id, _id: t._id }))
        });
        message.error("Task not found");
        return;
      }

      console.log("Found task:", task);

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

      // Ensure assignToArray is always an array and filter out null/undefined
      assignToArray = Array.isArray(assignToArray) ? assignToArray : [assignToArray];
      assignToArray = assignToArray.filter(item => item !== null && item !== undefined);

      const newInitialValues = {
        taskName: task.taskName || "",
        startDate: task.startDate ? dayjs(task.startDate) : null,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        assignTo: assignToArray,
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
      };

      console.log("Setting initial values:", newInitialValues);
      setInitialValues(newInitialValues);
      setIsWithoutDueDate(!task.dueDate);
      setIsOtherDetailsVisible(!!task.otherDetailsVisible);
    }
  }, [fndatatask, idd, loading]);

  // Add debug logging for task data
  useEffect(() => {
    console.log("Current task data state:", {
      loading,
      taskadata,
      fndatatask,
      idd,
      projectId
    });
  }, [loading, taskadata, fndatatask, idd, projectId]);

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter TaskName."),
    startDate: Yup.date().nullable().required("Date is required."),
    dueDate: Yup.date().nullable().required("Date is required."),
    status: Yup.string().required("Please select status."),
    priority: Yup.string().required("Please select priority."),
    assignTo: Yup.array().min(1, "Please select at least one AssignTo."),
    description: Yup.string().required("Please enter a Description."),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        assignTo: Array.isArray(values.assignTo) ? values.assignTo : [values.assignTo],
      };

      console.log("Submitting values:", formattedValues);
      
      await dispatch(EditTaskss({ idd, values: formattedValues }));
      message.success("Task updated successfully!");
      await dispatch(GetTasks(idd));
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      message.error("Failed to update task");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
                        onChange={(value) => setFieldValue("assignTo", value)}
                        value={values.assignTo}
                        onBlur={() => setFieldTouched("assignTo", true)}
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
