import React, { useState } from 'react';
import { Table, Button, Avatar, Card,Modal } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddUsers from './AddUsers';

const UsersList = () => {

  const [isAddUsersModalVisible, setIsAddUsersModalVisible] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'Workdo', avatar: null },
    { id: 2, name: 'Workdo', avatar: null },
    { id: 3, name: 'Workdo', avatar: null },
  ]);

  const openAddUsersModal = () => {
    setIsAddUsersModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddUsersModal = () => {
    setIsAddUsersModalVisible(false);
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
        //   style={{ background: '#ffefef', color: '#ff4d4f', borderRadius: '5px' }}
          onClick={() => deleteUser(record.id)}
        />
      ),
    },
  ];

  return (
    <Card
      title={<h3>Users</h3>}
      extra={
        <Button type="primary" className="ml-2" onClick={openAddUsersModal}>
            <PlusOutlined />
            {/* <span>New</span> */}
          </Button>
      }
      bodyStyle={{ padding: '0' }}
    >
              <hr style={{ margin:'20px', border: '1px solid #e8e8e8' }} />

      <Table
        dataSource={users}
        columns={columns}
        pagination={false}
        rowKey="id"
        style={{ padding: '10px' }}
      />
       <Modal
        title="Add Users"
        visible={isAddUsersModalVisible}
        onCancel={closeAddUsersModal}
        footer={null}
        width={800}
      >
        <AddUsers onClose={closeAddUsersModal} />
      </Modal>
    </Card>
  );
};

export default UsersList;
