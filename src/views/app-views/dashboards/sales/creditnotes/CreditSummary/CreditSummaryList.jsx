import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import userData from '../../../../../../assets/data/user-list.data.json';
import OrderListData from '../../../../../../assets/data/order-list.data.json';
// import ViewEditInvoice from './ViewEditInvoice';
import ViewEditInvoice from '../ViewEditCreditNotes';


function CreditSummaryList() {
    // const [dealStatisticViewData] = useState(DealStatisticViewData);

    const [users, setUsers] = useState(userData);
    const [list, setList] = useState(OrderListData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [userProfileVisible, setUserProfileVisible] = useState(false);
    //   const [customerVisible,setCustomerVisible] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditCreditNotesModalVisible, setIsEditCreditNotesModalVisible] = useState(false);



    // Open Add Job Modal
    const openEditCreditNotesModal = () => {
        setIsEditCreditNotesModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditCreditNotesModal = () => {
        setIsEditCreditNotesModalVisible(false);
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
                        onClick={openEditCreditNotesModal}
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



    const invoiceTable = [
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
            title: 'Description',
            dataIndex: 'description',
            sorter: {
                compare: (a, b) => a.status.length - b.status.length,
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
                    <h4 className='font-medium'>Credit Note Summary</h4>
                </Col>
                <div className="table-responsive mt-2 text-center">
                    <Table
                        columns={invoiceTable}
                        dataSource={list}
                        rowKey="id"
                    />
                </div>
                
                <Modal
                    title=""
                    visible={isEditCreditNotesModalVisible}
                    onCancel={closeEditCreditNotesModal}
                    footer={null}
                    width={500}
                    className='mt-[-70px]'
                >
                    <ViewEditInvoice onClose={closeEditCreditNotesModal} />
                </Modal>
            </Card>
        </>
    )
}

export default CreditSummaryList;
