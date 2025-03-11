import React from "react";
import { Button, Select, Form } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddUsers = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();


  return (
    <div>
      <Form form={form} layout="vertical" name="add_user_form">


        <Form.Item
          name="user"
          label="User"
          rules={[{ required: true, message: "Please select a user!" }]}
        >
          <Select placeholder="Select Users">
            <Option value="User 1">User 1</Option>
            <Option value="User 2">User 2</Option>
            <Option value="User 3">User 3</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate("/deals")}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddUsers;
