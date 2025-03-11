import React from 'react';
import { Button, DatePicker, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const EditSubscribedUserPlans = () => {
  const navigate = useNavigate();
  const initialValues = {
    date: null,
  };

  const validationSchema = Yup.object({
    date: Yup.date().nullable().required('Date is required.'),
  });

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Subscribed Plans added successfully!');
    navigate('setting/subscribeduserplans');
  };

  return (
    <div className="add-job-form">
      <hr className="mb-4 border-b pb-[5px] font-medium"></hr>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setFieldTouched }) => (
          <Form className="formik-form" onSubmit={handleSubmit}>
            <Row gutter={16}>

              <Col span={24} className='mt-2'>
                <div className="form-item">
                  <label className='font-semibold'>End Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.date}
                    onChange={(date) => setFieldValue('date', date)}
                    onBlur={() => setFieldTouched("date", true)}
                  />
                  <ErrorMessage name="date" component="div" className="error-message text-red-500 my-1" />
                </div>
              </Col>

            </Row>

            <div className="form-buttons text-right mt-4">
              <Button type="default" className="mr-2" onClick={() => navigate('/setting/subscribeduserplans')}>Cancel</Button>
              <Button type="primary" htmlType="submit">Edit</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditSubscribedUserPlans;



