// import React from 'react'
// import { FileOutlined } from '@ant-design/icons';
// const FileList = () => {
//     return (
//         <div className='flex items-center justify-center'>
//             <div className=''>
//                 <span ><FileOutlined className='flex justify-center text-lg'/></span>
//                 <p className='mt-3'>- No file uploaded. -</p>
//             </div>
//         </div>
//     )
// }

// export default FileList

import React, { useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { FileOutlined } from '@ant-design/icons';
function FileList() {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <label htmlFor="fileInput" className="flex items-center cursor-pointer">
        <IoAddCircleOutline className="w-6 h-6 text-blue-500"/>
        <span className="ml-2 text-blue-500">Upload File</span>
        <input type="file" id="fileInput" onChange={handleFileChange} hidden />
      </label>
      {selectedFile ? (
        <div className="mt-4">
          <p>Selected File: {selectedFile.name}</p>
        </div>
      ) : (
        <div className="mt-4 text-gray-500 text-center">
           <span ><FileOutlined className='flex justify-center text-lg'/></span>
          <p className="mt-2">- No file uploaded -</p>
        </div>
      )}
    </div>
  );
    }
export default FileList;
