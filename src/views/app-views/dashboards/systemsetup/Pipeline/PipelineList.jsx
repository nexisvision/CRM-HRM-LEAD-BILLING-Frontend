/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal ,Row,Col} from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import AddPipeLine from './AddPipeLine';
import EditPipeLine from './EditPipeLine';

const { Option } = Select


const PipelineList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddPipeLineModalVisible, setIsAddPipeLineModalVisible] = useState(false);
	const [isEditPipeLineModalVisible, setIsEditPipeLineModalVisible] = useState(false);


	// Open Add Job Modal
	const openAddPipeLineModal = () => {
		setIsAddPipeLineModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddPipeLineModal = () => {
		setIsAddPipeLineModalVisible(false);
	};

	// Open Add Job Modal
	const openEditPipeLineModal = () => {
		setIsEditPipeLineModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditPipeLineModal = () => {
		setIsEditPipeLineModalVisible(false);
	};


	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center" onClick={openEditPipeLineModal}>
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
			title: 'Pipeline',
			dataIndex: 'pipeline',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'pipeline')
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
					title="Add Pipeline"
					visible={isAddPipeLineModalVisible}
				    onCancel={closeAddPipeLineModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
					<AddPipeLine onClose={closeAddPipeLineModal} />
			</Modal>
            <Modal
					title="Edit Pipeline"
					visible={isEditPipeLineModalVisible}
				    onCancel={closeEditPipeLineModal}
					footer={null}
					width={700}
					className='mt-[-70px]'
				>
					<EditPipeLine onClose={closeEditPipeLineModal} />
			</Modal>
		
		</>
	)
}

export default PipelineList
