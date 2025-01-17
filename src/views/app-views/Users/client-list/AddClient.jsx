import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addClient, ClientData, empdata } from "./CompanyReducers/CompanySlice";

const AddClient = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleFinish = async (values) => {
    try {
      // Dispatch the addClient action and wait for it to complete
      await dispatch(addClient(values)).unwrap();

      console.log("Client Data Added Successfully:", values);

      onClose();

      // Fetch the latest client data
      await dispatch(ClientData());

      // Call the onCreate callback (if any)
      onCreate(values);

      // Reset the form fields
      form.resetFields();

      // Close the modal or form
    } catch (error) {
      console.error("Error Adding Client:", error);
    }
  };

  

  return (
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
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
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
