import React, { useState } from 'react';
import { Modal, Button, Select, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';


const { Option } = Select;

const AddUsers = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        message.success(`User "${values.user}" added successfully!`);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Add User
      </Button> */}

      {/* <Modal
        title="Add User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} style={{ background: '#707070', color: 'white' }}>
            Cancel
          </Button>,
          <Button
            key="create"
            type="primary"
            onClick={handleCreate}
            style={{ background: '#39d039', borderColor: '#39d039' }}
          >
            Create
          </Button>,
        ]}
      > */}
        <Form form={form} layout="vertical" name="add_user_form">
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

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
          <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate('/deals')}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form.Item>
        </Form>
      {/* </Modal> */}
    </div>
  );
};

export default AddUsers;
