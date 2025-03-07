import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addcalends, getcalends, deletecalends } from './calanderReducer/calanderSlice';
import moment from 'moment';

const { Option } = Select;

const badgeColors = [
  'pink', 'red', 'orange',  'green'
];

const CustomCalendar = ({ eventData, onDeleteEvent, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(moment());

  // Generate calendar data
  const generateCalendarDays = () => {
    const firstDay = moment(currentDate).startOf('month');
    const lastDay = moment(currentDate).endOf('month');
    const startDate = moment(firstDay).startOf('week');
    const endDate = moment(lastDay).endOf('week');
    const calendar = [];
    let week = [];
    
    for (let day = moment(startDate); day.isSameOrBefore(endDate); day.add(1, 'day')) {
      week.push({
        date: moment(day),
        isCurrentMonth: day.month() === currentDate.month(),
        events: eventData.filter(event =>
          moment(event.startDate).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
        )
      });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    return calendar;
  };

  const formatEventTime = (time) => {
    return moment(time).format('hh:mm A');
  };

  const renderEventBadge = (event) => {
    const timeStr = formatEventTime(event.startDate);
    return (
      <Tooltip 
        title={
          <div>
            <div><strong>{event.name}</strong></div>
            <div>Start: {moment(event.startDate).format('hh:mm A')}</div>
            <div>End: {moment(event.endDate).format('hh:mm A')}</div>
          </div>
        }
      >
        <div 
          key={event.id} 
          className="event-badge" 
          style={{ 
            backgroundColor: event.color,
            color: 'white',
            height: '24px'
          }}
        >
          {`${timeStr} ${event.name}`}
          <Tooltip title="Delete">
            <DeleteOutlined
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEvent(event.id);
              }}
              className="delete-icon"
            />
          </Tooltip>
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <Button 
          onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}
        >
          Previous
        </Button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <Button 
          onClick={() => setCurrentDate(moment(currentDate).add(1, 'month'))}
        >
          Next
        </Button>
      </div>
      <table className="calendar-table">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generateCalendarDays().map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`calendar-cell ${!day.isCurrentMonth ? 'other-month' : ''}`}
                  onClick={() => onDateSelect(day.date)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="date-number">{day.date.date()}</div>
                  <div className="event-list">
                    {day.events.map(event => renderEventBadge(event))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CalendarApp = () => {
  const dispatch = useDispatch();
  const allclanderdata = useSelector((state) => state.calendar);
  const fndata = allclanderdata?.calendar?.data || [];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getcalends());
  }, [dispatch]);

  const onDeleteEvent = async (eventId) => {
    try {
      await dispatch(deletecalends(eventId));
      await dispatch(getcalends());
      message.success('Event deleted successfully');
    } catch (error) {
      message.error('Failed to delete event');
      console.error('Delete error:', error);
    }
  };

  const onAddEvent = async (values) => {
    try {
      if (!selectedDate) {
        message.error('Please select a date first');
        return;
      }
      const eventData = {
        name: values.title,
        color: values.bullet,
        startDate: moment(selectedDate).set({ hour: values.start.hour(), minute: values.start.minute() }).toISOString(),
        endDate: moment(selectedDate).set({ hour: values.end.hour(), minute: values.end.minute() }).toISOString(),
      };

      await dispatch(addcalends(eventData));
      await dispatch(getcalends());
      setModalVisible(false);
      form.resetFields();
      message.success('Event added successfully');
    } catch (error) {
      message.error('Failed to add event');
      console.error('Add event error:', error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
  };

  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-trainingSetup"] && parsedPermissions["extra-hrm-trainingSetup"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-trainingSetup"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  const cellRender = (value) => {
    const currentDate = value.format('YYYY-MM-DD');

    // Filter events for the selected day
    const listData = fndata.filter((event) => {
      const eventStart = moment(event.startDate);
      return eventStart.format('YYYY-MM-DD') === currentDate;
    });

    // If no events for this date, return null
    if (listData.length === 0) return null;

    return (
      <div style={{ position: 'absolute', bottom: '4px', left: 0, right: 0, padding: '2px', overflow: 'hidden' }}>
        {listData.map((item) => (
          <Tooltip key={item.id} title={item.name}>
            <div
              style={{
                backgroundColor: item.color,
                height: '6px',
                marginBottom: '2px',
                borderRadius: '2px',
                width: '100%',
              }}
            />
          </Tooltip>
        ))}
      </div>
    );
  };

  // Add this function to handle start time changes
  const handleStartTimeChange = (time) => {
    form.setFieldsValue({ end: null }); // Reset end time when start time changes
    form.validateFields(['end']); // Revalidate end time
  };

  return (
    <div className="calendar-container">
      
      <Row gutter={16}>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Card className="sidebar-card">
            {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
              <div className="sidebar-events">

                <h4 className="mb-3">Upcoming Events</h4>
                {fndata.length === 0 ? (
                  <div className="text-muted">No events scheduled</div>
                ) : (
                  fndata.map((event) => (
                    <div key={event.id} className="event-card-wrapper">
                      <div className="event-card mb-3" style={{ borderLeft: `4px solid ${event.color}`, paddingLeft: '12px' }}>
                        <h5 className="event-card-title">{event.name}</h5>
                        <div className="event-card-time">
                          <div>{moment(event.startDate).format('MMM DD, YYYY')}</div>
                          <div className="text-muted">
                            {moment(event.startDate).format('HH:mm')} - {moment(event.endDate).format('HH:mm')}
                          </div>
                        </div>
                        <div className="event-card-actions">


                          {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                            <Tooltip title="Delete event">
                              <DeleteOutlined onClick={() => onDeleteEvent(event.id)} className="delete-icon" />
                            </Tooltip>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}

          </Card>
        </Col>
        <Col xs={24} sm={24} md={16} lg={18}>
          {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Card className="mb-4">
              <CustomCalendar
                eventData={fndata}
                onDeleteEvent={onDeleteEvent}
                onDateSelect={handleDateSelect}
              />
            </Card>
          ) : null}

        </Col>
      </Row>

      {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Modal
          title="New Event"
          open={modalVisible}
          footer={null}
          destroyOnClose={true}
          onCancel={() => setModalVisible(false)}
        >
          <h2 className="mb-4 border-b pb-2 font-medium"></h2>
          <Form form={form} layout="vertical" name="new-event" preserve={false} onFinish={onAddEvent}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter event title' }]} >
              <Input autoComplete="off" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="start" label="Start" rules={[{ required: true, message: 'Please select start time' }]}>
                  <TimePicker 
                    className="w-100" 
                    onChange={handleStartTimeChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  name="end" 
                  label="End" 
                  rules={[
                    { required: true, message: 'Please select end time' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const startTime = getFieldValue('start');
                        if (!value || !startTime || value.isAfter(startTime)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('End time must be after start time'));
                      },
                    }),
                  ]}
                >
                  <TimePicker 
                    className="w-100"
                    disabledTime={() => {
                      const startTime = form.getFieldValue('start');
                      if (!startTime) return {};
                      
                      return {
                        disabledHours: () => {
                          const hours = [];
                          for (let i = 0; i < startTime.hour(); i++) {
                            hours.push(i);
                          }
                          return hours;
                        },
                        disabledMinutes: (selectedHour) => {
                          const minutes = [];
                          if (selectedHour === startTime.hour()) {
                            for (let i = 0; i < startTime.minute(); i++) {
                              minutes.push(i);
                            }
                          }
                          return minutes;
                        }
                      };
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="bullet" label="Label" initialValue={badgeColors[0]}>
              <Select>
                {badgeColors.map((elm) => (
                  <Option value={elm} key={elm}>
                  <div className="flex items-center gap-2">
                  <Badge color={elm} />
                  <span className="text-capitalize font-weight-semibold">{elm}</span>
                </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className="text-right mb-0">
              <Button type="primary" htmlType="submit">
                Add Event
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}

    </div>
  );
};

// Update the styles section with these new styles
const styles = `
  .custom-calendar {
    width: 100%;
    background: white;
    border-radius: 8px;
    padding: 20px;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 16px;
  }

  .calendar-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }

  .calendar-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 1px;
  }

  .calendar-table th {
    padding: 12px 8px;
    text-align: center;
    color: #666;
    font-weight: 500;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
  }

  .calendar-cell {
    padding: 8px;
    border: 1px solid #f0f0f0;
    vertical-align: top;
    height: 130px;
    background: white;
  }

  .other-month {
    background-color: #fafafa;
  }

  .date-number {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
  }

  .other-month .date-number {
    color: #999;
  }

  .event-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .event-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: all 0.3s;
  }

  .event-badge:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .delete-icon {
    color: white;
    margin-left: 8px;
    cursor: pointer;
    font-size: 12px;
  }

  .delete-icon:hover {
    opacity: 0.8;
  }

  // Styles for the navigation buttons
  .calendar-header .ant-btn {
    border: 1px solid #d9d9d9;
    background: white;
    font-size: 14px;
    height: 32px;
    padding: 4px 15px;
    border-radius: 6px;
  }

  .calendar-header .ant-btn:hover {
    border-color: #40a9ff;
    color: #40a9ff;
  }

  // Add styles for the tooltip content
  .ant-tooltip-inner {
    min-width: 200px;
    padding: 8px 12px;
  }

  .ant-tooltip-inner strong {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
  }

  .ant-tooltip-inner div {
    margin-bottom: 2px;
    font-size: 12px;
  }
`;

const CalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <CalendarApp />
  </>
);

export default CalendarAppWithStyles;