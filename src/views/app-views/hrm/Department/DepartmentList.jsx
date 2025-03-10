import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, Button, Modal, message, Select } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useNavigate } from 'react-router-dom';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddDepartment from './AddDepartment';
import EditDepartment from './EditDepartment';
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from 'react-redux';
import { DeleteDept, getDept } from './DepartmentReducers/DepartmentSlice';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';

const { Option } = Select;

const DepartmentList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddDepartmentModalVisible, setIsAddDepartmentModalVisible] = useState(false);
  const [isEditDepartmentModalVisible, setIsEditDepartmentModalVisible] = useState(false);
  const  [dept,setDept] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Department);

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

  if (parsedPermissions["extra-hrm-department"] && parsedPermissions["extra-hrm-department"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-department"][0].permissions;
  } else {
  }
  
  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

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
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Get branch data from Redux store
  const branchData = useSelector((state) => state.Branch?.Branch?.data || []);
  
  // Filter branches for current user
  const userBranches = branchData.filter(branch => branch.created_by === user);

  // Function to filter departments based on search and branch
  const getFilteredDepartments = () => {
    if (!users) return [];
    
    let filtered = users;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(department => 
        department.department_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply branch filter
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(department => 
        department.branch === selectedBranch
      );
    }

    return filtered;
  };

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
  };

  useEffect(() => {
    dispatch(getDept());
    dispatch(getBranch()); // Add this to fetch branch data
  }, [dispatch]);

  const getBranchNameById = (branchId) => {
    const branch = branchData.find(branch => branch.id === branchId);
    return branch ? branch.branchName : 'N/A';
  };

  useEffect(() => {
    if (tabledata && tabledata.Department && tabledata.Department.data) {
      const filteredData = tabledata.Department.data.filter((item) => item.created_by === user);
      setUsers(filteredData);
    }
  }, [tabledata]);

  const deleteUser = (userId) => {
    dispatch(DeleteDept( userId ))
      .then(() => {
        dispatch(getDept());
        setUsers(users.filter(item => item.id !== userId));
        navigate('/app/hrm/department');
      })
      .catch((error) => {
        console.error('Edit API error:', error);
      });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Department"); // Append the sheet to the workbook

      writeFile(wb, "DepartmentData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
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

  const dropdownMenu = (elm) => ({
    items: [
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editDept(elm.id)
      }] : []),
      ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(elm.id)
      }] : [])
    ]
  });

  const tableColumns = [
    {
      title: 'Department',
      dataIndex: 'department_name',
      sorter: (a, b) => a.department_name.length - b.department_name.length,
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      render: (branchId) => getBranchNameById(branchId),
      sorter: (a, b) => {
        const branchNameA = getBranchNameById(a.branch).toLowerCase();
        const branchNameB = getBranchNameById(b.branch).toLowerCase();
        return branchNameA.localeCompare(branchNameB);
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
              placeholder="Search department..."
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
                                                                 <Button type="primary" className="ml-2" onClick={openAddDepartmentModal}>
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
                                dataSource={getFilteredDepartments()} 
                                rowKey="id"
                                pagination={{
                                  total: getFilteredDepartments().length,
                                  pageSize: 10,
                                  showSizeChanger: true,
                                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                                }}
                              />

                                            ) : null}
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

const DepartmentListWithStyles = () => (
  <>
    <style>{styles}</style>
    <DepartmentList />
  </>
);

export default DepartmentListWithStyles;



