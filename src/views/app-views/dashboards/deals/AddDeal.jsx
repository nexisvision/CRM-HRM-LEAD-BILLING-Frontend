import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddDeal = () => {
    const navigate = useNavigate();

    const initialValues = {
        dealName: '',
        phone:'',
        price:'',
        clients: '',
    };

    const validationSchema = Yup.object({
        dealName: Yup.string().required('Please enter a Deal Name.'),
        phone:Yup.string().matches(/^\+\d{1,3}\d{10}$/, 'Phone number must include country code and be 10 digits.').required('please enter a phone number'),
        price: Yup.string().required('Please enter a Price.'),
        clients: Yup.string().required('Please select clients.'),
    });


    const onSubmit = (values) => {
      console.log('Submitted values:', values);
          message.success('Deal added successfully!');
          // Redirect to desired page after submission
          navigate('/deals');
    };
    // console.log("object",Option)

    return (
        <div className="add-job-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, handleChange,setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <h2 className="mb-4 border-b pb-2 font-medium"></h2>

                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>Deal Name</label>
                                    <Field name="dealName" as={Input} placeholder="Enter Deal Name" rules={[{ required: true }]} />
                                    <ErrorMessage name="dealName" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} >
                                <div className="form-item">
                                    <label className='font-semibold'>Phone</label>
                                    <Field name="phone" as={Input} placeholder="Enter Phone Number"  />
                                    <span className="ant-form-text"> Please use with country code. (ex. +91)</span>
                                    <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Price</label>
                                    <Field name="price" as={Input} placeholder="Enter Price" rules={[{ required: true }]} />
                                    <ErrorMessage name="price" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Clients</label>
                                    <Field name="clients">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Clients"
                                                onChange={(value) => setFieldValue('clients', value)}
                                                value={values.clients}
                                                onBlur={() => setFieldTouched("clients", true)}
                                            >
                                                <Option value="xyz">Xyz</Option>
                                                <Option value="abc">Abc</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    {/* <Field name="user" as={Select} className='w-full' placeholder="Select User">
                                        <Option value="xyz">xyz</Option>
                                        <Option value="abc">abc</Option>
                                    </Field> */}
                                    <ErrorMessage name="user" component="div" className="error-message text-red-500 my-1" />
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

export default AddDeal;



// import React from 'react';
// import { Form, Input, Button, Select, Row, Col, message } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddDeal = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Deal added successfully!');
//     // Redirect to desired page after submission
//     navigate('/deals');
//   };

//   return (
//     <div className="add-deal-form">
//       {/* <h2 className="mb-4">Create Deal</h2> */}
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="add-deal"
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="dealName"
//               label="Deal Name"
//               rules={[{ required: true, message: 'Please enter a deal name.' }]}
//             >
//               <Input placeholder="Enter Deal Name" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="phone"
//               label="Phone"
//               rules={[{ required: true, message: 'Please enter a phone number.' }]}
//             >
//               <Input placeholder="Enter Phone" />
//               <span className="ant-form-text"> Please use with country code. (ex. +91)</span>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="price"
//               label="Price"
//               rules={[{ required: true, message: 'Please enter the price.' }]}
//             >
//               <Input placeholder="Enter Price" type="number" min={0} />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="clients"
//               label="Clients"
//               rules={[{ required: true, message: 'Please select a client.' }]}
//             >
//               <Select placeholder="Select Client" mode="multiple">
//                 <Option value="client1">Client 1</Option>
//                 <Option value="client2">Client 2</Option>
//                 <Option value="client3">Client 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button
//               type="default"
//               className="mr-2"
//               onClick={() => navigate('/deals')}
//             >
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Create
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default AddDeal;












// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';

// const { Option } = Select;

// const AddDeal = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Job added successfully!');
//     navigate('/app/hrm/jobs');
//   };

//   return (
//     <div className="add-job-form">
//       <h2 className="mb-4">Create Deal</h2>
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-job"
//         onFinish={onFinish}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true, message: 'Please enter a job title.' }]}>
//               <Input placeholder="Enter Job Title" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="branch" label="Branch" rules={[{ required: true, message: 'Please select a branch.' }]}>
//               <Select placeholder="Select Branch">
//                 <Option value="all">All</Option>
//                 <Option value="branch1">Branch 1</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="jobCategory" label="Job Category" rules={[{ required: true, message: 'Please select a category.' }]}>
//               <Select placeholder="Select Job Category">
//                 <Option value="it">IT</Option>
//                 <Option value="hr">HR</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="positions" label="Positions" rules={[{ required: true, message: 'Please enter positions.' }]}>
//               <Input placeholder="Enter Positions" />
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

//           <Col span={24}>
//             <Form.Item name="skills" label="Skill" rules={[{ required: true, message: 'Please enter skills.' }]}>
//               <Input placeholder="Enter Skills" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="jobDescription" label="Job Description" rules={[{ required: true }]}>
//               <ReactQuill placeholder="Write here..." />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item name="jobRequirement" label="Job Requirement" rules={[{ required: true }]}>
//               <ReactQuill placeholder="Write here..." />
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Checkbox.Group>
//               <Row>
//                 <Col span={6}><Checkbox value="gender">Gender</Checkbox></Col>
//                 <Col span={6}><Checkbox value="dob">Date of Birth</Checkbox></Col>
//                 <Col span={6}><Checkbox value="country">Country</Checkbox></Col>
//                 <Col span={6}><Checkbox value="profileImage">Profile Image</Checkbox></Col>
//               </Row>
//             </Checkbox.Group>
//           </Col>
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

// export default AddDeal;



