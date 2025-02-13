// import React, { useEffect, useState } from "react";
// import "react-circular-progressbar/dist/styles.css";
// import { TfiMenuAlt } from "react-icons/tfi";
// import { FaLayerGroup } from "react-icons/fa";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import {
//     EyeOutlined,
//     DeleteOutlined,
//     CopyOutlined,
//     EditOutlined,
//     FundProjectionScreenOutlined,
//     RiseOutlined,
//     CopyrightOutlined,
//     FormOutlined,
//   } from "@ant-design/icons";
// import { FaCoins } from "react-icons/fa";
// import { IoLayers } from "react-icons/io5";
// import { GetProject } from "views/app-views/dashboards/project/project-list/projectReducer/ProjectSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { GetTasks } from "views/app-views/dashboards/project/task/TaskReducer/TaskSlice";
// import { GetLeads } from "views/app-views/dashboards/leads/LeadReducers/LeadSlice";
// import { getAllTicket } from "../customersupports/ticket/TicketReducer/TicketSlice";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const ProfileData = () => {

// 		const dispatch = useDispatch()

// 	const [tasks, setTasks] = useState([
// 		{ id: 1, task: "March Hare moved.", status: "To Do", dueDate: "Sun 06 Oct 2024" },
// 		{ id: 2, task: "This seemed to be.", status: "Doing", dueDate: "Fri 28 Jun 2024" },
// 		{ id: 3, task: "Mock Turtle, and.", status: "Doing", dueDate: "Fri 11 Oct 2024" },
// 		{ id: 4, task: "The moment Alice.", status: "Doing", dueDate: "Wed 14 Feb 2024" },
// 	]);

// 	const idd = useSelector((state)=>state.user.loggedInUser.id)

// 	useEffect(()=>{
// 		dispatch(GetProject())
// 		dispatch(GetTasks(idd))
// 		dispatch(GetLeads())
// 		dispatch(getAllTicket())
// 	},[dispatch])

// 	const loggeddatass = useSelector((state)=>state.user.loggedInUser.username)


// 	const projectdata = useSelector((state) => state.Project.Project.data);
// 	const proijectfilter = projectdata?.filter((item)=>item?.created_by === loggeddatass)

// const length = Array.isArray(proijectfilter) ? proijectfilter.length : 0;

// const taskdata = useSelector((state) => state.Tasks.Tasks.data);
// const taskssfilter = taskdata?.filter((item)=>item?.created_by === loggeddatass)

// const tasklenght = Array.isArray(taskssfilter) ? taskssfilter.length : 0;

// const loggeddata = useSelector((state)=>state.user.loggedInUser)

// /////

// const allticketdata = useSelector((state)=>state.Ticket.Ticket.data)


// const leaddata = useSelector((state) => state.Leads.Leads.data);

// const leaddatasss = Array.isArray(leaddata) ? leaddata.length : 0;


// //////

// const filterdtaa = allticketdata?.filter((item)=>item?.created_by === loggeddatass)

// const taskfilter = taskdata?.filter((item)=>item?.created_by === loggeddatass)




