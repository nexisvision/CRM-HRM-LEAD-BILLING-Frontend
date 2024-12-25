import React from 'react';
import { Form, Input, Button, DatePicker, Select, message, Row, Col, Checkbox,Radio } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

const { Option } = Select;

const AddCoupon = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Submitted values:', values);
    message.success('Job added successfully!');
    navigate('/app/hrm/jobs');
  };

  return (
    <div className="add-job-form">
      {/* <h2 className="mb-4">Create New Coupon</h2> */}
      <Form
        layout="vertical"
        form={form}
        name="add-job"
        onFinish={onFinish}
      >
              <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter a Name.' }]}>
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="discount" label="Discount" rules={[{ required: true, message: 'Please enter a Discount.' }]}>
              <Input placeholder="Enter Discount" type='number'/>
              <p className='text-xs'>Note: Discount in Percentage</p>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="limit" label="Limit" rules={[{ required: true, message: 'Please enter a Limit.' }]}>
              <Input placeholder="Enter Limit" type='number'/>
            </Form.Item>
          </Col>
          <Col span={24}>
          <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true, message: 'Please select a Coupon Type.' }]}
            >
              <Radio.Group className='flex gap-24 mb-5'>
                <Radio value="percentage" defaultChecked>Manual</Radio>
                <Radio value="fixed">Auto Generate</Radio>
              </Radio.Group>
              <Input placeholder="Enter Code"/>
            </Form.Item>
          </Col>

        </Row>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button type="default" className="mr-2" onClick={() => navigate('/app/hrm/jobs')}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddCoupon;



