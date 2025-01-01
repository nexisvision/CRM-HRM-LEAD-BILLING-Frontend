import React from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';

const ComplatedList = () => {
    return (
        
        <>               
        <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Milestone Title</td>
                                    <td className='  text-[#5b676d] font-base p-2 hover:text-black'>Project Closure</td>
                                </tr>
                                <tr class="font-16 font-weight-600">
                                    <td className='text-[#99a5b5] font-medium p-2'>Milestone Cost</td>
                                    <td className=' text-[#5b676d] font-base p-2'>
                                    $3,687.00</td>

                                </tr>
                               
                                <tr>
                                    <td className=' text-[#99a5b5] font-medium p-2'>Status </td>
                                    <td className=' text-[#5b676d] p-2 font-base'>Incomplete
                                    </td>
                                </tr>

                                <tr>
                                    <td className=' text-[#99a5b5] font-medium p-2'>Milestone Summary</td>
                                    <td className=' text-[#5b676d] p-2 font-base'>Conduct a project review to evaluate overall success and lessons learned. Document and archive project information. Celebrate project completion with the project team.
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Total Hours

</td>
                                    <td className='  text-[#5b676d] p-2 font-base'>0s</td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Milestone Start Date</td>
                                    <td className=' text-[#5b676d] p-2 font-base'>Thu 19 Dec 2024</td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Milestone End Date</td>
                                    <td className='  text-[#5b676d] p-2 font-base'>
                                    Mon 23 Dec 2024</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
        
            </>
    )
}

export default ComplatedList
