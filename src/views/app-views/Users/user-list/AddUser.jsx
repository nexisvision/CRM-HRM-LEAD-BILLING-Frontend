import React, { useState, useEffect } from "react"; // React and hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Form, Input, Select, Row, Col, Button, Modal, message } from "antd"; // Ant Design components
import { AddUserss, GetUsers } from "../UserReducers/UserSlice"; // Custom Redux actions
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice"; // Role data action
import axios from "axios"; // Axios for HTTP requests

const { Option } = Select;

const AddUser = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const getalllrole = useSelector((state) => state.role);
  const fnddata = getalllrole.role.data;

  const loggeduser = useSelector((state)=>state?.user?.loggedInUser?.username);


  const rolefnd = fnddata?.filter((item)=>item?.created_by === loggeduser)

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
        dispatch(GetUsers()); // Re-fetch the users after success
        onCloseOtpModal();
      } else {
        message.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      message.error("Failed to verify OTP. Please try again.");
    }
  };

  const handleFinish = async (values) => {
    try {
      const response = await dispatch(AddUserss(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        // message.success("Employee added successfully! Please verify OTP.");
        setShowOtpModal(true); // Show OTP modal when user is added
        onClose(); // Close the form modal
      }
      onCreate(values); // Callback after user creation
      form.resetFields();
      dispatch(GetUsers()); // Refetch user list after addition
    } catch (error) {
      // message.error("Failed to add employee. Please try again.");
    }
  };

  const handleToggleChange = (checked) => {
    setShowPassword(checked); // Show or hide password field based on toggle state
    if (!checked) {
      form.setFieldsValue({ password: undefined }); // Clear the password field if toggled off
    }
  };

  useEffect(() => {
    dispatch(roledata());
  }, [dispatch]);

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          userRole: "accountant",
          loginEnabled: false,
        }}
      >
        <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Name"
              rules={[
                { required: true, message: "Please enter the user name" },
              ]}
            >
              <Input placeholder="Enter User Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter the user email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter User Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role_id"
              label="User Role"
              rules={[{ required: true, message: "Please select a user role" }]}
            >
              <Select placeholder="Select Role">
                {rolefnd?.map((tag) => (
                  <Option key={tag?.id} value={tag?.id}>
                    {tag?.role_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter the password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter Password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onClose}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

      {/* OTP Modal */}
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

export default AddUser;
