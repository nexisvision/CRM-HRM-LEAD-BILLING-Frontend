import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { List, Card, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AddInterview from './AddInterview';
import EditInterview from './EditInterview';

const localizer = momentLocalizer(moment);

const InterviewList = () => {
  const [interviewSchedules, setInterviewSchedules] = useState([
    {
      id: 1,
      title: 'Highly Competitive Fashion Jobs',
      interviewer: 'Candice',
      date: new Date(2023, 1, 17, 11, 35), // Feb 17, 2023 11:35 AM
    },
    {
      id: 2,
      title: 'Highly Projected Growth for Accounting Jobs',
      interviewer: 'Allegra Dunn',
      date: new Date(2024, 10, 30, 10, 0), // Nov 30, 2024 10:00 AM
    },
  ]);

  const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] = useState(false);
  const [isEditInterviewModalVisible, setIsEditInterviewModalVisible] = useState(false);


  const openAddInterviewModal = () => setIsAddInterviewModalVisible(true);
  const closeAddInterviewModal = () => setIsAddInterviewModalVisible(false);



  const openEditInterviewModal = () => setIsEditInterviewModalVisible(true);
  const closeEditInterviewModal = () => setIsEditInterviewModalVisible(false);


  const addInterview = (newInterview) => {
    setInterviewSchedules((prev) => [...prev, newInterview]);
    closeAddInterviewModal();
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#34C759',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        padding: '5px',
      },
    };
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Calendar Section */}
      <div style={{ flex: 2 }}>
        <h3 className='text-lg font-bold mb-4'>Calendar</h3>
        <Calendar
          localizer={localizer}
          events={interviewSchedules.map((item) => ({
            title: `${item.title} - ${item.interviewer}`,
            start: new Date(item.date),
            end: new Date(item.date),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
        />
      </div>

      {/* Schedule List Section */}
      <div style={{ flex: 1 }}>

      <div className='flex justify-end'>
        <Button type="primary" className="mt-2" onClick={openAddInterviewModal}>
          <PlusOutlined /> New
        </Button>
        </div>
        <h3 className='text-lg font-bold mb-4'>Schedule List</h3>
        <List
          dataSource={interviewSchedules}
          renderItem={(item) => (
            <Card style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ color: '#34C759', margin: 0 }}>{item.title}</h4>
                <p style={{ margin: '8px 0 4px' }}>{item.interviewer}</p>
                <p style={{ margin: 0 }}>
                  {moment(item.date).format('MMM DD, YYYY hh:mm A')}
                </p>
              </div>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ marginRight: '10px' }}
                  onClick={openEditInterviewModal}
                />
                <Button
                  type="default"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => console.log(`Delete interview with ID: ${item.id}`)}
                />
              </div>
            </Card>
          )}
        />
        {/* <Button type="primary" className="mt-2" onClick={openAddInterviewModal}>
          <PlusOutlined /> New
        </Button> */}
      </div>

      {/* Add Interview Modal */}
      <Modal
        title="Add Interview"
        visible={isAddInterviewModalVisible}
        onCancel={closeAddInterviewModal}
        footer={null}
        width={1000}
      >
        <AddInterview onAddInterview={addInterview} />
      </Modal>
      <Modal
        title="Edit Interview"
        visible={isEditInterviewModalVisible}
        onCancel={closeEditInterviewModal}
        footer={null}
        width={1000}
      >
        <EditInterview onEditInterview={EditInterview} />
      </Modal>
    </div>
  );
};

export default InterviewList;














// import React, { useState } from 'react';
// import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { List, Card, Button, Modal } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import AddInterview from './AddInterview';

// const InterviewList = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] = useState(false);
//   const [interviewSchedules, setInterviewSchedules] = useState([
//     {
//       id: 1,
//       title: 'Highly Competitive Fashion Jobs',
//       interviewer: 'Candice',
//       date: '2023-02-17',
//       time: '11:35 AM',
//     },
//     {
//       id: 2,
//       title: 'Software Engineer Role',
//       interviewer: 'John Doe',
//       date: '2024-11-28',
//       time: '02:00 PM',
//     },
//   ]);

//   const onDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   const openAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(true);
//   };

//   const closeAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(false);
//   };

//   const addInterview = (newInterview) => {
//     setInterviewSchedules((prev) => [...prev, newInterview]);
//     closeAddInterviewModal();
//   };

//   const tileContent = ({ date, view }) => {
//     if (view === 'month') {
//       const hasInterview = interviewSchedules.some(
//         (schedule) => new Date(schedule.date).toDateString() === date.toDateString()
//       );
//       return hasInterview ? <div className="dot" style={{ backgroundColor: '#34C759', borderRadius: '50%', height: '8px', width: '8px', margin: 'auto' }}></div> : null;
//     }
//   };

