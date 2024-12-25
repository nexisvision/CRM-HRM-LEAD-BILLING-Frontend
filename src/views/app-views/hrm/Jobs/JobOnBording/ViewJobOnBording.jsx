import React from "react";
import { Row, Col, Card } from "antd";

const ViewJobOnBording = () => {
  return (
    <div style={{ margin: "-22px", padding: "20px", height: "100px", background: "#f5f5f5" }}>
      <Row gutter={[16, 16]}>

      <Col span={24}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="text-lg font-bold mb-3">Employee</h2>
            {/* <Button type="primary">+ Add to Job OnBoard</Button> */}
          </div>
        </Col>
        {/* Personal Detail */}
        <Col span={12}>
          <Card title="Personal Detail" bordered={false}>
            <p>
              <strong>EmployeeId:</strong> #EMP0000008
            </p>
            <p>
              <strong>Name:</strong> Sonya Sims
            </p>
            <p>
              <strong>Email:</strong> picora7662@rezunz.com
            </p>
            <p>
              <strong>Date of Birth:</strong> 10-01-2022
            </p>
            <p>
              <strong>Phone:</strong> 7224848733
            </p>
            <p>
              <strong>Address:</strong> Voluptatem quo culpa
            </p>
            <p>
              <strong>Salary Type:</strong> Monthly Payslip
            </p>
            <p>
              <strong>Basic Salary:</strong> 10000
            </p>
          </Card>
        </Col>

        {/* Company Detail */}
        <Col span={12}>
          <Card title="Company Detail" bordered={false}>
            <p>
              <strong>Branch:</strong> China
            </p>
            <p>
              <strong>Department:</strong> Financials
            </p>
            <p>
              <strong>Designation:</strong> Chartered
            </p>
            <p>
              <strong>Date Of Joining:</strong> 01-03-2021
            </p>
          </Card>
        </Col>

        {/* Document Detail */}
        <Col span={12}>
          <Card title="Document Detail" bordered={false}>
            <p>
              <strong>Certificate:</strong>{" "}
              <a href="/path-to-certificate.png" target="_blank" rel="noopener noreferrer">
                certificate.png
              </a>
            </p>
            <p>
              <strong>Photo:</strong> N/A
            </p>
          </Card>
        </Col>

        {/* Bank Account Detail */}
        <Col span={12}>
          <Card title="Bank Account Detail" bordered={false}>
            <p>
              <strong>Account Holder Name:</strong> N/A
            </p>
            <p>
              <strong>Bank Name:</strong> N/A
            </p>
            <p>
              <strong>Branch Location:</strong> N/A
            </p>
            <p>
              <strong>Account Number:</strong> N/A
            </p>
            <p>
              <strong>Bank Identifier Code:</strong> N/A
            </p>
            <p>
              <strong>Tax Payer Id:</strong> N/A
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewJobOnBording;
