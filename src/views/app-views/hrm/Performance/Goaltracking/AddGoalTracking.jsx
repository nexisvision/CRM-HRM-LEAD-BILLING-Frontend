import React from 'react';
import { Form, Input, Button, DatePicker, Select, Rate, message, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const AddGoalTracking = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    message.success('Goal added successfully!');
    navigate('/app/hrm/goaltracking');
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    message.error('Please fill out all required fields.');
  };

  return (
    <div className="add-goal-tracking">
      <Form
        layout="vertical"
        form={form}
        name="add-goal-tracking"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="branch"
              label="Branch"
              rules={[{ required: true, message: 'Please select a branch' }]}
            >
              <Select placeholder="Select Branch">
                <Option value="branch1">Branch 1</Option>
                <Option value="branch2">Branch 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="goalType"
              label="Goal Types"
              rules={[{ required: true, message: 'Please select a goal type' }]}
            >
              <Select placeholder="Select Goal Type">
                <Option value="type1">Type 1</Option>
                <Option value="type2">Type 2</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select a start date' }]}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select an end date' }]}
            >
              <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter a subject' }]}
            >
              <Input placeholder="Enter Subject" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="targetAchievement"
              label="Target Achievement"
              rules={[{ required: true, message: 'Please enter target achievement' }]}
            >
              <Input placeholder="Enter Target Achievement" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea placeholder="Enter Description" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select Status">
                <Option value="notStarted">Not Started</Option>
                <Option value="inProgress">In Progress</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="rating"
              label="Rating"
              rules={[{ required: true, message: 'Please provide a rating' }]}
            >
              <Rate />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className="text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/goaltracking')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddGoalTracking;






