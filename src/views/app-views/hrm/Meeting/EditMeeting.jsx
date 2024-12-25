import React, { useEffect, useState } from 'react';
import { Input, Button, DatePicker, Select, message, Row, Col, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import moment from 'moment';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const EditMeeting = ({ editData }) => {
  // const [form] = Form.useForm();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    meetingtitle: '',
    meetingdate: null,
    meetingtime: null,
    meetingnote: '',
  });

  useEffect(() => {
    // Initialize the form with editData
    if (editData) {
      setInitialValues({

        meetingtitle: editData.meetingtitle,
        meetingdate: editData.meetingdate ? moment(editData.meetingdate, 'DD-MM-YYYY') : null,
        meetingtime: editData.meetingtime ? moment(editData.meetingtime, 'HH:mm') : null,
        meetingnote: editData.meetingnote,
      });
    }
  }, [editData]);

  const onSubmit = (values) => {
    console.log('Updated values:', values);
    message.success('Meeting updated successfully!');
    navigate('/app/hrm/meeting');
  };


  const validationSchema = Yup.object({
    meetingtitle: Yup.string().required('Please enter a meeting title.'),
    meetingdate: Yup.date().nullable().required(' Event Start Date is required.'),
    meetingtime: Yup.date().nullable().required('End Date is required.'),
    meetingnote: Yup.string().required('Please enter a description.'),
  });

  return (
    <div className="edit-meeting-form">
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
                  <label className='font-semibold'>Meeting Title"</label>
                  <Field name="meetingtitle" as={Input} placeholder="Event Title" />
                  <ErrorMessage name="meetingtitle" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>


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
              <Button type="primary" htmlType="submit">Update</Button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditMeeting;
