import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch } from "react-redux";
import { AddTask, GetTaskdata } from "./TaskCalendarReducer/TaskCalendarSlice";

const { Option } = Select;

const AddTaskcalendar = ({ onAddTask, onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    taskName: "",
    taskDescription: "",
    taskDate: null,
    taskTime: null,
  };

  const validationSchema = Yup.object({
    taskName: Yup.string().required("Please enter a title."),
    taskDescription: Yup.string().required("Please select taskDescription."),
    taskDate: Yup.date().nullable().required("Task Calender Date is required."),
    taskTime: Yup.date().nullable().required("Task Time is required."),
  });

  const onSubmit = (values, { resetForm }) => {
    dispatch(AddTask(values))
      .then(() => {
        dispatch(GetTaskdata())
          .then(() => {
            message.success("Task added successfully!");
            resetForm();
            onCancel();
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

    onAddTask(values);
    message.success("Task scheduled successfully!");
  };
  // console.log("object",Option)

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, handleChange, resetForm }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Task Title</label>
                  <Field
                    name="taskName"
                    as={Input}
                    placeholder="Enter Task Title"
                    rules={[{ required: true }]}
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
                  <label className="font-semibold">Description</label>
                  <Field
                    name="taskDescription"
                    as={Input}
                    placeholder="Enter Task Description"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="taskDescription"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Task Calender Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.taskDate}
                    onChange={(date) => setFieldValue("taskDate", date)}
                  />
                  <ErrorMessage
                    name="taskDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Task-Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm"
                    value={values.taskTime}
                    onChange={(time) => setFieldValue("taskTime", time)}
                  />
                  <ErrorMessage
                    name="taskTime"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={onCancel}>
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

export default AddTaskcalendar;

// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
// import moment from 'moment';
// const { Option } = Select;

// const AddTaskcalendar = ({ onAddTask }) => {
//     const [form] = Form.useForm();

//     const onFinish = (values) => {
//       const formattedData = {
//         id: Date.now(),
//         title: values.title,
//         tasker: values.tasker,
//         date: values.taskcalenderDate.format('YYYY-MM-DD'),
//         time: values.taskcalender.format('HH:mm'),
//       };

//       onAddTask(formattedData);
//       message.success('Task scheduled successfully!');
//     };

//     return (
//       <Form layout="vertical" form={form} onFinish={onFinish}>
//                             <h2 className="mb-4 border-b pb-2 font-medium"></h2>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="title"
//               label="Task Title"
//               rules={[{ required: true, message: 'Please provide a title for the task.' }]}
//             >
//               <Input placeholder="Task Title" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="tasker"
//               label="Tasker"
//               rules={[{ required: true, message: 'Please select an Tasker.' }]}
//             >
//               <Select placeholder="Select Tasker">
//                 <Option value="Candice">Candice</Option>
//                 <Option value="John Doe">John Doe</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="taskcalenderDate"
//               label="Task-Calendar Date"
//               rules={[{ required: true, message: 'Please select an task date.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="taskcalender"
//               label="Task-Calender"
//               rules={[{ required: true, message: 'Please select an task time.' }]}
//             >
//               <TimePicker style={{ width: '100%' }} />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             Add Task
//           </Button>
//         </Form.Item>
//       </Form>
//     );
// };

// export default AddTaskcalendar;
