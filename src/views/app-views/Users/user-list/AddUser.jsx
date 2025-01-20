import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
} from "antd";
import { AddUserss, GetUsers } from "../UserReducers/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { roledata } from "views/app-views/hrm/RoleAndPermission/RoleAndPermissionReducers/RoleAndPermissionSlice";

const { Option } = Select;


const AddUser = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // Manage password field visibility

  const getalllrole = useSelector((state) => state.role);
  const fnddata = getalllrole.role.data;

  const handleOtpVerify = () => {
    // Handle OTP verification logic here
    console.log("OTP Verified");

    // Close OTP modal after verification
    setShowOtpModal(false);
  };

  const onOpenOtpModal = () => {
    setShowOtpModal(true);
  };
  const onCloseOtpModal = () => {
    setShowOtpModal(false);
  };

  useEffect(() => {
    dispatch(roledata());
  }, []);

  const handleFinish = (values) => {
    dispatch(AddUserss(values));
    dispatch(GetUsers());
    dispatch(GetUsers());
    onClose();
    console.log("Form Values:", values);
    onCreate(values); // Pass form values to the parent component
    form.resetFields();
  };

  const handleToggleChange = (checked) => {
    setShowPassword(checked); // Show or hide password field based on toggle state
    if (!checked) {
      form.setFieldsValue({ password: undefined }); // Clear the password field if toggled off
    }
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
            rules={[{ required: true, message: "Please enter the user name" }]}
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
              {fnddata?.map((tag) => (
                <Option key={tag?.id} value={tag?.id}>
                  {tag?.role_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item
            name="loginEnabled"
            label="Login is enabled"
            valuePropName="checked"
          >
            <Switch onChange={handleToggleChange} />
          </Form.Item>
        </Col> */}
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
      {/* <Form.Item
        name="dob"
        label="Date Of Birth"
        rules={[{ required: true, message: "Please select the date of birth" }]}
      >
        <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
      </Form.Item> */}
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
        onCancel={onCloseOtpModal} // Close OTP modal
        footer={null} // Remove footer buttons
        centered
      >
        <div className="p-4 rounded-lg bg-white">
          <h2 className="text-xl font-semibold mb-4">OTP Page</h2>
          <p>
            An OTP has been sent to your registered email. Please enter the OTP below to verify your account.
          </p>
          <Input
            type="number"
            placeholder="Enter OTP"
            className="mt-4 p-3 border border-gray-300 rounded-md"
            style={{ width: "100%" }}
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

// import React, { useState } from "react";
// import {
//   Modal,
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   Switch,
//   Button,
//   Row,
//   Col,
// } from "antd";

// const { Option } = Select;

// const AddUser = ({ visible, onCancel, onCreate }) => {
//   const [form] = Form.useForm();

//   const handleFinish = (values) => {
//     console.log("Form Values:", values);
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
//           userRole: "accountant",
//           loginEnabled: false,
//         }}
//       >
//       <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[
//                 { required: true, message: "Please enter the user name" },
//               ]}
//             >
//               <Input placeholder="Enter User Name" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: "Please enter the user email" },
//                 { type: "email", message: "Please enter a valid email" },
//               ]}
//             >
//               <Input placeholder="Enter User Email" />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="userRole"
//               label="User Role"
//               rules={[{ required: true, message: "Please select a user role" }]}
//             >
//               <Select placeholder="Select Role">
//                 <Option value="accountant">Accountant</Option>
//                 <Option value="admin">Admin</Option>
//                 <Option value="manager">Manager</Option>
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="loginEnabled"
//               label="Login is enable"
//               valuePropName="checked"
//             >
//               <Switch />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Form.Item
//           name="dob"
//           label="Date Of Birth"
//           rules={[
//             { required: true, message: "Please select the date of birth" },
//           ]}
//         >
//           <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
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

// export default AddUser;
