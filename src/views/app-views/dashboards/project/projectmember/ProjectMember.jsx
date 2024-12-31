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
const { Column } = Table;
const { Option } = Select
// const getPaymentStatus = status => {
//  if (status === 'Paid') {
//      return 'success'
//  }
//  if (status === 'Pending') {
//      return 'warning'
//  }
//  if (status === 'Expired') {
//      return 'error'
//  }
//  return ''
// }
// const getShippingStatus = status => {
//  if (status === 'Ready') {
//      return 'blue'
//  }
//  if (status === 'Shipped') {
//      return 'cyan'
//  }
//  return ''
// }
const paymentStatusList = ['Paid', 'Pending', 'Expired']
export const ProjectMember = () => {
    const [annualStatisticData] = useState(AnnualStatisticData);
    const [list, setList] = useState(OrderListData)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAddProjectMemberModalVisible, setIsAddProjectMemberModalVisible] = useState(false);
    const [isEditProjectMemberModalVisible, setIsEditProjectMemberModalVisible] = useState(false);
    const [isViewProjectMemberModalVisible, setIsViewProjectMemberModalVisible] = useState(false);
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
    const openAddProjectMemberModal = () => {
        setIsAddProjectMemberModalVisible(true);
    };
    // Close Add Job Modal
    const closeAddProjectMemberModal = () => {
        setIsAddProjectMemberModalVisible(false);
    };
    // Open Add Job Modal
    const openEditProjectMemberModal = () => {
        setIsEditProjectMemberModalVisible(true);
    };
    // Close Add Job Modal
    const closeEditProjectMemberModal = () => {
        setIsEditProjectMemberModalVisible(false);
    };
    // Open Add Job Modal
    const openViewProjectMemberModal = () => {
        setIsViewProjectMemberModalVisible(true);
    };
    // Close Add Job Modal
    const closeViewProjectMemberModal = () => {
        setIsViewProjectMemberModalVisible(false);
    };
    const dropdownMenu = row => (
        <Menu>
            <Menu.Item>
                <Flex alignItems="center" onClick={openViewProjectMemberModal}>
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
                <Flex alignItems="center" onClick={openEditProjectMemberModal}>
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
            title: '#',
            dataIndex: 'id'
        },
        // {
        //  title: 'Name',
        //  dataIndex: 'name',
        //  render: (_, record) => (
        //      <span>{record.name}</span>
        //  ),
        //  sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
        // },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <div>
                    <span>{text}</span>
                    <br />
                    <span className="text-xs text-gray-500"></span>
                </div>
            ),
        },
        {
            title: 'Hourly Rate ',
            dataIndex: 'hourlyrate',
            render: (_, record) => (
                <input className='border border-gray-300 rounded-md p-2' value={record.hourlyrate} />
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'hourlyrate')
        },
        {
            title: 'User Role ',
            dataIndex: 'userrole',
            render: (_, record) => (
                <label htmlFor="Project Admin">
                    <input type='radio' className='border border-gray-300 rounded-md p-2' value={record.userrole} />
                    <span className='ml-2 items-center p-2' >Project Admin</span>
                </label>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'userrole')
        },
        {
            title: 'Action',
            dataIndex: 'actions',
            render: (_, elm) => (
                <div className="text-center">
                    <DeleteOutlined menu={dropdownMenu(elm)} />
                </div>
            )
        }
        // {
        //  title: 'status',
        //  dataIndex: 'paymentStatus',
        //  // render: (_, record) => (
        //  //  <><Tag color={getPaymentStatus(record.paymentStatus)}>{record.paymentStatus}</Tag></>
        //  //  // <><Badge status={getPaymentStatus(record.paymentStatus)}  className='me-2'/><span>{record.paymentStatus}</span></>
        //  // ),
        //  sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
        // },
        // {
        //  title: 'Action',
        //  dataIndex: 'actions',
        //  render: (_, elm) => (
        //      <div className="text-center">
        //          <EllipsisDropdown menu={dropdownMenu(elm)} />
        //      </div>
        //  )
        // }
    ];
    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        }
    };
    // const onSearch = e => {
    //  const value = e.currentTarget.value
    //  const searchArray = e.currentTarget.value ? list : OrderListData
    //  const data = utils.wildCardSearch(searchArray, value)
    //  setList(data)
    //  setSelectedRowKeys([])
    // }
    // total() {
    //  let total = 0;
    //  invoiceData.forEach((elm) => {
    //      total += elm.price;
    //  })
    //  return total
    // }
    // render() {
    return (
        <div className="container">
            <Flex gap="7px" className="flex">
                <Button type="primary" className="flex items-center bg-blue-500 text-white rounded-md p-2 mb-3" onClick={openAddProjectMemberModal}>
                    <PlusOutlined />
                    <span className="ml-2">Add Project Member</span>
                </Button>
            </Flex>
            <Card>
                <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
                    <Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
                        <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
                            {/* <Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} /> */}
                        </div>
                        <div className="mb-3">
                        </div>
                    </Flex>
                </Flex>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={list}
                        rowKey='id'
                    // scroll={{ x: 1200 }}
                    // rowSelection={{
                    //  selectedRowKeys: selectedRowKeys,
                    //  type: 'checkbox',
                    //  preserveSelectedRowKeys: false,
                    //  ...rowSelection,
                    // }}
                    />
                </div>
                {/* <Modal
                    title="Project Member Create"
                    visible={isAddProjectMemberModalVisible}
                    onCancel={closeAddProjectMemberModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                <AddProjectMember onClose={closeAddProjectMemberModal} />
                </Modal>
                <Modal
                    title="Edit Project Member"
                    visible={isEditProjectMemberModalVisible}
                    onCancel={closeEditProjectMemberModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                        <EditProjectMember onClose={closeEditProjectMemberModal} />
                </Modal>
                <Modal
                    title="Project Member"
                    visible={isViewProjectMemberModalVisible}
                    onCancel={closeViewProjectMemberModal}
                    footer={null}
                    width={1000}
                    className='mt-[-70px]'
                >
                    <ViewProjectMember onClose={closeViewProjectMemberModal} />
                </Modal> */}
            </Card>
        </div>
    );
}
export default ProjectMember;