// 	// State for managing profile data
// 	const [openTasks, setOpenTasks] = useState(4);
// 	const [projects, setProjects] = useState(2);
// 	const [pendingTasks, setPendingTasks] = useState(4);
// 	const [overdueTasks, setOverdueTasks] = useState(4);
// 	const [expenses, setExpenses] = useState(0);
// 	// Function to handle any updates dynamically (example)
// 	// const updateProfile = () => {
// 	//  setOpenTasks(openTasks + 1); // Increase open tasks dynamically
// 	//  setExpenses(expenses + 50);  // Add 50 to expenses
// 	// };
// 	return (
// 		<div className="p-4 bg-gray-50">
// 			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
// 				{/* Profile Information */}
// 				<div className="bg-white p-6 rounded-lg shadow flex flex-col">
// 					<div className="flex items-center gap-4">
// 						<img
// 							src="https://i.pravatar.cc/300?u=admin@example.com"
// 							alt="Client"
// 							className="w-24 h-24 rounded-md object-cover"
// 						/>
// 						<div>
// 							<h2 className="text-xl font-medium mb-1 text-black">{loggeddata.username}</h2>
// 							{/* <p className="text-sm text-gray-500 mb-1">Junior</p> */}
// 							<p className="text-sm text-gray-500">{loggeddata.email}</p>
// 						</div>
// 					</div>
// 					<h2 className=" border-b pb-2 font-medium"></h2>
// 					<div className="flex justify-between py-3">
// 						<div className="">
// 							<span className="text-sm text-gray-500">Open Tasks</span>
// 							<p className="text-xl font-semibold text-black  ">{tasklenght}</p>
// 						</div>	
// 						<div>
// 							<span className="text-sm text-gray-500">Projects</span>
// 							<p className="text-xl font-semibold text-black">{length}</p>
// 						</div>
// 					</div>
// 				</div>
// 				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// 					<div className="bg-white p-6 rounded-lg shadow flex flex-col">
// 						<h3 className="text-gray-600 text-lg font-semibold">Tasks</h3>
// 						<span className="flex justify-end mb-4">
// 							<TfiMenuAlt className="text-gray-500 text-2xl" />
// 						</span>
// 						<div className="flex gap-8  ">
// 							<div>
// 								<p className="text-xl font-medium md:text-base text-blue-500">
// 									{tasklenght}
// 								</p>
// 								<p className="f-14 mb-0 text-lightest">
// 									Pending
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-xl font-medium md:text-base text-red-500">
// 									0
// 								</p>
// 								<p className="f-14 mb-0 text-lightest">
// 									Overdue
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 					<div className="bg-white p-6 rounded-lg shadow flex flex-col">
// 						<h3 className="text-gray-600 text-lg font-semibold">Project</h3>
// 						<span className="flex justify-end mb-4">
// 							<FaLayerGroup className="text-gray-500 text-2xl" />
// 						</span>
// 						<div className="flex gap-8  ">
// 							<div>
// 								<p className="text-xl font-medium md:text-base text-blue-500">
// 									{length}
// 								</p>
// 								<p className="f-14 mb-0 text-lightest">
// 									In Progress
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-xl font-medium md:text-base text-red-500">
// 									0
// 								</p>
// 								<p className="f-14 mb-0 text-lightest">
// 									Overdue
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

// 				{/* <div className=""> */}

// 				{/* Client Section */}
// 				<div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <div className="bg-blue-500 px-2 pt-2 pb-0 rounded-lg ">
//                                 <RiseOutlined  className="text-white text-2xl" />
//                             </div>
//                             <div>
//                                 <p className="text-gray-600 text-base  font-medium">
//                                     Total
//                                 </p>

//                                 <h3 className="text-gray-600 mb-2 text-base font-medium">
//                                     Lead
//                                 </h3>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                             <p className="text-gray-600 text-base font-semibold ">{leaddatasss}</p>
//                         </div>
//                         </div>
//                     </div>


// 					<div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <div className="bg-blue-500 px-2 pt-2 pb-0 rounded-lg ">
//                                 <FundProjectionScreenOutlined  className="text-white text-2xl" />
//                             </div>
//                             <div>
//                                 <p className="text-gray-600 text-base  font-medium">
//                                     Total
//                                 </p>

//                                 <h3 className="text-gray-600 mb-2 text-base font-medium">
//                                     Task
//                                 </h3>
//                             </div>
//                         </div>


//                         <div className="flex items-center gap-2">
//                             <p className="text-gray-600 text-base font-semibold ">{tasklenght}</p>
//                         </div>
//                         </div>
//                     </div>
// 					<div className="bg-white p-6 rounded-lg shadow">
//                         <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <div className="bg-blue-500 px-2 pt-2 pb-0 rounded-lg ">
//                                 <RiseOutlined  className="text-white text-2xl" />
//                             </div>
//                             <div>
//                                 <p className="text-gray-600 text-base  font-medium">
//                                     Total
//                                 </p>

//                                 <h3 className="text-gray-600 mb-2 text-base font-medium">
//                                     Expense
//                                 </h3>
//                             </div>
//                         </div>


