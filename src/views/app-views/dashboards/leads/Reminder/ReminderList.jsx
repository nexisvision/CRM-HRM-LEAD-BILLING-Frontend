import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddReminder from './AddReminder';
import { getssreinderss, deletessreinderss   } from './reminderReducers/reminderSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ReminderList = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    console.log(data,"data")
    const dispatch = useDispatch()

    useEffect(()=>{
      dispatch(getssreinderss())
    },[dispatch])

    const allreminders = useSelector((state)=>state?.Reminder?.Reminder?.data)
    console.log("allreminders",allreminders)

    useEffect(()=>{
      if(allreminders){
        setData(allreminders) 
      }
    },[allreminders])

    // Table columns configuration
    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
        },
        // {
        //     title: 'Users',
        //     dataIndex: 'users',
        //     key: 'users',
        //     render: (text) => {
        //         try {
        //             const usersObj = JSON.parse(text);
        //             return usersObj.users.join(', ');
        //         } catch (e) {
        //             return '';
        //         }
        //     },
        // },
        {
            title: 'Created By',
            dataIndex: 'created_by',
            key: 'created_by',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/* <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button> */}
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
        dispatch(deletessreinderss(id))
          .then(()=>{
            toast.success("Deleted Successfully")
            dispatch(getssreinderss())
          })
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
