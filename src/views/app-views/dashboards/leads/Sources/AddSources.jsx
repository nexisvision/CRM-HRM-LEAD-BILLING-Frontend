import React, { useState } from 'react';
import { Modal, Button, Checkbox, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddSources = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const navigate = useNavigate();

  const sources = ['Websites', 'Facebook', 'Naukri.com', 'Phone', 'LinkedIn'];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedSources([]);
  };

  const handleCreate = () => {
    message.success(`Selected Sources: ${selectedSources.join(', ')}`);
    setIsModalVisible(false);
  };

  const onChange = (checkedValues) => {
    setSelectedSources(checkedValues);
  };

  return (
    <div>
      {/* <Button
        type="primary"
        style={{ background: '#39d039', borderColor: '#39d039' }}
        onClick={showModal}
      >
        Add Source
      </Button>

      <Modal
        title="Add Source"
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
        <Form layout="vertical">
        <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

          <Checkbox.Group
            options={sources}
            onChange={onChange}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          />
        </Form>

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
      {/* </Modal> */}
    </div>
  );
};

export default AddSources;

