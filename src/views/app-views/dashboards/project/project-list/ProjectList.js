import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Tag, Progress, Avatar, Modal, Card, Radio, Row, Col, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, PaperClipOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ProjectListData from './ProjectListData';
import AddProject from './AddProject';
import EditProject from './EditProject';
import utils from 'utils';
import { useNavigate,useParams } from 'react-router-dom';
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt';
import Flex from 'components/shared-components/Flex';
import { empdata } from 'views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { DeletePro, GetProject } from './projectReducer/ProjectSlice';
import { ClientData } from 'views/app-views/Users/client-list/CompanyReducers/CompanySlice';

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const ProjectList = () => {
	const [view, setView] = useState(VIEW_GRID);
	const [list, setList] = useState([]);
	const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
	const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);

	const [idd,setIdd]= useState("");

	  const AllProject = useSelector((state) => state.Project);
	  const properdata = AllProject.Project.data;

	const dispatch = useDispatch();

	const Allclientdata = useSelector((state) => state.ClientData);

	const dataclient = Allclientdata.ClientData.data;

	const navigate = useNavigate();

	const handleProjectClick = (id) => {
        navigate(`/app/dashboards/project/view/${id}`);
    };

	
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
			const datac = dataclient?.find((item) => item.id === item?.member || item?.client )		
			const formattedData = properdata?.map(item => {
				// Calculate days left
				const currentDate = new Date();
				const endDate = new Date(item.enddate);
				const startDate = new Date(item.startdate);

				// Calculate total project days
				const totalDays = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
				
				// Calculate completed days
				const completedDays = Math.ceil((currentDate - startDate) / (1000 * 3600 * 24));
				
				// Ensure completedDays doesn't exceed totalDays
				const adjustedCompletedDays = Math.min(Math.max(0, completedDays), totalDays);

				console.log("opopoop",properdata)
				return {
					id: item.id,
					name: item.project_name || item.name,
					category: item?.category || item.category,
					attachmentCount: datac || item.attachmentCount,
					totalTask: item?.budget || item.budget,
					// Update completedTask to show days progress
					completedTask: `${adjustedCompletedDays}/${totalDays}`,
					
					progression: item?.startdate || item.progression,
					dayleft: Math.max(0, Math.ceil((endDate - currentDate) / (1000 * 3600 * 24))),
					statusColor: item?.status || item.statusColor,
					member: datac || item.member,
					tag: item?.tag || item.tag_name || item.tag,
				};
			});
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
		// {
		// 	title: 'Project',
		// 	dataIndex: 'name',
		// 	key: 'name',
		// 	render: (name, record) => (
		// 		<div>
		// 			<h4 className="mb-0">{name}</h4>
		// 			<span className="text-muted">{record.category}</span>
		// 		</div>
		// 	),
		// },
		{
            title: 'Project',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div 
                    onClick={() => handleProjectClick(record.id)}
                    className="cursor-pointer hover:text-blue-600"
                >
                    <h4 className="mb-0">{name}</h4>
                    <span className="text-muted">{record.category}</span>
                </div>
            ),
        },
		{
			title: 'Budget',
			dataIndex: 'totalTask',
			key: 'totalTask',
			render: (totalTask) => (
				<div>
					<span>{totalTask}</span>
				</div>
			),
		},
		{
			title: 'Progress',
			dataIndex: 'completedTask',
			key: 'completedTask',
			render: (completedTask) => (
				<div>
					<span>
						<CheckCircleOutlined className="mr-2" />
						{completedTask}
					</span>
				</div>
			),
		},
		{
			title: 'Days Left',
			dataIndex: 'dayleft',
			key: 'dayleft',
			render: (dayleft) => {
				let statusColor = '';
				if (dayleft > 10) {
					statusColor = 'green';
				} else if (dayleft > 5) {
					statusColor = 'orange';
				} else {
					statusColor = 'red';
				}

				return (
					<Tag color={statusColor}>
						<ClockCircleOutlined className="mr-2" />
						{dayleft} days left
					</Tag>
				);
			},
		},
		{
			title: 'Client',
			dataIndex: 'member',
			key: 'member',
			render: (member) => (
				<div>
					<span>{member}</span>
				</div>
			),
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div className="text-right">
					<Dropdown 
						overlay={dropdownMenu(record.id)} 
						trigger={['click']}
						placement="bottomRight"
					>
						<Button type="text" icon={<EllipsisDropdown />} />
					</Dropdown>
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
						scroll={{ x: 1000 }}
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
									<Card>
										<div className='flex items-center justify-between'>
											<div className='' onClick={() => handleProjectClick(item.id)}>
												<p className='font-medium'>{item.name}</p>
											</div>
											<div>
												<p>{item.category}</p>
											</div>
											<div className="flex items-center gap-2">
												{item.tag && (
													<Tag 
														color="blue" 
														className="m-0"
													>
														{item.tag}
													</Tag>
												)}
												<Dropdown
													overlay={dropdownMenu(item.id)}
													trigger={['click']}
													placement="bottomRight"
													key="dropdown"
												>
													<Button type="text" icon={<EllipsisDropdown />} />
												</Dropdown>
											</div>
										</div>

										<p className="flex gap-4 mt-1">
											<span>{item.member}</span>
										</p>

										<p className="flex gap-4 mt-1">
											<span>
												<PaperClipOutlined />
												{item.totalTask}
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
												percent={item.dayleft}
												strokeColor={
													item.dayleft >= 80
														? 'green'
														: item.dayleft >= 60
															? 'orange'
															: 'red'
												}
												size="small"
											/>
										</p>
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
