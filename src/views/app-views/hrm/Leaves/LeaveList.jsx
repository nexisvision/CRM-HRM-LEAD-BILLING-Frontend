import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddLeave from './AddLeave';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import ViewLeave from './ViewLeave';
import EditLeave from './EditLeave';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { DeleteLea, GetLeave } from './LeaveReducer/LeaveSlice';
import { empdata } from '../Employee/EmployeeReducers/EmployeeSlice';
const LeaveList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData); // Initialize with OrderListData
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddLeaveModalVisible, setIsAddLeaveModalVisible] = useState(false); // State to toggle Add Employee Modal
  const [isViewLeaveModalVisible, setIsViewLeaveModalVisible] = useState(false); 
  const [isEditLeaveModalVisible, setIsEditLeaveModalVisible] = useState(false); // State to toggle Add Employee Modal
  const [editid,setEditid]= useState(null);
  const dispatch = useDispatch();
  console.log("xiiiii",editid)
   const tabledata = useSelector((state) => state.Leave);
  // State to toggle Add Employee Modal
  // Open Add Employee Modal
  const openAddLeaveModal = () => {
    setIsAddLeaveModalVisible(true);
  };
  // Close Add Employee Modal
  const closeAddLeaveModal = () => {
    setIsAddLeaveModalVisible(false);
  };
  // Open Add Employee Modal
  const openViewLeaveModal = () => {
    setIsViewLeaveModalVisible(true);
  };
  // Close Add Employee Modal
  const closeViewLeaveModal = () => {
    setIsViewLeaveModalVisible(false);
  };
   // Open Add Employee Modal
   const openEditLeaveModal = () => {
    setIsEditLeaveModalVisible(true);
  };
  // Close Add Employee Modal
  const closeEditLeaveModal = () => {
    setIsEditLeaveModalVisible(false);
  };
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };
  const deleteUser = async (userId) => {
    try {
      console.log("dddddd",userId)
      await dispatch(DeleteLea(userId)); 
  
      const updatedData = await dispatch(GetLeave());
  
      setUsers(users.filter(item => item.id !== userId));
  
      message.success({ content: 'Deleted user successfully', duration: 2 });
    } catch (error) {
      // message.error({ content: 'Failed to delete user', duration: 2 });
      console.error('Error deleting user:', error);
    }
  };
  const Editfun = async (userId) => {
    // showUserProfile(elm);
    openEditLeaveModal();
    setEditid(userId);
  };
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };
  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };
  
  useEffect(() => {
    dispatch(GetLeave());
  }, [dispatch]);
  
   useEffect(() => {
      dispatch(empdata());  // Fetch employee data on mount
    }, [dispatch]);
  
    useEffect(() => {
      if (tabledata && tabledata.Leave && tabledata.Leave.data) {
        setUsers(tabledata.Leave.data);
      }
    }, [tabledata]);
    const editleave = (id) =>{
      openEditLeaveModal();
      setEditid(id);
    }
    const ViewData = (id) =>{
      openViewLeaveModal();
      setEditid(id);
    }
  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<EyeOutlined />}   onClick={() => ViewData(elm.id)} size="small">
            <span>View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<EditOutlined />}   onClick={() => editleave(elm.id)}  size="small">
            <span>Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<PushpinOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small">
            <span>Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );
  const tableColumns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: 'Applied On',
      dataIndex: 'appliedon',
      sorter: (a, b) => dayjs(a.appliedon).unix() - dayjs(b.appliedon).unix(),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
    },
    {
      title: 'Total Days',
      dataIndex: 'totaldays',
      sorter: (a, b) => a.totaldays - b.totaldays,
    },
    {
      title: 'Leave Reason',
      dataIndex: 'reason',
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];
  return (
    <Card bodyStyle={{ padding: '-3px' }}>
    <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
      <Flex className="mb-1" mobileFlex={false}>
        <div className="mr-md-3 mb-3">
          <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
        </div>
      </Flex>
      <Flex gap="7px">
        <Button type="primary" className="ml-2" onClick={openAddLeaveModal}>
          <PlusOutlined />
          <span>New</span>
        </Button>
        <Button type="primary" icon={<FileExcelOutlined />} block>
          Export All
        </Button>
      </Flex>
    </Flex>
    <div className="table-responsive mt-2">
      <Table columns={tableColumns} dataSource={users} rowKey="id" scroll={{ x: 1200 }} />
    </div>
    <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />
    {/* Add Employee Modal */}
    <Modal
      title="Add Leave"
      visible={isAddLeaveModalVisible}
      onCancel={closeAddLeaveModal}
      footer={null}
      width={800}
    >
      <AddLeave onClose={closeAddLeaveModal} />
    </Modal>
{/* Add Employee Modal */}
<Modal
      title="Edit Leave"
      visible={isEditLeaveModalVisible}
      onCancel={closeEditLeaveModal}
      footer={null}
      width={800}
    >
      <EditLeave onClose={closeEditLeaveModal} editid={editid} />
    </Modal>
    
    {/* Add Employee Modal */}
    <Modal
      title="Leave"
      visible={isViewLeaveModalVisible}
      onCancel={closeViewLeaveModal}
      footer={null}
      width={800}
    >
      <ViewLeave onClose={closeViewLeaveModal} editid={editid} />
    </Modal>
  </Card>
  );
};
export default LeaveList;
// import React, { useEffect, useState } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddLeave from './AddLeave';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';
// import ViewLeave from './ViewLeave';
// import EditLeave from './EditLeave';
// import { empdata } from '../Employee/EmployeeReducers/EmployeeSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { DeleteLea, GetLeave } from './LeaveReducer/LeaveSlice';
// const LeaveList = () => {
//   const [users, setUsers] = useState(userData);
//   const [userProfileVisible, setUserProfileVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [list, setList] = useState(OrderListData); 
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [isAddLeaveModalVisible, setIsAddLeaveModalVisible] = useState(false); 
//   const [isViewLeaveModalVisible, setIsViewLeaveModalVisible] = useState(false); 
//   const [isEditLeaveModalVisible, setIsEditLeaveModalVisible] = useState(false);
//   const [editid,setEditid]= useState(null);
//   console.log("xiiiii",editid)
//    const tabledata = useSelector((state) => state.Leave);
//     // const allempdata = useSelector((state) => state.empdata);
//    console.log("mmmmm",tabledata)
//   const dispatch = useDispatch();
//   // State to toggle Add Employee Modal
//   // Open Add Employee Modal
//   const openAddLeaveModal = () => {
//     setIsAddLeaveModalVisible(true);
//   };
//   // Close Add Employee Modal
//   const closeAddLeaveModal = () => {
//     setIsAddLeaveModalVisible(false);
//   };
//   // Open Add Employee Modal
//   const openViewLeaveModal = () => {
//     setIsViewLeaveModalVisible(true);
//   };
//   // Close Add Employee Modal
//   const closeViewLeaveModal = () => {
//     setIsViewLeaveModalVisible(false);
//   };
//    // Open Add Employee Modal
//    const openEditLeaveModal = () => {
//     setIsEditLeaveModalVisible(true);
//   };
//   // Close Add Employee Modal
//   const closeEditLeaveModal = () => {
//     setIsEditLeaveModalVisible(false);
//   };
//   const onSearch = (e) => {
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     setList(data);
//     setSelectedRowKeys([]);
//   };
//   // const deleteUser = (userId) => {
//   //   dispatch(DeleteLea(userId))
//   //   setUsers(users.filter(item => item.id !== userId));
//   //   message.success({ content: `Deleted user ${userId}`, 