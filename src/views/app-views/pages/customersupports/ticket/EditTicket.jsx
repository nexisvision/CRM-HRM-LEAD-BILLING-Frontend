import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, message, Upload } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const EditTicket = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams(); // Assuming the ticket ID is passed in the URL

  const initialValues = {
    subject: '',
    user: '',
    priority: 'Low',
    status: 'Open',
    endDate: null,
    description: '',
    attachment: null,
  };

  const validationSchema = Yup.object({
    subject: Yup.string().required('Please enter a subject.'),
    user: Yup.string().required('Please select a user.'),
    priority: Yup.string().required('Please select priority.'),
    status: Yup.string().required('Please select status.'),
    endDate: Yup.date().required('Please select an end date.'),
    description: Yup.string().required('Please enter a description.'),
  });

  useEffect(() => {
    // Fetch the existing ticket details and populate the form
    // Replace this with an actual API call
    const fetchTicketDetails = async () => {
      const ticketData = {
        subject: 'Issue with login',
        user: 'John Doe',
        priority: 'High',
        status: 'In Progress',
        endDate: '2023-12-31',
        description: 'Unable to log in to the system. Please check.',
        attachment: null, // Assuming no attachment initially
      };

      // Set initial values from the fetched data
      Formik.setValues({
        ...ticketData,
        endDate: moment(ticketData.endDate, 'YYYY-MM-DD'),
      });
    };

    fetchTicketDetails();
  }, []);

  const onSubmit = (values) => {
    console.log('Updated values:', values);
    message.success('Ticket updated successfully!');
    navigate('/tickets');
  };

  return (
    <div className="edit-ticket-form">
      {/* <h2>Edit Support Ticket</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize // Allows reinitialization when initial values change
      >
        {({ setFieldValue, values }) => (
          <FormikForm>
            <Row gutter={[16, 16]}>
              {/* Subject */}
              <Col span={24}>
                <Field name="subject">
                  {({ field }) => (
                    <Form.Item label="Subject" required>
                      <Input {...field} placeholder="Enter Subject" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Support for User */}
              <Col span={12}>
                <Field name="user">
                  {({ field }) => (
                    <Form.Item label="Support for User" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue('user', value)}
                        placeholder="Select User"
                        value={values.user}
                      >
                        <Option value="Buffy Walter">Buffy Walter</Option>
                        <Option value="John Doe">John Doe</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Priority */}
              <Col span={12}>
                <Field name="priority">
                  {({ field }) => (
                    <Form.Item label="Priority" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue('priority', value)}
                        placeholder="Select Priority"
                        value={values.priority}
                      >
                        <Option value="Low">Low</Option>
                        <Option value="Medium">Medium</Option>
                        <Option value="High">High</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Status */}
              <Col span={12}>
                <Field name="status">
                  {({ field }) => (
                    <Form.Item label="Status" required>
                      <Select
                        {...field}
                        onChange={(value) => setFieldValue('status', value)}
                        placeholder="Select Status"
                        value={values.status}
                      >
                        <Option value="Open">Open</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Closed">Closed</Option>
                      </Select>
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* End Date */}
              <Col span={12}>
                <Field name="endDate">
                  {({ field }) => (
                    <Form.Item label="End Date" required>
                      <DatePicker
                        {...field}
                        style={{ width: '100%' }}
                        format="DD-MM-YYYY"
                        onChange={(date, dateString) => setFieldValue('endDate', dateString)}
                        value={values.endDate ? moment(values.endDate) : null}
                      />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Description */}
              <Col span={24}>
                <Field name="description">
                  {({ field }) => (
                    <Form.Item label="Description" required>
                      <Input.TextArea {...field} rows={4} placeholder="Enter Description" />
                    </Form.Item>
                  )}
                </Field>
              </Col>

              {/* Attachment */}
              <Col span={24}>
                <Field name="attachment">
                  {({ field }) => (
                    <Form.Item label="Attachment">
                      <Upload
                        beforeUpload={(file) => {
                          setFieldValue('attachment', file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Choose File</Button>
                      </Upload>
                    </Form.Item>
                  )}
                </Field>
              </Col>
            </Row>

            {/* Form Actions */}
            <Form.Item>
              <div style={{ textAlign: 'right' }}>
                <Button type="default" onClick={() => navigate('/tickets')} style={{ marginRight: 10 }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </div>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default EditTicket;
