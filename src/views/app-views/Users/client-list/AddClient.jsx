import React, { useState } from "react";
import { Modal, Input, Switch, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addClient, ClientData } from "./CompanyReducers/CompanySlice";
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import { env } from "configs/EnvironmentConfig";
const AddClient = ({ visible, onClose, onCreate }) => {
  const dispatch = useDispatch();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Please enter the client name'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Please enter the client email'),
    password: Yup.string()
      .required('Please enter the client password')
  });

  const

    generatePassword = () => {
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

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await otpapi(otp);
      if (response.success) {
        message.success("OTP Verified Successfully");
        setShowOtpModal(false);
        dispatch(ClientData()); // Re-fetch the users after success
        onCloseOtpModal();
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleFinish = async (values, { resetForm }) => {
    try {
      const response = await dispatch(addClient(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        message.success("Client added successfully! Please verify OTP.");
        setShowOtpModal(true);
        onClose();
      }
      onCreate(values);
      resetForm();
      dispatch(ClientData());
    } catch (error) {
      message.error("Failed to add client. Please try again.");
    }
  };

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          loginEnabled: true
        }}
        // validationSchema={validationSchema}
        onSubmit={handleFinish}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>


            <Row gutter={16}>
              <Col span={12}>
                <div className="form-group">
                  <label htmlFor="username" className="font-semibold">Name <span className="text-red-500">*</span></label>
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
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}  >
                <div className="form-group">
                  <label htmlFor="email" className="font-semibold">Email Address <span className="text-red-500">*</span></label>
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
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                  <label className="font-semibold">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Field
                      name="password"
                      as={Input.Password}
                      placeholder="Password"
                      className="mt-1 w-full"
                    />
                    <Button
                      className="absolute right-5 top-1/2 border-0 bg-transparent ring-0 hover:none -translate-y-1/2 flex items-center z-10"
                      onClick={() => setFieldValue("password", generatePassword())}
                    >
                      <ReloadOutlined/>
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </Col>
            </Row>

            <Row justify="end" gutter={16} style={{ marginTop: '20px' }}>
              <Col>
                <Button onClick={onClose}>Cancel</Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit">
                  Create
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      <Modal
        title="Verify OTP"
        visible={showOtpModal} // Control visibility based on showOtpModal state
        onCancel={() => setShowOtpModal(false)} // Close OTP modal
        footer={null} // Remove footer buttons
        centered
      >
        <div className="p-4 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">OTP Page</h2>
          <p>
            An OTP has been sent to your registered email. Please enter the OTP
            below to verify your account.
          </p>
          <Input
            type="number"
            placeholder="Enter OTP"
            className="mt-4 p-3 border border-gray-300 rounded-md"
            style={{ width: "100%" }}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-4">
            <Button type="primary" className="w-full" onClick={handleOtpVerify}>
              Verify OTP
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddClient;