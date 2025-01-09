// import React, { useState } from 'react';
// import { Badge, Avatar, List, Button, Popover } from 'antd';
// import {
//   MailOutlined,
//   BellOutlined,
//   WarningOutlined,
//   CheckCircleOutlined,
// } from '@ant-design/icons';
// import NavItem from './NavItem';
// // import NotifactionSilder from '../../views/app-views/pages/setting/NotifactionSilder'; 
// import Flex from 'components/shared-components/Flex';

// const getIcon = (icon) => {
//   switch (icon) {
//     case 'mail':
//       return <MailOutlined />;
//     case 'alert':
//       return <WarningOutlined />;
//     case 'check':
//       return <CheckCircleOutlined />;
//       // case 'slider':
//       // return <NotifactionSilder/>;
//     default:
//       return <MailOutlined />;

//   }
// };

// const getNotificationBody = (list) => {
//   return list.length > 0 ? (
//     <List
//       size="small"
//       itemLayout="horizontal"
//       dataSource={list}
//       renderItem={(item) => (
//         <List.Item className="list-clickable">
//           <Flex alignItems="center">
//             <div className="pr-3">
//               {item.img ? (
//                 <Avatar src={`/img/avatars/${item.img}`} />
//               ) : (
//                 <Avatar
//                   className={`ant-avatar-${item.type}`}
//                   icon={getIcon(item.icon)}
//                 />
//               )}
//             </div>
//             <div className="mr-3">
//               <span className="font-weight-bold text-dark">{item.name} </span>
//               <span className="text-gray-light">{item.desc}</span>
//             </div>
//             <small className="ml-auto">{item.time}</small>
//           </Flex>
//         </List.Item>
//       )}
//     />
//   ) : (
//     <div className="empty-notification">
//       <img
//         src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
//         alt="empty"
//       />
//       <p className="mt-3">You have viewed all notifications</p>
//     </div>
//   );
// };

// const NavNotification = ({ mode }) => {
//   const [data, setData] = useState([
//     {
//       name: 'John Doe',
//       desc: 'Sent you a message',
//       time: '10 minutes ago',
//       icon: 'mail',
//       img: 'user1.png',
//       type: 'default',
//     },
//     {
//       name: 'Jane Smith',
//       desc: 'Liked your post',
//       time: '1 hour ago',
//       icon: 'alert',
//       img: '',
//       type: 'warning',
//     },
//   ]);

//   // Popover content
//   const notificationList = (
//     <div style={{ maxWidth: 300 }}>
//       <div className="border-bottom d-flex justify-content-between align-items-center px-3 py-2">
//         <h4 className="mb-0">Notification</h4>
//         <Button className="text-primary" type="text" size="small">
//           Clear
//         </Button>
//       </div>
//       {/* Notification Body */}
//       <div className="nav-notification-body">
//         {getNotificationBody(data) }
//       </div>
//       {data.length > 0 && (
//         <div className="px-3 py-2 border-top text-center">
//           <a className="d-block" href="#/">
//             View all
//           </a>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>

//       <Popover
//         placement="bottomRight"
//         title={null}
//         content={notificationList}
//         trigger="click"
//         overlayClassName="nav-notification"
//         overlayInnerStyle={{ padding: 0 }}
//       >
//         <NavItem mode={mode}>
//           <Badge>
//             <BellOutlined className="nav-icon mx-auto" />
//           </Badge>
//         </NavItem>
//       </Popover>
//     </>
//   );
// };

// export default NavNotification;








import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Avatar, List, Button, Popover } from 'antd';
import {
    MailOutlined,
    BellOutlined,
    WarningOutlined,
    CheckCircleOutlined,
  } from '@ant-design/icons';
import Flex from 'components/shared-components/Flex';

import { IoMdNotificationsOutline } from "react-icons/io";

const getIcon = (icon) => {
    switch (icon) {
      case 'mail':
        return <MailOutlined />;
      case 'alert':
        return <WarningOutlined />;
      case 'check':
        return <CheckCircleOutlined />;
        // case 'slider':
        // return <NotifactionSilder/>;
      default:
        return <MailOutlined />;
    }
  };

const NavNotification = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const getNotificationBody = (list) => {
    return list.length > 0 ? (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item className="list-clickable">
            <Flex alignItems="center">
              <div className="pr-3">
                {item.img ? (
                  <Avatar src={`/img/avatars/${item.img}`} />
                ) : (
                  <Avatar
                    className={`ant-avatar-${item.type}`}
                    icon={getIcon(item.icon)}
                  />
                )}
              </div>
              <div className="mr-3">
                <span className="font-weight-bold text-dark">{item.name} </span>
                <span className="text-gray-light">{item.desc}</span>
              </div>
              <small className="ml-auto">{item.time}</small>
            </Flex>
          </List.Item>
        )}
      />
    ) : (
      <div className="empty-notification">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="empty"
        />
        <p className="mt-3">You have viewed all notifications</p>
      </div>
    );
  };

  const [data, setData] = useState([
    {
      name: 'John Doe',
      desc: 'Sent you a message',
      time: '10 minutes ago',
      icon: 'mail',
      img: 'user1.png',
      type: 'default',
    },
    {
      name: 'Jane Smith',
      desc: 'Liked your post',
      time: '1 hour ago',
      icon: 'alert',
      img: '',
      type: 'warning',
    },
  ]);

  <div className="nav-notification-body">
    {getNotificationBody(data)}
  </div>
  {
    data.length > 0 && (
      <div className="px-3 py-2 border-top text-center">
        <a className="d-block" href="#/">
          View all
        </a>
      </div>
    )
  }
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    setSelectedOption(null);
  };

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const handleClientClick = (clientId) => {
    navigate(`app/pages/setting/notificationview`);
    setIsPopupVisible(false);
  };

  return (
    <div>
      <div className="relative">
        <button
          onClick={handleClientClick}
          className="text-white"
        >
          <IoMdNotificationsOutline className='text-2xl text-gray-600 mt-4 mr-3' />
        </button>
      </div>
    </div>
  );
};

export default NavNotification;
