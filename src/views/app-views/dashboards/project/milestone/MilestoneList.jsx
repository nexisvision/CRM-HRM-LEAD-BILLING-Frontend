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
import utils from 'utils';
import AddMilestone from './AddMilestone';
import EditMilestone from './EditMilestone';
import ViewMilestone from './ViewMilestone';
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';



const { Column } = Table;

const { Option } = Select

const getMilestoneStatus = status => {
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

const milestoneStatusList = ['Paid', 'Pending', 'Expired']

export const MilestoneList = () => {

    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddMilestoneModalVisible, setIsAddMilestoneModalVisible] = useState(false);
    const [isEditMilestoneModalVisible, setIsEditMilestoneModalVisible] = useState(false);
    const [isViewMilestoneModalVisible, setIsViewMilestoneModalVisible] = useState(false);



    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'milestoneStatus'
            const data = utils.filterArray(OrderListData, key, value)
            setList(data)
        } else {
            setList(OrderListData)
        }
    }

    // Open Add Job Modal
    const openAddMilestoneModal = () => {
        setIsAddMilestoneModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddMilestoneModal = () => {
        setIsAddMilestoneModalVisible(false);
    };

    // Open Add Job Modal
    const openEditMilestoneModal = () => {
        setIsEditMilestoneModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditMilestoneModal = () => {
        setIsEditMilestoneModalVisible(false);
    };


    // Open Add Job Modal
    const openViewMilestoneModal = () => {
        setIsViewMilestoneModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewMilestoneModal = () => {
        setIsViewMilestoneModalVisible(false);
    };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openEditMilestoneModal}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>    
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewMilestoneModal}>
                    <EyeOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">View</span>
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
            title: '#',
            dataIndex: 'id'
        },
        {
            title: 'Milestone Title',
            dataIndex: 'milestoneTitle',
            sorter: {
                compare: (a, b) => a.milestoneTitle.length - b.milestoneTitle.length,
            },
        },
        {
            title: 'Milestone Cost',
            dataIndex: 'milestoneCost',
            sorter: {
                compare: (a, b) => a.milestoneCost.length - b.milestoneCost.length,
            },
        },
        {
            title: 'Task Count',
            dataIndex: 'taskCount',
            sorter: {
                compare: (a, b) => a.taskCount.length - b.taskCount.length,
            },
        },
        {
            title: 'status',
            dataIndex: 'milestoneStatus',
            render: (_, record) => (
                <>
                    <select
                        value={record.milestoneStatus}
                        className="p-1 border focus:outline-none focus:ring"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                </>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'milestoneStatus')
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

            <div>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                        {/* <div className="mb-3">
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
						</div> */}
                    </Flex>
                    <Flex gap="7px" className="flex">
                        <div className='flex gap-4'>
                            <Button type="primary" className="flex items-center" onClick={openAddMilestoneModal}>
                                <PlusOutlined />
                                <span className="ml-2">Create Milestone</span>
                            </Button>
                        </div>

                    </Flex>
                </Flex>
            </div>
            <Card>

                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                    />
                </div>

                <Modal
                    title="Milestone Create"
                    visible={isAddMilestoneModalVisible}
                    onCancel={closeAddMilestoneModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <AddMilestone onClose={closeAddMilestoneModal} />
                </Modal>
                <Modal
                    title="Milestone Edit"
                    visible={isEditMilestoneModalVisible}
                    onCancel={closeEditMilestoneModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <EditMilestone onClose={closeEditMilestoneModal} />
                </Modal>
                <Modal
                    title="Milestone Details"
                    visible={isViewMilestoneModalVisible}
                    onCancel={closeViewMilestoneModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <ViewMilestone onClose={closeViewMilestoneModal} />
                </Modal>
            </Card>
        </div>
    );
}


export default MilestoneList;