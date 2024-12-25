import React, { useState } from 'react';
import { Table, Button, Avatar, Card,Modal } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddProducts from './AddProducts';

const ProductsList = () => {

  const [isAddProductsModalVisible, setIsAddProductsModalVisible] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'Workdofds', price:'23', avatar: null },
    { id: 2, name: 'Workdo', price:'233', avatar: null },
    { id: 3, name: 'Workdo', price:'234343', avatar: null },
  ]);

  const openAddProductsModal = () => {
    setIsAddProductsModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddProductsModal = () => {
    setIsAddProductsModalVisible(false);
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
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
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
      title={<h3>Products</h3>}
      extra={
        <Button type="primary" className="ml-2" onClick={openAddProductsModal}>
            <PlusOutlined />
            {/* <span>New</span> */}
          </Button>
      }
      bodyStyle={{ padding: '0' }}
    >
              <hr style={{ margin: '20px', border: '1px solid #e8e8e8' }} />

      <Table
        dataSource={users}
        columns={columns}
        pagination={false}
        rowKey="id"
        style={{ padding: '10px' }}
      />
       <Modal
        title="Add Products"
        visible={isAddProductsModalVisible}
        onCancel={closeAddProductsModal}
        footer={null}
        width={800}
      >
        <AddProducts onClose={closeAddProductsModal} />
      </Modal>
    </Card>
  );
};

export default ProductsList;
