import React, { useState } from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import {
    AnnualStatisticData,
} from '../../../dashboards/default/DefaultDashboardData';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
// import AddExpenses from "./AddExpenses";
// import EditExpenses from "./EditExpenses"
// import ViewExpenses from './ViewExpenses';
const { Option } = Select
const getShippingStatus = orderStatus => {
    if (orderStatus === 'Ready') {
        return 'blue'
    }
    if (orderStatus === 'Shipped') {
        return 'cyan'
    }
    return ''
}
const expenseStatusList = ['Ready', 'Shipped']
const ExpensesList = () => {
    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isAddExpensesModalVisible, setIsAddExpensesModalVisible] = useState(false);
    const [isEditExpensesModalVisible, setIsEditExpensesModalVisible] = useState(false);
    const [isViewExpensesModalVisible, setIsViewExpensesModalVisible] = useState(false);
    // Open Add Job Modal
    const openAddExpensesModal = () => {
        setIsAddExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeAddExpensesModal = () => {
        setIsAddExpensesModalVisible(false);
    };
    // Open Add Job Modal
    const openEditExpensesModal = () => {
        setIsEditExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeEditExpensesModal = () => {
        setIsEditExpensesModalVisible(false);
    };
    const openviewExpensesModal = () => {
        setIsViewExpensesModalVisible(true);
    };
    // Close Add Job Modal
    const closeViewExpensesModal = () => {
        setIsViewExpensesModalVisible(false);
    };
    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'orderStatus'
            const data = utils.filterArray(OrderListData, key, value)
            setList(data)
        } else {
            setList(OrderListData)
        }
    }
    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openviewExpensesModal}>
                    {<EyeOutlined />}
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
                <Flex alignItems="center" onClick={openEditExpensesModal}>
                    <EditOutlined />
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
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'ItemName',
            dataIndex: 'itemName',
            render: (_, record) => (
                <span>{record.itemName}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'itemName')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: {
                compare: (a, b) => a.price.length - b.price.length,
            },
        },
        {
            title: 'Employees',
            dataIndex: 'employees',
            render: (_, record) => (
                <div className="d-flex">
                        <AvatarStatus size={30} src={record.image} name={record.name} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'employees')
        },
        {
            title: 'Purcheased From',
            dataIndex: 'purchasedFrom',
            sorter: {
                compare: (a, b) => a.purchasedFrom.length - b.purchasedFrom.length,
            },
        },
        {
            title: 'Purchase Date',
            dataIndex: 'purchaseDate',
            sorter: {
                compare: (a, b) => a.purchaseDate.length - b.purchaseDate.length,
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) => (
                <span className="font-weight-semibold">
                </span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
        },
        {
            title: 'Action',
            dataIndex: 'actions',
                render: (_, elm) => (
                <div className="text-center">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'actions')
        }
        // {
        //  title: 'Payment Method',
        //  dataIndex: 'method',
        //  sorter: {
        //      compare: (a, b) => a.method.length - b.method.length,
        //  },
        // },
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
        <>
            <Card>
                <div className='flex justify-between'>
                <Flex gap="7px" className="flex">
                    <Button type="primary" className="flex items-center mb-3" onClick={openAddExpensesModal}>
                        <PlusOutlined />
                        <span className="ml-2">Add Expenses</span>
                    </Button>
                    <Button type="primary" className='bg-blue-500 items-center ' icon={<FileExcelOutlined  className='align-middle'/>} block>
                        Export
                    </Button>
                </Flex>
                </div>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false} >
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                        <div className="w-full md:w-48">
                            <Select
                                defaultValue="All"
                                className="w-full"
                                style={{ minWidth: 180 }}
                                onChange={handleShowStatus}
                                placeholder="Status"
                            >
                                <Option value="All">All Expenss </Option>
                                {expenseStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
                            </Select>
                        </div>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: 'checkbox',
                            preserveSelectedRowKeys: false,
                            ...rowSelection,
                        }}
                    />
                </div>
            </Card>
            <Card>
                {/* <Modal
                    title="Add Expenses"
                    visible={isAddExpensesModalVisible}
                    onCancel={closeAddExpensesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <AddExpenses onClose={closeAddExpensesModal} />
                </Modal>
                <Modal
                    title="Edit Expenses"
                    visible={isEditExpensesModalVisible}
                    onCancel={closeEditExpensesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <EditExpenses onClose={closeEditExpensesModal} />
                </Modal>
                <Modal
                    title="Expenses"
                    visible={isViewExpensesModalVisible}
                    onCancel={closeViewExpensesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <ViewExpenses onClose={closeViewExpensesModal} />
                </Modal> */}
            </Card>
        </>
    )
}
export default ExpensesList;