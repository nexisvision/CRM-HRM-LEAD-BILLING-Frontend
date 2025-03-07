import React, { useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Avatar,
  Timeline,
  Button,
  Tooltip,
  Divider,
  Space,
  Progress,
  Badge
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileOutlined,
  UserOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
  FlagOutlined,
  EditOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { GetTasks } from '../project/task/TaskReducer/TaskSlice';

const { Title, Text, Paragraph } = Typography;

const ViewTask = ({ filterdatass, onClose }) => {

  const dispatch = useDispatch()

  const alllogedata = useSelector((state) => state.user.loggedInUser.id)

  useEffect(() => {
    dispatch(GetTasks(alllogedata))
  }, [dispatch])

  const alldatas = useSelector((state) => state.Tasks.Tasks.data)

  let task = null;
  if (alldatas?.length) {
    if (filterdatass?.related_id) {
      task = alldatas.find((item) => item?.id === filterdatass.related_id);
    } else if (filterdatass?.id) {
      task = alldatas.find((item) => item?.id === filterdatass.id);
    }
  }
  task = task || filterdatass || null;

  const allempdata = useSelector((state) => state.Users);
  const empData = allempdata?.Users?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return { color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' };
      case 'In Progress': return { color: '#1890ff', bgColor: '#e6f7ff', borderColor: '#91d5ff' };
      case 'To Do': return { color: '#faad14', bgColor: '#fffbe6', borderColor: '#ffe58f' };
      case 'On Hold': return { color: '#ff4d4f', bgColor: '#fff1f0', borderColor: '#ffa39e' };
      case 'Incomplete': return { color: '#ff7875', bgColor: '#fff1f0', borderColor: '#ffccc7' };
      default: return { color: '#d9d9d9', bgColor: '#fafafa', borderColor: '#f0f0f0' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return { color: '#f5222d', bgColor: '#fff1f0', borderColor: '#ffa39e' };
      case 'Medium': return { color: '#faad14', bgColor: '#fffbe6', borderColor: '#ffe58f' };
      case 'Low': return { color: '#52c41a', bgColor: '#f6ffed', borderColor: '#b7eb8f' };
      default: return { color: '#d9d9d9', bgColor: '#fafafa', borderColor: '#f0f0f0' };
    }
  };

  const getAssignedUsers = () => {
    try {
      let assignedUserIds = [];
      if (typeof task.assignTo === 'string') {
        const parsed = JSON.parse(task.assignTo);
        assignedUserIds = parsed.assignedUsers || [];
      } else if (task.assignTo?.assignedUsers) {
        assignedUserIds = task.assignTo.assignedUsers;
      }
      return assignedUserIds.map(id => empData.find(user => user.id === id)).filter(Boolean);
    } catch (error) {
      console.error("Error parsing assignTo:", error);
      return [];
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getProgressStatus = (status) => {
    switch (status) {
      case 'Completed': return { percent: 100, status: 'success' };
      case 'In Progress': return { percent: 50, status: 'active' };
      case 'To Do': return { percent: 0, status: 'normal' };
      case 'On Hold': return { percent: 25, status: 'exception' };
      case 'Incomplete': return { percent: 10, status: 'exception' };
      default: return { percent: 0, status: 'normal' };
    }
  };

  if (!task) return null;

  const assignedUsers = getAssignedUsers();
  const reporter = empData.find(user => user.id === task.task_reporter);
  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);
  const progress = getProgressStatus(task.status);

  return (
    <div className="task-view-container">
      <Row gutter={[24, 24]}>
        {/* Left Column - Main Content */}
        <Col xs={24} lg={16}>
          <Card
            className="main-content-card"
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <Title level={4} style={{ margin: 0 }}>{task.taskName}</Title>
                  <Tag
                    style={{
                      color: statusColors.color,
                      backgroundColor: statusColors.bgColor,
                      borderColor: statusColors.borderColor,
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}
                  >
                    {task.status}
                  </Tag>
                  <Tag
                    icon={<FlagOutlined />}
                    style={{
                      color: priorityColors.color,
                      backgroundColor: priorityColors.bgColor,
                      borderColor: priorityColors.borderColor,
                      fontSize: '14px',
                      padding: '4px 12px',
                      borderRadius: '12px'
                    }}
                  >
                    {task.priority} Priority
                  </Tag>
                </div>
              </div>
              <Progress
                type="circle"
                percent={progress.percent}
                width={80}
                status={progress.status}
                format={percent => (
                  <div style={{ fontSize: '12px', lineHeight: '1' }}>
                    <div>{percent}%</div>
                    <div style={{ marginTop: '4px', fontSize: '10px' }}>Complete</div>
                  </div>
                )}
              />
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div className="task-details-section mb-6">
              <Title level={5} className="section-title">
                <InfoCircleOutlined className="mr-2" />
                Description
              </Title>
              <div className="description-content p-4 bg-gray-50 rounded-lg">
                {task.description ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: task.description }}
                    style={{
                      color: '#595959',
                      lineHeight: '1.8',
                      fontSize: '14px'
                    }}
                  />
                ) : (
                  <Text type="secondary">No description provided</Text>
                )}
              </div>
            </div>

            <div className="task-timeline mb-6">
              <Title level={5} className="section-title">
                <HistoryOutlined className="mr-2" />
                Timeline
              </Title>
              <Timeline className="mt-4">
                <Timeline.Item
                  dot={<CalendarOutlined style={{ fontSize: '16px', color: '#1890ff' }} />}
                  color="blue"
                >
                  <Text strong>Created</Text>
                  <br />
                  <Text type="secondary">{dayjs(task.createdAt).format('MMM DD, YYYY')}</Text>
                </Timeline.Item>
                <Timeline.Item
                  dot={<ClockCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />}
                  color="green"
                >
                  <Text strong>Start Date</Text>
                  <br />
                  <Text type="secondary">{dayjs(task.startDate).format('MMM DD, YYYY')}</Text>
                </Timeline.Item>
                <Timeline.Item
                  dot={<CheckCircleOutlined style={{ fontSize: '16px', color: '#faad14' }} />}
                  color="orange"
                >
                  <Text strong>Due Date</Text>
                  <br />
                  <Text type="secondary">{dayjs(task.dueDate).format('MMM DD, YYYY')}</Text>
                </Timeline.Item>
              </Timeline>
            </div>

            {/* Attachments Section */}
            <div className="attachments-section">
              <Title level={5} className="section-title">
                <PaperClipOutlined className="mr-2" />
                Attachments
              </Title>
              {task.task_file ? (
                <div className="file-card p-4 bg-gray-50 rounded-lg mt-4">
                  <div className="flex items-center gap-4">
                    <div className="file-icon">
                      <FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    </div>
                    <div className="flex-grow">
                      <Text strong>Task Attachment</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Click to view or download
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      ghost
                      href={task.task_file}
                      target="_blank"
                      icon={<FileOutlined />}
                    >
                      View File 
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="empty-attachments p-4 bg-gray-50 rounded-lg mt-4 text-center">
                  <Text type="secondary">No attachments available</Text>
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Right Column - Sidebar */}
        <Col xs={24} lg={8}>
          {/* Assigned Users Card */}
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Assigned Team Members</span>
              </Space>
            }
            className="mb-4"
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div className="space-y-4">
              {assignedUsers.map((user, index) => (
                <div key={user.id} className="user-card p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={40}
                      style={{
                        backgroundColor: '#1890ff',
                        color: '#fff',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getInitials(user.firstName || user.username)}
                    </Avatar>
                    <div>
                      <Text strong style={{ fontSize: '14px' }}>
                        {user.firstName || user.username}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Team Member
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Task Reporter Card */}
          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Task Reporter</span>
              </Space>
            }
            className="mb-4"
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {reporter ? (
              <div className="reporter-card p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar
                    size={40}
                    style={{
                      backgroundColor: '#52c41a',
                      color: '#fff',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getInitials(reporter.firstName || reporter.username)}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: '14px' }}>
                      {reporter.firstName || reporter.username}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Reporter
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-reporter p-3 bg-gray-50 rounded-lg text-center">
                <Text type="secondary">No reporter assigned</Text>
              </div>
            )}
          </Card>

          {/* Task Statistics Card */}
          <Card
            title={
              <Space>
                <InfoCircleOutlined />
                <span>Task Statistics</span>
              </Space>
            }
            bordered={false}
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <div className="stats-content space-y-4">
              <div className="stat-item p-3 bg-gray-50 rounded-lg">
                <Text type="secondary" style={{ fontSize: '12px' }}>Created by</Text>
                <br />
                <Text strong style={{ fontSize: '14px' }}>{task.created_by}</Text>
              </div>
              <div className="stat-item p-3 bg-gray-50 rounded-lg">
                <Text type="secondary" style={{ fontSize: '12px' }}>Last updated</Text>
                <br />
                <Text strong style={{ fontSize: '14px' }}>
                  {dayjs(task.updatedAt).format('MMM DD, YYYY HH:mm')}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .task-view-container {
          padding: 24px;
          background: #f0f2f5;
        }
        .section-title {
          margin-bottom: 16px;
          color: #1f1f1f;
        }
        .description-content {
          border: 1px solid #f0f0f0;
        }
        .file-card, .user-card, .reporter-card, .stat-item {
          transition: all 0.3s ease;
        }
        .file-card:hover, .user-card:hover, .reporter-card:hover, .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        }
      `}</style>
    </div>
  );
};

export default ViewTask;