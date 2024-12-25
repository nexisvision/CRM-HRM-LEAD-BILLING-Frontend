import React from 'react';
import {  Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditEventSetUp = ({ onEditEvent }) => {
    // const [form] = Form.useForm();

    const onSubmit = (values) => {
      const formattedData = {
        id: Date.now(),
        title: values.title,
        date: values.eventsetupDate.format('YYYY-MM-DD'),
        description: values.description,
      };
  
      onEditEvent(formattedData);
      message.success('Event scheduled successfully!');
    };

     const initialValues = {
      
        title: '',
        eventstartdate: null,
        eventenddate: null,
        description: '',
      }
    
      const validationSchema = Yup.object({
      
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
      
                  
                
                  <Col span={24} className='mt-2'>
                    <div className="form-item">
                      <label className='font-semibold'>Event Title"</label>
                      <Field name="title" as={Input} placeholder="Event Title" />
                      <ErrorMessage name="title" component="div" className="error-message text-red-500 my-1" />
                    </div>
                  </Col>
      
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
                  Update Event
                </Button>
                </div>
      
              </Form>
            )}
          </Formik>
    );
};

export default EditEventSetUp;
