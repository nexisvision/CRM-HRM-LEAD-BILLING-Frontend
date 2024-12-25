import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import userData from '../../../../../../assets/data/user-list.data.json';
import OrderListData from '../../../../../../assets/data/order-list.data.json';
// import ViewEditInvoice from './ViewEditInvoice';
// import ViewEditInvoice from '../ViewEditInvoice';


function DebitSummaryList() {
    // const [dealStatisticViewData] = useState(DealStatisticViewData);

    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [userProfileVisible, setUserProfileVisible] = useState(false);
    //   const [customerVisible,setCustomerVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] = useState(false);



    // Open Add Job Modal
    const openEditInvoiceModal = () => {
        setIsEditInvoiceModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditInvoiceModal = () => {
        setIsEditInvoiceModalVisible(false);
    };


    // Delete user
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
                        onClick={openEditInvoiceModal}
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
                
                {/* <Modal
                    title=""
                    visible={isEditInvoiceModalVisible}
                    onCancel={closeEditInvoiceModal}
                    footer={null}
                    width={500}
                    className='mt-[-70px]'
                >
                    <ViewEditInvoice onClose={closeEditInvoiceModal} />
                </Modal> */}
            </Card>
        </>
    )
}

export default DebitSummaryList;
