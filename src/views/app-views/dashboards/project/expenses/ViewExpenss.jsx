import React, { useEffect, useState } from 'react';
import { Card, Tag, Tooltip, Badge } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { 
    ShoppingOutlined,
    CalendarOutlined, 
    UserOutlined, 
    FileOutlined, 
    GlobalOutlined,
    InfoCircleOutlined,
    ProjectOutlined,
    UserSwitchOutlined,
    IdcardOutlined,
    ClockCircleOutlined,
    FileTextOutlined,
    DollarOutlined
} from '@ant-design/icons';

const ViewExpenss = ({ data }) => {
    const allProjects = useSelector((state) => state.Project?.Project?.data || []);
    const allClients = useSelector((state) => state.SubClient?.SubClient?.data || []);

    const projectDetails = allProjects.find(project => project.id === data?.project);
    const clientDetails = allClients.find(client => client.client_id === data?.client_id);

    return (
        <div className="bg-white p-6">
           
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/* Item Name Row */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <ShoppingOutlined className="text-emerald-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Item Name</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {data?.item || '--'}
                                    </span>
                                </td>
                            </tr>

                            {/* Price Row */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <DollarOutlined className="text-yellow-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Price</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        ${data?.price?.toFixed(2) || '--'}
                                    </span>
                                </td>
                            </tr>

                            {/* Project Row - Updated */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <ProjectOutlined className="text-purple-500 text-lg mr-3" />
                                        <span className="text-sm text-gray-900">Project</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-2 text-gray-900">
                                            {projectDetails?.project_name || 'N/A'}
                                    </div>
                                </td>
                            </tr>

                            {/* Client Row - Updated to show username */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <IdcardOutlined className="text-indigo-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Client</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-2 text-gray-900">
                                            {clientDetails?.username || 'N/A'}
                                    </div>
                                </td>
                            </tr>

                            {/* Purchase Date Row */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <CalendarOutlined className="text-orange-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Purchase Date</span>
                                    </div>
                                </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                    <span className="text-sm text-gray-900">
                                        {data?.purchase_date ? dayjs(data.purchase_date).format('DD-MM-YYYY') : '--'}
                                    </span>
                                </td>
                            </tr>

                            {/* Bill Row */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                    <div className="flex items-center">
                                        <FileOutlined className="text-red-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Bill</span>
                                    </div>
                                </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                    {data?.bill ? (
                                        <a 
                                            href={data.bill} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <FileOutlined className="mr-2" />
                                            View Bill
                                        </a>
                                    ) : '--'}
                                </td>
                            </tr>

                            {/* Description Row */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 w-1/3">
                                    <div className="flex items-center">
                                        <FileTextOutlined className="text-blue-500 text-lg mr-3" />
                                        <span className="text-sm font-medium text-gray-600">Description</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="text-sm text-gray-900 prose max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: data?.description || '--' }} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default ViewExpenss;
