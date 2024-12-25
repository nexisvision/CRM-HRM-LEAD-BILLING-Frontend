import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Rate, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const EditIndicator = ({ initialData }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Pre-fill the form with existing data when the component mounts
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const onFinish = (values) => {
    console.log('Updated values:', values);
    message.success('Indicator updated successfully!');
    navigate('/app/hrm/indicator');
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  return (
    <div className="edit-indicator">
      <Form
        layout="vertical"
        form={form}
        name="edit-indicator"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select placeholder="Select Branch">
                <Option value="china">China</Option>
                <Option value="usa">USA</Option>
                <Option value="india">India</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select placeholder="Select Department">
                <Option value="hr">HR</Option>
                <Option value="it">IT</Option>
                <Option value="finance">Finance</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: 'Please select a designation' }]}
            >
              <Select placeholder="Select Designation">
                <Option value="manager">Manager</Option>
                <Option value="developer">Developer</Option>
                <Option value="designer">Designer</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-semibold mb-3">Behavioral Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="businessProcess"
              label="Business Process"
              rules={[{ required: true, message: 'Please provide a rating for Business Process' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="oralCommunication"
              label="Oral Communication"
              rules={[{ required: true, message: 'Please provide a rating for Oral Communication' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-semibold mb-3">Organizational Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="leadership"
              label="Leadership"
              rules={[{ required: true, message: 'Please provide a rating for Leadership' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="projectManagement"
              label="Project Management"
              rules={[{ required: true, message: 'Please provide a rating for Project Management' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <h1 className="text-lg font-semibold mb-3">Technical Competencies</h1>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="allocatingResources"
              label="Allocating Resources"
              rules={[{ required: true, message: 'Please provide a rating for Allocating Resources' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div className="text-right">
            <Button type="default" onClick={() => navigate('/app/hrm/indicator')} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditIndicator;
