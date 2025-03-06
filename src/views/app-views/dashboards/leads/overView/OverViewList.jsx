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
import { GetProject } from "../../project/project-list/projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { GetTasks } from "../../project/task/TaskReducer/TaskSlice";
import { GetLeads } from "../LeadReducers/LeadSlice";

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

  useEffect(()=>{
    dispatch(GetLeads())
  },[dispatch])

  const alldeaddata = useSelector((state)=>state.Leads.Leads.data)
  const fnddead = alldeaddata?.find((item)=>item?.id === id)

  console.log("fnddead",fnddead)  



  // Safe access to Redux state with multiple fallback checks
  const allempdata = useSelector((state) => state?.Project) || {};
  const filterdata = allempdata?.Project?.data || [];

  // Fetch data immediately when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Load client data first
        await dispatch(ClientData());
        // Then load project and task data
        await Promise.all([
          dispatch(GetProject()),
          dispatch(GetTasks(id))
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);


  // Calculate progress based on date range
  useEffect(() => {
    if (!filterdata || !Array.isArray(filterdata) || filterdata.length === 0) {
      setProo("0");
      return;
    }

    const projectData = filterdata[0];
    if (!projectData?.startDate || !projectData?.endDate) {
      setProo("0");
      return;
    }

    try {
      const startDate = new Date(projectData.startDate);
      const endDate = new Date(projectData.endDate);
      const currentDate = new Date();

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setProo("0");
        return;
      }

      // Calculate total project duration in milliseconds
      const totalDuration = endDate.getTime() - startDate.getTime();

      // Calculate elapsed time in milliseconds
      const elapsedTime = currentDate.getTime() - startDate.getTime();

      // Calculate progress percentage
      let progressPercentage;

      if (currentDate < startDate) {
        // Project hasn't started yet
        progressPercentage = 0;
      } else if (currentDate > endDate) {
        // Project has passed end date
        progressPercentage = 100;
      } else {
        // Project is in progress
        progressPercentage = (elapsedTime / totalDuration) * 100;
      }

      // Round to 2 decimal places and ensure it's between 0 and 100
      progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);
      setProo(progressPercentage.toFixed(2));

      // Optional: Log details for debugging
      console.log({
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        currentDate: currentDate.toLocaleDateString(),
        totalDays: Math.ceil(totalDuration / (1000 * 60 * 60 * 24)),
        elapsedDays: Math.ceil(elapsedTime / (1000 * 60 * 60 * 24)),
        progress: `${progressPercentage.toFixed(2)}%`
      });

    } catch (error) {
      console.error("Error calculating progress:", error);
      setProo("0");
    }
  }, [filterdata]);

  // Update the selector to properly access client data from Redux store
  const allclient = useSelector((state) => state?.SubClient?.SubClient?.data) || [];
  
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

  const logged = useSelector((state)=>state.user.loggedInUser)

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

  const taskData = useSelector((state) => state?.Tasks?.Tasks?.data) || [];

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-2 bg-gray-50">
      <div className="mb-4 bg-white p-8 rounded-lg shadow">
          <h4 className="text-2xl font-medium text-black mb-4">Lead Details</h4>
          <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 font-weight-bold text-lg mb-1">Start Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.startDate
                    ? dayjs(filterdata[0].startDate).format('DD/MM/YYYY')  // Changed format here
                    : "N/A"}
                </span>
              </div>

              {/* End Date */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 font-weight-bold text-lg mb-1">End Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.endDate
                    ? dayjs(filterdata[0].endDate).format('DD/MM/YYYY')  // Changed format here
                    : "N/A"}
                </span>
              </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-black mb-4">
              Lead Progress
            </h2>

            <div className="flex flex-col items-center justify-center w-full">
              <div className="relative w-32 h-32">
                <CircularProgressbar
                  value={parseFloat(proo)}
                  text={`${proo}%`}
                  circleRatio={0.5}
                  rotation={0.50}
                  styles={{
                    root: {
                      transform: "rotate(0.50turn)",
                    },
                    path: {
                      stroke: `${parseFloat(proo) < 50
                          ? "#FFA500"  // Orange for less than 50%
                          : parseFloat(proo) < 80
                            ? "#2E8B57"  // Sea Green for 50-80%
                            : "#008000"  // Green for above 80%
                        }`,
                      strokeLinecap: "round",
                      strokeWidth: "6",
                      transition: "stroke-dashoffset 0.5s ease 0s",
                      transform: "rotate(0.50turn)",
                      transformOrigin: "center center",
                    },
                    trail: {
                      stroke: "#edf2f7",
                      strokeLinecap: "round",
                      strokeWidth: "6",
                      transform: "rotate(0.25turn)",
                      transformOrigin: "center center",
                    },
                    text: {
                      fill: "#333",
                      fontSize: "14px",
                      fontWeight: 500,
                      transform: "rotate(0.50turn)",
                      transformOrigin: "center center",
                      dominantBaseline: "middle",
                      textAnchor: "middle",
                    },
                  }}
                />
                {/* Scale markers */}
                <div className="relative mt-2">
                  <span className="absolute left-0 top-[-73px] sm:top-[-60px] text-xs text-gray-500">
                    0%
                  </span>
                  <span className="absolute right-[-12px] top-[-73px] sm:top-[-60px] text-xs text-gray-500">
                    100%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              {/* Start Date */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 font-weight-bold text-lg mb-1">Start Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.startDate
                    ? dayjs(filterdata[0].startDate).format('DD/MM/YYYY')  // Changed format here
                    : "N/A"}
                </span>
              </div>

              {/* End Date */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 font-weight-bold text-lg mb-1">End Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.endDate
                    ? dayjs(filterdata[0].endDate).format('DD/MM/YYYY')  // Changed format here
                    : "N/A"}
                </span>
              </div>
            </div>

          </div>
       
          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-medium mb-0 text-black">Client</h2>
            {fndclient ? (
              <div className="flex items-center gap-4">
                <div className="mt-6">
                  {/* Profile Picture with error handling */}
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={fndclient?.profilePic || 'https://via.placeholder.com/64'} 
                      alt="Client profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/64';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="f-18 f-w-500 mb-0 text-black mt-6">
                    {fndclient?.firstName || fndclient?.username || 'No Name Available'}
                  </h3>
                  <p className="f-14 mb-0 text-lightest">
                    {fndclient?.email || 'No Email Available'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-gray-500">
                No client information available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Task */}

          <div className="bg-white rounded-lg shadow p-6 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Tasks Status</h2>
            {taskData.length > 0 ? (
              <div className="flex justify-center items-center w-[300px] h-[300px]">
                <Pie
                  data={taskStatusData}
                  options={chartOptions}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <p className="text-gray-500 text-lg">No tasks found</p>
                <p className="text-gray-400 text-sm">Create tasks to see status distribution</p>
              </div>
            )}
          
          </div>

          <div className="">
            <div>
              <p className="text-2xl font-semibold text-black mb-1">
                Statistics
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Lead Budget
                </h3>
                <span className="flex justify-end">
                  <FaCoins className="text-gray-500 text-2xl" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  {filterdata[0]?.budget}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Lead Hours Logged
                </h3>
                <span className="flex justify-end mb-2">
                  <TbClockHour3Filled className="text-gray-500 text-2xl" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  {filterdata[0]?.estimatedhours}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                  Lead Earnings
                </h3>
                <span className="flex justify-end mb-2">
                  {" "}
                  <FaCoins className="text-gray-500 text-2xl" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  30,644.00
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Lead Expenses
                </h3>
                <span className="flex justify-end">
                  {" "}
                  <FaCoins className="text-gray-500 text-2xl mb-2" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  0.00
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Lead Profit
                </h3>
                <span className="flex justify-end mb-2">
                  {" "}
                  <FaCoins className="text-gray-500 text-2xl" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  30,644.00
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Hours Logged Chart */}
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Hours Logged</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Budget Chart */}
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Lead Budget</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

       
       
         <div className="mb-4 bg-white p-8 rounded-lg shadow">
          <h4 className="text-2xl font-medium text-black mb-4">Lead Details</h4>
          <div className="mt-4">
            <ul className="list-disc pl-4">
              <li dangerouslySetInnerHTML={{ __html: filterdata?.[0]?.lead_description?.replace(/<[^>]*>/g, '') || 'No lead description available' }}>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </>
  );
};

export default OverViewList;

