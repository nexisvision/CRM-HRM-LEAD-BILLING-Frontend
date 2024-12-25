import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button } from 'antd';

const { Option } = Select;

const AddInterviewSchedule = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();

  const handleCreate = () => {
    form.validateFields()
      .then(values => {
        console.log('Form Values:', values); // Replace with actual logic
        onCreate(values); // Call parent handler with form data
      })
      .catch(info => {
        console.error('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title="Create New Interview Schedule"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="create" type="primary" onClick={handleCreate}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          interviewTo: '',
          interviewer: '',
          interviewDate: null,
          interviewTime: null,
          comment: '',
        }}
      >
        <Form.Item
          label="Interview To"
          name="interviewTo"
          rules={[{ required: true, message: 'Please select an interviewee!' }]}
        >
          <Select placeholder="Select Interviewee">
            <Option value="candice">Candice</Option>
            <Option value="john">John</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Interviewer"
          name="interviewer"
          rules={[{ required: true, message: 'Please select an interviewer!' }]}
        >
          <Select placeholder="Select Interviewer">
            <Option value="manager1">Manager 1</Option>
            <Option value="manager2">Manager 2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Interview Date"
          name="interviewDate"
          rules={[{ required: true, message: 'Please select an interview date!' }]}
        >
          <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Interview Time"
          name="interviewTime"
          rules={[{ required: true, message: 'Please select an interview time!' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Comment" name="comment">
          <Input.TextArea placeholder="Enter Comment" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInterviewSchedule;
