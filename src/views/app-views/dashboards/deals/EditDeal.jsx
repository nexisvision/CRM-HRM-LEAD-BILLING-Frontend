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

const EditDeal = () => {
    const navigate = useNavigate();

    const initialValues = {
        dealName: '',
        phone: '',
        price: '',
        pipeline: '',
        stage: '',
        sources: '',
        products: '',
        notes:'',
    };

    const validationSchema = Yup.object({
        dealName: Yup.string().required('Please enter a Deal Name.'),
        phone: Yup.string().matches(/^\+\d{1,3}\d{10}$/, 'Phone number must include country code and be 10 digits.').required('please enter a phone number'),
        price: Yup.string().required('Please enter a Price.'),
        pipeline: Yup.string().required('Please select Pipeline.'),
        stage: Yup.string().required('Please select Stage.'),
        sources: Yup.string().required('Please select Sources.'),
        products: Yup.string().required('Please select Products.'),
        notes: Yup.string().required('Please enter a Notes.'),
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
                {({ values, setFieldValue, handleSubmit, handleChange, }) => (
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
                                    <Field name="phone" as={Input} placeholder="Enter Phone Number" />
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
                                    <label className='font-semibold'>Pipeline</label>
                                    <Field name="pipeline">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Pipeline"
                                                onChange={(value) => setFieldValue('pipeline', value)}
                                                value={values.pipeline}
                                            >
                                                <Option value="marketing">Marketing</Option>
                                                <Option value="sales">Sales</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="pipeline" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Stage</label>
                                    <Field name="stage">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Stage"
                                                onChange={(value) => setFieldValue('stage', value)}
                                                value={values.stage}
                                            >
                                                <Option value="marketing">Marketing</Option>
                                                <Option value="sales">Sales</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    {/* <Field name="user" as={Select} className='w-full' placeholder="Select User">
                                        <Option value="xyz">xyz</Option>
                                        <Option value="abc">abc</Option>
                                    </Field> */}
                                    <ErrorMessage name="stage" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Sources</label>
                                    <Field name="sources">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                mode="multiple"
                                                placeholder="Select Sources"
                                                onChange={(value) => setFieldValue('sources', value)}
                                                value={values.sources}
                                            >
                                                <Option value="Linkdin">Linkdin</Option>
                                                <Option value="Facebook">Facebook</Option>
                                                <Option value="Website">Website</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="sources" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Products</label>
                                    <Field name="sources">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                mode="multiple"
                                                placeholder="Select Products"
                                                onChange={(value) => setFieldValue('products', value)}
                                                value={values.products}
                                            >
                                                <Option value="Clock">Clock</Option>
                                                <Option value="Dates">Dates</Option>
                                                <Option value="badsheets">Bed Sheets</Option>
                                                <Option value="Broccoli">Broccoli</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="products" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Notes</label>
                                    <ReactQuill
                                        value={values.notes}
                                        onChange={(value) => setFieldValue('notes', value)}
                                        placeholder="Enter Notes"
                                    />
                                    <ErrorMessage name="notes" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>


                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/deals')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Update</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditDeal;


// import React, { useEffect } from 'react';
// import { Form, Input, Button, Select, Row, Col, message } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const EditDeal = ({ dealData, onUpdateDeal }) => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Pre-fill the form with existing deal data
//     if (dealData) {
//       form.setFieldsValue({
//         dealName: dealData.dealName,
//         phone: dealData.phone,
//         price: dealData.price,
//         clients: dealData.clients,
//       });
//     }
//   }, [form, dealData]);

//   const onFinish = (values) => {
//     const updatedDeal = {
//       ...dealData,
//       ...values, // Update the existing deal with new values
//     };
//     onUpdateDeal(updatedDeal);
//     message.success('Deal updated successfully!');
//     // Redirect to the deals page after update
//     navigate('/deals');
//   };

//   return (
//     <div className="edit-deal-form">
//       {/* <h2 className="mb-4">Edit Deal</h2> */}
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//       <Form
//         layout="vertical"
//         form={form}
//         name="edit-deal"
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
//               Update
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditDeal;