//   return (
//     <div className="interview-list-container" style={{ display: 'flex', padding: '20px' }}>
//       {/* Calendar Section */}
//       <div style={{ flex: 2, marginRight: '20px' }}>
//         <h3>Calendar</h3>
//         <Calendar
//           onChange={onDateChange}
//           value={selectedDate}
//           locale="en-US"
//           tileContent={tileContent}
//         />
//       </div>

//       {/* Schedule List Section */}
//       <div style={{ flex: 1 }}>
//         <h3>Schedule List</h3>
//         <List
//           dataSource={interviewSchedules}
//           renderItem={(item) => (
//             <Card style={{ marginBottom: '16px' }}>
//               <div>
//                 <h4 style={{ color: '#34C759', margin: 0 }}>{item.title}</h4>
//                 <p style={{ margin: '8px 0 4px' }}>{item.interviewer}</p>
//                 <p style={{ margin: 0 }}>
//                   {item.date} {item.time}
//                 </p>
//               </div>
//               <div style={{ textAlign: 'right', marginTop: '10px' }}>
//                 <Button
//                   type="default"
//                   icon={<EditOutlined />}
//                   style={{ marginRight: '10px' }}
//                   onClick={() => console.log(`Edit interview with ID: ${item.id}`)}
//                 />
//                 <Button
//                   type="default"
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={() => console.log(`Delete interview with ID: ${item.id}`)}
//                 />
//               </div>
//             </Card>
//           )}
//         />
//       </div>

//       <Button type="primary" className="ml-2" onClick={openAddInterviewModal}>
//         <PlusOutlined />
//         <span>New</span>
//       </Button>

//       <Modal
//         title="Add Interview"
//         visible={isAddInterviewModalVisible}
//         onCancel={closeAddInterviewModal}
//         footer={null}
//         width={800}
//       >
//         <AddInterview onAddInterview={addInterview} />
//       </Modal>
//     </div>
//   );
// };

// export default InterviewList;





















// import React, { useState } from 'react';
// import { Calendar } from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { List, Card, Button, Modal } from 'antd';
// import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
// import AddInterview from './AddInterview';

// const InterviewList = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] = useState(false);


//   const onDateChange = (date) => {
//     setSelectedDate(date);
//   };


//     // Open Add Job Modal
//   const openAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(false);
//   };
//   // Mock Data for Schedule List
//   const interviewSchedules = [
//     {
//       id: 1,
//       title: 'Highly Competitive Fashion Jobs',
//       interviewer: 'Candice',
//       date: 'Feb 17, 2023',
//       time: '11:35 AM',
//     },
//     {
//       id: 2,
//       title: 'Software Engineer Role',
//       interviewer: 'John Doe',
//       date: 'Nov 28, 2024',
//       time: '02:00 PM',
//     },
//   ];

//   return (
//     <div className="interview-list-container" style={{ display: 'flex', padding: '20px' }}>
//       {/* Calendar Section */}
//       <div style={{ flex: 2, marginRight: '20px' }}>
//         <h3>Calendar</h3>
//         <Calendar
//           onChange={onDateChange}
//           value={selectedDate}
//           locale="en-US"
//           tileClassName="calendar-tile"
//         />
//       </div>
   
//       {/* Schedule List Section */}
//       <div style={{ flex: 1 }}>
//         <h3>Schedule List</h3>
//         <List
//           dataSource={interviewSchedules}
//           renderItem={(item) => (
//             <Card style={{ marginBottom: '16px' }}>
//               <div>
//                 <h4 style={{ color: '#34C759', margin: 0 }}>{item.title}</h4>
//                 <p style={{ margin: '8px 0 4px' }}>{item.interviewer}</p>
//                 <p style={{ margin: 0 }}>
//                   {item.date} {item.time}
//                 </p>
//               </div>
//               <div style={{ textAlign: 'right', marginTop: '10px' }}>
//                 <Button
//                   type="default"
//                   icon={<EditOutlined />}
//                   style={{ marginRight: '10px' }}
//                   onClick={() => console.log(`Edit interview with ID: ${item.id}`)}
//                 />
//                 <Button
//                   type="default"
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={() => console.log(`Delete interview with ID: ${item.id}`)}
//                 />
//               </div>
//             </Card>
//           )}
//         />
//       </div>
//        <Button type="primary" className="ml-2" onClick={openAddInterviewModal}>
//                  <PlusOutlined />
//             <span>New</span>
//           </Button>
//       <Modal
//          title=""
//          visible={isAddInterviewModalVisible}
//          onCancel={closeAddInterviewModal}
//          footer={null}
//          width={800}
//        >
//          <AddInterview onClose={closeAddInterviewModal} />
//        </Modal>
//     </div>
//   );
// };

