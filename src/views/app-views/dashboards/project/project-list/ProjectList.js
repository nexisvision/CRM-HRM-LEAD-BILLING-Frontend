import React, { useState } from 'react';
import { Table, Button, Tooltip, Tag, Progress, Avatar, Modal, Card, Radio, Row, Col, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, PaperClipOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ProjectListData from './ProjectListData';
import AddProject from './AddProject';
import EditProject from './EditProject';
import utils from 'utils';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt';
import Flex from 'components/shared-components/Flex';

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const ProjectList = () => {
	const [view, setView] = useState(VIEW_GRID);
	const [list, setList] = useState(ProjectListData);
	const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
	const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);

	// Open Add Project Modal
	const openAddProjectModal = () => setIsAddProjectModalVisible(true);
	const closeAddProjectModal = () => setIsAddProjectModalVisible(false);

	// Open Edit Project Modal
	const openEditProjectModal = () => setIsEditProjectModalVisible(true);
	const closeEditProjectModal = () => setIsEditProjectModalVisible(false);

	// Delete Project
	const deleteItem = (id) => {
		const updatedList = list.filter((item) => item.id !== id);
		setList(updatedList);
	};

	// Change Project View
	const onChangeProjectView = (e) => {
		setView(e.target.value);
	};

	// Generate Action Menu for Dropdown
	const dropdownMenu = (id) => (
		<Menu>
			<Menu.Item key="edit" onClick={() => openEditProjectModal(id)}>
				<EditOutlined /> Edit
			</Menu.Item>
			<Menu.Item key="delete" onClick={() => deleteItem(id)}>
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	// Table columns for list view
	const tableColumns = [
		{
			title: 'PROJECT',
			dataIndex: 'name',
			key: 'name',
			render: (name, record) => (
				<div>
					<h4 className="mb-0">{name}</h4>
					<span className="text-muted">{record.category}</span>
				</div>
			),
		},
		{
			title: 'Info',
			dataIndex: 'info',
			key: 'info',
			render: (_, record) => (
				<div>
					<Tooltip title="Attachment">
						<span className="mr-3">
							<PaperClipOutlined /> {record.attachmentCount}
						</span>
					</Tooltip>
					<Tooltip title="Task Completed">
						<span className="mr-3">
							<CheckCircleOutlined /> {record.completedTask}/{record.totalTask}
						</span>
					</Tooltip>
					<Tag color={record.statusColor}>
						<ClockCircleOutlined /> {record.dayleft} days left
					</Tag>
				</div>
			),
		},
		{
			title: 'COMPLETION',
			dataIndex: 'progression',
			key: 'progression',
			render: (progression) => (
				<Progress
					percent={progression}
					strokeColor={
						progression >= 80
							? 'green'
							: progression >= 60
								? 'orange'
								: 'red'
					}
					size="small"
				/>
			),
		},
		{
			title: 'USERS',
			dataIndex: 'member',
			key: 'member',
			render: (member) => (
				<div>
					{member.slice(0, 3).map((m, index) => (
						<Tooltip title={m.name} key={index}>
							<Avatar src={m.img}>
								{!m.img && utils.getNameInitial(m.name)}
							</Avatar>
						</Tooltip>
					))}
					{member.length > 3 && (
						<Tooltip title={`${member.length - 3} More`}>
							<Avatar size="small" className="text-black font-medium">
								+{member.length - 3}
							</Avatar>
						</Tooltip>
					)}
				</div>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, elm) => (
				<div className='text-center'>
					 <EllipsisDropdown menu={dropdownMenu(elm)} />
				</div>
			),
		},
	];

	return (
		<div>

			<PageHeaderAlt className="border-bottom">
				<div className="container-fluid">
					<Flex justifyContent="space-between" alignItems="center" className="py-4">
						<h2 className='text-xl font-medium'>Projects</h2>
						<div className='flex gap-3'>
							<Radio.Group defaultValue={VIEW_GRID} onChange={onChangeProjectView}>
								<Radio.Button value={VIEW_GRID}>
									<AppstoreOutlined />
								</Radio.Button>
								<Radio.Button value={VIEW_LIST}>
									<UnorderedListOutlined />
								</Radio.Button>
							</Radio.Group>
							<Button type="primary" icon={<PlusOutlined />} onClick={openAddProjectModal} className='flex items-center'>
								New Project
							</Button>
						</div>
					</Flex>
				</div>
			</PageHeaderAlt>

			<div className="my-4 container-fluid">
				{view === VIEW_LIST ? (
					<Table
						columns={tableColumns}
						dataSource={list}
						rowKey="id"
						scroll={1200}
					/>
				) : (
					<Row gutter={16}>
						{list.map((item) => {
							// Determine the color dynamically based on the days left
							let statusColor = '';
							if (item.dayleft > 10) {
								statusColor = 'green'; // Safe status
							} else if (item.dayleft > 5) {
								statusColor = 'orange'; // Warning status
							} else {
								statusColor = 'red'; // Critical status
							}

							return (
								<Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={item.id}>
									<Card

									><div className='flex items-center justify-between'>
											<div className=''>
												<p className='font-medium'>{item.name}</p>
												<p>{item.category}</p>

											</div>
											<div>
												<p>
													<Dropdown
													overlay={dropdownMenu(item.id)}
													trigger={['click']}
													placement="bottomRight"
													key="dropdown"
												>
													<Button type="text" icon={<EllipsisDropdown />}>
													</Button>
												</Dropdown></p>
											</div>

										</div>
										<p className="flex gap-4 mt-1">
											<span>
												<PaperClipOutlined />
												{item.attachmentCount}
											</span>
											<span>
												<CheckCircleOutlined />
												{item.completedTask}/{item.totalTask}
											</span>
											<span
												style={{
													color: statusColor,
													display: 'flex',
													alignItems: 'center',
													gap: '4px',
												}}
											>
												<ClockCircleOutlined />
												{item.dayleft} days left
											</span>
										</p>
										<p>
											<Progress
												percent={item.progression}
												strokeColor={
													item.progression >= 80
														? 'green'
														: item.progression >= 60
															? 'orange'
															: 'red'
												}
												size="small"
											/>
										</p>
										<div>
											{item.member.slice(0, 3).map((m, index) => (
												<Tooltip title={m.name} key={index}>
													<Avatar src={m.img}>
														{!m.img && utils.getNameInitial(m.name)}
													</Avatar>
												</Tooltip>
											))}
											{item.member.length > 3 && (
												<Tooltip title={`${item.member.length - 3} More`}>
													<Avatar size="small" className="text-black font-medium">
														+{item.member.length - 3}
													</Avatar>
												</Tooltip>
											)}
										</div>
									</Card>
								</Col>
							);
						})}
					</Row>
				)}
			</div>

			{/* Add Project Modal */}
			<Modal
				title="Add Project"
				visible={isAddProjectModalVisible}
				onCancel={closeAddProjectModal}
				footer={null}
				width={800}
				className='mt-[-70px]'
			>
				<AddProject onClose={closeAddProjectModal} />
			</Modal>

			{/* Edit Project Modal */}
			<Modal
				title="Edit Project"
				visible={isEditProjectModalVisible}
				onCancel={closeEditProjectModal}
				footer={null}
				width={800}
				className='mt-[-70px]'
			>
				<EditProject onClose={closeEditProjectModal} />
			</Modal>
		</div>
	);
};

export default ProjectList;












// import React, { useState } from 'react'
// import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
// import { Radio, Button, Row, Col, Tooltip, Tag, Progress, Avatar, Menu, Card } from 'antd';
// import { AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from '@ant-design/icons';
// import ProjectListData from './ProjectListData';
// import { 
// 	PaperClipOutlined, 
// 	CheckCircleOutlined, 
// 	ClockCircleOutlined,
// 	EyeOutlined, 
// 	EditOutlined,
// 	DeleteOutlined
// } from '@ant-design/icons';
// import utils from 'utils';
// import { COLORS } from 'constants/ChartConstant';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'

// const VIEW_LIST = 'LIST';
// const VIEW_GRID = 'GRID';

// const ItemAction = ({id, removeId}) => (
// 	<EllipsisDropdown 
// 		menu={
// 			<Menu>
// 				<Menu.Item key="0">
// 					<EyeOutlined />
// 					<span className="ml-2">View</span>
// 				</Menu.Item>
// 				<Menu.Item key="1">
// 					<EditOutlined />
// 					<span className="ml-2">Edit</span>
// 				</Menu.Item>
// 				<Menu.Divider />
// 				<Menu.Item key="2" onClick={() => removeId(id)}>
// 					<DeleteOutlined />
// 					<span className="ml-2">Delete Project</span>
// 				</Menu.Item>
// 			</Menu>
// 		}
// 	/>
// )

// const ItemHeader = ({name, category}) => (
// 	<div>
// 		<h4 className="mb-0">{name}</h4>
// 		<span className="text-muted">{category}</span>
// 	</div>
// )

// const ItemInfo = ({attachmentCount, completedTask, totalTask, statusColor, dayleft}) => (
// 	<Flex alignItems="center">
// 		<div className="mr-3">
// 			<Tooltip title="Attachment">
// 				<PaperClipOutlined className="text-muted font-size-md"/>
// 				<span className="ml-1 text-muted">{attachmentCount}</span>
// 			</Tooltip>
// 		</div>
// 		<div className="mr-3">
// 			<Tooltip title="Task Completed">
// 				<CheckCircleOutlined className="text-muted font-size-md"/>
// 				<span className="ml-1 text-muted">{completedTask}/{totalTask}</span>
// 			</Tooltip>
// 		</div>
// 		<div>
// 			<Tag color={statusColor !== "none"? statusColor : ''}>
// 				<ClockCircleOutlined />
// 				<span className="ml-2 font-weight-semibold">{dayleft} days left</span>
// 			</Tag>
// 		</div>
// 	</Flex>
// )

// const ItemProgress = ({progression}) => (
// 	<Progress percent={progression} strokeColor={getProgressStatusColor(progression)} size="small"/>
// )

// const ItemMember = ({member}) => (
// 	<>
// 		{member.map((elm, i) => (
// 				i <= 2?
// 			<Tooltip title={elm.name} key={`avatar-${i}`}>
// 				<Avatar size="small" className={`ml-1 cursor-pointer ant-avatar-${elm.avatarColor}`} src={elm.img} >
// 					{elm.img? '' : <span className="font-weight-semibold font-size-sm">{utils.getNameInitial(elm.name)}</span>}
// 				</Avatar>
// 			</Tooltip>
// 			:
// 			null
// 		))}
// 		{member.length > 3 ?
// 			<Tooltip title={`${member.length - 3} More`}>
// 				<Avatar size={25} className="ml-1 cursor-pointer bg-white border font-size-sm">
// 					<span className="text-gray-light font-weight-semibold">+{member.length - 3}</span>
// 				</Avatar>
// 			</Tooltip>
// 			:
// 			null
// 		}
// 	</>
// )

// const ListItem = ({ data, removeId }) => (
// 	<Card>
// 		<Row align="middle">
//     		<Col xs={24} sm={24} md={8}>
// 				<ItemHeader name={data.name} category={data.category} />
// 			</Col>
// 			<Col xs={24} sm={24} md={6}>
// 				<ItemInfo 
// 					attachmentCount={data.attachmentCount}
// 					completedTask={data.completedTask}
// 					totalTask={data.totalTask}
// 					statusColor={data.statusColor}
// 					dayleft={data.dayleft}
// 				/>
// 			</Col>
// 			<Col xs={24} sm={24} md={5}>
// 				<ItemProgress progression={data.progression} />
// 			</Col>
// 			<Col xs={24} sm={24} md={3}>
// 				<div className="ml-0 ml-md-3">
// 					<ItemMember member={data.member}/>
// 				</div>
// 			</Col>
// 			<Col xs={24} sm={24} md={2}>
// 				<div className="text-right">
// 					<ItemAction id={data.id} removeId={removeId}/>
// 				</div>
// 			</Col>
// 		</Row>
// 	</Card>
// )

// const GridItem = ({ data, removeId }) => (
// 	<Card>
// 		<Flex alignItems="center" justifyContent="space-between">
// 			<ItemHeader name={data.name} category={data.category} />
// 			<ItemAction id={data.id} removeId={removeId}/>
// 		</Flex>
// 		<div className="mt-2">
// 			<ItemInfo 
// 				attachmentCount={data.attachmentCount}
// 				completedTask={data.completedTask}
// 				totalTask={data.totalTask}
// 				statusColor={data.statusColor}
// 				dayleft={data.dayleft}
// 			/>
// 		</div>
// 		<div className="mt-3">
// 			<ItemProgress progression={data.progression} />
// 		</div>
// 		<div className="mt-2">
// 			<ItemMember member={data.member}/>
// 		</div>
// 	</Card>
// )

// const getProgressStatusColor = progress => {
// 	if(progress >= 80) {
// 		return COLORS[1]
// 	}
// 	if(progress < 60 && progress > 30) {
// 		return COLORS[3]
// 	}
// 	if(progress < 30) {
// 		return COLORS[2]
// 	}
// 	return COLORS[0]
// }

// const ProjectList = () => {

// 	const [view, setView] = useState(VIEW_GRID);
// 	const [list, setList] = useState(ProjectListData);

// 	const onChangeProjectView = e => {
// 		setView(e.target.value)
// 	}

// 	const	deleteItem = id =>{
// 		const data = list.filter(elm => elm.id !== id)
// 		setList(data)
// 	}

// 	return (
// 		<>
// 			<PageHeaderAlt className="border-bottom">
// 				<div className="container-fluid">
// 					<Flex justifyContent="space-between" alignItems="center" className="py-4">
// 						<h2>Projects</h2>
// 						<div>
// 							<Radio.Group defaultValue={VIEW_GRID} onChange={e => onChangeProjectView(e)}>
// 								<Radio.Button value={VIEW_GRID}><AppstoreOutlined /></Radio.Button>
// 								<Radio.Button value={VIEW_LIST}><UnorderedListOutlined /></Radio.Button>
// 							</Radio.Group>
// 							<Button type="primary" className="ml-2">
// 								<PlusOutlined />
// 								<span>New</span>
// 							</Button>
// 						</div>
// 					</Flex>
// 				</div>
// 			</PageHeaderAlt>
// 			<div className={`my-4 ${view === VIEW_LIST? 'container' : 'container-fluid'}`}>
// 				{
// 					view === VIEW_LIST ?
// 					list.map(elm => <ListItem data={elm} removeId={id => deleteItem(id)} key={elm.id}/>)
// 					:
// 					<Row gutter={16}>
// 						{list.map(elm => (
// 							<Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={elm.id}>
// 								<GridItem data={elm} removeId={id => deleteItem(id)}/>
// 							</Col>
// 						))}
// 					</Row>
// 				}
// 			</div>
// 		</>
// 	)
// }

// export default ProjectList
