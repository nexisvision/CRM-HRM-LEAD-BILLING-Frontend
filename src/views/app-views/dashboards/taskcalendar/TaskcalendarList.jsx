import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { List, Card, Button, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";
import AddTaskcalendar from "./AddTaskcalendar";
// import AddTaskcalendar from './AddTaskcalendar';
import EditTaskcalendar from "./EditTaskcalendar";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteTask,
  GetTaskdata,
} from "./TaskCalendarReducer/TaskCalendarSlice";

const localizer = momentLocalizer(moment);

const TaskcalendarList = () => {
  const [taskCalendarSchedules, setTaskCalendarSchedules] = useState([]);
  const dispatch = useDispatch();

  const [idd, setIdd] = useState("");

  const [isAddTaskCalenderModalVisible, setIsAddTaskCalenderModalVisible] =
    useState(false);
  const [isEditTaskCalenderModalVisible, setIsEditTaskCalenderModalVisible] =
    useState(false);

  const openAddTaskCalenderModal = () => setIsAddTaskCalenderModalVisible(true);
  const closeAddTaskCalenderModal = () =>
    setIsAddTaskCalenderModalVisible(false);

  const openEditTaskCalenderModal = () =>
    setIsEditTaskCalenderModalVisible(true);
  const closeEditTaskCalenderModal = () =>
    setIsEditTaskCalenderModalVisible(false);

  const addTaskCalender = (newTask) => {
    setTaskCalendarSchedules((prev) => [...prev, newTask]);
    closeAddTaskCalenderModal();
  };

  const editTaskCalender = (newTask) => {
    setTaskCalendarSchedules((prev) => [...prev, newTask]);
    closeAddTaskCalenderModal();
  };

  const AllTaskData = useSelector((state) => state.TaskCalander);
  const prodata = AllTaskData.TaskCalander.data;

  useEffect(() => {
    dispatch(GetTaskdata());
  }, []);

  useEffect(() => {
    if (
      AllTaskData &&
      AllTaskData.TaskCalander &&
      AllTaskData.TaskCalander.data
    ) {
      setTaskCalendarSchedules(AllTaskData.TaskCalander.data);
    }
  }, [AllTaskData]);

  const deletefnd = async (userId) => {
    try {
      await dispatch(DeleteTask(userId));

      const updatedData = await dispatch(GetTaskdata());

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      // message.error({ content: 'Failed to delete user', duration: 2 });
      console.error("Error deleting user:", error);
    }
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

  const editFun = (id) => {
    openEditTaskCalenderModal();
    setIdd(id);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Calendar Section */}
      <div style={{ flex: 2 }}>
        <h3>Calendar</h3>
        <Calendar
          localizer={localizer}
          events={taskCalendarSchedules.map((item) => ({
            title: `${item.taskName} - ${item.taskDescription}`,
            start: new Date(item.taskTime),
            end: new Date(item.taskDate),
          }))}
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
            onClick={openAddTaskCalenderModal}
          >
            <PlusOutlined /> New
          </Button>
        </div>
        <h3>Schedule List</h3>
        <List
          dataSource={taskCalendarSchedules}
          renderItem={(item) => (
            <Card style={{ marginBottom: "16px" }}>
              <div>
                <h4 style={{ color: "#34C759", margin: 0 }}>{item.taskName}</h4>
                <p style={{ margin: "8px 0 4px" }}>{item.taskDescription}</p>
                <p style={{ margin: 0 }}>
                  {moment(item.taskDate).format("MMM DD, YYYY hh:mm A")}
                </p>
              </div>
              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ marginRight: "10px" }}
                  onClick={() => editFun(item.id)}
                />
                <Button
                  type="default"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => deletefnd(item.id)}
                />
              </div>
            </Card>
          )}
        />
        {/* <Button type="primary" className="mt-2" onClick={openAddTaskCalenderModal}>
          <PlusOutlined /> New
        </Button> */}
      </div>

      {/* <div>
        <Button type="primary" className="mt-2" onClick={openAddTaskCalenderModal}>
          <PlusOutlined /> New
        </Button>
      </div> */}

      {/* Add Interview Modal */}
      <Modal
        title="Add Task"
        visible={isAddTaskCalenderModalVisible}
        onCancel={closeAddTaskCalenderModal}
        // width={1000}
        // className='mt-[-70px]'
        footer={null}
      >
        <AddTaskcalendar
          onAddTask={addTaskCalender}
          onCancel={closeAddTaskCalenderModal}
        />
      </Modal>
      <Modal
        title="Edit Task"
        visible={isEditTaskCalenderModalVisible}
        onCancel={closeEditTaskCalenderModal}
        footer={null}
      >
        <EditTaskcalendar
          onAddTask={editTaskCalender}
          idd={idd}
          onCancel={closeEditTaskCalenderModal}
        />
      </Modal>
    </div>
  );
};

export default TaskcalendarList;
