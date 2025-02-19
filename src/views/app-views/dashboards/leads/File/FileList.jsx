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
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fileadd } from './fileReducers/filesSlice';
import { Avatar } from 'antd';

function FileList() {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Create FormData object to send file
    const formData = new FormData();
    formData.append('lead_files', file);
    
    try {
      // Dispatch file upload action and wait for it to complete
      await dispatch(fileadd({ id, values: formData }));
      // Reset the file input and state after successful upload
      setSelectedFile(null);
      event.target.value = ''; // Reset the file input
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const allprojectdata = useSelector((state)=>state.Project.Project.data);
  const fnddata = allprojectdata.find((item)=>item.id === id);
  
  // Parse the files JSON string
  const projectFiles = fnddata?.files ? JSON.parse(fnddata.files) : [];

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <label htmlFor="fileInput" className="flex items-center cursor-pointer">
        <IoAddCircleOutline className="w-6 h-6 text-blue-500"/>
        <span className="ml-2 text-blue-500">Upload File</span>
        <input type="file" id="fileInput" onChange={handleFileChange} hidden />
      </label>
      {selectedFile && (
        <div className="mt-4">
          <p>Selected File: {selectedFile.name}</p>
        </div>
      )}
      {projectFiles.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {projectFiles.map((file, index) => (
            <div key={index} className="flex items-center p-3 border rounded-lg">
              <FileOutlined className="text-lg text-blue-500 mr-2"/>
              <span className="mr-2">{file.filename}</span>
              <Avatar src={file.url} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-gray-500 text-center">
          <span><FileOutlined className='flex justify-center text-lg'/></span>
          <p className="mt-2">- No file uploaded -</p>
        </div>
      )}
    </div>
  );
}

export default FileList;
