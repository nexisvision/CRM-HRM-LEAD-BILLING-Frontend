import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';



function ReceiptSummaryList() {
    // const [dealStatisticViewData] = useState(DealStatisticViewData);

    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [userProfileVisible, setUserProfileVisible] = useState(false);
    //   const [customerVisible,setCustomerVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);



    // Delete user
    const deleteUser = (userId) => {
        setUsers(users.filter((item) => item.id !== userId));
        message.success({ content: `Deleted user ${userId}`, duration: 2 });
    };

    

    // Close user profile
    const closeUserProfile = () => {
        setSelectedUser(null);
        setUserProfileVisible(false);
    };

    const dropdownMenu = (elm) => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center">
                    <Button
                        type=""
                        className=""
                        icon={<DeleteOutlined />}
                        onClick={() => deleteUser(elm.id)}
                        size="small"
                    >
                        {/* <span className="">Delete</span> */}
                    </Button>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const dropdownMenus = (elm) => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center">
                    <Button
                        type=""
                        className=""
                        icon={<DeleteOutlined />}
                        onClick={() => deleteUser(elm.id)}
                        size="small"
                    >
                        <span className="">Delete</span>
                    </Button>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const tableColumns = [
        {
            title: 'Payment Receipt',
            dataIndex: 'paymentreceipt',
            sorter: {
                compare: (a, b) => a.branch.length - b.branch.length,
            },
        },
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Reference',
            dataIndex: 'Reference',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Receipt',
            dataIndex: 'receipt',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'OrderId',
            dataIndex: 'orderId',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
            },
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            ),
        },
    ];


    return (
        <>
            <Card bodyStyle={{ padding: '-3px' }}>
                <Col span={24}>
                    <h4 className='font-medium'>Receipt Summary</h4>
                </Col>
                <div className="table-responsive mt-2">
                    <Table
                        columns={tableColumns}
                        dataSource={users}
                        rowKey="id"
                        scroll={{ x: 1200 }}
                    />
                </div>
               
            </Card>

        </>
    )
}

export default ReceiptSummaryList;
