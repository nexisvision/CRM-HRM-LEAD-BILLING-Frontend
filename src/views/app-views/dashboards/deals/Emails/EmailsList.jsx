import React, { useState } from 'react';
import { Card, Button, Avatar, List, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AddEmails from './AddEmails';

const EmailsList = () => {

  const [isAddEmailsModalVisible, setIsAddEmailsModalVisible] = useState(false);


  const openAddEmailsModal = () => {
    setIsAddEmailsModalVisible(true);
  };

  const closeAddEmailsModal = () => {
    setIsAddEmailsModalVisible(false);
  };
  const emailData = [
    {
      id: 1,
      name: 'sddsfsnfs',
      email: 'dsf@gmail.com',
      time: '2 seconds ago',
    },
  ];

  return (
    <Card
      title="Emails"
      extra={
        <Button
          type="primary"
          onClick={openAddEmailsModal}
          icon={<PlusOutlined />}
        />
      }
      style={{ borderRadius: '10px', overflow: 'hidden' }}
    >


      <List
        itemLayout="horizontal"
        dataSource={emailData}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  style={{
                    backgroundColor: '#e6f7e6',
                    color: '#39d039',
                    border: '1px solid #39d039',
                  }}
                  size="large"
                  icon={<Avatar src={null} />}
                />
              }
              title={
                <div style={{ fontWeight: 'bold', color: '#000' }}>{item.name}</div>
              }
              description={item.email}
            />
            <div style={{ color: '#707070' }}>{item.time}</div>
          </List.Item>
        )}
      />
      <Modal
        title="Add Emails"
        visible={isAddEmailsModalVisible}
        onCancel={closeAddEmailsModal}
        footer={null}
        width={800}
      >
        <AddEmails onClose={closeAddEmailsModal} />
      </Modal>
    </Card>
  );
};

export default EmailsList;
