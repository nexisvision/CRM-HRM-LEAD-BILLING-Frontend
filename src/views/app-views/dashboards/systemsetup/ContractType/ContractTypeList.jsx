/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal ,Row,Col} from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';

// import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import StatisticWidget from 'components/shared-components/StatisticWidget';

const { Option } = Select

const paymentStatusList = ['paypal']

const ContractTypeList = () => {

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
					<DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	const tableColumns = [
		{
			title: 'Name',
			dataIndex: 'name',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
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
				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
					<Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
						
					</Flex>
					<Flex gap="7px" className="flex">
						<Button type="primary" className="ml-2" onClick={openAddPaymentModal}>
							<PlusOutlined />
							<span className="ml-2">New</span>
						</Button>
					</Flex>
				</Flex>
				<div className="table-responsive">
					<Table
						columns={tableColumns}
						dataSource={list}
						rowKey='id'
						// scroll={{x:1000}}
						// rowSelection={{
						// 	selectedRowKeys: selectedRowKeys,
						// 	type: 'checkbox',
						// 	preserveSelectedRowKeys: false,
						// 	...rowSelection,
						// }}
					/>
				</div>
			</Card>
		
		</>
	)
}

export default ContractTypeList
