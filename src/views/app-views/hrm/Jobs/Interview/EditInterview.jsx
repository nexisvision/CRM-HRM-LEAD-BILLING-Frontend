import React from 'react';
import { Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const { Option } = Select;

const EditInterview = ({ initialValues, onUpdateInterview }) => {
  const onSubmit = (values) => {
    const formattedData = {
      ...values,
      startOn: values.startOn.format('YYYY-MM-DD'),
      startTime: values.startTime.format('HH:mm'),
    };

    onUpdateInterview(formattedData);
    message.success('Interview updated successfully!');
  };

  const validationSchema = Yup.object({
    job: Yup.string().required('Please select a job.'),
    candidate: Yup.string().required('Please select a candidate.'),
    interviewer: Yup.string().required('Please select an interviewer.'),
    round: Yup.string().required('Please select a round.'),
    interviewType: Yup.string().required('Please select an interview type.'),
    startOn: Yup.date().nullable().required('Start date is required.'),
    startTime: Yup.date().nullable().required('Start time is required.'),
    commentForInterviewer: Yup.string().required('Please enter a comment for the interviewer.'),
    commentForCandidate: Yup.string().required('Please enter a comment for the candidate.'),
  });

  return (
    <Formik
      initialValues={{
        ...initialValues,
        startOn: initialValues.startOn ? moment(initialValues.startOn, 'YYYY-MM-DD') : null,
        startTime: initialValues.startTime ? moment(initialValues.startTime, 'HH:mm') : null,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
        <Form onSubmit={handleSubmit}>
          <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
          <Row gutter={16}>
            {/* Job Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Job</label>
                <Field name="job">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Job"
                      onChange={(value) => setFieldValue('job', value)}
                      onBlur={() => setFieldTouched('job', true)}
                      value={values.job}
                    >
                      <Option value="Frontend Developer">Frontend Developer</Option>
                      <Option value="Backend Developer">Backend Developer</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="job" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Candidate Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Candidate</label>
                <Field name="candidate">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Candidate"
                      onChange={(value) => setFieldValue('candidate', value)}
                      onBlur={() => setFieldTouched('candidate', true)}
                      value={values.candidate}
                    >
                      <Option value="Alice">Alice</Option>
                      <Option value="Bob">Bob</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="candidate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Interviewer Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Interviewer</label>
                <Field name="interviewer">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Interviewer"
                      onChange={(value) => setFieldValue('interviewer', value)}
                      onBlur={() => setFieldTouched('interviewer', true)}
                      value={values.interviewer}
                    >
                      <Option value="John">John</Option>
                      <Option value="Jane">Jane</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="interviewer" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Round Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Round</label>
                <Field name="round">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Round"
                      onChange={(value) => setFieldValue('round', value)}
                      onBlur={() => setFieldTouched('round', true)}
                      value={values.round}
                    >
                      <Option value="Technical">Technical</Option>
                      <Option value="HR">HR</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="round" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Interview Type Dropdown */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Interview Type</label>
                <Field name="interviewType">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Interview Type"
                      onChange={(value) => setFieldValue('interviewType', value)}
                      onBlur={() => setFieldTouched('interviewType', true)}
                      value={values.interviewType}
                    >
                      <Option value="In-Person">In-Person</Option>
                      <Option value="Virtual">Virtual</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="interviewType" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Start On */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Start On</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.startOn}
                  onChange={(date) => setFieldValue('startOn', date)}
                  onBlur={() => setFieldTouched('startOn', true)}
                />
                <ErrorMessage name="startOn" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Start Time */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Start Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={values.startTime}
                  onChange={(time) => setFieldValue('startTime', time)}
                  onBlur={() => setFieldTouched('startTime', true)}
                />
                <ErrorMessage name="startTime" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Comment for Interviewer */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Comment for Interviewer</label>
                <Field
                  name="commentForInterviewer"
                  as={Input.TextArea}
                  placeholder="Enter comment for interviewer"
                />
                <ErrorMessage name="commentForInterviewer" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* Comment for Candidate */}
            <Col span={12} className="mt-2">
              <div className="form-item">
                <label className="font-semibold">Comment for Candidate</label>
                <Field
                  name="commentForCandidate"
                  as={Input.TextArea}
                  placeholder="Enter comment for candidate"
                />
                <ErrorMessage name="commentForCandidate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" className="mt-3">
            Update Interview
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default EditInterview;











// import React, { useEffect, useState } from 'react';
// import {  Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
// import moment from 'moment';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const { Option } = Select;

// const EditInterview = ({ interviewData, onUpdateInterview }) => {
//   // const [form] = Form.useForm();
//   const [initialValues,setInitialValues] = useState({
//     title: '',
//     interviewer: '',
//     interviewDate: null,
//     interviewTime: null,
//   })

//   useEffect(() => {
//     // Populate form with initial values when editing
//     if (interviewData) {
//       setInitialValues({
//         title: interviewData.title,
//         interviewer: interviewData.interviewer,
//         interviewDate: interviewData.date ? moment(interviewData.date, 'YYYY-MM-DD') : null,
//         interviewTime: interviewData.time ? moment(interviewData.time, 'HH:mm') : null,
//       });
//     }
//   }, [interviewData]);

//   const onSubmit = (values) => {
//     const updatedData = {
//       ...interviewData, // Preserve the existing interview ID or other properties
//       title: values.title,
//       interviewer: values.interviewer,
//       date: values.interviewDate.format('YYYY-MM-DD'),
//       time: values.interviewTime.format('HH:mm'),
//     };

//     onUpdateInterview(updatedData);
//     message.success('Interview updated successfully!');
//   };

 
  
//     const validationSchema = Yup.object({
//       title: Yup.string().required('Please enter a interview title.'),
//       interviewer: Yup.string().required('Please select a interviewer.'),
//       interviewDate: Yup.date().nullable().required(' Event Start Date is required.'),
//       interviewTime: Yup.date().nullable().required('Interview Time is required.'),
//     });

//   return (
//     <Formik
//       initialValues={initialValues}
//       validationSchema={validationSchema}
//       onSubmit={onSubmit}
//     >
//       {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//         <Form
//           className="formik-form" onSubmit={handleSubmit}
//         >
//           <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//           <Row gutter={16}>
//             <Col span={12} className='mt-2'>
//               <div className="form-item">
//                 <label className='font-semibold'>Interview Title"</label>
//                 <Field name="title" as={Input} placeholder="Event Title" />
//                 <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
//               </div>
//             </Col>

           
//             <Col span={12} className='mt-2'>
//               <div className="form-item">
//                 <label className='font-semibold'>Interviewer</label>
//                 <Field name="interviewer">
//                   {({ field }) => (
//                     <Select
//                       {...field}
//                       className="w-full"
//                       placeholder="Select Interviewer"
//                       onChange={(value) => setFieldValue('interviewer', value)}
//                       value={values.interviewer}
//                       onBlur={() => setFieldTouched("interviewer", true)}
//                     >
//                       <Option value="Candice">Candice</Option>
//                       <Option value="John Doe">John Doe</Option>
//                     </Select>
//                   )}
//                 </Field>
//                 <ErrorMessage name="interviewer" component="div" className="error-message text-red-500 my-1" />
//               </div>
//             </Col>

//             <Col span={12} className='mt-2'>
//               <div className="form-item">
//                 <label className='font-semibold'>Interview Date</label>
//                 <DatePicker
//                   className="w-full"
//                   format="DD-MM-YYYY"
//                   value={values.interviewDate}
//                   onChange={(interviewDate) => setFieldValue('interviewDate', interviewDate)}
//                   onBlur={() => setFieldTouched("interviewDate", true)}
//                 />
//                 <ErrorMessage name="interviewDate" component="div" className="error-message text-red-500 my-1" />
//               </div>
//             </Col>


//             <Col span={12} className='mt-2'>
//               <div className="form-item">
//                 <label className='font-semibold'>Interview Time</label>
//                 <TimePicker
//                   className="w-full"
//                   format="HH:mm"
//                   value={values.interviewTime}
//                   onChange={(interviewTime) => setFieldValue('interviewTime', interviewTime)}
//                   onBlur={() => setFieldTouched("interviewTime", true)}
//                 />
//                 <ErrorMessage name="interviewTime" component="div" className="error-message text-red-500 my-1" />
//               </div>
//             </Col>

//           </Row>
        
//             <Button type="primary" htmlType="submit" className='mt-3'>
//               Edit Interview
//             </Button>
          
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default EditInterview;

