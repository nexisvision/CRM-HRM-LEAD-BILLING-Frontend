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

const EditJob = () => {

    const navigate = useNavigate();
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);



    const { currencies } = useSelector((state) => state.currencies);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getallcurrencies());
    }, [dispatch]);
    // const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const initialValues = {
        title: '',
        category: '',
        skillss: '',
        location: '',
        interviewRounds: [],
        startDate: '',
        endDate: '',
        recruiter: '',
        jobType: '',
        workExperience: '',
        currency: '',
        description: '',
        status: '',
        expectedSalary: '',              // files: '',
    };
    const validationSchema = Yup.object({
        title: Yup.string().required('Please enter Job Title.'),
        category: Yup.number().required('Please enter Job Category.'),
        skillss: Yup.string().required('Please enter Skills.'),
        location: Yup.string().required('Please enter Location.'),
        interviewRounds: Yup.array().required('please enter Interview Rounds'),
        startDate: Yup.string().required('Please enter Satrt Date.'),
        endDate: Yup.string().required('Please enter End Date.'),
        recruiter: Yup.string().required('Please enter recruiter.'),
        jobType: Yup.string().required('Please enter Job Type.'),
        workExperience: Yup.string().required('Please enter Work Expernce.'),
        currency: Yup.string().required('Please enter currency'),
        description: Yup.string().required('Please enter Job Discription.'),
        status: Yup.string().required('Please enter status.'),
        expectedSalary: Yup.string().required('Please enter Expect Salary.'),


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
                                    <Field className='mt-2' name="title" as={Input} placeholder="Enter job title" />
                                    <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={8}>
                                <div className="form-item">
                                    <label className='font-semibold'>Job Category</label>
                                    <Field name="category">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                               
                                                placeholder="Select job category"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('category', value)}
                                                value={values.category}
                                                onBlur={() => setFieldTouched('category', true)}
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
                            <Col span={8} >
                                <div className="form-item">
                                    <label className='font-semibold'>Skill</label>
                                    <Field name="skillss">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode="multiple"
                                                placeholder="Select skillss"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('skillss', value)}
                                                value={values.skillss}
                                                onBlur={() => setFieldTouched('skillss', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="skillss" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>
                            <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Location</label>
                                                        <Field name="location">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                
                                                placeholder="location"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('location', value)}
                                                value={values.location}
                                                onBlur={() => setFieldTouched('location', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                                        <ErrorMessage name="location" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                                                <Col span={12} className='mt-2'>
                                                    <div className="form-item">
                                                        <label className='font-semibold mb-2'>Interview Rounds</label>
                                                        <Field name="interviewRounds">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                mode="multiple"
                                                placeholder=" Select interviewRounds"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('interviewRounds', value)}
                                                value={values.interviewRounds}
                                                onBlur={() => setFieldTouched('interviewRounds', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                    <ErrorMessage name="interviewRounds" component="div" className="error-message text-red-500 my-1" />
                                                    </div>
                                                </Col>
                            <Col span={8} className='mt-3' >
                                <div className="form-item">
                                    <label className='font-semibold'>Start Date </label>
                                    <DatePicker
                                        name='startDate'
                                        className="w-full mt-2"
                                        format="DD-MM-YYYY"
                                        value={values.startDate}
                                        onChange={(date) => setFieldValue("startDate", date)}
                                        onBlur={() => setFieldTouched("startDate", true)}
                                    />
                                    <ErrorMessage name="startDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-3'>
                                <div className="form-item">
                                    <label className='font-semibold'>End Date</label>

                                    <DatePicker
                                    name='endDate'
                                        className="w-full mt-2"
                                        format="DD-MM-YYYY"
                                        value={values.endDate}
                                        onChange={(date) => setFieldValue("endDate", date)}
                                        onBlur={() => setFieldTouched("endDate", true)}
                                    />
                                    <ErrorMessage name="endDate" component="div" className="error-message text-red-500 my-1" />
                                </div>
                            </Col>

                            <Col span={8} className='mt-3'>
                                    <div className="form-item">
                                        <label className='font-semibold'>recruiter</label>
                                        <Field name="recruiter">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select recruiter"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('recruiter', value)}
                                                value={values.recruiter}
                                                onBlur={() => setFieldTouched('recruiter', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="recruiter" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Job Types</label>
                                        <Field name="jobType">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                              
                                                placeholder="Select job types"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('jobType', value)}
                                                value={values.jobTypes}
                                                onBlur={() => setFieldTouched('jobType', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="jobType" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Work Experience</label>
                                        <Field className='mt-2' name="workExperience" as={Input} placeholder="Enter workExperience" />
                                        <ErrorMessage name="workExperience" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <Col span={8} className='mt-2'>
                                <div className='mt-4 w-full'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Currency</label>
                                        <Field name="currency">
                                        {({ field }) => (
                                            <Select
                                                {...field}
                                                placeholder="Select currency"
                                                className="w-full mt-2"
                                                onChange={(value) => setFieldValue('currency', value)}
                                                value={values.currency}
                                                onBlur={() => setFieldTouched('currency', true)}
                                                allowClear={false}
                                            >
                                                <Option value="xyz">XYZ</Option>
                                                <Option value="abc">ABC</Option>
                                            </Select>
                                        )}
                                    </Field>
                                        <ErrorMessage name="currency" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </div>
                            </Col>

                            <div className='mt-4 w-full'>
                                <Col span={24} className='mt-2'>
                                    <div className="form-item">
                                        <label className='font-semibold'>Job Discription</label>

                                        <ReactQuill
                                           name="description    "
                                            value={values.description}
                                            onChange={(value) => setFieldValue('description', value)}
                                            placeholder="Enter description"
                                            onBlur={() => setFieldTouched("description", true)}
                                            className='mt-2'
                                        />
                                        <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
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
                                        <Field className='mt-2' name="expectedSalary" as={Input} placeholder="Enter expect salary" />
                                        <ErrorMessage name="expectedSalary" component="div" className="error-message text-red-500 my-1" />
                                    </div>
                                </Col>
                            </div>


                        </Row>
                        <div className="form-buttons text-right mt-4">
                            <Button type="default" className="mr-2" onClick={() => navigate('/app/dashboards/project/list')}>Cancel</Button>
                            <Button type="primary" htmlType="submit">Update</Button>
                        </div>

                    </Form>
                )}
            </Formik>
        </div>
    );
};
export default EditJob;





// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-quill/dist/quill.snow.css';
// import ReactQuill from 'react-quill';
// import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const { Option } = Select;

// const EditJob = () => {
//   const navigate = useNavigate();
//   const { jobId } = useParams(); // assuming the job ID is passed in the route params

//   // Simulating fetching job data (In a real app, fetch the job details from an API)
//   const [jobData, setJobData] = useState(null);

//   useEffect(() => {
//     // Mock job data. Replace this with an API call to fetch the job details.
//     const mockJobData = {
//       jobTitle: 'Software Developer',
//       branch: 'branch1',
//       jobCategory: 'it',
//       positions: 5,
//       startDate: '2024-01-01',
//       endDate: '2024-12-31',
//       skills: 'JavaScript, React',
//       jobDescription: 'Develop web applications.',
//       jobRequirement: '3+ years of experience in JavaScript.',
//       additionalFields: ['gender', 'dob'],
//     };

//     setJobData(mockJobData); // Set the fetched data
//   }, [jobId]);

//   // Initial values for Formik
//   const initialValues = jobData || {
//     jobTitle: '',
//     branch: '',
//     jobCategory: '',
//     positions: '',
//     startDate: null,
//     endDate: null,
//     skills: '',
//     jobDescription: '',
//     jobRequirement: '',
//     additionalFields: [],
//   };

//   // Validation schema with Yup
//   const validationSchema = Yup.object({
//     jobTitle: Yup.string().required('Please enter a job title.'),
//     branch: Yup.string().required('Please select a branch.'),
//     jobCategory: Yup.string().required('Please select a category.'),
//     positions: Yup.number().required('Please enter positions.').min(1, 'Positions must be at least 1'),
//     startDate: Yup.date().required('Start date is required.'),
//     endDate: Yup.date().required('End date is required.'),
//     skills: Yup.string().required('Please enter skills.'),
//     jobDescription: Yup.string().required('Job description is required.'),
//     jobRequirement: Yup.string().required('Job requirement is required.'),
//     additionalFields: Yup.array().of(Yup.string()).min(1, 'Please select at least one field.'),
//   });

//   // Handle form submission
//   const onSubmit = (values) => {
//     console.log('Updated values:', values);
//     message.success('Job updated successfully!');
//     navigate('/app/hrm/jobs');
//   };

//   if (!jobData) {
//     return <div>Loading...</div>; // Return loading state while jobData is being fetched
//   }

//   return (
//     <div className="edit-job-form">
//       <h2 className="mb-4">Edit Job</h2>

//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//         enableReinitialize={true} // Allows the form to reinitialize when the jobData changes
//       >
//         {({ setFieldValue, values }) => (
//           <FormikForm>
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Field name="jobTitle">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Job Title"
//                       validateStatus={values.jobTitle ? '' : 'error'}
//                       help={values.jobTitle ? '' : 'Please enter a job title.'}
//                     >
//                       <Input {...field} placeholder="Enter Job Title" />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="branch">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Branch"
//                       validateStatus={values.branch ? '' : 'error'}
//                       help={values.branch ? '' : 'Please select a branch.'}
//                     >
//                       <Select {...field} placeholder="Select Branch">
//                         <Option value="all">All</Option>
//                         <Option value="branch1">Branch 1</Option>
//                       </Select>
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="jobCategory">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Job Category"
//                       validateStatus={values.jobCategory ? '' : 'error'}
//                       help={values.jobCategory ? '' : 'Please select a category.'}
//                     >
//                       <Select {...field} placeholder="Select Job Category">
//                         <Option value="it">IT</Option>
//                         <Option value="hr">HR</Option>
//                       </Select>
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="positions">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Positions"
//                       validateStatus={values.positions ? '' : 'error'}
//                       help={values.positions ? '' : 'Please enter positions.'}
//                     >
//                       <Input {...field} placeholder="Enter Positions" />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="startDate">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Start Date"
//                       validateStatus={values.startDate ? '' : 'error'}
//                       help={values.startDate ? '' : 'Start date is required.'}
//                     >
//                       <DatePicker
//                         {...field}
//                         style={{ width: '100%' }}
//                         format="DD-MM-YYYY"
//                         onChange={(date, dateString) => setFieldValue('startDate', dateString)}
//                       />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="endDate">
//                   {({ field }) => (
//                     <Form.Item
//                       label="End Date"
//                       validateStatus={values.endDate ? '' : 'error'}
//                       help={values.endDate ? '' : 'End date is required.'}
//                     >
//                       <DatePicker
//                         {...field}
//                         style={{ width: '100%' }}
//                         format="DD-MM-YYYY"
//                         onChange={(date, dateString) => setFieldValue('endDate', dateString)}
//                       />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={24}>
//                 <Field name="skills">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Skills"
//                       validateStatus={values.skills ? '' : 'error'}
//                       help={values.skills ? '' : 'Please enter skills.'}
//                     >
//                       <Input {...field} placeholder="Enter Skills" />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="jobDescription">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Job Description"
//                       validateStatus={values.jobDescription ? '' : 'error'}
//                       help={values.jobDescription ? '' : 'Job description is required.'}
//                     >
//                       <ReactQuill
//                         {...field}
//                         value={values.jobDescription}
//                         onChange={(value) => setFieldValue('jobDescription', value)}
//                         placeholder="Write here..."
//                       />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={12}>
//                 <Field name="jobRequirement">
//                   {({ field }) => (
//                     <Form.Item
//                       label="Job Requirement"
//                       validateStatus={values.jobRequirement ? '' : 'error'}
//                       help={values.jobRequirement ? '' : 'Job requirement is required.'}
//                     >
//                       <ReactQuill
//                         {...field}
//                         value={values.jobRequirement}
//                         onChange={(value) => setFieldValue('jobRequirement', value)}
//                         placeholder="Write here..."
//                       />
//                     </Form.Item>
//                   )}
//                 </Field>
//               </Col>

//               <Col span={24}>
//                 <Form.Item label="Additional Fields">
//                   <Checkbox.Group
//                     onChange={(checkedValues) => setFieldValue('additionalFields', checkedValues)}
//                     value={values.additionalFields}
//                   >
//                     <Row>
//                       <Col span={6}><Checkbox value="gender">Gender</Checkbox></Col>
//                       <Col span={6}><Checkbox value="dob">Date of Birth</Checkbox></Col>
//                       <Col span={6}><Checkbox value="country">Country</Checkbox></Col>
//                       <Col span={6}><Checkbox value="profileImage">Profile Image</Checkbox></Col>
//                     </Row>
//                   </Checkbox.Group>
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Form.Item>
//               <div className="form-buttons text-right">
//                 <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
//                 <Button type="primary" htmlType="submit">Update</Button>
//               </div>
//             </Form.Item>
//           </FormikForm>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default EditJob;


