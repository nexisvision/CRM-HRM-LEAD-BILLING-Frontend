import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { addClient, ClientData, empdata } from "./CompanyReducers/CompanySlice";
import axios from "axios";

const AddClient = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
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
        dispatch(ClientData()); // Re-fetch the users after success
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
      const response = await dispatch(addClient(values));
      if (response.payload?.data?.sessionToken) {
        setOtpToken(response.payload?.data?.sessionToken);
        message.success("Employee added successfully! Please verify OTP.");
        setShowOtpModal(true); // Show OTP modal when user is added
        onClose(); // Close the form modal
      }
      onCreate(values); // Callback after user creation
      form.resetFields();
      dispatch(ClientData()); // Refetch user list after addition
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          loginEnabled: true,
        }}
      >
        <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

        <Form.Item
          name="username"
          label="Name"
          rules={[{ required: true, message: "Please enter the client name" }]}
        >
          <Input placeholder="Enter client Name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-Mail Address"
          rules={[
            { required: true, message: "Please enter the client email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder="Enter Client Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              message: "Please enter the client password",
            },
          ]}
        >
          <Input.Password placeholder="Enter Client Password" />
        </Form.Item>

        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onClose}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" onClick={onOpenOtpModal}>
                Create
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
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

// import React, { useState } from "react";
// import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";

// const AddClient = ({ visible, onCancel, onCreate }) => {
//   const [form] = Form.useForm();
//   const [loginEnabled, setLoginEnabled] = useState(true); // State for tracking the Switch

//   const handleFinish = (values) => {
//     console.log("Client Data:", values);
//     onCreate(values); // Pass form values to the parent component
//     form.resetFields();
//   };

//   const handleSwitchChange = (checked) => {
//     setLoginEnabled(checked); // Update the loginEnabled state based on Switch toggle
//   };

//   return (
//     <Form
//       form={form}
//       layout="vertical"
//       onFinish={handleFinish}
//       initialValues={{
//         loginEnabled: true,
//       }}
//     >
//       <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

//       <Form.Item
//         name="name"
//         label="Name"
//         rules={[{ required: true, message: "Please enter the client name" }]}
//       >
//         <Input placeholder="Enter client Name" />
//       </Form.Item>

//       <Form.Item
//         name="email"
//         label="E-Mail Address"
//         rules={[
//           { required: true, message: "Please enter the client email" },
//           { type: "email", message: "Please enter a valid email address" },
//         ]}
//       >
//         <Input placeholder="Enter Client Email" />
//       </Form.Item>

//       <Form.Item
//         name="loginEnabled"
//         label="Login is enabled"
//         valuePropName="checked"
//       >
//         <Switch onChange={handleSwitchChange} />
//       </Form.Item>

//       {/* Conditionally render password field based on loginEnabled state */}
//       {loginEnabled && (
//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[
//             {
//               required: loginEnabled,
//               message: "Please enter the client password",
//             },
//           ]}
//         >
//           <Input.Password placeholder="Enter Client Password" />
//         </Form.Item>
//       )}

//       <Form.Item>
//         <Row justify="end" gutter={16}>
//           <Col>
//             <Button onClick={onCancel}>Cancel</Button>
//           </Col>
//           <Col>
//             <Button type="primary" htmlType="submit">
//               Create
//             </Button>
//           </Col>
//         </Row>
//       </Form.Item>
//     </Form>
//   );
// };

// export default AddClient;

// import React from "react";
// import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";

// const AddClient = ({ visible, onCancel, onCreate }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     console.log("Client Data:", values);
//     onCreate(values); // Pass form values to the parent component
//     form.resetFields();
//   };

//   return (
//     // <Modal
//     //   title="Create"
//     //   visible={visible}
//     //   onCancel={onCancel}
//     //   footer={null}
//     //   centered
//     //   destroyOnClose
//     // >
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleFinish}
//         initialValues={{
//           loginEnabled: true,
//         }}
//       >
//         <Form.Item
//           name="name"
//           label="Name"
//           rules={[
//             { required: true, message: "Please enter the client name" },
//           ]}
//         >
//           <Input placeholder="Enter client Name" />
//         </Form.Item>

//         <Form.Item
//           name="email"
//           label="E-Mail Address"
//           rules={[
//             { required: true, message: "Please enter the client email" },
//             { type: "email", message: "Please enter a valid email address" },
//           ]}
//         >
//           <Input placeholder="Enter Client Email" />
//         </Form.Item>

//         <Form.Item
//           name="loginEnabled"
//           label="Login is enable"
//           valuePropName="checked"
//         >
//           <Switch />
//         </Form.Item>

//         <Form.Item
//           name="password"
//           label="Password"
//           rules={[
//             { required: true, message: "Please enter the client password" },
//           ]}
//         >
//           <Input.Password placeholder="Enter Client Password" />
//         </Form.Item>

//         <Form.Item>
//           <Row justify="end" gutter={16}>
//             <Col>
//               <Button onClick={onCancel}>Cancel</Button>
//             </Col>
//             <Col>
//               <Button type="primary" htmlType="submit">
//                 Create
//               </Button>
//             </Col>
//           </Row>
//         </Form.Item>
//       </Form>
//     // </Modal>
//   );
// };

// export default AddClient;