//                         <div className="flex items-center gap-2">
//                             <p className="text-gray-600 text-base font-semibold ">0</p>
//                         </div>
//                         </div>
//                     </div>
// 			</div>
// 			<div className="container mx-auto p-4 bg-white  rounded-lg shadow">
// 				<h1 className="text-2xl font-bold mb-4">My Tasks</h1>
// 				<table className="w-full  ">
// 					<thead>
// 						<tr>
// 							<th className="border-b p-2 text-center">Task</th>
// 							<th className="border-b p-2 text-center">Task</th>
// 							<th className="border-b p-2 text-center">Status</th>
// 							<th className="border-b p-2 text-center">Due Date</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{taskfilter?.map((task) => (
// 							<tr key={task.id} className="hover:bg-gray-100">
// 								<td className="border-b p-2 text-center">{task?.created_by}</td>
// 								<td className="border-b p-2 text-center">{task?.task}</td>
// 								<td className="border-b p-2 flex items-center justify-center">
// 									<span
// 										className={`inline-block rounded-full w-4 h-4  ${task?.status === "To Do"
// 											? "bg-yellow-300 text-yellow-800"
// 											: "bg-blue-300 text-blue-800"
// 											}`}
// 									>
// 									</span>
// 									<span className="ms-2">
// 										{task?.status}
// 									</span>
// 								</td>
// 								<td className="border-b p-2 text-center">{task?.dueDate}</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>

// 				<h1 className="text-2xl font-bold mb-4">Ticket</h1>
// 				<table className="w-full  ">
// 					<thead>
// 						<tr>
// 							<th className="border-b p-2 text-center">ticket</th>
// 							<th className="border-b p-2 text-center">ticket Subject</th>
// 							<th className="border-b p-2 text-center">priority</th>
// 							<th className="border-b p-2 text-center">description</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{filterdtaa?.map((task) => (
// 							<tr key={task?.id} className="hover:bg-gray-100">
// 								<td className="border-b p-2 text-center">{task?.created_by}</td>
// 								<td className="border-b p-2 text-center">{task?.ticketSubject}</td>
// 								<td className="border-b p-2 flex items-center justify-center">
// 									<span
// 										className={`inline-block rounded-full w-4 h-4  ${task?.priority === "To Do"
// 											? "bg-yellow-300 text-yellow-800"
// 											: "bg-blue-300 text-blue-800"
// 											}`}
// 									>
// 									</span>
// 									<span className="ms-2">
// 										{task?.priority}
// 									</span>
// 								</td>
// 								<td className="border-b p-2 text-center">{task?.description}</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>


// 			</div>
			
// 		</div>
// 	);
// };
// export default ProfileData;




import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaLayerGroup } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
    EyeOutlined,
    DeleteOutlined,
    CopyOutlined,
    EditOutlined,
    FundProjectionScreenOutlined,
    RiseOutlined,
    CopyrightOutlined,
    FormOutlined,
  } from "@ant-design/icons";
