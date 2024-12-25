import React, { useState } from 'react';
import { Upload, Button, List, message, Card } from 'antd';
import { InboxOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';

const Files = () => {
  const [fileList, setFileList] = useState([]);

  const handleUpload = ({ file }) => {
    if (!fileList.some((item) => item.name === file.name)) {
      setFileList([...fileList, file]);
      message.success(`${file.name} uploaded successfully`);
    } else {
      message.warning(`${file.name} is already uploaded`);
    }
  };

  const handleRemove = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
    message.success(`${file.name} removed successfully`);
  };

  const handleDownload = (file) => {
    message.success(`Downloading ${file.name}`);
    // Logic for downloading the file (optional)
  };

  return (
    // <div style={{ padding: 20 }}>
    <Card>    
        <h1 className='mb-3 font-bold text-lg'>Files</h1>
      <Upload.Dragger
        multiple={false}
        // className='mt-6'
        beforeUpload={() => false} // Prevent automatic upload
        onChange={handleUpload}
        showUploadList={false}
        accept="*"
        style={{ borderRadius: '8px' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Upload.Dragger>

      <div style={{ marginTop: 20 }}>
        <List
          bordered
          dataSource={fileList}
          renderItem={(file) => (
            <List.Item
              actions={[
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(file)}
                  style={{ backgroundColor: '#00b7b7', color: 'white' }}
                />,
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(file)}
                  style={{ backgroundColor: '#ff4d4f', color: 'white' }}
                />,
              ]}
            >
              <List.Item.Meta title={file.name} />
            </List.Item>
          )}
        />
      </div>
      </Card>

  );
};

export default Files;
