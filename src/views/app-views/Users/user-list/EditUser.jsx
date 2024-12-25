import React from "react";
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
import dayjs from "dayjs";

const { Option } = Select;

const EditUser = ({ visible, onCancel, onUpdate, userData }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    console.log("Updated Values:", values);
    onUpdate(values); // Pass updated values to the parent component
    form.resetFields();
  };

  // Set initial values if userData is available
  const initialValues = {
    name: userData?.name || "",
    email: userData?.email || "",
    userRole: userData?.userRole || "accountant",
    loginEnabled: userData?.loginEnabled || false,
    dob: userData?.dob ? dayjs(userData.dob, "DD-MM-YYYY") : null,
  };

  return (
    // <Modal
    //   title="Edit User"
    //   visible={visible}
    //   onCancel={onCancel}
    //   footer={null}
    //   centered
    //   destroyOnClose
    // >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
      >
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
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
         
        </Row>
        <Form.Item
          name="dob"
          label="Date Of Birth"
          rules={[
            { required: true, message: "Please select the date of birth" },
          ]}
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
                Update
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    // </Modal>
  );
};

export default EditUser;
