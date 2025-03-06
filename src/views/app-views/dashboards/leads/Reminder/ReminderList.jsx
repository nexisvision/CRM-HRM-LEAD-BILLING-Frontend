import React, { useState } from 'react';
import { Table, Button, Space, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddReminder from './AddReminder';

const ReminderList = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // Table columns configuration
    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
        },
        {
            title: 'Remind',
            dataIndex: 'remind',
            key: 'remind',
            sorter: (a, b) => a.remind.localeCompare(b.remind),
        },
        {
            title: 'Is Notified',
            dataIndex: 'isNotified',
            key: 'isNotified',
            sorter: (a, b) => a.isNotified.localeCompare(b.isNotified),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                        size="small"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    // Handle edit action
    const handleEdit = (record) => {
        console.log('Edit record:', record);
    };

    // Handle delete action
    const handleDelete = (id) => {
        console.log('Delete record with id:', id);
    };

    return (
        <Card className="w-100">
            <Row gutter={[0, 16]}>
                <Col xs={24} className="text-right mb-4">
                    <AddReminder />
                </Col>
                <Col xs={24}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey="id"
                        pagination={{
                            total: data.length,
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                        }}
                        className="reminder-table"
                        locale={{
                            emptyText: (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No data</p>
                                </div>
                            )
                        }}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default ReminderList;
