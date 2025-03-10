import React from "react";
import { Row, Col, Button, Card } from "antd";
// import JobOnBoarding from "./JobOnBoarding";
import BasicInfo from "./BasicInfo/index";
import AdditionalDetails from "./AdditionalDetails/index";
import JobCandidateDetails from "./JobCandidateDetails/index";

const ViewJobApplication = () => {
  return (
    <div style={{ margin: "-22px", padding: "12px", background: "#f5f5f5" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="text-lg font-bold mb-3">Job Application Details</h2>
          </div>
        </Col>

        <Col span={12}>
            <JobCandidateDetails />
        </Col>
        <Col span={12}>
          <Card>
            <BasicInfo />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <AdditionalDetails />
          </Card>
        </Col>

       
      </Row>
    </div>
  );
};

export default ViewJobApplication;
