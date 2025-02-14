import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal, Rate } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined,EditOutlined , PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useNavigate } from 'react-router-dom';
import AddAppraisal from './AddAppraisal';
import { utils, writeFile } from "xlsx";
import EditAppraisal from './EditAppraisal';
import { Model } from 'miragejs';
import ViewAppraisal from './ViewAppraisal';
import { empdata } from '../../Employee/EmployeeReducers/EmployeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { deleteAppraisal, getAppraisals } from './AppraisalReducers/AppraisalSlice';
const AppraisalList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
    const [id, setId] = useState(null);
   const navigate = useNavigate();
  const [isAddAppraisalModalVisible, setIsAddAppraisalModalVisible] = useState(false);
  const [isEditAppraisalModalVisible, setIsEditAppraisalModalVisible] = useState(false);
  const [isViewAppraisalModalVisible, setIsViewAppraisalModalVisible] = useState(false);
  const dispatch = useDispatch();


  const user = useSelector((state) => state.user.loggedInUser.username);
    const tabledata = useSelector((state) => state.appraisal);
    const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
 const employeeData = useSelector((state) => state.employee?.employee?.data || []);

  //// permission
                    
      const roleId = useSelector((state) => state.user.loggedInUser.role_id);
      const roles = useSelector((state) => state.role?.role?.data);
      const roleData = roles?.find(role => role.id === roleId);
   
      const whorole = roleData.role_name;
   
      const parsedPermissions = Array.isArray(roleData?.permissions)
      ? roleData.permissions
      : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];
    
    
      let allpermisson;  
   
      if (parsedPermissions["extra-hrm-performance-appraisal"] && parsedPermissions["extra-hrm-performance-appraisal"][0]?.permissions) {
        allpermisson = parsedPermissions["extra-hrm-performance-appraisal"][0].permissions;
        // console.log('Parsed Permissions:', allpermisson);
      
      } else {
        // console.log('extra-hrm-performance-appraisal is not available');
      }
      
      const canCreateClient = allpermisson?.includes('create');
      const canEditClient = allpermisson?.includes('edit');
      const canDeleteClient = allpermisson?.includes('delete');
      const canViewClient = allpermisson?.includes('view');
   
      ///endpermission

  const openAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(true);
  };

  const closeAddAppraisalModal = () => {
    setIsAddAppraisalModalVisible(false);
  };

  const openViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(true);
  };

  const closeViewAppraisalModal = () => {
    setIsViewAppraisalModalVisible(false);
  };



  const openEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(true);
  };

  const closeEditAppraisalModal = () => {
    setIsEditAppraisalModalVisible(false);
  };

useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => { 
    dispatch(getAppraisals());
  }, [dispatch]);

   useEffect(() => {
      dispatch(empdata());
    }, [dispatch]);




