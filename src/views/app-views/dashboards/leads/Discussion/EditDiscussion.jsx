import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

const EditDiscussion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Assuming you use a route like '/edit-discussion/:id'

  useEffect(() => {
    const fetchDiscussion = async () => {
      const discussionData = {
        message: 'Existing discussion message',
      };
      form.setFieldsValue(discussionData);
    };
    fetchDiscussion();
  }, [id, form]);

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        message.success(`Discussion updated successfully!`);
        navigate('/discussions'); 
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  const handleCancel = () => {
    navigate('/discussions');
  };

  return (
    <div>
      <Form form={form} layout="vertical" name="edit_discussion_form">


        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: 'Please enter a message!' }]}
        >
          <Input.TextArea placeholder="Edit Message" rows={4} />
        </Form.Item>

        <Form.Item>
          <div className="form-buttons text-right">
            <Button
              type="default"
              className="mr-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpdate}
            >
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditDiscussion;
