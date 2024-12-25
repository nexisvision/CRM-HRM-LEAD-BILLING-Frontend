import React from 'react';
import { Card, Button, Descriptions, Tag, Rate } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const BasicInformation = () => {
  const user = {
    phone: '1457896589',
    dob: '30-11-0001',
    gender: 'Male',
    country: 'China',
    state: 'GUJARAT',
    city: 'Borivali',
    appliedFor: 'Highly Competitive Fashion Jobs',
    appliedAt: '21-07-2021',
    cvUrl: '#', // Replace with the actual CV download URL
    coverLetter: 'Candice',
    rating: 4,
  };

  return (
    <Card
      title="Basic Information"
    //   extra={<Button type="primary" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>+ Add to Job OnBoard</Button>}
      style={{ maxWidth: 1100 }}
    >
            <hr style={{ marginBottom: '10px', border: '1px solid #e8e8e8' }} />

      <Descriptions column={1} bordered>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="DOB">{user.dob}</Descriptions.Item>
        <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
        <Descriptions.Item label="Country">{user.country}</Descriptions.Item>
        <Descriptions.Item label="State">{user.state}</Descriptions.Item>
        <Descriptions.Item label="City">{user.city}</Descriptions.Item>
        <Descriptions.Item label="Applied For">{user.appliedFor}</Descriptions.Item>
        <Descriptions.Item label="Applied at">{user.appliedAt}</Descriptions.Item>
        <Descriptions.Item label="CV / Resume">
          <Button icon={<DownloadOutlined />} href={user.cvUrl} download>
            Download
          </Button>
        </Descriptions.Item>
        <Descriptions.Item label="Cover Letter">{user.coverLetter}</Descriptions.Item>
        <Descriptions.Item label="Rating">
          <Rate disabled defaultValue={user.rating} />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default BasicInformation;
