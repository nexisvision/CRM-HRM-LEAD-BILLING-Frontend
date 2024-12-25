import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { List, Card, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import AddEventSetUp from './AddEventSetUp';


import AddEventSetUp from './AddEventSetup';
import EditEventSetUp from './EditEventSetup';
const localizer = momentLocalizer(moment);

const EventSetupList = () =>{
 const [eventSchedules, setEventSchedules] = useState([
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

  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);

  const openAddEventModal = () => setIsAddEventModalVisible(true);
  const closeAddEventModal = () => setIsAddEventModalVisible(false);

  const openEditEventModal = () => setIsEditEventModalVisible(true);
  const closeEditEventModal = () => setIsEditEventModalVisible(false);

  const addEventsetup = (newEvent) => {
    setEventSchedules((prev) => [...prev, newEvent]);
    closeAddEventModal();
  };

  const editEventsetup = (newEvent) => {
    setEventSchedules((prev) => [...prev, newEvent]);
    closeEditEventModal();
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
        <h3 className='text-lg font-bold mb-3'>Calendar</h3>
        <Calendar
          localizer={localizer}
          events={eventSchedules.map((item) => ({
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
        <Button type="primary" className="mt-2" onClick={openAddEventModal}>
          <PlusOutlined /> New
        </Button>
        </div>
        <h3 className='text-lg font-semibold mb-3'>Schedule List</h3>
        <List
          dataSource={eventSchedules}
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
                  onClick={openEditEventModal}
                />
                <Button
                  type="default"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => console.log(`Delete event with ID: ${item.id}`)}
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
        title="Add Event"
        visible={isAddEventModalVisible}
        onCancel={closeAddEventModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddEventSetUp onAddTask={addEventsetup} />
      </Modal>
      <Modal
        title="Edit Event"
        visible={isEditEventModalVisible}
        onCancel={closeEditEventModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <EditEventSetUp onAddTask={editEventsetup} />
      </Modal>
    </div>
  );
};

export default EventSetupList;

