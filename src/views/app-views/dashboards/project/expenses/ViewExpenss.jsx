import React from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';
import dayjs from 'dayjs';

const ViewExpenss = ({ data }) => {
    return (
        <div className='bg-gray-50 ml-[-51px] mr-[-24px] mt-[-52px] mb-[-30px] rounded-t-lg rounded-b-lg p-10'>
            <h2 className="mb-6 border-b pb-[25px] font-medium"></h2>
            <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full">
                <table className="table">
                <tbody>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Item Name</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>{data?.item || '--'}</td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Currency</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>{data?.currency || '--'}</td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Price</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            ${data?.price?.toFixed(2) || '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Purchase Date</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.purchase_date ? dayjs(data.purchase_date).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr>
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Employee</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.employee || '--'}
                        </td>
                    </tr>
                    {/* <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Created By</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.created_by || '--'}
                        </td>
                    </tr> */}
                    {/* <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Created At</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.createdAt ? dayjs(data.createdAt).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr> */}
                    {/* <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Updated At</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            {data?.updatedAt ? dayjs(data.updatedAt).format('DD-MM-YYYY') : '--'}
                        </td>
                    </tr> */}
                    <tr className='text-base grid grid-cols-2'>
                        <td className='text-[#99a5b5] font-semibold p-2'>Description</td>
                        <td className='text-[#5b676d] font-medium p-2 hover:text-black'>
                            <div dangerouslySetInnerHTML={{ __html: data?.description || '--' }} />
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default ViewExpenss
