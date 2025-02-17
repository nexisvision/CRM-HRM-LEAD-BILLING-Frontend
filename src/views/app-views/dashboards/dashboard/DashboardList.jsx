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
import { Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice.jsx";
import { GetPlan } from "views/app-views/plan/PlanReducers/PlanSlice.jsx";
import { getAllTicket } from "views/app-views/pages/customersupports/ticket/TicketReducer/TicketSlice.jsx";
import { getsubplandata } from "views/app-views/subscribeduserplans/subplanReducer/subplanSlice.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardList = () => {
  const dispatch = useDispatch();
  const [clientdata, setclientdata] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => {
    dispatch(ClientData());
    dispatch(GetPlan());
    dispatch(getAllTicket());
  }, [dispatch]);

  const allclientdata = useSelector((state) => state.ClientData);
  const fnddataclint = allclientdata.ClientData.data;

  const allplandata = useSelector((state) => state.Plan);
  const fnddataplan = allplandata.Plan;

  // console.log("fnddataplan",fnddataplan);

  const planNames = fnddataplan?.map((plan) => plan.name) || [];
const planPrices = fnddataplan?.map((plan) => parseFloat(plan.price)) || [];

  const allticket = useSelector((state) => state.Ticket);
  const fnddataticket = allticket.Ticket.data;


  
  const alldatas = useSelector((state) => state.subplan);
  const fnddtat = alldatas.subplan.data || [];

  console.log("fnddtat",fnddtat);


  useEffect(() => {
    setTasks(fnddataticket);
  }, [fnddataticket]);

  useEffect(() => {
    dispatch(getsubplandata());
  }, []);

  useEffect(() => {
    const datalength = fnddataclint?.length; // Getting the length of the array
    setclientdata(datalength); // Storing only the length of the array
  }, [fnddataclint]); // Add fnddataclint as dependency to update when it changes

  useEffect(() => {
    const datalength = fnddataplan?.length; // Getting the length of the array
    setPlan(datalength); // Storing only the length of the array
  }, [fnddataclint]);

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
  const data = [
    { date: "29-Dec", income: 100 },
    { date: "30-Dec", income: 200 },
    { date: "31-Dec", income: 300 },
    { date: "01-Jan", income: 400 },
    { date: "02-Jan", income: 500 },
    { date: "03-Jan", income: 450 },
    { date: "04-Jan", income: 350 },
    { date: "05-Jan", income: 250 },
    { date: "06-Jan", income: 300 },
    { date: "07-Jan", income: 350 },
    { date: "08-Jan", income: 400 },
    { date: "09-Jan", income: 500 },
    { date: "10-Jan", income: 400 },
    { date: "11-Jan", income: 300 },
  ];

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
  // State for managing profile data
  const [openTasks, setOpenTasks] = useState(4);
  const [projects, setProjects] = useState(2);
  const [pendingTasks, setPendingTasks] = useState(4);
  const [overdueTasks, setOverdueTasks] = useState(4);
  const [expenses, setExpenses] = useState(0);

  // Function to handle any updates dynamically (example)
  // const updateProfile = () => {
  // 	setOpenTasks(openTasks + 1); // Increase open tasks dynamically
  // 	setExpenses(expenses + 50);  // Add 50 to expenses
  // };

  return (
    <div className="p-2 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        {/* <DateRangeFilter onDateRangeChange={(range) => { 
                  console.log('Selected range:', range);
                }} /> */}
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
            <div className=" flex items-center justify-center">
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
                    // console.log("Selected range:", range);
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

      <div className="container mx-auto p-4 bg-white  rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium text-black">Tickets</h1>
        <div className="">
          <TicketList />
        </div>
      </div>

      <div className="container p-4 bg-white  rounded-lg shadow mt-8">
        <h1 className="text-xl font-medium  text-black">
          Recent Users Registration
        </h1>
        <RegistionTable />
      </div>
    </div>
  );
};

export default DashboardList;
