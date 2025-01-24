import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { GetTaskdata, DeleteTask, AddTask } from './TaskCalendarReducer/TaskCalendarSlice';
import moment from 'moment';

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

  console.log("Sorted Tasks: ", sortedTasks);  // Debugging task data

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

  useEffect(() => {
    dispatch(GetTaskdata())
  }, [])

  const allTaskData = useSelector((state) => state.TaskCalander);
  const taskData = allTaskData?.TaskCalander.data || [];

  console.log("pppp", taskData)

  return (
    <div className="sidebar-tasks">
    <h4 className="mb-3">Upcoming Tasks</h4>
    {taskData.length === 0 ? (
      <div className="text-muted">No tasks scheduled</div>
    ) : (
      taskData.map((task) => (
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

const TaskModal = ({ open, addTask, cancel }) => {
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    addTask(values);
  };

  useEffect(() => {
    form.setFieldsValue(initialFormValues);
  }, [open]);

  return (
    <Modal
      title="New Task"
      visible={open}
      footer={null}
      destroyOnClose={true}
      onCancel={cancel}
    >
      <Form form={form} layout="vertical" name="new-task" preserve={false} onFinish={onSubmit}>
        <Form.Item name="title" label="Title">
          <Input autoComplete="off" />
        </Form.Item>
        <Row gutter="16">
          <Col span={12}>
            <Form.Item name="start" label="Start">
              <TimePicker className="w-100" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="end" label="End">
              <TimePicker className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="taskDescription" label="Task Description">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="bullet" label="Label">
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
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const TaskCalendarApp = () => {
  const dispatch = useDispatch();
  const allTaskData = useSelector((state) => state.task);
  const taskData = allTaskData?.tasks || [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(GetTaskdata());
  }, [dispatch]);

  const onDeleteTask = async (taskId) => {
    try {
      await dispatch(DeleteTask(taskId));
      await dispatch(GetTaskdata());
      message.success('Task deleted successfully');
    } catch (error) {
      message.error('Failed to delete task');
      console.error('Delete error:', error);
    }
  };

  const onAddTask = async (values) => {
    try {
      const taskData = {
        taskName: values.title,
        taskDate: moment(selectedDate).format('M/D/YYYY'),  // Format as "1/12/2025"
        taskTime: moment(selectedDate).set({
          hour: values.start.hour(),
          minute: values.start.minute(),
        }).format('H:mm'),  // Format as "2:10"
        taskDescription: values.taskDescription,
      };

      await dispatch(AddTask(taskData));
      await dispatch(GetTaskdata());
      setModalVisible(false);
      form.resetFields();
      message.success('Task added successfully');
    } catch (error) {
      message.error('Failed to add task');
      console.error('Add task error:', error);
    }
  };

  // Adjusted cellRender to show task names under each date
  const cellRender = (value) => {
    const currentDate = value.format('YYYY-MM-DD');
    const listData = taskData.filter((task) => {
      const taskDate = moment(task.taskDate).format('YYYY-MM-DD');
      return taskDate === currentDate;
    });

    return (
      <ul className="calendar-task">
        {listData.map((task) => (
          <li key={task.id}>
            <Badge color={task.color} text={task.taskName} />
          </li>
        ))}
      </ul>
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
  };

  return (
    <div className="task-calendar-container">
      <div className="sidebar-card">
        <SidebarTasks tasks={taskData} onDeleteTask={onDeleteTask} />
        <TaskModal open={modalVisible} addTask={onAddTask} cancel={() => setModalVisible(false)} />
      </div>
      <div className="calendar-container">
        <Card className="mb-4">
          <Calendar cellRender={cellRender} onSelect={handleDateSelect} />
        </Card>
      </div>
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
`;

const TaskCalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <TaskCalendarApp />
  </>
);

export default TaskCalendarAppWithStyles;
