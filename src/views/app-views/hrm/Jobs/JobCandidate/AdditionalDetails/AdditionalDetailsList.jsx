import React, { useState } from "react";
import { Button, Input, Form, Modal, Typography, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AddInterviewSchedule from "./AddInterviewSchedule";

const { Title } = Typography;

const { TextArea } = Input;

const AdditionalDetailsList = () => {

  const [isAddJobModalVisible, setIsAddJobModalVisible] = useState(false);

  const closeAddJobModal = () => {
    setIsAddJobModalVisible(false);
  };

  const handleAddSkills = () => {
  };

  const handleAddNotes = () => {
  };
  const handleDelete = () => {
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}>

      <Row justify="space-between" align="middle">
        <Col>
          <Title level={4}>Additional Details</Title>
        </Col>
        <Col>
          <Button type="primary">
            <PlusOutlined />
            Create Interview Schedule
          </Button>
        </Col>
      </Row>



      <Form layout="vertical">
        <Form.Item className="text-sm font-semibold" label="What Do You Consider to Be Your Weaknesses?">
          <p>CandiceCandiceCandiceCandiceCandice</p>
        </Form.Item>
        <Form.Item className="text-sm font-semibold" label="Why Do You Want This Job?">
          <p>CandiceCandiceCandiceCandiceCandice</p>
        </Form.Item>
        <Form.Item className="text-sm font-semibold" label="Why Do You Want to Work at This Company?">
          <p>CandiceCandiceCandiceCandiceCandice</p>
        </Form.Item>
        <Form.Item className="text-sm font-semibold" label="Skills">
          <Input placeholder="Marketing,Sales" />
          <Button type="primary" style={{ marginTop: "10px" }} onClick={handleAddSkills}>
            Add Skills
          </Button>
        </Form.Item>
        <Form.Item className="text-sm font-semibold" label="Applicant Notes">
          <TextArea placeholder="Type here..." rows={4} />
          <Button type="primary" style={{ marginTop: "10px" }} onClick={handleAddNotes}>
            Add Notes
          </Button>
        </Form.Item>
      </Form>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
        <div>
          <p className="font-semibold text-sm">Workdo</p>
          <p>Test</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <p>24-05-2022</p>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          />
        </div>
      </div>
      <Modal
        title="Create Interview Schedule"
        visible={isAddJobModalVisible}
        onCancel={closeAddJobModal}
        footer={null}
        width={1100}
        className='mt-[-70px]'
      // height={1000}
      >
        <AddInterviewSchedule onClose={closeAddJobModal} />
      </Modal>
    </div>
  );
};

export default AdditionalDetailsList;
