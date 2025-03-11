import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';

const ResetPassword = () => {
  const [setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleReset = () => {
    form
      .validateFields()
      .then((values) => {
        if (values.password !== values.confirmPassword) {
          message.error('Passwords do not match');
          return;
        }
        message.success('Password reset successfully!');
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        name="reset_password_form"
        initialValues={{ remember: true }}
      >


        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter a password!' }]}
        >
          <Input.Password placeholder="Enter Password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          rules={[
            { required: true, message: 'Please confirm your password!' },
          ]}
        >
          <Input.Password placeholder="Enter Confirm Password" />
        </Form.Item>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: '10px' }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
