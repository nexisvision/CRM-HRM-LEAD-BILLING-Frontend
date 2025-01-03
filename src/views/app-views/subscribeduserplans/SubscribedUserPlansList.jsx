import React, { Component } from 'react'
import { useState } from 'react'
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from 'components/shared-components/StatisticWidget';

import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Switch } from 'antd';
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from 'react-number-format';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
// import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';
import userData from '../../../assets/data/user-list.data.json';
import ViewSubscribedUserPlans from './ViewSubscribedUserPlans';
import EditSubscribedUserPlans from './EditSubscribedUserPlans';

// import userData from '../../../../../assets/data/user-list.data.json';


const { Column } = Table;

const { Option } = Select


export const SubscribedUserPlansList = () => {
    const [users, setUsers] = useState(userData);
    // const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddSubscribedUserPlansModalVisible, setIsAddSubscribedUserPlansModalVisible] = useState(false);
    const [isEditSubscribedUserPlansModalVisible, setIsEditSubscribedUserPlansModalVisible] = useState(false);
    const [isViewSubscribedUserPlansModalVisible, setIsViewSubscribedUserPlansModalVisible] = useState(false);


    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'paymentStatus'
            const data = utils.filterArray(userData, key, value)
            setUsers(data)
        } else {
            setUsers(userData)
        }
    }

    // Open Add Job Modal
    const openAddSubscribedUserPlansModal = () => {
        setIsAddSubscribedUserPlansModalVisible(true);
    };

    // Close Add Job Modal
    const closeAddSubscribedUserPlansModal = () => {
        setIsAddSubscribedUserPlansModalVisible(false);
    };

    // Open Add Job Modal
    const openEditSubscribedUserPlansModal = () => {
        setIsEditSubscribedUserPlansModalVisible(true);
    };

    // Close Add Job Modal
    const closeEditSubscribedUserPlansModal = () => {
        setIsEditSubscribedUserPlansModalVisible(false);
    };


    // Open Add Job Modal
    const openViewSubscribedUserPlansModal = () => {
        setIsViewSubscribedUserPlansModalVisible(true);
    };

    // Close Add Job Modal
    const closeViewSubscribedUserPlansModal = () => {
        setIsViewSubscribedUserPlansModalVisible(false);
    };

    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewSubscribedUserPlansModal}>
                    <EyeOutlined />
                    {/* <EyeOutlined /> */}
                    <span className="ml-2">View Details</span>
                </Flex>
            </Menu.Item>

            <Menu.Item>
                <Flex alignItems="center" onClick={openEditSubscribedUserPlansModal}>
                    <EditOutlined />
                    {/* <EditOutlined /> */}
                    <span className="ml-2">Edit</span>
                </Flex>
            </Menu.Item>
            {/* <Menu.Item>
				<Flex alignItems="center">
					<TiPinOutline />
					<span className="ml-2">Pin</span>
				</Flex>
			</Menu.Item> */}
            <Menu.Item>
                <Flex alignItems="center">
                    <DeleteOutlined />
                    <span className="ml-2">Delete</span>
                </Flex>
            </Menu.Item>
        </Menu>
    );

    // Add this function to handle status changes
const handleStatusChange = (checked, userId) => {
    const newStatus = checked ? 'active' : 'inactive';
    // Update your data/API here
    console.log(`User ${userId} status changed to ${newStatus}`);
  };

    const tableColumns = [
        {
            title: 'User Name',
            dataIndex: 'name'
        },
        {
            title: 'Plan Name',
            dataIndex: 'planname'
        },
        {
            title: 'Start  Date',
            dataIndex: 'startdate',
            render: (_, record) => (
                <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'startdate')
        },
        {
            title: 'End Date',
            dataIndex: 'enddate',
            render: (_, record) => (
                <span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'enddate')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (_, record) => (
                <Switch
                    defaultChecked={record.status === 'active'}
                    onChange={(checked) => handleStatusChange(checked, record.id)}
                    size="small"
                />
            ),
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
        const searchArray = e.currentTarget.value ? users : userData
        const data = utils.wildCardSearch(searchArray, value)
        setUsers(data)
        setSelectedRowKeys([])
    }

    // total() {
    // 	let total = 0;
    // 	invoiceData.forEach((elm) => {
    // 		total += elm.price;
    // 	})
    // 	return total
    // }

    // render() {


    return (
        <div className="container">
            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
                        </div>
                    </Flex>
                    {/* <Flex gap="7px" className="flex">
                        <Button type="primary" className="flex items-center" onClick={openAddSubscribedUserPlansModal}>
                            <PlusOutlined />
                            <span className="ml-2">New</span>
                        </Button>
                    </Flex> */}
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={users}
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

                {/* <Modal
					title="SubscribedUserPlans Create"
					visible={isAddSubscribedUserPlansModalVisible}
					onCancel={closeAddSubscribedUserPlansModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddInvoice onClose={closeAddSubscribedUserPlansModal} />
				</Modal> */}
                <Modal
					title="Edit Subscribed Plans"
					visible={isEditSubscribedUserPlansModalVisible}
					onCancel={closeEditSubscribedUserPlansModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
				    <EditSubscribedUserPlans onClose={closeEditSubscribedUserPlansModal} />
				</Modal>
                <Modal
                    title="Subscribed Plans Details"
                    visible={isViewSubscribedUserPlansModalVisible}
                    onCancel={closeViewSubscribedUserPlansModal}
                    footer={null}
                    width={700}
                    className='mt-[-70px]'
                >
                    <ViewSubscribedUserPlans onClose={closeViewSubscribedUserPlansModal} />
                </Modal>
            </Card>
        </div>
    );
}


export default SubscribedUserPlansList
