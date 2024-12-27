import React, { useEffect } from 'react';
import { Input, Button, DatePicker, Select, TimePicker, message, Row, Col } from 'antd';
import moment from 'moment';
import ReactQuill from 'react-quill';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {  UpdateEventsetUp } from './EventSetupService/EventSetupSlice'; // Make sure the path is correct


const { Option } = Select;

const EditEventSetUp = ({  initialEventData, onCancel,id }) => {
  const dispatch = useDispatch();
  // const { id } = useParams();

  const onSubmit = async (values, { setSubmitting }) => {
    console.log("val");
    try {
      const eventData = {
        EventTitle: values.EventTitle,
        EventManager: values.EventManager,
        EventDate: values.EventDate.format('YYYY-MM-DD'),
        EventTime: values.EventTime.format('HH:mm'),
      };

      await dispatch(UpdateEventsetUp({ id, eventData })).unwrap();
      message.success('Event updated successfully!');
      onCancel(); // Close the form/modal
    } catch (error) {
      message.error(error.message || 'Failed to update the event.');
    } finally {
      setSubmitting(false);
    }
  };



  const initialValues = {
    EventTitle: initialEventData?.EventTitle ,
    EventManager: initialEventData?.EventManager ,
    EventDate: initialEventData?.EventDate ? moment(initialEventData.EventDate) : null,
    EventTime: initialEventData?.EventTime ? moment(initialEventData.EventTime) : null,
  }


  const validationSchema = Yup.object({
    EventTitle: Yup.string().required('Please enter event title.'),
    EventManager: Yup.string().required('Please enter a manager name.'),
    EventDate: Yup.date().nullable().required('Event Date is required.'),
    EventTime: Yup.date().nullable().required('Event Time is required.'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
        <Form
          className="formik-form" onSubmit={handleSubmit}
        >
          <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
          <Row gutter={16}>

            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Title"</label>
                <Field name="EventTitle" as={Input} placeholder="Event Title" />
                <ErrorMessage name="EventTitle" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Manager</label>
                <Field name="EventManager">
                  {({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      placeholder="Select Event Manager"
                      onChange={(value) => setFieldValue('EventManager', value)}
                      value={values.EventManager}
                      onBlur={() => setFieldTouched("EventManager", true)}
                    >
                      <Option value="Manager 1">Manager 1</Option>
                      <Option value="Manager 2">Manager 2</Option>
                      <Option value="Manager 3">Manager 3</Option>
                    </Select>
                  )}
                </Field>
                <ErrorMessage name="EventManager" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>

            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Date</label>
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  value={values.EventDate}
                  onChange={(EventDate) => setFieldValue('EventDate', EventDate)}
                  onBlur={() => setFieldTouched("EventDate", true)}
                />
                <ErrorMessage name="EventDate" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>


            <Col span={12} className='mt-2'>
              <div className="form-item">
                <label className='font-semibold'>Event Time</label>
                <TimePicker
                  className="w-full"
                  format="HH:mm"
                  value={values.EventTime}
                  onChange={(EventTime) => setFieldValue('EventTime', EventTime)}
                  onBlur={() => setFieldTouched("EventTime", true)}
                />
                <ErrorMessage name="EventTime" component="div" className="error-message text-red-500 my-1" />
              </div>
            </Col>
          </Row>
          <div className="form-buttons text-right mt-2">

            <Button type="default" htmlType="submit" className='me-2'>
              Cancel Event
            </Button>
            <Button type="primary" htmlType="submit">
              Edit Event
            </Button>
          </div>

        </Form>
      )}
    </Formik>
  );
};

export default EditEventSetUp;



