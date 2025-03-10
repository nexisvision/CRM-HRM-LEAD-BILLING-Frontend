import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal,Rate, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, EditOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddIndicator from './AddIndicator';
import EditIndicator from './EditIndicator';

import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import ViewIndicator from './ViewIndicator';
import { deleteIndicator, getIndicators } from './IndicatorReducers/indicatorSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { navigate } from 'react-big-calendar/lib/utils/constants';
import { getBranch } from '../../Branch/BranchReducer/BranchSlice';
import { getDept } from '../../Department/DepartmentReducers/DepartmentSlice';
import { getDes } from '../../Designation/DesignationReducers/DesignationSlice';

const { Option } = Select;

const IndicatorList = () => {
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [id, setId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddIndicatorModalVisible, setIsAddIndicatorModalVisible] = useState(false);
  const [isEditIndicatorModalVisible, setIsEditIndicatorModalVisible] = useState(false);
  const [isViewIndicatorModalVisible, setIsViewIndicatorModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [searchText, setSearchText] = useState('');
const dispatch = useDispatch();

  const openAddIndicatorModal = () => setIsAddIndicatorModalVisible(true);
  const closeAddIndicatorModal = () => setIsAddIndicatorModalVisible(false);

  const openEditIndicatorModal = () => setIsEditIndicatorModalVisible(true);
  const closeEditIndicatorModal = () => setIsEditIndicatorModalVisible(false);

  const openViewIndicatorModal = () => setIsViewIndicatorModalVisible(true);
  const closeViewIndicatorModal = () => setIsViewIndicatorModalVisible(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
    const tabledata = useSelector((state) => state.indicator);


const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  const departmentData = useSelector((state) => state.Department?.Department?.data || []);
  const designationData = useSelector((state) => state.Designation?.Designation?.data || []);


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
  
     if (parsedPermissions["extra-hrm-performance-indicator"] && parsedPermissions["extra-hrm-performance-indicator"][0]?.permissions) {
       allpermisson = parsedPermissions["extra-hrm-performance-indicator"][0].permissions;
     
     } else {
     }
     
     const canCreateClient = allpermisson?.includes('create');
     const canEditClient = allpermisson?.includes('edit');
     const canDeleteClient = allpermisson?.includes('delete');
     const canViewClient = allpermisson?.includes('view');
  
  useEffect(() => {
    dispatch(getBranch());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDept());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getDes());
  }, [dispatch]);


useEffect(() => { 
  dispatch(getIndicators());
}, [dispatch]);


useEffect(() => {
  if (tabledata?.Indicators?.data) {
    const mappedData = tabledata.Indicators.data
      .filter(indicator => indicator.created_by === user) // Filter by created_by matching the username
      .map((indicator) => {
        const branch = branchData.find((b) => b.id === indicator.branch)?.branchName || 'N/A';
        const department = departmentData.find((d) => d.id === indicator.department)?.department_name || 'N/A';
        const designation = designationData.find((des) => des.id === indicator.designation)?.designation_name || 'N/A';

        return {
          ...indicator,
          branch,
          department,
          designation,
        };
      });
    setUsers(mappedData);
  }
}, [tabledata, departmentData, designationData, user]);


  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Indicator"); // Append the sheet to the workbook

      writeFile(wb, "IndicatorData.xlsx"); // Save the file as ProposalData.xlsx
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
    openEditIndicatorModal();
    setId(id)
  } 

   const deleteIndicators = (userId) => {
    

        dispatch(deleteIndicator( userId )) 
                  .then(() => {
                    dispatch(getIndicators());
                    setUsers(users.filter(item => item.id !== userId));
                    navigate('/app/hrm/performance/indicator');
                  })
                  .catch((error) => {
                    console.error('Edit API error:', error);
                  });
    };

  const dropdownMenu = (elm) => (
    <Menu>

      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                  <Menu.Item>
                                  <Flex alignItems="center">
                                    <Button type="" className="" icon={<EditOutlined />} onClick={()=>{editfun(elm.id)}} size="small">
                                      <span className="">Edit</span>
                                    </Button>
                                  </Flex>
                                </Menu.Item>
                          ) : null}
            
            
            {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                           <Menu.Item>
                           <Flex alignItems="center">
                             <Button type="" className="" icon={<DeleteOutlined />} onClick={() => { deleteIndicators(elm.id) }} size="small">
                               <span className="">Delete</span>
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
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      sorter: {
        compare: (a, b) => a.designation.length - b.designation.length,
      },
    },
    {
      title: 'Department',
      dataIndex: 'department',
      sorter: {
        compare: (a, b) => a.department.length - b.department.length,
      },
    },
   
    {
      title: 'Overall Rating',
      dataIndex: 'overallRating',
      key: 'overallRating',
      sorter: {
        compare: (a, b) => a.overallRating - b.overallRating,
      },
    },
    {
      title: 'Business Process',
      dataIndex: 'businessProcess',
      key: 'businessProcess',
      sorter: {
        compare: (a, b) => a.businessProcess - b.businessProcess,
      },
    },
    {
      title: 'Oral Communication',
      dataIndex:'oralCommunication',
      key: 'oralCommunication',
      sorter: {
        compare: (a, b) => a.oralCommunication - b.oralCommunication,
      },
    },

    {
      title: 'Leadership',
      dataIndex: 'leadership',
      key: 'leadership',
      sorter: {
        compare: (a, b) => a.leadership - b.leadership,
      },
    },

    {
      title: 'Project Management',
      dataIndex: 'projectManagement',
      key: 'projectManagement',
      sorter: {
        compare: (a, b) => a.projectManagement - b.projectManagement,
      },
    },
    {
      title: 'Allocating Resources',
      dataIndex: 'allocatingResources',
      key: 'allocatingResources',
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

  const getFilteredIndicators = () => {
    if (!users) return [];
    
    let filteredData = [...users];
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filteredData = filteredData.filter(indicator => {
        return (
          indicator.branch?.toLowerCase().includes(searchLower) ||
          indicator.department?.toLowerCase().includes(searchLower) ||
          indicator.designation?.toLowerCase().includes(searchLower) ||
          indicator.overallRating?.toString().includes(searchLower) ||
          indicator.businessProcess?.toString().includes(searchLower) ||
          indicator.oralCommunication?.toString().includes(searchLower) ||
          indicator.leadership?.toString().includes(searchLower) ||
          indicator.projectManagement?.toString().includes(searchLower) ||
          indicator.allocatingResources?.toString().includes(searchLower)
        );
      });
    }
    if (selectedBranch !== 'all') {
      filteredData = filteredData.filter(indicator => 
        indicator.branch === selectedBranch
      );
    }

    return filteredData;
  };

  const BranchFilter = () => (
    <Select
      style={{ width: 200 }}
      placeholder="Filter by Branch"
      value={selectedBranch}
      onChange={setSelectedBranch}
      className="mr-2"
    >
      <Option value="all">All Branches</Option>
      {branchData.map(branch => (
        <Option key={branch.id} value={branch.branchName}>
          {branch.branchName}
        </Option>
      ))}
    </Select>
  );

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search branch, department, designation..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <BranchFilter />
          </div>
        </Flex>
        <Flex gap="7px">
         

           {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                 <Button type="primary" className="ml-2" onClick={openAddIndicatorModal}>
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
                                                                                                                                                  
        <Table columns={tableColumns} dataSource={getFilteredIndicators()} rowKey="id" />
              
                                                   ) : null}

      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      <Modal
        title="Add New Indicator"
        visible={isAddIndicatorModalVisible}
        onCancel={closeAddIndicatorModal}
        footer={null}
        width={1000}
      >
        <AddIndicator onClose={closeAddIndicatorModal} />
      </Modal>

      <Modal
        title="Edit Indicator"
        visible={isEditIndicatorModalVisible}
        onCancel={closeEditIndicatorModal}
        footer={null}
        width={1000}
      >
        <EditIndicator onClose={closeEditIndicatorModal} id={id} />
      </Modal>

      <Modal
        title="View Indicator"
        visible={isViewIndicatorModalVisible}
        onCancel={closeViewIndicatorModal}
        footer={null}
        width={1000}
      >
        <ViewIndicator onClose={closeViewIndicatorModal} />
      </Modal>
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

  .ant-input-affix-wrapper {
    min-width: 250px;
  }

  .ant-select {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    .search-input,
    .ant-input-affix-wrapper,
    .ant-select {
      width: 100%;
      min-width: unset;
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

const IndicatorListWithStyles = () => (
  <>
    <style>{styles}</style>
    <IndicatorList />
  </>
);

export default IndicatorListWithStyles;

