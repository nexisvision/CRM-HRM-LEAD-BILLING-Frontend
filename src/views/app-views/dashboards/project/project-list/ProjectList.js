import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Tag, Progress, Avatar, Modal, Card, Radio, Row, Col, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, PaperClipOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ProjectListData from './ProjectListData';
import AddProject from './AddProject';
import EditProject from './EditProject';
import utils from 'utils';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt';
import Flex from 'components/shared-components/Flex';
import { empdata } from 'views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice';
import { ClientData } from 'views/app-views/company/CompanyReducers/CompanySlice';
import { useDispatch, useSelector } from 'react-redux';
import { DeletePro, GetProject } from './projectReducer/ProjectSlice';

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const ProjectList = () => {
	const [view, setView] = useState(VIEW_GRID);
	const [list, setList] = useState([]);
	const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
	const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);

	const [idd,setIdd]= useState("")

	  const AllProject = useSelector((state) => state.Project);
	  const properdata = AllProject.Project.data;

	const dispatch = useDispatch();

	const Allclientdata = useSelector((state) => state.ClientData);

	const dataclient = Allclientdata.ClientData.data;

	
	  useEffect(() => {
		dispatch(empdata());
	  }, [dispatch]);
	
	  useEffect(() => {
		dispatch(ClientData());
	  }, [dispatch]);

	  useEffect(() => {
		dispatch(GetProject());
	  }, [dispatch]);

	
	useEffect(() => {
		if (properdata) {
			const datac = dataclient.find((item) => item.id === item?.member || item?.client )		
			const formattedData = properdata.map(item => ({
				id: item.id,
				name: item.project_name || item.name,
				category: item?.budget || item.category,
				attachmentCount: datac || item.attachmentCount,
				totalTask: item?.enddate || item.totalTask,
				completedTask: item?.estimatedmonths || item.completedTask,
				progression: item?.startdate || item.progression,
				dayleft: item?.tag || item.dayleft,
				statusColor: item?.status || item.statusColor,
				member: datac || item.member,
			}));
			setList(formattedData);
		}
	}, [properdata]);
	


	// Open Add Project Modal
	const openAddProjectModal = () => setIsAddProjectModalVisible(true);
	const closeAddProjectModal = () => setIsAddProjectModalVisible(false);

	// Open Edit Project Modal
	const openEditProjectModal = () => setIsEditProjectModalVisible(true);
	const closeEditProjectModal = () => setIsEditProjectModalVisible(false);

	// Delete Project
	const deleteItem = (id) => {

		dispatch(DeletePro(id));
		const updatedList = list.filter((item) => item.id !== id);
		setList(updatedList);
	};

	const editp = (id) => {
		openEditProjectModal(id)
		setIdd(id)
	};

	// Change Project View
	const onChangeProjectView = (e) => {
		setView(e.target.value);
	};

	// Generate Action Menu for Dropdown
	const dropdownMenu = (id) => (
		<Menu>
			<Menu.Item key="edit"  onClick={() => editp(id)}>
				<EditOutlined /> Edit
			</Menu.Item>
			<Menu.Item key="delete" onClick={() => deleteItem(id)}>
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	const tableColumns = [
		{
			title: 'PROJECT',
			dataIndex: 'project_name',
			key: 'project_name',
			render: (name, record) => (
				<div>
					<h4 className="mb-0">{name}</h4>
					<span className="text-muted">{record.category}</span>
				</div>
			),
		},
		{
			title: 'Info',
			dataIndex: 'Info',
			key: 'Info',
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
			dataIndex: 'user',
			key: 'user',
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
						// columns={tableColumns}
						dataSource={list}
						rowKey="id"
						scroll={1200}
					/>
				) : (
					<Row gutter={16}>
						{list?.map((item) => {
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
												{/* <PaperClipOutlined /> */}
												{item.member}
											</span>
											
										</p>
										<p className="flex gap-4 mt-1">
											<span>
												<PaperClipOutlined />
												{item.completedTask}
											</span>
											<span>
												<CheckCircleOutlined />
												{item.completedTask}
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
										{/* <div>
											{item?.member?.slice(0, 3)?.map((m, index) => (
												<Tooltip title={m?.name} key={index}>
													<Avatar src={m?.img}>
														{!m?.img && utils?.getNameInitial(m?.name)}
													</Avatar>
												</Tooltip>
											))}
											{item?.member?.length > 3 && (
												<Tooltip title={`${item?.member?.length - 3} More`}>
													<Avatar size="small" className="text-black font-medium">
														+{item?.member?.length - 3}
													</Avatar>
												</Tooltip>
											)}
										</div> */}
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
				<EditProject onClose={closeEditProjectModal} id={idd} />
			</Modal>
		</div>
	);
};

export default ProjectList;


