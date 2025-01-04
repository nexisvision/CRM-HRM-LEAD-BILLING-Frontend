import React, { useState, useEffect } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, Switch, Upload, Modal } from 'antd';
import { CloudUploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { getallcurrencies } from 'views/app-views/setting/currencies/currenciesreducer/currenciesSlice';
// import { getallcurrencies } from '../../../setting/currencies/currenciesreducer/currenciesSlice';

const { Option } = Select;

const AddJob = () => {

    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);



    const { currencies } = useSelector((state) => state.currencies);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        jobtitle: '',
        jobcategory: '',
        skills: '',
        location: '',
        interviewrounds: [],
        startdate: '',
        enddate: '',
        recuiter: '',
        jobtype: '',
        workexpernce: '',
        curreney: '',
        jobdiscription: '',
        status: '',
        expectsalary: '',              // files: '',
    };
    const validationSchema = Yup.object({
        jobtitle: Yup.string().required('Please enter Job Title.'),
        jobcategory: Yup.number().required('Please enter Job Category.'),
        skills: Yup.string().required('Please enter Skills.'),
        location: Yup.string().required('Please enter Location.'),
        interviewrounds: Yup.array().required('please enter Interview Rounds'),
        startdate: Yup.string().required('Please enter Satrt Date.'),
        enddate: Yup.string().required('Please enter End Date.'),
        recuiter: Yup.string().required('Please enter Recuiter.'),
        jobtype: Yup.string().required('Please enter Job Type.'),
        workexpernce: Yup.string().required('Please enter Work Expernce.'),
        curreney: Yup.string().required('Please enter Curreney'),
        jobdiscription: Yup.string().required('Please enter Job Discription.'),
        status: Yup.string().required('Please enter Status.'),
        expectsalary: Yup.string().required('Please enter Expect Salary.'),


        // files: Yup.string().required('Please enter Files.'),
    });
    const onSubmit = (values, { resetForm }) => {
        console.log('Submitted values:', values);
        message.success('Payment added successfully!');
        resetForm();
        navigate('/app/dashboards/project/list');
    };
    return (
        <div className="add-expenses-form">
            <hr style={{ marginBottom: '20px', border: '1px solid #E8E8E8' }} />
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form className="formik-form" onSubmit={handleSubmit}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>Job Title</label>
                                    <Field className='mt-2' name="job title" as={Input} placeholder="Enter job title" />
                                    <ErrorMessage name="job title" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>Job Category</label>
                                    <Field name="job category">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                               
                                                placeholder="Select job category"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('job category', value)}
                                                value={values.jobcategory}
                                                onBlur={() => setFieldTouched('job category', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="job category" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8} >
                                <div className="form-item">
                                    <label className='font-semibold'>Skill</label>
                                    <Field name="skill">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode="multiple"
                                                placeholder="Select skill"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('skill', value)}
                                                value={values.skill}
                                                onBlur={() => setFieldTouched('skill', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="category" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Location</label>
                                                        <Field name="loaction">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                
                                                placeholder="Select loaction"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('loaction', value)}
                                                value={values.loaction}
                                                onBlur={() => setFieldTouched('loaction', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                                        <ErrorMessage name="invoiceDate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Interview Rounds</label>
                                                        <Field name="interview rounds">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode="multiple"
                                                placeholder="Select InterviewRounds"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('interviewrounds', value)}
                                                value={values.interviewrounds}
                                                onBlur={() => setFieldTouched('interviewrounds', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="duedate" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                            <Col span={8} className='mt-3' >
                                <div className="form-item">
                                    <label className='font-semibold'>Start Date </label>
                                    <DatePicker
                                        className="w-full mt-2"
                                        format="DD-MM-YYYY"
                                        value={values.paidOn}
                                        onChange={(date) => setFieldValue("paidOn", date)}
                                        onBlur={() => setFieldTouched("paidOn", true)}
                                    />
                                    <ErrorMessage name="start date" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-3'>
                                <div className="form-item">
                                    <label className='font-semibold'>End Date</label>

                                    <DatePicker
                                        className="w-full mt-2"
                                        format="DD-MM-YYYY"
                                        value={values.paidOn}
                                        onChange={(date) => setFieldValue("paidOn", date)}
                                        onBlur={() => setFieldTouched("paidOn", true)}
                                    />
                                    <ErrorMessage name="end date" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-3'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Recuiter</label>
                                        <Field name="recuiter">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select recuiter"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('recuiter', value)}
                                                value={values.recuiter}
                                                onBlur={() => setFieldTouched('recuiter', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="recuiter" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Job Types</label>
                                        <Field name="job types">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                              
                                                placeholder="Select job types"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('job types', value)}
                                                value={values.jobtypes}
                                                onBlur={() => setFieldTouched('job types', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="jon types" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Work Experence</label>
                                        <Field name="work experence">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select work experence"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('work experence', value)}
                                                value={values.workexperence}
                                                onBlur={() => setFieldTouched('work experence', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="work experence" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Curreney</label>
                                        <Field name="curreney">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select curreney"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('curreney', value)}
                                                value={values.curreney}
                                                onBlur={() => setFieldTouched('curreney', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="curreney" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <div className='mt-4 w-full'>
                                <Col span={24} className='mt-2'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Job Discription</label>

                                        <ReactQuill
                                            value={values.enddate}
                                            onChange={(value) => setFieldValue('end date', value)}
                                            placeholder="Enter discription"
                                            onBlur={() => setFieldTouched("end date", true)}
                                            className='mt-2'
                                        />
                                        <ErrorMessage name="job discription" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>
                            </div>

                            <div className='mt-4 w-full'>
                                <Col span={24} className='mt-2'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Status</label>
                                        <Field className='mt-2' name="status" as={Input} placeholder="Enter status" />
                                        <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>
                            </div>

                            <div className='mt-4 w-full'>
                                <Col span={24} className='mt-2'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Expect Salary</label>
                                        <Field className='mt-2' name="expect salary" as={Input} placeholder="Enter expect salary" />
                                        <ErrorMessage name="expect salary" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>
                            </div>


                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Create</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default AddJob;









// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';

// const { Option } = Select;

// const AddJob = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Job added successfully!');
//     navigate('/app/hrm/jobs');
//   };

//   return (
//     <div className="add-job-form">
//       <h2 className="mb-4">Create Job</h2>
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

// export default AddJob;










// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;
// const { TextArea } = Input;

// const AddJob = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Job added successfully!');
//     navigate('/app/hrm/jobs');
//   };

//   const onFinishFailed = (errorInfo) => {
//     console.error('Form submission failed:', errorInfo);
//     message.error('Please fill out all required fields.');
//   };

//   return (
//     <div className="add-leave-form">
//       <h2 className="mb-4">Create Leave</h2>
//       <Form
//         layout="vertical"
//         form={form}
//         name="add-leave"
//         onFinish={onFinish}
//         onFinishFailed={onFinishFailed}
//       >
//         <Row gutter={16}>
//           {/* Employee */}
//           <Col span={24}>
//             <Form.Item
//               name="employee"
//               label="Employee"
//               rules={[{ required: true, message: 'Please select an employee.' }]}
//             >
//               <Select placeholder="Select Employee">
//                 <Option value="employee1">Employee 1</Option>
//                 <Option value="employee2">Employee 2</Option>
//                 <Option value="employee3">Employee 3</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Leave Type */}
//           <Col span={24}>
//             <Form.Item
//               name="leaveType"
//               label="Leave Type"
//               rules={[{ required: true, message: 'Please select leave type.' }]}
//             >
//               <Select placeholder="Select Leave Type">
//                 <Option value="sick">Sick Leave</Option>
//                 <Option value="casual">Casual Leave</Option>
//                 <Option value="annual">Annual Leave</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Start and End Date */}
//           <Col span={12}>
//             <Form.Item
//               name="startDate"
//               label="Start Date"
//               rules={[{ required: true, message: 'Start Date is required.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="dd-mm-yyyy" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="endDate"
//               label="End Date"
//               rules={[{ required: true, message: 'End Date is required.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="dd-mm-yyyy" />
//             </Form.Item>
//           </Col>

//           {/* Leave Reason */}
//           <Col span={24}>
//             <Form.Item
//               name="leaveReason"
//               label="Leave Reason"
//               rules={[{ required: true, message: 'Please provide a leave reason.' }]}
//             >
//               <TextArea rows={4} placeholder="Leave Reason" />
//             </Form.Item>
//           </Col>

//           {/* Remark */}
//           <Col span={24}>
//             <Form.Item
//               name="remark"
//               label="Remark"
//               rules={[{ required: true, message: 'Please provide a remark.' }]}
//             >
//               <TextArea rows={4} placeholder="Leave Remark" />
//             </Form.Item>
//           </Col>
//         </Row>

//         {/* Form Buttons */}
//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button
//               type="default"
//               className="mr-2"
//               onClick={() => navigate('/app/hrm/jobs')}
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

// export default AddJob;


