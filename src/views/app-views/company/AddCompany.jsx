import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  Row,
  Col,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addClient, ClientData } from "./CompanyReducers/CompanySlice"; // Adjust this import according to your file structure
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ReloadOutlined } from "@ant-design/icons";
import { env } from "configs/EnvironmentConfig";

const AddCompany = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to generate random password
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

  // Submit handler for OTP
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
        dispatch(ClientData())
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  // Form submit handler
  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      const response = await dispatch(addClient(values)); // Dispatching the addClient action
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        message.success("Company added successfully! Please verify OTP.");
        setShowOtpModal(true);
      }
      resetForm();
      onClose();
    } catch (error) {
      message.error("Failed to add Company. Please try again.");
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  // Initial form values without default password
  const initialValues = {
    username: "",
    password: "", // Empty password initially
    email: "",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Please enter a username."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must have at least one number")
      .required("Password is required"),
    email: Yup.string()
      .email("Please enter a valid email address.")
      .required("Please enter an email"),
  });

  return (
    <div className="add-employee ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="space-y-4">
            <h1 className="border-b-2 border-gray-200 pb-2"></h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item mt-2">
                <label className="font-semibold">Username <span className="text-red-500">*</span></label>
                  <Field
                    name="username"
                    as={Input}
                    placeholder="john_doe"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500"
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
                      <ReloadOutlined />
                    </Button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item mt-2">
                <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="johndoe@example.com"
                    className="mt-1"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </Col>
            </Row>

            <div className="text-right mt-4">
              <Button type="default" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      {/* OTP Modal */}
      <Modal
        title="Verify OTP"
        visible={showOtpModal}
        onCancel={() => setShowOtpModal(false)}
        footer={null}
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
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="mt-4">
          <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={handleOtpVerify}
              >
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddCompany;
