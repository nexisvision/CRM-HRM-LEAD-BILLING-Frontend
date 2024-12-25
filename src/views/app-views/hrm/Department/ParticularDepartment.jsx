import React from 'react';
import { Table, Button, Dropdown, Menu, Space, Typography, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ParticularDepartment = () => {
  const data = []; // Empty data for the table

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button type="primary" shape="circle" icon={<EyeOutlined />} onClick={() => handleView(record)} />
      ),
    },
  ];
  const handleView = (record) => {
    console.log('Viewing:', record);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={4}>
          ID : 8 | Logistics
        </Title>
        
      </div>

      {/* Subtitle Section */}
      <Title level={5} style={{ marginBottom: '20px' }}>
        User List
      </Title>

      {/* Actions Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button type="primary">Download CSV</Button>
       
      </div>

      {/* Table Section */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        bordered
        locale={{
          emptyText: <Empty description="No data" />,
        }}
        style={{ overflowX: 'auto' }}
      />
    </div>
  );
};

export default ParticularDepartment;
