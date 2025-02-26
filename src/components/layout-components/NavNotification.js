import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Avatar, List, Popover } from 'antd';
import {
  MailOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from 'components/shared-components/Flex';
import { BellOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { GetAllNotifications } from 'views/app-views/pages/setting/NotificationReducer/NotificationSlice';

// Helper to choose icons based on the type
const getIcon = (icon) => {
  switch (icon) {
    case 'mail':
      return <MailOutlined />;
    case 'alert':
      return <WarningOutlined />;
    case 'check':
      return <CheckCircleOutlined />;
    default:
      return <MailOutlined />;
  }
};

const NavNotification = ({ mode }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allnotidat = useSelector((state) => state.Notifications);
  const fnddatra = allnotidat?.Notifications?.data || [];

  useEffect(() => {
    dispatch(GetAllNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(fnddatra)) {
      setList(fnddatra);
    }
  }, [fnddatra]);

  const getNotificationBody = (notifications) => {
    return notifications?.length > 0 ? (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="list-clickable">
            <Flex alignItems="center">
              <div className="pr-3">
                {item?.img ? (
                  <Avatar src={`/img/avatars/${item?.img}`} />
                ) : (
                  <Avatar
                    className={`ant-avatar-${item?.type}`}
                    icon={getIcon(item?.icon)}
                  />
                )}
              </div>
              <div className="mr-3">
                <span className="font-weight-bold text-dark">{item?.title} </span>
                <span className="text-gray-light">{item?.message}</span>
              </div>
              <small className="ml-auto">{item?.updatedAt}</small>
            </Flex>
          </List.Item>
        )}
      />
    ) : (
      <div className="empty-notification">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="empty"
          style={{ width: '100px', height: '100px',marginLeft: '45px', margin: 'auto' }}
        />
        <p className="mt-3">You have viewed all notifications</p>
      </div>
    );
  };

  const notificationList = (
    <div className="max-w-xs w-full bg-white shadow-md rounded-lg border border-gray-200">
      <div className="border-b flex justify-between items-center px-3 py-2">
        <h1 className="mb-0 font-bold">Notifications</h1  >
      </div>
      <div className="nav-notification-body">{getNotificationBody(list)}</div>
      {list?.length > 0 && (
        <div className="px-3 py-2 border-top text-center">
          <a
            className="d-block"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleDataClick();
            }}
          >
            View all
          </a>
        </div>
      )}
    </div>
  );

  const handleDataClick = () => {
    setIsPopupVisible(false);
    navigate(`/app/pages/setting/notificationview`);
  };

  return (
    <Popover
      placement="bottomRight"
      title={null}
      content={notificationList}
      trigger="click"
      overlayClassName="nav-notification"
      overlayInnerStyle={{ padding: 0 }}
      visible={isPopupVisible}
      onVisibleChange={(visible) => setIsPopupVisible(visible)}
    >
      <NavItem mode={mode}>
        <Badge count={list.length}>
          <BellOutlined className="nav-icon mx-auto " type="bell" />
        </Badge>
      </NavItem>
    </Popover>
  );
};

export default NavNotification;