// export default InterviewList;










// import React, { useState } from 'react';
// import { Card, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../pages/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// import { AnnualStatisticData } from '../../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddInterview from './AddInterview';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import utils from 'utils';

// const InterviewList = () => {
//   const [users, setUsers] = useState(userData);
//   const [list, setList] = useState(OrderListData);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [isAddInterviewModalVisible, setIsAddInterviewModalVisible] = useState(false);
//   const [annualStatisticData] = useState(AnnualStatisticData);

//   // Open Add Job Modal
//   const openAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(true);
//   };

//   // Close Add Job Modal
//   const closeAddInterviewModal = () => {
//     setIsAddInterviewModalVisible(false);
//   };

//   // Search functionality
//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     setList(data);
//     setSelectedRowKeys([]);
//   };

//   // Delete user
//   const deleteUser = (userId) => {
//     setUsers(users.filter((item) => item.id !== userId));
//     message.success({ content: `Deleted user ${userId}`, duration: 2 });
//   };

//   // Show user profile
//   const showUserProfile = (userInfo) => {
//     setSelectedUser(userInfo);
//     setUserProfileVisible(true);
//   };

//   // Close user profile
//   const closeUserProfile = () => {
//     setSelectedUser(null);
//     setUserProfileVisible(false);
//   };

//   const dropdownMenu = (elm) => (
//     <Menu>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<EyeOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="">View Details</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<MailOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="">Send Mail</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<PushpinOutlined />}
//             onClick={() => showUserProfile(elm)}
//             size="small"
//           >
//             <span className="ml-2">Pin</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//       <Menu.Item>
//         <Flex alignItems="center">
//           <Button
//             type=""
//             className=""
//             icon={<DeleteOutlined />}
//             onClick={() => deleteUser(elm.id)}
//             size="small"
//           >
//             <span className="">Delete</span>
//           </Button>
//         </Flex>
//       </Menu.Item>
//     </Menu>
//   );

//   const tableColumns = [
//     {
//       title: 'Branch',
//       dataIndex: 'branch',
//       sorter: {
//         compare: (a, b) => a.branch.length - b.branch.length,
//       },
//     },
//     {
//       title: 'Title',
//       dataIndex: 'title',
//       sorter: {
//         compare: (a, b) => a.title.length - b.title.length,
//       },
//     },
//     {
//       title: 'Start Date',
//       dataIndex: 'startdate',
//       sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//     },
//     {
//       title: 'End Date',
//       dataIndex: 'enddate',
//       sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       render: (status) => (
//         <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//           {status}
//         </Tag>
//       ),
//       sorter: {
//         compare: (a, b) => a.status.length - b.status.length,
//       },
//     },
//     {
//       title: 'Created At',
//       dataIndex: 'createdat',
//       sorter: (a, b) => dayjs(a.createdat).unix() - dayjs(b.createdat).unix(),
//     },
//     {
//       title: 'Action',
//       dataIndex: 'actions',
//       render: (_, elm) => (
//         <div className="text-center">
//           <EllipsisDropdown menu={dropdownMenu(elm)} />
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Card bodyStyle={{ padding: '-3px' }}>
//       {/* <Row gutter={16}>
//         {annualStatisticData.map((elm, i) => (
//           <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
//             <StatisticWidget
//               title={elm.title}
//               value={elm.value}
//               status={elm.status}
//               subtitle={elm.subtitle}
//             />
//           </Col>
//         ))}
//       </Row> */}
//       <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//         <Flex className="mb-1" mobileFlex={false}>
//           <div className="mr-md-3 mb-3">
//             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//           </div>
//         </Flex>
//         <Flex gap="7px">
//           <Button type="primary" className="ml-2" onClick={openAddInterviewModal}>
//             <PlusOutlined />
//             <span>New</span>
//           </Button>
//           <Button type="primary" icon={<FileExcelOutlined />} block>
//             Export All
//           </Button>
//         </Flex>
//       </Flex>
//       <div className="table-responsive mt-2">
//         <Table
//           columns={tableColumns}
//           dataSource={users}
//           rowKey="id"
//           scroll={{ x: 1200 }}
//         />
//       </div>
//       <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

//       {/* Add Job Modal */}
//       <Modal
//         title=""
//         visible={isAddInterviewModalVisible}
//         onCancel={closeAddInterviewModal}
//         footer={null}
//         width={800}
//       >
//         <AddInterview onClose={closeAddInterviewModal} />
//       </Modal>
//     </Card>
//   );
// };

// export default InterviewList;

