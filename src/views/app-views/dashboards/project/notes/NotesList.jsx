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
// import AddNotes from './AddNotes';
// import EditNotes from './EditNotes';
// import ViewNotes from './ViewNotes';
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

const notesStatusList = ['Paid', 'Pending', 'Expired']

export const NotesList = () => {

    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddNotesModalVisible, setIsAddNotesModalVisible] = useState(false);
    const [isEditNotesModalVisible, setIsEditNotesModalVisible] = useState(false);
    const [isViewNotesModalVisible, setIsViewNotesModalVisible] = useState(false);



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
    const openAddNotesModal = () => {
        setIsAddNotesModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddNotesModal = () => {
        setIsAddNotesModalVisible(false);
    };

    // Open Add Job Modal
    const openEditNotesModal = () => {
        setIsEditNotesModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditNotesModal = () => {
        setIsEditNotesModalVisible(false);
    };


    // Open Add Job Modal
    const openViewNotesModal = () => {
        setIsViewNotesModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewNotesModal = () => {
        setIsViewNotesModalVisible(false);
    };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openEditNotesModal}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>    
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewNotesModal}>
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
            title: 'Note Title',
            dataIndex: 'noteTitle',
            sorter: {
                compare: (a, b) => a.noteTitle.length - b.noteTitle.length,
            },
        },
        {
            title: 'Note Type',
            dataIndex: 'noteType',
            sorter: {
                compare: (a, b) => a.noteType.length - b.noteType.length,
            },
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
                            <Button type="primary" className="flex items-center" onClick={openAddNotesModal}>
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
                        rowSelection={{
							selectedRowKeys: selectedRowKeys,
							type: 'checkbox',
							preserveSelectedRowKeys: false,
							...rowSelection,
						}}
                    />
                </div>

                {/* <Modal
                    title="Milestone Create"
                    visible={isAddNotesModalVisible}
                    onCancel={closeAddNotesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <AddNotes onClose={closeAddNotesModal} />
                </Modal> */}
                {/* <Modal
                    title="Milestone Edit"
                    visible={isEditNotesModalVisible}
                    onCancel={closeEditNotesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <EditNotes onClose={closeEditNotesModal} />
                </Modal> */}
                {/* <Modal
                    title="Milestone Details"
                    visible={isViewNotesModalVisible}
                    onCancel={closeViewNotesModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <ViewNotes onClose={closeViewNotesModal} />
                </Modal> */}
            </Card>
        </div>
    );
}


export default NotesList;