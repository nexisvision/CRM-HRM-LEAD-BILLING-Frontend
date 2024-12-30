import React, { useState } from "react";
import {
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Checkbox,
} from "antd";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import utils from "utils";
import OrderListData from "assets/data/order-list.data.json";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddCon } from "./ContractReducers/ContractSlice";

const { Option } = Select;
// const CheckboxGroup = Checkbox.Group;
const AddContract = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    subject: "",
    client: "",
    Projects: "",
    contracttype: "",
    startdate: null,
    enddate: null,
    contractvalue: "",
    description: "",
    // options: [],
  };

  const validationSchema = Yup.object({
    subject: Yup.string().optional("Please enter a Subject Name."),
    client: Yup.string().optional("Please select Client."),
    projects: Yup.mixed().optional("Please select Projects."),
    contracttype: Yup.string().optional("Please enter Contract Value ."),
    startdate: Yup.date().nullable().optional("Start date is required."),
    enddate: Yup.date().nullable().optional("End date is required."),
    contractvalue: Yup.number()
      .optional("Please Select a contractvalue.")
      .positive("Contract Value must be positive."),
    description: Yup.string().optional("Please enter a Description."),
    // options: Yup.array().min(1, 'Please select at least one option.'),
  });

  const onSubmit = (values) => {
    dispatch(AddCon(values));
    console.log("Submitted values:", values);
    message.success("Project added successfully!");
  };
  // console.log("object",Option)

  const Clientdata = useSelector((state) => state.SubClient);
  const filtersubclient = Clientdata.SubClient.data;

  const Projectdtaa = useSelector((state) => state.Project);
  const filterprojectdata = Projectdtaa.Project.data;

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, handleChange }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <h2 className="mb-4 border-b pb-2 font-medium"></h2>

            <Row gutter={16}>
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Subject</label>
                  <Field
                    name="subject"
                    as={Input}
                    placeholder="Enter Subject Name"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Client</label>
                  <Field name="client">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Client"
                        onChange={(value) => setFieldValue("client", value)}
                        value={values.client}
                      >
                        <Option value="xyz">XYZ</Option>
                        <Option value="abc">ABC</Option>
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Projects</label>
                  <Field name="projects">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Projects"
                        onChange={(value) => setFieldValue("projects", value)}
                        value={values.projects}
                      >
                        <Option value="Projects1">Projects1</Option>
                        <Option value="Projects2">Projects2</Option>
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

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Contract Type</label>
                  <Field name="contracttype">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Contract Type"
                        onChange={(value) =>
                          setFieldValue("contracttype", value)
                        }
                        value={values.contracttype}
                      >
                        <Option value="Marketing">Marketing</Option>
                        <Option value="Planning">Planning</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="contracttype"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Contract Value</label>
                  <Field
                    name="contractValue"
                    as={Input}
                    placeholder="Enter Contract Value "
                    type="number"
                  />
                  <ErrorMessage
                    name="contractValue"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Start Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.startdate}
                    onChange={(date) => setFieldValue("startdate", date)}
                  />
                  <ErrorMessage
                    name="startdate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">End Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.enddate}
                    onChange={(date) => setFieldValue("enddate", date)}
                  />
                  <ErrorMessage
                    name="enddate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={24} className='mt-4'>
                <div className="form-item">
                  <label className='font-semibold'>Skills</label>
                  <Field name="skills" as={Input} placeholder="Enter Skills" />
                  <ErrorMessage name="skills" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col> */}

              <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Description</label>
                  <ReactQuill
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                    placeholder="Enter description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              {/* <Col span={24} className="mt-4">
                <div className="form-item">
                  <label className="font-semibold">Options</label>
                  <Checkbox.Group
                    value={values.options}
                    onChange={(checkedValues) => setFieldValue('options', checkedValues)}
                  >
                    <Row>
                      <Col span={6}>
                        <Checkbox value="gender">Gender</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="dob">Date of Birth</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="country">Country</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="profileImage">Profile Image</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                  <ErrorMessage name="options" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col> */}
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button
                type="default"
                className="mr-2"
                onClick={() => navigate("/app/apps/project")}
              >
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

export default AddContract;

// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';

// const { Option } = Select;

// const AddContract = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Job added successfully!');
//     navigate('/app/hrm/jobs');
//   };

//   return (
//     <div className="add-job-form">
//       {/* <h2 className="mb-4">Create Contract</h2> */}
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-job"
//         onFinish={onFinish}
//       >
//                     <h2 className="mb-4 border-b pb-2 font-medium"></h2>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="Subject" label="Subject" rules={[{ required: true, message: 'Please enter a Subject.' }]}>
//               <Input placeholder="Enter Subject" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="client" label="Client" rules={[{ required: true, message: 'Please select a Client.' }]}>
//               <Select placeholder="Select Branch">
//                 <Option value="all">All</Option>
//                 <Option value="branch1">Branch 1</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="Projects" label="Projects" rules={[{ required: true, message: 'Please select a Projects.' }]}>
//               <Select placeholder="Select Project">
//                 <Option value="Select Project">Select Project</Option>
//                 {/* <Option value="hr">HR</Option> */}
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="Contract Value" label="Contract Value" rules={[{ required: true, message: 'Please enter Contract Value.' }]}>
//               <Input placeholder="Enter Contract Value" type='number' />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required.' }]}>
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'End date is required.' }]}>
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           {/* <Col span={24}>
//             <Form.Item name="skills" label="Skill" rules={[{ required: true, message: 'Please enter skills.' }]}>
//               <Input placeholder="Enter Skills" />
//             </Form.Item>
//           </Col> */}

//           <Col span={24}>
//             <Form.Item name="jobDescription" label="Job Description" rules={[{ required: true }]}>
//               <ReactQuill placeholder="Write here..." />
//             </Form.Item>
//           </Col>

//           {/* <Col span={12}>
//             <Form.Item name="jobRequirement" label="Job Requirement" rules={[{ required: true }]}>
//               <ReactQuill placeholder="Write here..." />
//             </Form.Item>
//           </Col> */}

//           {/* <Col span={24}>
//             <Checkbox.Group>
//               <Row>
//                 <Col span={6}><Checkbox value="gender">Gender</Checkbox></Col>
//                 <Col span={6}><Checkbox value="dob">Date of Birth</Checkbox></Col>
//                 <Col span={6}><Checkbox value="country">Country</Checkbox></Col>
//                 <Col span={6}><Checkbox value="profileImage">Profile Image</Checkbox></Col>
//               </Row>
//             </Checkbox.Group>
//           </Col> */}
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
//             <Button type="primary" htmlType="submit">Create</Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddContract;
