import React from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddJob = () => {
  const navigate = useNavigate();

  const initialValues = {
    jobTitle: '',
    branch: 'all',
    jobCategory: '',
    positions: '',
    startDate: null,
    endDate: null,
    skills: '',
    jobDescription: '',
    jobRequirement: '',
    status: '',
    needToAsk: [],
    needToShow: [],
  };

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required('Please enter a job title.'),
    positions: Yup.string().required('Please enter the number of positions.'),
    skills: Yup.string().required('Please enter skills.'),
    status: Yup.string().required('Please select a status.'),
    jobDescription: Yup.string().required('Job description is required.'),
    jobRequirement: Yup.string().required('Job requirement is required.'),
  });

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Job created successfully!');
    navigate('/app/hrm/jobs');
  };

  return (
    <div className="create-job-form">
      {/* <h2>Create Job</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <FormikForm>
            <Row gutter={[16, 16]}>
              {/* Job Title */}
              <Col span={12}>
                <Field name="jobTitle">
                  {({ field }) => (
                    <Form.Item label="Job Title">
                      <Input {...field} placeholder="Enter Job Title" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Branch */}
              <Col span={12}>
                <Field name="branch">
                  {({ field }) => (
                    <Form.Item label="Branch">
                      <Select {...field} onChange={(value) => setFieldValue('branch', value)}>
                        <Option value="all">All</Option>
                        <Option value="branch1">Branch 1</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Job Category */}
              <Col span={12}>
                <Field name="jobCategory">
                  {({ field }) => (
                    <Form.Item label="Job Category">
                      <Select {...field} onChange={(value) => setFieldValue('jobCategory', value)}>
                        <Option value="it">IT</Option>
                        <Option value="hr">HR</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Positions */}
              <Col span={12}>
                <Field name="positions">
                  {({ field }) => (
                    <Form.Item label="Positions">
                      <Input {...field} placeholder="Enter number of positions" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Status */}
              <Col span={12}>
                <Field name="status">
                  {({ field }) => (
                    <Form.Item label="Status">
                      <Select {...field} onChange={(value) => setFieldValue('status', value)}>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Start Date */}
              <Col span={12}>
                <Field name="startDate">
                  {({ field }) => (
                    <Form.Item label="Start Date">
                      <DatePicker
                        {...field}
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => setFieldValue('startDate', dateString)}
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* End Date */}
              <Col span={12}>
                <Field name="endDate">
                  {({ field }) => (
                    <Form.Item label="End Date">
                      <DatePicker
                        {...field}
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => setFieldValue('endDate', dateString)}
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Skills */}
              <Col span={24}>
                <Field name="skills">
                  {({ field }) => (
                    <Form.Item label="Skills">
                      <Input {...field} placeholder="Enter required skills" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Job Description */}
              <Col span={12}>
                <Field name="jobDescription">
                  {({ field }) => (
                    <Form.Item label="Job Description">
                      <ReactQuill
                        {...field}
                        value={values.jobDescription}
                        onChange={(value) => setFieldValue('jobDescription', value)}
                        placeholder="Write here..."
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Job Requirement */}
              <Col span={12}>
                <Field name="jobRequirement">
                  {({ field }) => (
                    <Form.Item label="Job Requirement">
                      <ReactQuill
                        {...field}
                        value={values.jobRequirement}
                        onChange={(value) => setFieldValue('jobRequirement', value)}
                        placeholder="Write here..."
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Need to Ask */}
              <Col span={24}>
                <Form.Item label="Need to Ask?">
                  <Checkbox.Group
                    onChange={(checkedValues) => setFieldValue('needToAsk', checkedValues)}
                    value={values.needToAsk}
                  >
                    <Checkbox value="gender">Gender</Checkbox>
                    <Checkbox value="dob">Date of Birth</Checkbox>
                    <Checkbox value="country">Country</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>

              {/* Need to Show Options */}
              <Col span={24}>
                <Form.Item label="Need to Show Options?">
                  <Checkbox.Group
                    onChange={(checkedValues) => setFieldValue('needToShow', checkedValues)}
                    value={values.needToShow}
                  >
                    <Checkbox value="profileImage">Profile Image</Checkbox>
                    <Checkbox value="resume">Resume</Checkbox>
                    <Checkbox value="coverLetter">Cover Letter</Checkbox>
                    <Checkbox value="terms">Terms and Conditions</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>

            {/* Form Actions */}
            <Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={() => navigate('/app/hrm/jobs')} style={{ marginRight: 10 }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </div>
            </Form.Item>
          </FormikForm>
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


