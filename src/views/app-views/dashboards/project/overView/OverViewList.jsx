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
import { TbClockHour3Filled } from "react-icons/tb";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { GetTasks } from "../task/TaskReducer/TaskSlice";

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

  

  // Safe access to Redux state with multiple fallback checks
  const allempdata = useSelector((state) => state?.Project) || {};
  const filterdata = allempdata?.Project?.data || [];

  // Fetch data immediately when component mounts
  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
    dispatch(GetTasks(id));
    setIsLoading(false);
  }, [dispatch]);

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
          label: function(context) {
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

  // Task Modal Content
  // const TaskModal = () => (
  //   <Modal
  //     title={`${selectedStatus || ''} Tasks`}
  //     open={isTaskModalVisible}
  //     onCancel={() => setIsTaskModalVisible(false)}
  //     footer={null}
  //     width={800}
  //   >
  //     <div className="max-h-[60vh] overflow-y-auto">
  //       {selectedStatus && tasksByStatus[selectedStatus]?.map((task) => (
  //         <div
  //           key={task.id}
  //           onClick={() => handleTaskClick(task.id)}
  //           className="cursor-pointer hover:bg-gray-50 p-4 border-b border-gray-200"
  //         >
  //           <div className="flex justify-between items-center">
  //             <div>
  //               <h3 className="font-medium text-gray-900">{task.taskName}</h3>
  //               <p className="text-sm text-gray-500">
  //                 Due: {new Date(task.dueDate).toLocaleDateString()}
  //               </p>
  //             </div>
  //             <div
  //               className="px-3 py-1 rounded-full text-sm text-white"
  //               style={{
  //                 backgroundColor: getStatusColor(task.status),
  //                 boxShadow: `0 2px 4px ${getStatusColor(task.status)}40`
  //               }}
  //             >
  //               {task.status}
  //             </div>
  //           </div>
  //           {task.description && (
  //             <p className="text-sm text-gray-600 mt-2 line-clamp-2">
  //               {task.description}
  //             </p>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   </Modal>
  // );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-2 bg-gray-50">
        {/* Project Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-black mb-4">
              Project Progress
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Progress Circle */}
              <div className="flex justify-center sm:justify-start">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
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
                        stroke: `${
                          parseFloat(proo) < 50
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

              {/* Start Date */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 text-sm mb-1">Start Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.startDate
                    ? new Date(filterdata[0].startDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* End Date */}
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-500 text-sm mb-1">End Date</span>
                <span className="text-gray-800 text-sm sm:text-base">
                  {filterdata?.[0]?.endDate
                    ? new Date(filterdata[0].endDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
          {/* Client Section */}
          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <h2 className="text-xl font-medium mb-0 text-black">Client</h2>
            <div className="flex items-center gap-4">
              <img
                src={updatedList[0]?.profilePic}
                alt="Client"
                className="w-16 h-16 rounded-sm object-fit-cover position-relative mt-6"
              />
              <div>
                <h3 className="f-18 f-w-500 mb-0 text-black mt-6">
                  {updatedList[0]?.username || 'No Client Name'}
                </h3>
                <p className="f-14 mb-0 text-lightest">
                  {updatedList[0]?.email || 'No Email Available'}
                </p>
                {/* <p className="f-14 mb-0 text-lightest">
                  {updatedList[0]?.created_by || 'No Email Available'}
                </p> */}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Task */}

          <div className="bg-white rounded-lg shadow p-6 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Tasks Status</h2>
            <div className="flex justify-center items-center w-[300px] h-[300px]">
              <Pie 
                data={taskStatusData}
                options={chartOptions}
              />
            </div>
            {/* Status Legend */}
            {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
              {taskStatusData.labels.map((status, index) => (
                <div 
                  key={status}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedStatus(status);
                    setIsTaskModalVisible(true);
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: taskStatusData.datasets[0].backgroundColor[index] }}
                  />
                  <span className="text-sm text-gray-600 truncate">
                    {status}
                  </span>
                </div>
              ))}
            </div> */}
          </div>

          {/* Statistics Section */}

          <div className="">
            <div>
              <p className="text-2xl font-semibold text-black mb-1">
                Statistics
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Project Budget
                </h3>
                <span className="flex justify-end">
                  <FaCoins className="text-gray-500 text-2xl" />
                </span>
                <p className="text-xl font-medium md:text-base text-blue-500">
                  {filterdata[0]?.budget}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                  Hours Logged
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
                  Earnings
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
                  Expenses
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
                  Profit
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

        {/* Charts Section */}

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
            <h2 className="text-xl font-semibold mb-4">Project Budget</h2>
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

        {/* <div className="bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div className="w-full">
                        <h2 className="text-xl font-semibold mb-4">Hours Logged</h2>
                        <BarChart width={400} height={300} data={hoursData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar dataKey="value" fill="#ef4444" />
                        </BarChart>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold mb-4">Project Budget</h2>
                        <BarChart width={400} height={300} data={budgetData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Bar dataKey="value" fill="#ef4444" />
                        </BarChart>
                    </div>
                </div> */}

        {/* Project Details */}
        <div className=" mb-4 bg-white p-8  rounded-lg shadow">
          <h4 className="text-2xl font-medium text-black ">Project Details</h4>
          <p className="flex justify-start mt-2 text-sm font-medium">
            Rem asperiores voluptates distinctio ab. Cum rerum veritatis
            nesciunt libero laboriosam molestiae. Voluptates hic molestias
            consectetur doloribus.
          </p>
          {/* </div> */}
        </div>
      </div>

      {/* <TaskModal /> */}
    </>
  );
};

export default OverViewList;
