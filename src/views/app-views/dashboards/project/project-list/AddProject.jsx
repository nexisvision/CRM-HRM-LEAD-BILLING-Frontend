import React,{useState} from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import utils from 'utils';
import OrderListData from "assets/data/order-list.data.json"
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddProject = () => {
    const navigate = useNavigate();
    const [list, setList] = useState()

    const initialValues = {
        name: '',
        startdate: null,
        enddate: null,
        projectimage: '',
        client: '',
        user: '',
        budget: '',
        estimatedhours: '',
        description: '',
        tag: '',
        status: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Please enter a Project Name.'),
        startdate: Yup.date().nullable().required('Start date is required.'),
        enddate: Yup.date().nullable().required('End date is required.'),
        projectimage: Yup.mixed().required('Please upload a Project Image.'),
        client: Yup.string().required('Please select Client.'),
        user: Yup.string().required('Please select User.'),
        budget: Yup.number().required('Please enter a Project Budget.').positive('Budget must be positive.'),
        estimatedhours: Yup.number().required('Please enter Estimated Hours.').positive('Hours must be positive.'),
        description: Yup.string().required('Please enter a Project Description.'),
        tag: Yup.string().required('Please enter a Tag.'),
        status: Yup.string().required('Please select Status.'),
    });


    const onSubmit = (values) => {
        console.log('Submitted values:', values);
        message.success('Project added successfully!');
        navigate('/app/apps/project');
    };
    // console.log("object",Option)

    return (
        <div className="add-job-form">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched, }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <h2 className="mb-4 border-b pb-2 font-medium"></h2>

                        <Row gutter={16}>
                            <Col span={24}>
                                <div className="form-item">
                                    <label className='font-semibold'>Project Name</label>
                                    <Field name="name" as={Input} placeholder="Enter Project Name" rules={[{ required: true}]} />
                                    <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Start Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.startdate}
                                        onChange={(date) => setFieldValue('startdate', date)}
                                        onBlur={() => setFieldTouched("startdate", true)}
                                    />
                                    <ErrorMessage name="startdate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>End Date</label>
                                    <DatePicker
                                        className="w-full"
                                        format="DD-MM-YYYY"
                                        value={values.enddate}
                                        onChange={(date) => setFieldValue('enddate', date)}
                                        onBlur={() => setFieldTouched("enddate", true)}
                                    />
                                    <ErrorMessage name="enddate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Project Image</label>
                                    <Input
                                        type="file"
                                        onChange={(event) => setFieldValue('projectimage', event.currentTarget.files[0])}
                                        onBlur={() => setFieldTouched("projectimage", true)}
                                    />
                                    <ErrorMessage name="projectimage" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Client</label>
                                    <Field name="client">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select Client"
                                                onChange={(value) => setFieldValue('client', value)}
                                                value={values.client}
                                                onBlur={() => setFieldTouched("client", true)}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    
                                    <ErrorMessage name="client" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>User</label>
                                    <Field name="user">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                className="w-full"
                                                placeholder="Select User"
                                                onChange={(value) => setFieldValue('user', value)}
                                                value={values.user}
                                                onBlur={() => setFieldTouched("user", true)}
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

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Budget</label>
                                    <Field name="budget" as={Input} type="number" placeholder="Enter Project Budget" />
                                    <ErrorMessage name="budget" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Estimated Hours</label>
                                    <Field name="estimatedhours" as={Input} type="number" placeholder="Enter Estimated Hours" />
                                    <ErrorMessage name="estimatedhours" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={24} className='mt-4'>
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

                            <Col span={24} className='mt-4'>
                                <div className="form-item">
                                    <label className='font-semibold'>Tag</label>
                                    <Field name="tag" as={Input} placeholder="Enter Project Tag" />
                                    <ErrorMessage name="tag" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={12} className='mt-4'>
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
                                                <Option value="active">Active</Option>
                                                <Option value="inactive">Inactive</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    {/* <Field name="status" as={Select} className='w-full' placeholder="Select Status">
                                        <Option value="xyz">xyz</Option>
                                        <Option value="abc">abc</Option>
                                    </Field> */}
                                    {/* <Select placeholder="Select Client">
                                 <Option value="xyz">xyz</Option>
                                 <Option value="abc">abc</Option>
                             </Select> */}
                                    <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                        </Row>

                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/apps/project')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProject;


// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// // import { Formik, Form, Field, ErrorMessage } from 'formik';
// // import * as Yup from 'yup';

// const { Option } = Select;

// const AddProject = () => {
//     const [form] = Form.useForm();
//     const navigate = useNavigate();

