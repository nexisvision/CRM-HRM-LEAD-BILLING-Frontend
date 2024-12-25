import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Form, message } from 'antd';

const { Option } = Select;

const EditProducts = ({ userData, onUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        message.success(`User "${values.user}" updated successfully!`);
        setIsModalVisible(false);
        form.resetFields();
        onUpdate(values); // Pass updated data back to parent component
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  useEffect(() => {
    if (isModalVisible && userData) {
      form.setFieldsValue({ user: userData.user });
    }
  }, [isModalVisible, userData, form]);

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Edit User
      </Button>

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ background: '#707070', color: 'white' }}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdate}
            style={{ background: '#39d039', borderColor: '#39d039' }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="edit_user_form">
          <Form.Item
            name="user"
            label="User"
            rules={[{ required: true, message: 'Please select a user!' }]}
          >
            <Select placeholder="Select Users">
              <Option value="User 1">User 1</Option>
              <Option value="User 2">User 2</Option>
              <Option value="User 3">User 3</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditProducts;
