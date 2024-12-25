import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

const ResetPassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

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
        // Logic for resetting the password goes here
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
      {/* <Button type="primary" onClick={showModal}>
        Reset Password
      </Button> */}
{/* 
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      > */}
        <Form
          form={form}
          layout="vertical"
          name="reset_password_form"
          initialValues={{ remember: true }}
        >
                  <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

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
                // style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Reset
              </Button>
            </div>
          </Form.Item>
        </Form>
      {/* </Modal> */}
    </div>
  );
};

export default ResetPassword;
