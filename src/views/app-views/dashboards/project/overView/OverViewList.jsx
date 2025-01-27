import React, { useEffect, useState } from "react";
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

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const OverViewList = () => {
  const dispatch = useDispatch();

  const [proo, setProo] = useState("");

  const allempdata = useSelector((state) => state.Project);
  const filterdata = allempdata.Project.data;

  console.log("iuiuiuiuiui", filterdata);

  useEffect(() => {
    if (filterdata.length > 0) { // Check if filterdata has elements
      let datestart = new Date(filterdata[0].startdate); // Convert startdate string to Date object
      let dateend = new Date(filterdata[0].enddate); // Convert enddate string to Date object

      let currentTime = new Date(); // Current time

      if (isNaN(datestart) || isNaN(dateend)) {
        console.error("Invalid dates detected.");
      } else {
        let totalDuration = dateend - datestart;

        let elapsedTime = currentTime - datestart;

        if (totalDuration > 0 && elapsedTime >= 0) {
          let percentageElapsed = (elapsedTime / totalDuration) * 100;

          if (percentageElapsed > 100) {
            percentageElapsed = 55;
          }

          const pro = percentageElapsed.toFixed(2);
          setProo(pro);

          console.log("Percentage of time passed: ", pro + "%");
        } else {
          console.error("Invalid total duration or elapsed time.");
        }
      }
    }
  }, [filterdata]);

  const Allclientdata = useSelector((state) => state.SubClient);

  const dataclient = Allclientdata.SubClient?.data || [];

  const updatedList = dataclient?.filter(
    (item) => item.id == filterdata[0]?.client
  );

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);

  // Sample data for charts
  const hoursData = filterdata.length > 0 ? [{ name: "Planned", value: filterdata[0]?.estimatedhours }] : [];

  const budgetData = filterdata.length > 0 ? [{ name: "Planned", value: filterdata[0]?.budget }] : [];
  
  
  const progress = 50;
  const startDate = "Wed 24 Jul 2024";
  const deadline = "Sun 24 Nov 2024";

  const dateendd = filterdata[0]?.startDate
    ? new Date(filterdata[0]?.startDate).toISOString().split("T")[0]
    : null;
  const datestartt = filterdata[0]?.endDate
    ? new Date(filterdata[0]?.endDate).toISOString().split("T")[0]
    : null;

  const data = {
    // labels: ["Task 1", "Task 2", "Task 3", "Task 4"],
    datasets: [
      {
        label: "Task Distribution",
        data: [25, 30, 20, 25],
        backgroundColor: ["#FF5722", "#FFC107", "#4CAF50", "#03A9F4"],
        borderWidth: 1,
      },
    ],
  };

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

  return (
    <>
      <div className="p-2 bg-gray-50">
        {/* Project Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-black mb-4">
              Project Progress
            </h2>

            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Progress Circle */}
              <div className="relative w-32 h-32">
                <CircularProgressbar
                  value={proo}
                  text={`${proo}%`}
                  circleRatio={0.5} // Make it a semi-circle
                  rotation={-0.5} // Rotate to start from top
                  styles={{
                    root: {
                      transform: "rotate(0.50turn)", // Rotate to make it face right
                    },
                    path: {
                      stroke: "#4CAF50",
                      strokeLinecap: "round",
                      strokeWidth: "6",
                      transition: "stroke-dashoffset 0.5s ease 0s",
                      transform: "rotate(0.25turn)",
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
                      fontSize: "16px",
                      fontWeight: 500,
                      transform: "rotate(-0.50turn)", // Rotate text back to normal
                      transformOrigin: "center center",
                      dominantBaseline: "middle",
                      textAnchor: "middle",
                      y: "20%", // Adjust text position upward
                    },
                  }}
                />
                {/* Scale markers */}
                <div className="relative mt-2">
                  <span className="absolute left-0 top-[-68px] text-xs text-gray-500">
                    0
                  </span>
                  <span className="absolute right-0 top-[-68px] text-xs text-gray-500">
                    100
                  </span>
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Start Date</span>
                <span className="text-gray-800">{datestartt}</span>
              </div>

              {/* Deadline */}
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm mb-1">Deadline</span>
                <span className="text-gray-800">{dateendd}</span>
              </div>
            </div>

            {/* Optional: Add scale markers */}

            {/* </div> */}
          </div>
          {/* Client Section */}
          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <h2 className="f-20 f-w-500 mb-0 text-black">Client</h2>
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/300?u=gkautzer@example.net8"
                alt="Client"
                className="w-16 h-16 rounded-sm object-fit-cover position-relative mt-6"
              />
              <div>
                <h3 className="f-18 f-w-500 mb-0 text-black mt-6">
                  {/* {updatedList[0]?.username} */}
                </h3>
                <p className="f-14 mb-0 text-lightest">
                  {/* {updatedList[0]?.email} */}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
          {/* Task */}

          <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <div className="flex justify-center items-center w-[200px] h-[200px]">
              <Pie data={data} />
            </div>
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
    </>
  );
};

export default OverViewList;
