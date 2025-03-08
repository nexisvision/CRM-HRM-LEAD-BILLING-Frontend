import React, { useEffect, useState, useMemo } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FaCoins } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from 'dayjs';
import { TbClockHour3Filled } from "react-icons/tb";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useNavigate, useParams } from 'react-router-dom';
import { Tag, Table, Progress, Avatar, Menu, Card } from 'antd';
import { GetTasks } from "../task/TaskReducer/TaskSlice";
import { Getmins } from "../milestone/minestoneReducer/minestoneSlice";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import utils from "utils";
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const OverViewList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [proo, setProo] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);

  // Add currencies selector
  const { currencies } = useSelector((state) => state.currencies);
  const curr = currencies?.data || [];

  // Move all selectors to the top
  const allempdata = useSelector((state) => state?.Project) || {};
  const filterdata = allempdata?.Project?.data || [];
  const taskData = useSelector((state) => state?.Tasks?.Tasks?.data) || [];
  const milestoneData = useSelector((state) => state.Milestone?.Milestone?.data) || [];
  const allclient = useSelector((state) => state?.SubClient?.SubClient?.data) || [];

  // Get the current project data based on ID
  const currentProject = useMemo(() => {
    return filterdata.find(project => project.id === id) || null;
  }, [filterdata, id]);

  // Add currency formatting helper
  const formatCurrency = useMemo(() => (value) => {
    if (!currentProject?.currency || !curr?.length) return `₹${Number(value).toLocaleString()}`;

    const projectCurrency = curr.find(c => c.id === currentProject.currency);
    return `${projectCurrency?.currencyIcon || '₹'}${Number(value).toLocaleString()}`;
  }, [currentProject?.currency, curr]);

  // Add currencies fetch
  useEffect(() => {
    dispatch(getcurren());
  }, [dispatch]);

  // Enhanced progress calculation
  const projectMetrics = useMemo(() => {
    if (!currentProject) return {
      progress: "0",
      tasks: { total: 0, completed: 0 },
      milestones: { total: 0, completed: 0 },
      time: { total: 0, elapsed: 0, remaining: 0 },
      isComplete: false
    };

    try {
      // Filter tasks and milestones for current project
      const projectTasks = taskData.filter(task => task.project_id === id);
      const projectMilestones = milestoneData.filter(milestone => milestone.project_id === id);

      // Calculate task metrics
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(task =>
        task.status?.toLowerCase() === 'completed'
      ).length;
      const inProgressTasks = projectTasks.filter(task =>
        task.status?.toLowerCase() === 'in progress'
      ).length;

      // Calculate milestone metrics with end date consideration
      const totalMilestones = projectMilestones.length;
      const now = dayjs();
      const completedMilestones = projectMilestones.filter(milestone => {
        const endDate = dayjs(milestone.milestone_end_date);
        const status = milestone.milestone_status?.toLowerCase();
        return status === 'completed' || status === 'done' || now.isAfter(endDate, 'day');
      }).length;

      const inProgressMilestones = projectMilestones.filter(milestone => {
        const endDate = dayjs(milestone.milestone_end_date);
        const status = milestone.milestone_status?.toLowerCase();
        return status === 'in progress' && !now.isAfter(endDate, 'day');
      }).length;

      // Calculate time progress
      const start = dayjs(currentProject.startDate);
      const end = dayjs(currentProject.endDate);

      const totalDuration = end.diff(start, 'day');
      const elapsed = now.diff(start, 'day');
      const remaining = end.diff(now, 'day');

      // Calculate time progress with bounds checking
      const timeProgress = Number(Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)).toFixed(1));

      // Calculate weighted progress for tasks and milestones
      const taskProgress = totalTasks > 0
        ? Number(((completedTasks + (inProgressTasks * 0.5)) / totalTasks) * 100).toFixed(1)
        : 0;

      const milestoneProgress = totalMilestones > 0
        ? Number(((completedMilestones + (inProgressMilestones * 0.5)) / totalMilestones) * 100).toFixed(1)
        : 0;

      // Calculate overall weighted progress
      // Tasks: 40%, Milestones: 40%, Time: 20%
      const weightedProgress = totalTasks === 0 && totalMilestones === 0
        ? timeProgress
        : totalTasks === 0
          ? Number((milestoneProgress * 0.8) + (timeProgress * 0.2)).toFixed(1)
          : totalMilestones === 0
            ? Number((taskProgress * 0.8) + (timeProgress * 0.2)).toFixed(1)
            : Number((taskProgress * 0.4) + (milestoneProgress * 0.4) + (timeProgress * 0.2)).toFixed(1);

      return {
        progress: weightedProgress,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          remaining: totalTasks - (completedTasks + inProgressTasks),
          percentage: taskProgress
        },
        milestones: {
          total: totalMilestones,
          completed: completedMilestones,
          inProgress: inProgressMilestones,
          remaining: totalMilestones - (completedMilestones + inProgressMilestones),
          percentage: milestoneProgress
        },
        time: {
          total: totalDuration,
          elapsed,
          remaining,
          isOverdue: remaining < 0,
          percentage: timeProgress
        },
        isComplete: Number(weightedProgress) >= 100 || (
          totalTasks > 0 && completedTasks === totalTasks &&
          totalMilestones > 0 && completedMilestones === totalMilestones
        )
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return {
        progress: "0",
        tasks: { total: 0, completed: 0, inProgress: 0, remaining: 0 },
        milestones: { total: 0, completed: 0, inProgress: 0, remaining: 0 },
        time: { total: 0, elapsed: 0, remaining: 0, isOverdue: false },
        isComplete: false
      };
    }
  }, [taskData, milestoneData, currentProject, id]);

  // Update progress calculation
  useEffect(() => {
    setProo(projectMetrics.progress);
  }, [projectMetrics.progress]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(ClientData());
        await Promise.all([
          dispatch(GetProject()),
          dispatch(GetTasks(id)),
          dispatch(Getmins(id))
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  // Remove console.logs and add proper error handling
  const fndpro = currentProject;
  const fndclient = allclient?.find((item) => item?.id === fndpro?.client);


  // Define status colors mapping with more color options
  const statusColors = {
    'To Do': '#FF6B6B',        // Red
    'In Progress': '#36A2EB',  // Blue
    'Done': '#4BC0C0',         // Teal
    'On Hold': '#FFCE56',      // Yellow
    'Cancelled': '#9966FF',    // Purple
    'Review': '#FF9F40',       // Orange
    'Blocked': '#EA4228',      // Dark Red
    'Testing': '#2ECC71',      // Green
    'Deployed': '#3498DB',     // Light Blue
    'Backlog': '#95A5A6',      // Gray
    'High Priority': '#E74C3C', // Bright Red
    'Medium Priority': '#F39C12', // Dark Yellow
    'Low Priority': '#27AE60',  // Dark Green
    'Critical': '#C0392B',     // Deep Red
    'Pending': '#F1C40F'       // Gold
  };

  // Function to get color for unknown status
  const getStatusColor = (status) => {
    return statusColors[status] || generateRandomColor(status);
  };

  // Generate consistent random color for unknown status
  const generateRandomColor = (seed) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ('00000' + (hash & 0xFFFFFF).toString(16)).slice(-6);
    return color;
  };

  // Prepare data for pie chart with dynamic colors
  const taskStatusData = useMemo(() => {
    const statusCounts = taskData.reduce((acc, task) => {
      const status = task.status || 'No Status';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColor = labels.map(status => getStatusColor(status));

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderWidth: 1
      }]
    };
  }, [taskData]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return taskData.reduce((acc, task) => {
      const status = task.status || 'No Status';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});
  }, [taskData]);

  // Navigate to task details
  const handleTaskClick = (taskId) => {
    navigate(`/app/dashboards/project/task/${taskId}`);
    setIsTaskModalVisible(false);
  };

  // Update the clientInfo memo with better error handling
  const clientInfo = useMemo(() => {
    // Wait for both project and client data to be available
    if (!fndpro || !allclient) {
      return {
        username: 'Loading...',
        email: 'Loading...'
      };
    }

    // Find the client using the project's client ID
    const client = allclient.find(item => item.id === fndpro.client);

    if (!client) {
      return {
        username: 'Client Not Found',
        email: 'No Email Available'
      };
    }

    return {
      username: client.username || 'No Client Name',
      email: client.email || 'No Email Available'
    };
  }, [fndpro, allclient]);

  // Add milestone status helper function
  const getMilestoneProgress = (milestone) => {
    // If milestone end date has passed, consider it as completed
    const endDate = dayjs(milestone.milestone_end_date);
    const now = dayjs();
    const isOverdue = now.isAfter(endDate, 'day');

    // If milestone is marked as completed or end date has passed, return 100%
    if (milestone.milestone_status?.toLowerCase() === 'completed' ||
      milestone.milestone_status?.toLowerCase() === 'done' ||
      isOverdue) {
      return 100;
    }

    // Calculate progress based on tasks if available
    const tasks = taskData.filter(task => task.milestone_id === milestone.id);
    if (!tasks.length) {
      // If no tasks, calculate progress based on timeline
      const startDate = dayjs(milestone.milestone_start_date);
      const totalDuration = endDate.diff(startDate, 'day');
      const elapsed = now.diff(startDate, 'day');
      return Math.min(100, Math.round((elapsed / totalDuration) * 100));
    }

    const completed = tasks.filter(task => task.status?.toLowerCase() === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Update milestone status helper function
  const getMilestoneStatus = (status, milestone) => {
    const normalizedStatus = status?.toLowerCase();
    const endDate = dayjs(milestone?.milestone_end_date);
    const now = dayjs();

    // If milestone is marked as completed or done
    if (normalizedStatus === "completed" || normalizedStatus === "done") {
      return "success";
    }

    // If end date has passed, consider it completed
    if (now.isAfter(endDate, 'day')) {
      return "success";
    }

    if (normalizedStatus === "in progress") return "processing";
    if (normalizedStatus === "pending") return "warning";
    if (normalizedStatus === "expired") return "error";
    return "default";
  };

  const getMilestoneStatusText = (status, milestone) => {
    const normalizedStatus = status?.toLowerCase();
    const endDate = dayjs(milestone?.milestone_end_date);
    const now = dayjs();

    // If milestone is marked as completed or done
    if (normalizedStatus === "completed" || normalizedStatus === "done") {
      return "Done";
    }

    // If end date has passed, show as Done
    if (now.isAfter(endDate, 'day')) {
      return "Done";
    }

    if (normalizedStatus === "in progress") return "In Progress";
    if (normalizedStatus === "pending") return "Pending";
    if (normalizedStatus === "expired") return "Expired";
    return status || "Not Set";
  };

  // Add milestone table columns
  const milestoneTableColumns = [
    {
      title: "Milestone Title",
      dataIndex: "milestone_title",
      sorter: {
        compare: (a, b) => a.milestone_title.localeCompare(b.milestone_title),
      },
    },
    {
      title: "Milestone Cost",
      dataIndex: "milestone_cost",
      sorter: {
        compare: (a, b) => a.milestone_cost - b.milestone_cost,
      },
    },
    {
      title: "Budget",
      dataIndex: "add_cost_to_project_budget",
      sorter: {
        compare: (a, b) => a.add_cost_to_project_budget - b.add_cost_to_project_budget,
      },
    },
    {
      title: "Status",
      dataIndex: "milestone_status",
      render: (status) => (
        <Tag color={getMilestoneStatus(status, currentProject)}>
          {getMilestoneStatusText(status, currentProject)}
        </Tag>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "milestone_status"),
    }
  ];


  // Update the Progress Circle component to show different colors based on status
  const getProgressColor = (progress, isComplete, isOverdue) => {
    if (isComplete) return '#059669'; // Green-600
    if (isOverdue) return '#DC2626';  // Red-600
    if (progress >= 70) return '#10B981'; // Green-500
    if (progress >= 30) return '#F59E0B'; // Yellow-500
    return '#EF4444'; // Red-500
  };

  const ProjectProgress = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Project Progress</h2>
          <p className="text-sm text-gray-500 mt-1">
            {projectMetrics.tasks.total} Tasks · {projectMetrics.milestones.total} Milestones
          </p>
        </div>
        <Tag
          className={`px-3 py-1 rounded-full text-sm ${projectMetrics.isComplete ? 'bg-green-100 text-green-800' :
            projectMetrics.time.isOverdue ? 'bg-red-100 text-red-800' :
              parseFloat(projectMetrics.progress) > 70 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
            }`}
        >
          {projectMetrics.isComplete ? 'Completed' :
            projectMetrics.time.isOverdue ? 'Overdue' : 'In Progress'}
        </Tag>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Circle */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 mb-4">
            <CircularProgressbar
              value={parseFloat(projectMetrics.progress)}
              text={`${projectMetrics.progress}%`}
              styles={{
                root: { width: '100%', height: '100%' },
                path: {
                  stroke: getProgressColor(
                    parseFloat(projectMetrics.progress),
                    projectMetrics.isComplete,
                    projectMetrics.time.isOverdue
                  ),
                  strokeLinecap: 'round',
                  transition: 'stroke-dashoffset 0.5s ease',
                  strokeWidth: '8',
                },
                trail: {
                  stroke: '#edf2f7',
                  strokeLinecap: 'round',
                  strokeWidth: '8',
                },
                text: {
                  fill: '#374151',
                  fontSize: '20px',
                  fontWeight: '600',
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-semibold">
                {currentProject?.startDate
                  ? dayjs(currentProject.startDate).format('DD MMM YYYY')
                  : 'N/A'}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-semibold">
                {currentProject?.endDate
                  ? dayjs(currentProject.endDate).format('DD MMM YYYY')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Tasks Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-gray-800 font-medium">Tasks</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Tag color="success" className="rounded-full">
                    {projectMetrics.tasks.completed} Completed
                  </Tag>
                  {projectMetrics.tasks.inProgress > 0 && (
                    <Tag color="processing" className="rounded-full">
                      {projectMetrics.tasks.inProgress} In Progress
                    </Tag>
                  )}
                  {projectMetrics.tasks.remaining > 0 && (
                    <Tag color="default" className="rounded-full">
                      {projectMetrics.tasks.remaining} Remaining
                    </Tag>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold text-gray-800">
                  {projectMetrics.tasks.percentage}%
                </span>
              </div>
            </div>
            <Progress
              percent={Number(projectMetrics.tasks.percentage)}
              successPercent={Number((projectMetrics.tasks.inProgress / projectMetrics.tasks.total) * 100).toFixed(1)}
              strokeColor={{
                '0%': '#10B981',
                '100%': '#10B981'
              }}
              trailColor="#E5E7EB"
              size="small"
            />
          </div>

          {/* Milestones Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-gray-800 font-medium">Milestones</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Tag color="success" className="rounded-full">
                    {projectMetrics.milestones.completed} Completed
                  </Tag>
                  {projectMetrics.milestones.inProgress > 0 && (
                    <Tag color="processing" className="rounded-full">
                      {projectMetrics.milestones.inProgress} In Progress
                    </Tag>
                  )}
                  {projectMetrics.milestones.remaining > 0 && (
                    <Tag color="default" className="rounded-full">
                      {projectMetrics.milestones.remaining} Remaining
                    </Tag>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold text-gray-800">
                  {projectMetrics.milestones.percentage}%
                </span>
              </div>
            </div>
            <Progress
              percent={Number(projectMetrics.milestones.percentage)}
              successPercent={Number((projectMetrics.milestones.inProgress / projectMetrics.milestones.total) * 100).toFixed(1)}
              strokeColor={{
                '0%': '#3B82F6',
                '100%': '#3B82F6'
              }}
              trailColor="#E5E7EB"
              size="small"
            />
          </div>

          {/* Timeline Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-gray-800 font-medium">Timeline</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Tag
                    color={projectMetrics.time.isOverdue ? 'error' : 'default'}
                    className="rounded-full"
                  >
                    {projectMetrics.time.elapsed} Days Elapsed
                  </Tag>
                  <Tag
                    color={projectMetrics.time.remaining < 0 ? 'error' : 'processing'}
                    className="rounded-full"
                  >
                    {Math.abs(projectMetrics.time.remaining)} Days {projectMetrics.time.remaining < 0 ? 'Overdue' : 'Remaining'}
                  </Tag>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-semibold text-gray-800">
                  {projectMetrics.time.percentage}%
                </span>
              </div>
            </div>
            <Progress
              percent={Number(projectMetrics.time.percentage)}
              strokeColor={projectMetrics.time.isOverdue ? '#DC2626' : '#8B5CF6'}
              trailColor="#E5E7EB"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const ClientCard = ({ client }) => (
    <div className="bg-white rounded-xl shadow-md p-6 h-full transform transition-all duration-300 hover:shadow-md">
      {client ? (
        <div className="flex flex-col h-full">
          {/* Header with Profile */}
          <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl border-4 border-blue-100 overflow-hidden shadow-lg">
                {client.profilePic ? (
                  <img
                    src={client.profilePic}
                    alt={`${client.firstName} ${client.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/avatars/default.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                    <UserOutlined className="text-3xl text-blue-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {`${client.firstName} ${client.lastName}`}
                  </h3>
                  <p className="text-gray-500">@{client.username}</p>
                </div>
                <Tag color="blue" className="rounded-full px-3">
                  {client.gender?.charAt(0).toUpperCase() + client.gender?.slice(1)}
                </Tag>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <Tag icon={<MailOutlined className="text-blue-500" />} className="rounded-full px-3 bg-blue-50 text-blue-600 border-blue-200">
                  {client.email}
                </Tag>
                <Tag icon={<PhoneOutlined className="text-green-500" />} className="rounded-full px-3 bg-green-50 text-green-600 border-green-200">
                  {client.phoneCode} {client.phone}
                </Tag>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Bank Details Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                <span className="flex items-center gap-2">
                  <FaCoins className="text-blue-500" />
                  Banking Information
                </span>
              </h4>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <p className="font-medium">{client.bankname || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Holder</p>
                  <p className="font-medium">{client.accountholder || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="font-medium">{client.accountnumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{client.accounttype || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">IFSC Code</p>
                  <p className="font-medium">{client.ifsc || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Bank Location</p>
                  <p className="font-medium">{client.banklocation || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                <span className="flex items-center gap-2">
                  <GlobalOutlined className="text-blue-500" />
                  Business Information
                </span>
              </h4>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {client.website || 'N/A'}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500">GST Number</p>
                  <p className="font-medium">{client.gstIn || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="font-medium capitalize">{client.city || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="font-medium">{client.state || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Country</p>
                  <p className="font-medium">{client.country || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="font-medium">{client.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <UserOutlined className="text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500">No client information available</p>
        </div>
      )}
    </div>
  );

  // Add this new component after the CompactTimeline component
  const ProjectActivities = ({ milestoneData, taskData }) => {
    const [activeTab, setActiveTab] = useState('milestones');
    const [viewType, setViewType] = useState('card');

    const renderMilestoneCard = (milestone) => {
      const progress = getMilestoneProgress(milestone);
      const statusColor = getMilestoneStatus(milestone.milestone_status, milestone);
      const statusText = getMilestoneStatusText(milestone.milestone_status, milestone);

      return (
        <Card
          key={milestone.id}
          className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          bodyStyle={{ padding: '16px' }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h4 className="text-lg font-semibold mb-2">{milestone.milestone_title}</h4>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Cost</p>
                  <p className="font-medium">{formatCurrency(milestone.milestone_cost)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <Tag color={statusColor}>
                    {statusText}
                  </Tag>
                </div>
              </div>
              {/* Progress Line */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress
                  percent={progress}
                  size="small"
                  strokeColor={{
                    '0%': statusText.toLowerCase() === 'done' ? '#10B981' : '#3B82F6',
                    '100%': statusText.toLowerCase() === 'done' ? '#10B981' : '#10B981'
                  }}
                  trailColor="#E5E7EB"
                />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Tag color={statusColor} className="rounded-full">
                  {statusText}
                </Tag>
                <span className="text-xs text-gray-500">
                  Due: {dayjs(milestone.milestone_end_date).format('DD MMM YYYY')}
                </span>
              </div>
            </div>
          </div>
        </Card>
      );
    };

    // Milestone table columns
    const milestoneColumns = [
      {
        title: "Title",
        dataIndex: "milestone_title",
        key: "milestone_title",
        sorter: (a, b) => a.milestone_title.localeCompare(b.milestone_title),
      },
      {
        title: "Cost",
        dataIndex: "milestone_cost",
        key: "milestone_cost",
        render: (cost) => formatCurrency(cost),
        sorter: (a, b) => a.milestone_cost - b.milestone_cost,
      },
      {
        title: "Status",
        dataIndex: "milestone_status",
        key: "milestone_status",
        render: (status, record) => (
          <Tag color={getMilestoneStatus(status, record)}>
            {getMilestoneStatusText(status, record)}
          </Tag>
        ),
        sorter: (a, b) => a.milestone_status.localeCompare(b.milestone_status),
      },
      {
        title: "Progress",
        key: "progress",
        render: (_, record) => {
          const progress = getMilestoneProgress(record);
          const statusText = getMilestoneStatusText(record.milestone_status, record);
          return (
            <Progress
              percent={progress}
              size="small"
              strokeColor={{
                '0%': statusText.toLowerCase() === 'done' ? '#10B981' : '#3B82F6',
                '100%': statusText.toLowerCase() === 'done' ? '#10B981' : '#10B981'
              }}
              trailColor="#E5E7EB"
            />
          );
        },
        sorter: (a, b) => getMilestoneProgress(a) - getMilestoneProgress(b),
      },
      {
        title: "Due Date",
        dataIndex: "milestone_end_date",
        key: "milestone_end_date",
        render: (date) => dayjs(date).format('DD MMM YYYY'),
        sorter: (a, b) => dayjs(a.milestone_end_date).unix() - dayjs(b.milestone_end_date).unix(),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <EllipsisDropdown
            menu={
              <Menu>
                <Menu.Item key="view">View Details</Menu.Item>
                <Menu.Item key="edit">Edit Milestone</Menu.Item>
              </Menu>
            }
          />
        ),
      },
    ];

    // Task table columns
    const taskColumns = [
      {
        title: "Title",
        dataIndex: "task_title",
        key: "task_title",
        sorter: (a, b) => a.task_title.localeCompare(b.task_title),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={getStatusColor(status)} className="rounded-full">
            {status}
          </Tag>
        ),
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: "Priority",
        dataIndex: "priority",
        key: "priority",
        render: (priority) => (
          <Tag
            color={
              priority?.toLowerCase() === 'high' ? 'error' :
                priority?.toLowerCase() === 'medium' ? 'warning' : 'success'
            }
            className="rounded-full"
          >
            {priority || 'Low'}
          </Tag>
        ),
        sorter: (a, b) => (a.priority || '').localeCompare(b.priority || ''),
      },
      {
        title: "Progress",
        dataIndex: "progress",
        key: "progress",
        render: (progress, record) => (
          <Progress
            percent={progress || 0}
            size="small"
            strokeColor={getStatusColor(record.status)}
            className="mb-1"
          />
        ),
        sorter: (a, b) => (a.progress || 0) - (b.progress || 0),
      },
      {
        title: "Due Date",
        dataIndex: "end_date",
        key: "end_date",
        render: (date) => dayjs(date).format('DD MMM YYYY'),
        sorter: (a, b) => dayjs(a.end_date).unix() - dayjs(b.end_date).unix(),
      },
      {
        title: "Assignee",
        dataIndex: "assignee",
        key: "assignee",
        render: (assignee) => (
          <Avatar.Group maxCount={3} size="small">
            {Array.isArray(assignee) ? (
              assignee.map((a, idx) => (
                <Avatar
                  key={idx}
                  size="small"
                  className="border-2 border-white"
                  src={a.avatar}
                >
                  {a.name?.[0]}
                </Avatar>
              ))
            ) : (
              <Avatar size="small" className="border-2 border-white">
                {assignee?.[0] || 'U'}
              </Avatar>
            )}
          </Avatar.Group>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <EllipsisDropdown
            menu={
              <Menu>
                <Menu.Item key="view" onClick={() => handleTaskClick(record.id)}>View Details</Menu.Item>
                <Menu.Item key="edit">Edit Task</Menu.Item>
              </Menu>
            }
          />
        ),
      },
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Project Activities</h2>
            <p className="text-sm text-gray-500 mt-1">
              {`${activeTab === 'milestones' ? milestoneData.length + ' Milestones' : taskData.length + ' Tasks'}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeTab === 'milestones'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                Milestones
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeTab === 'tasks'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                Tasks
              </button>
            </div>
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType('card')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${viewType === 'card'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewType('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${viewType === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          {activeTab === 'milestones' ? (
            viewType === 'card' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {milestoneData.map(renderMilestoneCard)}
              </div>
            ) : (
              <Table
                columns={milestoneColumns}
                dataSource={milestoneData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                className="milestone-table"
              />
            )
          ) : (
            viewType === 'card' ? (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                {Object.entries(tasksByStatus).map(([status, tasks]) => (
                  <div
                    key={status}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Status Header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColor(status) }}
                          />
                          <h3 className="font-medium text-gray-800">{status}</h3>
                        </div>
                        <Tag
                          color={status.toLowerCase() === 'completed' ? 'success' : 'processing'}
                          className="rounded-full"
                        >
                          {tasks.length} Tasks
                        </Tag>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="p-3">
                      <div className="space-y-3">
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            className="group bg-white rounded-lg border border-gray-200 hover:border-blue-300 
                                   hover:shadow-md transition-all duration-300"
                          >
                            <div className="p-4">
                              {/* Task Header */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-grow">
                                  <h4
                                    className="text-sm font-medium text-gray-800 hover:text-blue-600 
                                           cursor-pointer line-clamp-2 mb-1"
                                    onClick={() => handleTaskClick(task.id)}
                                  >
                                    {task.task_title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <CalendarOutlined className="text-blue-400" />
                                    <span>Due: {dayjs(task.end_date).format('DD MMM YYYY')}</span>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <EllipsisDropdown
                                    menu={
                                      <Menu>
                                        <Menu.Item key="view">View Details</Menu.Item>
                                        <Menu.Item key="edit">Edit Task</Menu.Item>
                                      </Menu>
                                    }
                                  />
                                </div>
                              </div>

                              {/* Task Progress */}
                              {task.progress !== undefined && (
                                <div className="mb-3">
                                  <Progress
                                    percent={task.progress}
                                    size="small"
                                    strokeColor={getStatusColor(status)}
                                    className="mb-1"
                                  />
                                </div>
                              )}

                              {/* Task Footer */}
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-3">
                                  {/* Priority Tag */}
                                  {task.priority && (
                                    <Tag
                                      color={
                                        task.priority.toLowerCase() === 'high' ? 'error' :
                                          task.priority.toLowerCase() === 'medium' ? 'warning' :
                                            'success'
                                      }
                                      className="rounded-full text-xs"
                                    >
                                      {task.priority}
                                    </Tag>
                                  )}

                                  {/* Task Type */}
                                  {task.task_type && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <TeamOutlined className="text-gray-400" />
                                      {task.task_type}
                                    </span>
                                  )}
                                </div>

                                {/* Assignees */}
                                <div className="flex items-center">
                                  {task.assignee && (
                                    <Tooltip title={`Assigned to: ${task.assignee}`}>
                                      <Avatar.Group maxCount={3} size="small">
                                        {Array.isArray(task.assignee) ? (
                                          task.assignee.map((assignee, idx) => (
                                            <Avatar
                                              key={idx}
                                              size="small"
                                              className="border-2 border-white"
                                              src={assignee.avatar}
                                            >
                                              {assignee.name?.[0]}
                                            </Avatar>
                                          ))
                                        ) : (
                                          <Avatar
                                            size="small"
                                            className="border-2 border-white"
                                          >
                                            {task.assignee[0]}
                                          </Avatar>
                                        )}
                                      </Avatar.Group>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Task Description Preview */}
                            {task.description && (
                              <div className="px-4 pb-3">
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {task.description.replace(/<[^>]*>/g, '')}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Table
                columns={taskColumns}
                dataSource={taskData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                className="task-table"
              />
            )
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ProjectProgress />
        <ClientCard client={fndclient} />
      </div>

      <ProjectActivities
        milestoneData={milestoneData}
        taskData={taskData}
      />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              title: 'Project Budget',
              value: formatCurrency(currentProject?.budget || '0'),
              icon: <FaCoins />,
              color: 'blue',
              isCurrency: true,
            },
            {
              title: 'Hours Logged',
              value: `${currentProject?.estimatedhours || '0'} hrs`,
              icon: <TbClockHour3Filled />,
              color: 'green',
              isCurrency: false,
            },
            {
              title: 'Earnings',
              value: formatCurrency(currentProject?.earnings || '0'),
              icon: <FaCoins />,
              color: 'indigo',
              isCurrency: true,
            },
            {
              title: 'Expenses',
              value: formatCurrency(currentProject?.expenses || '0'),
              icon: <FaCoins />,
              color: 'red',
              isCurrency: true,
            },
            {
              title: 'Profit',
              value: formatCurrency(currentProject?.profit || '0'),
              icon: <FaCoins />,
              color: 'emerald',
              isCurrency: true,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                <span className={`text-${stat.color}-500 text-2xl`}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-2xl font-semibold text-gray-800">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Project Details
        </h2>
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html:
                filterdata?.[0]?.project_description?.replace(/<[^>]*>/g, '') ||
                'No project description available',
            }}
            className="text-gray-600 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

export default OverViewList;

