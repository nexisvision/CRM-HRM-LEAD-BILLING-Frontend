import React from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const AddSaturationDeduction = () => {
  return (
    <div className="other-payment">
      {/* <h3>Create Other Payment</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Form layout="vertical">
        <Row gutter={16}>
          {/* Title Field */}
          <Col span={12}>
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
              <Input placeholder="Enter Title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Deduction option" name="Deductionoption" rules={[{ required: true, message: 'Please select a type' }]}>
              <Select placeholder="Select option">
                <Option value="fixed">Fixed</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* Type Field */}
          <Col span={12}>
            <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Please select a type' }]}>
              <Select placeholder="Select Type">
                <Option value="fixed">Fixed</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* Amount Field */}
          <Col span={12}>
            <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter an amount' }]}>
              <Input placeholder="Enter Amount" />
            </Form.Item>
          </Col>
        </Row>
        {/* Action Buttons */}
        <Row justify="end" gutter={16}>
          <Col>
            <Button type="default">Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">Create</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddSaturationDeduction;

