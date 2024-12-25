import React, { useState } from "react";
import { Row, Col, Button, Radio, Avatar, Typography } from "antd";

const { Title, Text } = Typography;

const JobCandidateDetails = () => {
  const [status, setStatus] = useState("Applied");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const candidate = {
    name: "Candice",
    email: "Candice@gmail.com",
    avatarUrl: "https://i.pravatar.cc/150?img=11", // Example avatar
  };

  return (
    <div style={{ backgroundColor: "#f9f9f9" }}>
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>Basic Details</Title>
          </Col>
          <Col>
            <Button type="primary">
              UnArchive
            </Button>
          </Col>
        </Row>
        <hr style={{ marginBottom: '10px', marginTop: '10px', border: '1px solid #e8e8e8' }} />

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col span={4}>
            <Avatar size={64} src={candidate.avatarUrl} />
          </Col>
          <Col span={20}>
            <Title level={5} style={{ marginBottom: 0 }}>
              {candidate.name}
            </Title>
            <Text type="secondary">{candidate.email}</Text>
          </Col>
        </Row>

        <div style={{ marginTop: 20 }}>
          <Radio.Group onChange={handleStatusChange} value={status}>
            <Radio value="Applied">Applied</Radio>
            <Radio value="Phone Screen">Phone Screen</Radio>
            <Radio value="Interview">Interview</Radio>
            <Radio value="Hired">Hired</Radio>
            <Radio value="Rejected">Rejected</Radio>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default JobCandidateDetails;
