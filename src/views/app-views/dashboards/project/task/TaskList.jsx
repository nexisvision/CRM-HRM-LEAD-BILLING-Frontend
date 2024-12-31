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

export const TaskList = () => {

    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
    const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
    const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);



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
    const openAddTaskModal = () => {
        setIsAddTaskModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddTaskModal = () => {
        setIsAddTaskModalVisible(false);
    };

    // Open Add Job Modal
    const openEditTaskModal = () => {
        setIsEditTaskModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditTaskModal = () => {
        setIsEditTaskModalVisible(false);
    };


    // Open Add Job Modal
    const openViewTaskModal = () => {
        setIsViewTaskModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewTaskModal = () => {
        setIsViewTaskModalVisible(false);
    };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewTaskModal}>
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
                <Flex alignItems="center" onClick={openEditTaskModal}>
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
            title: 'Code',
            dataIndex: 'id'
        },
        {
            title: 'Task',
            dataIndex: 'task',
            sorter: {
                compare: (a, b) => a.task.length - b.task.length,
            },
        },
        {
            title: 'Completed On',
            dataIndex: 'completedon',
            sorter: {
                compare: (a, b) => a.completedon.length - b.completedon.length,
            },
        },
        {
            title: 'Milestone',
            dataIndex: 'milestone',
            sorter: {
                compare: (a, b) => a.milestone.length - b.milestone.length,
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'startdate',
            render: (_, record) => (
                <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'startdate')
        },
        {
            title: 'Due Date',
            dataIndex: 'duedate',
            render: (_, record) => (
                <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'duedate')
        },
        {
            title: 'Estimated Time',
            dataIndex: 'estimatedtime',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'estimatedtime')
        },
        {
            title: 'Hours Logged',
            dataIndex: 'hourslogged',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'hourslogged')
        },
        {
            title: 'Assigned To',
            dataIndex: 'assignedto',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'assignedto')
        },
        {
            title: 'status',
            dataIndex: 'paymentStatus',
            render: (_, record) => (
                <><Tag color={getPaymentStatus(record.paymentStatus)}>{record.paymentStatus}</Tag></>
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



    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    };

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
                        <div className="mr-0 md:mr-3 mt-[30px] md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                        <div className="mb-3">
                            <h1 className='mb-2 text-black text-base'>Status</h1>
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">Hide Completed Task </Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                        <div className="mb-3">
                        <h1 className='mb-2 text-black text-base'>Assigned To</h1>
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All</Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                        <div className="mb-3">
                        <h1 className='mb-2 text-black text-base'>Milestone</h1>
                            <Select
                                defaultValue="All"
                                className="w-100"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All payment </Option>
                                {paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddTaskModal}>
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
                        scroll={{ x: 1600 }}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: 'checkbox',
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                        }}
                    />
                </div>

                {/* <Modal
					title="Invoice Create"
					visible={isAddInvoiceModalVisible}
					onCancel={closeAddInvoiceModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddInvoice onClose={closeAddInvoiceModal} />
				</Modal> */}
                {/* <Modal
					title="Edit Task"
					visible={isEditTaskModalVisible}
					onCancel={closeEditTaskModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<EditTask onClose={closeEditTaskModal} />
				</Modal> */}
                {/* <Modal
					title="Task"
					visible={isViewTaskModalVisible}
					    onCancel={closeViewTaskModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<ViewTask onClose={closeViewTaskModal} />
				</Modal> */}
            </Card>
        </div>
    );
}


export default TaskList
