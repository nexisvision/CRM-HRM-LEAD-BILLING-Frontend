import React, { Component } from 'react'
import { useState } from 'react'
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from 'components/shared-components/StatisticWidget';

import { Row, Card, Col, Table, Select, Input, Button, Badge, Menu, Modal, Switch } from 'antd';
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from 'react-number-format';
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, EditOutlined, PlusOutlined, DeleteOutlined,CheckOutlined ,CloseOutlined  } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
// import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'   



const { Column } = Table;

const { Option } = Select


export const PlanRequestList = () => {
    const [users, setUsers] = useState([]);
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddSubscribedUserPlansModalVisible, setIsAddSubscribedUserPlansModalVisible] = useState(false);
    const [isEditSubscribedUserPlansModalVisible, setIsEditSubscribedUserPlansModalVisible] = useState(false);
    const [isViewSubscribedUserPlansModalVisible, setIsViewSubscribedUserPlansModalVisible] = useState(false);


    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const handleShowStatus = value => {
        if (value !== 'All') {
            const key = 'paymentStatus'
            const data = utils.filterArray(users, key, value)
            setUsers(data)
        } else {
            setUsers([])
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
  };

    const handleAccept = (id) => {
       
        
    };

    const handleReject = (id) => {
        
      
    };

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        },
        {
            title: 'Plan Name',
            dataIndex: 'planname',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'planname')
        },
        {
            title: 'Total Users',
            dataIndex: 'totalusers',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalusers')
        },
        {
            title: 'Total Customers',
            dataIndex: 'totalcustomers',
            
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalcustomers')
        },
        {
            title: 'Total Vendors',
            dataIndex: 'totalvendors',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalvendors')
        },
        {
            title: 'Total Clients',
            dataIndex: 'totalclients',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'totalclients')
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            sorter: (a, b) => utils.antdTableSorter(a, b, 'duration')
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center flex gap-3">
                    <CheckOutlined className='border border-gray-300 bg-blue-400 text-white p-1'/>
                    <CloseOutlined   className='border border-gray-300 bg-white text-red-500 p-1 '/>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'action')
        }
    ];


    const onSearch = e => {
        const value = e.currentTarget.value
        const searchArray = e.currentTarget.value ? users : []
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
                   
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={users}
                        rowKey='id'
                        scroll={{ x: 1200 }}
                    
                    />
                </div>

               
            </Card>
        </div>
    );
}


export default PlanRequestList