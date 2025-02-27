import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Tag, Input, message, Button, Modal } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddLeave from "./AddLeave";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import ViewLeave from "./ViewLeave";
import EditLeave from "./EditLeave";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { DeleteLea, GetLeave } from "./LeaveReducer/LeaveSlice";
import { empdata } from "../Employee/EmployeeReducers/EmployeeSlice";
const LeaveList = () => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddLeaveModalVisible, setIsAddLeaveModalVisible] = useState(false);
  const [isViewLeaveModalVisible, setIsViewLeaveModalVisible] = useState(false);
  const [isEditLeaveModalVisible, setIsEditLeaveModalVisible] = useState(false);
  const [editid, setEditid] = useState(null);
  const [users, setUsers] = useState([]);  // Changed to empty array instead of userData
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  // console.log("xiiiii", editid);

  const user = useSelector((state) => state.user.loggedInUser.username);
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
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredLeaves = () => {
    if (!users) return [];
    
    if (!searchText) return users;

    return users.filter(leave => {
      return (
        leave.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.leaveType?.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
        leave.status?.toLowerCase().includes(searchText.toLowerCase())
      );
    });
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
             
                if (parsedPermissions["extra-hrm-leave-leavelist"] && parsedPermissions["extra-hrm-leave-leavelist"][0]?.permissions) {
                  allpermisson = parsedPermissions["extra-hrm-leave-leavelist"][0].permissions;
                  // console.log('Parsed Permissions:', allpermisson);
                
                } else {
                  // console.log('extra-hrm-leave-leavelist is not available');
                }
                
                const canCreateClient = allpermisson?.includes('create');
                const canEditClient = allpermisson?.includes('edit');
                const canDeleteClient = allpermisson?.includes('delete');
                const canViewClient = allpermisson?.includes('view');
             
                ///endpermission

  const deleteUser = async (userId) => {
    try {
      // console.log("dddddd", userId);
      await dispatch(DeleteLea(userId));

      const updatedData = await dispatch(GetLeave());

      setUsers(users.filter((item) => item.id !== userId));

      message.success({ content: "Deleted leave successfully", duration: 2 });
    } catch (error) {
      message.error({ content: 'Failed to delete leave', duration: 2 });
      console.error("Error deleting user:", error);
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
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Leave"); // Append the sheet to the workbook

      writeFile(wb, "LeaveData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  useEffect(() => {
    dispatch(GetLeave());
  }, [dispatch]);

  useEffect(() => {
    dispatch(empdata()); // Fetch employee data on mount
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.Leave && tabledata.Leave.data) {
      const filteredData = tabledata.Leave.data.filter(item => item.created_by === user);
      setUsers(filteredData);
    }
  }, [tabledata, user]);

  const editleave = (id) => {
    openEditLeaveModal();
    setEditid(id);
  };
  const ViewData = (id) => {
    openViewLeaveModal();
    setEditid(id);
  };
  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EyeOutlined />}
            onClick={() => ViewData(elm.id)}
            size="small"
          >
            <span>View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<PushpinOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      

       {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                    <Menu.Item>
                                    <Flex alignItems="center">
                                      <Button
                                        type=""
                                        icon={<EditOutlined />}
                                        onClick={() => editleave(elm.id)}
                                        size="small"
                                      >
                                        <span>Edit</span>
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
      title: "created_by",
      dataIndex: "created_by",
      render: (_, record) => (
        <div className="d-flex">
          {record.created_by}
        </div>
      ),
      sorter: (a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Applied On",
      dataIndex: "appliedon",
      sorter: (a, b) => dayjs(a.appliedon).unix() - dayjs(b.appliedon).unix(),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (_, record) => (
        <span>
          {record.startDate ? dayjs(record.startDate).format('DD-MM-YYYY') : ''}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "startDate"),

    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (_, record) => (
        <span>
          {record.endDate ? dayjs(record.endDate).format('DD-MM-YYYY') : ''}
        </span>
      ),

      sorter: (a, b) => utils.antdTableSorter(a, b, "endDate"),
    },

    {
      title: "Total Days",
      dataIndex: "totaldays",
      sorter: (a, b) => a.totaldays - b.totaldays,
    },
    {
      title: "Leave Reason",
      dataIndex: "reason",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          className="text-capitalize"
          color={status === "active" ? "cyan" : "red"}
        >
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      title: "Approval Actions",
      dataIndex: "approval",
      render: (_, record) => {
        const handleApprove = () => {
          Modal.confirm({
            title: 'Approve Leave',
            content: 'Are you sure you want to approve this leave request?',
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk: () => {
              // Add your approve logic here
              message.success('Leave approved successfully');
            }
          });
        };

        const handleReject = () => {
          Modal.confirm({
            title: 'Reject Leave',
            content: 'Are you sure you want to reject this leave request?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
              // Add your reject logic here
              message.error('Leave rejected');
            }
          });
        };

        return (
          <Flex gap="8px" justifyContent="center">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              size="small"
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600"
              title="Approve"
            />
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              size="small"
              onClick={handleReject}
              title="Reject"
            />
          </Flex>
        );
      }
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
            <Input.Group compact>
              <Input
                placeholder="Search employee"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
              {/* <Button 
                type="primary" 
                onClick={handleSearch}
                icon={<SearchOutlined />}
              >
                Search
              </Button> */}
            </Input.Group>
          </div>
        </Flex>
        <Flex gap="7px">
          

             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                         <Button type="primary" className="ml-2" onClick={openAddLeaveModal}>
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
                           dataSource={getFilteredLeaves()}
                           rowKey="id"
                           pagination={{
                             total: getFilteredLeaves().length,
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

  .bg-green-500 {
    background-color: #10B981;
    border-color: #10B981;
  }

  .bg-green-500:hover {
    background-color: #059669;
    border-color: #059669;
  }

  .ant-btn-primary.bg-green-500:hover {
    background-color: #059669;
    border-color: #059669;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .ant-btn[title] {
    position: relative;
  }

  .ant-btn[title]:hover::after {
    content: attr(title);
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }
`;

const LeaveListWithStyles = () => (
  <>
    <style>{styles}</style>
    <LeaveList />
  </>
);

export default LeaveListWithStyles;
