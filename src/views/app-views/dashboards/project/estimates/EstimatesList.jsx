/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal, message } from 'antd';
// import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { TiPinOutline } from "react-icons/ti";
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
import { deleteestimate, getallestimate } from "../estimates/estimatesReducer/EstimatesSlice"
import utils from 'utils';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddEstimates from './AddEstimates';
import EditEstimates from './EditEstimates';
import ViewEstimates from './ViewEstimates';

const { Option } = Select

const getShippingStatus = orderStatus => {
	if (orderStatus === 'Ready') {
		return 'blue'
	}
	if (orderStatus === 'Shipped') {
		return 'cyan'
	}
	return ''
}

const orderStatusList = ['Ready', 'Shipped']

const EstimatesList = () => {
    const [idd, setIdd] = useState("");

	const { estimates, loading, error } = useSelector((state) => state.estimate);

	const [list, setList] = useState([])
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])

	const [isAddEstimatesModalVisible, setIsAddEstimatesModalVisible] = useState(false);
	const [isEditEstimatesModalVisible, setIsEditEstimatesModalVisible] = useState(false);
	const [isViewEstimatesModalVisible, setIsViewEstimatesModalVisible] = useState(false);
	const [selectedEstimateId, setSelectedEstimateId] = useState(null);
	const dispatch = useDispatch();
	const { id } = useParams();

	useEffect(() => {
		dispatch(getallestimate(id));
	}, [dispatch, id]);

	useEffect(() => {
		if(estimates){
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

	const handleShowStatus = value => {
		if (value !== 'All') {
			const key = 'orderStatus'
			const data = utils.filterArray(estimates, key, value)
			setList(data)
		} else {
			setList(estimates)
		}
	}

	const EditFun = (exid) => {
        openEditEstimatesModal();
        setIdd(exid);
    };

	const delfun = (idd)=>{
		dispatch(deleteestimate(idd))
			.then(()=>{
				setList(list.filter((item) => item.id !== idd));
				dispatch(getallestimate(id))
			})
	}

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item>
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<EyeOutlined />}
						onClick={() => {
							setSelectedEstimateId(row.id);
							openviewEstimatesModal();
						}}
						size="small"
					>
						<span className="">View Details</span>
					</Button>
				</Flex>
			</Menu.Item>
			{/* <Menu.Item>
				<Flex alignItems="center">
					<PlusCircleOutlined />
					<span className="ml-2">Add to remark</span>
				</Flex>
			</Menu.Item> */}

			<Menu.Item>
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<EditOutlined />}
						onClick={() => EditFun(row.id)}
						size="small"
					>
						<span className="">Edit</span>
					</Button>
				</Flex>
			</Menu.Item>
			{/* <Menu.Item>
				<Flex alignItems="center">
					<TiPinOutline />
					<span className="ml-2">Pin</span>
				</Flex>
			</Menu.Item> */}
			<Menu.Item>
				{/* <Flex alignItems="center" onClick={()=> delfun(row.id)}>
					<DeleteOutlined />
					<span className="ml-2">Delete</span>
				</Flex> */}
				<Flex alignItems="center">
					<Button
						type=""
						className=""
						icon={<DeleteOutlined />}
						onClick={()=> delfun(row.id)}
						size="small"
					>
						<span className="">Delete</span>
					</Button>
				</Flex>
			</Menu.Item>
		</Menu>
	);

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
			title: 'Date',
			 dataIndex: "valid_till",
				  render: (date) => dayjs(date).format("DD/MM/YYYY"),
				  sorter: (a, b) => new Date(a.valid_till) - new Date(b.valid_till),
		},
		{
			title: 'Created By',
			dataIndex: 'created_by',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={30} src={record.image} name={record.created_by} />
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'created_by')
		},

		{
			title: 'Tax',
			dataIndex: 'tax',
			render: (_, record) => <span>{record.tax}</span>,
			sorter: (a, b) => utils.antdTableSorter(a, b, 'tax')
		},
		
		{
			title: 'Currency',
			dataIndex: 'currency',
			key: 'currency',
			sorter: (a, b) => utils.antdTableSorter(a, b, 'currency')
		},
		// {
		// 	title: 'Project',
		// 	dataIndex: 'project',
		// 	key: 'project',
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'project')
		// },
		
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
			title: 'Status',
			dataIndex: 'orderStatus',
			render: (_, record) => (
				<><Tag color={getShippingStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
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
		const searchArray = e.currentTarget.value ? list : estimates
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
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={() => onSearch()}
            />
						</div>
						{/* <div className="w-full md:w-48 ">
							<Col span={12}>
        
        </Col>
						</div> */}
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
						dataSource={estimates}
						rowKey='id'
						scroll={{ x: 1200 }}
					
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
					<EditEstimates onClose={closeEditEstimatesModal} idd={idd}/>
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
			</Card>
		</>
	)
}

export default EstimatesList

