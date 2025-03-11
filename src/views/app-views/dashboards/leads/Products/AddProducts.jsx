import React from 'react';
import { Button, Select, Form } from 'antd';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const AddProducts = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();


  return (
    <div>
      <Form form={form} layout="vertical" name="add_user_form">


        <Form.Item
          name="product"
          label="Prosduct"
          rules={[{ required: true, message: 'Please select a product!' }]}
        >
          <Select placeholder="Select Products">
            <Option value="Product 1">Product 1</Option>
            <Option value="Product 2">Product 2</Option>
            <Option value="Product 3">Product 3</Option>
          </Select>

        </Form.Item>
        <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate('/deals')}
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

export default AddProducts;
