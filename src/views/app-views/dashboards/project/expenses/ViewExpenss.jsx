import React from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';

const ViewExpenss = () => {
    return (
        
        <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full ">
            <table class="table">
                <tbody>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Item Name</td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>dsdasf</td>
                    </tr>
                    <tr class="font-16 font-weight-600">
                        <td className='text-[#99a5b5] font-medium p-2'>Category</td>
                        <td className=' text-[#5b676d] font-base p-2'>
                            --</td>
                    </tr>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Price</td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>$1,234.00</td>
                    </tr>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Purchased From</td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>dfdsfsfd
                        </td>
                    </tr>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Project
                        </td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>Website Copier Project
                        </td>
                    </tr>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Bank Account
                        </td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>Primary Account | Mayert-Treutel
                        </td>
                    </tr>
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Bill
                        </td>
                        <td className='  text-[#5b676d] font-base p-2 hover:text-black'>
                        --
                        </td>
                    </tr>
                    <tr>
                        <td className=' text-[#99a5b5] font-medium p-2'>Employee</td>
                        <td className=' text-[#5b676d] p-2'>
                            <div className='flex gap-2 items-center'>
                                <div>
                                    <img src='https://demo-saas.worksuite.biz/img/gravatar.png' alt='user' className='rounded-full border h-8 w-8' />
                                </div>
                                <div>
                                    <h5>Cecil Franecki</h5>
                                    <span className='text-xs font-base'>
                                    Project Manager
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className=' text-[#99a5b5] font-medium p-2'>Description</td>
                        <td className=' text-[#5b676d] p-2 font-base'>dsfdsfdsf</td>
                    </tr>

                    <tr>
                        <td className=' text-[#99a5b5] font-medium p-2'>Status</td>
                        <td className=' text-[#5b676d] p-2 font-base'>
                        <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                        <span className="text-gray-800">Incomplete</span>
                        </td>
                    </tr>
                   
                    <tr>
                        <td className='text-[#99a5b5] font-medium p-2'>Approved By</td>
                        <td className=' text-[#5b676d] p-2'>
                            <div className='flex gap-2 items-center'>
                                <div>
                                    <img src='https://demo-saas.worksuite.biz/img/gravatar.png' alt='user' className='rounded-full border h-8 w-8' />
                                </div>
                                <div>
                                    <h5>Prof.Amya Zemlak <button className='bg-gray-400 text-white text-xs rounded-md px-2 py-1'>It's You</button> </h5>
                                    <span className='text-xs font-base'>
                                    Junior
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ViewExpenss
