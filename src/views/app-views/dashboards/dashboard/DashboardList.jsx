import React, { useEffect, useMemo, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { GoPeople } from "react-icons/go";
import { CiTrophy } from "react-icons/ci";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import RecentOrderGraph from "../../../../components/RecentOrderGraph.jsx";
import DateRangeFilter from "../../../../components/DateRangeFilter.jsx";
import TicketList from "../../../../components/TicketTableList.jsx";
import RegistionTable from "../../../../components/RegistrationTableList.jsx";
import { Pie } from "react-chartjs-2";
import { Table, Row, Col, Card, Empty, Badge, Select } from "antd";
import { MailOutlined, GlobalOutlined, PhoneOutlined, RocketOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice.jsx";
import { GetPlan } from "views/app-views/plan/PlanReducers/PlanSlice.jsx";
import { getAllTicket } from "views/app-views/pages/customersupports/ticket/TicketReducer/TicketSlice.jsx";
import { getsubplandata } from "views/app-views/subscribeduserplans/subplanReducer/subplanSlice.jsx";
import { } from "antd";
import Flex from 'components/shared-components/Flex'; // Use your existing Flex component
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyRevenueCard = () => {
  const [chartData, setChartData] = useState([]);
  const [totalSubclients, setTotalSubclients] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const dispatch = useDispatch();
  const subclients = useSelector((state) => state?.ClientData?.ClientData?.data || []);
  const isLoading = useSelector((state) => state?.ClientData?.isLoading);

console.log("asdsadas",subclients);

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    if (subclients && subclients.length > 0) {
      const monthsInYear = [...Array(12)].map((_, i) => {
        return moment().year(selectedYear).month(i).format('MMM YYYY');
      });

      const monthlyCounts = monthsInYear.map(monthYear => {
        return subclients.filter(client =>
          moment(client.createdAt).format('YYYY') === selectedYear.toString() &&
          moment(client.createdAt).format('MMM YYYY') === monthYear
        ).length;
      });

      const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
      setTotalSubclients(total);

      const currentMonth = moment().month();
      const currentMonthCount = monthlyCounts[currentMonth];
      const previousMonthCount = monthlyCounts[currentMonth - 1] || 0;

      const growth = previousMonthCount !== 0
        ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
        : 0;
      setGrowthPercentage(growth.toFixed(1));

      setChartData(monthlyCounts);
    }
  }, [subclients, selectedYear]);

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 2,
        columnWidth: '40%',
        dataLabels: {
          position: 'top'
        }
      }
    },
    colors: ['#3b82f6'],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val > 0 ? val : '';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#64748b']
      }
    },
    grid: {
      show: true,
      borderColor: '#f0f0f0',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
    },
    xaxis: {
      categories: [...Array(12)].map((_, i) =>
        moment().month(i).format('MMM')
      ),
      axisBorder: {
        show: true,
        color: '#e0e0e0',
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        rotate: 0
      },
      title: {
        text: selectedYear.toString(),
        offsetY: 75,
        style: {
          color: '#64748b',
          fontSize: '12px',
          fontWeight: 600
        }
      }
    },
    yaxis: {
      min: 0,
      max: Math.max(...chartData, 2) + 0.5, // Add some padding above highest value
      tickAmount: 4,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: function (val) {
          return val.toFixed(1);
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} Clients`
      }
    }
  };

  const yearOptions = [];
  const currentYear = moment().year();
  for (let i = 0; i < 5; i++) {
    yearOptions.unshift(currentYear - i);
  }

  return (
    <Card className="w-full shadow-md">
      <div className="flex flex-col space-y-4">
        {/* Header with Year Select */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Monthly Clients</h2>
            <p className="text-sm text-gray-500">
              Year {selectedYear} Overview
            </p>
          </div>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
          >
            {yearOptions.map(year => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Client Stats */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900">{totalSubclients}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${growthPercentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(growthPercentage)}%
            </span>
            <span className="text-gray-500 text-xs">growth from last month</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Total number of clients in {selectedYear}
          </p>
        </div>

        {/* Chart */}
        <div className="h-[350px] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <span>Loading...</span>
            </div>
          ) : (
            <ReactApexChart
              options={chartOptions}
              series={[{
                name: 'Clients',
                data: chartData
              }]}
              type="bar"
              height="100%"
            />
          )}
        </div>
      </div>
    </Card>
  );
};

const DashboardList = () => {
  const dispatch = useDispatch();
  const [clientdata, setclientdata] = useState("");
  const [plan, setPlan] = useState("");
  const [users, setUsers] = useState([]);
  const plans = useSelector((state) => state?.Plan?.Plan || []);

  const loggedInUser = useSelector((state) => state?.user?.loggedInUser || {});
  const subclients = useSelector((state) => state?.ClientData?.ClientData?.data || []);


  useEffect(() => {
    dispatch(ClientData());
    dispatch(GetPlan());
    dispatch(getAllTicket());
  }, [dispatch]);

  const allclientdata = useSelector((state) => state.ClientData);
  const fnddataclint = allclientdata.ClientData.data;

  const allplandata = useSelector((state) => state.Plan);
  const fnddataplan = allplandata.Plan;


  const planNames = fnddataplan?.map((plan) => plan.name) || [];
  const planPrices = fnddataplan?.map((plan) => parseFloat(plan.price)) || [];

  const allticket = useSelector((state) => state.Ticket);
  const fnddataticket = allticket.Ticket.data;


  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = useMemo(() => alldatas.subplan.data || [], [alldatas.subplan.data]);


console.log("wefwefwefewf",fnddtat);

console.log("plan data",fnddataplan);

  useEffect(() => {
    dispatch(getsubplandata());
  }, [dispatch]);


  useEffect(() => {
    dispatch(GetPlan());
    dispatch(ClientData());
  }, [dispatch]);


  const allclient = useSelector((state) => state.ClientData);
  const fndclient = allclient.ClientData.data || [];

  const allplan = useSelector((state) => state.Plan);
  const fndplan = allplan?.Plan || [];



  useEffect(() => {
    if (fnddtat) {
      setUsers(fnddtat);
    }
  }, [fnddtat]);



  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

  // Update the ticketStatusColors definition
  const ticketStatusColors = {
    'Low': '#22c55e',    // Green for low priority
    'Medium': '#f97316',  // Orange for medium priority
    'High': '#ef4444',    // Red for high priority
    'Unknown': '#94a3b8'  // Gray for unknown/undefined priority
  };

  // Calculate ticket status data
  const calculateTicketStatusData = () => {
    if (!fnddataticket || !Array.isArray(fnddataticket)) {
      return {
        sessionData: [],
        sessionLabels: [],
        conbinedSessionData: []
      };
    }

    // Count tickets by priority and ensure correct color mapping
    const statusCounts = fnddataticket.reduce((acc, ticket) => {
      // Convert priority to proper case to match our color mapping
      const priority = (ticket.priority || 'Unknown').charAt(0).toUpperCase() +
        (ticket.priority || 'Unknown').slice(1).toLowerCase();
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    // Create arrays for chart data
    const sessionLabels = Object.keys(statusCounts);
    const sessionData = Object.values(statusCounts);

    // Create combined data for legend with correct colors
    const conbinedSessionData = sessionLabels.map((label) => ({
      label: label,
      data: statusCounts[label],
      color: ticketStatusColors[label]
    }));

    return {
      sessionData,
      sessionLabels,
      conbinedSessionData
    };
  };

  // Get the calculated data
  const { sessionData, sessionLabels, conbinedSessionData } = calculateTicketStatusData();

  useEffect(() => {
    const datalength = fnddataclint?.length; // Getting the length of the array
    setclientdata(datalength); // Storing only the length of the array
  }, [fnddataclint]); // Add fnddataclint as dependency to update when it changes

  useEffect(() => {
    const datalength = fnddataplan?.length; // Getting the length of the array
    setPlan(datalength); // Storing only the length of the array
  }, [fnddataplan]); // Fix dependency to match the data being used


  const tableColumns = [
    {
      title: "Plan Name",
      dataIndex: "plan_id",
      render: (plan_id) => {
        const plan = fndplan.find((p) => p.id === plan_id);
        return plan ? plan.name : "Unknown Plan"; // Display the plan name or a fallback
      },
    },

    {
      title: "Client Name",
      dataIndex: "client_id",
      render: (client_id) => {
        const client = fndclient.find((c) => c.id === client_id);
        return client ? client.username : "Unknown Client";
      },
    },

    {
      title: "Total Client Count",
      dataIndex: "current_clients_count",
    },

    {
      title: "Total Storage Used",
      dataIndex: "current_storage_used",
    },

    {
      title: "Total Users Count",
      dataIndex: "current_users_count",
    },

    {
      title: "Payment Status",
      dataIndex: "payment_status",
    },

    {
      title: "Status",
      dataIndex: "status",
    },

    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (_, record) => (
        <span>{dayjs(record.start_date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "start_date"),
    },

    {
      title: "End Date",
      dataIndex: "end_date",
      render: (_, record) => (
        <span>{dayjs(record.end_date).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "end_date"),

    },

  ];


  // Calculate subscription data for pie chart
  const chartData = useMemo(() => {
    if (!fnddtat || !fndplan) return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ["#ff8717", "#4d7c0f", "#ffb821", "#007bff", "#dc3545", "#28a745"],
        borderWidth: 1,
      }]
    };

    // Group subscriptions by plan
    const subscriptionsByPlan = fnddtat.reduce((acc, subscription) => {
      const planId = subscription.plan_id;
      acc[planId] = (acc[planId] || 0) + 1;
      return acc;
    }, {});

    // Create chart data with plan names and subscription counts
    const labels = [];
    const data = [];
    const planDetails = [];

    fndplan.forEach(plan => {
      const subscriptionCount = subscriptionsByPlan[plan.id] || 0;
      if (subscriptionCount > 0) { // Only show plans that have subscriptions
        labels.push(plan.name);
        data.push(subscriptionCount);
        planDetails.push(`${plan.name} (${plan.price} / ${plan.duration})`);
      }
    });

    return {
      labels: planDetails, // Use detailed labels
      datasets: [{
        data: data,
        backgroundColor: ["#ff8717", "#4d7c0f", "#ffb821", "#007bff", "#dc3545", "#28a745"],
        borderWidth: 1,
      }]
    };
  }, [fnddtat, fndplan]);

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} subscription${value !== 1 ? 's' : ''}`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const calculateRegionDistribution = () => {
    if (!fnddataclint || !Array.isArray(fnddataclint)) return [];

    // Count companies by state
    const stateCount = fnddataclint.reduce((acc, company) => {
      const state = company.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    const total = Object.values(stateCount).reduce((a, b) => a + b, 0);
    const distribution = Object.entries(stateCount).map(([state, count]) => ({
      state,
      percentage: ((count / total) * 100).toFixed(1),
      count
    }));

    return distribution.sort((a, b) => b.percentage - a.percentage);
  };


  // Calculate plan sales statistics
  const calculatePlanStats = () => {
    if (!plans.length || !fnddtat.length) return {
      totalSales: 0,
      totalRevenue: 0,
      planBreakdown: []
    };

    const planStats = plans.map(plan => {
      const planSales = fnddtat.filter(sub => sub.plan_id === plan.id);
      return {
        planId: plan.id,
        planName: plan.name,
        salesCount: planSales.length,
        revenue: planSales.length * parseFloat(plan.price || 0)
      };
    });

    return {
      totalSales: fnddtat.length,
      totalRevenue: planStats.reduce((total, plan) => total + plan.revenue, 0),
      planBreakdown: planStats
    };
  };

  const planStats = calculatePlanStats();

  return (
    <div className="p-2 bg-gray-50">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          {/* Background Pattern */}
          <div className="h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] via-[#f5f9ff] to-[#f0f7ff]">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `linear-gradient(rgba(99, 134, 255, 0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(99, 134, 255, 0.03) 1px, transparent 1px)`, 
                backgroundSize: '20px 20px', 
                transform: 'skewY(-2deg) scale(1.2)', 
                transformOrigin: '0 0' 
              }} />
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L20 7V17L12 22L4 17V7L12 2Z' stroke='rgba(99, 134, 255, 0.08)' stroke-width='1'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='9' stroke='rgba(99, 134, 255, 0.06)' stroke-width='1'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='16' height='16' stroke='rgba(99, 134, 255, 0.07)' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundPosition: '85% 20%, 15% 40%, 50% 70%',
                backgroundRepeat: 'repeat',
                backgroundSize: '64px, 48px, 32px',
                opacity: 0.7
              }} />
            </div>
          </div>

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-xl border-4 border-white shadow-lg overflow-hidden">
                  <img 
                    src={loggedInUser.profilePic || 'https://via.placeholder.com/100'} 
                    alt={loggedInUser.username} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {`${loggedInUser.firstName || ''} ${loggedInUser.lastName || ''}`}
                </h2>
                <div className="flex items-center mt-2">
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-sm">
                    <span className="text-blue-500">✉️</span>
                    <span className="text-sm text-gray-600">{loggedInUser.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20">
          {/* Personal Information - Full Width */}
          <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-lg">
                  <UserOutlined className="text-xl text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">
                    {loggedInUser?.firstName && loggedInUser?.lastName
                      ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
                      : 'Not Set'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 rounded-lg">
                  <MailOutlined className="text-xl text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{loggedInUser?.email || 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 rounded-lg">
                  <PhoneOutlined className="text-xl text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{loggedInUser?.phone || 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-yellow-50 rounded-lg">
                  <BankOutlined className="text-xl text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">GST Number</p>
                  <p className="font-medium text-gray-800">{loggedInUser?.gstIn || 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-lg">
                  <GlobalOutlined className="text-xl text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium text-gray-800">{loggedInUser?.state || 'Not Set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-lg">
                  <RocketOutlined className="text-xl text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="font-medium text-gray-800">{loggedInUser?.pincode || 'Not Set'}</p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-orange-50 rounded-lg">
                  <GlobalOutlined className="text-xl text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800 break-words mt-1">
                    {loggedInUser?.address || 'Not Set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Plan Sales Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Plan Sales</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">${planStats.totalRevenue.toLocaleString()}</span>
              <span className="text-sm text-green-500 font-semibold">+{(planStats.totalSales * 0.01).toFixed(2)}%</span>
            </div>
            <p className="text-gray-600 text-sm">Total revenue from all plan sales</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Active Plans</span>
                <span className="text-sm font-semibold text-gray-900">{plans.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Companies</h2>
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">{fndclient?.length || 0}</span>
              <span className="text-sm text-green-500 font-semibold">+{((fndclient?.length || 0) * 0.01).toFixed(2)}%</span>
            </div>
            <p className="text-gray-600 text-sm">Total registered companies</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Active This Month</span>
                <span className="text-sm font-semibold text-gray-900">{Math.round((fndclient?.length || 0) * 0.8)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Costs Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Costs</h2>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">$8,310</span>
              <span className="text-sm text-green-500 font-semibold">+0.7%</span>
            </div>
            <p className="text-gray-600 text-sm">Total operational costs this year</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Previous Year</span>
                <span className="text-sm font-semibold text-gray-900">$7,894</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        {/* Total Companies Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="bg-blue-50 p-3 rounded-lg">
                <GoPeople class="text-2xl text-blue-500" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Total Companies</h3>
                <p class="text-sm text-gray-500">Active companies in the system</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-gray-900">{clientdata}</p>
              <p class="text-sm text-green-500">
                +{((clientdata || 0) * 0.05).toFixed(1)}% this month
              </p>
            </div>
          </div>
        </div>

        {/* Total Plans Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="bg-purple-50 p-3 rounded-lg">
                <CiTrophy class="text-2xl text-purple-500" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Total Plans</h3>
                <p class="text-sm text-gray-500">Available subscription plans</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-gray-900">{plan}</p>
              <p class="text-sm text-purple-500">Most popular: Platinum</p>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[24, 32]}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <div
            className="bg-white rounded-lg shadow"
            style={{ height: "450px" }}
          >
            <h2 className="text-xl font-medium mb-4 p-4">Plans by Clients</h2>
            <div className="flex items-center justify-center h-[350px]">
              {planNames.length > 0 ? (
                <Pie
                  data={chartData}
                  options={chartOptions}
                  className="w-[300px] h-[300px]"
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="text-center">
                      <p className="text-gray-500">No Plan Data Available</p>
                      <p className="text-sm text-gray-400">Please add some plans to see the statistics</p>
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </Col>


        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <div
            className="bg-white rounded-lg shadow p-6 h-full flex flex-col"
            style={{ height: "450px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-medium">Clients</h1>
              
            </div>
            <div className="flex-grow pb-11">
              <RecentOrderGraph subclients={subclients} className="h-full" />
            </div>
          </div>
        </Col>
      </Row>



      <Row gutter={[24, 32]} className="mt-4">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="bg-white rounded-lg shadow">
            {sessionData.length > 0 ? (
              <DonutChartWidget
                series={sessionData}
                labels={sessionLabels}
                title="Ticket Priority"
                height={400}
                customOptions={{
                  colors: Object.values(ticketStatusColors),
                  legend: {
                    show: false
                  }
                }}
                extra={
                  <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={24}>
                      <div className="mt-4 mx-auto" style={{ maxWidth: 200 }}>
                        {conbinedSessionData.map(elm => (
                          <Flex alignItems="center" justifyContent="space-between" className="mb-3" key={elm.label}>
                            <Flex gap={5}>
                              <Badge color={elm.color} />
                              <span className="text-gray-600">{elm.label}</span>
                            </Flex>
                            <span className="font-semibold">{elm.data}</span>
                          </Flex>
                        ))}
                      </div>
                    </Col>
                  </Row>
                }
              />
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-500">Ticket Priority Not Found</p>
                <p className="text-sm text-gray-400">No ticket priority data is currently available</p>
              </div>
            )}
          </div>
        </Col>

        {/* country */}
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl text-gray-700 font-medium mb-4">Companies in top state</h2>
            <div className="space-y-4">
              <div className="space-y-3">
                {calculateRegionDistribution().map((item, index) => (
                  <div key={item.state} className="flex items-center justify-between text-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'][index % 6]
                        }`}>
                      </div>
                      <span className="text-gray-600">{item.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 32]} className="mt-4">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <MonthlyRevenueCard />
        </Col>
      </Row>

      <div className="w-full p-4 bg-white rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium text-black">Tickets</h1>
        <div className="w-full">
          <TicketList />
        </div>
      </div>

      <div className="w-full p-4 bg-white rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium text-black">
          Recent Users Registration
        </h1>
        {fnddtat && fnddtat.length > 0 ? (
          <RegistionTable />
        ) : (
          <div className="flex items-center justify-center py-8">
            <Empty
              // image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-500">No User Registration Data Available</p>
                  <p className="text-sm text-gray-400">New user registrations will appear here</p>
                </div>
              }
            />
          </div>
        )}
      </div>

      <div className="w-full p-4 bg-white rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium text-black">Subscribed User Plans</h1>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          // rowSelection={{
          // 	selectedRowKeys: selectedRowKeys,
          // 	type: 'checkbox',
          // 	preserveSelectedRowKeys: false,
          // 	...rowSelection,
          // }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardList;






