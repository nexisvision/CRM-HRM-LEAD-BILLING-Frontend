/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';
import OrderListData from "assets/data/order-list.data.json"
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
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
import AddEstimates from './AddEstimates';
import EditEstimates from './EditEstimates';
import ViewEstimates from './ViewEstimates';

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

const EstimatesList = () => {
	const [annualStatisticData] = useState(AnnualStatisticData);

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])

	const [isAddEstimatesModalVisible, setIsAddEstimatesModalVisible] = useState(false);
	const [isEditEstimatesModalVisible, setIsEditEstimatesModalVisible] = useState(false);
	const [isViewEstimatesModalVisible, setIsViewEstimatesModalVisible] = useState(false);


	// Open Add Job Modal
	const openAddEstimatesModal = () => {
		setIsAddEstimatesModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddEstimatesModal = () => {
		setIsAddEstimatesModalVisible(false);
	};

	// Open Add Job Modal
	const openEditEstimatesModal = () => {
		setIsEditEstimatesModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditEstimatesModal = () => {
		setIsEditEstimatesModalVisible(false);
	};

	const openviewEstimatesModal = () => {
		setIsViewEstimatesModalVisible(true);
	};

	// Close Add Job Modal
	const closeViewEstimatesModal = () => {
		setIsViewEstimatesModalVisible(false);
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
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<EyeOutlined />}
						onClick={openviewEstimatesModal}
						size="small"
					>
						<span className="">View Details</span>
					</Button>
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
						onClick={openEditEstimatesModal}
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
			title: 'Created By',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={30} src={record.image} name={record.name} />
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},

		{
			title: 'Company Name',
			dataIndex: 'company',
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
					<Flex cclassName="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
						<div className="w-full md:w-48">
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
						<Button type="primary" className="flex items-center"onClick={openAddEstimatesModal}>
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
					title="Add Estimate"
					visible={isAddEstimatesModalVisible}
					onCancel={closeAddEstimatesModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'

				>
					<AddEstimates onClose={closeAddEstimatesModal} />
				</Modal>

				<Modal
					title="Edit Estimate"
					visible={isEditEstimatesModalVisible}
					onCancel={closeEditEstimatesModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'

				>
					<EditEstimates onClose={closeEditEstimatesModal} />
				</Modal>

				<Modal
					title="View Estimate"
					visible={isViewEstimatesModalVisible}
					onCancel={closeViewEstimatesModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'

				>
					<ViewEstimates onClose={closeViewEstimatesModal} />
				</Modal>
			</Card>
		</>
	)
}

export default EstimatesList
