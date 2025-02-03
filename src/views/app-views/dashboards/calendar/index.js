import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addcalends, getcalends, deletecalends } from './calanderReducer/calanderSlice';
import moment from 'moment';

const { Option } = Select;

const badgeColors = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
];

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
    console.log('Selected date:', date.format('YYYY-MM-DD')); // Debugging
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
                                    console.log('Parsed Permissions:', allpermisson);
                                  
                                  } else {
                                    console.log('extra-hrm-trainingSetup is not available');
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
                                                                                 <Calendar cellRender={cellRender} onSelect={handleDateSelect} />
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
                                                                                                                                                <Form form={form} layout="vertical" name="new-event" preserve={false} onFinish={onAddEvent}>
                                                                                                                                                  <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter event title' }]} >
                                                                                                                                                    <Input autoComplete="off" />
                                                                                                                                                  </Form.Item>
                                                                                                                                                  <Row gutter={16}>
                                                                                                                                                    <Col span={12}>
                                                                                                                                                      <Form.Item name="start" label="Start" rules={[{ required: true, message: 'Please select start time' }]}>
                                                                                                                                                        <TimePicker className="w-100" />
                                                                                                                                                      </Form.Item>
                                                                                                                                                    </Col>
                                                                                                                                                    <Col span={12}>
                                                                                                                                                      <Form.Item name="end" label="End" rules={[{ required: true, message: 'Please select end time' }]}>
                                                                                                                                                        <TimePicker className="w-100" />
                                                                                                                                                      </Form.Item>
                                                                                                                                                    </Col>
                                                                                                                                                  </Row>
                                                                                                                                                  <Form.Item name="bullet" label="Label" initialValue={badgeColors[0]}>
                                                                                                                                                    <Select>
                                                                                                                                                      {badgeColors.map((elm) => (
                                                                                                                                                        <Option value={elm} key={elm}>
                                                                                                                                                          <Badge color={elm} />
                                                                                                                                                          <span className="text-capitalize font-weight-semibold">{elm}</span>
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

export default CalendarApp;