useEffect(() => {
  if (tabledata?.Appraisals?.data) {
    const mappedData = tabledata.Appraisals.data.filter((item) => item.created_by === user).map((appraisal) => {
      const branch = branchData.find((b) => b.id === appraisal.branch)?.branchName || 'N/A';
      const employee = employeeData.find((e) => e.id === appraisal.employee)?.username || 'N/A';
      
  
      return {
        ...appraisal,
        branch,
        employee,
      };
    });
    setUsers(mappedData);
  }
}, [tabledata, branchData, employeeData]);



  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : [];
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  
  // useEffect(() => {
  //     dispatch(empdata());  
  //   }, [dispatch]);

  const deleteUser = (userId) => {
    setUsers(users.filter(item => item.id !== userId));
    // message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Appraisal"); // Append the sheet to the workbook

      writeFile(wb, "AppraisalData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

 const editfun = (id) =>{
    openEditAppraisalModal();
    setId(id)
  } 

   const deleteAppraisals = (userId) => {
      // setUsers(users.filter(item => item.id !== userId));
      // dispatch(DeleteDes(userId));
      // dispatch(getDes())
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });

        dispatch(deleteAppraisal( userId )) 
                  .then(() => {
                    dispatch(getAppraisals());
                    message.success('Appraisal Deleted successfully!');
                    setUsers(users.filter(item => item.id !== userId));
                    
                  })
                  .catch((error) => {
                    // message.error('Failed to delete Indicator.');
                    console.error('Edit API error:', error);
                  });
    };


  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={openViewAppraisalModal}
            size="small"
          >
            View Details
          </Button>
        </Flex>
      </Menu.Item>
     
      

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                  <Menu.Item>
                                  <Flex alignItems="center">
                                    <Button
                                      type=""
                                      icon={<EditOutlined />}
                                      onClick={()=>{editfun(elm.id)}}
                                      size="small"
                                    >
                                     Edit
                                    </Button>
                                  </Flex>
                                </Menu.Item>
                          ) : null}
            
            
            {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                           <Menu.Item>
                           <Flex alignItems="center">
                             <Button
                               type=""
                               icon={<DeleteOutlined />}
                               onClick={() => { deleteAppraisals(elm.id) }}
                               size="small"
                             >
                               Delete
                             </Button>
                           </Flex>
                         </Menu.Item>
                          ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: 'Branch',
      dataIndex: 'branch',
      sorter: (a, b) => a.branch.length - b.branch.length,
    },
 
    {
      title: 'Employee',
      dataIndex: 'employee',
      sorter: (a, b) => a.employee.length - b.employee.length,
    },
    
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      render: (rating) => <Rate disabled defaultValue={rating} />,
      sorter: {
        compare: (a, b) => a.overallRating - b.overallRating,
      },
    },

    {
          title: 'Business Process',
          dataIndex: 'businessProcess',
          key: 'businessProcess',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          sorter: {
            compare: (a, b) => a.businessProcess - b.businessProcess,
          },
        },
        {
          title: 'Oral Communication',
          dataIndex:'oralCommunication',
          key: 'oralCommunication',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          sorter: {
            compare: (a, b) => a.oralCommunication - b.oralCommunication,
          },
        },
    
        {
          title: 'Leadership',
          dataIndex: 'leadership',
          key: 'leadership',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          sorter: {
            compare: (a, b) => a.leadership - b.leadership,
          },
        },
    
        {
          title: 'Project Management',
          dataIndex: 'projectManagement',
          key: 'projectManagement',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          sorter: {
            compare: (a, b) => a.projectManagement - b.projectManagement,
          },
        },
        {
          title: 'Allocating Resources',
          dataIndex: 'allocatingResources',
          key: 'allocatingResources',
          render: (rating) => <Rate disabled defaultValue={rating} />,
          sorter: {
            compare: (a, b) => a.allocatingResources - b.allocatingResources,
          },
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
        

          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                           <Button type="primary" onClick={openAddAppraisalModal}>
                                           <PlusOutlined />
                                           New
                                         </Button>                                                                                                                                                
                                                                                                                                                                          
                                                        ) : null}
          <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
                Export All
              </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

          {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                                          
                           <Table columns={tableColumns} dataSource={users} rowKey="id" />

                            ) : null}


      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Employee Modal */}
      <Modal
        title="Add Appraisal"
        visible={isAddAppraisalModalVisible}
        onCancel={closeAddAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <AddAppraisal onClose={closeAddAppraisalModal} />
      </Modal>

      <Modal
        title="Edit Appraisal"
        visible={isEditAppraisalModalVisible}
        onCancel={closeEditAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <EditAppraisal onClose={closeEditAppraisalModal} id={id} />
      </Modal>
      <Modal
        title="Appraisal Detail"
        visible={isViewAppraisalModalVisible}
        onCancel={closeViewAppraisalModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Modal>
      {/* <Model
      title="View Appraisal"
      visible={isEditAppraisalModalVisible}
      onCancel={closeViewAppraisalModal}
      footer={null}
      width={1000}
      className='mt-[-70px]'
      >
        <ViewAppraisal onClose={closeViewAppraisalModal} />
      </Model> */}

    </Card>
  );
};

export default AppraisalList;









// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddAppraisal from './AddAppraisal';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class AppraisalList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddAppraisalModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddAppraisalModal = () => {
//     this.setState({ isAddAppraisalModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddAppraisalModal = () => {
//     this.setState({ isAddAppraisalModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddAppraisalModalVisible } = this.state;


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
//         {
//           title: 'Branch',
//           dataIndex: 'branch',
//           sorter: {
//               compare: (a, b) => a.branch.length - b.branch.length,
//             },
//         },
//         {
//           title: 'Department',
//           dataIndex: 'depqartment',
//           sorter: {
//               compare: (a, b) => a.department.length - b.department.length,
//             },
//         },
//         {
//           title: 'Designation',
//           dataIndex: 'designation',
//           sorter: {
//               compare: (a, b) => a.designation.length - b.designation.length,
//             },
//         },
//         {
//             title: 'Employee',
//             dataIndex: 'name',
//             sorter: {
//                 compare: (a, b) => a.name.length - b.name.length,
//               },
//           },
//           {
//             title: 'Target Rating',
//             dataIndex: 'targetrating',
//             sorter: {
//                 compare: (a, b) => a.targetrating.length - b.targetrating.length,
//               },
//           },
//         {
//           title: 'Overall Rating',
//           dataIndex: 'overallrating',
//           sorter: {
//               compare: (a, b) => a.overallrating.length - b.overallrating.length,
//             },
//         },
//         {
//           title: 'Added By',
//           dataIndex: 'addedby',
//           sorter: {
//               compare: (a, b) => a.addedby.length - b.addedby.length,
//             },
//         },
//         {
//           title: 'Appraisal',
//           dataIndex: 'startdate',
         
//           sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//         },
//       //   {
//       //     title: 'Last online',
//       //     dataIndex: 'lastOnline',
//       //     render: (date) => <span>{dayjs.unix(date).format("MM/DD/YYYY")}</span>,
//       //     sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
//       //   },
//       //   {
//       //     title: 'Status',
//       //     dataIndex: 'status',
//       //     render: (status) => (
//       //       <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//       //         {status}
//       //       </Tag>
//       //     ),
//       //     sorter: {
//       //       compare: (a, b) => a.status.length - b.status.length,
//       //     },
//       //   },
//         {
//           title: 'Action',
//           dataIndex: 'actions',
//           render: (_, elm) => (
//               <div className="text-center">
//                   <EllipsisDropdown menu={dropdownMenu(elm)}/>
//               </div>
//           )
//       },
//       //   {
//       //     title: 'Action',
//       //     dataIndex: 'actions',
//       //     render: (_, elm) => (
//       //       <div className="text-right d-flex justify-content-center">
//       //         <Tooltip title="View">
//       //           <Button
//       //             type="primary"
//       //             className="mr-2"
//       //             icon={<EyeOutlined />}
//       //             onClick={() => this.showUserProfile(elm)}
//       //             size="small"
//       //           />
//       //         </Tooltip>
//       //         <Tooltip title="Delete">
//       //           <Button danger icon={<DeleteOutlined />} onClick={() => this.deleteUser(elm.id)} size="small" />
//       //         </Tooltip>
//       //       </div>
//       //     ),
//       //   },
//       ];

//     return (
//       <Card bodyStyle={{ padding: '-3px' }}>
//         <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//           <Flex className="mb-1" mobileFlex={false}>
//             <div className="mr-md-3 mb-3">
//               <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
//             </div>
//           </Flex>
//           <Flex gap="7px">
//             <Button type="primary" className="ml-2" onClick={this.openAddAppraisalModal}>
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
//           title="Add Appraisal"
//           visible={isAddAppraisalModalVisible}
//           onCancel={this.closeAddAppraisalModal}
//           footer={null}
//           width={800}
//         >
//           <AddAppraisal onClose={this.closeAddAppraisalModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default AppraisalList;
