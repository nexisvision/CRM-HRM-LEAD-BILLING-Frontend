import React, { useState } from "react";
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

const { Option } = Select;

const AddUser = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false); // Manage password field visibility

  const handleFinish = (values) => {
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
            name="name"
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
            name="userRole"
            label="User Role"
            rules={[{ required: true, message: "Please select a user role" }]}
          >
            <Select placeholder="Select Role">
              <Option value="accountant">Accountant</Option>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="loginEnabled"
            label="Login is enabled"
            valuePropName="checked"
          >
            <Switch onChange={handleToggleChange} />
          </Form.Item>
        </Col>
      </Row>
      {showPassword && ( // Conditionally render the password field
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
      )}
      <Form.Item
        name="dob"
        label="Date Of Birth"
        rules={[{ required: true, message: "Please select the date of birth" }]}
      >
        <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <Row justify="end" gutter={16}>
          <Col>
            <Button onClick={onCancel}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
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
