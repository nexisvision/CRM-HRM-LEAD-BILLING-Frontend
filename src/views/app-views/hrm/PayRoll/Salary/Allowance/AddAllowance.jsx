import React, { Fragment } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const AddAllowance = () => {
  return (
    <div className="allowance">
      {/* <h3>Allowance</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Form.Item label="Allowance Option" name="allowanceOption" rules={[{ required: true }]}>
        <Select placeholder="Select Allowance Option">
          <Option value="transportation">Transportation Allowance</Option>
          <Option value="education">Education or Training Allowance</Option>
          <Option value="health">Health and Wellness Allowance</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item label="Type" name="type" rules={[{ required: true }]}>
      <Select placeholder="Type">
          <Option value="fixed">Fixed</Option>
          <Option value="percentage">Percentage</Option>
          {/* <Option value="health">Health and Wellness Allowance</Option> */}
        </Select>
      </Form.Item>
      <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
      <Input placeholder="Amount" />
        

      </Form.Item>
    </div>
  );
};

export default AddAllowance;
