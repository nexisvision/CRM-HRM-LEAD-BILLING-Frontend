import React, { useEffect, useState } from 'react';
import {  Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditJobOnBording = () => {
  // const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming the route includes an ID for the job onboard entry to edit.
  const [fieldvalue,setFieldValue]= useState("");


  useEffect(() => {
    // Fetch job onboarding data by ID (replace this with actual API call).
    const fetchJobOnboardingData = async () => {
      const mockData = {
        interviewer: 'interviewer1',
        joiningDate: '2023-12-01',
        daysOfWeek: 'Monday to Friday',
        salary: '5000',
        salaryType: 'monthly',
        salaryDuration: 'monthly',
        jobType: 'fulltime',
        status: 'active',
      };
      // Pre-fill the form with fetched data
      setFieldValue({
        ...mockData,
        joiningDate: mockData.joiningDate ? moment(mockData.joiningDate, 'YYYY-MM-DD') : null,
      });
    };

    fetchJobOnboardingData();
  }, [id]);

  console.log(id,"id");
  
  const initialValues = {
    interviewer: '',
    joiningDate: null,
    daysOfWeek: '',
    salary:'',
    salaryType: '',
    salaryDuration: '',
    jobType: '',
    status: '',
  }
  
    const validationSchema = Yup.object({
      interviewer: Yup.string().required('Please Select a interviewer.'),
      joiningDate: Yup.date().nullable().required('Joining Date is required.'),
      daysOfWeek: Yup.string().required('Please enter a days Of Week.'),
      salary: Yup.string().required('Please enter a salary.'),
      salaryType: Yup.string().required('Please select salaryType.'),
      salaryDuration: Yup.string().required('Please select a salary Duration.'),
      jobType: Yup.string().required('Please select a jobType.'),
      status: Yup.string().required('Please select a status.'),
    });

  const onSubmit = (values) => {
    console.log('Updated values:', values);
    message.success('Job Candidate updated successfully!');
    navigate('/app/hrm/jobcandidate');
  };

  return (
    <div className="edit-job-form">
      {/* <h2 className="mb-4">Edit Job OnBoard</h2> */}

      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
     <Formik
             initialValues={initialValues}
             validationSchema={validationSchema}
             onSubmit={onSubmit}
           >
             {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
               <Form layout="vertical" name="add-job" className="formik-form" onSubmit={handleSubmit}>
     
                 <Row gutter={16}>
                   {/* Interviewer */}
     
                   <Col span={12}>
                     <div className="form-item">
                       <label className='font-semibold'>Interviewer</label>
                       <Field name="interviewer">
                         {({ field }) => (
                           <Select
                             {...field}
                             className="w-full"
                             placeholder="Select Interviewer"
                             onChange={(value) => setFieldValue('interviewer', value)}
                             value={values.interviewer}
                             onBlur={() => setFieldTouched("interviewer", true)}
                           >
                             <Option value="interviewer1">Interviewer 1</Option>
                             <Option value="interviewer2">Interviewer 2</Option>
                           </Select>
                         )}
                       </Field>
                       <ErrorMessage name="interviewer" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
                   {/* Joining Date */}
     
                   <Col span={12}>
                     <div className="form-item">
                       <label className='font-semibold'>Joining Date</label>
                       <DatePicker
                         className="w-full"
                         format="DD-MM-YYYY"
                         value={values.joiningDate}
                         onChange={(joiningDate) => setFieldValue('joiningDate', joiningDate)}
                         onBlur={() => setFieldTouched("joiningDate", true)}
                       />
                       <ErrorMessage name="joiningDate" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
     
                   {/* Days of Week */}
     
                   <Col span={12} className='mt-2'>
                     <div className="form-item">
                       <label className='font-semibold'>Days Of Week</label>
                       <Field name="daysOfWeek" as={Input} placeholder="Enter Days Of Week" />
                       <ErrorMessage name="daysOfWeek" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
                   {/* Salary */}
     
                   <Col span={12} className='mt-2'>
                     <div className="form-item">
                       <label className='font-semibold'>Salary</label>
                       <Field name="salary" as={Input} placeholder="Enter Salary" />
                       <ErrorMessage name="salary" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col> 
     
                   {/* Salary Type */}
     
                   <Col span={12} className='mt-2'>
                     <div className="form-item">
                       <label className='font-semibold'>Salary Type</label>
                       <Field name="salaryType">
                         {({ field }) => (
                           <Select
                             {...field}
                             className="w-full"
                             placeholder="Select Salary Type"
                             onChange={(value) => setFieldValue('salaryType', value)}
                             value={values.salaryType}
                             onBlur={() => setFieldTouched("salaryType", true)}
                           >
                             <Option value="hourly">Hourly Payslip</Option>
                             <Option value="monthly">Monthly Payslip</Option>
                           </Select>
                         )}
                       </Field>
                       <ErrorMessage name="salaryType" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
                 
                   {/* Salary Duration */}
                   <Col span={12} className='mt-2'>
                     <div className="form-item">
                       <label className='font-semibold'>Salary Duration</label>
                       <Field name="salaryDuration">
                         {({ field }) => (
                           <Select
                             {...field}
                             className="w-full"
                             placeholder="Select Salary Duration"
                             onChange={(value) => setFieldValue('salaryDuration', value)}
                             value={values.salaryDuration}
                             onBlur={() => setFieldTouched("salaryDuration", true)}
                           >
                            <Option value="weekly">Weekly</Option>
                         <Option value="biweekly">Biweekly</Option>
                         <Option value="monthly">Monthly</Option>
                           </Select>
                         )}
                       </Field>
                       <ErrorMessage name="salaryDuration" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
                   {/* Job Type */}
                   <Col span={12} className='mt-2'>
                     <div className="form-item">
                       <label className='font-semibold'>Job Type</label>
                       <Field name="jobType">
                         {({ field }) => (
                           <Select
                             {...field}
                             className="w-full"
                             placeholder="Select Job Type"
                             onChange={(value) => setFieldValue('jobType', value)}
                             value={values.jobType}
                             onBlur={() => setFieldTouched("jobType", true)}
                           >
                             <Option value="fulltime">Full Time</Option>
                             <Option value="parttime">Part Time</Option>
                           </Select>
                         )}
                       </Field>
                       <ErrorMessage name="jobType" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
     
                   {/* Status */}
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
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                           </Select>
                         )}
                       </Field>
                       <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                     </div>
                   </Col>
                  
                 </Row>
     
                 <div className="form-buttons text-right mt-2">
                   <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobcandidate')}>
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

export default EditJobOnBording;
