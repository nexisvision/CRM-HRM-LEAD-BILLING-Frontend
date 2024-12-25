import React from 'react';
import { Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import moment from 'moment';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const AddEventSetUp = ({ onAddEvent }) => {
  // const [form] = Form.useForm();

  const onSubmit = (values) => {
    const formattedData = {
      id: Date.now(),
      branch: values.branch,
      department: values.department,
      employee: values.employee,
      title: values.title,
      date: values.eventsetupDate.format('YYYY-MM-DD'),
      description: values.description
    };

    onAddEvent(formattedData);
    message.success('Event scheduled successfully!');
  };

  const initialValues = {
    branch: '',
    department: '',
    employee: '',
    title: '',
    eventstartdate: null,
    eventenddate: null,
    description: '',
  }

  const validationSchema = Yup.object({
    branch: Yup.string().required('Please Select a branch.'),
    department: Yup.string().required('Please Select a department.'),
    employee: Yup.string().required('Please select a employee.'),
    title: Yup.string().required('Please enter a title.'),
    eventstartdate: Yup.date().nullable().required(' Event Start Date is required.'),
    eventenddate: Yup.date().nullable().required('End Date is required.'),
    description: Yup.string().required('Please enter a description.'),
  });

  return (
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

            <Col span={8} className='mt-2'>
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
                      <Option value="branch1">Branch 1</Option>
                      <Option value="branch2">Branch 2</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="branch" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>
            {/* <Col span={8}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select an Branch.' }]}
            >
              <Select placeholder="Select Branch">
                <Option value="India">India</Option>
                <Option value="Canada">Canada</Option>
                <Option value="France">France</Option>
              </Select>
            </Form.Item>
          </Col> */}
            <Col span={8} className='mt-2'>
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
            {/* <Col span={8}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select an Department.' }]}
              >
                <Select placeholder="Select Designation">
                  <Option value="Select Designation">Select Designation</Option>
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={8} className='mt-2'>
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
            {/* <Col span={8}>
              <Form.Item
                name="employee"
                label="Employee"
                rules={[{ required: true, message: 'Please select an Employee.' }]}
              >
                <Select placeholder="Select Employee">
                  <Option value="Select Employee">Select Employee</Option>
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={24} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Title"</label>
                <Field name="title" as={Input} placeholder="Event Title" />
                <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* <Col span={24}>
              <Form.Item
                name="title"
                label="Event Title"
                rules={[{ required: true, message: 'Please provide a title for the event.' }]}
              >
                <Input placeholder="Event Title" />
              </Form.Item>
            </Col> */}

            {/* <Col span={12}>
            <Form.Item
              name="eventmanager"
              label="EventManager"
              rules={[{ required: true, message: 'Please select an EventManager.' }]}
            >
              <Select placeholder="Select EventManager">
                <Option value="Candice">Candice</Option>
                <Option value="John Doe">John Doe</Option>
              </Select>
            </Form.Item>
          </Col> */}
            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Start Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.eventstartdate}
                  onChange={(eventstartdate) => setFieldValue('eventstartdate', eventstartdate)}
                  onBlur={() => setFieldTouched("eventstartdate", true)}
                />
                <ErrorMessage name="eventstartdate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>


            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event End Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.eventenddate}
                  onChange={(eventenddate) => setFieldValue('eventenddate', eventenddate)}
                  onBlur={() => setFieldTouched("eventenddate", true)}
                />
                <ErrorMessage name="eventenddate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>
            {/* <Col span={12}>
              <Form.Item
                name="eventstartdate"
                label="Event Start Date"
                rules={[{ required: true, message: 'Please select an event date.' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="eventenddate"
                label="Event End Date"
                rules={[{ required: true, message: 'Please select an event date.' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col> */}
            <Col span={24} className='mt-2'>
              <label className='font-semibold'>Event Select Color</label>
              {/* <Input placeholder="Event Title" /> */}
              <div>
                <Button htmlType="" className='me-1 bg-cyan-500'></Button>
                <Button htmlType="" className='me-1 bg-orange-400'></Button>
                <Button htmlType="" className='me-1 bg-rose-500'></Button>
                <Button htmlType="" className='me-1 bg-lime-400'></Button>
                <Button htmlType="" className='bg-blue-800'></Button>
              </div>

            </Col>

            <Col span={24} className='mt-2'>
              <div className="form-item">
                <label className="font-semibold">Event Description</label>
                <Field name="description">
                  {({ field }) => (
                    <ReactQuill
                      {...field}
                      value={values.description}
                      onChange={(value) => setFieldValue('description', value)}
                      onBlur={() => setFieldTouched("description", true)}
                      placeholder="Event Description"
                    />
                  )}
                </Field>
                <ErrorMessage name="description" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            {/* <Col span={24}>
              <Form.Item name="description" label="Event Description" rules={[{ required: true }]}>
                <ReactQuill placeholder="Enter Event Description" />
              </Form.Item>
            </Col> */}
          </Row>
          <div className="form-buttons text-right mt-2">

          <Button type="default" htmlType="submit" className='me-2'>
            Cancel Event
          </Button>
          <Button type="primary" htmlType="submit">
            Add Event
          </Button>
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default AddEventSetUp;



