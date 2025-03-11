import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Avatar, List, Popover, Tabs, Modal } from 'antd';
import {
  WarningOutlined,
  ClockCircleOutlined,
  BellOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { useSelector, useDispatch } from 'react-redux';
import { GetAllNotifications } from 'views/app-views/pages/setting/NotificationReducer/NotificationSlice';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ViewTask from 'views/app-views/dashboards/task/ViewTask';
import ViewPlanModal from 'views/app-views/plan/ViewPlanModal';

dayjs.extend(relativeTime);

const notificationStyles = `
  .nav-notification {
    .ant-popover-inner {
      padding: 0;
      overflow: hidden;
      box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 
                  0 3px 6px -4px rgba(0, 0, 0, 0.12), 
                  0 9px 28px 8px rgba(0, 0, 0, 0.05);
    }

    .ant-tabs-nav {
      margin: 0;
      padding: 8px 16px 0;
      background: #fafafa;
    }

    .ant-tabs-tab {
      padding: 8px 0;
      margin: 0 16px 0 0;
      transition: all 0.3s;
      
      &:hover {
        color: #1890ff;
      }
      
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #1890ff;
          font-weight: 500;
        }
      }
    }

    .custom-scrollbar {
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #e6e6e6;
        border-radius: 3px;
        
        &:hover {
          background: #d9d9d9;
        }
      }
    }

    .notification-item {
      padding: 12px 16px;
      transition: all 0.3s;
      border-left: 3px solid transparent;
      
      &:hover {
        background: #f5f5f5;
        border-left-color: #1890ff;
      }

      .notification-avatar {
        transition: transform 0.3s;
      }

      &:hover .notification-avatar {
        transform: scale(1.05);
      }
    }
  }
`;

// Update the renderNotificationItem function
const renderNotificationItem = (item, handleNotificationClick, getNotificationIcon, formatTime) => {
  const iconConfig = getNotificationIcon(item);
  const isNew = dayjs().diff(dayjs(item.createdAt), 'hour') < 6; // Consider "new" if less than 6 hours old

  return (
    <List.Item
      className="notification-item group"
      onClick={() => handleNotificationClick(item)}
    >
      <Flex alignItems="center" className="w-full">
        <div className="flex-shrink-0 relative">
          <Avatar
            className="notification-avatar shadow-sm"
            style={{
              backgroundColor: iconConfig.bgColor,
              color: iconConfig.color
            }}
            icon={iconConfig.icon}
          />
          {isNew && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="ml-3 flex-grow min-w-0">
          <div className="flex items-start justify-between mb-1">
            <span className="font-medium text-gray-800 truncate max-w-[180px] group-hover:text-blue-600 transition-colors">
              {item.title}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <small className="text-xs text-gray-500 whitespace-nowrap">
                {formatTime(item.createdAt)}
              </small>
            </div>
          </div>

          <p className="text-sm text-gray-600 m-0 truncate max-w-[240px] group-hover:text-gray-700">
            {item.message}
          </p>

          {item.description && (
            <p className="text-xs text-gray-400 mt-1 truncate max-w-[240px]">
              {item.description}
            </p>
          )}
        </div>
      </Flex>
    </List.Item>
  );
};

const NavNotification = ({ mode }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [list, setList] = useState([]);
  const [isViewTaskModalVisible, setIsViewTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [noti, setNoti] = useState(null);
  const [isViewPlanModalVisible, setIsViewPlanModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allnotidat = useSelector((state) => state.Notifications);
  const fnddatra = useMemo(() => allnotidat?.Notifications?.data || [], [allnotidat?.Notifications?.data]);

  useEffect(() => {
    dispatch(GetAllNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(fnddatra)) {
      setList(fnddatra);
    }
  }, [fnddatra]);

  const getNotificationIcon = (notification) => {
    const types = {
      plan: {
        icon: <ShoppingOutlined />,
        color: '#1890ff',
        bgColor: '#e6f7ff'
      },
      reminder: {
        icon: <ClockCircleOutlined />,
        color: '#faad14',
        bgColor: '#fff7e6'
      },
      warning: {
        icon: <WarningOutlined />,
        color: '#ff4d4f',
        bgColor: '#fff2f0'
      },
      default: {
        icon: <BellOutlined />,
        color: '#1890ff',
        bgColor: '#e6f7ff'
      }
    };

    let type = 'default';
    if (notification.title?.toLowerCase().includes('plan')) {
      type = 'plan';
    } else if (notification.notification_type === 'reminder') {
      type = 'reminder';
    }

    return types[type];
  };

  const formatTime = (timestamp) => {
    const now = dayjs();
    const time = dayjs(timestamp);
    const secondsAgo = now.diff(time, 'second');
    const minutesAgo = now.diff(time, 'minute');
    const hoursAgo = now.diff(time, 'hour');

    if (secondsAgo < 60) {
      return secondsAgo <= 0 ? 'just now' : `${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else if (hoursAgo < 48) {
      return `Yesterday at ${time.format('HH:mm')}`;
    } else {
      return time.format('MMM DD, YYYY HH:mm');
    }
  };

  const handleNotificationClick = (notification) => {
    setIsPopupVisible(false);
    setNoti(notification);

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

    if (notification.title === "New Plan") {
      setSelectedPlan(notification);
      setIsViewPlanModalVisible(true);
    } else {
      setSelectedTask(taskData);
      setIsViewTaskModalVisible(true);
    }
  };

  const handleTaskModalClose = () => {
    setIsViewTaskModalVisible(false);
    setSelectedTask(null);
  };

  const handlePlanModalClose = () => {
    setIsViewPlanModalVisible(false);
    setSelectedPlan(null);
  };

  // Update the EmptyState component
  const EmptyState = ({ type }) => {
    if (type === 'reminder') {
      return (
        <div className="py-6 px-4 text-center">
          <div className="flex flex-col items-center">
            <div className="relative mb-3 animate-bounce">
              <ClockCircleOutlined
                className="text-[28px]"
                style={{
                  color: '#faad14',
                  filter: 'drop-shadow(0 2px 4px rgba(250, 173, 20, 0.2))'
                }}
              />
            </div>

            <h4 className="text-base font-medium text-gray-700">
              No Reminders Yet! 🎉
            </h4>

            {/* Tiny Fun Subtitle */}
            <p className="text-sm text-gray-500 mt-1">
              Smooth sailing ahead! ⛵️
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="py-8 px-4 text-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div
              className="absolute inset-0 rounded-full animate-pulse opacity-50"
              style={{
                background: type === 'reminder' ? '#fff7e6' : '#e6f7ff',
                transform: 'scale(1.2)'
              }}
            />
            <div className="relative">
              {type === 'reminder' ? (
                <ClockCircleOutlined
                  className="text-[32px]"
                  style={{ color: '#faad14' }}
                />
              ) : (
                <BellOutlined
                  className="text-[32px]"
                  style={{ color: '#1890ff' }}
                />
              )}
            </div>
          </div>
          <h4 className="text-base font-medium text-gray-800 mb-1">
            {type === 'reminder' ? "No Reminders" : "All Caught Up"}
          </h4>
          <p className="text-sm text-gray-500">
            {type === 'reminder'
              ? "You're all set for now"
              : "Check back later for updates"}
          </p>
        </div>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'notifications',
      label: (
        <span className="flex items-center gap-2">
          <BellOutlined />
          Notifications
          <Badge
            count={list.filter(n => n.notification_type === 'normal').length}
            style={{ backgroundColor: '#1890ff' }}
          />
        </span>
      ),
      children: (
        <div className="custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {list.filter(n => n.notification_type === 'normal').length > 0 ? (
            <List
              size="small"
              itemLayout="horizontal"
              dataSource={list.filter(n => n.notification_type === 'normal')}
              renderItem={(item) => renderNotificationItem(item, handleNotificationClick, getNotificationIcon, formatTime)}
            />
          ) : (
            <EmptyState type="notification" />
          )}
        </div>
      ),
    },
    {
      key: 'reminders',
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
        <div className="custom-scrollbar" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {list.filter(n => n.notification_type === 'reminder').length > 0 ? (
            <List
              size="small"
              itemLayout="horizontal"
              dataSource={list.filter(n => n.notification_type === 'reminder')}
              renderItem={(item) => renderNotificationItem(item, handleNotificationClick, getNotificationIcon, formatTime)}
            />
          ) : (
            <EmptyState type="reminder" />
          )}
        </div>
      ),
    },
  ];

  const notificationList = (
    <div className="w-[380px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <Flex justifyContent="space-between" alignItems="center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <BellOutlined className="text-lg text-blue-500" />
            </div>
            <h1 className="text-base font-semibold text-gray-800 m-0">
              Notifications & Reminders
            </h1>
          </div>
          {list.length > 0 && (
            <Badge
              count={list.length}
              style={{
                backgroundColor: '#1890ff',
                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
              }}
            />
          )}
        </Flex>
      </div>

      <Tabs
        className="nav-notification-tabs"
        items={tabItems}
        defaultActiveKey="notifications"
      />

      {list?.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
          <a
            className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center justify-center gap-2"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              setIsPopupVisible(false);
              navigate('/app/pages/setting/notificationview');
            }}
          >
            <span>View all</span>
            <small className="text-gray-500">({list.length})</small>
          </a>
        </div>
      )}
    </div>
  );

  // Add styles to your component
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = notificationStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <>
      <Popover
        placement="bottomRight"
        content={notificationList}
        trigger="click"
        overlayClassName="nav-notification"
        overlayInnerStyle={{ padding: 0 }}
        visible={isPopupVisible}
        onVisibleChange={(visible) => setIsPopupVisible(visible)}
      >
        <NavItem mode={mode}>
          <Badge count={list.length}>
            <BellOutlined className="nav-icon mx-auto" type="bell" />
          </Badge>
        </NavItem>
      </Popover>

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
        onEdit={(id) => {/* Handle edit */ }}
        onDelete={(id) => {/* Handle delete */ }}
        onBuy={(plan) => {/* Handle buy */ }}
      />
    </>
  );
};

export default NavNotification;
