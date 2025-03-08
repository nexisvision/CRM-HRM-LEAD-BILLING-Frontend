import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Row,
  Col,
  Tag,
  Input,
  message,
  Button,
  Modal,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  CopyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import ViewCustomer from "../customer/ViewCustomer";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddCustomer from "./AddCustomer";
import { IoCopyOutline } from "react-icons/io5";
import { utils, writeFile } from "xlsx";
import EditCustomer from "./EditCustomer";
import { delcus, Getcus } from "./CustomerReducer/CustomerSlice";
import { useDispatch, useSelector } from "react-redux";
import useSelection from "antd/es/table/hooks/useSelection";

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] =
    useState(false);
  const [isEditCustomerModalVisible, setIsEditCustomerModalVisible] =
    useState(false);
  const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  // Fetch customers when component mounts
  useEffect(() => {
    dispatch(Getcus());
  }, [dispatch]);
  
  const alldata = useSelector((state) => state.customers);
  
  const fnddata = alldata?.customers?.data || []; 
  const loggid = useSelector((state)=>state.user.loggedInUser);

  // const filterdata = fnddata.filter((item) => item?.created_by === loggid.username);

  // Update users state whenever customer data changes
  useEffect(() => {
    if (loggid && fnddata.length > 0) {
      setUsers(fnddata);
    }
  }, [fnddata]);
  
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
    
        if (parsedPermissions["dashboards-sales-customer"] && parsedPermissions["dashboards-sales-customer"][0]?.permissions) {
          allpermisson = parsedPermissions["dashboards-sales-customer"][0].permissions;
        
        } else {
        }
        
        const canCreateClient = allpermisson?.includes('create');
        const canEditClient = allpermisson?.includes('edit');
        const canDeleteClient = allpermisson?.includes('delete');
        const canViewClient = allpermisson?.includes('view');
  
  
        ///endpermission

  // Open Add Job Modal
  const openAddCustomerModal = () => {
    setIsAddCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddCustomerModal = () => {
    setIsAddCustomerModalVisible(false);
  };

  // Open Add Job Modal
  const openEditCustomerModal = () => {
    setIsEditCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditCustomerModal = () => {
    setIsEditCustomerModalVisible(false);
  };

  const openviewCustomerModal = () => {
    setIsViewCustomerModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewCustomerModal = () => {
    setIsViewCustomerModalVisible(false);
  };

  // Update search functionality to use users instead of list
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    if (!value) {
      setUsers(fnddata); // Reset to original filtered data
      return;
    }
    const filteredUsers = fnddata.filter(user => 
      Object.values(user).some(val => 
        val && val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setUsers(filteredUsers);
  };

  // Delete user function update
  const deleteUser = (userId) => {
    dispatch(delcus(userId))
      .then(() => {
        dispatch(Getcus()); // Refresh the customer list
      })
      .catch((error) => {
        message.error('Failed to delete customer');
        console.error('Delete error:', error);
      });
  };

  // Update export function to use users instead of list
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Customer");
      writeFile(wb, "CustomerData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  // Show user profile
  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  // Close user profile
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const editfun = (idd) => {
    openEditCustomerModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => ({
    items: [
      // Edit - conditional item
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editfun(elm.id)
      }] : []),
      
      // Delete - conditional item
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
        title: "Customer Number",
        dataIndex: "customerNumber",
        sorter: (a, b) => {
            if (a.customerNumber && b.customerNumber) {
                return a.customerNumber.localeCompare(b.customerNumber);
            }
            return 0;
        },
    },
    {
        title: "Name",
        dataIndex: "name",
        render: (name) => name || 'N/A',
        sorter: (a, b) => {
            if (a.name && b.name) {
                return a.name.length - b.name.length;
            }
            return 0;
        },
    },
    {
        title: "Tax Number",
        dataIndex: "tax_number",
        render: (tax_number) => tax_number || 'N/A',
        sorter: (a, b) => {
            if (a.tax_number && b.tax_number) {
                return a.tax_number.localeCompare(b.tax_number);
            }
            return 0;
        },
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
        className="flex flex-wrap  gap-4"
      >
        <Flex mobileFlex={false} className="flex flex-wrap gap-4 mb-4 md:mb-0">
          <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex>
        <Flex gap="7px" className="flex">
         

          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button
              type="primary"
              className="flex items-center"
              onClick={openAddCustomerModal}
            >
              <PlusOutlined />
              <span className="ml-2">New</span>
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
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
            // loading={!users.length} // Add loading state
          />
        ) : null}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* Add Job Modal */}
      <Modal
        title="Add Customer"
        visible={isAddCustomerModalVisible}
        onCancel={closeAddCustomerModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddCustomer onClose={closeAddCustomerModal} />
      </Modal>

      <Modal
        title="Customer"
        visible={isViewCustomerModalVisible}
        onCancel={closeViewCustomerModal}
        footer={null}
        width={1100}
        className="mt-[-70px]"
      >
        <ViewCustomer onClose={closeViewCustomerModal} />
      </Modal>

      <Modal
        title="Edit Customer"
        visible={isEditCustomerModalVisible}
        onCancel={closeEditCustomerModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditCustomer onClose={closeEditCustomerModal} idd={idd} />
      </Modal>
    </Card>
  );
};

export default CustomerList;
