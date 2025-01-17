import React from "react";
import { Input, Button, Select, Radio, message, Row, Col } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactQuill from "react-quill";
import { useDispatch } from "react-redux";

const { Option } = Select;

const AddJobApplication = () => {
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    console.log("Form submitted:", values);
    try {
      // Dispatch your action here if needed
      // await dispatch(Addjobapplication(values));
      message.success("Job application added successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      message.error("An error occurred while submitting the job application.");
    }
  };

  const initialValues = {
    job: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    total_experience: "",
    current_location: "",
    notice_period: "",
    status: "",
    applied_source: "",
    cover_letter: "",
  };

  const validationSchema = Yup.object({
    job: Yup.string().required("Please select a job."),
    name: Yup.string().required("Please enter a name."),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email."),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits.")
      .required("Please enter a phone number."),
    location: Yup.string().required("Please enter a location."),
    total_experience: Yup.string().required("Please select your total experience."),
    current_location: Yup.string().required("Please enter your current location."),
    notice_period: Yup.string().required("Please select your notice period."),
    status: Yup.string().required("Please select a status."),
    applied_source: Yup.string().required("Please enter the applied source."),
    cover_letter: Yup.string().required("Please enter a cover letter."),
  });

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, setFieldTouched, handleSubmit }) => (
          <Form
            onSubmit={handleSubmit}
            style={{
              padding: "20px",
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              {/* Job */}
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Job</label>
                  <Select
                    placeholder="Select Job"
                    value={values.job}
                    onChange={(value) => setFieldValue("job", value)}
                    onBlur={() => setFieldTouched("job", true)}
                    className="w-full"
                  >
                    <Option value="developer">Software Developer</Option>
                    <Option value="designer">Graphic Designer</Option>
                  </Select>
                  <ErrorMessage name="job" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Name */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Name</label>
                  <Field name="name" as={Input} placeholder="Enter Name" />
                  <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Email */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Email</label>
                  <Field name="email" as={Input} placeholder="Enter Email" />
                  <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Phone */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <Field name="phone" as={Input} placeholder="Enter Phone" />
                  <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Location */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Location</label>
                  <Field name="location" as={Input} placeholder="Enter Location" />
                  <ErrorMessage name="location" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Total Experience */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Total Experience</label>
                  <Select
                    placeholder="Select Total Experience"
                    value={values.total_experience}
                    onChange={(value) => setFieldValue("total_experience", value)}
                    className="w-full"
                  >
                    <Option value="0-1">0-1 Years</Option>
                    <Option value="1-3">1-3 Years</Option>
                    <Option value="3-5">3-5 Years</Option>
                    <Option value="5+">5+ Years</Option>
                  </Select>
                  <ErrorMessage name="total_experience" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Current Location */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Current Location</label>
                  <Field name="current_location" as={Input} placeholder="Enter Current Location" />
                  <ErrorMessage name="current_location" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Notice Period */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Notice Period</label>
                  <Select
                    placeholder="Select Notice Period"
                    value={values.notice_period}
                    onChange={(value) => setFieldValue("notice_period", value)}
                    className="w-full"
                  >
                    <Option value="immediate">Immediate</Option>
                    <Option value="15 days">15 Days</Option>
                    <Option value="1 month">1 Month</Option>
                    <Option value="2 months">2 Months</Option>
                  </Select>
                  <ErrorMessage name="notice_period" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Status */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Radio.Group
                    value={values.status}
                    onChange={(e) => setFieldValue("status", e.target.value)}
                  >
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                  <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Applied Source */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Applied Sources</label>
                  <Field name="applied_source" as={Input} placeholder="Enter Applied Sources" />
                  <ErrorMessage name="applied_source" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Cover Letter */}
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Cover Letter</label>
                  <ReactQuill
                    value={values.cover_letter}
                    onChange={(value) => setFieldValue("cover_letter", value)}
                    onBlur={() => setFieldTouched("cover_letter", true)}
                    placeholder="Enter Cover Letter"
                  />
                  <ErrorMessage name="cover_letter" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>
            </Row>

            <div style={{ textAlign: "right", marginTop: "16px" }}>
              <Button style={{ marginRight: 8 }}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddJobApplication;










// palaka code =-==-===-===-=-=-=-====-=====-
// import React from 'react';
// import { Input, Button, Select, Radio, message, Row, Col } from 'antd';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import ReactQuill from 'react-quill';
// const { Option } = Select;

// const AddJobApplication = () => {
//   const onSubmit = (values) => {
//     console.log('Form submitted:', values);
//     message.success('Job application submitted successfully!');
//   };

//   const initialValues = {
//     job: '',
//     name: '',
//     email: '',
//     phone: '',
//     location: '',
//     totalExperience: '',
//     currentLocation: '',
//     noticePeriod: '',
//     status: '',
//     appliedSources: '',
//     coverLetter: '',
//   };

//   const validationSchema = Yup.object({
//     job: Yup.string().required('Please select a job.'),
//     name: Yup.string().required('Please enter a name.'),
//     email: Yup.string().email('Please enter a valid email address.').required('Please enter an email.'),
//     phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits.').required('Please enter a phone number.'),
//     location: Yup.string().required('Please enter a location.'),
   
//     totalExperience: Yup.string().required('Please select your total experience.'),
//     currentLocation: Yup.string().required('Please enter your current location.'),
//     noticePeriod: Yup.string().required('Please select your notice period.'),
//     status: Yup.string().required('Please select a status.'),
//     appliedSources: Yup.string().required('Please enter the applied source.'),
//     coverLetter: Yup.string().required('Please enter a cover letter.'),
//   });

//   return (
//     <div>
//       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form onSubmit={handleSubmit} style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
//             <Row gutter={16}>
//               {/* Job */}
//               <Col span={24}>
//                 <div className="form-item">
//                   <label className="font-semibold">Job</label>
//                   <Field name="job">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full"
//                         placeholder="Select Job"
//                         onChange={(value) => setFieldValue('job', value)}
//                         value={values.job}
//                         onBlur={() => setFieldTouched('job', true)}
//                       >
//                         <Option value="developer">Software Developer</Option>
//                         <Option value="designer">Graphic Designer</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="job" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Name */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Name</label>
//                   <Field name="name" as={Input} placeholder="Enter Name" />
//                   <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Email */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Email</label>
//                   <Field name="email" as={Input} placeholder="Enter Email" />
//                   <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Phone */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Phone</label>
//                   <Field name="phone" as={Input} placeholder="Enter Phone" />
//                   <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Country */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">location</label>
//                   <Field name="location" as={Input} placeholder="Enter location" />
//                   <ErrorMessage name="location" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* State */}
             
//               {/* Total Experience */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Total Experience</label>
//                   <Field name="totalExperience">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full"
//                         placeholder="Select Total Experience"
//                         onChange={(value) => setFieldValue('totalExperience', value)}
//                       >
//                         <Option value="0-1">0-1 Years</Option>
//                         <Option value="1-3">1-3 Years</Option>
//                         <Option value="3-5">3-5 Years</Option>
//                         <Option value="5+">5+ Years</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="totalExperience" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Current Location */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Current Location</label>
//                   <Field name="currentLocation" as={Input} placeholder="Enter Current Location" />
//                   <ErrorMessage name="currentLocation" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Notice Period */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Notice Period</label>
//                   <Field name="noticePeriod">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full"
//                         placeholder="Select Notice Period"
//                         onChange={(value) => setFieldValue('noticePeriod', value)}
//                       >
//                         <Option value="immediate">Immediate</Option>
//                         <Option value="15 days">15 Days</Option>
//                         <Option value="1 month">1 Month</Option>
//                         <Option value="2 months">2 Months</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="noticePeriod" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Status */}
//               <Col span={12}>
//                 <div className="form-item">
//                   <label className="font-semibold">Status</label>
//                   <Field name="status">
//                     {({ field }) => (
//                       <Radio.Group {...field} onChange={(e) => setFieldValue('status', e.target.value)}>
//                         <Radio value="active">Active</Radio>
//                         <Radio value="inactive">Inactive</Radio>
//                       </Radio.Group>
//                     )}
//                   </Field>
//                   <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Applied Sources */}
//               <Col span={12} className='mt-3'>
//                 <div className="form-item">
//                   <label className="font-semibold">Applied Sources</label>
//                   <Field name="appliedSources" as={Input} placeholder="Enter Applied Sources" />
//                   <ErrorMessage name="appliedSources" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               {/* Cover Letter */}
//               <Col span={24}>
//                 <div className="form-item mt-3">
//                   <label className="font-semibold">Cover Letter</label>
//                   <Field name="coverLetter mt-2">
//                     {({ field }) => (
//                       <ReactQuill
//                         {...field}
//                         value={values.coverLetter}
//                         onChange={(value) => setFieldValue('coverLetter', value)}
//                         placeholder="Enter Cover Letter"
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="coverLetter" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>
//             </Row>

//             <div style={{ textAlign: 'right', marginTop: '16px' }}>
//               <Button style={{ marginRight: 8 }}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Submit
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddJobApplication;










// import React from 'react';
// import { Input, Button, DatePicker, Select, Upload, Radio, message, Row, Col } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import ReactQuill from 'react-quill';
// const { TextArea } = Input;

// const { Option } = Select;
// const AddJobApplication = () => {
//   // const [form] = Form.useForm();

//   const onSubmit = (values) => {
//     console.log('Form submitted:', values);
//     message.success('Job application submitted successfully!');
//   };

//   const initialValues = {
//     job: '',
//     name: '',
//     email: '',
//     phone: '',
//     dob: null,
//     country: '',
//     state: '',
//     city: '',
//     profile: '',
//     cv: '',
//     coverLetter: '',
//     weaknesses: '',
//     reason: '',
//   }

//   const validationSchema = Yup.object({
//     job: Yup.string().required('Please Select a job.'),
//     name: Yup.string().required('Please enter a name.'),
//     email: Yup.string().email("Please enter a valid email address with @.").required('Please enter a email.'),
//     phone: Yup.string().matches(/^\d{10}$/, 'phone number must be 10 digits.').required('Please enter a phone Number.'),
//     dob: Yup.date().nullable().required(' Date of Birth is required.'),
//     country: Yup.string().required('Please enter a country.'),
//     state: Yup.string().required('Please enter a jobType.'),
//     city: Yup.string().required('Please enter a city.'),
//     profile: Yup.string().required('Please Uploade file.'),
//     cv: Yup.string().required('Please Uploade file.'),
//     coverLetter: Yup.string().required('Please enter a coverLetter.'),
//     weaknesses: Yup.string().required('Please enter a weaknesses.'),
//     reason: Yup.string().required('Please enter a reason.'),
//   });

//   return (
//     <div>
//       {/* <h2>Create New Job Application</h2> */}
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
//       <Formik
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
//           <Form layout="vertical" name="add-job" className="formik-form" onSubmit={handleSubmit}>


//             <Row gutter={16}>
//               <Col span={24} >
//                 <div className="form-item">
//                   <label className='font-semibold'>Job</label>
//                   <Field name="job">
//                     {({ field }) => (
//                       <Select
//                         {...field}
//                         className="w-full"
//                         placeholder="Select Job"
//                         onChange={(value) => setFieldValue('job', value)}
//                         value={values.job}
//                         onBlur={() => setFieldTouched("job", true)}
//                       >
//                         <Option value="accounting">Highly Projected Growth for Accounting Jobs</Option>
//                       </Select>
//                     )}
//                   </Field>
//                   <ErrorMessage name="job" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>Name</label>
//                   <Field name="name" as={Input} placeholder="Enter Name" />
//                   <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>Email</label>
//                   <Field name="email" as={Input} placeholder="Enter Email" type='email' />
//                   <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>Phone</label>
//                   <Field name="phone" as={Input} placeholder="Enter Enter Phone (e.g., +91)" />
//                   <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>Date of Birth</label>
//                   <DatePicker
//                     className="w-full"
//                     format="DD-MM-YYYY"
//                     value={values.dob}
//                     onChange={(dob) => setFieldValue('dob', dob)}
//                     onBlur={() => setFieldTouched("dob", true)}
//                   />
//                   <ErrorMessage name="dob" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <label name="gender" htmlFor="" className='font-semibold'>Gender</label>
//                 <div className='mt-2'>
//                 <Radio.Group>
//                   <Radio value="male">Male</Radio>
//                   <Radio value="female">Female</Radio>
//                 </Radio.Group>
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>Country</label>
//                   <Field name="country" as={Input} placeholder="Enter Enter Your Country" />
//                   <ErrorMessage name="country" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>State</label>
//                   <Field name="state" as={Input} placeholder="Enter Enter State" />
//                   <ErrorMessage name="state" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <div className="form-item">
//                   <label className='font-semibold'>City</label>
//                   <Field name="city" as={Input} placeholder="Enter Enter city" />
//                   <ErrorMessage name="city" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>


//               <Col span={12} className='mt-2'>
//                 <label name="profile" htmlFor="" className='font-semibold'>Profile</label>
//                 <div className='mt-2'>
//                 <Upload>
//                   <Button icon={<UploadOutlined />}>Choose File</Button>
//                 </Upload>
//                 </div>
//                 <ErrorMessage name="profile" component="div" className="error-message text-red-500 my-1" />
//               </Col>

//               <Col span={12} className='mt-2'>
//                 <label name="cv" htmlFor="" className='font-semibold'>CV / Resume</label>
//                 <div className='mt-2'>
//                 <Upload>
//                   <Button icon={<UploadOutlined />}>Choose File</Button>
//                 </Upload>
//                 </div>
//                 <ErrorMessage name="cv" component="div" className="error-message text-red-500 my-1" />
//               </Col>

//               <Col span={24} className='mt-2'>
//                 <div className="form-item">
//                   <label className="font-semibold">Cover Letter</label>
//                   <Field name="coverLetter">
//                     {({ field }) => (
//                       <ReactQuill
//                         {...field}
//                         value={values.coverLetter}
//                         rows={4}
//                         onChange={(value) => setFieldValue('coverLetter', value)}
//                         onBlur={() => setFieldTouched("coverLetter", true)}
//                         placeholder="Enter Cover Letter"
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="coverLetter" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={24} className='mt-2'>
//                 <div className="form-item">
//                   <label className="font-semibold">What Do You Consider to Be Your Weaknesses?</label>
//                   <Field name="weaknesses">
//                     {({ field }) => (
//                       <ReactQuill
//                         {...field}
//                         rows={2}
//                         value={values.weaknesses}
//                         onChange={(value) => setFieldValue('weaknesses', value)}
//                         onBlur={() => setFieldTouched("weaknesses", true)}
//                         placeholder="Write Here..."
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="weaknesses" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//               <Col span={24} className='mt-2'>
//                 <div className="form-item">
//                   <label className="font-semibold">Why Do You Want This Job?</label>
//                   <Field name="reason">
//                     {({ field }) => (
//                       <ReactQuill
//                         {...field}
//                         rows={2}
//                         value={values.reason}
//                         onChange={(value) => setFieldValue('reason', value)}
//                         onBlur={() => setFieldTouched("reason", true)}
//                         placeholder="Write Here..."
//                       />
//                     )}
//                   </Field>
//                   <ErrorMessage name="reason" component="div" className="error-message text-red-500 my-1" />
//                 </div>
//               </Col>

//             </Row>

//             <div style={{ textAlign: 'right' ,marginTop:'8px'}}>
//               <Button style={{ marginRight: 8 }}>
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AddJobApplication;