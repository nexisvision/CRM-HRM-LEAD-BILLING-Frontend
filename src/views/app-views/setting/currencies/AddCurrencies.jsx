import React from "react";
import { Card, Form, Input, Button, notification } from "antd";
import { useDispatch } from 'react-redux';
// import { addCurrency, getallcurrencies } from './currenciesreducer/currenciesSlice';
import { addcurren, getcurren } from "./currenciesSlice/currenciesSlice";

const AddCurrencies = ({ onClose }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await dispatch(addcurren(values)).unwrap()
        .then(() => {
          dispatch(getcurren());
          // notification.success({
          //   message: 'Success',
          //   description: 'Currency added successfully.',
          // });
          onClose();
          form.resetFields();
        });
    } catch (error) {
      // notification.error({
      //   message: 'Error',
      //   description: error.message || 'Failed to add currency.',
      // });
    }
  };

  return (
    <div>
    <hr style={{ marginBottom: "15px", border: "1px solid #E8E8E8" }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Currency Name"
          name="currencyName"
          rules={[{ required: true, message: 'Please enter currency name' }]}
        >
          <Input placeholder="Enter currency name" />
        </Form.Item>

        <Form.Item
          label="Currency Icon"
          name="currencyIcon"
          rules={[{ required: true, message: 'Please enter currency icon' }]}
        >
          <Input placeholder="Enter currency icon" />
        </Form.Item>

        <Form.Item
          label="Currency Code"
          name="currencyCode"
          rules={[{ required: true, message: 'Please enter currency code' }]}
        >
          <Input placeholder="Enter currency code" />
        </Form.Item>

        <Form.Item className="text-right">
          <Button
            type="default"
            style={{ marginRight: 8 }}
            onClick={onClose}
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
    </div>
  );
};


export default AddCurrencies;
