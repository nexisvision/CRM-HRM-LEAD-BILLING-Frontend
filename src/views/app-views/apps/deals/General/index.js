import React from 'react';
import { Card, Row, Col } from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  FolderOutlined,
} from '@ant-design/icons';

const General = () => {
  return (
    <div className="">
      <Row gutter={[16, 16]} className="mb-2">
        <Col span={6}>
          <Card className="text-center bg-green-100">
            <ToolOutlined style={{ fontSize: '24px', color: '#34c759' }} />
            <div className="font-semibold mt-2 text-green-600">Pipeline</div>
            <div className="text-md font-bold">Sales</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-green-100">
            <TeamOutlined style={{ fontSize: '24px', color: '#34c759' }} />
            <div className="font-semibold mt-2 text-green-600">Stage</div>
            <div className="text-md font-bold">Initial Contact</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-orange-100">
            <CalendarOutlined style={{ fontSize: '24px', color: '#ff9500' }} />
            <div className="font-semibold mt-2 text-orange-600">Created</div>
            <div className="text-md font-bold">Jul 20, 2021</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-blue-100">
            <DollarOutlined style={{ fontSize: '24px', color: '#007aff' }} />
            <div className="font-semibold mt-2 text-blue-600">Price</div>
            <div className="text-md font-bold">$50,000.00</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card className="text-center bg-pink-100">
            <FolderOutlined style={{ fontSize: '24px', color: '#ff2d55' }} />
            <div className="font-semibold mt-2 text-pink-600">Task</div>
            <div className="text-lg font-bold">1</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-blue-100">
            <ShoppingCartOutlined style={{ fontSize: '24px', color: '#007aff' }} />
            <div className="font-semibold mt-2 text-blue-600">Product</div>
            <div className="text-lg font-bold">2</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-green-100">
            <ToolOutlined style={{ fontSize: '24px', color: '#34c759' }} />
            <div className="font-semibold mt-2 text-green-600">Source</div>
            <div className="text-lg font-bold">3</div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="text-center bg-orange-100">
            <FileTextOutlined style={{ fontSize: '24px', color: '#ff9500' }} />
            <div className="font-semibold mt-2 text-orange-600">Files</div>
            <div className="text-lg font-bold">1</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default General;
