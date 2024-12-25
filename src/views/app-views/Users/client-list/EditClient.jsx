import React from "react";
import { Modal, Form, Input, Switch, Button, Row, Col } from "antd";

const EditClient = ({ visible, onCancel, onUpdate, clientData }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Updated Client Data:", values);
    onUpdate(values); // Pass updated client data to the parent component
    form.resetFields();
  };

  return (
    
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          ...clientData, // Populate form with existing client data
        }}
      >
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

        <Form.Item
          name="name"
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

      

       

        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

  );
};

export default EditClient;
