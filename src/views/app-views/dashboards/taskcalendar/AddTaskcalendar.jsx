import React, { useState } from 'react';
import { Input, Button, DatePicker,TimePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddTaskcalendar = ({ onAddTask }) => {
    const navigate = useNavigate();

    const initialValues = {
      title: '',
      tasker:'',
      taskcalenderDate:null,
      tasktime: null,
    };

    const validationSchema = Yup.object({
      title: Yup.string().required('Please enter a title.'),
      tasker: Yup.string().required('Please select tasker.'),
      taskcalenderDate: Yup.date().nullable().required('Task Calender Date is required.'),
      tasktime: Yup.date().nullable().required('Task Time is required.'),
        
    });


    const onSubmit = (values) => {
            const formattedData = {
              id: Date.now(),
              title: values.title,
              tasker: values.tasker,
              date: values.taskcalenderDate.format('YYYY-MM-DD'),
              time: values.taskcalender.format('HH:mm'),
            };
        
            onAddTask(formattedData);
            message.success('Task scheduled successfully!');
          };
    // console.log("object",Option)

    return (
        <div className="add-job-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, handleChange, }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <h2 className="mb-4 border-b pb-2 font-medium"></h2>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>Task Title</label>
                                    <Field name="title" as={Input} placeholder="Enter Task Title" rules={[{ required: true }]} />
                                    <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>Tasker</label>
                                    <Field name="tasker">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Tasker"
                                                onChange={(value) => setFieldValue('tasker', value)}
                                                value={values.tasker}
                                            >
                                                <Option value="candice">Candice</Option>
                                                <Option value="johnDoe">John Doe</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="tasker" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Task Calender Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.taskcalenderDate}
                                        onChange={(date) => setFieldValue('taskcalenderDate', date)}
                                    />
                                    <ErrorMessage name="taskcalenderDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Task-Time</label>
                                    <TimePicker
                                        className="w-full"
                                        format="HH:mm"
                                        value={values.tasktime}
                                        onChange={(time) => setFieldValue('tasktime', time)}
                                    />
                                    <ErrorMessage name="tasktime" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/deals')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
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



