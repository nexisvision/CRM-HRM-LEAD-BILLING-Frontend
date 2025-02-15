import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskdata, DeleteTask, AddTask } from './TaskCalendarReducer/TaskCalendarSlice';
import moment from 'moment';
import AddTaskcalendar from './AddTaskcalendar';

const { Option } = Select;

const badgeColors = [
  'pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
];

const initialFormValues = {
  title: '',
  start: moment('00:00:00', 'HH:mm:ss'),
  end: moment('00:00:00', 'HH:mm:ss'),
  bullet: badgeColors[0],
  taskDescription: ""
};

const TaskCard = ({ task }) => (
  <div className="task-card mb-3" style={{ borderLeft: `4px solid ${task.color}` }}>
    <h5 className="task-card-title">{task.taskName}</h5>
    <div className="task-card-time">
      <div>{moment(task.taskDate).format('MMM DD, YYYY')}</div>
      <div className="text-muted">
        {moment(task.taskTime).format('HH:mm')} - {moment(task.taskDate).format('HH:mm')}
      </div>
    </div>
  </div>
);

const SidebarTasks = ({ tasks, onDeleteTask }) => {
  const sortedTasks = Array.isArray(tasks)
    ? [...tasks].sort((a, b) => moment(a.taskDate).valueOf() - moment(b.taskDate).valueOf())
    : [];

  // console.log("Sorted Tasks: ", sortedTasks);

  const handleDelete = (task) => {
    Modal.confirm({
      title: 'Delete Task',
      content: `Are you sure you want to delete "${task.name}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDeleteTask(task.id);
      },
    });
  };

  const dispatch = useDispatch();

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

  if (parsedPermissions["dashboards-TaskCalendar"] && parsedPermissions["dashboards-TaskCalendar"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-TaskCalendar"][0].permissions;
    console.log('Parsed Permissions:', allpermisson);

  } else {
    console.log('dashboards-TaskCalendar is not available');
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission



  useEffect(() => {
    dispatch(GetTaskdata());
  }, []);


  const user = useSelector((state) => state.user.loggedInUser.username);


  const allTaskData = useSelector((state) => state.TaskCalander);
  const taskData = allTaskData?.TaskCalander.data || [];

  const alllogeed = useSelector((state)=>state.user.loggedInUser.username);
  const fnddata = taskData.filter((item)=>item.created_by === alllogeed)

  return (
    <div className="sidebar-tasks">
      <h4 className="mb-3">Upcoming Tasks</h4>
      {fnddata.length === 0 ? (
        <div className="text-muted">No tasks scheduled</div>
      ) : (
        fnddata.map((task) => (
          <div key={task.id} className="task-card-wrapper">
            <div className="task-card mb-3" style={{ borderLeft: `4px solid ${task.color || '#007bff'}`, paddingLeft: '12px' }}>
              <h5 className="task-card-title">{task.taskName}</h5>
              <div className="task-card-time">
                <div>{moment(task.taskDate).format('MMM DD, YYYY')}</div>
                <div className="text-muted">
                  {moment(task.taskDate).format('HH:mm')} - {moment(task.taskTime, 'HH:mm').format('HH:mm')}
                </div>
              </div>
              <div className="task-card-actions">
                <Tooltip title="Delete task">
                  <DeleteOutlined onClick={() => handleDelete(task)} className="delete-icon" />
                </Tooltip>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const CustomCalendar = ({ taskData, onDeleteTask, onDateSelect }) => {
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
        tasks: taskData.filter(task =>
          moment(task.taskDate).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
        )
      });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    return calendar;
  };

  const formatTaskTime = (time) => {
    const momentTime = moment(time, 'HH:mm');
    return momentTime.format('ha');
  };

  const renderTaskBadge = (task) => {
    const timeStr = formatTaskTime(task.taskTime);
    return (
      <div key={task.id} className="task-badge">
        {`${timeStr} ${task.taskName}`}
        <Tooltip title="Delete">
          <DeleteOutlined
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(task.id);
            }}
            className="delete-icon"
          />
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="custom-calendar">
      <div className="calendar-header">
        <Button onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}>
          Previous
        </Button>
        <h2>{currentDate.format('MMMM YYYY')}</h2>
        <Button onClick={() => setCurrentDate(moment(currentDate).add(1, 'month'))}>
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
                  <div className="task-list">
                    {day.tasks.map(task => renderTaskBadge(task))}
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

const TaskCalendarApp = () => {
  const dispatch = useDispatch();
  const allTaskData = useSelector((state) => state.TaskCalander);
  const taskData = allTaskData?.TaskCalander.data || [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(GetTaskdata());
  }, [dispatch]);

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
  };

  const onDeleteTask = async (taskId) => {
    try {
      await dispatch(DeleteTask(taskId));
      message.success('Task deleted successfully');
      dispatch(GetTaskdata());
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  return (
    <div className="task-calendar-container">
      <div className="sidebar-card">
        <SidebarTasks tasks={taskData} onDeleteTask={onDeleteTask} />
      </div>
      <div className="calendar-container">
        <Card className="mb-4">
          <CustomCalendar
            taskData={taskData}
            onDeleteTask={onDeleteTask}
            onDateSelect={handleDateSelect}
          />
        </Card>
      </div>
      <AddTaskcalendar
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

const styles = `
  .task-calendar-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .sidebar-card {
    width: 300px;
    background-color: #f7f7f7;
    padding: 16px;
    height: calc(100vh - 32px);
    overflow-y: auto;
    border-radius: 8px;
  }

  .sidebar-tasks {
    display: flex;
    flex-direction: column;
  }

  .sidebar-tasks .task-card-wrapper {
    margin-bottom: 12px;
  }

  .task-card {
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  .task-card-title {
    font-weight: bold;
  }

  .task-card-time {
    color: #888;
  }

  .calendar-container {
    flex: 1;
  }

  .calendar-container .ant-card {
    background-color: #fff;
    border-radius: 8px;
  }

  .ant-modal-confirm-btns .ant-btn-dangerous {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
  }

  .ant-modal-confirm-btns .ant-btn-dangerous:hover {
    background-color: #ff7875;
    border-color: #ff7875;
  }

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
  }

  .calendar-table {
    width: 100%;
    border-collapse: collapse;
  }

  .calendar-table th {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }

  .calendar-cell {
    padding: 8px;
    border: 1px solid #eee;
    vertical-align: top;
    height: 120px;
  }

  .other-month {
    background-color: #f9f9f9;
    color: #999;
  }

  .date-number {
    margin-bottom: 8px;
    font-weight: bold;
  }

  .task-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .task-badge {
    background-color: #5B5FC7;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .delete-icon {
    color: white;
    margin-left: 8px;
    cursor: pointer;
  }

  .delete-icon:hover {
    opacity: 0.8;
  }
`;

const TaskCalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <TaskCalendarApp />
  </>
);

export default TaskCalendarAppWithStyles;











// import React, { useState, useEffect } from 'react';
// import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
// import { DeleteOutlined } from '@ant-design/icons';
// import { useDispatch, useSelector } from 'react-redux';
// import { GetTaskdata, DeleteTask, AddTask } from './TaskCalendarReducer/TaskCalendarSlice';
// import moment from 'moment';

// const { Option } = Select;

// const badgeColors = [
//   'pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple', 'geekblue', 'magenta', 'volcano', 'gold', 'lime',
// ];

// const initialFormValues = {
//   title: '',
//   start: moment('00:00:00', 'HH:mm:ss'),
//   end: moment('00:00:00', 'HH:mm:ss'),
//   bullet: badgeColors[0],
//   taskDescription: ""
// };

// const TaskCard = ({ task }) => (
//   <div className="task-card mb-3" style={{ borderLeft: `4px solid ${task.color}` }}>
//     <h5 className="task-card-title">{task.taskName}</h5>
//     <div className="task-card-time">
//       <div>{moment(task.taskDate).format('MMM DD, YYYY')}</div>
//       <div className="text-muted">
//         {moment(task.taskTime).format('HH:mm')} - {moment(task.taskDate).format('HH:mm')}
//       </div>
//     </div>
//   </div>
// );

// const SidebarTasks = ({ tasks, onDeleteTask }) => {
//   const sortedTasks = Array.isArray(tasks)
//     ? [...tasks].sort((a, b) => moment(a.taskDate).valueOf() - moment(b.taskDate).valueOf())
//     : [];

//   // console.log("Sorted Tasks: ", sortedTasks);

//   const handleDelete = (task) => {
//     Modal.confirm({
//       title: 'Delete Task',
//       content: `Are you sure you want to delete "${task.name}"?`,
//       okText: 'Yes',
//       okType: 'danger',
//       cancelText: 'No',
//       onOk() {
//         onDeleteTask(task.id);
//       },
//     });
//   };

//   const dispatch = useDispatch();

//   //// permission

//   const roleId = useSelector((state) => state.user.loggedInUser.role_id);
//   const roles = useSelector((state) => state.role?.role?.data);
//   const roleData = roles?.find(role => role.id === roleId);

//   const whorole = roleData.role_name;

//   const parsedPermissions = Array.isArray(roleData?.permissions)
//     ? roleData.permissions
//     : typeof roleData?.permissions === 'string'
//       ? JSON.parse(roleData.permissions)
//       : [];


//   let allpermisson;

//   if (parsedPermissions["dashboards-TaskCalendar"] && parsedPermissions["dashboards-TaskCalendar"][0]?.permissions) {
//     allpermisson = parsedPermissions["dashboards-TaskCalendar"][0].permissions;
//     // console.log('Parsed Permissions:', allpermisson);

//   } else {
//     // console.log('dashboards-TaskCalendar is not available');
//   }

//   const canCreateClient = allpermisson?.includes('create');
//   const canEditClient = allpermisson?.includes('edit');
//   const canDeleteClient = allpermisson?.includes('delete');
//   const canViewClient = allpermisson?.includes('view');

//   ///endpermission



//   useEffect(() => {
//     dispatch(GetTaskdata());
//   }, []);


//   const user = useSelector((state) => state.user.loggedInUser.username);


//   const allTaskData = useSelector((state) => state.TaskCalander);
//   const taskData = allTaskData?.TaskCalander.data || [];

//   const alllogeed = useSelector((state)=>state.user.loggedInUser.username);
//   const fnddata = taskData.filter((item)=>item.created_by === alllogeed)

//   return (
//     <div className="sidebar-tasks">
//       <h4 className="mb-3">Upcoming Tasks</h4>
//       {fnddata.length === 0 ? (
//         <div className="text-muted">No tasks scheduled</div>
//       ) : (
//         fnddata.map((task) => (
//           <div key={task.id} className="task-card-wrapper">
//             <div className="task-card mb-3" style={{ borderLeft: `4px solid ${task.color || '#007bff'}`, paddingLeft: '12px' }}>
//               <h5 className="task-card-title">{task.taskName}</h5>
//               <div className="task-card-time">
//                 <div>{moment(task.taskDate).format('MMM DD, YYYY')}</div>
//                 <div className="text-muted">
//                   {moment(task.taskDate).format('HH:mm')} - {moment(task.taskTime, 'HH:mm').format('HH:mm')}
//                 </div>
//               </div>
//               <div className="task-card-actions">
//                 <Tooltip title="Delete task">
//                   <DeleteOutlined onClick={() => handleDelete(task)} className="delete-icon" />
//                 </Tooltip>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const TaskModal = ({ open, addTask, cancel }) => {
//   const [form] = Form.useForm();
//   const onSubmit = (values) => {
//     addTask(values);
//   };

//   useEffect(() => {
//     form.setFieldsValue(initialFormValues);
//   }, [open]);

//   return (
//     <Modal
//       title="New Task"
//       visible={open}
//       footer={null}
//       destroyOnClose={true}
//       onCancel={cancel}
//     >
//       <Form form={form} layout="vertical" name="new-task" preserve={false} onFinish={onSubmit}>
//         <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the task title!' }]}>
//           <Input autoComplete="off" />
//         </Form.Item>
//         <Row gutter="16">
//           <Col span={12}>
//             <Form.Item name="start" label="Start" rules={[{ required: true, message: 'Please select start time!' }]}>
//               <TimePicker className="w-100" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="end" label="End" rules={[{ required: true, message: 'Please select end time!' }]}>
//               <TimePicker className="w-100" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item name="taskDescription" label="Task Description">
//           <Input autoComplete="off" />
//         </Form.Item>
//         <Form.Item name="bullet" label="Label">
//           <Select className='flex items-center'>
//             {badgeColors.map((elm) => (
//               <Option value={elm} key={elm}>
//                 <div className="flex items-center  gap-2">
//                   <Badge color={elm} />
//                   <span className="text-capitalize font-weight-semibold">{elm}</span>
//                 </div>
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item className="text-right mb-0">
//           <Button type="primary" htmlType="submit">
//             Add Task
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// const TaskCalendarApp = () => {
//   const dispatch = useDispatch();
//   const allTaskData = useSelector((state) => state.TaskCalander);
//   const taskData = allTaskData?.TaskCalander.data || [];
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     dispatch(GetTaskdata());
//   }, [dispatch]);

//   const cellRender = (value) => {
//     const currentDate = value.format('YYYY-MM-DD');
//     const listData = taskData.filter(task => moment(task.taskDate).format('YYYY-MM-DD') === currentDate);

//     return (
//       <ul className="calendar-task">
//         {listData.length > 0 ? (
//           listData.map((task) => (
//             <li key={task.id}>
//               <Badge color={task.color} text={task.taskName} />
//               <Tooltip title="Delete task">
//                 <DeleteOutlined onClick={() => onDeleteTask(task.id)} className="delete-icon" />
//               </Tooltip>
//             </li>
//           ))
//         ) : (
//           <li>No tasks</li>
//         )}
//       </ul>
//     );
//   };

//   const onDeleteTask = async (taskId) => {
//     try {
//       await dispatch(DeleteTask(taskId));
//       message.success('Task deleted successfully');
//       dispatch(GetTaskdata());
//     } catch (error) {
//       message.error('Failed to delete task');
//     }
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date.format('YYYY-MM-DD'));
//     setModalVisible(true);
//   };

//   const onAddTask = async (values) => {
//     try {
//       const taskData = {
//         taskName: values.title,
//         taskDate: selectedDate,
//         taskTime: moment(selectedDate).set({
//           hour: values.start.hour(),
//           minute: values.start.minute(),
//         }).format('H:mm'),
//         taskDescription: values.taskDescription,
//       };

//       await dispatch(AddTask(taskData));
//       dispatch(GetTaskdata());
//       setModalVisible(false);
//       form.resetFields();
//       message.success('Task added successfully');
//     } catch (error) {
//       message.error('Failed to add task');
//     }
//   };

//   return (
//     <div className="task-calendar-container">
//       <div className="sidebar-card">
//         <SidebarTasks tasks={taskData} onDeleteTask={onDeleteTask} />
//         <TaskModal open={modalVisible} addTask={onAddTask} cancel={() => setModalVisible(false)} />
//       </div>
//       <div className="calendar-container">
//         <Card className="mb-4">
//           <Calendar
//             cellRender={cellRender}
//             onSelect={handleDateSelect}
//           />
//         </Card>
//       </div>
//     </div>
//   );
// };

// const styles = `
//   .task-calendar-container {
//     display: flex;
//     flex-direction: row;
//     gap: 20px;
//   }

//   .sidebar-card {
//     width: 300px;
//     background-color: #f7f7f7;
//     padding: 16px;
//     height: calc(100vh - 32px);
//     overflow-y: auto;
//     border-radius: 8px;
//   }

//   .sidebar-tasks {
//     display: flex;
//     flex-direction: column;
//   }

//   .sidebar-tasks .task-card-wrapper {
//     margin-bottom: 12px;
//   }

//   .task-card {
//     padding: 12px;
//     border-radius: 8px;
//     border-left: 4px solid;
//     background-color: #fff;
//     box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
//   }

//   .task-card-title {
//     font-weight: bold;
//   }

//   .task-card-time {
//     color: #888;
//   }

//   .calendar-container {
//     flex: 1;
//   }

//   .calendar-container .ant-card {
//     background-color: #fff;
//     border-radius: 8px;
//   }

//   .ant-modal-confirm-btns .ant-btn-dangerous {
//     background-color: #ff4d4f;
//     border-color: #ff4d4f;
//     color: white;
//   }

//   .ant-modal-confirm-btns .ant-btn-dangerous:hover {
//     background-color: #ff7875;
//     border-color: #ff7875;
//   }
// `;

// const TaskCalendarAppWithStyles = () => (
//   <>
//     <style>{styles}</style>
//     <TaskCalendarApp />
//   </>
// );

// export default TaskCalendarAppWithStyles;
