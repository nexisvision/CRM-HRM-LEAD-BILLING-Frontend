import React from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddJobOnBording = () => {
  // const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Job Candidate added successfully!');
    navigate('/app/hrm/jobcandidate');
  };

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

  return (
    <div className="add-job-form">
      {/* <h2 className="mb-4">Create New Job OnBoard</h2> */}
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
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
                Create
              </Button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddJobOnBording;












// import React from 'react';
// import { Form, Input, Button, DatePicker, Select, message, Row, Col } from 'antd';
// import { useNavigate } from 'react-router-dom';

// const { Option } = Select;

// const AddJobOnBording = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const onFinish = (values) => {
//     console.log('Submitted values:', values);
//     message.success('Job Candidate added successfully!');
//     navigate('/app/hrm/jobcandidate');
//   };

//   return (
//     <div className="add-job-form">
//       <h2 className="mb-4">Create New Job OnBoard</h2>
//       <Form layout="vertical" form={form} name="add-job" onFinish={onFinish}>
//         <Row gutter={16}>
//           {/* Interviewer */}
//           <Col span={12}>
//             <Form.Item
//               name="interviewer"
//               label="Interviewer"
//               rules={[{ required: true, message: 'Please select an interviewer.' }]}
//             >
//               <Select placeholder="Select Interviewer">
//                 <Option value="interviewer1">Interviewer 1</Option>
//                 <Option value="interviewer2">Interviewer 2</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Joining Date */}
//           <Col span={12}>
//             <Form.Item
//               name="joiningDate"
//               label="Joining Date"
//               rules={[{ required: true, message: 'Joining date is required.' }]}
//             >
//               <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
//             </Form.Item>
//           </Col>

//           {/* Days of Week */}
//           <Col span={12}>
//             <Form.Item
//               name="daysOfWeek"
//               label="Days Of Week"
//               rules={[{ required: true, message: 'Please enter days of the week.' }]}
//             >
//               <Input placeholder="Enter Days of Week" />
//             </Form.Item>
//           </Col>

//           {/* Salary */}
//           <Col span={12}>
//             <Form.Item
//               name="salary"
//               label="Salary"
//               rules={[{ required: true, message: 'Please enter salary.' }]}
//             >
//               <Input placeholder="Enter Salary" />
//             </Form.Item>
//           </Col>

//           {/* Salary Type */}
//           <Col span={12}>
//             <Form.Item
//               name="salaryType"
//               label="Salary Type"
//               rules={[{ required: true, message: 'Please select a salary type.' }]}
//             >
//               <Select placeholder="Select Salary Type">
//                 <Option value="hourly">Hourly Payslip</Option>
//                 <Option value="monthly">Monthly Payslip</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Salary Duration */}
//           <Col span={12}>
//             <Form.Item
//               name="salaryDuration"
//               label="Salary Duration"
//               rules={[{ required: true, message: 'Please select a salary duration.' }]}
//             >
//               <Select placeholder="Select Salary Duration">
//                 <Option value="weekly">Weekly</Option>
//                 <Option value="biweekly">Biweekly</Option>
//                 <Option value="monthly">Monthly</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Job Type */}
//           <Col span={12}>
//             <Form.Item
//               name="jobType"
//               label="Job Type"
//               rules={[{ required: true, message: 'Please select a job type.' }]}
//             >
//               <Select placeholder="Select Job Type">
//                 <Option value="fulltime">Full Time</Option>
//                 <Option value="parttime">Part Time</Option>
//               </Select>
//             </Form.Item>
//           </Col>

//           {/* Status */}
//           <Col span={12}>
//             <Form.Item
//               name="status"
//               label="Status"
//               rules={[{ required: true, message: 'Please select a status.' }]}
//             >
//               <Select placeholder="Select Status">
//                 <Option value="active">Active</Option>
//                 <Option value="inactive">Inactive</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item>
//           <div className="form-buttons text-right">
//             <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobcandidate')}>
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

// export default AddJobOnBording;
