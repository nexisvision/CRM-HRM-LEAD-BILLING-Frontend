import React, { useState, useEffect } from 'react';
import { Card, Modal, Button, Tooltip, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskdata, DeleteTask } from './TaskCalendarReducer/TaskCalendarSlice';
import moment from 'moment';
import AddTaskcalendar from './AddTaskcalendar';


const SidebarTasks = ({ tasks, onDeleteTask }) => {

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


  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];


  let allpermisson;

  if (parsedPermissions["dashboards-TaskCalendar"] && parsedPermissions["dashboards-TaskCalendar"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-TaskCalendar"][0].permissions;

  } else {
  }


  useEffect(() => {
    dispatch(GetTaskdata());
  }, [dispatch]);

  const allTaskData = useSelector((state) => state.TaskCalander);
  const taskData = allTaskData?.TaskCalander.data || [];

  const alllogeed = useSelector((state) => state.user.loggedInUser.username);
  const fnddata = taskData.filter((item) => item.created_by === alllogeed)

  return (
    <div className="sidebar-tasks">
      <h4 className="mb-3">Upcoming Tasks</h4>
      {fnddata.length === 0 ? (
        <div className="text-muted">No tasks scheduled</div>
      ) : (
        fnddata.map((task) => (
          <div key={task.id} className="task-card-wrapper">
            <Tooltip
              title={
                <div>
                  <div><strong>{task.taskName}</strong></div>
                  <div>Time: {moment(task.taskTime, 'HH:mm').format('hh:mm A')}</div>
                  <div>Description: {task.taskDescription}</div>
                </div>
              }
            >
              <div
                className="task-card mb-3"
                style={{
                  borderLeft: `4px solid ${task.color || '#5B5FC7'}`,
                  paddingLeft: '12px',
                  cursor: 'pointer'
                }}
              >
                <h5 className="task-card-title">{task.taskName}</h5>
                <div className="task-card-time">
                  <div>{moment(task.taskDate).format('MMM DD, YYYY')}</div>
                  <div className="text-muted">
                    {moment(task.taskTime, 'HH:mm').format('hh:mm A')}
                  </div>
                </div>
                <div className="task-card-actions">
                  <Tooltip title="Delete task">
                    <DeleteOutlined onClick={() => handleDelete(task)} className="delete-icon" />
                  </Tooltip>
                </div>
              </div>
            </Tooltip>
          </div>
        ))
      )}
    </div>
  );
};

const CustomCalendar = ({ taskData, onDeleteTask, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(moment());

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
      <Tooltip
        title={
          <div>
            <div><strong>{task.taskName}</strong></div>
            <div>Time: {moment(task.taskTime, 'HH:mm').format('hh:mm A')}</div>
            <div>Description: {task.taskDescription}</div>
          </div>
        }
      >
        <div
          key={task.id}
          className="task-badge"
          style={{
            backgroundColor: task.color || '#5B5FC7',
            color: 'white',
            height: '24px'
          }}
        >
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
      </Tooltip>
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

  .task-badge:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .task-card {
    transition: all 0.3s;
  }

  .task-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .delete-icon {
    color: white;
    margin-left: 8px;
    cursor: pointer;
  }

  .delete-icon:hover {
    opacity: 0.8;
  }

  // Tooltip styles
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

const TaskCalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <TaskCalendarApp />
  </>
);

export default TaskCalendarAppWithStyles;
