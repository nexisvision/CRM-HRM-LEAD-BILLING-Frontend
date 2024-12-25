import React from 'react';
import {  Input, Button, DatePicker, Select, message, Row, Col, Checkbox, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddMeeting = () => {
  const navigate = useNavigate();

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Job added successfully!');
    navigate('/app/hrm/meeting');
  };

  const initialValues = {
    branch: '',
    department: '',
    employee: '',
    meetingtitle: '',
    meetingdate: null,
    meetingtime: null,
    meetingnote: '',
  }

  const validationSchema = Yup.object({
    branch: Yup.string().required('Please Select a branch.'),
    department: Yup.string().required('Please Select a department.'),
    employee: Yup.string().required('Please select a employee.'),
    meetingtitle: Yup.string().required('Please enter a meeting title.'),
    meetingdate: Yup.date().nullable().required(' Event Start Date is required.'),
    meetingtime: Yup.date().nullable().required('End Date is required.'),
    meetingnote: Yup.string().required('Please enter a description.'),
  });

  return (
    <div className="add-job-form">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form
            className="formik-form" onSubmit={handleSubmit}
          >
            <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          {/* <Col span={24}>
            <Form.Item name="branch" label="Branch*" rules={[{ required: true, message: 'Please enter a branch.' }]}>
            <Select placeholder="Select Branch">
                <Option value="all">All</Option>
                <Option value="branch1">Branch 1</Option>
              </Select>
            </Form.Item>
          </Col> */}

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Department</label>
                  <Field name="department">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Department"
                        onChange={(value) => setFieldValue('department', value)}
                        value={values.department}
                        onBlur={() => setFieldTouched("department", true)}
                      >
                        <Option value="Select department">Select department</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="department" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={24}>
            <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select a Department.' }]}>
              <Select placeholder="Select Department">
                <Option value="all">All</Option>
                <Option value="branch1">Branch 1</Option>
              </Select>
            </Form.Item>
          </Col> */}

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Employee</label>
                  <Field name="employee">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Employee"
                        onChange={(value) => setFieldValue('employee', value)}
                        value={values.employee}
                        onBlur={() => setFieldTouched("employee", true)}
                      >
                        <Option value="employee1">Employee 1</Option>
                        <Option value="employee2">Employee 2</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="employee" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={24}>
            <Form.Item name="employee" label="Employee" rules={[{ required: true, message: 'Please select a Employee.' }]}>
              <Select placeholder="Select Employee">
                <Option value="it">IT</Option>
                <Option value="hr">HR</Option>
              </Select>
            </Form.Item>
          </Col> */}

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Meeting Title"</label>
                  <Field name="meetingtitle" as={Input} placeholder="Event Title" />
                  <ErrorMessage name="meetingtitle" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={24}>
            <Form.Item name="meetingtitle" label="Meeting Title" rules={[{ required: true, message: 'Please enter Meeting Title.' }]}>
              <Input placeholder="Enter Meeting Title" />
            </Form.Item>
          </Col> */}

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Meeting Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.meetingdate}
                    onChange={(meetingdate) => setFieldValue('meetingdate', meetingdate)}
                    onBlur={() => setFieldTouched("meetingdate", true)}
                  />
                  <ErrorMessage name="meetingdate" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>


              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Meeting Time</label>
                  <TimePicker
                    className="w-full"
                    format="HH:mm" 
                    value={values.meetingtime}
                    onChange={(meetingtime) => setFieldValue('meetingtime', meetingtime)}
                    onBlur={() => setFieldTouched("meetingtime", true)}
                  />
                  <ErrorMessage name="meetingtime" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={12}>
            <Form.Item name="meetingdate" label="Meeting Date" rules={[{ required: true, message: 'Meeting date is required.' }]}>
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col> */}



              {/* <Col span={12}>
            <Form.Item name="meetingtime" label="Meeting Time" rules={[{ required: true, message: 'Please enter Meeting Time.' }]}>
            <TimePicker style={{ width: '100%' }} format="HH:mm" />
             
            </Form.Item>
          </Col> */}

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className="font-semibold">Meeting Note</label>
                  <Field name="meetingnote">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.meetingnote}
                        onChange={(value) => setFieldValue('meetingnote', value)}
                        onBlur={() => setFieldTouched("meetingnote", true)}
                        placeholder="Write here..."
                      />
                    )}
                  </Field>
                  <ErrorMessage name="meetingnote" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* <Col span={24}>
            <Form.Item name="meetingnote" label="Meeting Note" rules={[{ required: true }]}>
              <ReactQuill placeholder="Write here..." />
            </Form.Item>
          </Col> */}


            </Row>

           
              <div className="form-buttons text-right mt-2">
                <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/meeting')}>Cancel</Button>
                <Button type="primary" htmlType="submit">Create</Button>
              </div>
           
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddMeeting;