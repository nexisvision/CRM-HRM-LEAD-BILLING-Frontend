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
import { Button } from "antd";
import { FaCoins,FaFileInvoiceDollar  } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoLayers } from "react-icons/io5";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { TbClockHour3Filled } from "react-icons/tb";
// import { GetProject } from "../project-list/projectReducer/ProjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

// Register the chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const ViewClient = () => {
    const dispatch = useDispatch();

    //   const [proo, setProo] = useState("");

    //   const allempdata = useSelector((state) => state.Project);
    //   const filterdata = allempdata.Project.data;

    //   console.log("iuiuiuiuiui", filterdata);

    //   useEffect(() => {
    //     let datestart = new Date(filterdata[0].startdate); // Convert startdate string to Date object
    //     let dateend = new Date(filterdata[0].enddate); // Convert enddate string to Date object

    //     let currentTime = new Date(); // Current time

    //     if (isNaN(datestart) || isNaN(dateend)) {
    //       console.error("Invalid dates detected.");
    //     } else {
    //       let totalDuration = dateend - datestart;

    //       let elapsedTime = currentTime - datestart;

    //       if (totalDuration > 0 && elapsedTime >= 0) {
    //         let percentageElapsed = (elapsedTime / totalDuration) * 100;

    //         if (percentageElapsed > 100) {
    //           percentageElapsed = 55;
    //         }

    //         const pro = percentageElapsed.toFixed(2);
    //         setProo(pro);

    //         console.log("Percentage of time passed: ", pro + "%");
    //       } else {
    //         console.error("Invalid total duration or elapsed time.");
    //       }
    //     }
    //   }, []);

    //   const Allclientdata = useSelector((state) => state.SubClient);

    //   const dataclient = Allclientdata.SubClient.data;

    //   const updatedList = dataclient?.filter(
    //     (item) => item.id == filterdata[0]?.client
    //   );

    //   useEffect(() => {
    //     dispatch(ClientData());
    //   }, [dispatch]);

    //   useEffect(() => {
    //     dispatch(GetProject());
    //   }, [dispatch]);

    //   // Sample data for charts
    //   const hoursData = [{ name: "Planned", value: filterdata[0]?.estimatedhours }];

    //   const budgetData = [{ name: "Planned", value: filterdata[0]?.budget }];

    //   const progress = 50;
    //   const startDate = "Wed 24 Jul 2024";
    //   const deadline = "Sun 24 Nov 2024";

    //   const dateendd = filterdata[0]?.startDate
    //     ? new Date(filterdata[0]?.startDate).toISOString().split("T")[0]
    //     : null;
    //   const datestartt = filterdata[0]?.endDate
    //     ? new Date(filterdata[0]?.endDate).toISOString().split("T")[0]
    //     : null;

    const data1 = {
        // labels: ["Task 1", "Task 2", "Task 3", "Task 4"],
        datasets: [
            {
                label: "Task Distribution",
                data: [ 99], // Percentages
                backgroundColor: ["#1d82f5"],
                borderWidth: 1,
            },
        ],
    };
    const data2 = {
        // labels: ["Task 1", "Task 2", "Task 3", "Task 4"],
        datasets: [
            {
                label: "Task Distribution",
                data: [49,49], // Percentages
                // backgroundColor: ["#FF5722", "#FFC107", "#4CAF50", "#03A9F4"],
                backgroundColor: ["#4CAF50", "#FFC107"],
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">

                    {/* <div className=""> */}

                    {/* Client Section */}
                    <div className="bg-white p-6 rounded-lg shadow flex flex-col col-span-2">
                        <div className="flex justify-between  gap-4">
                            <div className="flex items-center">
                            <img
                                src="https://i.pravatar.cc/300?u=gkautzer@example.net8"
                                alt="Client"
                                className="w-20 h-20 rounded-sm object-fit-cover position-relative"
                            />
                            <div className="ms-5">
                                <h2 className="font-medium text-base f-w-500 mb-0 text-black">Gustave Koelpin</h2>
                                <h3 className="f-18 f-w-500 mb-0 ">
                                    {/* {updatedList[0]?.username} */}
                                    Douglas, DuBuque and Roob
                                </h3>
                                <p className="f-14 mb-0 font-normal">
                                    {/* {updatedList[0]?.email} */}
                                    Last login at --
                                </p>
                            </div>
                            </div>
                            <div>
                                <div className="flex justify-end border-0 ring-0">
                                    <HiOutlineDotsHorizontal />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                        Total Projects
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <IoLayers  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        2
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                        Total Earnings
                        </h3>
                        <span className="flex justify-end">
                            {" "}
                            <FaCoins className="text-gray-500 text-2xl mb-2" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        67991
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                        Due Invoices
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <FaFileInvoiceDollar  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                            2
                        </p>
                    </div>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                    {/* Task */}

                    <div className="bg-white shadow rounded-lg p-4 lg:p-6">
                        <div className="overflow-x-auto">
                            <div>
                                <span className="text-xl font-semibold text-left text-black uppercase tracking-wider"> Profile Info</span>
                            </div>
                            <table className="w-full mt-2">
                                
                                <tbody >
                                    <tr>
                                        <td className="py-2 text-gray-500 w-1/4 lg:w-1/5">Full Name</td>
                                        <td className="py-2 text-gray-700 hover:text-black transition-colors">
                                            Gustave Koelpin
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Priority</td>
                                        <td className="py-2 text-gray-700">Low</td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Email</td>
                                        <td className="py-2">
                                            caitlyn66@example.net7
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Company Name</td>
                                        <td className="py-2 text-gray-700">Douglas, DuBuque and Roob</td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Company Logo</td>
                                        <td className="py-2 text-gray-700">--</td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Mobile</td>
                                        <td className="py-2 text-gray-700">--</td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Gender</td>
                                        <td className="py-2 text-gray-700">Male</td>
                                    </tr>

                                    <tr>
                                        <td className="py-2 text-gray-500">Office Phone Number</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">Official Website</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        https://worksuite.biz
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">GST/VAT Number</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">Address</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        16738 Swift Drive Katarinaborough, AK 18081-4580
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">State</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">City</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">Postal code</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        --
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 text-gray-500">Language</td>
                                        <td className="py-2 text-gray-700 whitespace-pre-wrap">
                                        English
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full h-[325px] flex flex-col items-center justify-center">
                            <h2 className="text-xl font-semibold mb-4">Projects</h2>
                            <div className="flex justify-center items-center w-[200px] h-[200px]">
                                <Pie data={data1} />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 w-full h-[325px] flex flex-col items-center justify-center mt-8">
                            <h2 className="text-xl font-semibold mb-4">Invoices</h2>
                            <div className="flex justify-center items-center w-[200px] h-[200px]">
                                <Pie data={data2} />
                            </div>
                        </div>
                    </div>


                    {/* Statistics Section */}

                    {/* <div className="">
            <div>
              <p className="text-2xl font-semibold text-black mb-1">
                Statistics
              </p>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div> */}
                </div>

            </div>
        </>
    );
};

export default ViewClient;
