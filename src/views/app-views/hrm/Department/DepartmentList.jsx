import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, Button, Modal, message } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useNavigate } from 'react-router-dom';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddDepartment from './AddDepartment';
import EditDepartment from './EditDepartment';

import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteDept, getDept } from './DepartmentReducers/DepartmentSlice';

const DepartmentList = () => {
  const [users, setUsers] = useState(userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);
  const [isEditDepartmentModalVisible, setIsEditDepartmentModalVisible] = useState(false);
  const  [dept,setDept] = useState("");

  const tabledata = useSelector((state) => state.Department);


  // const navigate = useNavigate();

  const openAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(true);
  };

  const closeAddDepartmentModal = () => {
    setIsAddDepartmentModalVisible(false);
  };



  const openEditDepartmentModal = () => {
    setIsEditDepartmentModalVisible(true);
  };

  const closeEditDepartmentModal = () => {
    setIsEditDepartmentModalVisible(false);
  };


  const handleParticularDepartmentModal = () => {
    navigate('/app/hrm/department/particulardepartment', { state: { user: selectedUser } });
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  useEffect(()=>{
    dispatch(getDept())
  },[dispatch]);

    useEffect(() => {
      if (tabledata && tabledata.Department && tabledata.Department.data) {
        setUsers(tabledata.Department.data);
      }
    }, [tabledata]);

  const deleteUser = (userId) => {
    // dispatch(DeleteDept());
    // dispatch(getDept());
    // setUsers(users.filter(item => item.id !== userId));
    // message.success({ content: `Deleted user ${userId}`, duration: 2 });

      dispatch(DeleteDept( userId ))
            .then(() => {
              dispatch(getDept());
              message.success('Department Deleted successfully!');
              setUsers(users.filter(item => item.id !== userId));
              navigate('/app/hrm/department');
            })
            .catch((error) => {
              message.error('Failed to update department.');
              console.error('Edit API error:', error);
            });
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editDept = (Deptid) =>{
    openEditDepartmentModal();
    setDept(Deptid)

  }

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Button type="" icon={<EyeOutlined />} onClick={handleParticularDepartmentModal} size="small">
          <span>View Details</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="" icon={<EditOutlined />} onClick={() => editDept(elm.id)} size="small">
          <span>Edit</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="" icon={<PushpinOutlined />} onClick={() => showUserProfile(elm)} size="small">
          <span>Pin</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button type="" icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small">
          <span>Delete</span>
        </Button>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Department',
      dataIndex: 'department_name',
      sorter: (a, b) => a.department.length - b.department.length,
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
          <Button type="primary" className="ml-2" onClick={openAddDepartmentModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Department Modal */}
      <Modal
        title="Add Department"
        visible={isAddDepartmentModalVisible}
        onCancel={closeAddDepartmentModal}
        footer={null}
        width={800}
      >
        <AddDepartment onClose={closeAddDepartmentModal} />
      </Modal>



      {/* Edit Department Modal */}
      <Modal
        title="Edit Department"
        visible={isEditDepartmentModalVisible}
        onCancel={closeEditDepartmentModal}
        footer={null}
        width={800}
      >
        <EditDepartment onClose={closeEditDepartmentModal} comnyid={dept}/>
      </Modal>

    </Card>
  );
};

export default DepartmentList;










// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import { useNavigate } from 'react-router-dom';

// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddDepartment from './AddDepartment';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class DepartmentList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddDepartmentModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddDepartmentModal = () => {
//     this.setState({ isAddDepartmentModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddDepartmentModal = () => {
//     this.setState({ isAddDepartmentModalVisible: false });
//   };

//   onSearch = (e) => {
//     const { list } = this.state;
//     const value = e.currentTarget.value;
//     const searchArray = value ? list : OrderListData;
//     const data = utils.wildCardSearch(searchArray, value);
//     this.setState({ list: data, selectedRowKeys: [] });
//   };

//   deleteUser = (userId) => {
//     this.setState({
//       users: this.state.users.filter(item => item.id !== userId),
//     });
//     message.success({ content: `Deleted user ${userId}`, duration: 2 });
//   };

