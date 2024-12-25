import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddCalls from './AddCalls';
import EditCalls from './EditCalls';

const CallsList = () => {
  const [calls, setCalls] = useState([
    { id: 1, subject: 'dasfsd', callType: 'Inbound', duration: '18:28:40', user: '-' },
  ]);
  const [isAddCallModalVisible, setIsAddCallModalVisible] = useState(false);
  const [isEditCallModalVisible, setIsEditCallModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const openAddCallModal = () => {
    setIsAddCallModalVisible(true);
  };

  const closeAddCallModal = () => {
    setIsAddCallModalVisible(false);
  };

  const openEditCallModal = () => {
    setIsEditCallModalVisible(true);
  };

  const closeEditCallModal = () => {
    setIsEditCallModalVisible(false);
  };

  const deleteCall = (callId) => {
    setCalls(calls.filter((call) => call.id !== callId));
    message.success('Call deleted successfully.');
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const filteredCalls = calls.filter(
    (call) =>
      call.subject.toLowerCase().includes(searchValue.toLowerCase()) ||
      call.callType.toLowerCase().includes(searchValue.toLowerCase())
  );

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Call Type',
      dataIndex: 'callType',
      key: 'callType',
      render: (callType) => <Tag color={callType === 'Inbound' ? 'blue' : 'green'}>{callType}</Tag>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            icon={<EditOutlined />}
            // type="link"
            onClick={openEditCallModal}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            type="link"
            danger
            onClick={() => deleteCall(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <Card title="Calls" extra={<Button type='primary' icon={<PlusOutlined />} onClick={openAddCallModal}></Button>}>
              <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

      <Input
        placeholder="Search"
        prefix={<SearchOutlined />}
        onChange={onSearch}
        style={{ marginBottom: 16 }}
      />

      <Table columns={columns} dataSource={filteredCalls} rowKey="id" pagination={false} />

      <Modal
        title="Add Call"
        visible={isAddCallModalVisible}
        onCancel={closeAddCallModal}
        footer={null}
      >
        {/* <p>Add Call Form</p> */}

        <AddCalls onClose={closeAddCallModal} />
      </Modal>

      <Modal
        title="Edit Call"
        visible={isEditCallModalVisible}
        onCancel={closeEditCallModal}
        footer={null}
      >
        {/* <p>Edit Call Form</p> */}


        <EditCalls onClose={closeEditCallModal} />
      </Modal>
    </Card>
  );
};

export default CallsList;
