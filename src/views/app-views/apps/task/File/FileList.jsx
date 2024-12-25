import React from 'react'
import { FileOutlined } from '@ant-design/icons';
const FileList = () => {
    return (
        <div className='flex items-center justify-center'>
            <div className=''>
                <span ><FileOutlined className='flex justify-center text-lg'/></span>
                <p className='mt-3'>- No file uploaded. -</p>
            </div>
        </div>
    )
}

export default FileList
