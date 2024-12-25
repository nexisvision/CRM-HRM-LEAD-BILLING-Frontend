import React, { useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddExpenses = () => {
    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);

    const initialValues = {
        client: '',
        user: '',
        project: '',
        amount: '',
        status: '',
        date: null,
        description: '',
    };

    const validationSchema = Yup.object({
        client: Yup.string().required('Please enter client name.'),
        user: Yup.string().required('Please enter a user name.'),
        project: Yup.string().required('Please enter project name.'),
        amount: Yup.number().required('Please enter amount.').min(1, "Minimum value is 1."),
        status: Yup.string().required('Please select a status.'),
        date: Yup.date().nullable().required('Date is required.'),
        description: Yup.string().required('Please enter a description.'),
    });

    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Expenses added successfully!');
        resetForm();
        navigate('/apps/sales/expenses');
    };

    return (
        <div className="add-expenses-form">
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
                                    <label className='font-semibold'>Client</label>
                                    <Field name="client" as={Input} placeholder="Enter Client Name" />
                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="form-item">
                                    <label className='font-semibold'>User</label>
                                    <Field name="user" as={Input} placeholder="Enter User Name" />
                                    <ErrorMessage name="user" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project</label>
                                    <Field name="project" as={Input} placeholder="Enter Project Name" />
                                    <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Amount</label>
                                    <Field name="amount" type='number' as={Input} placeholder="Enter Amount" />
                                    <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Status</label>
                                    <Field name="status">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Status"
                                                onChange={(value) => setFieldValue('status', value)}
                                                value={values.status}
                                                onBlur={() => setFieldTouched("status", true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.date}
                                        onChange={(date) => setFieldValue('date', date)}
                                        onBlur={() => setFieldTouched("date", true)}
                                    />
                                    <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-2'>
                                <div className="form-item">
                                    <label className='font-semibold'>Description</label>
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        placeholder="Enter Description"
                                        onBlur={() => setFieldTouched("description", true)}
                                    />
                                    <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-2'>
                                <div className="form-item flex justify-between">
                                    <label className='font-semibold'>Add Receipt</label>
                                    <Switch
                                        checked={showReceiptUpload}
                                        onChange={(checked) => setShowReceiptUpload(checked)}
                                    />
                                </div>
                            </Col>

                            {showReceiptUpload && (
                                <Col span={12} className='mt-4'>
                                     <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Receipt</Button>
                            </Upload>
                                    {/* <Button
                                        type="dashed"
                                        icon={<UploadOutlined />}
                                        onClick={() => setShowReceiptUpload(false)}
                                    >
                                        Upload Receipt
                                    </Button> */}
                                </Col>
                            )}
                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                        {/* <Modal
                            title="Upload Receipt"
                            visible={uploadModalVisible}
                            onCancel={() => setUploadModalVisible(false)}
                            footer={null}
                        >
                            <Upload beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Modal> */}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddExpenses;



// import React, { useState } from 'react';
// import { Input, Button, DatePicker, Select, message, Row, Col ,Switch, Upload } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import utils from 'utils';
// import OrderListData from "assets/data/order-list.data.json"
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const { Option } = Select;

// const AddExpenses = () => {
//   // const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const [showReceiptUpload, setShowReceiptUpload] = useState(false); 

//     const initialValues = {
//       client: '',
//       user: '',
//       project: '',
//       amount: '',
//       status:'',
//       dates: null,
//       description: '',
//     };

//     const validationSchema = Yup.object({
//       client: Yup.string().required('Please enter client name.'),
//       user: Yup.string().required('Please enter a user Name.'),
//       project: Yup.string().required('Please enter Project.'),
//       amount: Yup.number().required('Please enter amount Value .').positive('amount Value must be positive.'),
//       status: Yup.string().required('Please select status.'),
//       dates: Yup.date().nullable().required('Date is required.'),
//       description: Yup.string().required('Please enter a Description.'),
//     });


//     const onSubmit = (values) => {
//       console.log('Submitted values:', values);
//           message.success('Expenses added successfully!');
//           // form.resetFields();
//           navigate('/apps/sales/expenses');
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
//                             <Col span={12}>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Client</label>
//                                     <Field name="client" as={Input} placeholder="Enter client Name" rules={[{ required: true }]} />
//                                     <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12}>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>User</label>
//                                     <Field name="user" as={Input} placeholder="Enter user name" rules={[{ required: true }]} />
//                                     <ErrorMessage name="user" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12}>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Project</label>
//                                     <Field name="project" as={Input} placeholder="Enter project" />
//                                     <ErrorMessage name="project" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12}>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Amount</label>
//                                     <Field name="amount" as={Input} placeholder="Enter amount" rules={[{ required: true }]}  type='number' />
//                                     <ErrorMessage name="amount" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12} >
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Status</label>
//                                     <Field name="status">
//                                         {({ field }) => (
//                                             <Select
//                                                 {...field}
//                                                 className="w-full"
//                                                 placeholder="Select Status"
//                                                 onChange={(value) => setFieldValue('status', value)}
//                                                 value={values.status}
//                                             >
//                                                 <Option value="xyz">Ready</Option>
//                                                 <Option value="abc">Shipped</Option>
//                                             </Select>
//                                         )}
//                                     </Field>

//                                     <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={12} className='mt-4'>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Date</label>
//                                     <DatePicker
//                                         className="w-full"
//                                         format="DD-MM-YYYY"
//                                         value={values.dates}
//                                         onChange={(date) => setFieldValue('dates', date)}
//                                     />
//                                     <ErrorMessage name="dates" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                             <Col span={24} className='mt-4'>
//                                 <div className="form-item">
//                                     <label className='font-semibold'>Description</label>
//                                     <ReactQuill
//                                         value={values.description}
//                                         onChange={(value) => setFieldValue('description', value)}
//                                         placeholder="Enter Description"
//                                     />
//                                     <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
//                                 </div>
//                             </Col>

//                              {/* Toggle button for Receipt Upload */}
//            <Col span={12}>
//              <Form.Item label="Add Receipt">
//                <Switch
//                 checked={showReceiptUpload}
//                 onChange={(checked) => setShowReceiptUpload(checked)}
//               />
//             </Form.Item>
//           </Col>

//           {/* Conditionally show Upload field */}
//           {showReceiptUpload && (
//             <Col span={12}>
//               <Form.Item name="receipt" label="Upload Receipt">
//                 <Upload beforeUpload={() => false}>
//                   <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                 </Upload>
//               </Form.Item>
//             </Col>
//           )}

//                         </Row>

//                         <div className="form-buttons text-right mt-4">
//                             <Button type="default" className="mr-2" onClick={() => navigate('/app/apps/project')}>Cancel</Button>
//                             <Button type="primary" htmlType="submit">Create</Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     );
// };

// export default AddExpenses;




// import React, { useState } from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';

// const { Option } = Select;

// const AddExpenses = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const [showReceiptUpload, setShowReceiptUpload] = useState(false); // State to manage toggle

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Expenses added successfully!');
//     form.resetFields();
//     navigate('/apps/sales/expenses');
//   };

//   return (
//     <div className="add-job-form">
//       {/* <h2 className="mb-4">Create New Expenses</h2> */}
//       <Form layout="vertical" form={form} name="add-job" onFinish={onFinish}>
//       <h2 className="mb-4 border-b pb-2 font-medium"></h2>

//         <Row gutter={16}>
     

//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Client"
//               rules={[{ required: true, message: 'Please enter a client name.' }]}
//             >
//               <Input type="text" placeholder="Enter Client" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="user"
//               label="User"
//               rules={[{ required: true, message: 'Please enter a User name.' }]}
//             >
//               <Input type="text" placeholder="Enter User" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="project"
//               label="Project"
//               rules={[{ required: true, message: 'Please Enter a Project.' }]}
//             >
//               <Input type="text" placeholder="Enter Project" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="amount"
//               label="Amount"
//               rules={[{ required: true, message: 'Please enter an Amount.' }]}
//             >
//               <Input type="number" placeholder="Enter Amount" />
//             </Form.Item>
//           </Col>

//           <Col span={12}>
//             <Form.Item
//               name="status"
//               label="Status"
//               rules={[{ required: true, message: 'Please Select Status.' }]}
//             >
//               <Select placeholder="--">
//                 <Option value="xyz">Ready</Option>
//                 <Option value="abc">Shipped</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="date"
//               label="Date"
//               rules={[{ required: true, message: 'Date is required.' }]}
//             >

//               <DatePicker style={{ width: '100%' }} placeholder="DD-MM-YYYY" format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           <Col span={24}>
//             <Form.Item name="description" label="Description">
//               <ReactQuill placeholder="Enter Description" />
//             </Form.Item>
//           </Col>

//           {/* Toggle button for Receipt Upload */}
//           <Col span={12}>
//             <Form.Item label="Add Receipt">
//               <Switch
//                 checked={showReceiptUpload}
//                 onChange={(checked) => setShowReceiptUpload(checked)}
//               />
//             </Form.Item>
//           </Col>

//           {/* Conditionally show Upload field */}
//           {showReceiptUpload && (
//             <Col span={12}>
//               <Form.Item name="receipt" label="Upload Receipt">
//                 <Upload beforeUpload={() => false}>
//                   <Button icon={<UploadOutlined />}>Click to Upload</Button>
//                 </Upload>
//               </Form.Item>
//             </Col>
//           )}
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button
//               type="default"
//               className="mr-2"
//               onClick={() => navigate('/apps/sales/expenses')}
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

// export default AddExpenses;









// // import React from 'react';
// // import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// // import { useNavigate } from 'react-router-dom';
// // import 'react-quill/dist/quill.snow.css';
// // import ReactQuill from 'react-quill';

// // const { Option } = Select;

// // const AddExpenses = () => {
// //   const [form] = Form.useForm();
// //   const navigate = useNavigate();

// //   const onFinish = (values) => {
// //     console.log('Submitted values:', values);
// //     message.success('expenses added successfully!');
// //     form.resetFields();
// //     navigate('/apps/sales/expenses');
// //   };

// //   return (
// //     <div className="add-job-form">
// //       <h2 className="mb-4">Create New Expenses</h2>
// //       <Form
// //         layout="vertical"
// //         form={form}
// //         name="add-job"
// //         onFinish={onFinish}
// //       >
// //         <Row gutter={16}>     

// //           <Col span={12}>
// //             <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Date is required.' }]}>
// //               <DatePicker style={{ width: '100%' }} placeholder='DD-MM-YYYY' format="DD-MM-YYYY" />
// //             </Form.Item>
// //           </Col>

// //           <Col span={24}>
// //             <Form.Item name="description" label="Description">
// //               <ReactQuill placeholder="Enter Description" />
// //             </Form.Item>
// //           </Col>         

// //           <Col span={12}>
// //             <Form.Item name="name" label="Client" rules={[{ required: true, message: 'Please enter a client name.' }]}>
// //               <Input type='text' placeholder="Enter Client" />
// //             </Form.Item>
// //           </Col>

// //           <Col span={12}>
// //             <Form.Item name="user" label="User" rules={[{ required: true, message: 'Please enter a User name.' }]}>
// //               <Input type='text' placeholder="Enter User" />
// //             </Form.Item>
// //           </Col>

// //           <Col span={12}>
// //             <Form.Item name="project" label="Project" rules={[{ required: true, message: 'Please Enter a Project.' }]}>
// //             <Input type='text' placeholder="Enter Project" />
// //             </Form.Item>
// //           </Col>

// //           <Col span={12}>
// //             <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter a Amount.' }]}>
// //               <Input type='number' placeholder="Enter Amount" />
// //             </Form.Item>
// //           </Col>         

// //           <Col span={12}>
// //             <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please Select Status.' }]}>
// //             <Select placeholder="--">
// //                 <Option value="xyz">Ready</Option>
// //                 <Option value="abc">Shipped</Option>
// //               </Select>
// //             </Form.Item>
// //           </Col>       

// //         </Row>

// //         <Form.Item>
// //           <div className="form-buttons text-right">
// //             <Button type="default" className="mr-2" onClick={() => navigate('/apps/sales/expenses')}>Cancel</Button>
// //             <Button type="primary" htmlType="submit">Create</Button>
// //           </div>
// //         </Form.Item>
// //       </Form>
// //     </div>
// //   );
// // };

// // export default AddExpenses;



