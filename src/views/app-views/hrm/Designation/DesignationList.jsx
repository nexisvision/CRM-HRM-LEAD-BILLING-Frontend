import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Button, Input, message, Modal, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import { useNavigate } from 'react-router-dom';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AddDesignation from './AddDesignation';
import { utils, writeFile } from "xlsx";
import ParticularDesignation from './ParticularDesignation';
import EditDesignation from './EditDesignation';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteDes, getDes } from './DesignationReducers/DesignationSlice';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';

const { Option } = Select;

const DesignationList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddDesignationModalVisible, setIsAddDesignationModalVisible] = useState(false);
  const [isEditDesignationModalVisible, setIsEditDesignationModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Designation);

  const [id,setId]=useState("");
  const [searchText, setSearchText] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  
  // Add branch data from Redux store
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);

  // Filter branches for current user
  const userBranches = branchData.filter(branch => branch.created_by === user);

  useEffect(() => {
    dispatch(getDes());
    dispatch(getBranch());
  }, [dispatch]);

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

  if (parsedPermissions["extra-hrm-designation"] && parsedPermissions["extra-hrm-designation"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-designation"][0].permissions;
  
  } else {
  }
  
  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission

  useEffect(() => {
    if (tabledata && tabledata.Designation && tabledata.Designation.data) {
      const filteredData = tabledata.Designation.data.filter((item) => item.created_by === user);
      setUsers(filteredData);
    }
  }, [tabledata]);

  // Open Add Employee Modal
  const openAddDesignationModal = () => {
    setIsAddDesignationModalVisible(true);
  };

  // Close Add Employee Modal
  const closeAddDesignationModal = () => {
    setIsAddDesignationModalVisible(false);
  };

  // Open Add Employee Modal
  const openEditDesignationModal = () => {
    setIsEditDesignationModalVisible(true);
  };

  // Close Add Employee Modal
  const closeEditDesignationModal = () => {
    setIsEditDesignationModalVisible(false);
  };

  // Open Add Employee Modal
  const handleParticularDesignationModal = () => {
    navigate('/app/hrm/designation/particulardesignation', { state: { user: selectedUser } });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Function to get branch name by ID
  const getBranchNameById = (branchId) => {
    const branch = branchData.find(branch => branch.id === branchId);
    return branch ? branch.branchName : 'N/A';
  };

  // Function to filter designations based on search and branch
  const getFilteredDesignations = () => {
    if (!users) return [];
    
    let filtered = users;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(designation => 
        designation.designation_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply branch filter
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(designation => 
        designation.branch === selectedBranch
      );
    }

    return filtered;
  };

  // Handle branch change
  const handleBranchChange = (value) => {
    setSelectedBranch(value);
  };

  const deleteUser = (userId) => {
    dispatch(DeleteDes(userId))
      .then(() => {
        dispatch(getDes());
        // message.success('designation Deleted successfully!');
        setUsers(users.filter(item => item.id !== userId));
        navigate('/app/hrm/designation');
      })
      .catch((error) => {
        // message.error('Failed to delete designation.');
        console.error('Edit API error:', error);
      });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Designation"); // Append the sheet to the workbook

      writeFile(wb, "DesignationData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editfun = (id) =>{
    openEditDesignationModal();
    setId(id)
  } 

  const dropdownMenu = (elm) => (
    <Menu>
      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button type="" icon={<EditOutlined />} onClick={()=>{editfun(elm.id)}} size="small">
              <span className="">Edit</span>
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button type="" icon={<DeleteOutlined />} onClick={() => { deleteUser(elm.id) }} size="small">
              <span className="">Delete</span>
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Designation',
      dataIndex: 'designation_name',
      sorter: {
        compare: (a, b) => a.designation_name.length - b.designation_name.length,
      },
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      render: (branchId) => getBranchNameById(branchId),
      sorter: {
        compare: (a, b) => {
          const branchNameA = getBranchNameById(a.branch).toLowerCase();
          const branchNameB = getBranchNameById(b.branch).toLowerCase();
          return branchNameA.localeCompare(branchNameB);
        },
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
            <Input
              placeholder="Search designation..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              placeholder="Filter by branch"
              onChange={handleBranchChange}
              value={selectedBranch}
              style={{ width: 200 }}
              className="branch-select"
            >
              <Option value="all">All Branches</Option>
              {userBranches.map(branch => (
                <Option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddDesignationModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          ) : null}
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
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
            dataSource={getFilteredDesignations()} 
            rowKey="id"
            pagination={{
              total: getFilteredDesignations().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Designation Modal */}
      <Modal
        title="Add Designation"
        visible={isAddDesignationModalVisible}
        onCancel={closeAddDesignationModal}
        footer={null}
        width={800}
      >
        <AddDesignation onClose={closeAddDesignationModal} />
      </Modal>


 {/* Edit Designation Modal */}
 <Modal
        title="Edit Designation"
        visible={isEditDesignationModalVisible}
        onCancel={closeEditDesignationModal}
        footer={null}
        width={800}
      >
        <EditDesignation onClose={closeEditDesignationModal} id={id}/>
      </Modal>

      {/* Particular Designation Modal */}
     
    </Card>
  );
};

// Update styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .branch-select {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus,
  .branch-select:hover,
  .branch-select:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  @media (max-width: 768px) {
    .search-input,
    .branch-select,
    .ant-input-group {
      width: 100%;
      margin-bottom: 1rem;
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

const DesignationListWithStyles = () => (
  <>
    <style>{styles}</style>
    <DesignationList />
  </>
);

export default DesignationListWithStyles;











// import React, { Component } from 'react';
// import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddDesignation from './AddDesignation';
// import userData from "assets/data/user-list.data.json";
// import OrderListData from "assets/data/order-list.data.json";
// import utils from 'utils';

// export class DesignationList extends Component {
//   state = {
//     users: userData,
//     userProfileVisible: false,
//     selectedUser: null,
//     list: OrderListData, // Initialize with OrderListData
//     selectedRowKeys: [],
//     isAddDesignationModalVisible: false, // State to toggle Add Employee Modal
//   };

//   // Open Add Employee Modal
//   openAddDesignationModal = () => {
//     this.setState({ isAddDesignationModalVisible: true });
//   };

//   // Close Add Employee Modal
//   closeAddDesignationModal = () => {
//     this.setState({ isAddDesignationModalVisible: false });
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
//     const { users, userProfileVisible, selectedUser, isAddDesignationModalVisible } = this.state;


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
//       {
//         title: 'Designation',
//         dataIndex: 'designation',
//         sorter: {
//           compare: (a, b) => a.designation.length - b.designation.length,
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
//             <Button type="primary" className="ml-2" onClick={this.openAddDesignationModal}>
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
//           title="Add Designation"
//           visible={isAddDesignationModalVisible}
//           onCancel={this.closeAddDesignationModal}
//           footer={null}
//           width={800}
//         >
//           <AddDesignation onClose={this.closeAddDesignationModal} />
//         </Modal>
//       </Card>
//     );
//   }
// }

// export default DesignationList;









