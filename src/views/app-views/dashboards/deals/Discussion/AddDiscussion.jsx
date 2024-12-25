import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddDiscussion = () => {
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
        message.success(`Discussion added successfully!`);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <div>
      <Form form={form} layout="vertical" name="add_discussion_form">
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: 'Please enter a message!' }]}
        >
          <Input.TextArea placeholder="Enter Message" rows={4} />
        </Form.Item>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={() => navigate('/discussions')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleCreate}
            >
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddDiscussion;
