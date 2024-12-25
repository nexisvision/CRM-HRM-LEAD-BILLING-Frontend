import React from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';


const TimeSheetList = () => {
    return (

        <div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full  bg-white text-center text-xs">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-2 py-2">Employee</th>
                            <th className="px-2 py-2">Start Time</th>
                            <th className="px-2 py-2">End Time</th>
                            <th className="px-2 py-2">Memo</th>
                            <th className="px-2 py-2">Hours Logged</th>
                        </tr>
                    </thead>
                    
                </table>
                        <div className='flex items-center justify-center mt-4'>
                            <div className=''>
                                <span >
                                    <ClockCircleOutlined
                                        className='flex justify-center text-lg' /></span>
                                <p className='mt-3'>- No record found. -</p>
                            </div>
                        </div>
            </div>

        </div>

    )
}

export default TimeSheetList
