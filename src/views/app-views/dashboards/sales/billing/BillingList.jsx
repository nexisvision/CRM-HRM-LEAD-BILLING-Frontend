import React, { Component } from 'react'
import { useState } from 'react'
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import {
    AnnualStatisticData,
} from '../../../dashboards/default/DefaultDashboardData';
import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Tag } from 'antd';
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from 'react-number-format';
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
// import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import AddBilling from './AddBilling';
import EditBilling from './EditBilling';
import ViewBilling from './ViewBilling';
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';



const { Column } = Table;

const { Option } = Select

const getPaymentStatus = status => {
    if (status === 'Paid') {
        return 'success'
    }
    if (status === 'Pending') {
        return 'warning'
    }
    if (status === 'Expired') {
        return 'error'
    }
    return ''
}

const getShippingStatus = status => {
    if (status === 'Ready') {
        return 'blue'
    }
    if (status === 'Shipped') {
        return 'cyan'
    }
    return ''
}

const paymentStatusList = ['Paid', 'Pending', 'Expired']

export const BillingList = () => {

    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddBillingModalVisible, setIsAddBillingModalVisible] = useState(false);
    const [isEditBillingModalVisible, setIsEditBillingModalVisible] = useState(false);
    const [isViewBillingModalVisible, setIsViewBillingModalVisible] = useState(false);



    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'paymentStatus'
            const data = utils.filterArray(OrderListData, key, value)
            setList(data)
        } else {
            setList(OrderListData)
        }
    }

    // Open Add Job Modal
    const openAddBillingModal = () => {
        setIsAddBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddBillingModal = () => {
        setIsAddBillingModalVisible(false);
    };

    // Open Add Job Modal
    const openEditBillingModal = () => {
        setIsEditBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditBillingModal = () => {
        setIsEditBillingModalVisible(false);
    };


    // Open Add Job Modal
    const openViewBillingModal = () => {
        setIsViewBillingModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewBillingModal = () => {
        setIsViewBillingModalVisible(false);
    };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewBillingModal}>
                    <EyeOutlined />
                    {/* <EyeOutlined /> */}
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    <PlusCircleOutlined />
                    <span className="ml-2">Add to remark</span>
                </Flex>
            </Menu.Item>

            <Menu.Item>
                <Flex alignItems="center" onClick={openEditBillingModal}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    <TiPinOutline />
                    <span className="ml-2">Pin</span>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    const tableColumns = [
        {
            title: 'Bill',
            dataIndex: 'bill'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            sorter: {
                compare: (a, b) => a.title.length - b.title.length,
            },
        },
        {
            title: 'Bill  Date',
            dataIndex: 'billdate',
            render: (_, record) => (
                <span>{dayjs.unix(record.billdate).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'billdate')
        },
        {
            title: 'Due Date',
            dataIndex: 'duedate',
            render: (_, record) => (
                <span>{dayjs.unix(record.duedate).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'duedate')
        },
        {
            title: 'status',
            dataIndex: 'paymentStatus',
            render: (_, record) => (
                <><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
        },

        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            )
        }
    ];

    const onSearch = e => {
        const value = e.currentTarget.value
        const searchArray = e.currentTarget.value ? list : OrderListData
        const data = utils.wildCardSearch(searchArray, value)
        setList(data)
        setSelectedRowKeys([])
    }


    return (
        <div className="container">

            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                        <div className="mb-3">
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All Billing </Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddBillingModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
                        <Button type="primary" icon={<FileExcelOutlined />} block>
                            Export All
                        </Button>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                    // rowSelection={{
                    // 	selectedRowKeys: selectedRowKeys,
                    // 	type: 'checkbox',
                    // 	preserveSelectedRowKeys: false,
                    // 	...rowSelection,
                    // }}
                    />
                </div>

                <Modal
					title="Create Billing"
					visible={isAddBillingModalVisible}
					onCancel={closeAddBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddBilling onClose={closeAddBillingModal} />
				</Modal>
                <Modal
					title="Edit Billing"
					visible={isEditBillingModalVisible}
					onCancel={closeEditBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<EditBilling onClose={closeEditBillingModal} />
				</Modal>
                <Modal
					title="Billing"
					visible={isViewBillingModalVisible}
					onCancel={closeViewBillingModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<ViewBilling onClose={closeViewBillingModal} />
				</Modal>
            </Card>
        </div>
    );
}


export default BillingList
