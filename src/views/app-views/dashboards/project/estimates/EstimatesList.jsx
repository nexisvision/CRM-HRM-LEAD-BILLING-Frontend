/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Card, Table, Select, Input, Button, Menu, Modal, Dropdown } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, FileExcelOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { deleteestimate, getallestimate } from "../estimates/estimatesReducer/EstimatesSlice"
import utils from 'utils';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddEstimates from './AddEstimates';
import EditEstimates from './EditEstimates';
import ViewEstimates from './ViewEstimates';
import { GetLeads } from '../../leads/LeadReducers/LeadSlice'



const EstimatesList = () => {
	const [idd, setIdd] = useState("");

	const { estimates } = useSelector((state) => state.estimate);
	const leadsState = useSelector((state) => state.Lead?.Lead) || {};  // Safely access Lead state
	const leads = leadsState?.data || [];  // Safely access leads data

	const [list, setList] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])

	const [isAddEstimatesModalVisible, setIsAddEstimatesModalVisible] = useState(false);
	const [isEditEstimatesModalVisible, setIsEditEstimatesModalVisible] = useState(false);
	const [isViewEstimatesModalVisible, setIsViewEstimatesModalVisible] = useState(false);
	const [selectedEstimateId, setSelectedEstimateId] = useState(null);
	const dispatch = useDispatch();
	const { id } = useParams();
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		dispatch(getallestimate(id));
		dispatch(GetLeads());
	}, [dispatch, id]);

	useEffect(() => {
		if (estimates) {
			setList(estimates);
		}
	}, [estimates]);

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

	const closeViewEstimatesModal = () => {
		setIsViewEstimatesModalVisible(false);
	};

	const EditFun = (exid) => {
		openEditEstimatesModal();
		setIdd(exid);
	};

	const delfun = (idd) => {
		dispatch(deleteestimate(idd))
			.then(() => {
				setList(list.filter((item) => item.id !== idd));
				dispatch(getallestimate(id))
			})
	}

	const getDropdownItems = (row) => [
		{
			key: 'view',
			icon: <EyeOutlined />,
			label: 'View Details',
			onClick: () => {
				setSelectedEstimateId(row.id);
				openviewEstimatesModal();
			}
		},
		{
			key: 'edit',
			icon: <EditOutlined />,
			label: 'Edit',
			onClick: () => EditFun(row.id)
		},
		{
			key: 'delete',
			icon: <DeleteOutlined />,
			label: 'Delete',
			onClick: () => delfun(row.id),
			danger: true
		}
	];

	const tableColumns = [
		{
			title: 'Estimate Number',
			dataIndex: 'quotationNumber',
			render: (text, record) => (
				<span
					className=" cursor-pointer hover:underline"
					onClick={() => {
						setSelectedEstimateId(record.id);
						openviewEstimatesModal();
					}}
				>
					{text}
				</span>
			)
		},
		{
			title: 'Valid Till',
			dataIndex: 'valid_till',
			render: (date) => dayjs(date).format("DD/MM/YYYY"),
			sorter: (a, b) => new Date(a.valid_till) - new Date(b.valid_till),
		},
		{
			title: 'Client',
			dataIndex: 'client',
			render: (client) => (
				<span>{client || 'N/A'}</span>
			),
			sorter: (a, b) => (a.client || '').localeCompare(b.client || ''),
		},
		{
			title: 'Lead',
			dataIndex: 'lead',
			render: (leadId) => {
				const lead = leads.find(l => l.id === leadId);
				return <span>{lead?.leadTitle || 'N/A'}</span>;
			},
			sorter: (a, b) => {
				const leadNameA = leads.find(l => l.id === a.lead)?.leadTitle || '';
				const leadNameB = leads.find(l => l.id === b.lead)?.leadTitle || '';
				return leadNameA.localeCompare(leadNameB);
			},
		},
		{
			title: 'Currency',
			dataIndex: 'currency',
			key: 'currency',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'currency')
		},
		{
			title: 'Amount',
			dataIndex: 'total',
			render: (_, record) => (
				<span className="font-weight-semibold">
					<NumberFormat
						displayType={'text'}
						value={(Math.round(record.total * 100) / 100).toFixed(2)}
						prefix={'$'}
						thousandSeparator={true}
					/>
				</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'total')
		},
		{
			title: 'Action',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-center" onClick={(e) => e.stopPropagation()}>
					<Dropdown
						overlay={<Menu items={getDropdownItems(elm)} />}
						trigger={['click']}
						placement="bottomRight"
					>
						<Button
							type="text"
							className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
							style={{
								borderRadius: '10px',
								padding: 0
							}}
						>
							<MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
						</Button>
					</Dropdown>
				</div>
			)
		}
	];

	const onSearch = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchText(value);

		if (!value) {
			setList(estimates);
			return;
		}

		const filtered = estimates.filter(estimate => {
			const leadName = leads.find(l => l.id === estimate.lead)?.lead_name || '';

			return (
				estimate.quotationNumber?.toLowerCase().includes(value) ||
				estimate.client?.toLowerCase().includes(value) ||
				leadName.toLowerCase().includes(value) ||
				dayjs(estimate.valid_till).format("DD/MM/YYYY").includes(value) ||
				estimate.total?.toString().includes(value)
			);
		});

		setList(filtered);
	};

	const getFilteredEstimates = () => {
		if (!list) return [];

		let filtered = list;

		if (searchText) {
			filtered = filtered.filter(estimate =>
				estimate.quotationNumber?.toLowerCase().includes(searchText.toLowerCase())
			);
		}

		return filtered;
	};

	const styles = `
		.ant-dropdown-trigger {
			transition: all 0.3s;
		}

		.ant-dropdown-trigger:hover {
			transform: scale(1.05);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		}

		.ant-menu-item {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
		}

		.ant-menu-item:hover {
			background-color: #f0f7ff;
		}

		.ant-menu-item-danger:hover {
			background-color: #fff1f0;
		}

		.table-responsive {
			overflow-x: auto;
		}

		.search-input {
			transition: all 0.3s;
		}

		.search-input:hover,
		.search-input:focus {
			border-color: #40a9ff;
			box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
		}
	`;

	return (
		<>
			<style>{styles}</style>
			<Card>

				<Flex alignItems="center" justifyContent="space-between" mobileFlex={false} className='flex flex-wrap  gap-4'>
					<Flex cclassName="flex flex-wrap gap-4 mb-4 md:mb-0" mobileFlex={false}>
						<div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48 me-2">
							<Input placeholder="Search by estimate #, client, lead..." prefix={<SearchOutlined />} onChange={onSearch} value={searchText} allowClear className="search-input" />
						</div>
					</Flex>

					<Flex gap="7px" className="flex">
						<Button type="primary" className="flex items-center" onClick={openAddEstimatesModal}>
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
						dataSource={getFilteredEstimates()}
						rowKey='id'
						scroll={{ x: 1200 }}
						pagination={{
							total: getFilteredEstimates().length,
							pageSize: 10,
							showSizeChanger: true,
							showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
						}}
					/>
				</div>
			</Card>

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
				<EditEstimates onClose={closeEditEstimatesModal} idd={idd} />
			</Modal>

			<Modal
				title={<h2 className="text-2xl font-medium">View Estimate</h2>}
				visible={isViewEstimatesModalVisible}
				onCancel={closeViewEstimatesModal}
				footer={null}
				width={1000}
				className='mt-[-70px]'

			>
				<ViewEstimates estimateId={selectedEstimateId} />
			</Modal>

		</>
	)
}

export default EstimatesList

