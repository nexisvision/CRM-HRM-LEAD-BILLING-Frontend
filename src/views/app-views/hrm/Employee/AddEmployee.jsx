import React, { useState } from "react";
import {
  Modal,
  Input,
  Button,
  DatePicker,
  Select,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { addEmp, empdata } from "./EmployeeReducers/EmployeeSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;

const AddEmployee = ({ onClose, setSub }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");

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
        dispatch(empdata());
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await dispatch(addEmp(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        message.success("Employee added successfully! Please verify OTP.");
        setShowOtpModal(true);
      }
      resetForm();
      onClose();
    } catch (error) {
      message.error("Failed to add employee. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form submission failed:", errorInfo);
    message.error("Please fill out all required fields.");
  };

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    joiningDate: null,
    leaveDate: null,
    employeeId: "",
    department: "",
    designation: "",
    salary: "",
    accountholder: "",
    accountnumber: "",
    bankname: "",
    banklocation: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Please enter a firstName."),
    lastName: Yup.string().required("Please enter a lastName."),
    username: Yup.string().required("Please enter a userName."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/\d/, "Password must have at least one number")
      .required("Password is required"),
    email: Yup.string()
      .email("Please enter a valid email address with @.")
      .required("please enter a email"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "phone number must be 10 digits.")
      .required("Please enter a phone Number."),
    address: Yup.string().required("Please enter a  Address."),
    joiningDate: Yup.date().nullable().required("Joining Date is required."),
    leaveDate: Yup.date().nullable().required("Leave Date is required."),
    employeeId: Yup.string().required("Please enter a  Employee Id."),
    department: Yup.string().required("Please select a Department."),
    designation: Yup.string().required("Please select a Designation."),
    salary: Yup.string().required("Please enter a Salary."),
    accountholder: Yup.string().required("please enter a Accountholder"),
    accountnumber: Yup.string().required("Please enter a Account Number"),
    bankname: Yup.string().required("Please enter a Bank Name"),
    ifsc: Yup.string().required("Please enter a Ifsc"),
    banklocation: Yup.string().required("Please enter a Bank Location"),
  });

  return (
    <div className="add-employee">
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          values,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
        }) => (
          <Form
            className="formik-form"
            onSubmit={handleSubmit}
            onFinishFailed={onFinishFailed}
          >
            <h1 className="text-lg font-bold mb-1">Personal Information</h1>
            <Row gutter={16}>
              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">First Name</label>
                  <Field name="firstName" as={Input} placeholder="John" />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12}>
                <div className="form-item">
                  <label className="font-semibold">Last Name</label>
                  <Field name="lastName" as={Input} placeholder="Doe" />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">User Name</label>
                  <Field name="username" as={Input} placeholder="john_doe" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Password</label>
                  <Field
                    name="password"
                    as={Input}
                    placeholder="Strong Password"
                    type="password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Email</label>
                  <Field
                    name="email"
                    as={Input}
                    placeholder="johndoe@example.com"
                    type="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Phone</label>
                  <Field name="phone" as={Input} placeholder="1234567890" />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Address</label>
                  <Field name="address">
                    {({ field }) => (
                      <ReactQuill
                        {...field}
                        value={values.address}
                        onChange={(value) => setFieldValue("address", value)}
                        onBlur={() => setFieldTouched("address", true)}
                        placeholder="Los Angeles"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold"> Joining Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.joiningDate}
                    onChange={(joiningDate) =>
                      setFieldValue("joiningDate", joiningDate)
                    }
                    onBlur={() => setFieldTouched("joiningDate", true)}
                  />
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold"> Leave Date</label>
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={values.leaveDate}
                    onChange={(leaveDate) =>
                      setFieldValue("leaveDate", leaveDate)
                    }
                    onBlur={() => setFieldTouched("leaveDate", true)}
                  />
                  <ErrorMessage
                    name="leaveDate"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Employee ID</label>
                  <Field name="employeeId" as={Input} placeholder="OE-012" />
                  <ErrorMessage
                    name="employeeId"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Department</label>
                  <Field name="department">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Department"
                        onChange={(value) => setFieldValue("department", value)}
                        value={values.department}
                        onBlur={() => setFieldTouched("department", true)}
                      >
                        <Option value="Manager">Manager</Option>
                        <Option value="Developer">Developer</Option>
                        <Option value="Designer">Designer</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16} className="mt-2">
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Designation</label>
                  <Field name="designation">
                    {({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        placeholder="Select Designation"
                        onChange={(value) =>
                          setFieldValue("designation", value)
                        }
                        value={values.designation}
                        onBlur={() => setFieldTouched("designation", true)}
                      >
                        <Option value="Manager">Manager</Option>
                        <Option value="Developer">Developer</Option>
                        <Option value="Designer">Designer</Option>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Salary</label>
                  <Field
                    name="salary"
                    as={Input}
                    placeholder="$"
                    type="number"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <h1 className="text-lg font-bold mb-3 mt-2">Bank Details</h1>

            <Row gutter={16}>
              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Account Holder Name</label>
                  <Field
                    name="accountholder"
                    as={Input}
                    placeholder="John Doe"
                    type="string"
                  />
                  <ErrorMessage
                    name="accountholder"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Account Number</label>
                  <Field
                    name="accountnumber"
                    as={Input}
                    placeholder="123456789"
                    type="number"
                  />
                  <ErrorMessage
                    name="accountnumber"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Bank Name</label>
                  <Field
                    name="bankname"
                    as={Input}
                    placeholder="Bank Name"
                    type="string"
                  />
                  <ErrorMessage
                    name="bankname"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">IFSC</label>
                  <Field
                    name="ifsc"
                    as={Input}
                    placeholder="IFSC"
                    type="number"
                  />
                  <ErrorMessage
                    name="ifsc"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>

              <Col span={12} className="mt-2">
                <div className="form-item">
                  <label className="font-semibold">Bank Location</label>
                  <Field
                    name="banklocation"
                    as={Input}
                    placeholder="Bank Location"
                    type="string"
                  />
                  <ErrorMessage
                    name="banklocation"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
              </Col>
            </Row>

            <h1 className="text-lg font-bold mb-3">Document</h1>

            <div className="text-right">
              <Button
                type="default"
                className="mr-2"
                onClick={() => onClose()} // Clear all fields
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" onClick={onOpenOtpModal}>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                {/* Submit */}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal
        title="Verify OTP"
        visible={showOtpModal} // Control visibility based on showOtpModal state
        onCancel={onCloseOtpModal} // Close OTP modal
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
            onChange={(e) => setOtp(e.target.value)} // Update OTP in state
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

export default AddEmployee;
