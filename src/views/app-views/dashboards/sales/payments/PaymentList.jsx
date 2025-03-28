import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Menu, Tag, Modal, Row, Col, message } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import { utils, writeFile } from "xlsx";
import AddPayment from "./AddPayment"
import EditPayment from './EditPayment';
import ViewPayment from './ViewPayment';
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import StatisticWidget from 'components/shared-components/StatisticWidget';

const { Option } = Select

const getPaymentStatus = method => {
	if (method === 'Normal') {
		return 'success'
	}
	if (method === 'Expired') {
		return 'warning'
	}
	return ''
}

const paymentStatusList = ['Normal', 'Expired']

const PaymentList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddPaymentModalVisible, setIsAddPaymentModalVisible] = useState(false);
	const [isEditPaymentModalVisible, setIsEditPaymentModalVisible] = useState(false);
	const [isViewPaymentModalVisible, setIsViewPaymentModalVisible] = useState(false);
	const [paymentStatisticData] = useState(PaymentStatisticData);

	const openAddPaymentModal = () => {
		setIsAddPaymentModalVisible(true);
	};

	const closeAddPaymentModal = () => {
		setIsAddPaymentModalVisible(false);
	};

	const openEditPaymentModal = () => {
		setIsEditPaymentModalVisible(true);
	};

	const closeEditPaymentModal = () => {
		setIsEditPaymentModalVisible(false);
	};

	const openViewPaymentModal = () => {
		setIsViewPaymentModalVisible(true);
	};

	const closeViewPaymentModal = () => {
		setIsViewPaymentModalVisible(false);
	};

	const exportToExcel = () => {
		try {
			console.log("data", list)
			const ws = utils.json_to_sheet(list);
			const wb = utils.book_new();
			utils.book_append_sheet(wb, ws, "Payment");

			writeFile(wb, "PaymentData.xlsx");
			message.success("Data exported successfully!");
		} catch (error) {
			console.error("Error exporting to Excel:", error);
			message.error("Failed to export data. Please try again.");
		}
	};
	const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'method'
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
			sorter: (a, b) => utils.antdTableSorter(a, b, 'client')
		},
		{
			title: 'Project',
			dataIndex: 'project',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'project')
		},
		{
			title: 'Method',
			dataIndex: 'method',
			render: (_, record) => (
				<><Tag color={getPaymentStatus(record.method)}>{record.method}</Tag></>
			),
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
								placeholder="method"
							>
								<Option value="All">All method </Option>
								{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
					</Flex>
					<Flex gap="7px" className="flex">
						<Button type="primary" className="ml-2" onClick={openAddPaymentModal}>
							<PlusOutlined />
							<span className="ml-2">New</span>
						</Button>
						<Button
							type="primary"
							icon={<FileExcelOutlined />}
							onClick={exportToExcel} // Call export function when the button is clicked
							block
						>
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
			</Card>
			<Card>
				<Modal
					title="Add Payment"
					visible={isAddPaymentModalVisible}
					onCancel={closeAddPaymentModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<AddPayment onClose={closeAddPaymentModal} />
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
