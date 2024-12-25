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
            <hr style={{ marginBottom: '20px', border: '1px solid #e8e8e8' }} />

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












// import React from "react";
// import { Row, Col, Typography, Tag, Divider } from "antd";

// const { Title, Text, Paragraph } = Typography;

// const ViewJob = ({ jobData }) => {
//   // Default job data for testing (can be replaced by props or API response)
//   const defaultJobData = {
//     title: "The Great Versatility of Business Jobs",
//     branch: "China",
//     category: "Business Jobs",
//     positions: 10,
//     status: "Active",
//     createdDate: "21-07-2021",
//     startDate: "28-02-2023",
//     endDate: "28-01-2034",
//     skills: ["Marketing", "Sales", "Management", "Mechanical", "Accounting"],
//     needToAsk: ["Gender", "DOB", "Country"],
//     needToShowOptions: ["Profile", "Resume", "Letter", "Terms"],
//     description: `
//       1. To handle Materials Department.
//       2. Excellent knowledge of Materials management, JIT and Quality.
//       3. Knowledge of mechanical sheet metal parts, transformers, electronic components & switchgear.
//       4. Must know MRP I and II, Vendor development activity.
//       5. Comparison chart for price/MIS/Report preparation capabilities in Excel/Word.
//       6. Coordinate with stores & production for time-bound materials management.
//       7. Must be willing to work efficiently, effectively and committed to finish tasks with the highest integrity.
//       8. Must have good communication skills.
//       9. Can handle a team of 10 members minimum.
//     `,
//     jobType: "Full-time",
//     salary: "₹75,000.00 - ₹1,15,000.00 per month",
//     benefits: [
//       "Cell phone reimbursement",
//       "Health insurance",
//       "Internet reimbursement",
//       "Paid sick time",
//       "Paid time off",
//     ],
//     schedule: "Day shift",
//     supplementalPay: ["Performance bonus", "Yearly bonus"],
//     covidConsiderations: ["We are providing Covid-19 insurance"],
//     experience: [
//       "Work: 1 year (Preferred)",
//       "Total work: 1 year (Preferred)",
//       "Purchasing: 1 year (Preferred)",
//     ],
//     education: ["Secondary (10th Pass) (Preferred)"],
//     industry: "Electrical Engineering",
//     precautions: [
//       "Temperature screenings",
//       "Social distancing guidelines in place",
//       "Virtual meetings",
//     ],
//     jobRequirement: `
//       Looking for business jobs has never been easier. Business encompasses a wide range of career options. 
//       Whether you are looking for an entry-level position as a receptionist or clerk or seeking a top-level profession as a corporate executive, 
//       we have jobs available right now.
//     `,
//   };

//   const data = jobData || defaultJobData;

//   return (
//     <div style={{ padding: "20px", background: "#fff" }}>
//       <Row gutter={16}>
//         <Col span={8}>
//           <Title level={5}>Job Title</Title>
//           <Text>{data.title}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Branch</Title>
//           <Text>{data.branch}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Job Category</Title>
//           <Text>{data.category}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Positions</Title>
//           <Text>{data.positions}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Status</Title>
//           <Tag color={data.status === "Active" ? "green" : "red"}>
//             {data.status}
//           </Tag>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Created Date</Title>
//           <Text>{data.createdDate}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>Start Date</Title>
//           <Text>{data.startDate}</Text>
//         </Col>
//         <Col span={8}>
//           <Title level={5}>End Date</Title>
//           <Text>{data.endDate}</Text>
//         </Col>
//         <Col span={24}>
//           <Title level={5}>Skill</Title>
//           {data.skills.map((skill, index) => (
//             <Tag color="blue" key={index}>
//               {skill}
//             </Tag>
//           ))}
//         </Col>
//       </Row>

//       <Divider />

//       <Row>
//         <Col span={12}>
//           <Title level={5}>Need to Ask?</Title>
//           <ul>
//             {data.needToAsk.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//         </Col>
//         <Col span={12}>
//           <Title level={5}>Need to Show Option?</Title>
//           <ul>
//             {data.needToShowOptions.map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>
//         </Col>
//       </Row>

//       <Divider />

//       <Title level={5}>Job Description</Title>
//       <Paragraph>{data.description}</Paragraph>

//       <Title level={5}>Job Type</Title>
//       <Text>{data.jobType}</Text>

//       <Title level={5}>Salary</Title>
//       <Text>{data.salary}</Text>

//       <Title level={5}>Benefits</Title>
//       <ul>
//         {data.benefits.map((benefit, index) => (
//           <li key={index}>{benefit}</li>
//         ))}
//       </ul>

//       <Title level={5}>Schedule</Title>
//       <Text>{data.schedule}</Text>

//       <Title level={5}>Supplemental Pay</Title>
//       <ul>
//         {data.supplementalPay.map((pay, index) => (
//           <li key={index}>{pay}</li>
//         ))}
//       </ul>

//       <Title level={5}>COVID-19 Considerations</Title>
//       <ul>
//         {data.covidConsiderations.map((consideration, index) => (
//           <li key={index}>{consideration}</li>
//         ))}
//       </ul>

//       <Title level={5}>Experience</Title>
//       <ul>
//         {data.experience.map((exp, index) => (
//           <li key={index}>{exp}</li>
//         ))}
//       </ul>

//       <Title level={5}>Education</Title>
//       <ul>
//         {data.education.map((edu, index) => (
//           <li key={index}>{edu}</li>
//         ))}
//       </ul>

//       <Title level={5}>Industry</Title>
//       <Text>{data.industry}</Text>

//       <Title level={5}>COVID-19 Precautions</Title>
//       <ul>
//         {data.precautions.map((precaution, index) => (
//           <li key={index}>{precaution}</li>
//         ))}
//       </ul>

//       <Title level={5}>Job Requirement</Title>
//       <Paragraph>{data.jobRequirement}</Paragraph>
//     </div>
//   );
// };

// export default ViewJob;
