/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal, Row, Col } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'

import utils from 'utils'
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AddSources from './AddSources';
import EditSources from './EditSources';


const { Option } = Select

const paymentStatusList = ['paypal']

const SourcesList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddSourcesModalVisible, setIsAddSourcesModalVisible] = useState(false);
	const [isEditSourcesModalVisible, setIsEditSourcesModalVisible] = useState(false);
	const [isViewSourcesModalVisible, setIsViewSourcesModalVisible] = useState(false);
	const [paymentStatisticData] = useState(PaymentStatisticData);

	// Open Add Job Modal
	const openAddSourcesModal = () => {
		setIsAddSourcesModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddSourcesModal = () => {
		setIsAddSourcesModalVisible(false);
	};

	// Open Add Job Modal
	const openEditSourcesModal = () => {
		setIsEditSourcesModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditSourcesModal = () => {
		setIsEditSourcesModalVisible(false);
	};

	// Open Add Job Modal
	const openViewSourcesModal = () => {
		setIsViewSourcesModalVisible(true);
	};

	// Close Add Job Modal
	const closeViewSourcesModal = () => {
		setIsViewSourcesModalVisible(false);
	};


	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center" onClick={openEditSourcesModal}>
					<EditOutlined />
					<span className="ml-2">Edit</span>
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
			title: 'Source',
			dataIndex: 'source',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'source')
		},

		{
			title: 'Action',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="flex space-x-2">
                  <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditSourcesModal}>
                    <EditOutlined className=' text-xl' />
                  </button>
                  <button className="p-2 text-pink-500 hover:bg-pink-50 rounded-md transition-colors duration-200">
                    <DeleteOutlined className='text-xl' />
                  </button>
                </div>
				// <div className="text-center">
				// 	<EllipsisDropdown menu={dropdownMenu(elm)} />
				// </div>
			)
		}
	];


	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : OrderListData
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}

	return (
		<>
			<div className='flex justify-between items-center mb-4'>
				<div className='flex items-center'>
					<h1 className='text-lg font-bold'>Manage Sources</h1>
				</div>
				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
					<div className='flex justify-end'>
						<Button type="primary" onClick={openAddSourcesModal}>
							<PlusOutlined />
						</Button>
					</div>
				</Flex>
			</div>
			<Card>
				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
					<Flex className="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>

					</Flex>
					{/* <Flex gap="7px" className="flex">
						<Button type="primary" className="ml-2" onClick={openAddPaymentModal}>
							<PlusOutlined />
							<span className="ml-2">New</span>
						</Button>
					</Flex> */}
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

			<Modal
				title="Add Sources"
				visible={isAddSourcesModalVisible}
				onCancel={closeAddSourcesModal}
				footer={null}
				width={700}
			// className='mt-[-70px]'
			>
				<AddSources onClose={closeAddSourcesModal} />
			</Modal>
			<Modal
				title="Edit Sources"
				visible={isEditSourcesModalVisible}
				onCancel={closeEditSourcesModal}
				footer={null}
				width={700}
			// className='mt-[-70px]'
			>
				<EditSources onClose={closeEditSourcesModal} />
			</Modal>

		</>
	)
}

export default SourcesList