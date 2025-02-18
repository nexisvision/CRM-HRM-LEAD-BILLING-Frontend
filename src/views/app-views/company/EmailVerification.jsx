import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

const EmailVerification = ({ visible, onCancel, companyId }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      if (step === 1) {
        // Send verification email
        // await dispatch(sendVerificationEmail(values.email));
        message.success('Verification code sent to your email');
        setStep(2);
      } else if (step === 2) {
        // Verify OTP
        // await dispatch(verifyOTP(values.otp));
        message.success('Email verified successfully');
        onCancel(); // Close modal after successful verification
      }
    } catch (error) {
      message.error('An error occurred. Please try again.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setStep(1);
    if (onCancel) {
      onCancel();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="text-primary" />}
              placeholder="Email"
              className="rounded-md"
            />
          </Form.Item>
        );
      case 2:
        return (
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter verification code' },
              {
                pattern: /^[0-9]{6}$/,
                message: 'Please enter 6 digits only'
              }
            ]}
          >
            <Input 
              placeholder="Enter verification code"
              className="rounded-md"
              maxLength={6}
              type="number"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={step === 1 ? "Email Verification" : "Enter Verification Code"}
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="close" onClick={handleCancel}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={form.submit}>
          {step === 1 ? 'Send Verification Code' : 'Verify'}
        </Button>
      ]}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        {renderStepContent()}
      </Form>
    </Modal>
  );
};

export default EmailVerification;
