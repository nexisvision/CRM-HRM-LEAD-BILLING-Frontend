import React, { useEffect, useState } from 'react';
import {  Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditInterview = ({ interviewData, onUpdateInterview }) => {
  // const [form] = Form.useForm();
  const [initialValues,setInitialValues] = useState({
    title: '',
    interviewer: '',
    interviewDate: null,
    interviewTime: null,
  })

  useEffect(() => {
    // Populate form with initial values when editing
    if (interviewData) {
      setInitialValues({
        title: interviewData.title,
        interviewer: interviewData.interviewer,
        interviewDate: interviewData.date ? moment(interviewData.date, 'YYYY-MM-DD') : null,
        interviewTime: interviewData.time ? moment(interviewData.time, 'HH:mm') : null,
      });
    }
  }, [interviewData]);

  const onSubmit = (values) => {
    const updatedData = {
      ...interviewData, // Preserve the existing interview ID or other properties
      title: values.title,
      interviewer: values.interviewer,
      date: values.interviewDate.format('YYYY-MM-DD'),
      time: values.interviewTime.format('HH:mm'),
    };

    onUpdateInterview(updatedData);
    message.success('Interview updated successfully!');
  };

 
  
    const validationSchema = Yup.object({
      title: Yup.string().required('Please enter a interview title.'),
      interviewer: Yup.string().required('Please select a interviewer.'),
      interviewDate: Yup.date().nullable().required(' Event Start Date is required.'),
      interviewTime: Yup.date().nullable().required('Interview Time is required.'),
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
            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Title"</label>
                <Field name="title" as={Input} placeholder="Event Title" />
                <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

           
            <Col span={12} className='mt-2'>
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
                      <Option value="Candice">Candice</Option>
                      <Option value="John Doe">John Doe</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="interviewer" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.interviewDate}
                  onChange={(interviewDate) => setFieldValue('interviewDate', interviewDate)}
                  onBlur={() => setFieldTouched("interviewDate", true)}
                />
                <ErrorMessage name="interviewDate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>


            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Interview Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={values.interviewTime}
                  onChange={(interviewTime) => setFieldValue('interviewTime', interviewTime)}
                  onBlur={() => setFieldTouched("interviewTime", true)}
                />
                <ErrorMessage name="interviewTime" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

          </Row>
        
            <Button type="primary" htmlType="submit" className='mt-3'>
              Edit Interview
            </Button>
          
        </Form>
      )}
    </Formik>
  );
};

export default EditInterview;

