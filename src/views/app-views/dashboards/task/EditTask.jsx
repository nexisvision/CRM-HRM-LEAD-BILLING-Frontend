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

const EditTask = ({ onClose, iddd, projectId }) => {
  const dispatch = useDispatch();
  // const [initialValues, setInitialValues] = useState({});
  const [isWithoutDueDate, setIsWithoutDueDate] = useState(false);
  const [isOtherDetailsVisible, setIsOtherDetailsVisible] = useState(false);

  // const { id } = useParams();

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const allempdata = useSelector((state) => state.employee);
  const empData = allempdata?.employee?.data || [];

  const loggedusername = useSelector((state) => state.user.loggedInUser.username || [])
 
    const fndassine = empData.filter(((item)=>item.created_by === loggedusername || []))

  const allloggeduserdata = useSelector((state) => state.user);
  const loggedUserData = allloggeduserdata?.loggedInUser || {};
  const id = loggedUserData?.id;


  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useSelector((state) => state.tasks);

  const fndatatask = tasks?.data || [];

  // const idd = loggedUserData.id;

  useEffect(() => {
    dispatch(GetTasks(iddd));
  }, [dispatch, iddd]);

  // const [uploadModalVisible, setUploadModalVisible] = useState(false);

  // const initialValues = {

  //   taskName: "",
  //   startDate: null,
  //   dueDate: null,
  //   status: "",
  //   priority: "",
  //   assignTo: [],
  //   description: "",
  //   priority: "",
  //   status: "",
  // };

  const [initialValues, setInitialValues] = useState({
    taskName: "",
    startDate: null,
    dueDate: null,
    status: "",
    priority: "",
    assignTo: [],
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

        assignToArray = assignToArray.filter(item => item !== null && item !== undefined);

        setInitialValues({
          taskName: task.taskName || "",
          startDate: task.startDate ? new Date(task.startDate) : null,
          dueDate,
          assignTo: assignToArray,
          description: task.description || "",
          status: task.status || "",
          priority: task.priority || "",
        });

        // console.log("Parsed assignTo values:", assignToArray);
      } else {
        message.error("Task not found.");
      }
    }
  }, [fndatatask, iddd]);

  useEffect(() => {
    if (!iddd || !projectId) {
      message.error("Required IDs are missing");
      onClose();
    }
  }, [iddd, projectId, onClose]);

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
    // Convert AssignTo array into an object containing the array
    // if (Array.isArray(values.AssignTo) && values.AssignTo.length > 0) {
    //   values.AssignTo = { AssignTo: [...values.AssignTo] };
    // }
    // Log the values to check the structure
    // console.log("Form Values:", values);

    // Ensure assignTo is an array
    if (!Array.isArray(values.assignTo)) {
        message.error("AssignTo must be an array.");
        return; // Prevent submission if assignTo is not an array
    }

    // Dispatch AddTasks with updated values
    dispatch(EditTaskss({ iddd, values: values }))
        .then(() => {
            message.success("Task updated successfully!");
            dispatch(GetTasks(iddd))
                .then(() => {
                    resetForm();
                    onClose();
                })
                .catch((error) => {
                    message.error("Failed to fetch the latest Task data.");
                    console.error("MeetData API error:", error);
                });
        })
        .catch((error) => {
            message.error("Failed to update Task.");
            console.error("AddTask API error:", error);
        });
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
  iddd: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

export default EditTask;

// import React, { useState } from 'react';
// import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Card } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import utils from 'utils';
// import OrderListData from "assets/data/order-list.data.json"
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const { Option } = Select;

// const AddTask = () => {
//     const navigate = useNavigate();
//     const [description, setDescription] = useState(false);
//     const [info, setInfo] = useState(false);
//     const [option, setOption] = useState(false);

//     const initialValues = {

//         title: '',
//         status: '',
//         priority: '',

//         description: '',

//     };

//     const validationSchema = Yup.object({

//         title: Yup.string().required('Please enter a Title.'),
//         status: Yup.string().required('Please select status.'),
//         priority: Yup.string().required('please select a Priority'),

//         description: description ? Yup.string().required("Description are required") : Yup.string(),

//     });

//     const onSubmit = (values) => {
//         console.log('Submitted values:', values);
//         message.success('Project added successfully!');
//         navigate('/app/apps/project');
//     };
//     // console.log("object",Option)

//     return (
//         <div className="add-job-form">
//             <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={onSubmit}
//             >
//                 {({ values, setFieldValue, handleSubmit, handleChange, }) => (
//                     <Form className="formik-form" onSubmit={handleSubmit}>
//                         <h2 className="mb-4 border-b pb-2 font-medium"></h2>

//                         <Row gutter={16}>

//                             <Col span={12} className='mt-2'>
//                                 <div className="form-item">
//                                     <label className='font-semibold flex'>Title<h1 className='text-rose-500'>*</h1></label>
//                                     <Field name="title" as={Input} placeholder="Enter Title Name" />
//                                     <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>
//                             <Col span={12} className='mt-2'>
//                                 <div className="form-item">
//                                     <label className='font-semibold flex'>Status <h1 className='text-rose-500'>*</h1></label>
//                                     <Field name="status">
//                                         {({ field }) => (
//                                             <Select
//                                                 {...field}
//                                                 className="w-full"
//                                                 placeholder="Select Status"
//                                                 onChange={(value) => setFieldValue('status', value)}
//                                                 value={values.status}
//                                             >
//                                                 <Option value="new">New</Option>
//                                                 <Option value="converted">Converted</Option>
//                                                 <Option value="qualified">Qualified</Option>
//                                                 <Option value="proposalsent">Proposal Sent</Option>
//                                             </Select>
//                                         )}
//                                     </Field>
//                                     <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12} className='mt-2'>
//                                 <div className="form-item">
//                                     <label className='font-semibold flex'>Priority <h1 className='text-rose-500'>*</h1></label>
//                                     <Field name="priority">
//                                         {({ field }) => (
//                                             <Select
//                                                 {...field}
//                                                 className="w-full"
//                                                 placeholder="Select Priority"
//                                                 onChange={(value) => setFieldValue('priority', value)}
//                                                 value={values.priority}
//                                             >
//                                                 <Option value="new">New</Option>
//                                                 <Option value="converted">Converted</Option>
//                                                 <Option value="qualified">Qualified</Option>
//                                                 <Option value="proposalsent">Proposal Sent</Option>
//                                             </Select>
//                                         )}
//                                     </Field>
//                                     <ErrorMessage name="priority" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={24} className="mt-4 border-t pt-4">
//                                 <div className="flex justify-between items-center">
//                                     <label className="font-semibold">Description</label>
//                                 </div>

//                                 {/* Always show the description field */}
//                                 <Col span={24}>
//                                     <div className="mt-2">
//                                         <ReactQuill
//                                             value={values.notes}
//                                             onChange={(value) => setFieldValue("description", value)}
//                                             placeholder="Enter Description"
//                                             className="mt-2 bg-white rounded-md"
//                                         />
//                                         <ErrorMessage
//                                             name="description"
//                                             component="div"
//                                             className="error-message text-red-500 my-1"
//                                         />
//                                     </div>
//                                 </Col>
//                             </Col>
//                         </Row>

//                         <div className="form-buttons text-right mt-4">
//                             <Button type="default" htmlType='submit' className="mr-2" onClick={() => navigate('/app/apps/project/lead')}>Cancel</Button>
//                             <Button type="primary" htmlType="submit">Create</Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// };

// export default AddTask;
