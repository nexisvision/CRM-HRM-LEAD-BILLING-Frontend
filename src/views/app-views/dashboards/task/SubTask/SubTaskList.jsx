import React from 'react'
import { UnorderedListOutlined } from '@ant-design/icons';
function SubTaskList() {
    return (
        <div className='flex items-center justify-center'>
            <div>
                <span><UnorderedListOutlined className='flex justify-center text-lg'/></span>
                <p className='mt-3'>- Seems like no sub task exists in the database. Please create the sub task first -</p>
            </div>
        </div>
    )
}

export default SubTaskList
