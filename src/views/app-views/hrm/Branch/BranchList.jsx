import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, Button, Modal, message } from "antd";
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
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { useNavigate } from "react-router-dom";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";

import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteBranch, getBranch } from "./BranchReducer/BranchSlice";
// import { DeleteDept, getDept } from './DepartmentReducers/DepartmentSlice';

const BranchList = () => {
  const [users, setUsers] = useState(userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);
  const [isEditBranchModalVisible, setIsEditBranchModalVisible] =
    useState(false);
  const [dept, setDept] = useState("");

  const [idd, setIdd] = useState("");

  const [searchText, setSearchText] = useState('');

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Branch);
 

  useEffect(() => {
    dispatch(getBranch());
  }, []);

  useEffect(() => {
    if (tabledata && tabledata.Branch && tabledata.Branch.data) {
      const filteredData = tabledata.Branch.data.filter((item) => item.created_by === user);
      setUsers(filteredData);
    }
  }, [tabledata]);


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
           
              if (parsedPermissions["extra-hrm-branch"] && parsedPermissions["extra-hrm-branch"][0]?.permissions) {
                allpermisson = parsedPermissions["extra-hrm-branch"][0].permissions;
                // console.log('Parsed Permissions:', allpermisson);
              
              } else {
                // console.log('extra-hrm-branch is not available');
              }
              
              const canCreateClient = allpermisson?.includes('create');
              const canEditClient = allpermisson?.includes('edit');
              const canDeleteClient = allpermisson?.includes('delete');
              const canViewClient = allpermisson?.includes('view');
           
              ///endpermission

  // const navigate = useNavigate();

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  const openEditBranchModal = () => {
    setIsEditBranchModalVisible(true);
  };

  const closeEditBranchModal = () => {
    setIsEditBranchModalVisible(false);
  };

  const handleParticularBranchModal = () => {
    navigate("/app/hrm/department/particulardepartment", {
      state: { user: selectedUser },
    });
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredBranches = () => {
    if (!users) return [];
    
    if (!searchText) return users;

    return users.filter(branch => {
      return (
        branch.branchName?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  };

  //   useEffect(()=>{
  //     dispatch(getDept())
  //   },[dispatch]);

  const deleteUser = (userId) => {
    dispatch(deleteBranch(userId))
      .then(() => {
        dispatch(getBranch());
        message.success("Branch Deleted successfully!");
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        message.error("Failed to update branch.");
        console.error("Edit API error:", error);
      });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Branch"); // Append the sheet to the workbook

      writeFile(wb, "BranchData.xlsx"); // Save the file as ProposalData.xlsx
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

  const editDept = (Deptid) => {
    openEditBranchModal();
    setDept(Deptid);
    setIdd(Deptid);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Button
          type=""
          icon={<EyeOutlined />}
          onClick={handleParticularBranchModal}
          size="small"
        >
          <span>View Details</span>
        </Button>
      </Menu.Item>
      
      <Menu.Item>
        <Button
          type=""
          icon={<PushpinOutlined />}
          onClick={() => showUserProfile(elm)}
          size="small"
        >
          <span>Pin</span>
        </Button>
      </Menu.Item>
   

        {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Button
                                     type=""
                                     icon={<EditOutlined />}
                                     onClick={() => editDept(elm.id)}
                                     size="small"
                                   >
                                     <span>Edit</span>
                                   </Button>
                                 </Menu.Item>
                                ) : null}
                  
                  
                  {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Button
                                     type=""
                                     icon={<DeleteOutlined />}
                                     onClick={() => deleteUser(elm.id)}
                                     size="small"
                                   >
                                     <span>Delete</span>
                                   </Button>
                                 </Menu.Item>
                                ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "Branch",
      dataIndex: "branchName",
      sorter: (a, b) => a.branchName.length - b.branchName.length,
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

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search branch name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
        </Flex>
        <Flex gap="7px">
         

            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                          <Button type="primary" className="ml-2" onClick={openAddBranchModal}>
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
                                                                                                                                                                                  
                    <Table columns={tableColumns} dataSource={getFilteredBranches()} rowKey="id" pagination={{
                      total: getFilteredBranches().length,
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }} />
                       ) : null}


      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* Add Department Modal */}
      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        title="Edit Branch"
        visible={isEditBranchModalVisible}
        onCancel={closeEditBranchModal}
        footer={null}
        width={800}
      >
        <EditBranch onClose={closeEditBranchModal} comnyid={dept} idd={idd} />
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

  @media (max-width: 768px) {
    .search-input,
    .ant-input-affix-wrapper {
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

const BranchListWithStyles = () => (
  <>
    <style>{styles}</style>
    <BranchList />
  </>
);

export default BranchListWithStyles;
