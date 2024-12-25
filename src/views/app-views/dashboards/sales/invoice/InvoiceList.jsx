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
import AddInvoice from './AddInvoice';
import EditInvoice from './EditInvoice';
import ViewInvoice from './ViewInvoice';



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

export const InvoiceList = () => {

	const [annualStatisticData] = useState(AnnualStatisticData);
	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [isAddInvoiceModalVisible, setIsAddInvoiceModalVisible] = useState(false);
	const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] = useState(false);
	const [isViewInvoiceModalVisible, setIsViewInvoiceModalVisible] = useState(false);



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
	const openAddInvoiceModal = () => {
		setIsAddInvoiceModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddInvoiceModal = () => {
		setIsAddInvoiceModalVisible(false);
	};

	// Open Add Job Modal
	const openEditInvoiceModal = () => {
		setIsEditInvoiceModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditInvoiceModal = () => {
		setIsEditInvoiceModalVisible(false);
	};


	// Open Add Job Modal
	const openViewInvoiceModal = () => {
		setIsViewInvoiceModalVisible(true);
	};

	// Close Add Job Modal
	const closeViewInvoiceModal = () => {
		setIsViewInvoiceModalVisible(false);
	};

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center" onClick={openViewInvoiceModal}>
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
				<Flex alignItems="center" onClick={openEditInvoiceModal}>
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
			title: 'Invoice',
			dataIndex: 'id'
		},
		{
			title: 'Issue  Date',
			dataIndex: 'issuedate',
			render: (_, record) => (
				<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'issuedate')
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
			title: 'Due Amount',
			dataIndex: 'dueamount',
			render: (_, record) => (
				<span className="font-weight-semibold">
					<NumberFormat
						displayType={'text'}
						value={(Math.round(record.amount * 100) / 100).toFixed(2)}
						prefix={'$'}
						thousandSeparator={true}
					/>
				</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'dueamount')
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

	// const tableColumns = [
	// 	{
	// 		title: 'ID',
	// 		dataIndex: 'id'
	// 	},
	// 	{
	// 		title: 'Product',
	// 		dataIndex: 'name',
	// 		render: (_, record) => (
	// 			<div className="d-flex">
	// 				<AvatarStatus size={30} src={record.image} name={record.name}/>
	// 			</div>
	// 		),
	// 		sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
	// 	},
	// 	{
	// 		title: 'Company Name',
	// 		dataIndex: 'company',
	// 		sorter: {
	// 			compare: (a, b) => a.company.length - b.company.length,
	// 		},
	// 	},
	// 	{
	// 		title: 'Project List',
	// 		dataIndex: 'project',
	// 		sorter: {
	// 			compare: (a, b) => a.project.length - b.project.length,
	// 		},
	// 	},
	// 	{
	// 		title: 'Date',
	// 		dataIndex: 'date',
	// 		render: (_, record) => (
	// 			<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
	// 		),
	// 		sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
	// 	},
	// 	{
	// 		title: 'Order status',
	// 		dataIndex: 'orderStatus',
	// 		render: (_, record) => (
	// 			<><Tag color={getShippingStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
	// 		),
	// 		sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
	// 	},
	// 	{
	// 		title: 'Payment status',
	// 		dataIndex: 'paymentStatus',
	// 		render: (_, record) => (
	// 			<><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
	// 		),
	// 		sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
	// 	},
	// 	{
	// 		title: 'Total',
	// 		dataIndex: 'amount',
	// 		render: (_, record) => (
	// 			<span className="font-weight-semibold">
	// 				<NumberFormat
	// 					displayType={'text'} 
	// 					value={(Math.round(record.amount * 100) / 100).toFixed(2)} 
	// 					prefix={'$'} 
	// 					thousandSeparator={true} 
	// 				/>
	// 			</span>
	// 		),
	// 		sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
	// 	},
	// 	{
	// 		title: 'Action',
	// 		dataIndex: 'actions',
	// 		render: (_, elm) => (
	// 			<div className="text-center">
	// 				<EllipsisDropdown menu={dropdownMenu(elm)}/>
	// 			</div>
	// 		)
	// 	}
	// ];

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


			<Row gutter={16}>
				{
					annualStatisticData.map((elm, i) => (
						<Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>

							<StatisticWidget
								title={elm.title}
								value={elm.value}
								status={elm.status}
								subtitle={elm.subtitle}
							/>
						</Col>
					))
				}
			</Row>
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
								<Option value="All">All payment </Option>
								{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
					</Flex>
					<Flex gap="7px" className="flex">
						<Button type="primary" className="flex items-center" onClick={openAddInvoiceModal}>
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
						rowSelection={{
							selectedRowKeys: selectedRowKeys,
							type: 'checkbox',
							preserveSelectedRowKeys: false,
							...rowSelection,
						}}
					/>
				</div>

				<Modal
					title="Invoice Create"
					visible={isAddInvoiceModalVisible}
					onCancel={closeAddInvoiceModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<AddInvoice onClose={closeAddInvoiceModal} />
				</Modal>
				<Modal
					title="Edit Invoice"
					visible={isEditInvoiceModalVisible}
					onCancel={closeEditInvoiceModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<EditInvoice onClose={closeEditInvoiceModal} />
				</Modal>
				<Modal
					title="Invoice"
					visible={isViewInvoiceModalVisible}
					onCancel={closeViewInvoiceModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'
				>
					<ViewInvoice onClose={closeViewInvoiceModal} />
				</Modal>
			</Card>
		</div>
	);
}


export default InvoiceList
