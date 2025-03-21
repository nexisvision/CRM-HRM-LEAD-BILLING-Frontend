import React, { useState } from 'react';
import { Table, Button, Avatar, Card, Modal } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddSources from './AddSources';

const SourcesList = () => {

  const [isAddSourcesModalVisible, setIsAddSourcesModalVisible] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'Workdo', avatar: null },
    { id: 2, name: 'Workdo', avatar: null },
    { id: 3, name: 'Workdo', avatar: null },
  ]);

  const openAddSourcesModal = () => {
    setIsAddSourcesModalVisible(true);
  };

  const closeAddSourcesModal = () => {
    setIsAddSourcesModalVisible(false);
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar
            style={{ backgroundColor: '#c5f1d4', border: '2px solid #39d039' }}
            icon={<img alt="avatar" src="" />}
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteUser(record.id)}
        />
      ),
    },
  ];

  return (
    <Card
      title={<h3>Sources</h3>}
      extra={
        <Button type="primary" className="ml-2" onClick={openAddSourcesModal}>
          <PlusOutlined />
          {/* <span>New</span> */}
        </Button>
      }
      bodyStyle={{ padding: '0' }}
    >


      <Table
        dataSource={users}
        columns={columns}
        pagination={false}
        rowKey="id"
        style={{ padding: '10px' }}
      />
      <Modal
        title="Add Sources"
        visible={isAddSourcesModalVisible}
        onCancel={closeAddSourcesModal}
        footer={null}
        width={800}
      >
        <AddSources onClose={closeAddSourcesModal} />
      </Modal>
    </Card>
  );
};

export default SourcesList;
