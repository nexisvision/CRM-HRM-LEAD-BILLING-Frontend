import React from 'react';
import {  Input, Button, DatePicker, Select, message, Row, Col, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddJobCandidate = () => {
  // const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('JobCandidate added successfully!');
    navigate('/app/hrm/jobcandidate');
  };

  const initialValues = {
        jobTitle: '',
        branch: '',
        jobCategory: '',
        positions: '',
        startDate: null,
        endDate: null,
        skills: '',
        jobDescription: '',
        jobRequirement: '',
      }
    
      const validationSchema = Yup.object({
        jobTitle: Yup.string().required('Please enter a jobTitle.'),
        branch: Yup.string().required('Please Select a branch.'),
        jobCategory: Yup.string().required('Please select a jobCategory.'),
        positions: Yup.string().required('Please select positions for the job.'),
        startDate: Yup.date().nullable().required('Start Date is required.'),
        endDate: Yup.date().nullable().required('End Date is required.'),
        skills: Yup.string().required('Please enter a  skills.'),
        jobDescription: Yup.string().required('Please enter a job description.'),
        jobRequirement: Yup.string().required('Please select a job requirement.'),
      });

  return (
    <div className="add-job-form">
      {/* <h2 className="mb-4">Create JobCandidate</h2> */}
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
                    <Form
                      layout="vertical"
                      // form={form}
                      name="add-job"
                      className="formik-form" onSubmit={handleSubmit}
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <div className="form-item">
                            <label className='font-semibold'>Job Title</label>
                            <Field name="jobTitle" as={Input} placeholder="Enter Job Title" />
                            <ErrorMessage name="jobTitle" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} >
                          <div className="form-item">
                            <label className='font-semibold'>Branch</label>
                            <Field name="branch">
                              {({ field }) => (
                                <Select
                                  {...field}
                                  className="w-full"
                                  placeholder="Select Branch"
                                  onChange={(value) => setFieldValue('branch', value)}
                                  value={values.branch}
                                  onBlur={() => setFieldTouched("branch", true)}
                                >
                                  <Option value="all">All</Option>
                                  <Option value="branch1">Branch 1</Option>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage name="branch" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className='font-semibold'>Job Category</label>
                            <Field name="jobCategory">
                              {({ field }) => (
                                <Select
                                  {...field}
                                  className="w-full"
                                  placeholder="Select Job Category"
                                  onChange={(value) => setFieldValue('jobCategory', value)}
                                  value={values.jobCategory}
                                  onBlur={() => setFieldTouched("jobCategory", true)}
                                >
                                  <Option value="it">IT</Option>
                                  <Option value="hr">HR</Option>
                                </Select>
                              )}
                            </Field>
                            <ErrorMessage name="jobCategory" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className='font-semibold'>Positions</label>
                            <Field name="positions" as={Input} placeholder="Enter Positions" />
                            <ErrorMessage name="positions" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className='font-semibold'>Start Date</label>
                            <DatePicker
                              className="w-full"
                              format="DD-MM-YYYY"
                              value={values.startDate}
                              onChange={(startDate) => setFieldValue('startDate', startDate)}
                              onBlur={() => setFieldTouched("startDate", true)}
                            />
                            <ErrorMessage name="startDate" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className='font-semibold'>End Date</label>
                            <DatePicker
                              className="w-full"
                              format="DD-MM-YYYY"
                              value={values.endDate}
                              onChange={(endDate) => setFieldValue('endDate', endDate)}
                              onBlur={() => setFieldTouched("endDate", true)}
                            />
                            <ErrorMessage name="endDate" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={24} className='mt-2'>
                          <div className="form-item">
                            <label className='font-semibold'>Skill</label>
                            <Field name="skills" as={Input} placeholder="Enter Skill" />
                            <ErrorMessage name="skills" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className="font-semibold">Job Description</label>
                            <Field name="jobDescription">
                              {({ field }) => (
                                <ReactQuill
                                  {...field}
                                  value={values.jobDescription}
                                  onChange={(value) => setFieldValue('jobDescription', value)}
                                  onBlur={() => setFieldTouched("jobDescription", true)}
                                  placeholder="Write here..."
                                />
                              )}
                            </Field>
                            <ErrorMessage name="jobDescription" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
          
                        <Col span={12} className='mt-2'>
                          <div className="form-item">
                            <label className="font-semibold">Job Requirement</label>
                            <Field name="jobRequirement">
                              {({ field }) => (
                                <ReactQuill
                                  {...field}
                                  value={values.jobRequirement}
                                  onChange={(value) => setFieldValue('jobRequirement', value)}
                                  onBlur={() => setFieldTouched("jobRequirement", true)}
                                  placeholder="Write here..."
                                />
                              )}
                            </Field>
                            <ErrorMessage name="jobRequirement" component="div" className="error-message text-red-500 my-1" />
                          </div>
                        </Col>
          
                        <Col span={24} className='mt-2'>
                          <Checkbox.Group>
                            <Row>
                              <Col span={6}><Checkbox value="gender">Gender</Checkbox></Col>
                              <Col span={6}><Checkbox value="dob">Date of Birth</Checkbox></Col>
                              <Col span={6}><Checkbox value="country">Country</Checkbox></Col>
                              <Col span={6}><Checkbox value="profileImage">Profile Image</Checkbox></Col>
                            </Row>
                          </Checkbox.Group>
                        </Col>
                      </Row>
          
                      <div className="form-buttons text-right">
                        <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
                        <Button type="primary" htmlType="submit">Create</Button>
                      </div>
                    </Form>
                  )}
                </Formik>
    </div>
  );
};

export default AddJobCandidate;