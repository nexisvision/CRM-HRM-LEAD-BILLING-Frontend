import React, { useState, useEffect } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { FileOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fileadd, GetProject } from './fileReducers/filesSlice';
import { Avatar } from 'antd';

function FileList() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const allprojectdata = useSelector((state) => state.Project.Project.data);

  // Update local files state whenever allprojectdata changes
  useEffect(() => {
    if (allprojectdata) {
      const fnddata = allprojectdata.find((item) => item.id === id);
      
      // Safely parse the files data
      let projectFiles = [];
      if (fnddata?.files) {
        try {
          // Check if it's already an object
          if (typeof fnddata.files === 'object') {
            projectFiles = Array.isArray(fnddata.files) ? fnddata.files : [];
          } else {
            // Try to parse string
            projectFiles = JSON.parse(fnddata.files);
          }
        } catch (error) {
          console.error('Error parsing files:', error);
          projectFiles = [];
        }
      }
      
      setFiles(projectFiles);
    }
  }, [allprojectdata, id]);

  useEffect(() => {
    dispatch(GetProject());
  }, [dispatch]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append('project_files', file);

    try {
      const response = await dispatch(fileadd({ id, values: formData })).unwrap();
      if (response && response.data) {
        const newFile = {
          filename: file.name,
          url: URL.createObjectURL(file)
        };
        setFiles(prevFiles => [...prevFiles, newFile]);
      }

      // Fetch fresh data from server
      await dispatch(GetProject());

      // Reset states
      setSelectedFile(null);
      event.target.value = '';
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <label htmlFor="fileInput" className="flex items-center cursor-pointer">
        <IoAddCircleOutline className="w-6 h-6 text-blue-500" />
        <span className="ml-2 text-blue-500">Upload File</span>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          hidden
        />
      </label>

      {selectedFile && (
        <div className="mt-4">
          <p>Selected File: {selectedFile.name}</p>
        </div>
      )}

      {files.length > 0 ? (
        <div className="mt-4 grid gap-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center p-3 border rounded-lg">
              <FileOutlined className="text-lg text-blue-500 mr-2" />
              <span className="mr-2">{file.filename}</span>
              <Avatar src={file.url} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-gray-500 text-center">
          <span><FileOutlined className='flex justify-center text-lg' /></span>
          <p className="mt-2">- No file uploaded -</p>
        </div>
      )}
    </div>
  );
}

export default FileList;
