import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Button, Modal, message, Row, Col, Spin, Empty } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsData,
  deleteEventData,
  UpdateEventsetUp,
  getEventById,
} from "./EventSetupService/EventSetupSlice";
import AddEventSetUp from "./AddEventSetup";
import EditEventSetUp from "./EditEventSetup";
import { useParams } from "react-router-dom";

const localizer = momentLocalizer(moment);

const EventSetupList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [idd, setIdd] = useState("");

  const tabledata = useSelector((state) => state.EventSetup);

  console.log("ibu", tabledata);

  const handleAddEvent = () => {
    setIsAddModalVisible(true);
  };

  const handleEditEvent = async (id) => {
    setIdd(id);
    setIsEditModalVisible(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await dispatch(deleteEventData(id)).unwrap();
      message.success("Event deleted successfully");
      fetchEventsData();
    } catch (error) {
      message.error(error || "Failed to delete event");
    }
  };

  const handleModalClose = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setSelectedEvent();
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "skyblue",
        color: "white",
        borderRadius: "5px",
        border: "none",
        padding: "5px",
      },
    };
  };

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata?.events) {
      console.log("Fetched Events:", tabledata?.events);
      setEvents(tabledata?.events);
    }
  }, [tabledata]);

  // Event Card Component
  const EventCard = ({ event }) => (
    <Card className="mb-4" style={{ borderRadius: "8px" }}>
      <div className="flex justify-between">
        <div>
          <h3 style={{ margin: 0, color: "#1890ff" }}>{event.EventTitle}</h3>
          <div className="mt-2">
            <p className="mb-1">
              <UserOutlined className="mr-2" />
              {event.EventManager}
            </p>
            <p className="mb-1">
              <CalendarOutlined className="mr-2" />
              {moment(event.EventDate).format("MMMM DD, YYYY")}
            </p>
            <p className="mb-0">
              <ClockCircleOutlined className="mr-2" />
              {moment(event.EventTime, "HH:mm:ss A").format("hh:mm:ss A")}
            </p>
          </div>
        </div>
        <div>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditEvent(event.id)}
            className="mr-2"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEvent(event.id)}
          />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>
          Add Event
        </Button>
      </div>
      <Row gutter={16}>
        {/* Calendar Section */}
        <Col xs={24} xl={15}>
          <Card>
            <Calendar
              localizer={localizer}
              events={events?.map((event) => {
                const startDate = new Date(
                  `${event?.EventDate}T${event?.EventTime}`
                );
                const endDate = new Date(startDate);
                endDate.setHours(startDate.getHours() + 1); // Assuming events are 1 hour long
                return {
                  title: event?.EventTitle, // Event title
                  start: startDate, // Start date-time
                  end: endDate, // End date-time
                };
              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              eventPropGetter={eventStyleGetter}
            />
          </Card>
        </Col>

        {/* Events List Section */}
        <Col xs={24} xl={9}>
          <Card>
            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
              {loading ? (
                <div className="text-center py-4">
                  <Spin />
                </div>
              ) : events?.length === 0 ? (
                <Empty description="No events found" />
              ) : (
                events?.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Add Event Modal */}
      <Modal
        title="Add New Event"
        open={isAddModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <AddEventSetUp
          onSuccess={() => {
            handleModalClose();
          }}
        />
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        title="Edit Event"
        open={isEditModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <EditEventSetUp
          id={idd}
          initialData={selectedEvent}
          onSuccess={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default EventSetupList;
