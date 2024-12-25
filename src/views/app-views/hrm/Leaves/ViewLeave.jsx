import React, { useEffect } from "react";
import { Button, Typography, Row, Col, Divider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetLeave, EditLeaveAction, EditLeave } from "./LeaveReducer/LeaveSlice";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ViewLeave = ({ visible, onClose, editid }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetLeave()); 
  }, [dispatch]);

  const leaveData = useSelector((state) => state.Leave);
  const leaveList = leaveData?.Leave?.data;

  const leave = leaveList?.find((item) => item.id === editid);

  if (!leave) {
    return <Text>No leave data found for the selected ID.</Text>;
  }

  const handleAction = (status) => {
    const payload = { id: editid, values: { status } };
    dispatch(EditLeave(payload))
      .then(() => {
        dispatch(GetLeave());
        message.success(`Leave ${status} successfully!`);
        onClose();
        navigate("/app/hrm/leave");
      })
      .catch((error) => {
        message.error(`Failed to ${status} leave.`);
        console.error("Edit API error:", error);
      });
  };

  return (
    <>
      <hr style={{ marginBottom: "20px", border: "1px solid #e8e8e8" }} />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Text strong>Employee</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.employee}</Text>
        </Col>

        <Col span={8}>
          <Text strong>Leave Type</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.leaveType}</Text>
        </Col>

        <Col span={8}>
          <Text strong>Applied On</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.startDate}</Text>
        </Col>

        <Col span={8}>
          <Text strong>Start Date</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.startDate}</Text>
        </Col>

        <Col span={8}>
          <Text strong>End Date</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.endDate}</Text>
        </Col>

        <Col span={8}>
          <Text strong>Leave Reason</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.reason}</Text>
        </Col>

        <Col span={8}>
          <Text strong>Status</Text>
        </Col>
        <Col span={16}>
          <Text>{leave.status}</Text>
        </Col>
      </Row>

      <Divider />

      <Row justify="end" gutter={16}>
        <Col>
          <Button type="primary" onClick={() => handleAction("approved")}>
            Approve
          </Button>
        </Col>
        <Col>
          <Button type="primary" danger onClick={() => handleAction("rejected")}>
            Reject
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ViewLeave;
