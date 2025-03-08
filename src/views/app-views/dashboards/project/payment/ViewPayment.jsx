import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { 
    ShoppingOutlined,
    DollarOutlined,
    ProjectOutlined,
    UserOutlined,
    CalendarOutlined,
    FileTextOutlined,
    BankOutlined,
    GlobalOutlined,
    FileOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

function ViewPayment({ data }) {
    const [invoiceNumber, setInvoiceNumber] = useState('--');
    const [projectName, setProjectName] = useState('--');
    const [clientName, setClientName] = useState('--');

    // Get projects and invoices from Redux store
    const projectsData = useSelector((state) => state.Project.Project.data || []);
    const invoicesData = useSelector((state) => state.invoice.invoices || []);
    const allClients = useSelector((state) => state.SubClient?.SubClient?.data || []);

    useEffect(() => {
        // Find project name
        if (data?.project_name && projectsData) {
            const project = projectsData.find(p => p.id === data.project_name);
            if (project) {
                setProjectName(project.project_name);
            }
        }

        // Find invoice number
        if (data?.invoice && invoicesData) {
            const invoice = invoicesData.find(i => i.id === data.invoice);
            if (invoice) {
                setInvoiceNumber(invoice.invoiceNumber);
            }
        }

        // Find client name - using client_id for matching
        if (data?.client_id && allClients) {
            const client = allClients.find(c => c.client_id === data.client_id);
            if (client) {
                setClientName(client.username);
            }
        }
    }, [data, projectsData, invoicesData, allClients]);

    return (
        <div className="bg-white p-6">
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {/* Invoice Number Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <FileTextOutlined className="text-indigo-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Invoice Number</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {invoiceNumber}
                                </span>
                            </td>
                        </tr>

                        {/* Project Name Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <ProjectOutlined className="text-cyan-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Project Name</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {projectName}
                                </span>
                            </td>
                        </tr>

                        {/* Client Name Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <IdcardOutlined className="text-indigo-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Client</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-900">{clientName}</span>
                                </div>
                            </td>
                        </tr>

                        {/* Transaction ID Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <BankOutlined className="text-blue-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Transaction ID</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {data?.transactionId || '--'}
                                </span>
                            </td>
                        </tr>

                        {/* Amount Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <DollarOutlined className="text-yellow-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Amount</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                  {data?.amount || '--'}
                                </span>
                            </td>
                        </tr>

                        {/* Payment Method Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <BankOutlined className="text-purple-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Payment Method</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {data?.paymentMethod?.toUpperCase() || '--'}
                                </span>
                            </td>
                        </tr>

                        {/* Payment Date Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <CalendarOutlined className="text-red-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Payment Date</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                <span className="text-sm text-gray-900">
                                    {data?.paidOn ? dayjs(data.paidOn).format('DD-MM-YYYY') : '--'}
                                </span>
                            </td>
                        </tr>

                        {/* Receipt Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 whitespace-nowrap w-1/3">
                                <div className="flex items-center">
                                    <FileOutlined className="text-blue-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Receipt</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap">
                                {data?.receipt ? (
                                    <a 
                                        href={data.receipt} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <FileOutlined className="mr-2" />
                                        View Receipt
                                    </a>
                                ) : '--'}
                            </td>
                        </tr>

                        {/* Remark Row */}
                        <tr className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3 w-1/3">
                                <div className="flex items-center">
                                    <FileTextOutlined className="text-teal-500 text-lg mr-3" />
                                    <span className="text-sm font-medium text-gray-600">Remark</span>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <div className="text-sm text-gray-900 prose max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: data?.remark || '--' }} />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewPayment;
