import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddDiscussion = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        message.success(`Discussion added successfully!`);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <div>
      <Form form={form} layout="vertical" name="add_discussion_form">


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
