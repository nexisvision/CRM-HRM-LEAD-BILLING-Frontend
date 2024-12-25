/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json"
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
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
import AddCrediteNotes from './AddCrediteNotes';
import EditCrediteNotes from './EditCreditNotes';
import ViewCreditNotes from './ViewCreditNotes';
// import  from './AddEstimates';
// import EditEstimates from './EditEstimates';
// import ViewEstimates from './ViewEstimates';

const { Option } = Select


const CreditNotesList = () => {
	// const [annualStatisticData] = useState(AnnualStatisticData);

	const [list, setList] = useState(OrderListData)
	const [selectedRowKeys, setSelectedRowKeys] = useState([])

	const [isAddCreditNotesModalVisible, setIsAddCreditNotesModalVisible] = useState(false);
	const [isEditCreditNotesModalVisible, setIsEditCreditNotesModalVisible] = useState(false);
	const [isViewCreditNotesModalVisible, setIsViewCreditNotesModalVisible] = useState(false);


	// Open Add Job Modal
	const openAddCreditNotesModal = () => {
		setIsAddCreditNotesModalVisible(true);
	};

	// Close Add Job Modal
	const closeAddCreditNotesModal = () => {
		setIsAddCreditNotesModalVisible(false);
	};

	// Open Add Job Modal
	const openEditCreditNotesModal = () => {
		setIsEditCreditNotesModalVisible(true);
	};

	// Close Add Job Modal
	const closeEditCreditNotesModal = () => {
		setIsEditCreditNotesModalVisible(false);
	};

	const openviewCreditNotesModal = () => {
		setIsViewCreditNotesModalVisible(true);
	};

	// Close Add Job Modal
	const closeViewCreditNotesModal = () => {
		setIsViewCreditNotesModalVisible(false);
	};

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<EyeOutlined />}
						onClick={openviewCreditNotesModal}
						size="small"
					>
						<span className="">View Details</span>
					</Button>
				</Flex>
			</Menu.Item>
			<Menu.Item>
				<Flex alignItems="center" onClick={openEditCreditNotesModal}>
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
			title: 'Invoice',
			dataIndex: 'invoice'
		},
		

		{
			title: 'Customer',
			dataIndex: 'customer',
			sorter: {
				compare: (a, b) => a.customer.length - b.customer.length,
			},
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
			title: 'Description',
			dataIndex: 'description',
			sorter: {
				compare: (a, b) => a.description.length - b.description.length,
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
					<Flex cclassName="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48 me-2">
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
						
					</Flex>

					<Flex gap="7px" className="flex">
						<Button type="primary" className="flex items-center"onClick={openAddCreditNotesModal}>
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
						scroll={{x:1200}}
						// rowSelection={{
						// 	selectedRowKeys: selectedRowKeys,
						// 	type: 'checkbox',
						// 	preserveSelectedRowKeys: false,
						// 	...rowSelection,
						// }}
					/>
				</div>
			</Card>

			<Card>
				<Modal
					title="Add Credite Notes"
					visible={isAddCreditNotesModalVisible}
					onCancel={closeAddCreditNotesModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<AddCrediteNotes onClose={closeAddCreditNotesModal} />
				</Modal>

				<Modal
					title="Edit Credite Notes"
					visible={isEditCreditNotesModalVisible}
					onCancel={closeEditCreditNotesModal}
					footer={null}
					width={800}
					className='mt-[-70px]'

				>
					<EditCrediteNotes onClose={closeEditCreditNotesModal} />
				</Modal>

				<Modal
					title="View Credite Notes"
					visible={isViewCreditNotesModalVisible}
					onCancel={closeViewCreditNotesModal}
					footer={null}
					width={1000}
					className='mt-[-70px]'

				>
					<ViewCreditNotes onClose={closeViewCreditNotesModal} />
				</Modal>
			</Card>
		</>
	)
}

export default CreditNotesList;
