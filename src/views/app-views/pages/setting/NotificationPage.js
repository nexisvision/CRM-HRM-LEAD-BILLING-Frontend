import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllNotifications } from './NotificationReducer/NotificationSlice';
import { Badge, Tabs, Timeline, Card, Avatar, Tooltip, Button, Modal } from 'antd';
import {
  BellOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  PushpinOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import NotificationDetailModal from './NotificationDetailModal';
import ViewTask from '../../dashboards/task/ViewTask';
import ViewPlanModal from '../../plan/ViewPlanModal';

dayjs.extend(relativeTime);
dayjs.extend(calendar);

const EmptyState = ({ type }) => (
  <div className="empty-state py-8 px-4">
    <div className="flex flex-col items-center">
      {/* Icon with background effect */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"
          style={{ transform: 'scale(1.2)' }}
        />
        <div className="relative">
          {type === 'reminder' ? (
            <ClockCircleOutlined
              className="text-orange-400"
              style={{ fontSize: '40px' }}
            />
          ) : (
            <BellOutlined
              className="text-blue-500"
              style={{ fontSize: '40px' }}
            />
          )}
        </div>
      </div>

      {/* Message */}
      <div className="text-center mt-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          {type === 'reminder'
            ? "No Reminders Yet! 🎯"
            : "All Caught Up! 🌟"
          }
        </h4>
        <p className="text-gray-500 text-sm mb-4 max-w-[200px] mx-auto">
          {type === 'reminder'
            ? "You're all set - no pending reminders"
            : "You're up to date with notifications"
          }
        </p>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-gray-600 font-medium">
          {type === 'reminder' ? 'Clear Schedule' : 'All Clear'}
        </span>
      </div>
    </div>
  </div>
);

const NotificationPage = () => {
  const dispatch = useDispatch();
  const allnoidata = useSelector((state) => state.Notifications);
  const fnddata = allnoidata?.Notifications?.data || [];
  const [list, setList] = useState([]);
  const [pinnedNotifications, setPinnedNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [isViewPlanModalVisible, setIsViewPlanModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [noti, setNoti] = useState(null);

  useEffect(() => {
    dispatch(GetAllNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata.length) {
      setList(fnddata);
    }
  }, [fnddata]);

  // Priority badge color helper
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a'
    };
    return colors[priority] || colors.medium;
  };

  // Enhanced icon styling with gradients
  const getTypeIcon = (type) => {
    const iconStyles = {
      normal: {
        icon: <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />,
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200'
      },
      reminder: {
        icon: <ClockCircleOutlined style={{ fontSize: '20px', color: '#faad14' }} />,
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200'
      },
      warning: {
        icon: <WarningOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />,
        bg: 'from-red-50 to-red-100',
        border: 'border-red-200'
      }
    };
    return iconStyles[type] || iconStyles.normal;
  };

  const handlePinNotification = (notification) => {
    setPinnedNotifications(prev => {
      const isPinned = prev.find(p => p.id === notification.id);
      if (isPinned) {
        return prev.filter(p => p.id !== notification.id);
      }
      return [...prev, notification];
    });
  };

  const formatTime = (time) => {
    const now = dayjs();
    const notificationTime = dayjs(time);
    const diffInSeconds = now.diff(notificationTime, 'second');
    const diffInMinutes = now.diff(notificationTime, 'minute');
    const diffInHours = now.diff(notificationTime, 'hour');

    // More precise time display for recent notifications
    if (diffInSeconds < 60) {
      return diffInSeconds === 0 ? 'just now' : `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInHours < 48) {
      return `Yesterday at ${notificationTime.format('HH:mm')}`;
    } else if (now.year() === notificationTime.year()) {
      return notificationTime.format('MMM DD at HH:mm');
    } else {
      return notificationTime.format('MMM DD, YYYY at HH:mm');
    }
  };

  const handleNotificationClick = (notification) => {
    setNoti(notification);

    // Parse assignTo to include only user data
    let assignToObject = {
      assignedUsers: []
    };

    try {
      if (notification.users) {
        assignToObject.assignedUsers = notification.users;
      } else if (typeof notification.assignTo === 'string') {
        const parsed = JSON.parse(notification.assignTo);
        assignToObject.assignedUsers = parsed.assignedUsers || [];
      } else if (notification.assignTo?.assignedUsers) {
        assignToObject.assignedUsers = notification.assignTo.assignedUsers;
      }
    } catch (error) {
      console.error("Error parsing assignTo:", error);
    }

    const taskData = {
      notification: notification
    };

    // Check notification type and show appropriate modal
    if (notification.title === "New Plan") {
      setSelectedPlan(notification);
      setIsViewPlanModalVisible(true);
    } else {
      setSelectedTask(taskData);
      setIsViewTaskModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedNotification(null);
  };

  const handleTaskModalClose = () => {
    setIsViewTaskModalVisible(false);
    setSelectedTask(null);
  };

  const handlePlanModalClose = () => {
    setIsViewPlanModalVisible(false);
    setSelectedPlan(null);
  };

  const NotificationCard = ({ notification }) => {
    const iconConfig = getTypeIcon(notification.notification_type);
    const isPinned = pinnedNotifications.find(p => p.id === notification.id);

    return (
      <Card
        className={`mb-3 hover:shadow-md transition-all duration-300 border-l-4 ${isPinned ? 'bg-blue-50/30' : ''
          } cursor-pointer`}
        onClick={() => handleNotificationClick(notification)}
        style={{
          borderLeftColor: notification.notification_type === 'reminder'
            ? '#faad14'
            : notification.notification_type === 'warning'
              ? '#ff4d4f'
              : '#1890ff'
        }}
        bodyStyle={{ padding: '12px' }}
        bordered={false}
      >
        <div className="flex items-start gap-3">
          {/* Icon Container */}
          <div className={`
            rounded-lg p-1.5 flex items-center justify-center
            bg-gradient-to-br ${iconConfig.bg}
            border ${iconConfig.border}
          `}>
            {iconConfig.icon}
          </div>

          <div className="flex-grow min-w-0">
            {/* Updated Header with better time display */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-semibold m-0 text-gray-800 leading-none">
                  {notification.title}
                </h4>
                {notification.priority && (
                  <Badge
                    className="ml-1"
                    style={{
                      backgroundColor: getPriorityColor(notification.priority),
                      padding: '0 6px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: 'white',
                      textTransform: 'capitalize',
                      lineHeight: '16px'
                    }}
                    count={notification.priority}
                  />
                )}
              </div>
              <Tooltip title={dayjs(notification.createdAt).format('MMMM DD, YYYY HH:mm:ss')}>
                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                  {formatTime(notification.createdAt)}
                </span>
              </Tooltip>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-2 text-sm leading-snug">
              {notification.description}
            </p>

            {/* Single Pin Button */}
            <div className="flex justify-end items-center pt-2 border-t border-gray-100">
              <Tooltip title={isPinned ? 'Unpin' : 'Pin'}>
                <Button
                  type="text"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePinNotification(notification);
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-full 
                    ${isPinned
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'hover:bg-gray-100'
                    }`}
                  icon={<PushpinOutlined className={isPinned ? 'text-blue-600' : 'text-gray-400'} />}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const items = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <BellOutlined />
          All Notifications
          <Badge
            count={list.filter(n => n.notification_type === 'normal').length}
            style={{ backgroundColor: '#1890ff' }}
          />
        </span>
      ),
      children: (
        <div className="custom-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Pinned Notifications */}
          {pinnedNotifications.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 mb-2 px-1">
                PINNED
              </div>
              {pinnedNotifications.map((notification, index) => (
                <NotificationCard key={`pinned-${index}`} notification={notification} />
              ))}
              <div className="border-b border-gray-200 my-3" />
            </div>
          )}

          {/* Other Notifications */}
          {list.filter(n => n.notification_type === 'normal').length > 0 ? (
            list
              .filter(n => n.notification_type === 'normal')
              .filter(n => !pinnedNotifications.find(p => p.id === n.id))
              .map((notification, index) => (
                <NotificationCard key={index} notification={notification} />
              ))
          ) : (
            <EmptyState type="notification" />
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <ClockCircleOutlined />
          Reminders
          <Badge
            count={list.filter(n => n.notification_type === 'reminder').length}
            style={{ backgroundColor: '#faad14' }}
          />
        </span>
      ),
      children: (
        <div className="custom-scrollbar" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {list.filter(n => n.notification_type === 'reminder').length > 0 ? (
            list
              .filter(n => n.notification_type === 'reminder')
              .map((reminder, index) => (
                <NotificationCard key={index} notification={reminder} />
              ))
          ) : (
            <EmptyState type="reminder" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card
        className="shadow-lg rounded-lg border-0"
        headStyle={{
          borderBottom: '1px solid #f0f0f0',
          padding: '12px 16px'
        }}
        bodyStyle={{ padding: 0 }}
        title={
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <BellOutlined className="text-lg text-blue-500" />
            </div>
            <span className="text-lg font-semibold">Notification Center</span>
          </div>
        }
      >
        <Tabs
          items={items}
          className="custom-tabs px-4 pt-3"
          animated={{ tabPane: true }}
          tabBarStyle={{
            marginBottom: 16,
            borderBottom: '1px solid #f0f0f0'
          }}
        />
      </Card>

      <NotificationDetailModal
        visible={isModalVisible}
        notification={selectedNotification}
        onClose={handleModalClose}
      />

      <Modal
        title={selectedTask?.title || "Task Details"}
        visible={isViewTaskModalVisible}
        onCancel={handleTaskModalClose}
        footer={null}
        width={1200}
        className="mt-[-70px]"
      >
        {selectedTask && (
          <ViewTask 
            filterdatass={noti} 
            notificationData={selectedTask.notificationData} 
            onClose={handleTaskModalClose} 
          />
        )}
      </Modal>

      <ViewPlanModal
        visible={isViewPlanModalVisible}
        onClose={handlePlanModalClose}
        plan={selectedPlan}
        currencyData={[]} // Add your currency data here
        isAdmin={false} // Set based on user role
        onEdit={(id) => {/* Handle edit */}}
        onDelete={(id) => {/* Handle delete */}}
        onBuy={(plan) => {/* Handle buy */}}
      />
    </div>
  );
};

// Updated styles with optimized spacing
const styles = `
  .custom-tabs .ant-tabs-nav {
    margin-bottom: 12px !important;
  }

  .custom-tabs .ant-tabs-tab {
    padding: 8px 16px;
    transition: all 0.3s;
    border-radius: 6px;
    margin-right: 6px;
    font-size: 13px;
  }

  .custom-tabs .ant-tabs-tab-active {
    background-color: #e6f7ff;
  }

  .custom-tabs .ant-tabs-ink-bar {
    background: #1890ff;
    height: 2px;
    border-radius: 2px;
  }

  .custom-scrollbar {
    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #bfbfbf;
    }
  }
`;

// Add these styles to your existing styles
const additionalStyles = `
  .empty-state {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export default NotificationPage;


