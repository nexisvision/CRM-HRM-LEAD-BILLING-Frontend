import React, { useEffect, useState } from "react";
import moment from "moment";
import { Card, Row, Col, Modal, Form, Input, Select, TimePicker, Button, Tooltip, message, DatePicker } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteInterview,
  getInterview,
  AddInterviews
} from "./interviewReducer/interviewSlice";
import { GetJobdata } from '../JobReducer/JobSlice';
import { getjobapplication } from '../JobApplication/JobapplicationReducer/JobapplicationSlice';
import AddInterviewModal from './AddInterview';
const { Option } = Select;
const SidebarInterviews = ({ interviews, onDeleteInterview }) => {
  const sortedInterviews = Array.isArray(interviews)
    ? [...interviews].sort((a, b) => moment(a.startOn).valueOf() - moment(b.startOn).valueOf())
    : [];
  return (
    <div className="sidebar-interviews">
      <h4 className="mb-3">Upcoming Interviews</h4>
      {sortedInterviews.length === 0 ? (
        <div className="text-muted">No interviews scheduled</div>
      ) : (
        sortedInterviews.map((interview) => (
          <div key={interview.id} className="interview-card-wrapper">
            <div
              className="interview-card mb-3"
              style={{
                borderLeft: `4px solid ${interview.interviewType === 'Online' ? '#5B5FC7' : '#4CAF50'}`,
                paddingLeft: '12px'
              }}
            >
              <h5 className="interview-card-title">{interview.interviewer}</h5>
              <div className="interview-card-time">
                <div>{moment(interview.startOn).format('MMM DD, YYYY')}</div>
                <div className="text-muted">
                  {moment(interview.startTime, 'HH:mm:ss').format('h:mm a')} - {interview.interviewType}
                </div>
              </div>
              <div className="interview-card-actions">
                <Tooltip title="Delete interview">
                  <DeleteOutlined
                    onClick={() => onDeleteInterview(interview.id)}
                    className="delete-icon"
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
const CustomCalendar = ({ interviewData, onDeleteInterview, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedView, setSelectedView] = useState('Month');
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
        interviews: interviewData.filter(interview =>
          moment(interview.startOn).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
        )
      });
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    return calendar;
  };
  const formatInterviewTime = (time) => {
    const momentTime = moment(time, 'HH:mm:ss');
    return `${momentTime.format('h')}${momentTime.format('a').toLowerCase()[0]}`;
  };
  const renderInterviewBadge = (interview) => {
    const timeStr = formatInterviewTime(interview.startTime);
    const type = interview.interviewType === 'Online' ? 'Video' : 'Phone';
    const text = `${timeStr} ${type} Interv${type === 'Video' ? 'i' : 'ie'}`;
    return (
      <div key={interview.id} className="interview-badge">
        {text}
        <Tooltip title="Delete">
          <DeleteOutlined
            onClick={(e) => {
              e.stopPropagation();
              onDeleteInterview(interview.id);
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
                  <div className="interview-list">
                    {day.interviews.map(interview => renderInterviewBadge(interview))}
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

  const handleDateSelect = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setModalVisible(true);
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

  const onAddInterview = async (values) => {
    try {
      const interviewData = {
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
      // message.success('Interview added successfully');
    } catch (error) {
      // message.error('Failed to add Interview');
    }
  };

  return (
    <div className="interview-calendar-container">
      <div className="sidebar-card">
        <SidebarInterviews interviews={interviewData} onDeleteInterview={onDeleteInterview} />
      </div>
      <div className="calendar-container">
        <Card className="mb-4">
          <CustomCalendar
            interviewData={interviewData}
            onDeleteInterview={onDeleteInterview}
            onDateSelect={handleDateSelect}
          />
        </Card>
      </div>
      <AddInterviewModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onAddInterview={onAddInterview}
        initialDate={selectedDate}
      />
    </div>
  );
};
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
  .interview-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .interview-badge {
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
  .interview-calendar-container {
    display: flex;
    gap: 20px;
  }
  .sidebar-card {
    width: 300px;
    background-color: #f7f7f7;
    padding: 16px;
    border-radius: 8px;
  }
  .calendar-container {
    flex: 1;
  }
  .sidebar-interviews {
    display: flex;
    flex-direction: column;
  }
  .interview-card-wrapper {
    margin-bottom: 12px;
  }
  .interview-card {
    background: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
  .interview-card-title {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
  }
  .interview-card-time {
    font-size: 12px;
  }
  .interview-card-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
  .interview-card .delete-icon {
    color: #ff4d4f;
    cursor: pointer;
  }
  .interview-card .delete-icon:hover {
    opacity: 0.8;
  }
  .text-muted {
    color: #8c8c8c;
  }
`;
const InterviewCalendarAppWithStyles = () => (
  <>
    <style>{styles}</style>
    <InterviewCalendarApp />
  </>
);
export default InterviewCalendarAppWithStyles;


