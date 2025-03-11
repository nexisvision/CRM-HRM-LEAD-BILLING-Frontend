import React, { useState } from 'react';
import { Card, Table, Menu, Col, message, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import OrderListData from '../../../../../../assets/data/order-list.data.json';

function DebitSummaryList() {
    const [list, setList] = useState(OrderListData);

    const deleteUser = (userId) => {
        setList(list.filter((item) => item.id !== userId));
        message.success({ content: `Deleted list ${userId}`, duration: 2 });
    };

    const dropdownMenus = (elm) => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center">
                    <Button
                        type=""
                        className=""
                        icon={<EditOutlined />}
                        size="small"
                    >
                        <span className="">Edit</span>
                    </Button>
                </Flex>
            </Menu.Item>
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

    const billTable = [
        {
            title: 'Date',
            dataIndex: 'date',
            sorter: {
                compare: (a, b) => a.date.length - b.date.length,
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            sorter: {
                compare: (a, b) => a.amount.length - b.amount.length,
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: {
                compare: (a, b) => a.description.length - b.description.length,
            },
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenus(elm)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <Card bodyStyle={{ padding: '-3px' }}>
                <Col span={24}>
                    <h4 className='font-medium'>Debit Note Summary</h4>
                </Col>
                <div className="table-responsive mt-2 text-center">
                    <Table
                        columns={billTable}
                        dataSource={list}
                        rowKey="id"
                    />
                </div>
            </Card>
        </>
    )
}

export default DebitSummaryList;
