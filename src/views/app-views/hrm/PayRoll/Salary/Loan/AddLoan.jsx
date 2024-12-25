import React from 'react';
import { Form, Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';


const { Option } = Select;

const AddLoan = () => {
  return (
    <div className="loan">
      
      {/* <h3>Loan</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Form.Item label="Title" name="title" rules={[{ required: true }]}>
      <Input placeholder="Title" />
        

      </Form.Item>
      <Form.Item label="Loan Option" name="loanOption" rules={[{ required: true }]}>
        <Select placeholder="Select Loan Option">
          <Option value="emergency">Emergency Loan</Option>
          <Option value="housing">Housing Loan</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Type" name="type" rules={[{ required: true }]}>
      <Select placeholder="Type">
          <Option value="fixed">Fixed</Option>
          <Option value="percentage">Percentage</Option>
          {/* <Option value="health">Health and Wellness Allowance</Option> */}
        </Select>
      </Form.Item>
      <Form.Item label="Loan Amount" name="loanamount" rules={[{ required: true }]}>
      <Input placeholder="Loan Amount" />
        

      </Form.Item>
      <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
      <TextArea placeholder="Reason" />
        

      </Form.Item>
    </div>
  );
};

export default AddLoan;
