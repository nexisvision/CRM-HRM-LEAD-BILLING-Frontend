import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { List, Card, Button, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddInterview from "./AddInterview";
import EditInterview from "./EditInterview";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteInterview,
  getInterview,
} from "./interviewReducer/interviewSlice";
import { FaNapster } from "react-icons/fa";

const localizer = momentLocalizer(moment);

const InterviewList = () => {
  const dispatch = useDispatch();
  const [interviewSchedules, setInterviewSchedules] = useState([
    // {
    //   id: 1,
    //   title: "static data",
    //   interviewer: "Candice",
    //   date: new Date(2023, 1, 17, 11, 35),
    // },
  ]);

  const [idd, setIdd] = useState("");

  const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] =
    useState(false);
  const [isEditInterviewModalVisible, setIsEditInterviewModalVisible] =
    useState(false);

  const openAddInterviewModal = () => setIsAddInterviewModalVisible(true);
  const closeAddInterviewModal = () => setIsAddInterviewModalVisible(false);

  const openEditInterviewModal = () => setIsEditInterviewModalVisible(true);
  const closeEditInterviewModal = () => setIsEditInterviewModalVisible(false);

  const alldata = useSelector((state) => state.Interviews);
  const fnddtaa = alldata.Interviews.data;

  useEffect(() => {
    dispatch(getInterview());
  }, []);

  useEffect(() => {
    if (fnddtaa) {
      setInterviewSchedules(fnddtaa);
    }
  }, [fnddtaa]);

  const addInterview = (newInterview) => {
    setInterviewSchedules((prev) => [...prev, newInterview]);
    closeAddInterviewModal();
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "#34C759",
        color: "white",
        borderRadius: "5px",
        border: "none",
        padding: "5px",
      },
    };
  };

  const delefun = (userId) => {
    dispatch(DeleteInterview(userId)).then(() => {
      dispatch(getInterview());
      setInterviewSchedules(
        interviewSchedules &&
          interviewSchedules?.find((item) => item?.id !== userId)
      );
      message.success("Interview deleted successfully");
    });
  };

  const editfun = (idd) => {
    openEditInterviewModal();
    setIdd(idd);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Calendar Section */}
      <div style={{ flex: 2 }}>
        <h3 className="text-lg font-bold mb-4">Calendar</h3>
        <Calendar
          localizer={localizer}
          events={
            interviewSchedules &&
            interviewSchedules?.map((item) => ({
              title: `${item?.title} - ${item?.interviewer}`,
              start: new Date(item?.date),
              end: new Date(item?.date),
            }))
          }
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          defaultView="month"
        />
      </div>

      {/* Schedule List Section */}
      <div style={{ flex: 1 }}>
        <div className="flex justify-end">
          <Button
            type="primary"
            className="mt-2"
            onClick={openAddInterviewModal}
          >
            <PlusOutlined /> New
          </Button>
        </div>
        <h3 className="text-lg font-bold mb-4">Schedule List</h3>
        <List
          dataSource={interviewSchedules}
          renderItem={(item) => (
            <Card style={{ marginBottom: "16px" }}>
              <div>
                <h4 style={{ color: "#34C759", margin: 0 }}>{item.title}</h4>
                <p style={{ margin: "8px 0 4px" }}>{item.interviewer}</p>
                <p style={{ margin: 0 }}>
                  {moment(item.date).format("MMM DD, YYYY hh:mm A")}
                </p>
              </div>
              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ marginRight: "10px" }}
                  onClick={() => editfun(item.id)}
                />
                <Button
                  type="default"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => delefun(item.id)}
                />
              </div>
            </Card>
          )}
        />
        {/* <Button type="primary" className="mt-2" onClick={openAddInterviewModal}>
          <PlusOutlined /> New
        </Button> */}
      </div>

      {/* Add Interview Modal */}
      <Modal
        title="Add Interview"
        visible={isAddInterviewModalVisible}
        onCancel={closeAddInterviewModal}
        footer={null}
        width={1000}
      >
        <AddInterview onAddInterview={addInterview} />
      </Modal>
      <Modal
        title="Edit Interview"
        visible={isEditInterviewModalVisible}
        onCancel={closeEditInterviewModal}
        footer={null}
        width={1000}
      >
        <EditInterview
          onEditInterview={EditInterview}
          idd={idd}
          onClose={closeEditInterviewModal}
        />
      </Modal>
    </div>
  );
};

export default InterviewList;