//     // const initialValues = {
//     //             name: '',
//     //             startdate: null,
//     //             enddate: null,
//     //             projectimage: null,
//     //             client: '',
//     //             user: '',
//     //             budget: '',
//     //             estimatedhours: '',
//     //             description: '',
//     //             tag: '',
//     //             status: '',
//     //         };
        
//     //         const validationSchema = Yup.object({
//     //             name: Yup.string().required('Please enter a Project Name.'),
//     //             startdate: Yup.date().required('Start date is required.'),
//     //             enddate: Yup.date().required('End date is required.'),
//     //             projectimage: Yup.mixed().required('Please upload a Project Image.'),
//     //             client: Yup.string().required('Please select Client.'),
//     //             user: Yup.string().required('Please select User.'),
//     //             budget: Yup.number().required('Please enter a Project Budget.').positive('Budget must be positive.'),
//     //             estimatedhours: Yup.number().required('Please enter Estimated Hours.').positive('Hours must be positive.'),
//     //             tag: Yup.string().required('Please enter a Tag.'),
//     //             status: Yup.string().required('Please select Status.'),
//     //         });

//     const onFinish = (values) => {
//         console.log('Submitted values:', values);
//         message.success('Job added successfully!');
//         navigate('/app/hrm/jobs');
//     };

//     return (
//         <div className="add-job-form">
//              {/* <Formik
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={onFinish}
//             >
//                 {({ values, setFieldValue, handleSubmit }) => ( */}
//             <Form
//                 layout="vertical"
//                 form={form}
//                 name="add-job"
//                 // onSubmit={handleSubmit}
//                 onFinish={onFinish}
//                 className="formik-form"
//             >
//             <h2 className="mb-4 border-b pb-2 font-medium"></h2>

//                 <Row gutter={16}>

//                     <Col span={24}>
//                         <Form.Item name="name" label="Project Name" rules={[{ required: true, message: 'Please enter a Project Name.' }]}>
//                             <Input placeholder="Enter Project Name" />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             name="startdate"
//                             label="Start Date"
//                             rules={[{ required: true, message: 'Start date is required.' }]}
//                         >
//                             <DatePicker
//                                 className="w-full"
//                                 format="DD-MM-YYYY"
//                             />
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item
//                             name="enddate"
//                             label="End Date"
//                             rules={[{ required: true, message: 'End date is required.' }]}
//                         >
//                             <DatePicker
//                                 className="w-full"
//                                 format="DD-MM-YYYY"
//                             />
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item name="projectimage" label="Project Image" rules={[{ required: true, message: 'Please uploade a Project Image.' }]}>
//                             <Input type='file' />
//                         </Form.Item>
//                     </Col>


//                     <Col span={12}>
//                         <Form.Item name="client" label="Client" rules={[{ required: true, message: 'Please select Client.' }]}>
//                             <Select placeholder="Select Client">
//                                 <Option value="xyz">xyz</Option>
//                                 <Option value="abc">abc</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item name="user" label="User" rules={[{ required: true, message: 'Please select User.' }]}>
//                             <Select placeholder="Select User">
//                                 <Option value="xyz">xyz</Option>
//                                 <Option value="abc">abc</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item name="budget" label="Budget" rules={[{ required: true, message: 'Please Enter a Project Budget.' }]}>
//                             <Input type='number' placeholder='Enter a Project Budget.'/>
//                         </Form.Item>
//                     </Col>

//                     <Col span={12}>
//                         <Form.Item name="estimatedhours" label="Estimated Hours" rules={[{ required: true, message: 'Please Enter a Estimated Hours.' }]}>
//                             <Input type='number' placeholder='Enter Project a Estimated Hours.'/>
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item name="description" label="Description">
//                             <ReactQuill placeholder="Enter Description" />
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item name="tag" label="Tag" rules={[
//                             { required: true, message: 'Please enter an Tag.' },
//                             { type: 'email', message: 'Please enter a Tag.' },
//                         ]}>
//                             <Input placeholder="Enter Project Tag" />
//                         </Form.Item>
//                     </Col>

//                     <Col span={24}>
//                         <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select Status.' }]}>
//                             <Select name="status" placeholder="Select Status">
//                                 <Option value="xyz">xyz</Option>
//                                 <Option value="abc">abc</Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>


//                 </Row>

//                 <Form.Item>
//                     <div className="form-buttons text-right">
//                         <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
//                         <Button type="primary" htmlType="submit">Create</Button>
//                     </div>
//                 </Form.Item>
//             </Form>
//         {/* )}
//         //             </Formik> */}
//         </div>
//     );
// };

// export default AddProject;



