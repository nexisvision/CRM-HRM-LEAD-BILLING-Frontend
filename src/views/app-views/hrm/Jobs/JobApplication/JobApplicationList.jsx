import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobApplication from "./AddJobApplication";
import EditJobApplication from "./EditJobApplication";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  deletejobapplication,
  getjobapplication,
} from "./JobapplicationReducer/JobapplicationSlice";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const JobApplicationList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddJobApplicationModalVisible, setIsAddJobApplicationModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const [
    isAddJobAEditlicationModalVisible,
    setIsEditJobApplicationModalVisible,
  ] = useState(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data || [];

  const fnddtaa = fnddta.filter((item) => item.created_by === user);

  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [uniqueStatuses, setUniqueStatuses] = useState(['All']);

  useEffect(() => {
    dispatch(getjobapplication());
  }, []);

  useEffect(() => {
    if (fnddta) {
      setUsers(fnddtaa);
      // Extract unique statuses from the data
      const statuses = ['All', ...new Set(fnddtaa.map(item => item.status).filter(Boolean))];
      setUniqueStatuses(statuses);
    }
  }, [fnddta]);

  const openAddJobApplicationModal = () => {
    setIsAddJobApplicationModalVisible(true);
  };

  const closeAddJobApplicationModal = () => {
    setIsAddJobApplicationModalVisible(false);
  };

  const openEditJobApplicationModal = () => {
    setIsEditJobApplicationModalVisible(true);
  };

  const closeEditJobApplicationModal = () => {
    setIsEditJobApplicationModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredApplications = () => {
    if (!users) return [];
    
    let filtered = [...users];

    // Text search filter
    if (searchText) {
      filtered = filtered.filter(application => {
        return (
          application.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          application.status?.toLowerCase().includes(searchText.toLowerCase()) ||
          application.notice_period?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(application => 
        application.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return filtered;
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

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
                     
                        if (parsedPermissions["extra-hrm-jobs-jobonbording"] && parsedPermissions["extra-hrm-jobs-jobonbording"][0]?.permissions) {
                          allpermisson = parsedPermissions["extra-hrm-jobs-jobonbording"][0].permissions;
                          // console.log('Parsed Permissions:', allpermisson);
                        
                        } else {
                          // console.log('extra-hrm-jobs-jobonbording is not available');
                        }
                        
                        const canCreateClient = allpermisson?.includes('create');
                        const canEditClient = allpermisson?.includes('edit');
                        const canDeleteClient = allpermisson?.includes('delete');
                        const canViewClient = allpermisson?.includes('view');
                     
                        ///endpermission



  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "JobApplication"); // Append the sheet to the workbook

      writeFile(wb, "JobApplicationData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const deleteUser = (userId) => {
    dispatch(deletejobapplication(userId)).then(() => {
      dispatch(getjobapplication());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  // const showViewApplication = (userInfo) => {
  //   setViewApplicationVisible(true);
  //   setSelectedUser(userInfo);
  // };

  // const closeViewApplication = () => {
  //   setViewApplicationVisible(false);
  //   setSelectedUser(null);
  // };

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(users, key, value);
      setUsers(data);
    } else {
      setUsers(fnddtaa);
    }
  };

  const jobStatusList = ["active", "blocked"];

  const eidtfun = (idd) => {
    openEditJobApplicationModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} size="small">
            <span>View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span>Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<PushpinOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Add to Job OnBoard</span>
          </Button>
        </Flex>
      </Menu.Item> */}
     
      

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                  <Menu.Item>
                                  <Flex alignItems="center">
                                    <Button
                                      type=""
                                      className=""
                                      icon={<EditOutlined />}
                                      onClick={() => eidtfun(elm.id)}
                                      size="small"
                                    >
                                      <span className="ml-2">Edit</span>
                                    </Button>
                                  </Flex>
                                </Menu.Item>
                                ) : null}
                  
                  
                  {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Flex alignItems="center">
                                     <Button
                                       type=""
                                       className=""
                                       icon={<DeleteOutlined />}
                                       onClick={() => deleteUser(elm.id)}
                                       size="small"
                                     >
                                       <span>Delete</span>
                                     </Button>
                                   </Flex>
                                 </Menu.Item>
                                ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: "notice_period",
      dataIndex: "notice_period",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "location",
      dataIndex: "location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    // {
    //   title: "job",
    //   dataIndex: "job",
    //   sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    // },
    {
      title: "current_location",
      dataIndex: "current_location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "phone",
      dataIndex: "phone",
      sorter: (a, b) => a.totaldays.length - b.totaldays.length,
    },
    {
      title: "total_experience",
      dataIndex: "total_experience",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getjobStatus(record.status)}>{record.status}</Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  // Add status change handler
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input.Group compact>
              <Input
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              defaultValue="All"
              style={{ minWidth: '120px' }}
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              {uniqueStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
         

            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                  <Button
                                                                                                                  type="primary"
                                                                                                                  className="ml-2"
                                                                                                                  onClick={openAddJobApplicationModal}
                                                                                                                >
                                                                                                                  <PlusOutlined />
                                                                                                                  <span>New</span>
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
                                                           <Table
                                                           columns={tableColumns}
                                                           dataSource={getFilteredApplications()}
                                                           rowKey="id"
                                                           pagination={{
                                                             total: getFilteredApplications().length,
                                                             pageSize: 10,
                                                             showSizeChanger: true,
                                                             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                                           }}
                                                         />
                                                             ) : null}
       
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} /> */}
      <Modal
        title="Add Job Application"
        visible={isAddJobApplicationModalVisible}
        onCancel={closeAddJobApplicationModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddJobApplication onClose={closeAddJobApplicationModal} />
      </Modal>

      <Modal
        title="Edit Job Application"
        visible={isAddJobAEditlicationModalVisible}
        onCancel={closeEditJobApplicationModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditJobApplication onClose={closeEditJobApplicationModal} idd={idd} />
      </Modal>
      {/* <Modal
        title=""
        visible={viewApplicationVisible}
        onCancel={closeViewApplication}
        footer={null}
        width={1200}
        className='mt-[-70px]'
      >
        <ViewJobApplication onClose={closeViewApplication} />
      </Modal> */}
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  .ant-input-group .ant-input {
    width: calc(100% - 90px);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ant-input-group .ant-btn {
    width: 90px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-group {
      width: 100%;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const JobApplicationListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobApplicationList />
  </>
);

export default JobApplicationListWithStyles;

// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddJobApplication from './AddJobApplication';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class JobApplicationList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddJobApplicationModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddJobApplicationModal = () => {
//     this.setState({ isAddJobApplicationModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddJobApplicationModal = () => {
//     this.setState({ isAddJobApplicationModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddJobApplicationModalVisible } = this.state;

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
//       {
//         title: 'Employee',
//         dataIndex: 'name',
//         render: (_, record) => (
//           <div className="d-flex">
//             <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
//           </div>
//         ),
//         sorter: {
//           compare: (a, b) => {
//             a = a.name.toLowerCase();
//             b = b.name.toLowerCase();
//             return a > b ? -1 : b > a ? 1 : 0;
//           },
//         },
//       },
//       {
//         title: 'Leave Type',
//         dataIndex: 'leavetype',
//         sorter: {
//           compare: (a, b) => a.leavetype.length - b.leavetype.length,
//         },
//       },
//       {
//         title: 'Applied On',
//         dataIndex: 'appliedon',

//         sorter: (a, b) => dayjs(a.appliedon).unix() - dayjs(b.appliedon).unix(),
//       },
//       {
//         title: 'Start Date',
//         dataIndex: 'startdate',

//         sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
//       },
//       {
//         title: 'End Date',
//         dataIndex: 'enddate',

//         sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
//       },
//       {
//         title: 'Total Days',
//         dataIndex: 'totaldays',
//         sorter: {
//           compare: (a, b) => a.totaldays.length - b.totaldays.length,
//         },
//       },

//        {
//         title: 'Leave Reason',
//         dataIndex: 'leavereason',
//         sorter: {
//           compare: (a, b) => a.leavereason.length - b.leavereason.length,
//         },
//       },
//       {
//         title: 'Status',
//         dataIndex: 'status',
//         render: (status) => (
//           <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
//             {status}
//           </Tag>
//         ),
//         sorter: {
//           compare: (a, b) => a.status.length - b.status.length,
//         },
//       },
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
//             <Button type="primary" className="ml-2" onClick={this.openAddJobApplicationModal}>
//               <PlusOutlined />
//               <span>New</span>
//             </Button>
//             <Button type="primary" icon={<FileExcelOutlined />} block>
//               Export All
//             </Button>
//           </Flex>
//         </Flex>
//         <div className="table-responsive mt-2">
//           <Table columns={tableColumns} dataSource={users} rowKey="id"  scroll={{ x: 1200 }} />
//         </div>
//         <UserView data={selectedUser} visible={userProfileVisible} close={() => this.closeUserProfile()} />

//         {/* Add Employee Modal */}
//         <Modal
//           title=""
//           visible={isAddJobApplicationModalVisible}
//           onCancel={this.closeAddJobApplicationModal}
//           footer={null}
//           width={800}
//         >
//           <AddJobApplication onClose={this.closeAddJobApplicationModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default JobApplicationList;
