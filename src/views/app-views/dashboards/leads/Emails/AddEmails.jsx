import React, { useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddEmails = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [description, setDescription] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setDescription('');
  };

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        if (!description.trim()) {
          message.error('Please enter the email content!');
          return;
        }

        const emailData = {
          mailTo: values.mailTo,
          subject: values.subject,
          description,
        };

        message.success(`Email sent to "${values.mailTo}" successfully!`);
        setIsModalVisible(false);
        form.resetFields();
        setDescription('');
      })
      .catch((error) => {
        console.error('Validation failed:', error);
      });
  };

  return (
    <div>
      {/* <Button type="primary" onClick={showModal}>
        Add Email
      </Button>

      <Modal
        title="Add Email"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      > */}
        <Form form={form} layout="vertical" name="add_email_form"> 
        

          <Form.Item
            name="mailTo"
            label="Mail To"
            rules={[
              { required: true, message: 'Please enter an email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter a subject!' }]}
          >
            <Input placeholder="Enter Subject" />
          </Form.Item>

          <Form.Item
            label="Description"
            rules={[{ required: true, message: 'Please enter the email content!' }]}
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              placeholder="Write your email content here..."
              style={{ height: '200px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', marginTop:'30px', justifyContent: 'flex-end', gap: '10px' }}>
              <Button key="cancel" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                key="create"
                type="primary"
                onClick={handleCreate}
              >
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
    {/* //   </Modal> */}
    </div>
  );
};

export default AddEmails;

