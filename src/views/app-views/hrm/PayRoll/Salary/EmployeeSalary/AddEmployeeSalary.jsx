import React from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const AddEmployeeSalary = () => {
  return (
    <div className="employee-salary">
      {/* <h3>Employee Salary</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Form.Item label="Payslip Type" name="payslipType" rules={[{ required: true }]}>
        <Select placeholder="Select Payslip Type">
          <Option value="hourly">Hourly Payslip</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Salary" name="salary" rules={[{ required: true }]}>
        <Input placeholder="Enter Salary" />
      </Form.Item>
      <Form.Item label="Account" name="account" rules={[{ required: true }]}>
        <Input placeholder="Enter Account" />
      </Form.Item>
    </div>
  );
};

export default AddEmployeeSalary;
