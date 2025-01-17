import React, { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaLayerGroup } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardList = () => {

    const [tasks, setTasks] = useState([
        { id: 1, task: "March Hare moved.", status: "To Do", dueDate: "Sun 06 Oct 2024" },
        { id: 2, task: "This seemed to be.", status: "Doing", dueDate: "Fri 28 Jun 2024" },
        { id: 3, task: "Mock Turtle, and.", status: "Doing", dueDate: "Fri 11 Oct 2024" },
        { id: 4, task: "The moment Alice.", status: "Doing", dueDate: "Wed 14 Feb 2024" },
    ]);
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
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">

                <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
                    <div class="flex space-x-4 items-center">

                        <div class="flex items-center gap-2 bg-blue-500 rounded-lg p-2">
                            <GoPeople class="text-2xl text-white" />
                        </div>

                        <div>
                            <p class="text-sm text-gray-600">Total Companies</p>
                        </div>
                    </div>
                    <div class="text-2xl font-bold">
                        13
                    </div>
                    <div>
                        <p class="text-sm text-gray-500">Paid Users:</p>
                        <p class="text-xl font-semibold">8</p>
                    </div>
                </div>


                <div class="bg-white p-6 rounded-lg shadow flex justify-between items-center">
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
                        <p class="text-xl font-semibold">$82650</p>
                    </div>
                </div>


                <div class="bg-white p-6 rounded-lg shadow flex flex-col space-y-4">

                </div>
            </div>


            <div className="container mx-auto p-4 bg-white  rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
                <table className="w-full  ">
                    <thead>
                        <tr>
                            <th className="border-b p-2 text-center">Task#</th>
                            <th className="border-b p-2 text-center">Task</th>
                            <th className="border-b p-2 text-center">Status</th>
                            <th className="border-b p-2 text-center">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-100">
                                <td className="border-b p-2 text-center">{task.id}</td>
                                <td className="border-b p-2 text-center">{task.task}</td>
                                <td className="border-b p-2 flex items-center justify-center">
                                    <span
                                        className={`inline-block rounded-full w-4 h-4  ${task.status === "To Do"
                                            ? "bg-yellow-300 text-yellow-800"
                                            : "bg-blue-300 text-blue-800"
                                            }`}
                                    >
                                    </span>
                                    <span className="ms-2">
                                        {task.status}
                                    </span>
                                </td>
                                <td className="border-b p-2 text-center">{task.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="container mx-auto p-4 bg-white  rounded-lg shadow mt-4">
                <h1 className="text-2xl font-bold ">Tickets</h1>
                <div className="mt-4">
                    <table className="w-full  ">
                        <thead className="border-b">
                            <tr>
                                <th className=" p-2 text-center">Tickets#</th>
                                <th className=" p-2 text-center">Ticket Subject</th>
                                <th className=" p-2 text-center">Status</th>
                                <th className=" p-2 text-center">Requested On </th>
                            </tr>
                        </thead>
                    </table>
                    <p className="text-gray-500 text-center mt-4">- No record found. -</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardList;