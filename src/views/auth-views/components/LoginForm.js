import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Modal, Checkbox } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
} from "store/slices/authSlice";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import {
  autol,
  forgototp,
  forgotpass,
  resetpass,
  userLogin,
} from "../auth-reducers/UserSlice";
import formbg from "assets/form/login/formbg.png";

const ForgotPasswordForm = ({ visible, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      if (step === 1) {
        dispatch(forgotpass(values));
        setStep(2);
      } else if (step === 2) {
        dispatch(forgototp(values));
        setStep(3);
      } else if (step === 3) {
        dispatch(resetpass(values));
        onCancel();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form.Item
            name="login"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
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
            rules={[{ required: true, message: "Please enter OTP" }]}
          >
            <Input
              placeholder="Enter OTP"
              className="rounded-md"
              maxLength={6}
            />
          </Form.Item>
        );
      case 3:
        return (
          <>
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Please enter new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="New Password"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Passwords do not match");
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary" />}
                placeholder="Confirm Password"
                className="rounded-md"
              />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-800">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Enter OTP"
            : "Reset Password"}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      className="rounded-lg"
    >
      <Form form={form} onFinish={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <p className="text-gray-600">
            {step === 1
              ? "Enter your email to receive a verification code"
              : step === 2
              ? "Enter the OTP sent to your email"
              : "Enter your new password"}
          </p>
        </div>

        {renderStepContent()}

        <div className="flex justify-end space-x-4">
          <Button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export const LoginForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    hideAuthMessage,
    showLoading,
    token,
    redirect,
    showMessage,
    allowRedirect = true,
  } = props;

  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);

  useEffect(() => {
    const checkAndAutoLogin = async () => {
      const localemail = localStorage.getItem("email");
      const localtoken = localStorage.getItem("autologintoken");

      if (localemail) {
        try {
          const response = await dispatch(autol({ localemail, localtoken }));

          if (response.meta.requestStatus === "fulfilled") {
            localStorage.removeItem("email");
            localStorage.removeItem("autologintoken");
            navigate("/dashboard/default");
            window.location.reload();
          }
        } catch (error) {
          console.error("Auto login failed:", error);
          localStorage.removeItem("email");
        }
      }
    };

    checkAndAutoLogin();

    const intervalId = setInterval(checkAndAutoLogin, 1000); // Check every second

    setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, navigate]); // Add necessary dependencies

  const onLogin = async (values) => {
    setLoading(true);
    try {
      dispatch(userLogin(values))
        .then((response) => {
          if (response.meta.requestStatus === "fulfilled") {
            navigate("/dashboard/default");
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("Login failed:", error);
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token !== null && allowRedirect) {
      navigate(redirect);
    }
    if (showMessage) {
      const timer = setTimeout(() => hideAuthMessage(), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [allowRedirect, hideAuthMessage, navigate, redirect, showMessage, token]);

  return (
    <div className="flex h-full">
      {/* Left Section with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#4169E1]">
        <div className="absolute inset-0 flex flex-col p-12">
          <div>
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4169E1" />
                </svg>
              </div>
              <span className="text-white text-xl">Woorkroom</span>
            </div>

            {/* Main Content */}
            <div className="mt-16">
              <h1 className="text-white text-[28px] font-normal leading-tight">
                Your place to work
                <br />
                Plan. Create. Control.
              </h1>
            </div>

            {/* Illustration */}
            <div className="mt-12">
              <img
                src={formbg}
                alt="workspace illustration"
                className="w-full max-w-[400px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In to Woorkroom
            </h1>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onLogin}
            layout="vertical"
            className="space-y-5"
          >
            <Form.Item
              name="login"
              label={
                <span className="text-gray-700 font-medium">
                  Email/Phone/Username
                </span>
              }
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "text", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                placeholder="youremail@gmail.com"
                className="h-11 rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-gray-700 font-medium">Password</span>
              }
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                placeholder="••••••••"
                className="h-11 rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500 transition-colors"
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined className="text-gray-400" />
                  ) : (
                    <EyeInvisibleOutlined className="text-gray-400" />
                  )
                }
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Form.Item
                name="remember"
                valuePropName="checked"
                className="mb-0"
              >
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>

              <Button
                type="link"
                onClick={() => setForgotPasswordVisible(true)}
                className="text-blue-600 hover:text-blue-700 font-medium p-0"
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-base flex items-center justify-center group"
            >
              <span>Sign In</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Button>
          </Form>
        </div>
      </div>

      <ForgotPasswordForm
        visible={forgotPasswordVisible}
        onCancel={() => setForgotPasswordVisible(false)}
      />
    </div>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
