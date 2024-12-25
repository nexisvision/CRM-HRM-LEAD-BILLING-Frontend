import React from "react";
import { Card, Col, Row } from "antd";
import { Line } from "react-chartjs-2";
import { UserOutlined, ShoppingCartOutlined, TrophyOutlined } from "@ant-design/icons";

const SuperadminDashboard = () => {
  const data = {
    labels: [
      "22-Nov",
      "23-Nov",
      "24-Nov",
      "25-Nov",
      "26-Nov",
      "27-Nov",
      "28-Nov",
      "29-Nov",
      "30-Nov",
      "01-Dec",
      "02-Dec",
      "03-Dec",
      "04-Dec",
      "05-Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: [300, 400, 500, 350, 450, 300, 500, 400, 300, 500, 550, 400, 450, 300],
        fill: true,
        backgroundColor: "rgba(102, 221, 102, 0.2)",
        borderColor: "rgba(102, 221, 102, 1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: "#e8f7e8" }}>
            <Row>
              <Col span={6}>
                <UserOutlined style={{ fontSize: "24px", color: "#66dd66" }} />
              </Col>
              <Col span={18}>
                <h3>Total Companies</h3>
                <p>23</p>
                <small>Paid Users : 8</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: "#fff6e8" }}>
            <Row>
              <Col span={6}>
                <ShoppingCartOutlined style={{ fontSize: "24px", color: "#ffb822" }} />
              </Col>
              <Col span={18}>
                <h3>Total Orders</h3>
                <p>86</p>
                <small>Total Order Amount : $82150</small>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card style={{ backgroundColor: "#e8f7ff" }}>
            <Row>
              <Col span={6}>
                <TrophyOutlined style={{ fontSize: "24px", color: "#00c8ff" }} />
              </Col>
              <Col span={18}>
                <h3>Total Plans</h3>
                <p>4</p>
                <small>Most Purchase Plan : Gold</small>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <h2>Recent Order</h2>
      {/* <Card>
        <Line data={data} options={options} />
      </Card> */}
    </div>
  );
};

export default SuperadminDashboard;
