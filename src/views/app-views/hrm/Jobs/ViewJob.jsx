import React from "react";
import { Row, Col, Button, Tag, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const ViewJob = () => {
  const jobData = {
    jobTitle: "The Great Versatility of Business Jobs",
    branch: "China",
    category: "Business Jobs",
    positions: 10,
    status: "Active",
    createdDate: "21-07-2021",
    startDate: "28-02-2023",
    endDate: "28-01-2034",
    skills: ["Marketing", "Sales", "Management", "Mechanical", "Accounting"],
    needToAsk: ["Gender", "DOB", "Country"],
    description: `
      1. To handle Materials Department.
      2. Excellent knowledge of Materials management, JIT and Quality.
      3. Knowledge of mechanical sheet metal parts, transformers, electronic components & switchgear.
      4. Must know MRP I and II, Vendor development activity.
      5. Comparison chart for price/MIS/Report preparation capabilities in Excel/Word.
      6. Coordinate with stores & production for time-bound materials management.
      7. Must be willing to work efficiently and effectively.
      8. Must have good communication skills.
      9. Can handle a team of 10 members minimum.
    `,
    jobType: "Full-time",
    salary: "₹75,000.00 - ₹1,15,000.00 per month",
    benefits: [
      "Cell phone reimbursement",
      "Health insurance",
      "Internet reimbursement",
      "Paid sick time",
      "Paid time off",
    ],
    supplementalPay: ["Performance bonus", "Yearly bonus"],
    covidConsiderations: ["We are providing Covid-19 insurance"],
    precautions: [
      "Temperature screenings",
      "Social distancing guidelines in place",
      "Virtual meetings",
    ],
    jobRequirement: `
      Looking for business jobs has never been easier. Business encompasses a wide range of career options. 
      Whether you are looking for an entry-level position as a receptionist or clerk or seeking a top-level profession as a corporate executive, 
      we have jobs available right now.
    `,
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#f9f9f9" }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Row gutter={16}>
          <Col span={24}>
            <h1 className="text-lg font-semibold">Job Details</h1>


          </Col>
          <Col span={12}>
            <Text strong>Job Title:</Text> <Text>{jobData.jobTitle}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Branch:</Text> <Text>{jobData.branch}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Job Category:</Text> <Text>{jobData.category}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Positions:</Text> <Text>{jobData.positions}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Status:</Text> <Tag color="green">{jobData.status}</Tag>
          </Col>
          <Col span={12}>
            <Text strong>Created Date:</Text> <Text>{jobData.createdDate}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Start Date:</Text> <Text>{jobData.startDate}</Text>
          </Col>
          <Col span={12}>
            <Text strong>End Date:</Text> <Text>{jobData.endDate}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Skills:</Text>
            <div>
              {jobData.skills.map((skill, index) => (
                <Tag color="blue" key={index}>
                  {skill}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Title level={5}>Need to Ask?</Title>
            <ul>
              {jobData.needToAsk.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Col>
          <Col span={12}>
            <Title level={5}>Need to Show Option?</Title>
            <ul>
              <li>Profile</li>
              <li>Resume</li>
              <li>Letter</li>
              <li>Terms</li>
            </ul>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col span={24}>
            <Title level={5}>Job Description</Title>
            <Text>{jobData.description}</Text>
          </Col>
          <Col span={24}>
            <Title level={5}>Job Requirement</Title>
            <Text>{jobData.jobRequirement}</Text>
          </Col>
        </Row>

        <Divider />

        {/* <Row justify="end">
          <Col>
            <Button type="primary" style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}>
              Approve
            </Button>
          </Col>
          <Col>
            <Button type="primary" danger style={{ marginLeft: 10 }}>
              Reject
            </Button>
          </Col>
        </Row> */}
      </div>
    </div>
  );
};

export default ViewJob;
