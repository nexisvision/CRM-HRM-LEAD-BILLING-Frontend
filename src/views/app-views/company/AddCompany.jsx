import React, { useState } from "react";
import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { addClient, ClientData, empdata } from "./CompanyReducers/CompanySlice";

const AddCompany = ({ visible, onClose, onCreate }) => {
  const [form] = Form.useForm();
  const [loginEnabled, setLoginEnabled] = useState(true); 
  const dispatch = useDispatch()



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
 

  const handleSwitchChange = (checked) => {
    setLoginEnabled(checked);
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
          name="loginEnabled"
          label="Login is enabled"
          valuePropName="checked"
        >
          <Switch onChange={handleSwitchChange} />
        </Form.Item>

        {/* Conditionally render password field based on loginEnabled state */}
        {loginEnabled && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: loginEnabled, message: "Please enter the client password" }]}
          >
            <Input.Password placeholder="Enter Client Password" />
          </Form.Item>
        )}

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

export default AddCompany;

