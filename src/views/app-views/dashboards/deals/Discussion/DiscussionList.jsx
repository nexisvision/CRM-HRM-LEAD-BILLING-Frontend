import React, { useState } from 'react';
import { Table, Button, Card, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddDiscussion from './AddDiscussion';

const DiscussionList = () => {

  const [isAddDiscussionModalVisible, setIsAddDiscussionModalVisible] = useState(false);

  const [messages, setMessages] = useState([
    { id: 1, message: 'Workdofds', avatar: null },
    { id: 2, message: 'Workdo', avatar: null },
    { id: 3, message: 'Workdo', avatar: null },
  ]);

  const openAddDiscussionModal = () => {
    setIsAddDiscussionModalVisible(true);
  };

  const closeAddDiscussionModal = () => {
    setIsAddDiscussionModalVisible(false);
  };

  const deleteMessage = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  const columns = [

    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteMessage(record.id)}
        />
      ),
    },
  ];

  return (
    <Card
      title={<h3>Discussion</h3>}
      extra={
        <Button type="primary" className="ml-2" onClick={openAddDiscussionModal}>
          <PlusOutlined />
          {/* <span>New</span> */}
        </Button>
      }
      bodyStyle={{ padding: '0' }}
    >


      <Table
        dataSource={messages}
        columns={columns}
        pagination={false}
        rowKey="id"
        style={{ padding: '10px' }}
      />
      <Modal
        title="Add Discussion"
        visible={isAddDiscussionModalVisible}
        onCancel={closeAddDiscussionModal}
        footer={null}
        width={800}
      >
        <AddDiscussion onClose={closeAddDiscussionModal} />
      </Modal>
    </Card>
  );
};

export default DiscussionList;
