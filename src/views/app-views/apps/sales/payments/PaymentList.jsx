/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal ,Row,Col} from 'antd';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import AddPayment from "./AddPayment"
import EditPayment from './EditPayment';
import ViewPayment from './ViewPayment';
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';

// import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import StatisticWidget from 'components/shared-components/StatisticWidget';

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

const PaymentList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);
	const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] = useState(false);
	const [isViewPaymentModalVisible, setIsViewPaymentModalVisible] = useState(false);
	const [paymentStatisticData] = useState(PaymentStatisticData);

	// Open Add Job Modal
	const openAddPaymentModal = () => {
		setIsAddPaymentModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddEstimatesModal = () => {
		setIsAddPaymentModalVisible(false);
	};

	// Open Add Job Modal
	const openEditPaymentModal = () => {
		setIsEditPaymentModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditPaymentModal = () => {
		setIsEditPaymentModalVisible(false);
	};

	// Open Add Job Modal
	const openViewPaymentModal = () => {
		setIsViewPaymentModalVisible(true);
	};

	// Close Add Job Modal
	const closeViewPaymentModal = () => {
		setIsViewPaymentModalVisible(false);
	};

	const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'paymentStatus'
			const data = utils.filterArray(OrderListData, key, value)
			setList(data)
		} else {
			setList(OrderListData)
		}
	}

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center" onClick={openViewPaymentModal}>
					<EyeOutlined />
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
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<EditOutlined />}
						onClick={openEditPaymentModal}
						size="small"
					>
						<span className="">Edit</span>
					</Button>
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
			title: 'Invoice',
			dataIndex: 'invoice'
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: 'Client',
			dataIndex: 'client',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: 'Project',
			dataIndex: 'project',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: 'Method',
			dataIndex: 'method',
			sorter: {
				compare: (a, b) => a.method.length - b.method.length,
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
		<>
			<Card>
				<Row gutter={16}>
					{paymentStatisticData.map((elm, i) => (
						<Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
							<StatisticWidget
								value={elm.value}
								subtitle={elm.subtitle}
							/>
						</Col>
					))}
				</Row>
				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
					<Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
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
								<Option value="All">All payment </Option>
								{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
					</Flex>
					<Flex gap="7px" className="flex">
						<Button type="primary" className="ml-2" onClick={openAddPaymentModal}>
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
					title="Add A New Payment"
					visible={isAddPaymentModalVisible}
					onCancel={closeAddEstimatesModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<AddPayment onClose={closeAddEstimatesModal} />
				</Modal>

				<Modal
					title="Edit Payment"
					visible={isEditPaymentModalVisible}
					onCancel={closeEditPaymentModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<EditPayment onClose={closeEditPaymentModal} />
				</Modal>

				<Modal
					title="Payment"
					visible={isViewPaymentModalVisible}
					onCancel={closeViewPaymentModal}
					footer={null}
					width={600}
					className='mt-[-70px]'
				>
					<ViewPayment onClose={closeViewPaymentModal} />
				</Modal>
			</Card>
		</>
	)
}

export default PaymentList
