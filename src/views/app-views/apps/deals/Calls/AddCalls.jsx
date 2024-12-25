import React, { useState } from 'react';
import { Modal, Input, Select, Button, Form, Row, Col, message } from 'antd';
import { AiOutlineRobot } from 'react-icons/ai';

const { Option } = Select;
const { TextArea } = Input;

const AddCalls = ({ visible, onClose }) => {
  const [form] = Form.useForm();

  const onSubmit = (values) => {
    console.log('Form Values:', values);
    message.success('Call added successfully!');
    onClose();
    form.resetFields();
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    // <Modal
    //   title="Add Call"
    //   visible={visible}
    //   onCancel={onCancel}
    //   footer={null}
    //   width={800}
    // >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true, message: 'Please enter the subject!' }]}
            >
              <Input placeholder="Enter Subject" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="callType"
              label="Call Type"
              rules={[{ required: true, message: 'Please select the call type!' }]}
            >
              <Select placeholder="Select Call Type">
                <Option value="Inbound">Inbound</Option>
                <Option value="Outbound">Outbound</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Duration (Format h:mm:ss e.g. 00:35:20)"
              rules={[{ required: true, message: 'Please enter the duration!' }]}
            >
              <Input placeholder="--:--:--" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="assignee"
              label="Assignee"
              rules={[{ required: true, message: 'Please select an assignee!' }]}
            >
              <Select placeholder="Select Assignee">
                <Option value="Workdo">Workdo</Option>
                <Option value="Team Member">Team Member</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea placeholder="Enter Description" rows={4} />
        </Form.Item>

        <Form.Item name="callResult" label="Call Result">
          <TextArea placeholder="Write Here..." rows={4} />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </div>
      </Form>
    // </Modal>
  );
};

export default AddCalls;