//   showUserProfile = (userInfo) => {
//     this.setState({
//       userProfileVisible: true,
//       selectedUser: userInfo,
//     });
//   };

//   closeUserProfile = () => {
//     this.setState({
//       userProfileVisible: false,
//       selectedUser: null,
//     });
//   };

//   render() {
//     const { users, userProfileVisible, selectedUser, isAddDepartmentModalVisible } = this.state;


//     const dropdownMenu = elm => (
//         <Menu>
            
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                 <Button type="" className="" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="">View Details</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                  <Button type="" className="" icon={<MailOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="">Send Mail</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <EyeOutlined />
//                     <span className="ml-2">View Details</span> */}
                 
//                  <Button type="" className="" icon={<PushpinOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
//                 <span className="ml-2">Pin</span>
//                 </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     {/* <DeleteOutlined />
//                     <span className="ml-2">Delete</span> */}
                
//     <Button type="" className="" icon={<DeleteOutlined />} onClick={() => {this.deleteUser(elm.id)}} size="small"> 
//     <span className="">Delete</span>
//     </Button>
    
    
//                 </Flex>
//             </Menu.Item>	
//         </Menu>
//     );


//     const tableColumns = [
//     //   {
//     //     title: 'User',
//     //     dataIndex: 'name',
//     //     render: (_, record) => (
//     //       <div className="d-flex">
//     //         <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
//     //       </div>
//     //     ),
//     //     sorter: {
//     //       compare: (a, b) => {
//     //         a = a.name.toLowerCase();
//     //         b = b.name.toLowerCase();
//     //         return a > b ? -1 : b > a ? 1 : 0;
//     //       },
//     //     },
//     //   },
//       {
//         title: 'Department',
//         dataIndex: 'department',
//         sorter: {
//           compare: (a, b) => a.department.length - b.department.length,
//         },
//       },
//     //   {
//     //     title: 'Last online',
//     //     dataIndex: 'lastOnline',
//     //     render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
//     //     sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
//     //   },
//     //   {
//     //     title: 'Status',
//     //     dataIndex: 'status',
//     //     render: (status) => (
//     //       <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//     //         {status}
//     //       </Tag>
//     //     ),
//     //     sorter: {
//     //       compare: (a, b) => a.status.length - b.status.length,
//     //     },
//     //   },
//       {
//         title: 'Action',
//         dataIndex: 'actions',
//         render: (_, elm) => (
//             <div className="text-center">
//                 <EllipsisDropdown menu={dropdownMenu(elm)}/>
//             </div>
//         )
//     },
//     //   {
//     //     title: 'Action',
//     //     dataIndex: 'actions',
//     //     render: (_, elm) => (
//     //       <div className="text-right d-flex justify-content-center">
//     //         <Tooltip title="View">
//     //           <Button
//     //             type="primary"
//     //             className="mr-2"
//     //             icon={<EyeOutlined />}
//     //             onClick={() => this.showUserProfile(elm)}
//     //             size="small"
//     //           />
//     //         </Tooltip>
//     //         <Tooltip title="Delete">
//     //           <Button danger icon={<DeleteOutlined />} onClick={() => this.deleteUser(elm.id)} size="small" />
//     //         </Tooltip>
//     //       </div>
//     //     ),
//     //   },
//     ];

//     return (
//       <Card bodyStyle={{ padding: '-3px' }}>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button type="primary" className="ml-2" onClick={this.openAddDepartmentModal}>
//               <PlusOutlined />
//               <span>New</span>
//             </Button>
//             <Button type="primary" icon={<FileExcelOutlined />} block>
//               Export All
//             </Button>
//           </Flex>
//         </Flex>
//         <div className="table-responsive mt-2">
//           <Table columns={tableColumns} dataSource={users} rowKey="id" />
//         </div>
//         <UserView data={selectedUser} visible={userProfileVisible} close={() => this.closeUserProfile()} />

//         {/* Add Employee Modal */}
//         <Modal
//           title="Add Department"
//           visible={isAddDepartmentModalVisible}
//           onCancel={this.closeAddDepartmentModal}
//           footer={null}
//           width={800}
//         >
//           <AddDepartment onClose={this.closeAddDepartmentModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default DepartmentList;









