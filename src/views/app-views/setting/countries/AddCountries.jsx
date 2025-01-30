import React from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCountry, getallcountries } from './countriesreducer/countriesSlice';

const AddCountries = ({onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await dispatch(addCountry(values)).unwrap()
        .then(()=>{
          dispatch(getallcountries())
          notification.success({
            message: 'Success',
            description: 'Country added successfully.',
          });
          onClose();
          form.resetFields();
        })
   
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message || 'Failed to add country.',
      });
    }
  };

  return (
    <Card title="Add New Country">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Country Name"
          name="countryName"
          rules={[{ required: true, message: 'Please enter country name' }]}
        >
          <Input placeholder="Enter country name" />
        </Form.Item>

        <Form.Item
          label="Country Code"
          name="countryCode"
          rules={[{ required: true, message: 'Please enter country code' }]}
        >
          <Input placeholder="Enter country code" />
        </Form.Item>

        <Form.Item
          label="Phone Code"
          name="phoneCode"
          rules={[{ required: true, message: 'Please enter phone code' }]}
        >
          <Input placeholder="Enter phone code" />
        </Form.Item>

        <Form.Item className="text-right">
          <Button
            type="default"
            style={{ marginRight: 8 }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddCountries;

