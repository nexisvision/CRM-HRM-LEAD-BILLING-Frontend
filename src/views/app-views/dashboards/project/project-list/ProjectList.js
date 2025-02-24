import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Tag, Progress, Avatar, Modal, Card, Radio, Row, Col, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined, PaperClipOutlined, CheckCircleOutlined, ClockCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import ProjectListData from './ProjectListData';
import AddProject from './AddProject';
import EditProject from './EditProject';
import utils from 'utils';
import { useLocation, useNavigate,useParams } from 'react-router-dom';
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
	const [clientid,setClientId] = useState("");

	const [idd,setIdd]= useState("");

	  const AllProject = useSelector((state) => state.Project);
	  const properdata = AllProject.Project.data;
	//   console.log("opopopopop",properdata)

	  const loggedInUser = useSelector((state) => state.user.loggedInUser);
	  const username = loggedInUser ? loggedInUser.username : "";

	  const {state} = useLocation();
 
	  useEffect(() => {
		if (state?.idd) {
		  setClientId(state.idd);
		}
	  }, [state]);

	  const matchingClients = properdata?.filter(client => client?.client === clientid);

	const dispatch = useDispatch();

	const Allclientdata = useSelector((state) => state.SubClient);

	const dataclient = Allclientdata.SubClient.data;

	const navigate = useNavigate();

	const handleProjectClick = (id) => {
        navigate(`/app/dashboards/project/view/${id}`);
    };

	  useEffect(() => {
		dispatch(empdata());
		dispatch(ClientData());
		dispatch(GetProject());
	  }, [dispatch]);

	  useEffect(() => {
		if (!properdata) return;

		let filteredProjects = [];
		
		if (clientid && properdata.length > 0) {
		  filteredProjects = properdata.filter(item => item.client === clientid);
		} else {
		  filteredProjects = properdata;
		}

		filteredProjects = filteredProjects.filter(item => item.created_by === username);

		const formattedData = filteredProjects.map((item) => {
			// Parse project_members and files for each project individually
			let projectMembers = [];
			let filesArray = [];
			
			try {
				// Parse project members
				const parsedMembers = JSON.parse(item.project_members);
				projectMembers = parsedMembers.project_members || [];
				
				// Parse files for this specific project
				filesArray = JSON.parse(item.files) || [];
			} catch (error) {
				console.error("Error parsing data:", error);
			}

			// Get file URLs for this specific project
			const fileUrls = filesArray.map(file => file.url);

			// Map members to their avatars, cycling through available files
			const memberWithAvatars = projectMembers.map((memberId, index) => ({
				id: memberId,
				name: "Member",
				// Use modulo to cycle through available files if there are more members than files
				img: fileUrls[index % fileUrls.length] || "https://xsgames.co/randomusers/avatar.php?g=pixel"
			}));

			return {
				...item,
				dateRange: `${new Date(item.startDate).toLocaleDateString()}/${new Date(item.endDate).toLocaleDateString()}`,
				id: item.id,
				name: item.project_name || item.name,
				category: item.project_category,
				attachmentCount: item.attachmentCount,
				totalTask: item.budget,
				completedTask: `${Math.round((new Date() - new Date(item.startDate)) / (new Date(item.endDate) - new Date(item.startDate)) * 100)}%`,
				progressPercent: Math.round((new Date() - new Date(item.startDate)) / (new Date(item.endDate) - new Date(item.startDate)) * 100),
				dayleft: Math.max(0, Math.ceil((new Date(item.endDate) - new Date()) / (1000 * 3600 * 24))),
				statusColor: item.status,
				member: memberWithAvatars,
				tag: item.tag_name || item.tag,
			};
		});
		setList(formattedData);
	}, [properdata, clientid, username]);


	  
	// Open Add Project Modal
	const openAddProjectModal = () => setIsAddProjectModalVisible(true);
	const closeAddProjectModal = () => setIsAddProjectModalVisible(false);

	// Open Edit Project Modal
	const openEditProjectModal = () => setIsEditProjectModalVisible(true);
	const closeEditProjectModal = () => setIsEditProjectModalVisible(false);

	// Delete Project
	const deleteItem = (id) => {
		dispatch(DeletePro(id)); // Assuming DeletePro is a redux action
		const updatedList = list.filter((item) => item.id !== id); // Update the list after deletion
		setList(updatedList); // Set the updated list in the state
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
            title: 'Project',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div 
                    onClick={() => handleProjectClick(record.id)}
                    className="cursor-pointer hover:text-blue-600"
                >
                    <h4 className="mb-0">{name}</h4>
                    <span className="text-gray-500">{record.project_category}</span>
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

			<PageHeaderAlt className="border-bottom mt-5">
				<div className="container-fluid">
					<div className='flex justify-between items-center '>
						<h2 className='text-xl font-medium'>Projects</h2>
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
				{view === VIEW_LIST  ? (
					<Table
						columns={tableColumns}
						dataSource={list}
						rowKey="id"
						scroll={{ x: 1000 }}
					/>
				) : (
					<Row gutter={16}>
						{list?.map((item) => {
							let statusColor = '';				
							if (item.dayleft > 10) {
								statusColor = 'green'; // Safe status
							} else if (item.dayleft > 5) {
								statusColor = 'orange'; // Warning status
							} else {
								statusColor = 'red'; // Critical 
							}

							return (
									<Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={item.id}>
										
<Card>
							<div className='flex items-center justify-between'>
								<div className="flex flex-col" >
									<p onClick={() => handleProjectClick(item.id)} className="text-base font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">{item.name}</p>
									<p className="text-sm text-gray-600 mt-2">{item.category}</p>
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

							

							<div className="mt-4 flex items-center gap-4">
								<span>
									<PaperClipOutlined />
									{item.totalTask}
								</span>
								<span>
									<CheckCircleOutlined />
									{item.dateRange}
								</span>
								<span
									style={{
										color: statusColor,
										fontWeight: 'bold',
										fontSize: '15px',
										display: 'flex',
										alignItems: 'center',
										gap: '4px',
									}}
								>
									<ClockCircleOutlined className='text-lg font-bold' />
									{item.dayleft} days left
								</span>
							</div>
							
							<div className="mt-3">
								<Progress
									percent={item.progressPercent}
									strokeColor={
										item.progressPercent <= 50
											? 'red'
											: item.progressPercent <= 75
												? 'orange'
												: 'green'
									}
									size="small"
								/>
							</div>

							{/* Modified Avatar group section with conditional rendering */}
							{item.member && item.member.length > 0 && (
								<div className="mt-4">
									<Avatar.Group
										maxCount={4}
										maxStyle={{
											color: '#f56a00',
											backgroundColor: '#fde3cf',
										}}
									>
										{item.member.map((member, index) => (
											<Tooltip title={member.name} key={index}>
												<Avatar 
													src={member.img}
													className="rounded-full"
													style={{ backgroundColor: '#87d068' }}
													onError={(e) => {
														// If image fails to load, replace with default avatar
														e.target.src = "https://xsgames.co/randomusers/avatar.php?g=pixel";
													}}
												>
													{member.name[0]} {/* Fallback to first letter if both image and default fail */}
												</Avatar>
											</Tooltip>
										))}
									</Avatar.Group>
								</div>
							)}
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
