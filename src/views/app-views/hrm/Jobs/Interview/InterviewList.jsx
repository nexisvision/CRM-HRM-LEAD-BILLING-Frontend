import React, { useEffect, useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message } from 'antd';
import "react-big-calendar/lib/css/react-big-calendar.css";
// import { List, Card, Button, Modal, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import AddInterview from "./AddInterview";
import EditInterview from "./EditInterview";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteInterview,
  getInterview,
  AddInterviews
} from "./interviewReducer/interviewSlice";
import { FaNapster } from "react-icons/fa";

// const localizer = momentLocalizer(moment);

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

// const InterviewList = () => {
//   const dispatch = useDispatch();
//   const [interviewSchedules, setInterviewSchedules] = useState([
//     // {
//     //   id: 1,
//     //   title: "static data",
//     //   interviewer: "Candice",
//     //   date: new Date(2023, 1, 17, 11, 35),
//     // },
//   ]);

//   const [idd, setIdd] = useState("");

//   const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] =
//     useState(false);
//   const [isEditInterviewModalVisible, setIsEditInterviewModalVisible] =
//     useState(false);

//   const openAddInterviewModal = () => setIsAddInterviewModalVisible(true);
//   const closeAddInterviewModal = () => setIsAddInterviewModalVisible(false);

//   const openEditInterviewModal = () => setIsEditInterviewModalVisible(true);
//   const closeEditInterviewModal = () => setIsEditInterviewModalVisible(false);

//   const alldata = useSelector((state) => state.Interviews);
//   const fnddtaa = alldata.Interviews.data;

//   useEffect(() => {
//     dispatch(getInterview());
//   }, []);

const SidebarTasks = ({ tasks, onDeleteTask }) => {
  const sortedTasks = Array.isArray(tasks)
    ? [...tasks].sort((a, b) => moment(a.taskDate).valueOf() - moment(b.taskDate).valueOf())
    : [];

  console.log("Sorted Tasks: ", sortedTasks);

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

  if (parsedPermissions["dashboards-Interview"] && parsedPermissions["dashboards-Interview"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-Interview"][0].permissions;
    console.log('Parsed Permissions:', allpermisson);


  } else {
    console.log('dashboards-Interview is not available');
  }


  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission



  useEffect(() => {
    dispatch(getInterview());
  }, []);


  const allTaskData = useSelector((state) => state.Interviews);
  const taskData = allTaskData?.Interviews.data || [];
  console.log("lplplplplpl",taskData)


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
              <h5 className="task-card-title">{task.interviewer}</h5>
              <div className="task-card-time">
                <div>{moment(task.startOn).format('MMM DD, YYYY')}</div>
                <div className="text-muted">
                  {moment(task.startOn).format('HH:mm')} - {moment(task.startTime, 'HH:mm').format('HH:mm')}
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
        <Form.Item name="job" label="Job" rules={[{ required: true, message: 'Please input the job!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="candidate" label="Candidate" rules={[{ required: true, message: 'Please input the candidate!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="interviewer" label="Interviewer" rules={[{ required: true, message: 'Please input the interviewer!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="round" label="Round" rules={[{ required: true, message: 'Please input the round!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="interviewType" label="Interview Type" rules={[{ required: true, message: 'Please input the interview type!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Row gutter="16">
          <Col span={12}>
            <Form.Item name="startOn" label="Start On" rules={[{ required: true, message: 'Please select start time!' }]}>
              <TimePicker className="w-100" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: 'Please select end time!' }]}>
              <TimePicker className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="commentForInterviewer" label="Task Description">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="commentForCandidate" label="Comment For Candidate">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="bullet" label="Label">
          <Select className='flex items-center'>
            {badgeColors.map((elm) => (
              <Option value={elm} key={elm}>
                <div className="flex items-center  gap-2">
                  <Badge color={elm} />
                  <span className="text-capitalize font-weight-semibold">{elm}</span>
                </div>
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
  const allTaskData = useSelector((state) => state.Interviews);
  const taskData = allTaskData?.Interviews.data || [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();


  useEffect(() => {
    dispatch(getInterview());
  }, [dispatch]);

  const cellRender = (value) => {
    const currentDate = value.format('YYYY-MM-DD');
    const listData = taskData.filter(task => moment(task.taskDate).format('YYYY-MM-DD') === currentDate);

    return (
      <ul className="calendar-task">
        {listData.length > 0 ? (
          listData.map((task) => (
            <li key={task.id}>
              <Badge color={task.color} text={task.taskName} />
              <Tooltip title="Delete task">
                <DeleteOutlined onClick={() => onDeleteTask(task.id)} className="delete-icon" />
              </Tooltip>
            </li>
          ))
        ) : (
          <li>No tasks</li>
        )}
      </ul>
    );
  };

  const onDeleteTask = async (taskId) => {
    try {
      await dispatch(DeleteInterview(taskId));
      message.success('Task deleted successfully');
      dispatch(getInterview());
    } catch (error) {
      message.error('Failed to delete task');
    }

  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
  };

  const onAddTask = async (values) => {
    try {
      const taskData = {
        // taskName: values.title,
        // taskDate: selectedDate,
        // taskTime: moment(selectedDate).set({
        //   hour: values.start.hour(),
        //   minute: values.start.minute(),
        // }).format('H:mm'),
        // taskDescription: values.taskDescription,
        job: values.job,
        candidate: values.candidate,
        interviewer: values.interviewer,
        round: values.round,
        interviewType: values.interviewType,
        startOn: values.startOn,
        startTime: values.startTime,
      };

      await dispatch(AddInterviews(taskData));
      dispatch(getInterview());
      setModalVisible(false);
      form.resetFields();
      message.success('Task added successfully');

    } catch (error) {
      message.error('Failed to add task');
    }
  };

  return (
    <div className="task-calendar-container">
      <div className="sidebar-card">
        <SidebarTasks tasks={taskData} onDeleteTask={onDeleteTask} />
        <TaskModal open={modalVisible} addTask={onAddTask} cancel={() => setModalVisible(false)} />
      </div>
      <div className="calendar-container">
        <Card className="mb-4">
          <Calendar
            cellRender={cellRender}
            onSelect={handleDateSelect}
          />
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

