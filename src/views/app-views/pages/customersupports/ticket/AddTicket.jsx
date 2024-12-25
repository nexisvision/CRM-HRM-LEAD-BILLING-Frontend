import React from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col, message, Upload } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddTicket = () => {
  const navigate = useNavigate();

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

  const onSubmit = (values) => {
    console.log('Submitted values:', values);
    message.success('Ticket created successfully!');
    navigate('/tickets');
  };

  return (
    <div className="create-ticket-form">
      {/* <h2>Create Support Ticket</h2> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
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
                      <Input.TextArea
                        {...field}
                        rows={4}
                        placeholder="Enter Description"
                      />
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
                  Create
                </Button>
              </div>
            </Form.Item>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddTicket;
