import React, { useEffect, useState, useMemo } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FaCoins } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from 'dayjs';
import { TbClockHour3Filled } from "react-icons/tb";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Tag, Table, Timeline, Progress, Avatar, Menu } from 'antd';
import { GetTasks } from "../task/TaskReducer/TaskSlice";
import { Getmins } from "../milestone/minestoneReducer/minestoneSlice";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import utils from "utils";
import { ClockCircleOutlined, CheckCircleOutlined, LoadingOutlined, UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const OverViewList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [proo, setProo] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Move all selectors to the top
  const allempdata = useSelector((state) => state?.Project) || {};
  const filterdata = allempdata?.Project?.data || [];
  const taskData = useSelector((state) => state?.Tasks?.Tasks?.data) || [];
  const milestoneData = useSelector((state) => state.Milestone?.Milestone?.data) || [];
  const allclient = useSelector((state) => state?.SubClient?.SubClient?.data) || [];
  const logged = useSelector((state) => state.user.loggedInUser);

  // Enhanced progress calculation
  const projectMetrics = useMemo(() => {
    try {
      const totalTasks = taskData.length;
      const totalMilestones = milestoneData.length;
      const completedTasks = taskData.filter(task => task.status?.toLowerCase() === 'completed').length;
      const completedMilestones = milestoneData.filter(milestone => milestone.milestone_status?.toLowerCase() === 'completed').length;

      const start = dayjs(filterdata?.[0]?.startDate);
      const end = dayjs(filterdata?.[0]?.endDate);
      const now = dayjs();

      const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
      const totalDuration = end.diff(start, 'day');
      const elapsed = now.diff(start, 'day');
      const remaining = end.diff(now, 'day');
      const timeProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      const weightedProgress = totalTasks === 0 && totalMilestones === 0 ? timeProgress :
        totalTasks === 0 ? milestoneProgress :
          totalMilestones === 0 ? taskProgress :
            (taskProgress * 0.4) + (milestoneProgress * 0.6);

      return {
        progress: weightedProgress.toFixed(1),
        tasks: { total: totalTasks, completed: completedTasks },
        milestones: { total: totalMilestones, completed: completedMilestones },
        time: { total: totalDuration, elapsed, remaining },
        isComplete: weightedProgress >= 100 ||
          (completedTasks === totalTasks &&
            completedMilestones === totalMilestones)
      };
    } catch (error) {
      console.error("Error calculating metrics:", error);
      return {
        progress: "0",
        tasks: { total: 0, completed: 0 },
        milestones: { total: 0, completed: 0 },
        time: { total: 0, elapsed: 0, remaining: 0 },
        isComplete: false
      };
    }
  }, [taskData, milestoneData, filterdata]);

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
  const fndpro = filterdata.find((item) => item.id === id);
  const fndclient = allclient?.find((item) => item?.id === fndpro?.client);

  // Safe access to client data with fallbacks
  const Allclientdata = useSelector((state) => state?.SubClient) || {};
  const dataclient = Allclientdata?.SubClient?.data || [];

  // Safe filtering with existence checks
  const updatedList = useMemo(() => {
    if (!filterdata?.length || !filterdata[0]?.client || !dataclient?.length) {
      return [];
    }
    return dataclient.filter((item) => item.id === filterdata[0].client);
  }, [filterdata, dataclient]);

  // Prepare chart data with safety checks
  const hoursData = useMemo(() => {
    if (!filterdata?.length || !filterdata[0]?.estimatedhours) {
      return [];
    }
    return [{ name: "Planned", value: filterdata[0].estimatedhours }];
  }, [filterdata]);

  const budgetData = useMemo(() => {
    if (!filterdata?.length || !filterdata[0]?.budget) {
      return [];
    }
    return [{ name: "Planned", value: filterdata[0].budget }];
  }, [filterdata]);

  // Safe date formatting with fallbacks
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  };

  const dateendd = filterdata?.[0]?.startDate
    ? formatDate(filterdata[0].startDate)
    : "N/A";

  // const subclient = useSelector((state)=>state.SubClient.SubClient.data)

  const datestartt = filterdata?.[0]?.endDate
    ? formatDate(filterdata[0].endDate)
    : "N/A";

  const progress = 50;
  const startDate = "Wed 24 Jul 2024";
  const deadline = "Sun 24 Nov 2024";

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border shadow-lg p-2 rounded">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-gray-700">Planned: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Chart options with hover effects
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, index) => ({
                text: `${label}`,
                fillStyle: data.datasets[0].backgroundColor[index],
                strokeStyle: data.datasets[0].backgroundColor[index],
                pointStyle: 'circle',
                index: index
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} tasks (${percentage}%)`;
          }
        }
      }
    },
    // onClick: (event, elements) => {
    //   if (elements.length > 0) {
    //     const index = elements[0].index;
    //     const status = taskStatusData.labels[index];
    //     setSelectedStatus(status);
    //     setIsTaskModalVisible(true);
    //   }
    // }
  };

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
  const getMilestoneStatus = (status) => {
    if (status === "Paid") return "success";
    if (status === "Pending") return "warning";
    if (status === "Expired") return "error";
    return "";
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
        <Tag color={getMilestoneStatus(status)}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "milestone_status"),
    }
  ];

  // Add this function to get filtered milestones
  const getFilteredMilestones = () => {
    return milestoneData || [];
  };

  // Add this status color mapping at the top of the component
  const timelineStatusColors = {
    'Not Started': '#1890ff',  // Blue
    'In Progress': '#52c41a',  // Green
    'Overdue': '#f5222d',     // Red
  };

  const ProjectProgress = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Project Progress</h2>
        <span className={`px-3 py-1 rounded-full text-sm ${projectMetrics.isComplete ? 'bg-green-100 text-green-800' :
          parseFloat(projectMetrics.progress) > 70 ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
          {projectMetrics.isComplete ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Circle */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48">
            <CircularProgressbar
              value={parseFloat(projectMetrics.progress)}
              text={`${projectMetrics.progress}%`}
              styles={{
                root: { width: '100%', height: '100%' },
                path: {
                  stroke: `${projectMetrics.isComplete ? '#059669' :
                    parseFloat(projectMetrics.progress) >= 70 ? '#10B981' :
                      parseFloat(projectMetrics.progress) >= 30 ? '#F59E0B' :
                        '#EF4444'
                    }`,
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
        </div>

        {/* Progress Stats */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tasks</span>
                <span className="text-gray-900 font-medium">
                  {projectMetrics.tasks.completed}/{projectMetrics.tasks.total}
                </span>
              </div>
              <Progress
                percent={(projectMetrics.tasks.completed / projectMetrics.tasks.total) * 100}
                strokeColor="#10B981"
                size="small"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Milestones</span>
                <span className="text-gray-900 font-medium">
                  {projectMetrics.milestones.completed}/{projectMetrics.milestones.total}
                </span>
              </div>
              <Progress
                percent={(projectMetrics.milestones.completed / projectMetrics.milestones.total) * 100}
                strokeColor="#3B82F6"
                size="small"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Timeline</span>
                <span className="text-gray-900 font-medium">
                  {projectMetrics.time.elapsed}/{projectMetrics.time.total} days
                </span>
              </div>
              <Progress
                percent={(projectMetrics.time.elapsed / projectMetrics.time.total) * 100}
                strokeColor="#8B5CF6"
                size="small"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-semibold">
                {filterdata?.[0]?.startDate
                  ? dayjs(filterdata[0].startDate).format('DD MMM YYYY')
                  : 'N/A'}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-semibold">
                {filterdata?.[0]?.endDate
                  ? dayjs(filterdata[0].endDate).format('DD MMM YYYY')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ClientCard = ({ client }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <TeamOutlined className="mr-2" />
        Client Details
      </h2>
      {client ? (
        <div className="flex flex-col">
          {/* Client Header */}
          <div className="flex items-start space-x-6 mb-6">
            <div className="flex-shrink-0">
              {client?.profilePic ? (
                <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                  <img
                    src={client.profilePic}
                    alt={client.firstName || client.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/avatars/default.png';
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl bg-blue-50 flex items-center justify-center border-4 border-gray-100">
                  <UserOutlined className="text-4xl text-blue-400" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {client?.firstName || client?.username || 'No Name Available'}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                {client?.company || 'Company Not Specified'}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${client?.status === 'active' ? 'bg-green-100 text-green-700' :
                    client?.status === 'inactive' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'}`}>
                  {client?.status?.toUpperCase() || 'STATUS N/A'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  Client since {dayjs(client?.createdAt).format('MMM YYYY')}
                </span>
              </div>
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <MailOutlined className="text-lg text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{client?.email || 'No Email'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <PhoneOutlined className="text-lg text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium">{client?.phone || 'No Phone'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <GlobalOutlined className="text-lg text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Website</p>
                <p className="text-sm font-medium">
                  {client?.website ? (
                    <a href={client.website} target="_blank" rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800">
                      {client.website}
                    </a>
                  ) : 'No Website'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CalendarOutlined className="text-lg text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Projects</p>
                <p className="text-sm font-medium">{client?.totalProjects || '1'} Active</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {client?.address && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm">{client.address}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <UserOutlined className="text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500">No client information available</p>
        </div>
      )}
    </div>
  );

  // Add this new component after the CompactTimeline component
  const ProjectActivities = ({ milestoneData, taskData }) => {
    const [activeTab, setActiveTab] = useState('milestones');
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const getMilestoneProgress = (milestone) => {
      const tasks = taskData.filter(task => task.milestone_id === milestone.id);
      if (!tasks.length) return 0;
      const completed = tasks.filter(task => task.status?.toLowerCase() === 'completed').length;
      return Math.round((completed / tasks.length) * 100);
    };

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Project Activities</h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'milestones'
                ? `${milestoneData.length} Milestones`
                : `${taskData.length} Tasks`}
            </p>
          </div>
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
        </div>

        <div className="overflow-hidden">
          {activeTab === 'milestones' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {milestoneData.map((milestone) => {
                const progress = getMilestoneProgress(milestone);
                const isSelected = selectedMilestone?.id === milestone.id;

                return (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer
                      ${isSelected
                        ? 'border-blue-200 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'}`}
                    onClick={() => setSelectedMilestone(isSelected ? null : milestone)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${milestone.milestone_status?.toLowerCase() === 'completed'
                              ? 'bg-green-500'
                              : progress >= 50
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                              }`}
                          />
                          <h3 className="font-medium text-gray-800 line-clamp-1">
                            {milestone.milestone_title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Tag color={milestone.milestone_status?.toLowerCase() === 'completed'
                            ? 'success'
                            : progress >= 50 ? 'processing' : 'warning'}
                          >
                            {milestone.milestone_status}
                          </Tag>
                          <span className="text-xs text-gray-500">
                            Due: {dayjs(milestone.milestone_end_date).format('DD MMM YYYY')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-gray-900">
                          ${milestone.milestone_cost || 0}
                        </div>
                        <div className="text-xs text-gray-500">Budget</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">{progress}%</span>
                      </div>
                      <Progress
                        percent={progress}
                        size="small"
                        strokeColor={{
                          '0%': '#1890ff',
                          '100%': '#52c41a',
                        }}
                        showInfo={false}
                      />
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">
                          {milestone.milestone_summary ? (
                            <span className="leading-relaxed">
                              {milestone.milestone_summary.replace(/<[^>]*>/g, '')}
                            </span>
                          ) : (
                            'No description available'
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {taskData
                            .filter(task => task.milestone_id === milestone.id)
                            .map(task => (
                              <Tag
                                key={task.id}
                                color={task.status?.toLowerCase() === 'completed' ? 'success' : 'default'}
                                className="px-2 py-1"
                              >
                                {task.task_title}
                              </Tag>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
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
              value: filterdata[0]?.budget || '0',
              icon: <FaCoins />,
              color: 'blue',
            },
            {
              title: 'Hours Logged',
              value: filterdata[0]?.estimatedhours || '0',
              icon: <TbClockHour3Filled />,
              color: 'green',
            },
            {
              title: 'Earnings',
              value: '30,644.00',
              icon: <FaCoins />,
              color: 'indigo',
            },
            {
              title: 'Expenses',
              value: '0.00',
              icon: <FaCoins />,
              color: 'red',
            },
            {
              title: 'Profit',
              value: '30,644.00',
              icon: <FaCoins />,
              color: 'emerald',
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

