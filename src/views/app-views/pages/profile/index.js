import React, { useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaLayerGroup, FaCoins } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { EyeOutlined, CopyOutlined, RiseOutlined, CopyrightOutlined, FormOutlined, MailOutlined, GlobalOutlined, PhoneOutlined, RocketOutlined, BankOutlined, UserOutlined } from "@ant-design/icons";
import { GetProject } from "views/app-views/dashboards/project/project-list/projectReducer/ProjectSlice";
import { GetTasks } from "views/app-views/dashboards/project/task/TaskReducer/TaskSlice";
import { useSelector, useDispatch } from "react-redux";
import { GetLeads } from "views/app-views/dashboards/leads/LeadReducers/LeadSlice";
import { getAllTicket } from "../customersupports/ticket/TicketReducer/TicketSlice";
import { GetDeals } from "views/app-views/dashboards/deals/DealReducers/DealSlice";
import { ContaractData } from "views/app-views/dashboards/contract/ContractReducers/ContractSlice";
import { ClientData } from "views/app-views/company/CompanyReducers/CompanySlice";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfileData = () => {
    const dispatch = useDispatch();
    const idd = useSelector((state) => state.user.loggedInUser.id);
    const loggeddatass = useSelector((state) => state.user.loggedInUser.username);
    const filterdatas = useSelector((state) => state.user.loggedInUser);
    const projectdata = useSelector((state) => state.Project.Project.data);
    const taskdata = useSelector((state) => state.Tasks.Tasks.data);
    const allticketdata = useSelector((state) => state.Ticket.Ticket.data);
    const leaddata = useSelector((state) => state.Leads.Leads.data);
    const dealdata = useSelector((state) => state.Deals.Deals.data);
    const contractdata = useSelector((state) => state.Contract.Contract.data);
    const alldatas = useSelector((state) => state.ClientData.ClientData.data);

    useEffect(() => {
        dispatch(GetProject());
        dispatch(GetTasks(idd));
        dispatch(GetLeads());
        dispatch(getAllTicket());
        dispatch(GetDeals());
        dispatch(ContaractData());
        dispatch(ClientData());
    }, [dispatch, idd]);

    const proijectfilter = projectdata?.filter((item) => item?.created_by === loggeddatass);
    const length = Array.isArray(proijectfilter) ? proijectfilter.length : 0;

    const taskssfilter = taskdata?.filter((item) => item?.created_by === loggeddatass);
    const tasklenght = Array.isArray(taskssfilter) ? taskssfilter.length : 0;

    const leaddatasss = Array.isArray(leaddata) ? leaddata.length : 0;
    const dealdataass = Array.isArray(dealdata) ? dealdata.length : 0;
    const contractdataass = Array.isArray(contractdata) ? contractdata.length : 0;

    const filterdtaa = allticketdata?.filter((item) => item?.created_by === loggeddatass);
    const loggedInUser = alldatas?.find((item) => item?.id === filterdatas.id);

    const stripHtmlTags = (html) => {
        if (!html) return '';
        return html.replace(/<[^>]*>/g, '');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative">
                        <div className="h-48 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff] via-[#f5f9ff] to-[#f0f7ff]">
                                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(99, 134, 255, 0.03) 1px, transparent 1px),linear-gradient(90deg, rgba(99, 134, 255, 0.03) 1px, transparent 1px)`, backgroundSize: '20px 20px', transform: 'skewY(-2deg) scale(1.2)', transformOrigin: '0 0' }} />
                                <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2L20 7V17L12 22L4 17V7L12 2Z' stroke='rgba(99, 134, 255, 0.08)' stroke-width='1'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='9' stroke='rgba(99, 134, 255, 0.06)' stroke-width='1'/%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='1' width='16' height='16' stroke='rgba(99, 134, 255, 0.07)' stroke-width='1'/%3E%3C/svg%3E")`, backgroundPosition: '85% 20%, 15% 40%, 50% 70%', backgroundRepeat: 'repeat', backgroundSize: '64px, 48px, 32px', opacity: 0.7 }} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-xl border-4 border-white shadow-lg overflow-hidden">
                                        <img src={loggedInUser?.profilePic || "https://via.placeholder.com/100"} alt={loggedInUser?.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-2xl font-semibold text-gray-800">{`${loggedInUser?.firstName || ''} ${loggedInUser?.lastName || ''}`}</h2>
                                    <div className="flex items-center mt-2">
                                        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-sm">
                                            <MailOutlined className="text-blue-500" />
                                            <span className="text-sm text-gray-600">{loggedInUser?.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pt-20 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <UserOutlined className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Username</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.username || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <PhoneOutlined className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.phone || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <FormOutlined className="text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">GST Number</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.gstIn || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <GlobalOutlined className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.address || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cyan-50 rounded-lg">
                                            <RocketOutlined className="text-cyan-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">State</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.state || 'Not Set'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Banking Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-50 rounded-lg">
                                            <BankOutlined className="text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Bank Name</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.bankname || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <UserOutlined className="text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Account Holder</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.accountholder || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <CopyOutlined className="text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Account Number</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.accountnumber || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FaCoins className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Account Type</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.accounttype || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <GlobalOutlined className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">IFSC Code</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.ifsc || 'Not Set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <GlobalOutlined className="text-purple-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Bank Location</p>
                                            <p className="font-medium text-gray-800">{loggedInUser?.banklocation || 'Not Set'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500 rounded-lg">
                                        <TfiMenuAlt className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-600 font-medium">Open Tasks</p>
                                        <h3 className="text-2xl font-bold text-blue-700">{tasklenght}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500 rounded-lg">
                                        <FaLayerGroup className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-600 font-medium">Projects</p>
                                        <h3 className="text-2xl font-bold text-emerald-700">{length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500 rounded-lg">
                                        <EyeOutlined className="text-xl text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-orange-600 font-medium">Tickets</p>
                                        <h3 className="text-2xl font-bold text-orange-700">{filterdtaa?.length || 0}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[
                    { title: 'Total Leads', value: leaddatasss, icon: <RiseOutlined />, color: 'purple' },
                    { title: 'Total Deals', value: dealdataass, icon: <FaCoins />, color: 'yellow' },
                    { title: 'Total Contracts', value: contractdataass, icon: <FormOutlined />, color: 'red' },
                    { title: 'Total Earnings', value: '0', icon: <CopyrightOutlined />, color: 'indigo' }
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-${stat.color}-600 text-sm font-semibold`}>{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-2 text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                                <span className={`text-${stat.color}-500 text-xl`}>{stat.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Task Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Start Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Due Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">File</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {taskssfilter?.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-800">{task?.taskName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${task?.status === "Complete" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {task?.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${task?.priority === "High" ? "bg-red-100 text-red-800" : task?.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                            {task?.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(task?.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(task?.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{stripHtmlTags(task?.description)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {task?.task_file && (
                                            <a href={task.task_file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                                <CopyOutlined />
                                                <span>View File</span>
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {taskssfilter?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No tasks found</div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Tickets</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ticket Subject</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Description</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Created Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">File</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filterdtaa?.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-800">{ticket?.ticketSubject}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{ticket?.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ticket?.status === "Open" ? "bg-green-100 text-green-800" : ticket?.status === "In Progress" ? "bg-blue-100 text-blue-800" : ticket?.status === "Closed" ? "bg-gray-100 text-gray-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {ticket?.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${ticket?.priority === "High" ? "bg-red-100 text-red-800" : ticket?.priority === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                                            {ticket?.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(ticket?.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {ticket?.file && (
                                            <a href={ticket.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
                                                <CopyOutlined />
                                                <span>View File</span>
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filterdtaa?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No tickets found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileData;