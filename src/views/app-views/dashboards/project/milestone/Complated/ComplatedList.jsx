import React from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';

const ComplatedList = () => {
    return (
        
        <>

                   
        <div className="bg-white shadow rounded-lg p-6 space-y-4 w-full lg:w-[690px]">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Project</td>
                                    <td className='  text-[#5b676d] font-base p-2 hover:text-black'>Therapy and mental health support</td>
                                </tr>
                                <tr class="font-16 font-weight-600">
                                    <td className='text-[#99a5b5] font-medium p-2'>Priority</td>
                                    <td className=' text-[#5b676d] font-base p-2'>
                                        Low</td>

                                </tr>
                                <tr>
                                    <td className=' text-[#99a5b5] font-medium p-2'>Assigned To</td>
                                    <td className=' text-[#5b676d] p-2'>
                                        <div className='flex gap-2 items-center'>
                                            <div>
                                                <img src='https://demo-saas.worksuite.biz/img/gravatar.png' alt='user' className='rounded-full border h-8 w-8' />
                                            </div>
                                            <div>
                                                <h5>Aletha Pagac</h5>
                                                <span className='text-xs font-base'>
                                                    Junior
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className=' text-[#99a5b5] font-medium p-2'>Short Code</td>
                                    <td className=' text-[#5b676d] p-2 font-base'>TAMHS-3</td>
                                </tr>

                                <tr>
                                    <td className=' text-[#99a5b5] font-medium p-2'>Milestones</td>
                                    <td className=' text-[#5b676d] p-2 font-base'>--</td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Label</td>
                                    <td className='  text-[#5b676d] p-2 font-base'>--</td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Task category</td>
                                    <td className=' text-[#5b676d] p-2 font-base'>--</td>
                                </tr>
                                <tr>
                                    <td className='text-[#99a5b5] font-medium p-2'>Description</td>
                                    <td className='  text-[#5b676d] p-2 font-base'>
                                    I to get through the doorway; 'and even if I shall never get to the little door into that beautiful garden--how IS that to be almost out of the Mock Turtle interrupted, 'if you don't like them raw.'.</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    {/* </div>
                </div> */}
            </>
    )
}

export default ComplatedList