import { FaCoins } from "react-icons/fa";
import { IoLayers } from "react-icons/io5"; 
import { GetProject } from "views/app-views/dashboards/project/project-list/projectReducer/ProjectSlice";
import { GetTasks } from "views/app-views/dashboards/project/task/TaskReducer/TaskSlice";
import {  useSelector } from "react-redux";
import { GetLeads } from "views/app-views/dashboards/leads/LeadReducers/LeadSlice";
import { getAllTicket } from "../customersupports/ticket/TicketReducer/TicketSlice";
import { useDispatch } from "react-redux";
import { GetDeals } from "views/app-views/dashboards/deals/DealReducers/DealSlice";
import { ContaractData } from "views/app-views/dashboards/contract/ContractReducers/ContractSlice";
ChartJS.register(ArcElement, Tooltip, Legend);
const ProfileData = () => {

	const dispatch = useDispatch();
    // const [tasks, setTasks] = useState([
    //     { id: 1, task: "March Hare moved.", status: "To Do", dueDate: "Sun 06 Oct 2024" },
    //     { id: 2, task: "This seemed to be.", status: "Doing", dueDate: "Fri 28 Jun 2024" },
    //     { id: 3, task: "Mock Turtle, and.", status: "Doing", dueDate: "Fri 11 Oct 2024" },
    //     { id: 4, task: "The moment Alice.", status: "Doing", dueDate: "Wed 14 Feb 2024" },
    // ]);
    // State for managing profile data
    const [openTasks, setOpenTasks] = useState(4);
    const [projects, setProjects] = useState(2);
    const [pendingTasks, setPendingTasks] = useState(4);
    const [overdueTasks, setOverdueTasks] = useState(4);
    const [expenses, setExpenses] = useState(0);

	const idd = useSelector((state)=>state.user.loggedInUser.id)

	useEffect(()=>{
		dispatch(GetProject())
		dispatch(GetTasks(idd))
		dispatch(GetLeads())
		dispatch(getAllTicket())
		dispatch(GetDeals())
		dispatch(ContaractData())
	},[dispatch])


	const loggeddatass = useSelector((state)=>state.user.loggedInUser.username)


	const projectdata = useSelector((state) => state.Project.Project.data);
	const proijectfilter = projectdata?.filter((item)=>item?.created_by === loggeddatass)

const length = Array.isArray(proijectfilter) ? proijectfilter.length : 0;

const taskdata = useSelector((state) => state.Tasks.Tasks.data);
const taskssfilter = taskdata?.filter((item)=>item?.created_by === loggeddatass)

const tasklenght = Array.isArray(taskssfilter) ? taskssfilter.length : 0;

const loggeddata = useSelector((state)=>state.user.loggedInUser)

/////

const allticketdata = useSelector((state)=>state.Ticket.Ticket.data)


const leaddata = useSelector((state) => state.Leads.Leads.data);

const leaddatasss = Array.isArray(leaddata) ? leaddata.length : 0;

///

const dealdata = useSelector((state)=>state.Deals.Deals.data)

const dealdataass = Array.isArray(dealdata) ? dealdata.length : 0;

const contractdata = useSelector((state)=>state.Contract.Contract.data)

const contractdataass = Array.isArray(contractdata) ? contractdata.length : 0;



//////

const filterdtaa = allticketdata?.filter((item)=>item?.created_by === loggeddatass)

const taskfilter = taskdata?.filter((item)=>item?.created_by === loggeddatass)


   
    return (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
                {/* Profile Information */}
                <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://i.pravatar.cc/300?u=admin@example.com"
                            alt="Client"
                            className="w-24 h-24 rounded-md object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-medium mb-1 text-black">{loggeddata.username}</h2>
                            {/* <p className="text-sm text-gray-500 mb-1">Junior</p> */}
                            <p className="text-sm text-gray-500">{loggeddata.email}</p>
                        </div>
                    </div>
                    <h2 className=" border-b pb-2 font-medium"></h2>
                    <div className="flex justify-between py-3">
                        <div className="">
                            <span className="text-sm text-gray-500">Open Tasks</span>
                            <p className="text-xl font-semibold text-black  ">{tasklenght}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Projects</span>
                            <p className="text-xl font-semibold text-black">{length}</p>
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
                            <IoLayers className="text-gray-500 text-2xl mb-2" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        67991
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                        <h3 className="text-gray-600 text-lg font-semibold">Tasks</h3>
                        <span className="flex justify-end mb-4">
                            <TfiMenuAlt className="text-gray-500 text-2xl" />
                        </span>
                        <div className="flex gap-8  ">
                            <div>
                                <p className="text-xl font-medium md:text-base text-blue-500">
                                    {tasklenght}
                                </p>
                                <p className="f-14 mb-0 text-lightest">
                                    Pending
                                </p>
                            </div>
                            <div>
                                <p className="text-xl font-medium md:text-base text-red-500">
                                    0
                                </p>
                                <p className="f-14 mb-0 text-lightest">
                                    Overdue
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow flex flex-col">
                        <h3 className="text-gray-600 text-lg font-semibold">Project</h3>
                        <span className="flex justify-end mb-4">
                            <FaLayerGroup className="text-gray-500 text-2xl" />
                        </span>
                        <div className="flex gap-8  ">
                            <div>
                                <p className="text-xl font-medium md:text-base text-blue-500">
                                    {length}
                                </p>
                                <p className="f-14 mb-0 text-lightest">
                                    In Progress
                                </p>
                            </div>
                            <div>
                                <p className="text-xl font-medium md:text-base text-red-500">
                                    0
                                </p>
                                <p className="f-14 mb-0 text-lightest">
                                    Overdue
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
             
                     <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                        Total Projects
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <IoLayers  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        {length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                        Total Earnings
                        </h3>
                        <span className="flex justify-end">
                            {" "}
                            <IoLayers className="text-gray-500 text-2xl mb-2" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        0
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                        Total Task
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <IoLayers  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        {tasklenght}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                        Total Lead
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <IoLayers  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        {leaddatasss}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold">
                        Total Deal
                        </h3>
                        <span className="flex justify-end">
                            {" "}
                            <IoLayers className="text-gray-500 text-2xl mb-2" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        {dealdataass}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-gray-600 mb-2 text-lg font-semibold ">
                        Total Contract
                        </h3>
                        <span className="flex justify-end mb-2">
                            {" "}
                            <IoLayers  className="text-gray-500 text-2xl" />
                        </span>
                        <p className="text-xl font-medium md:text-base text-blue-500">
                        {contractdataass}
                        </p>
                    </div>
                   
            </div>
            <div className="container mx-auto p-4 bg-white  rounded-lg shadow">
                <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
                <table className="w-full  ">
                    <thead>
                        <tr>
                            {/* <th className="border-b p-2 text-center">created_by</th> */}
                            <th className="border-b p-2 text-center">Task Name</th>
                            <th className="border-b p-2 text-center">Status</th>
                            <th className="border-b p-2 text-center"> description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterdtaa?.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-100">
                                {/* <td className="border-b p-2 text-center">{task?.created_by}</td> */}
                                <td className="border-b p-2 text-center">{task?.taskName}</td>
                                <td className="border-b p-2 flex items-center justify-center">
                                    <span
                                        className={`inline-block rounded-full w-4 h-4  ${task?.priority === "To Do"
                                            ? "bg-yellow-300 text-yellow-800"
                                            : "bg-blue-300 text-blue-800"
                                            }`}
                                    >
                                    </span>
                                    <span className="ms-2">
                                        {task?.priority}
                                    </span>
                                </td>
                                <td className="border-b p-2 text-center">{task?.description}</td>
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
                                <th className=" p-2 text-center">Tickets</th>
                                <th className="p-2 text-center">Project</th>
                                {/* <th className=" p-2 text-center">Ticket Subject</th> */}
                                <th className=" p-2 text-center">Status</th>
                                <th className=" p-2 text-center">Priority</th>
                                <th className=" p-2 text-center">Description</th>
                                {/* <th className=" p-2 text-center">Requested On </th> */}
                            </tr>
                        </thead>
						<tbody>
                        {filterdtaa?.map((task) => (
                            <tr key={task.id} className="hover:bg-gray-100">
                                <td className="border-b p-2 text-center">{task?.ticketSubject}</td>

                                <td className="border-b p-2 text-center">{task?.project}</td>
                                <td className="border-b p-2 text-center">{task?.status}</td>
                                {/* <td className="border-b p-2 text-center">{task?.taskName}</td> */}
                                <td className="border-b p-2 flex items-center justify-center">
                                    <span
                                        className={`inline-block rounded-full w-4 h-4  ${task?.priority === "To Do"
                                            ? "bg-yellow-300 text-yellow-800"
                                            : "bg-blue-300 text-blue-800"
                                            }`}
                                    >
                                    </span>
                                    <span className="ms-2">
                                        {task?.priority}
                                    </span>
                                </td>

                                <td className="border-b p-2 text-center">{task?.description}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                    <p className="text-gray-500 text-center mt-4">- No record found. -</p>
                </div>
            </div>
        </div>
    );
};
export default ProfileData;