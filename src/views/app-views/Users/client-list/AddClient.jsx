import React, { useState } from "react";
import { Modal, Input, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addClient, ClientData } from "./CompanyReducers/CompanySlice";
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import { env } from "configs/EnvironmentConfig";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)/,
      'Password must contain at least one letter and one number'
    ),
});

const styles = `
  .otp-input-container {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 24px 0;
  }

  .otp-input {
    width: 45px !important;
    height: 45px;
    padding: 0;
    font-size: 20px;
    text-align: center;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
    transition: all 0.3s;
  }

  .otp-input:hover {
    border-color: #60a5fa;
  }

  .otp-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .create-client-form {
    padding: 24px;
    max-width: 400px;
    margin: 0 auto;
  }

  .form-field {
    margin-bottom: 24px;
  }

  .form-field:last-child {
    margin-bottom: 32px;
  }

  .form-field label {
    display: block;
    margin-bottom: 8px;
    color: #374151;
  }

  .form-field input {
    width: 100%;
  }

  .submit-buttons {
    margin-top: 32px;
  }

  .submit-button {
    width: 100%;
    height: 40px;
  }

  .verify-email-modal {
    max-width: 400px;
  }
`;

const AddClient = ({ visible, onClose, onCreate }) => {
  const dispatch = useDispatch();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");

  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";

    // Generate 6 characters
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Ensure at least one number
    const randomNum = Math.floor(Math.random() * 10).toString();
    password = password.slice(0, 7) + randomNum;

    return password;
  };

  const otpapi = async (otp) => {
    try {
      const res = await axios.post(
        `${env.API_ENDPOINT_URL}/auth/verify-signup`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post(
        `${env.API_ENDPOINT_URL}/auth/resend-signup-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error resending OTP:", error);
      throw error;
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await otpapi(otp);
      if (response.success) {
        message.success("Email verified successfully");
        setShowOtpModal(false);
        dispatch(ClientData());
        onCloseOtpModal();
      } else {
        message.error("Invalid OTP");
      }
    } catch (error) {
      message.error("Failed to verify OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp();
      if (response.success) {
        setOtpToken(response?.data?.sessionToken);
        message.success("OTP resent successfully");
        setOtp("");
      } else {
        message.error("Failed to resend OTP");
      }
    } catch (error) {
      message.error("Failed to resend OTP");
    }
  };

  const handleFinish = async (values, { resetForm }) => {
    try {
      const response = await dispatch(addClient(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        setShowOtpModal(true);
        onClose();
        message.success("Client added successfully");
      }
      onCreate(values);
      resetForm();
      dispatch(ClientData());
    } catch (error) {
      message.error("Failed to add client");
      console.error("Error adding client:", error);
    }
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  return (
    <div>
      <style>{styles}</style>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          loginEnabled: true
        }}
        validationSchema={validationSchema}
        onSubmit={handleFinish}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="create-client-form">
            <div className="form-field">
              <label htmlFor="username" className="font-semibold">
                Name <span className="text-red-500">*</span>
              </label>
              <Field name="username">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter client Name"
                    className="mt-1"
                    status={errors.username && touched.username ? "error" : ""}
                  />
                )}
              </Field>
              <ErrorMessage
                name="username"
                component="div"
                className="error-message text-red-500 mt-1 text-sm"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email" className="font-semibold">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Field name="email">
                {({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter Client Email"
                    className="mt-1"
                    status={errors.email && touched.email ? "error" : ""}
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="error-message text-red-500 mt-1 text-sm"
              />
            </div>

            <div className="form-field">
              <label className="font-semibold">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Field
                  name="password"
                  as={Input.Password}
                  placeholder="Password"
                  className="mt-1 w-full"
                />
                <Button
                  className="absolute right-5 top-1/2 border-0 bg-transparent ring-0 hover:bg-transparent -translate-y-1/2 flex items-center z-10"
                  onClick={() => setFieldValue("password", generatePassword())}
                >
                  <ReloadOutlined />
                </Button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1 text-sm"
              />
            </div>

            <div className="submit-buttons">
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
                size="large"
              >
                Create Client
              </Button>
              <Button
                onClick={onClose}
                className="submit-button mt-3"
                size="large"
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Modal
        title={
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
            <p className="text-gray-500 mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </div>
        }
        visible={showOtpModal}
        onCancel={() => setShowOtpModal(false)}
        footer={null}
        centered
        width={400}
        className="verify-email-modal"
      >
        <div className="p-4">
          <div className="otp-input-container">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                className="otp-input"
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => {
                  const newOtp = otp.split('');
                  newOtp[index] = e.target.value;
                  setOtp(newOtp.join(''));

                  // Auto-focus next input
                  if (e.target.value && index < 5) {
                    const nextInput = document.querySelector(`input.otp-input:nth-child(${index + 2})`);
                    if (nextInput) nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    const prevInput = document.querySelector(`input.otp-input:nth-child(${index})`);
                    if (prevInput) prevInput.focus();
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData('text').trim();

                  // Check if pasted content is a 6-digit number
                  if (/^\d{6}$/.test(pastedData)) {
                    setOtp(pastedData);

                    // Focus the last input
                    const lastInput = document.querySelector(`input.otp-input:nth-child(6)`);
                    if (lastInput) lastInput.focus();
                  }
                }}
              />
            ))}
          </div>

          <input
            type="text"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            onPaste={(e) => {
              e.preventDefault();
              const pastedData = e.clipboardData.getData('text').trim();

              // Check if pasted content is a 6-digit number
              if (/^\d{6}$/.test(pastedData)) {
                setOtp(pastedData);

                // Focus the last input
                const lastInput = document.querySelector(`input.otp-input:nth-child(6)`);
                if (lastInput) lastInput.focus();
              }
            }}
          />

          <Button
            type="primary"
            block
            size="large"
            onClick={handleOtpVerify}
            className="mt-6"
          >
            Verify Email
          </Button>

          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-700"
            >
              Resend Code
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddClient;