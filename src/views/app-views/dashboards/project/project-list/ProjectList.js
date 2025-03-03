import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Tag, Progress, Avatar, Modal, Card, Radio, Row, Col, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, PaperClipOutlined, CheckCircleOutlined, ClockCircleOutlined, ConsoleSqlOutlined, EllipsisOutlined, CalendarOutlined, TeamOutlined, DollarOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ProjectListData from './ProjectListData';
import AddProject from './AddProject';
import EditProject from './EditProject';
import utils from 'utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
	const [clientid, setClientId] = useState("");
	const [idd, setIdd] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { state } = useLocation();

	// Move all selectors to the top
	const AllProject = useSelector((state) => state.Project);
	const properdata = AllProject.Project.data;
	const currencies = useSelector((state) => state.currencies?.currencies?.data);
	const loggedInUser = useSelector((state) => state.user.loggedInUser);
	const username = loggedInUser ? loggedInUser.client_id : "";
	const Allclientdata = useSelector((state) => state.SubClient);
	const dataclient = Allclientdata.SubClient.data;
	// Get employee data from Redux store - moved here from bottom
	const allEmployeeData = useSelector((state) => state.employee);
	const empData = allEmployeeData?.employee?.data || [];

	useEffect(() => {
		if (state?.idd) {
			setClientId(state.idd);
		}
	}, [state]);

	const matchingClients = properdata?.filter(client => client?.client === clientid);

	useEffect(() => {
		dispatch(empdata());
		dispatch(ClientData());
		dispatch(GetProject());
	}, [dispatch]);

	useEffect(() => {
		if (!properdata) return;

		const formattedData = properdata.map((item) => {
			let projectMembers = [];
			let filesArray = [];

			try {
				// Parse project members
				const parsedMembers = typeof item.project_members === 'string'
					? JSON.parse(item.project_members)
					: item.project_members;

				projectMembers = parsedMembers?.project_members || [];

				// Parse files for this specific project
				filesArray = item.files ? JSON.parse(item.files) : [];
			} catch (error) {
				console.error("Error parsing data:", error);
			}

			// Get employee details for project members
			const memberDetails = projectMembers.map(memberId => {
				const employee = empData.find(emp => emp.id === memberId);
				return employee ? {
					id: employee.id,
					name: employee.username || 'User',
					img: employee.profilePic,
					initials: (employee.username || 'U')[0].toUpperCase()
				} : null;
			}).filter(Boolean);

			// Find currency details
			const currencyDetails = currencies?.find(c => c.currencyCode === item.currency) || {};
			const currencyIcon = currencyDetails.currencyIcon || '$';

			// Format dates
			const startDate = item.startDate ? new Date(item.startDate) : null;
			const endDate = item.endDate ? new Date(item.endDate) : null;
			const formattedStartDate = startDate ? startDate.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			}) : 'N/A';
			const formattedEndDate = endDate ? endDate.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			}) : 'N/A';

			return {
				...item,
				dateRange: `${formattedStartDate} - ${formattedEndDate}`,
				id: item.id,
				name: item.project_name || item.name,
				category: item.project_category,
				attachmentCount: item.attachmentCount,
				totalTask: `${currencyIcon}${Number(item.budget).toLocaleString()}`,
				completedTask: `${Math.round((new Date() - startDate) / (endDate - startDate) * 100)}%`,
				progressPercent: Math.round((new Date() - startDate) / (endDate - startDate) * 100),
				dayleft: endDate ? Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 3600 * 24))) : 0,
				statusColor: item.status,
				member: memberDetails,
				tag: item.tag_name || item.tag,
				formattedStartDate,
				formattedEndDate
			};
		});
		setList(formattedData);
	}, [properdata, clientid, username, currencies, empData]);

	const handleProjectClick = (id) => {
		navigate(`/app/dashboards/project/view/${id}`);
	};

	// Delete Project
	const deleteItem = (id) => {
		dispatch(DeletePro(id));
		const updatedList = list.filter((item) => item.id !== id);
		setList(updatedList);
	};

	const editp = (id) => {
		openEditProjectModal(id);
		setIdd(id);
	};

	// Change Project View
	const onChangeProjectView = (e) => {
		setView(e.target.value);
	};

	// Open Add Project Modal
	const openAddProjectModal = () => setIsAddProjectModalVisible(true);
	const closeAddProjectModal = () => setIsAddProjectModalVisible(false);

	// Open Edit Project Modal
	const openEditProjectModal = () => setIsEditProjectModalVisible(true);
	const closeEditProjectModal = () => setIsEditProjectModalVisible(false);

	// Generate Action Menu for Dropdown
	const dropdownMenu = (id) => (
		<Menu>
			<Menu.Item key="edit" onClick={() => editp(id)}>
				<EditOutlined /> Edit
			</Menu.Item>
			<Menu.Item key="delete" onClick={() => deleteItem(id)}>
				<DeleteOutlined /> Delete
			</Menu.Item>
		</Menu>
	);

	const tableColumns = [
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
					{/* <span className="text-gray-500">{record.project_category}</span> */}
				</div>
			),
		},
		{
			title: 'Budget',
			dataIndex: 'totalTask',
			key: 'totalTask',
			render: (totalTask) => (
				<div className="font-semibold">
					<span>{totalTask}</span>
				</div>
			),
		},
		{
			title: 'Client',
			dataIndex: 'client',
			key: 'client',
			render: (clientId) => {
				const client = dataclient?.find(c => c.id === clientId);
				return <span>{client?.username || 'N/A'}</span>;
			}
		},
		{
			title: 'Project Members',
			dataIndex: 'member',
			key: 'member',
			render: (members) => {
				if (!members || members.length === 0) return <span>No members</span>;

				return (
					<div className="flex items-center">
						<Avatar.Group
							maxCount={3}
							size="small"
							className="flex items-center"
						>
							{members.map((member, index) => (
								<Tooltip
									key={member.id}
									title={member.name}
									placement="top"
								>
									<Avatar
										src={member.img}
										style={{
											backgroundColor: !member.img ? `hsl(${index * 50 % 360}, 70%, 50%)` : 'transparent',
											border: '2px solid #fff',
											cursor: 'pointer'
										}}
										className="shadow-sm hover:opacity-80 transition-opacity"
									>
										{!member.img && member.initials}
									</Avatar>
								</Tooltip>
							))}
						</Avatar.Group>
						{members.length > 3 && (
							<span className="ml-2 text-gray-500 text-sm">
								+{members.length - 3}
							</span>
						)}
					</div>
				);
			}
		},
		{
			title: 'Category',
			dataIndex: 'project_category',
			key: 'project_category',
			render: (category) => <span>{category || 'N/A'}</span>
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status) => (
				<Tag color={status ? 'green' : 'default'}>
					{status || 'Not Set'}
				</Tag>
			)
		},
		{
			title: 'Start Date',
			dataIndex: 'formattedStartDate',
			key: 'startDate',
		},
		{
			title: 'End Date',
			dataIndex: 'formattedEndDate',
			key: 'endDate',
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
				<div className="text-center">
					<EllipsisDropdown menu={dropdownMenu(record.id)} />
				</div>
			),
		}
	];

	const getStatusIcon = (dayleft) => {
		if (dayleft > 10) {
			return <CheckCircleOutlined className="text-success" />;
		} else if (dayleft > 5) {
			return <ExclamationCircleOutlined className="text-warning" />;
		}
		return <CloseCircleOutlined className="text-danger" />;
	};

	return (
		<div>

			<PageHeaderAlt className="border-bottom mt-5">
				<div className="container-fluid">
					<div className='flex justify-between items-center '>
						<h2 className='text-xl font-medium font-family-Roboto'>Projects</h2>
						<Flex className="p-2 flex justify-end">
							<div className='flex gap-3 justify-end'>
								<Radio.Group defaultValue={VIEW_GRID} onChange={onChangeProjectView}>
									<Radio.Button value={VIEW_GRID}>
										<AppstoreOutlined />
									</Radio.Button>
									<Radio.Button value={VIEW_LIST}>
										<UnorderedListOutlined />
									</Radio.Button>
								</Radio.Group>
								<Button type="primary" icon={<PlusOutlined />} onClick={openAddProjectModal} className="flex items-center">
									New Project
								</Button>
							</div>
						</Flex>

					</div>
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
					<Row gutter={[24, 24]} className="project-list-container">
						{list?.map((item) => {
							let statusColor = item.dayleft > 10 ? '#52c41a' : item.dayleft > 5 ? '#faad14' : '#f5222d';

							return (
								<Col xs={24} sm={12} lg={8} xxl={6} key={item.id}>
									<Card
										hoverable
										className="project-card rounded-xl border-0"
										style={{
											background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
											boxShadow: '0 3px 15px rgba(0,0,0,0.08)',
											width: '100%'
										}}
										bodyStyle={{ padding: '0' }}
									>
										{/* Status Bar */}
										<div
											className="h-1.5 rounded-t-xl"
											style={{ backgroundColor: statusColor }}
										/>

										<div className="p-3">
											{/* Project Header */}
											<div className="flex w-full items-start justify-between mb-4">
												<div className="flex-1">
													{/* <div className="flex items-center gap-2 mb-2">
														{getStatusIcon(item.dayleft)}
														<Tag color={item.tag ? 'blue' : 'default'} className="m-0 px-2 py-0.5">
															{item.tag || 'No Tag'}
														</Tag>
													</div> */}
													<h4
														onClick={() => handleProjectClick(item.id)}
														className="text-lg font-semibold hover:text-blue-600 cursor-pointer mb-1 line-clamp-2"
														style={{ color: '#2c3e50' }}
													>
														{item.name}
													</h4>
													<p className="text-gray-500 text-sm mb-0">{item.category}</p>
												</div>
												<Dropdown overlay={dropdownMenu(item.id)} trigger={['click']}>
													<Button
														type="text"
														icon={<EllipsisOutlined />}
														className="hover:bg-gray-100"
													/>
												</Dropdown>
											</div>

											{/* Progress Section */}


											{/* Info Grid */}
											<div className="grid grid-cols-2 gap-3 mb-4">
												<div className="flex items-center p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
													<DollarOutlined className="text-blue-500 mr-2" />
													<div>
														<p className="text-xs text-gray-500 m-0">Budget</p>
														<p className="text-sm font-semibold m-0">{item.totalTask}</p>
													</div>
												</div>
												<div className="flex items-center p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
													<ClockCircleOutlined
														className="mr-2"
														style={{ color: statusColor }}
													/>
													<div>
														<p className="text-xs text-gray-500 m-0">Days Left</p>
														<p className="text-sm font-semibold m-0" style={{ color: statusColor }}>
															{item.dayleft} days
														</p>
													</div>
												</div>
											</div>

											{/* Date Range */}
											<div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
												<CalendarOutlined className="text-blue-500" />
												<span>{item.dateRange}</span>
											</div>

											{/* Team Members */}
											<div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
												<div className="flex items-center gap-2">
													<TeamOutlined className="text-blue-500" />
													<Avatar.Group
														maxCount={4}
														size="small"
														className="flex items-center"
													>
														{item.member?.map((member, index) => (
															<Tooltip
																key={member.id}
																title={member.name}
																placement="top"
															>
																<Avatar
																	src={member.img}
																	style={{
																		backgroundColor: !member.img ? `hsl(${index * 50 % 360}, 70%, 50%)` : 'transparent',
																		border: '2px solid #fff',
																		cursor: 'pointer'
																	}}
																	className="shadow-sm hover:opacity-80 transition-opacity"
																>
																	{!member.img && member.initials}
																</Avatar>
															</Tooltip>
														))}
													</Avatar.Group>
												</div>
												{item.member?.length > 4 && (
													<Tag className="bg-blue-50 text-blue-600 border-0 flex items-center">
														<span className="text-sm">+{item.member.length - 4}</span>
													</Tag>
												)}
											</div>
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
				<EditProject onClose={closeEditProjectModal} id={idd} />
			</Modal>
		</div>
	);
};

export default ProjectList;
