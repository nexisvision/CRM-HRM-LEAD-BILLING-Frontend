import React from 'react';
import { Upload, List, Button,Col,Card } from 'antd';
import { InboxOutlined, DownloadOutlined } from '@ant-design/icons';

const Attachment = () => {
  const fileList = [
    {
      name: '2default.png',
      size: '0.01 MB',
      url: '#',
    },
    {
      name: '2default.png',
      size: '0.01 MB',
      url: '#',
    },
  ];

  return (
    <div>
          <Col span={24}>
          <Card className="bg-white">
          <div className="font-semibold text-lg mb-2">Contract Attachment</div>

      <div className="mb-4">
    
        <Upload.Dragger name="files" action="/upload.do" className="bg-gray-100">
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: '32px', color: '#007aff' }} />
          </p>
          <p className="ant-upload-text">Drop files here to upload</p>
        </Upload.Dragger>

      </div>
      <List
        itemLayout="horizontal"
        dataSource={fileList}
        renderItem={(item) => (
          <List.Item
            actions={[<Button type="link" icon={<DownloadOutlined />} href={item.url} />]}
          >
            <List.Item.Meta
              title={<span className="text-green-600 font-semibold">{item.name}</span>}
              description={<span className="text-gray-500">{item.size}</span>}
            />
          </List.Item>
        )}
      />
      </Card>
      </Col>
     
    </div>
  );
};

export default Attachment;
