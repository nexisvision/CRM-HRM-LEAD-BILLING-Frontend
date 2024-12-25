import React from 'react';
import { Input, Button, DatePicker, Select, Upload, Radio, message, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
const { TextArea } = Input;

const { Option } = Select;
const AddJobApplication = () => {
  // const [form] = Form.useForm();

  const onSubmit = (values) => {
    console.log('Form submitted:', values);
    message.success('Job application submitted successfully!');
  };

  const initialValues = {
    job: '',
    name: '',
    email: '',
    phone: '',
    dob: null,
    country: '',
    state: '',
    city: '',
    profile: '',
    cv: '',
    coverLetter: '',
    weaknesses: '',
    reason: '',
  }

  const validationSchema = Yup.object({
    job: Yup.string().required('Please Select a job.'),
    name: Yup.string().required('Please enter a name.'),
    email: Yup.string().email("Please enter a valid email address with @.").required('Please enter a email.'),
    phone: Yup.string().matches(/^\d{10}$/, 'phone number must be 10 digits.').required('Please enter a phone Number.'),
    dob: Yup.date().nullable().required(' Date of Birth is required.'),
    country: Yup.string().required('Please enter a country.'),
    state: Yup.string().required('Please enter a jobType.'),
    city: Yup.string().required('Please enter a city.'),
    profile: Yup.string().required('Please Uploade file.'),
    cv: Yup.string().required('Please Uploade file.'),
    coverLetter: Yup.string().required('Please enter a coverLetter.'),
    weaknesses: Yup.string().required('Please enter a weaknesses.'),
    reason: Yup.string().required('Please enter a reason.'),
  });

  return (
    <div>
      {/* <h2>Create New Job Application</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form layout="vertical" name="add-job" className="formik-form" onSubmit={handleSubmit}>


            <Row gutter={16}>
              <Col span={24} >
                <div className="form-item">
                  <label className='font-semibold'>Job</label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Job"
                        onChange={(value) => setFieldValue('job', value)}
                        value={values.job}
                        onBlur={() => setFieldTouched("job", true)}
                      >
                        <Option value="accounting">Highly Projected Growth for Accounting Jobs</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="job" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Name</label>
                  <Field name="name" as={Input} placeholder="Enter Name" />
                  <ErrorMessage name="name" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Email</label>
                  <Field name="email" as={Input} placeholder="Enter Email" type='email' />
                  <ErrorMessage name="email" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Phone</label>
                  <Field name="phone" as={Input} placeholder="Enter Enter Phone (e.g., +91)" />
                  <ErrorMessage name="phone" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Date of Birth</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.dob}
                    onChange={(dob) => setFieldValue('dob', dob)}
                    onBlur={() => setFieldTouched("dob", true)}
                  />
                  <ErrorMessage name="dob" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <label name="gender" htmlFor="" className='font-semibold'>Gender</label>
                <div className='mt-2'>
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>Country</label>
                  <Field name="country" as={Input} placeholder="Enter Enter Your Country" />
                  <ErrorMessage name="country" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>State</label>
                  <Field name="state" as={Input} placeholder="Enter Enter State" />
                  <ErrorMessage name="state" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={12} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>City</label>
                  <Field name="city" as={Input} placeholder="Enter Enter city" />
                  <ErrorMessage name="city" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>


              <Col span={12} className='mt-2'>
                <label name="profile" htmlFor="" className='font-semibold'>Profile</label>
                <div className='mt-2'>
                <Upload>
                  <Button icon={<UploadOutlined />}>Choose File</Button>
                </Upload>
                </div>
                <ErrorMessage name="profile" component="div" className="error-message text-red-500 my-1" />
              </Col>

              <Col span={12} className='mt-2'>
                <label name="cv" htmlFor="" className='font-semibold'>CV / Resume</label>
                <div className='mt-2'>
                <Upload>
                  <Button icon={<UploadOutlined />}>Choose File</Button>
                </Upload>
                </div>
                <ErrorMessage name="cv" component="div" className="error-message text-red-500 my-1" />
              </Col>

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className="font-semibold">Cover Letter</label>
                  <Field name="coverLetter">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.coverLetter}
                        rows={4}
                        onChange={(value) => setFieldValue('coverLetter', value)}
                        onBlur={() => setFieldTouched("coverLetter", true)}
                        placeholder="Enter Cover Letter"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="coverLetter" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className="font-semibold">What Do You Consider to Be Your Weaknesses?</label>
                  <Field name="weaknesses">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        rows={2}
                        value={values.weaknesses}
                        onChange={(value) => setFieldValue('weaknesses', value)}
                        onBlur={() => setFieldTouched("weaknesses", true)}
                        placeholder="Write Here..."
                      />
                    )}
                  </Field>
                  <ErrorMessage name="weaknesses" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className="font-semibold">Why Do You Want This Job?</label>
                  <Field name="reason">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        rows={2}
                        value={values.reason}
                        onChange={(value) => setFieldValue('reason', value)}
                        onBlur={() => setFieldTouched("reason", true)}
                        placeholder="Write Here..."
                      />
                    )}
                  </Field>
                  <ErrorMessage name="reason" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

            </Row>

            <div style={{ textAlign: 'right' ,marginTop:'8px'}}>
              <Button style={{ marginRight: 8 }}>
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

export default AddJobApplication;