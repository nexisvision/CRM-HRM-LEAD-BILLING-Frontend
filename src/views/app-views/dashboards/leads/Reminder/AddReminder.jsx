import React, { useState } from 'react';
import { Modal, Button, Form, DatePicker, Select, Input, Checkbox, Row, Col } from 'antd';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

const { TextArea } = Input;

const reminderOptions = [
  { value: 'call', label: 'Call Reminder' },
  { value: 'meeting', label: 'Meeting Reminder' },
  { value: 'followup', label: 'Follow-up Reminder' },
  { value: 'other', label: 'Other' }
];

const validationSchema = Yup.object().shape({
  notificationDate: Yup.date().required('Date is required'),
  reminderType: Yup.string().required('Reminder type is required'),
  description: Yup.string().required('Description is required'),
  sendEmail: Yup.boolean()
});

const ReminderList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const initialValues = {
    notificationDate: null,
    reminderType: undefined,
    description: '',
    sendEmail: false
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    console.log('Form values:', values);
    setSubmitting(false);
    setIsModalVisible(false);
    resetForm();
  };

  return (
    <Row justify="end" className="mb-4">
      <Col>
        <Button type="primary" onClick={showModal}>
          Set Lead Reminder
        </Button>
      </Col>

      <Modal
        title={
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-lg font-medium">Set Lead Reminder</span>
          </div>
        }
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose
        width={700}
        className="reminder-modal"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting
          }) => (
            <Form onFinish={handleSubmit} layout="vertical" className="mt-4">
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Date to be notified"
                    required
                    validateStatus={errors.notificationDate && touched.notificationDate ? 'error' : ''}
                    help={touched.notificationDate && errors.notificationDate}
                    className="mb-4"
                  >
                    <DatePicker
                      className="w-full"
                      onChange={(date) => setFieldValue('notificationDate', date)}
                      onBlur={handleBlur}
                      name="notificationDate"
                      format="YYYY-MM-DD"
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Set reminder to"
                    required
                    validateStatus={errors.reminderType && touched.reminderType ? 'error' : ''}
                    help={touched.reminderType && errors.reminderType}
                    className="mb-4"
                  >
                    <Select
                      className="w-full"
                      placeholder="Select reminder type"
                      options={reminderOptions}
                      onChange={(value) => setFieldValue('reminderType', value)}
                      onBlur={handleBlur}
                      name="reminderType"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Description"
                    required
                    validateStatus={errors.description && touched.description ? 'error' : ''}
                    help={touched.description && errors.description}
                    className="mb-4"
                  >
                    <TextArea
                      rows={4}
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      placeholder="Enter reminder description"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item className="mb-6">
                    <Checkbox
                      name="sendEmail"
                      checked={values.sendEmail}
                      onChange={(e) => setFieldValue('sendEmail', e.target.checked)}
                    >
                      Send also an email for this reminder
                    </Checkbox>
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Row justify="end" gutter={[8, 0]}>
                    <Col>
                      <Button onClick={handleCancel}>
                        Close
                      </Button>
                    </Col>
                    <Col>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={isSubmitting}
                        // disabled={isSubmitting || Object.keys(errors).length > 0}
                      >
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal>
    </Row>
  );
};

export default ReminderList;
