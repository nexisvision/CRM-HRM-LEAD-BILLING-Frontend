import React, { Component, useState } from 'react'
import Flex from 'components/shared-components/Flex'
import StatisticWidget from 'components/shared-components/StatisticWidget';
import { 
	AnnualStatisticData, 
  } from '../../../dashboards/default/DefaultDashboardData';
import { Row, Card, Col, Table, Select, Input, Button, Badge,Modal, Menu, Tag } from 'antd';
import NumberFormat from 'react-number-format';
import OrderListData from "assets/data/order-list.data.json"
import { EyeOutlined, FileExcelOutlined, SearchOutlined, PlusCircleOutlined,EditOutlined,DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import dayjs from 'dayjs'; 
import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant'
import utils from 'utils'
import EditTicket from './EditTicket';
import AddTicket from './AddTicket';
import ViewTicket from './ViewTicket';



const { Column } = Table;

const { Option } = Select

const getPaymentStatus = status => {
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

const getShippingStatus = status => {
	if(status === 'Ready') {
		return 'blue'
	}
	if(status === 'Shipped') {
		return 'cyan'
	}
	return ''
}

const paymentStatusList = ['Normal', 'UNNormal', 'Expired']

export const TicketList = () => {

	const [annualStatisticData] = useState(AnnualStatisticData);
	const [list, setList] = useState(OrderListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [isAddTicketModalVisible, setIsAddTicketModalVisible] = useState(false);
    const [isEditTicketModalVisible, setIsEditTicketModalVisible] = useState(false);
    const [isViewTicketModalVisible, setIsViewTicketModalVisible] = useState(false);





  // Open Add Job Modal
  const openAddTicketModal = () => {
    setIsAddTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddTicketModal = () => {
    setIsAddTicketModalVisible(false);
  };

   // Open Add Job Modal
   const openEditTicketModal = () => {
    setIsEditTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditTicketModal = () => {
    setIsEditTicketModalVisible(false);
  };

  const openViewTicketModal = () => {
    setIsViewTicketModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewTicketModal = () => {
    setIsViewTicketModalVisible(false);
  };

	const handleShowStatus = value => {
		if(value !== 'All') {
			const key = 'priority'
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
            onClick={openViewTicketModal}
            size="small"
          >
			
			
					<span className="ml-2">View Details</span>
			</Button>
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
            onClick={openEditTicketModal}
            size="small"
          >
			
					<span className="ml-2">Edit</span>
			</Button>
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
			title: 'ID',
			dataIndex: 'id'
		},
		{
			title: 'Subject',
			dataIndex: 'subject',
			sorter: {
				compare: (a, b) => a.subject.length - b.subject.length,
			},
		},
		{
			title: 'Client',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					<AvatarStatus size={30} src={record.image} name={record.name}/>
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'User',
			dataIndex: 'user',
			sorter: {
				compare: (a, b) => {
					a = a.user.toLowerCase();
					  b = b.user.toLowerCase();
					return a > b ? -1 : b > a ? 1 : 0;
				},
			},
		},
		
		// {
		// 	title: 'Project List',
		// 	dataIndex: 'project',
		// 	sorter: {
		// 		compare: (a, b) => a.project.length - b.project.length,
		// 	},
		// },
		{
			title: 'Date',
			dataIndex: 'date',
			render: (_, record) => (
				<span>{dayjs.unix(record.date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'date')
		},
		
		{
			title: 'Priority',
			dataIndex: 'priority',
			sorter: {
				compare: (a, b) => a.priority.length - b.priority.length,
			},
		},
		{
			title: 'Activity',
			dataIndex: 'activity',
			sorter: {
				compare: (a, b) => a.activity.length - b.activity.length,
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (_, record) => (
				<><Tag color={getShippingStatus(record.status)}>{record.status}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
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
			<div className="container">

			
<Row gutter={16}>
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
          </Row>
		  <Card>
			<Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
				<Flex className="mb-1" mobileFlex={false}>
					<div className="mr-md-3 mb-3">
						<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)}/>
					</div>
					<div className="mb-3">
						<Select 
							defaultValue="All" 
							className="w-100" 
							style={{ minWidth: 180 }} 
							onChange={handleShowStatus} 
							placeholder="Status"
						>
							<Option value="All">All priority </Option>
							{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
						</Select>
					</div>
				</Flex>
								
				<Flex alignItems="center" justifyContent="space-between" gap="7px">
				
				<Button type="primary" className="ml-2" onClick={openAddTicketModal}>
								<PlusOutlined />
								<span>New</span>
							</Button>
					<Button type="primary" icon={<FileExcelOutlined />} block>Export All</Button>
				</Flex>
			</Flex>
			<div className="table-responsive">
				<Table 
					columns={tableColumns} 
					dataSource={list} 
					rowKey='id' 
					rowSelection={{
						selectedRowKeys: selectedRowKeys,
						type: 'checkbox',
						preserveSelectedRowKeys: false,
						...rowSelection,
					}}
				/>
			</div>
            <Modal
        title="Create Ticket"
        visible={isAddTicketModalVisible}
        onCancel={closeAddTicketModal}
        footer={null}
        width={1000}
        // className='mt-[-70px]'
        // height={1000}
      >
        <AddTicket onClose={closeAddTicketModal} />
      </Modal>

      <Modal
        title="Edit Ticket"
        visible={isEditTicketModalVisible}
        onCancel={closeEditTicketModal}
        footer={null}
        width={1000}
        // height={1000}
      >
        <EditTicket onClose={closeEditTicketModal} />
      </Modal>
      <Modal
        title="View Ticket"
        visible={isViewTicketModalVisible}
        onCancel={closeViewTicketModal}
        footer={null}
        width={1000}
        // height={1000}
      >
        <ViewTicket onClose={closeViewTicketModal} />
      </Modal>
		</Card>
		</div>
        );
	}
	


export default TicketList
