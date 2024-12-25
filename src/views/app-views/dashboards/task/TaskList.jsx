/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';
import OrderListData from "../../../../assets/data/order-list.data.json"
// import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import StatisticWidget from 'components/shared-components/StatisticWidget';
// import {
// 	AnnualStatisticData,
// } from '../../../dashboards/default/DefaultDashboardData';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import ViewTask from './ViewTask';
import { useNavigate } from 'react-router-dom';
import AddTask from "./AddTask";
import EditTask from "./EditTask"
// import EditExpenses from "./EditExpenses"
// import ViewExpenses from './ViewExpenses';

const { Option } = Select

const getOrderStatus = status => {
	if (status === 'Normal') {
		return 'success'
	}
	if (status === 'Shipped') {
		return 'warning'
	}
	return ''
}

const orderStatusList = ['Normal', 'Expired']
const TaskList = () => {
	// const [annualStatisticData] = useState(AnnualStatisticData);

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])


	const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
	const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
	const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);

	const navigate = useNavigate();
	// Open Add Job Modal
	const openAddTaskModal = () => {
		setIsAddTaskModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddTaskModal = () => {
		setIsAddTaskModalVisible(false);
	};

	// Open Add Job Modal
	const openEditTaskModal = () => {
		setIsEditTaskModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditTaskModal = () => {
		setIsEditTaskModalVisible(false);
	};

	const openviewTaskModal = () => {
		navigate('/app/apps/project/task/viewtask')
	};



	const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'status';
			const data = utils.filterArray(OrderListData, key, value)
			setList(data)
		} else {
			setList(OrderListData)
		}
	}

	

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center" onClick={openviewTaskModal}>
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
				<Flex alignItems="center" onClick={openEditTaskModal}>
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
			title: 'Id',
			dataIndex: 'id'
		},
		{
			title: 'Title',
			dataIndex: 'title',
			sorter: {
				compare: (a, b) => a.description.length - b.description.length,
			},
		},
		{
			title: 'Project',
			dataIndex: 'project',
			sorter: {
				compare: (a, b) => a.description.length - b.description.length,
			},
		},
		{
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (
				<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'startdate')
		},
		// {
		// 	title: 'Due Date',
		// 	dataIndex: 'duedate',
		// 	render: (_, record) => (
		// 		<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'startdate')
		// },
		// {
		// 	title: 'Estimated Time',
		// 	dataIndex: 'estimatedtime',
		// 	sorter: {
		// 		compare: (a, b) => a.description.length - b.description.length,
		// 	},
		// },
		// {
		// 	title: 'Hours Logged',
		// 	dataIndex: 'hourslogged',
		// 	sorter: {
		// 		compare: (a, b) => a.description.length - b.description.length,
		// 	},
		// },
		{
			title: 'Assigned To',
			dataIndex: 'description',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={30} src={record.image} />
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'description')
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (_, record) => (
				<><Tag color={getOrderStatus(record.status)}>{record.status}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'orderStatus')
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
				{/* <Row gutter={16}>
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
				</Row> */}
				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
					<Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false} >
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
								<Option value="All">All Status </Option>
								{orderStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div>
					</Flex>
					<Flex gap="7px" className="flex">
						<Button type="primary" className="flex items-center" onClick={openAddTaskModal}>
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
			</Card>

			<Card>
				<Modal
					title="Add Task"
					visible={isAddTaskModalVisible}
					onCancel={closeAddTaskModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<AddTask onClose={closeAddTaskModal} />
				</Modal>

				<Modal
					title="Edit Task"
					visible={isEditTaskModalVisible}
					onCancel={closeEditTaskModal}
					footer={null}
					width={800}
					className='mt-[-70px]'


				>
					<EditTask onClose={closeEditTaskModal} />
				</Modal>


				{/* <Modal
					title="Task"
					visible={isViewTaskModalVisible}
					onCancel={closeViewTaskModal}
					footer={null}
					width={1200}
					className='mt-[-70px]'


				>
					<ViewTask onClose={closeViewTaskModal} />
				</Modal> */}
			</Card>
		</>
	)
}

export default TaskList;
