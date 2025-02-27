import React, { useState, useEffect } from "react"; // React and hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Modal, Select, Row, Col, Button, message, Input } from "antd"; // Ant Design components
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AddUserss, GetUsers } from "../UserReducers/UserSlice"; // Custom Redux actions
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice"; // Role data action
import axios from "axios";
import { KeyOutlined, ReloadOutlined, SyncOutlined, ToTopOutlined, PlusOutlined } from "@ant-design/icons";
import AddRole from "views/app-views/hrm/RoleAndPermission/Role/AddRole";

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

const AddUser = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  const [otp, setOtp] = useState("");


  const loggedInUser = useSelector((state) => state.user?.loggedInUser);

  const allRoles = useSelector((state) => state.role);
  const roleData = allRoles.role?.data || [];

  // Find the role of logged in user
  const userRole = roleData.find(role => role.id === loggedInUser?.role_id);

  const filterdata = roleData.filter((role) => role.created_by == loggedInUser?.username);

  // Filter roles based on user's role
  const filteredRoles = roleData.filter(role => {
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
        "http://localhost:5353/api/v1/auth/verify-signup",
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

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, handleSubmit }) => (
          <Form className="space-y-4">
            <div className="border-b border-gray-200 mb-6"></div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="space-y-2">
                <div className="form-item">
                  <label className="font-semibold">Name <span className="text-red-500">*</span></label>
                  <Field
                    name="username"
                    as={Input}
                    placeholder="Enter Name"
                    className="w-full mt-2"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="space-y-2">
                <div className="form-item">
                  <label className="font-semibold">Email <span className="text-red-500">*</span></label>
                  <Field
                    name="email"
                    as={Input}
                    className="w-full mt-2"
                    placeholder="Enter Email"
                    rules={[{ required: true }]}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message text-red-500 my-1"
                  />
                </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Select Role"
                    onChange={(value) => setFieldValue('role_id', value)}
                    status={errors.role_id && touched.role_id ? 'error' : ''}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Button 
                          type="link" 
                          block
                          // icon={<PlusOutlined />}
                          onClick={() => setShowRoleModal(true)}
                        >
                          + Add New Role
                        </Button>
                      </>
                    )}
                  >
                    {filterdata.map((tag) => (
                      <Option key={tag?.id} value={tag?.id}>
                        {tag?.role_name}
                      </Option>
                    ))}
                  </Select>
                  {errors.role_id && touched.role_id && (
                    <div className="text-red-500 text-sm mt-1">{errors.role_id}</div>
                  )}
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

            <div className="flex justify-end gap-2 mt-6">
              <Button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Create
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
        className="rounded-lg"
      >
        <div className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">OTP Verification</h2>
          <p className="text-gray-600">
            An OTP has been sent to your registered email. Please enter the OTP below to verify your account.
          </p>
          <input
            type="number"
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            type="primary"
            onClick={handleOtpVerify}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Verify OTP
          </Button>
        </div>
      </Modal>

      {/* Role Modal */}
      <Modal
        title="Add Role"
        visible={showRoleModal}
        onCancel={() => setShowRoleModal(false)}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <AddRole
          onClose={() => {
            setShowRoleModal(false);
            dispatch(roledata()); // Refresh roles after adding
          }}
        />
      </Modal>
    </div>
  );
};

export default AddUser;
