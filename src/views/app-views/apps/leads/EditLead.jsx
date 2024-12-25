import React, { useEffect } from 'react';
import { Input, Button, Select, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditLead = ({ leadData, onUpdateLead }) => {
  const navigate = useNavigate();

  const initialValues = {
    subject: leadData?.subject,
    users: leadData?.users,
    name: leadData?.name,
    phone: leadData?.phone,
    email: leadData?.email,
    pipeline: leadData?.pipeline,
    stage: leadData?.stage ,
    stage: leadData?.stage,
    stage: leadData?.stage,
    notes: leadData?.notes,
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required('Please enter a subject name.'),
    users: Yup.array().required('Please select a user.'),
    name: Yup.string().required('Please enter a name.'),
    phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits.').required('Please enter a phone number.'),
    email: Yup.string().email('Invalid email format.').required('Please enter an email.'),
    pipeline: Yup.array().required('Please select a pipeline.'),
    stage: Yup.array().required('Please select a stage.'),
    sources: Yup.string().required('Please select Sources.'),
    products: Yup.string().required('Please select Products.'),
    notes: Yup.string().required('Please add some notes.'),
  });

  const onSubmit = (values) => {
    const updatedLead = {
      ...leadData,
      ...values,
    };
    onUpdateLead(updatedLead);
    message.success('Lead updated successfully!');
    navigate('/leads');
  };

  return (
    <div className="edit-deal-form">
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit,setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Subject</label>
                  <Field name="subject" as={Input} placeholder="Enter Subject" />
                  <ErrorMessage name="subject" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">User</label>
                  <Field name="users">
                    {({ field }) => (
                      <Select
                        {...field}
                        mode="multiple"
                        className="w-full"
                        placeholder="Select User"
                        onChange={(value) => setFieldValue('users', value)}
                        value={values.users}
                        onBlur={() => setFieldTouched("users", true)}
                      >
                        <Option value="User1">User 1</Option>
                        <Option value="User2">User 2</Option>
                        <Option value="User3">User 3</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="users" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-4'>
                <div className="form-item">
                  <label className="font-semibold">Name</label>
                  <Field name="name" as={Input} placeholder="Enter Name" />
                  <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-4'>
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <Field name="phone" as={Input} placeholder="Enter Phone" />
                  <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-4'>
                <div className="form-item">
                  <label className="font-semibold">Email</label>
                  <Field name="email" as={Input} placeholder="Enter Email" />
                  <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-4'>
                <div className="form-item">
                  <label className="font-semibold">Pipeline</label>
                  <Field name="pipeline">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Pipeline"
                        onChange={(value) => setFieldValue('pipeline', value)}
                        onBlur={() => setFieldTouched("pipeline", true)}
                        value={values.pipeline}
                      >
                        <Option value="Pipeline1">Pipeline 1</Option>
                        <Option value="Pipeline2">Pipeline 2</Option>
                        <Option value="Pipeline3">Pipeline 3</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="pipeline" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-4'>
                <div className="form-item">
                  <label className="font-semibold">Stage</label>
                  <Field name="stage">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Stage"
                        onChange={(value) => setFieldValue('stage', value)}
                        onBlur={() => setFieldTouched("stage", true)}
                        value={values.stage}
                      >
                        <Option value="Stage1">Stage 1</Option>
                        <Option value="Stage2">Stage 2</Option>
                        <Option value="Stage3">Stage 3</Option>
                      </Select>
                    )}
                  </Field>
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
                                                              onBlur={() => setFieldTouched("sources", true)}
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
                                                              onBlur={() => setFieldTouched("products", true)}
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
                  <label className="font-semibold">Notes</label>
                  <Field name="notes">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.notes}
                        onChange={(value) => setFieldValue('notes', value)}
                        onBlur={() => setFieldTouched("notes", true)}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="notes" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>
            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={() => navigate('/deals')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditLead;





// import React, { useEffect } from 'react';
// import { Form, Input, Button, Select, Row, Col, message } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';

// const { Option } = Select;

// const EditLead = ({ leadData, onUpdateLead }) => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Pre-fill the form with existing deal data
//     if (leadData) {
//       form.setFieldsValue({
//         subject: leadData.subject,
//         name:leadData.name,
//         phone: leadData.phone,
//         email: leadData.email,
//         clients: leadData.clients,
//       });
//     }
//   }, [form, leadData]);

//   const onFinish = (values) => {
//     const updatedLead = {
//       ...leadData,
//       ...values, // Update the existing deal with new values
//     };
//     onUpdateLead(updatedLead);
//     message.success('Lead updated successfully!');
//     // Redirect to the deals page after update
//     navigate('/leads');
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
//         <Col span={12}>
//             <Form.Item
//               name="subject"
//               label="Subject"
//               rules={[{ required: true, message: 'Please enter a subject name.' }]}
//             >
//               <Input placeholder="Enter Subject" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="users"
//               label="User"
//               rules={[{ required: true, message: 'Please select a user.' }]}
//             >
//               <Select placeholder="Select User" mode="multiple">
//                 <Option value="User1">User 1</Option>
//                 <Option value="User2">User 2</Option>
//                 <Option value="User3">User 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[{ required: true, message: 'Please enter a name.' }]}
//             >
//               <Input placeholder="Enter Name" />
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
//               name="email"
//               label="Email"
//               rules={[{ required: true, message: 'Please enter the email.' }]}
//             >
//               <Input placeholder="Enter email" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="pipeline"
//               label="Pipeline"
//               rules={[{ required: true, message: 'Please select a user.' }]}
//             >
//               <Select placeholder="Select Pipeline" mode="multiple">
//                 <Option value="Pipeline1">Pipeline 1</Option>
//                 <Option value="Pipeline2">Pipeline 2</Option>
//                 <Option value="Pipeline3">Pipeline 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="stage"
//               label="Stage"
//               rules={[{ required: true, message: 'Please select a user.' }]}
//             >
//               <Select placeholder="Select Stage" mode="multiple">
//                 <Option value="Stage1">Stage 1</Option>
//                 <Option value="Stage2">Stage 2</Option>
//                 <Option value="Stage3">Stage 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Form.Item name="notes" label="Notes" rules={[{ required: true }]}>
//               <ReactQuill placeholder="Write here..." />
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

// export default EditLead;
