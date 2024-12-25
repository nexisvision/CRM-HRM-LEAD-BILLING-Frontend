import React from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';

const { Option } = Select;

const AddOvertime = () => {
  return (
    <div className="other-payment">
      {/* <h3>Create Other Payment</h3> */}
      <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />
      <Form layout="vertical">
        <Row gutter={16}>
          {/* Title Field */}
          <Col span={12}>
            <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter a title' }]}>
              <Input placeholder="Overtime Title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Days" name="numberofdays" rules={[{ required: true, message: 'Please enter days' }]}>
            <Input placeholder="Number Of Days" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* Type Field */}
          
          {/* Amount Field */}
          <Col span={12}>
            <Form.Item label="Hours" name="hours" rules={[{ required: true, message: 'Please enter an hour' }]}>
              <Input placeholder="Hours" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please enter an rate' }]}>
              <Input placeholder="Rate" />
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

export default AddOvertime;

