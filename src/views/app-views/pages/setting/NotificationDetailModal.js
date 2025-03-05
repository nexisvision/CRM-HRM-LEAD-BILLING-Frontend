import React from 'react';
import { Modal, Typography, Tag, Divider, Button } from 'antd';
import {
  BellOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const NotificationDetailModal = ({ visible, notification, onClose, onViewTask }) => {
  if (!notification) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reminder':
        return <ClockCircleOutlined className="text-orange-400" />;
      case 'warning':
        return <WarningOutlined className="text-red-500" />;
      default:
        return <InfoCircleOutlined className="text-blue-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ff4d4f',
      medium: '#faad14',
      low: '#52c41a'
    };
    return colors[priority] || colors.medium;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getTypeIcon(notification.notification_type)}
          </div>
          <span>Notification Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={
        notification.task_id ? (
          <div className="flex justify-end">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                onClose();
                onViewTask(notification);
              }}
            >
              View Full Task Details
            </Button>
          </div>
        ) : null
      }
      width={600}
    >
      <div className="py-4">
        {/* Title Section */}
        <div className="mb-4">
          <Title level={4} className="!mb-2">{notification.title}</Title>
          <div className="flex gap-2 flex-wrap">
            {notification.priority && (
              <Tag color={getPriorityColor(notification.priority)} className="uppercase">
                {notification.priority} Priority
              </Tag>
            )}
            {notification.task_id && (
              <Tag color="#1890ff" icon={<InfoCircleOutlined />}>
                Task Related
              </Tag>
            )}
          </div>
        </div>

        <Divider className="my-4" />

        {/* Description Section */}
        <div className="mb-4">
          <Text type="secondary" className="text-sm">Description</Text>
          <div className="mt-2">
            <Text>{notification.description}</Text>
          </div>
        </div>

        {/* Task Information (if available) */}
        {notification.task_id && (
          <>
            <Divider className="my-4" />
            <div className="mb-4">
              <Text type="secondary" className="text-sm">Task Information</Text>
              <div className="mt-2 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Text strong>Task ID: {notification.task_id}</Text>
                  {notification.status && (
                    <Tag color={
                      notification.status === 'Completed' ? 'success' :
                      notification.status === 'In Progress' ? 'processing' :
                      notification.status === 'On Hold' ? 'warning' : 'default'
                    }>
                      {notification.status}
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Metadata Section */}
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text type="secondary" className="text-sm">Type</Text>
              <div className="mt-1">
                <Tag icon={getTypeIcon(notification.notification_type)}>
                  {notification.notification_type?.charAt(0).toUpperCase() + notification.notification_type?.slice(1)}
                </Tag>
              </div>
            </div>
            <div>
              <Text type="secondary" className="text-sm">Created At</Text>
              <div className="mt-1">
                <Text>{dayjs(notification.createdAt).format('MMMM DD, YYYY HH:mm:ss')}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationDetailModal; 