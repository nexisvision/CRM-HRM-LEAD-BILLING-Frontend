import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { List, Card, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddTaskcalendar from './AddTaskcalendar';
import EditTaskcalendar from './EditTaskcalendar';

const localizer = momentLocalizer(moment);

const TaskcalendarList = () =>{
 const [taskCalendarSchedules, setTaskCalendarSchedules] = useState([
    {
      id: 1,
      title: 'Highly Competitive Fashion Jobs',
      interviewer: 'Candice',
      date: new Date(2023, 1, 17, 11, 35), // Feb 17, 2023 11:35 AM
    },
    {
      id: 2,
      title: 'Highly Projected Growth for Accounting Jobs',
      interviewer: 'Allegra Dunn',
      date: new Date(2024, 10, 30, 10, 0), // Nov 30, 2024 10:00 AM
    },
  ]);

  const [isAddTaskCalenderModalVisible, setIsAddTaskCalenderModalVisible] = useState(false);
  const [isEditTaskCalenderModalVisible, setIsEditTaskCalenderModalVisible] = useState(false);


  const openAddTaskCalenderModal = () => setIsAddTaskCalenderModalVisible(true);
  const closeAddTaskCalenderModal = () => setIsAddTaskCalenderModalVisible(false);

  const openEditTaskCalenderModal = () => setIsEditTaskCalenderModalVisible(true);
  const closeEditTaskCalenderModal = () => setIsEditTaskCalenderModalVisible(false);

  const addTaskCalender = (newTask) => {
    setTaskCalendarSchedules((prev) => [...prev, newTask]);
    closeAddTaskCalenderModal();
  };

  const editTaskCalender = (newTask) => {
    setTaskCalendarSchedules((prev) => [...prev, newTask]);
    closeAddTaskCalenderModal();
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#34C759',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        padding: '5px',
      },
    };
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Calendar Section */}
      <div style={{ flex: 2 }}>
        <h3>Calendar</h3>
        <Calendar
          localizer={localizer}
          events={taskCalendarSchedules.map((item) => ({
            title: `${item.title} - ${item.interviewer}`,
            start: new Date(item.date),
            end: new Date(item.date),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>

      {/* Schedule List Section */}
      <div style={{ flex: 1 }}>
        <div className='flex justify-end'>
        <Button type="primary" className="mt-2" onClick={openAddTaskCalenderModal}>
          <PlusOutlined /> New
        </Button>
        </div>
        <h3>Schedule List</h3>
        <List
          dataSource={taskCalendarSchedules}
          renderItem={(item) => (
            <Card style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ color: '#34C759', margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '8px 0 4px' }}>{item.interviewer}</p>
                <p style={{ margin: 0 }}>
                  {moment(item.date).format('MMM DD, YYYY hh:mm A')}
                </p>
              </div>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ marginRight: '10px' }}
                  onClick={openEditTaskCalenderModal}
                />
                <Button
                  type="default"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => console.log(`Delete task with ID: ${item.id}`)}
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
        width={1000} 
        // className='mt-[-70px]'
        footer={null}
      >
        <AddTaskcalendar onAddTask={addTaskCalender} />
      </Modal>
      <Modal
        title="Edit Task"
        visible={isEditTaskCalenderModalVisible}
        onCancel={closeEditTaskCalenderModal}
        footer={null}
      >
        <EditTaskcalendar onAddTask={editTaskCalender} />
      </Modal>
    </div>
  );
};

export default TaskcalendarList;

