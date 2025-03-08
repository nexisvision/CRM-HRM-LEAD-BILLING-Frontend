import React from 'react';
import { Modal, Row, Col, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const ViewExpenses = ({ visible, onClose, expenseData }) => {
  // Sample data (replace `expenseData` with props or API data)
  const data = expenseData || {
    date: '05-15-2024',
    client: 'Dellon Inc',
    project: 'Mobile banking app development',
    recordedBy: 'Faith Hamilton',
    description: 'Web hosting',
    fileAttachment: 'Receipt.png',
    fileLink: '#',
    financial: { billable: true, invoiced: false },
    amount: '$480.00',
  };

  return (
    
    <>
    <div>
      <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-2'>
      <h2 className="mb-4 border-b pb-[50px] font-medium"></h2>
    <div className="m-4">
      <Row gutter={[]} >
        <Col span={8} className='border p-2'>
          <Text strong>Date</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.date}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Client</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.client}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Project</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.project}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Recorded By</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.recordedBy}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Description</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.description}</Text>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>File Attachment</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <a href={data.fileLink} target="_blank" rel="noopener noreferrer">
            {data.fileAttachment}
          </a>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Financial</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Button type="primary" size="small" disabled={!data.financial.billable}>
            Billable
          </Button>
          <Button type="default" size="small" disabled={data.financial.invoiced}>
            Not Invoiced
          </Button>
        </Col>

        <Col span={8} className='border p-2'>
          <Text strong>Amount</Text>
        </Col>
        <Col span={16} className='border p-2'>
          <Text>{data.amount}</Text>
        </Col>
      </Row>
    </div>
      </div>
    </div>
      </>
    // {/* </Modal> */}
  );
};

export default ViewExpenses;

