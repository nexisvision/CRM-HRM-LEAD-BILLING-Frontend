import React, { useState } from "react";
import { Card, Button, Row, Col,Modal, Typography } from "antd";
import { DownloadOutlined, StarFilled,PlusOutlined } from "@ant-design/icons";
import AddJobOnBoard from "./AddJobOnBoard";

const { Title, Text } = Typography;


const BasicInfoList = () => {

    const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);


  const openAddJobOnBoard = () => {
    setIsAddJobModalVisible(true);
  };

  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };

  return (
    <div>
 <Row justify="space-between" align="middle">
          <Col>
            <Title level={4}>Basic Information</Title>
          </Col>
          <Col>
            <Button type="primary">
            <PlusOutlined />
            Add to Job OnBoard          
            </Button>
          </Col>
        </Row>
{/* <h1 className="text-lg font-bold mb-3">Basic Info</h1>
    <Button type="primary" style={{ backgroundColor: "#66dd66", borderColor: "#66dd66" }} onClick={openAddJobOnBoard}>
    
  </Button> */}
      <hr style={{ marginBottom: '10px', marginTop: '10px', border: '1px solid #e8e8e8' }} />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <p className="mb-2"><strong>Phone:</strong> 1457896589</p>
          <p className="mb-2"><strong>DOB:</strong> 30-11-0001</p>
          <p className="mb-2"><strong>Gender:</strong> Male</p>
          <p className="mb-2"><strong>Country:</strong> China</p>
          <p className="mb-2"><strong>State:</strong> GUJARAT</p>
          <p className="mb-2"><strong>City:</strong> Borivali</p>
          <p className="mb-2"><strong>Applied For:</strong> Highly Competitive Fashion Jobs</p>
          <p className="mb-2"><strong>Applied at:</strong> 21-07-2021</p>
          <p>
            <strong>CV / Resume:</strong>{" "}
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              style={{ backgroundColor: "#66dd66", borderColor: "#66dd66" }}
            />
          </p>
          <p><strong>Cover Letter:</strong> Candice</p>
          <p>
            <strong>Rating:</strong>{" "}
            <StarFilled style={{ color: "#fadb14" }} />
            <StarFilled style={{ color: "#fadb14" }} />
            <StarFilled style={{ color: "#fadb14" }} />
            <StarFilled style={{ color: "#d9d9d9" }} />
            <StarFilled style={{ color: "#d9d9d9" }} />
          </p>
        </Col>
      </Row>

      <Modal
        title="Add to Job OnBoard"
        visible={isAddJobModalVisible}
        onCancel={closeAddJobModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
        // height={1000}
      >
        <AddJobOnBoard onClose={closeAddJobModal} />
      </Modal>

    </div>
  );
};

export default BasicInfoList;
