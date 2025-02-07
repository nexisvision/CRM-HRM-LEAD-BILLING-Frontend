import React, { useEffect, useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Calendar, Badge, Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message,DatePicker } from 'antd';
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
import { GetJobdata } from '../JobReducer/JobSlice';
import { getjobapplication } from '../JobApplication/JobapplicationReducer/JobapplicationSlice';

// const localizer = momentLocalizer(moment);

const { Option } = Select;

const initialFormValues = {
  job: '',
  candidate: '',
  interviewer: '',
  round: '',
  interviewType: '',
  // startOn: moment('00:00:00', 'DD-MM-YYYY'),
  startOn: moment('00:00:00', 'DD-MM-YYYY'),
  startTime: moment('00:00:00', 'HH:mm:ss'),
  commentForInterviewer: '',
  commentForCandidate: '',
  // start: moment('00:00:00', 'HH:mm:ss'),
  // end: moment('00:00:00', 'HH:mm:ss'),
  // bullet: badgeColors[0],
  // taskDescription: "",
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

const SidebarInterviews = ({ interviews, onDeleteInterview }) => {
  const sortedInterviews = Array.isArray(interviews)
    ? [...interviews].sort((a, b) => moment(a.startOn).valueOf() - moment(b.startOn).valueOf())
    : [];


  console.log("Sorted Interviews: ", sortedInterviews);


  const handleDelete = (interview) => {
    Modal.confirm({
      title: 'Delete Interview',
      content: `Are you sure you want to delete "${interview.interviewer}"?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onDeleteInterview(interview.id);
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


  const allInterviewData = useSelector((state) => state.Interviews);
  const interviewData = allInterviewData?.Interviews.data || [];
  console.log("lplplplplpl",interviewData)



  console.log("pppp", interviewData)

  return (
    <div className="sidebar-interviews">

      <h4 className="mb-3">Upcoming Interviews</h4>
      {interviewData.length === 0 ? (
        <div className="text-muted">No interviews scheduled</div>

      ) : (

        interviewData.map((interview) => (
          <div key={interview.id} className="interview-card-wrapper">
            <div className="interview-card mb-3" style={{ borderLeft: `4px solid ${interview.color || '#007bff'}`, paddingLeft: '12px' }}>
              <h5 className="interview-card-title">{interview.interviewer}</h5>

              <div className="interview-card-time">
                <div>{moment(interview.startOn).format('MMM DD, YYYY')}</div>
                <div className="text-muted">
                  {moment(interview.startOn).format('HH:mm')} - {moment(interview.startTime, 'HH:mm').format('HH:mm')}

                </div>

              </div>
              <div className="interview-card-actions">
                <Tooltip title="Delete interview">
                  <DeleteOutlined onClick={() => handleDelete(interview)} className="delete-icon" />
                </Tooltip>
              </div>

            </div>
          </div>
        ))
      )}
    </div>
  );
};



const InterviewModal = ({ open, addInterview, cancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  
  // Get jobs from Redux store
  const jobsData = useSelector((state) => state.Jobs.Jobs.data) || [];
  const jobApplications = useSelector((state) => state.jobapplications.jobapplications.data) || [];

  // Fetch jobs when component mounts
  useEffect(() => {
    dispatch(GetJobdata());
    dispatch(getjobapplication());
  }, [dispatch]);

  const onSubmit = (values) => {
    addInterview(values);
  };

  useEffect(() => {
    form.setFieldsValue(initialFormValues);
  }, [open]);

  return (
    <Modal
      title="Add Interview"
      visible={open}
      footer={null}
      destroyOnClose={true}
      onCancel={cancel}
    >
      <Form form={form} layout="vertical" name="new-interview" preserve={false} onFinish={onSubmit}>
        <Form.Item 
          name="job" 
          label="Job" 
          rules={[{ required: true, message: 'Please select a job!' }]}
        >
          <Select
            placeholder="Select a job"
          >
            {Array.isArray(jobsData) && jobsData.map((job) => (
              <Option key={job.id} value={job.id}>
                {job.title || job.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item name="candidate" label="Candidate" rules={[{ required: true, message: 'Please input the candidate!' }]}>
          <Input autoComplete="off" />
        </Form.Item> */}
        <Form.Item 
          name="candidate" 
          label="Candidate" 
          rules={[{ required: true, message: 'Please select a candidate!' }]}
        >
          <Select

            placeholder="Select a Candidate"
          >
            {Array.isArray(jobApplications) && jobApplications.map((application) => (
              <Option key={application.id} value={application.id}>
                {application.name || application.name}
              </Option>
            ))}

          </Select>
        </Form.Item>
        <Form.Item name="interviewer" label="Interviewer" rules={[{ required: true, message: 'Please input the interviewer!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="round" label="Round" rules={[{ required: true, message: 'Please input the round!' }]}>
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item 
          name="interviewType" 
          label="Interview Type" 
          rules={[{ required: true, message: 'Please select the interview type!' }]}
        >
          <Select
            placeholder="Select interview type"
          >
           <Option value="Online">Online</Option>
           <Option value="Offline">Offline</Option>
          </Select>
        </Form.Item>

        {/* <Form.Item name="interviewType" label="Interview Type" rules={[{ required: true, message: 'Please input the interview type!' }]}>
          <Input autoComplete="off" />
        </Form.Item> */}
        <Row gutter="16">
          <Col span={12}>
            <Form.Item name="startOn" label="Start On" rules={[{ required: true, message: 'Please select start time!' }]}>
              <DatePicker className="w-100" format="DD-MM-YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: 'Please select end time!' }]}>
              <TimePicker className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="commentForInterviewer" label="Comment For Interviewer">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item name="commentForCandidate" label="Comment For Candidate">

          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item className="text-right mb-0">
          <Button type="primary" htmlType="submit">
            Add Interview
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const InterviewCalendarApp = () => {
  const dispatch = useDispatch();
  const allInterviewData = useSelector((state) => state.Interviews);
  const interviewData = allInterviewData?.Interviews.data || [];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();



  useEffect(() => {
    dispatch(getInterview());
  }, [dispatch]);

  const cellRender = (value) => {
    const currentDate = value.format('YYYY-MM-DD');
    const listData = interviewData.filter(interview => moment(interview.startOn).format('YYYY-MM-DD') === currentDate);


    return (
      <ul className="calendar-interview">
        {listData.length > 0 ? (
          listData.map((interview) => (
            <li key={interview.id}>

              <Badge color={interview.color} text={interview.interviewer} />
              <Tooltip title="Delete interview">
                <DeleteOutlined onClick={() => onDeleteInterview(interview.id)} className="delete-icon" />
              </Tooltip>
            </li>
          ))
        ) : (
          <li>No Interview</li>
        )}
      </ul>
    );
  };

  const onDeleteInterview = async (interviewId) => {
    try {
      await dispatch(DeleteInterview(interviewId));
      message.success('Interview deleted successfully');
      dispatch(getInterview());


    } catch (error) {
      message.error('Failed to delete Interview');
    }


  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
  };

  const onAddInterview = async (values) => {
    try {
      const interviewData = {
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
        commentForInterviewer: values.commentForInterviewer,
        commentForCandidate: values.commentForCandidate,
      };


      await dispatch(AddInterviews(interviewData));
      dispatch(getInterview());
      setModalVisible(false);
      form.resetFields();
      message.success('Interview added successfully');

    } catch (error) {
      message.error('Failed to add Interview');
    }
  };


  return (
    <div className="interview-calendar-container">
      <div className="sidebar-card">
        <SidebarInterviews interviews={interviewData} onDeleteInterview={onDeleteInterview} />
        <InterviewModal open={modalVisible} addInterview={onAddInterview} cancel={() => setModalVisible(false)} />
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
                            .interview-calendar-container {
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
                          
                            .sidebar-interviews {
                              display: flex;
                              flex-direction: column;
                            }

                            .sidebar-interviews .interview-card-wrapper {
                              margin-bottom: 12px;
                            }

                            .sidebar-interviews .interview-card {
                              padding: 12px;
                              border-radius: 8px;
                              border-left: 4px solid;
                              background-color: #fff;
                              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

                            }
                          
                            .interview-card-title {
                              font-weight: bold;
                            }

                          
                            .interview-card-time {
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
const InterviewCalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <InterviewCalendarApp />
  </>
);


export default InterviewCalendarAppWithStyles;

