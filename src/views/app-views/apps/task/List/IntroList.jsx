import React from 'react'
import { Card, Table, Select, Input, Row, Col, Button, Badge, Menu, Tag, Modal } from 'antd';


const IntroList = () => {
    return (
        <>
            {/* <div className='bg-white w-full lg:w-[200px]'>
            <div className=''>
                <div className="space-y-4">
                    <div className=" text-red-500 rounded-md p-2 text-center font-semibold flex items-center gap-2">
                        <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                        <span className="text-gray-800">Incomplete</span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h3 className="text-sm text-gray-500">Created On</h3>
                        <p className="text-gray-800">Mon 21 Oct 2024 07:35 am</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h3 className="text-sm text-gray-500">Start Date</h3>
                        <p className="text-gray-800">Fri 02 Aug</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h3 className="text-sm text-gray-500">Due Date</h3>
                        <p className="text-gray-800">Thu 08 Aug 2024</p>
                    </div>
                    <div className='flex items-center justify-between'>
                        <h3 className="text-sm text-gray-500">Hours Logged</h3>
                        <p className="text-gray-800">0s</p>
                    </div>
                </div>
            </div>
        </div> */}
            <Row>
                <Col>

                </Col>
            </Row>
            <div className="bg-white shadow rounded-lg p-6 space-y-2 w-full  lg:w-[250px] xl:w-[250px]">
                <div className="text-red-500 rounded-md p-2 text-center font-semibold flex items-center gap-2">
                    <span className="h-3 w-3 bg-red-500 rounded-full"></span>
                    <span className="text-gray-800">Incomplete</span>
                </div>
                <div className="flex items-center gap-6">
                    <h3 className="text-sm text-gray-500">Created On</h3>
                    <p className="text-gray-800">Mon 21 Oct <br /><span>
                        2024 07:35 am
                    </span>
                    </p>
                </div>
                <div className="flex items-center gap-8">
                    <h3 className="text-sm text-gray-500">Start Date</h3>
                    <p className="text-gray-800">Fri 02 Aug
                    <br/>
                        <span>
                            2024
                        </span> 
                    </p>
                </div>
                <div className="flex items-center gap-9">
                    <h3 className="text-sm text-gray-500">Due Date</h3>
                    <p className="text-gray-800">Thu 08 Aug<br/>
                        <span>
                            2024
                        </span> 
                    </p>
                </div>
                <div className="flex items-center gap-5">
                    <h3 className="text-sm text-gray-500">Hours Logged</h3>
                    <p className="text-gray-800">0s</p>
                </div>
            </div>
        </>
    )
}

export default IntroList
