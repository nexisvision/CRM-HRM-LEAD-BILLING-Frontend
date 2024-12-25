/* eslint-disable no-unused-vars */
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
import AddExpenses from "./AddExpenses";
import EditExpenses from "./EditExpenses"
import ViewExpenses from './ViewExpenses';

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
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (
				<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
		},
		{
			title: 'Description',
			dataIndex: 'description',
			sorter: {
				compare: (a, b) => a.description.length - b.description.length,
			},
		},
		{
			title: 'Client',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={30} src={record.image} name={record.name} />
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'User',
			dataIndex: 'user',
			sorter: {
				compare: (a, b) => a.user.length - b.user.length,
			},
		},

		{
			title: 'Project',
			dataIndex: 'project',
			sorter: {
				compare: (a, b) => a.company.length - b.company.length,
			},
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
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
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: 'Status',
			dataIndex: 'orderStatus',
			render: (_, record) => (
				<><Tag color={getShippingStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
		},
		// {
		// 	title: 'Payment status',
		// 	dataIndex: 'paymentStatus',
		// 	render: (_, record) => (
		// 		<><Badge status={getPaymentStatus(record.paymentStatus)} /><span>{record.paymentStatus}</span></>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'paymentStatus')
		// },

		// {
		// 	title: 'Payment Method',
		// 	dataIndex: 'method',
		// 	sorter: {
		// 		compare: (a, b) => a.method.length - b.method.length,
		// 	},
		// },
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
		<>
			<Card>
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
					<Flex gap="7px" className="flex">
						<Button type="primary" className="flex items-center" onClick={openAddExpensesModal}>
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
						scroll={{x:1200}}
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
				<Modal
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
				</Modal>
			</Card>
		</>
	)
}

export default ExpensesList;
