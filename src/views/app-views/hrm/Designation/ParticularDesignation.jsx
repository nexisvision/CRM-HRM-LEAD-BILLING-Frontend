import React from 'react';
import { Table, Button, Dropdown, Menu, Space, Typography } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ParticularDesignation = () => {
  const data = [
    {
      id: 5,
      employeeName: 'Boris Palmer',
    },
    {
      id: 4,
      employeeName: 'Test terst',
    },
    {
      id: 2,
      employeeName: 'SALMA HASSAN',
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
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


  const menu = (
    <Menu>
      <Menu.Item key="1">Column 1</Menu.Item>
      <Menu.Item key="2">Column 2</Menu.Item>
      <Menu.Item key="3">Column 3</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={4}>
          ID : 1 | CEO
        </Title>
       
      </div>
      <Title level={5} style={{ marginBottom: '20px' }}>
        Staffs Information
      </Title>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <Button type="primary">Download CSV</Button>
       
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        bordered
        style={{ overflowX: 'auto' }}
      />
    </div>
  );
};

export default ParticularDesignation;
