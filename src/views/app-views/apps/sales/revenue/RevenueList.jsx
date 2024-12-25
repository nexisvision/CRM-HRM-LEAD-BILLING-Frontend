/* eslint-disable no-unused-vars */
import React, {useState} from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag,Modal } from 'antd';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined,DeleteOutlined,EditOutlined,PlusOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs'; 
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import AddRevenue from "./AddRevenue"
import EditRevenue from './EditRevenue';

const { Option } = Select

const getRevenueStatus = status => {
	if(status === 'Paid') {
		return 'success'
	}
	if(status === 'Pending') {
		return 'warning'
	}
	if(status === 'Expired') {
		return 'error'
	}
	return ''
}

// const getShippingStatus = status => {
// 	if(status === 'Ready') {
// 		return 'blue'
// 	}
// 	if(status === 'Shipped') {
// 		return 'cyan'
// 	}
// 	return ''
// }

const revenueStatusList = ['Paid', 'Pending', 'Expired']

const RevenueList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddRevenueModalVisible, setIsAddRevenueModalVisible] = useState(false);
	const [isEditRevenueModalVisible, setIsEditRevenueModalVisible] = useState(false);

	// Open Add Job Modal
	const openAddRevenueModal = () => {
		setIsAddRevenueModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddRevenueModal = () => {
		setIsAddRevenueModalVisible(false);
	};

	// Open Add Job Modal
	const openEditRevenueModal = () => {
		setIsEditRevenueModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditRevenueModal = () => {
		setIsEditRevenueModalVisible(false);
	};

	const handleShowStatus = value => {
		if(value !== 'All') {
			const key = 'revenueStatus'
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
				<Flex alignItems="center" onClick={openEditRevenueModal}>
					{<EditOutlined />}
						<span className="ml-2">Edit</span>
				</Flex>
			</Menu.Item>
			<Menu.Item>
				<Flex alignItems="center">
					<TiPinOutline  />
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
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (
				<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'amount')
		},
		{
			title: 'Account',
			dataIndex: 'account',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'account')
		},
		{
			title: 'Customer',
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'customer')
		},
		{
			title: 'Category',
			dataIndex: 'category',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
		},
		{
			title: 'Reference',
			dataIndex: 'reference',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'reference')
		},
		{
			title: 'Description',
			dataIndex: 'description',
			sorter: {
				compare: (a, b) => a.description.length - b.description.length,
			},
		},
		{
			title: 'Payment Receipt',
			dataIndex: 'paymentreceipt',
			sorter: {
				compare: (a, b) => a.method.length - b.method.length,
			},
		},
		{
			title: 'Action',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center">
					<EllipsisDropdown menu={dropdownMenu(elm)}/>
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
		const searchArray = e.currentTarget.value? list : OrderListData
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}

	return (
		<>
		<Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
				<Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
					<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
					<div className="w-full md:w-48">
						<Select 
							defaultValue="All" 
							className="w-full" 
							style={{ minWidth: 180 }} 
							onChange={handleShowStatus} 
							placeholder="Status"
						>
							<Option value="All">All Revenue</Option>
							{revenueStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
						</Select>
					</div>
				</Flex>
				<Flex gap="7px" className="flex">
						<Button type="primary" className="ml-2" onClick={openAddRevenueModal}>
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
					scroll={{x:1800}}
					rowSelection={{
						selectedRowKeys: selectedRowKeys,
						// type: 'checkbox',
						preserveSelectedRowKeys: false,
						...rowSelection,
					}}
				/>
			</div>
		</Card>
		<Card>
				<Modal
					title="Create Revenue"
					visible={isAddRevenueModalVisible}
					onCancel={closeAddRevenueModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<AddRevenue onClose={closeAddRevenueModal} />
				</Modal>

				<Modal
					title="Edit Revenue"
					visible={isEditRevenueModalVisible}
					onCancel={closeEditRevenueModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<EditRevenue onClose={closeEditRevenueModal} />
				</Modal>
			</Card>
		</>
	)
}

export default RevenueList
