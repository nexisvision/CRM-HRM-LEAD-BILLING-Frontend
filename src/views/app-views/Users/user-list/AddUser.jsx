import React, { useState, useEffect } from "react"; // React and hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Modal, Select, Row, Col, Button, message, Input } from "antd"; // Ant Design components
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AddUserss, GetUsers } from "../UserReducers/UserSlice"; // Custom Redux actions
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice"; // Role data action
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import AddRole from "views/app-views/hrm/RoleAndPermission/Role/AddRole";
import { env } from "configs/EnvironmentConfig";
const { Option } = Select;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  role_id: Yup.string()
    .required('Role is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const initialValues = {
  username: '',
  email: '',
  role_id: '',
  password: ''
};

const styles = `
  .create-user-form {
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

  .verify-email-modal {
    max-width: 400px;
  }
`;

const AddUser = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");


  const loggedInUser = useSelector((state) => state.user?.loggedInUser);

  const allRoles = useSelector((state) => state.role);
  const filterdata = allRoles.role?.data || [];

  const userRole = filterdata.find(role => role.id === loggedInUser?.role_id);

  const filteredRoles = filterdata.filter(role => {
    if (userRole?.role_name === 'client') {
      // If user is client, match roles with user's ID as client_id
      return role.client_id === loggedInUser?.id;
    } else {
      // For other roles, match with user's client_id
      return role.client_id === loggedInUser?.client_id;
    }
  });

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

  useEffect(() => {
    dispatch(roledata());
  }, [dispatch]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await dispatch(AddUserss(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload.data.sessionToken);
        setShowOtpModal(true);
        onClose();
        resetForm();
        dispatch(GetUsers());
      }
    } catch (error) {
      message.error("Failed to add user. Please try again.");
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await axios.post(
        `${env.API_ENDPOINT_URL}/auth/verify-signup`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );

      if (response.data.success) {
        message.success("OTP Verified Successfully");
        setShowOtpModal(false);
        dispatch(GetUsers());
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        `${env.API_ENDPOINT_URL}/auth/resend-signup-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${otpToken}`,
          },
        }
      );
      if (response.data.success) {
        setOtpToken(response.data?.data?.sessionToken);
        message.success("OTP resent successfully");
        setOtp("");
      } else {
        message.error("Failed to resend OTP");
      }
    } catch (error) {
      message.error("Failed to resend OTP");
    }
  };

  return (
    <div>
      <style>{styles}</style>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="create-user-form">
            <div className="form-field">
              <label className="font-semibold">
                Name <span className="text-red-500">*</span>
              </label>
              <Field
                name="username"
                as={Input}
                placeholder="Enter Name"
                className="mt-1"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message text-red-500 mt-1 text-sm"
              />
            </div>

            <div className="form-field">
              <label className="font-semibold">
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                name="email"
                as={Input}
                placeholder="Enter Email"
                className="mt-1"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message text-red-500 mt-1 text-sm"
              />
            </div>

            <div className="form-field">
              <label className="font-semibold">
                User Role <span className="text-red-500">*</span>
              </label>
              <Select
                className="w-full"
                placeholder="Select Role"
                onChange={(value) => setFieldValue('role_id', value)}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Button
                      type="link"
                      block
                      onClick={() => setShowRoleModal(true)}
                    >
                      + Add New Role
                    </Button>
                  </>
                )}
              >
                {filteredRoles.map((tag) => (
                  <Option key={tag?.id} value={tag?.id}>
                    {tag?.role_name}
                  </Option>
                ))}
              </Select>
              {errors.role_id && touched.role_id && (
                <div className="text-red-500 text-sm mt-1">{errors.role_id}</div>
              )}
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
                Create User
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

      {/* OTP Modal */}
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

                  if (/^\d{6}$/.test(pastedData)) {
                    setOtp(pastedData);
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

              if (/^\d{6}$/.test(pastedData)) {
                setOtp(pastedData);
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

      {/* Role Modal */}
      <Modal
        title="Add Role"
        visible={showRoleModal}
        onCancel={() => setShowRoleModal(false)}
        footer={null}
        width={1000}
      >
        <AddRole
          onClose={() => {
            setShowRoleModal(false);
            dispatch(roledata());
          }}
        />
      </Modal>
    </div>
  );
};

export default AddUser;
