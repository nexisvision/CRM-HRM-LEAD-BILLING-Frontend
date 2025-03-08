import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaLayerGroup } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { CiTrophy } from "react-icons/ci";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import RecentOrderGraph from "../../../../components/RecentOrderGraph.jsx";
import DateRangeFilter from "../../../../components/DateRangeFilter.jsx";
import TicketList from "../../../../components/TicketTableList.jsx";
import RegistionTable from "../../../../components/RegistrationTableList.jsx";
import { Pie } from "react-chartjs-2";
import { Table, Row, Col, Card, Button,Empty,Badge, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice.jsx";
import { GetPlan } from "views/app-views/plan/PlanReducers/PlanSlice.jsx";
import { getAllTicket } from "views/app-views/pages/customersupports/ticket/TicketReducer/TicketSlice.jsx";
import { getsubplandata } from "views/app-views/subscribeduserplans/subplanReducer/subplanSlice.jsx";
import { } from "antd";
import SubscribedUserPlansList from "views/app-views/subscribeduserplans/SubscribedUserPlansList.jsx";
import Flex from 'components/shared-components/Flex'; // Use your existing Flex component
import DonutChartWidget from 'components/shared-components/DonutChartWidget';
import { getallcountries } from 'views/app-views/setting/countries/countriesreducer/countriesSlice';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import { DownloadOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthlyRevenueCard = () => {
  const [chartData, setChartData] = useState([]);
  const [totalSubclients, setTotalSubclients] = useState(0);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [selectedYear, setSelectedYear] = useState(moment().year());

  const dispatch = useDispatch();
  const subclients = useSelector((state) => state?.SubClient?.SubClient?.data || []);
  const isLoading = useSelector((state) => state?.SubClient?.isLoading);

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
        formatter: function(val) {
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
  const planSales = useSelector((state) => state?.Plan?.planSales || []);
  const plans = useSelector((state) => state?.Plan?.Plan || []);

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
  const subscriptions = useSelector((state) => state?.subplan?.subplan?.data || []);

  
  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = alldatas.subplan.data || [];


  useEffect(() => {
    dispatch(getsubplandata());
  }, []);


  useEffect(() => {
    dispatch(GetPlan());
    dispatch(ClientData());
  }, []);


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
    setTasks(fnddataticket);
  }, [fnddataticket]);

  useEffect(() => {
    dispatch(getsubplandata());
  }, []);

  useEffect(() => {
    dispatch(getallcountries());
  }, [dispatch]);

    const ticketStatusColors = {
      'Low': '#22c55e',    // Green for low priority
      'Medium': '#f97316',  // Orange for medium priority
      'High': '#ef4444',    // Red for high priority
      'Unknown': '#94a3b8'  // Gray for unknown/undefined priority
    };
    
    const calculateTicketStatusData = () => {
      if (!fnddataticket || !Array.isArray(fnddataticket)) {
        return {
          sessionData: [],
          sessionLabels: [],
          conbinedSessionData: []
        };
      }
  
      const statusCounts = fnddataticket.reduce((acc, ticket) => {
        const priority = (ticket.priority || 'Unknown').charAt(0).toUpperCase() + 
                        (ticket.priority || 'Unknown').slice(1).toLowerCase();
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      const sessionLabels = Object.keys(statusCounts);
      const sessionData = Object.values(statusCounts);
      
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
  }, [fnddataclint]);


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
        return client ? client.username : "Unknown Client"; // Display the client name or a fallback
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

  const [tasks, setTasks] = useState([
    {
      id: 1,
      task: "March Hare moved.",
      status: "To Do",
      dueDate: "Sun 06 Oct 2024",
    },
    {
      id: 2,
      task: "This seemed to be.",
      status: "Doing",
      dueDate: "Fri 28 Jun 2024",
    },
    {
      id: 3,
      task: "Mock Turtle, and.",
      status: "Doing",
      dueDate: "Fri 11 Oct 2024",
    },
    {
      id: 4,
      task: "The moment Alice.",
      status: "Doing",
      dueDate: "Wed 14 Feb 2024",
    },
  ]);
  

  const chartData = {
    labels: planNames, // Dynamically setting labels
    datasets: [
      {
        data: planPrices, // Dynamically setting data
        backgroundColor: ["#ff8717", "#4d7c0f", "#ffb821", "#007bff", "#dc3545", "#28a745"],
        borderWidth: 1,
      },
    ],
  };

 

  const calculateRegionDistribution = () => {
    if (!fnddataclint || !Array.isArray(fnddataclint)) return [];
    
    // Count companies by state
    const stateCount = fnddataclint.reduce((acc, company) => {
      const state = company.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});

    // Calculate percentages
    const total = Object.values(stateCount).reduce((a, b) => a + b, 0);
    const distribution = Object.entries(stateCount).map(([state, count]) => ({
      state,
      percentage: ((count / total) * 100).toFixed(1),
      count
    }));

    // Sort by percentage in descending order
    return distribution.sort((a, b) => b.percentage - a.percentage);
  };

  const calculateTotalPlanAmount = () => {
    if (!fnddataplan || !Array.isArray(fnddataplan)) return 0;
    
    return fnddataplan.reduce((total, plan) => {
      const price = parseFloat(plan.price) || 0;
      return total + price;
    }, 0);
  };

  

  // Calculate plan sales statistics
  const calculatePlanStats = () => {
    if (!plans.length || !subscriptions.length) return {
      totalSales: 0,
      totalRevenue: 0,
      planBreakdown: []
    };

    const planStats = plans.map(plan => {
      const planSales = subscriptions.filter(sub => sub.plan_id === plan.id);
      return {
        planId: plan.id,
        planName: plan.name,
        salesCount: planSales.length,
        revenue: planSales.length * parseFloat(plan.price || 0)
      };
    });

    return {
      totalSales: subscriptions.length,
      totalRevenue: planStats.reduce((total, plan) => total + plan.revenue, 0),
      planBreakdown: planStats
    };
  };

  const planStats = calculatePlanStats();

  return (
    <div className="p-2 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
     
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Yearly Revenue Card */}
        

        {/* Plan Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-700 font-medium mb-4">Plan Sales</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1b2559]">
              ${planStats.totalRevenue.toLocaleString()}
            </span>
            <div className="flex flex-col">
              <span className="text-green-500 flex items-center font-bold text-lg">
                  {(planStats.totalSales * 0.01).toFixed(2)}%
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                </svg>
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Total number of Sales Plan</p>
          {/* <div className="mt-2 space-y-3">
              {planStats.planBreakdown.map(plan => (
                <div key={plan.planId} className="flex flex-col">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-bold text-gray-500">{plan.salesCount}
                      <span className="text-sm text-gray-500"> sales</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{plans.length} active plans</span>
                  </div>
                </div>
              ))}
          </div> */}
        </div>

        {/* Companies Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-700 font-medium mb-4">Companies</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1b2559]">
              {fndclient?.length || 0}
            </span>
            <div className="flex flex-col">
              <span className="text-green-500 flex items-center font-bold text-lg">
                {((fndclient?.length || 0) * 0.01).toFixed(2)}%
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
                </svg>
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Total number of registered companies</p>
        </div>

        {/* Costs Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg text-gray-700 font-medium mb-4">Costs</h2>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#1b2559]">$8,310</span>
            <span className="text-green-500 flex items-center font-bold text-lg">
              0.7%
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              </svg>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Compare to last year (2019)</p>
        </div>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
          <div class="flex space-x-4 items-center">
            <div class="flex items-center gap-2 bg-blue-500 rounded-lg p-2">
              <GoPeople class="text-2xl text-white" />
            </div>

            <div>
              <p class="text-sm text-gray-600">Total Companies</p>
            </div>
          </div>
          <div class="text-2xl font-bold">{clientdata}</div>
          {/* <div>
            <p class="text-sm text-gray-500">Paid Users:</p>
            <p>8</p>
          </div> */}
        </div>

        {/* <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                    <div class="flex space-x-4 items-center">

                        <div class="flex items-center gap-2 bg-blue-500 rounded-lg p-2">
                            <IoCartOutline class="text-2xl text-white" />
                        </div>

                        <div>
                            <p class="text-sm text-gray-600">Total Order</p>
                        </div>
                    </div>
                    <div class="text-2xl font-bold">
                        87
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Total Order Amount:</p>
                        <p >$82650</p>
                    </div>
                </div> */}

        <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
          <div class="flex space-x-4 items-center">
            <div class="flex items-center gap-2 bg-blue-500 rounded-lg p-2">
              <CiTrophy class="text-2xl text-white" />
            </div>

            <div>
              <p class="text-sm text-gray-600">Total Plans</p>
            </div>
          </div>
          <div class="text-2xl font-bold">{plan}</div>
          <div>
            <p class="text-sm text-gray-500">Most Purchase Plan :</p>
            <p>Platinum</p>
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
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                    },
                  }}
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
              <h1 className="text-xl font-medium">Recent Order</h1>
              <div className="flex-shrink-0">
                <DateRangeFilter
                  onDateRangeChange={(range) => {
                  }}
                />
              </div>
            </div>
            <div className="flex-grow pb-11">
              <RecentOrderGraph className="h-full" />
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
                      <div className="mt-4 mx-auto" style={{maxWidth: 200}}>
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
                      <div className={`w-3 h-3 rounded-full ${
                        ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'][index % 6]
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

      <div className="container mx-auto p-4 bg-white  rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium text-black">Tickets</h1>
        <div className="">
          <TicketList />
        </div>
      </div>

      <div className="container p-4 bg-white rounded-lg shadow mt-8">
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
      
      <div className="container mx-auto p-4 bg-white  rounded-lg shadow mt-8">
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
