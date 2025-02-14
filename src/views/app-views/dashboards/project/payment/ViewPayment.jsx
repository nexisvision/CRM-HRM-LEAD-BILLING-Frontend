import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

function ViewPayment({ data }) {
    const [invoiceNumber, setInvoiceNumber] = useState('--');
    const [projectName, setProjectName] = useState('--');

    // Get projects and invoices from Redux store
    const projectsData = useSelector((state) => state.Project.Project.data || []);
    const invoicesData = useSelector((state) => state.invoice.invoices || []);

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
    }, [data, projectsData, invoicesData]);

    return (
        <div className='bg-gray-50 ml-[-51px] mr-[-24px] mt-[-52px] mb-[-30px] rounded-t-lg rounded-b-lg p-10'>
            <h2 className="mb-6 border-b pb-[25px] font-medium"></h2>
        <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full">
            <table className="table">
                <tbody>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Amount</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            ${data?.amount || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Payment Date</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.paidOn ? dayjs(data.paidOn).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Invoice Number</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {invoiceNumber}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Project Name</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {projectName}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Currency</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.currency || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Transaction ID</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.transactionId || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Payment Method</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.paymentMethod || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Created By</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.created_by || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Created At</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.createdAt ? dayjs(data.createdAt).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Updated At</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.updatedAt ? dayjs(data.updatedAt).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Receipt</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.receipt ? (
                                <a href={data.receipt} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Receipt
                                </a>
                            ) : '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Remark</td>
                        <td className='text-[#5b676d] font-medium p-2'>
                            <div dangerouslySetInnerHTML={{ __html: data?.remark || '--' }} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
    );
}

export default ViewPayment;
