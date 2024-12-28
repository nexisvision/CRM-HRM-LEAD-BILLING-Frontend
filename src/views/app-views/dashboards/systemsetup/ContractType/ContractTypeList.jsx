/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Tag, Modal ,Row,Col} from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'
import { PaymentStatisticData } from '../../../dashboards/default/DefaultDashboardData';
import EditContractType from './EditContractType';
import AddContractType from './AddContractType';


const { Option } = Select

const paymentStatusList = ['paypal']

const ContractTypeList = () => {

	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [isAddContractTypeModalVisible, setIsAddContractTypeModalVisible] = useState(false);
	const [isEditContractTypeModalVisible, setIsEditContractTypeModalVisible] = useState(false);
	// Open Add Job Modal
	const openAddContractTypeModal = () => {
		setIsAddContractTypeModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddContractTypeModal = () => {
		setIsAddContractTypeModalVisible(false);
	};

	// Open Add Job Modal
	const openEditContractTypeModal = () => {
		setIsEditContractTypeModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditContractTypeModal = () => {
		setIsEditContractTypeModalVisible(false);
	};


	// const dropdownMenu = row => (
	// 	<Menu>
	// 		<Menu.Item>
	// 			<Flex alignItems="center" onClick={openEditContractTypeModal}>
	// 				<EditOutlined />
	// 				<span className="ml-2">Edit</span>
	// 			</Flex>
	// 		</Menu.Item>
	// 		<Menu.Item>
	// 			<Flex alignItems="center">
	// 				<DeleteOutlined />
	// 				<span className="ml-2">Delete</span>
	// 			</Flex>
	// 		</Menu.Item>
	// 	</Menu>
	// );

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
				<div className="flex space-x-2">
                  <button className="p-2 text-teal-500 hover:bg-teal-50 rounded-md transition-colors duration-200" onClick={openEditContractTypeModal}>
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
          <h1 className='text-lg font-bold'>Manage Contract Type</h1>
        </div>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap mt-2 gap-4'>
          <div className='flex justify-end'>
            <Button type="primary"  onClick={openAddContractTypeModal}>
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
				title="Add Contract Type"
				visible={isAddContractTypeModalVisible}
					onCancel={closeAddContractTypeModal}
				footer={null}
				width={700}
			// className='mt-[-70px]'
			>
				<AddContractType onClose={closeAddContractTypeModal} />
			</Modal>
			<Modal
				title="Edit Contract Type"
				visible={isEditContractTypeModalVisible}
				onCancel={closeEditContractTypeModal}
				footer={null}
				width={700}
			// className='mt-[-70px]'
			>
				<EditContractType onClose={closeEditContractTypeModal} />
			</Modal>
		
		</>
	)
}

export default ContractTypeList
