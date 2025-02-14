import React, { useState } from "react";
import { Modal, Input, Switch, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { addClient, ClientData } from "./CompanyReducers/CompanySlice";
import axios from "axios";

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

  const otpapi = async (otp) => {
    try {
      const res = await axios.post(
        "http://localhost:5353/api/v1/auth/verify-signup",
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
        message.success("Employee added successfully! Please verify OTP.");
        setShowOtpModal(true);
        onClose();
      }
      onCreate(values);
      resetForm();
      dispatch(ClientData());
    } catch (error) {
      message.error("Failed to add employee. Please try again.");
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
        validationSchema={validationSchema}
        onSubmit={handleFinish}
      >
        {({ errors, touched }) => (
          <Form>
            <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
            
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
                  {errors.username && touched.username && (
                    <div className="error-message">{errors.username}</div>
                  )}
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
                  {errors.email && touched.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
              </Col>

                <Col span={12} className="mt-3">
                <div className="form-group">
                  <label htmlFor="password" className="font-semibold">Password <span className="text-red-500">*</span></label>
                  <Field name="password">
                    {({ field }) => (
                      <Input.Password 
                        {...field} 
                        placeholder="Enter Client Password"
                        className="mt-1"
                        status={errors.password && touched.password ? "error" : ""}
                      />
                    )}
                  </Field>
                  {errors.password && touched.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
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