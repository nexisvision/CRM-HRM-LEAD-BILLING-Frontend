import React from 'react';
import { Form, Input, Select } from 'antd';


const { Option } = Select;


const AddCommission = () => {
  return (
    <div className="commission">
      {/* <h3>Commission</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
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

export default AddCommission;
