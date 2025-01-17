import React from 'react';
import { Input, Button, Select, Radio, message, Row, Col } from 'antd';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import moment from 'moment';

const { Option } = Select;

const EditJobApplication = ({ initialValues, onUpdateApplication }) => {
  const onSubmit = (values) => {
    console.log('Form updated:', values);
    onUpdateApplication(values);
    message.success('Job application updated successfully!');
  };

  const validationSchema = Yup.object({
    job: Yup.string().required('Please select a job.'),
    name: Yup.string().required('Please enter a name.'),
    email: Yup.string().email('Please enter a valid email address.').required('Please enter an email.'),
    phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits.').required('Please enter a phone number.'),
    location: Yup.string().required('Please enter a location.'),
    totalExperience: Yup.string().required('Please select your total experience.'),
    currentLocation: Yup.string().required('Please enter your current location.'),
    noticePeriod: Yup.string().required('Please select your notice period.'),
    status: Yup.string().required('Please select a status.'),
    appliedSources: Yup.string().required('Please enter the applied source.'),
    coverLetter: Yup.string().required('Please enter a cover letter.'),
  });

  return (
    <div>
      <Formik
        initialValues={{
          ...initialValues,
          coverLetter: initialValues.coverLetter || '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form onSubmit={handleSubmit} style={{ padding: '20px', background: '#fff', borderRadius: '8px' }}>
            <Row gutter={16}>
              {/* Job */}
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Job</label>
                  <Field name="job">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Job"
                        onChange={(value) => setFieldValue('job', value)}
                        value={values.job}
                        onBlur={() => setFieldTouched('job', true)}
                      >
                        <Option value="developer">Software Developer</Option>
                        <Option value="designer">Graphic Designer</Option>
                      </Select>
                    )}
                  </Field>
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
                  <Field name="totalExperience">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Total Experience"
                        onChange={(value) => setFieldValue('totalExperience', value)}
                      >
                        <Option value="0-1">0-1 Years</Option>
                        <Option value="1-3">1-3 Years</Option>
                        <Option value="3-5">3-5 Years</Option>
                        <Option value="5+">5+ Years</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="totalExperience" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Current Location */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Current Location</label>
                  <Field name="currentLocation" as={Input} placeholder="Enter Current Location" />
                  <ErrorMessage name="currentLocation" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Notice Period */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Notice Period</label>
                  <Field name="noticePeriod">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Notice Period"
                        onChange={(value) => setFieldValue('noticePeriod', value)}
                      >
                        <Option value="immediate">Immediate</Option>
                        <Option value="15 days">15 Days</Option>
                        <Option value="1 month">1 Month</Option>
                        <Option value="2 months">2 Months</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage name="noticePeriod" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Status */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Status</label>
                  <Field name="status">
                    {({ field }) => (
                      <Radio.Group {...field} onChange={(e) => setFieldValue('status', e.target.value)}>
                        <Radio value="active">Active</Radio>
                        <Radio value="inactive">Inactive</Radio>
                      </Radio.Group>
                    )}
                  </Field>
                  <ErrorMessage name="status" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Applied Sources */}
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Applied Sources</label>
                  <Field name="appliedSources" as={Input} placeholder="Enter Applied Sources" />
                  <ErrorMessage name="appliedSources" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

              {/* Cover Letter */}
              <Col span={24}>
                <div className="form-item">
                  <label className="font-semibold">Cover Letter</label>
                  <Field name="coverLetter">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.coverLetter}
                        onChange={(value) => setFieldValue('coverLetter', value)}
                        placeholder="Enter Cover Letter"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="coverLetter" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>
            </Row>

            <div style={{ textAlign: 'right', marginTop: '16px' }}>
              <Button style={{ marginRight: 8 }}>Cancel</Button>
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

export default EditJobApplication;
