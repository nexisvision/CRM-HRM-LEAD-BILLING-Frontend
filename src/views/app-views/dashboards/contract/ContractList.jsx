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
  DatePicker,
  Select,
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
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddContract from "./AddContract";
import ViewContract from "./ViewContract";
import EditContract from "./EditContract";
import { useNavigate } from "react-router-dom";
import userData from "../../../../assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { IoCopyOutline } from "react-icons/io5";
import { utils, writeFile } from "xlsx";
import { GetProject } from "../project/project-list/projectReducer/ProjectSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { useDispatch, useSelector } from "react-redux";
import { ContaractData, DeleteCon } from "./ContractReducers/ContractSlice";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ContractList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const dispatch = useDispatch();

  const tabledata = useSelector((state) => state.Contract);
  const clientData = useSelector((state) => state.SubClient?.SubClient?.data);
  const projectData = useSelector((state) => state.Project?.Project?.data);

  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(ContaractData());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata?.Contract?.data) {
      const contractsWithNames = tabledata.Contract.data.map(contract => ({
        ...contract,
        client: clientData?.find(client => client.id === contract.client)?.username || contract.client,
        project: projectData?.find(project => project.id === contract.project)?.project_name || contract.project
      }));
      setUsers(contractsWithNames);
    }
  }, [tabledata, clientData, projectData]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddContractModalVisible, setIsAddContractModalVisible] =
    useState(false);
  const [isViewContractModalVisible, setIsViewContractModalVisible] =
    useState(false);
  const [isEditContractModalVisible, setIsEditContractModalVisible] =
    useState(false);
    const navigate = useNavigate();

  const openAddContractModal = () => {
    setIsAddContractModalVisible(true);
  };
  const closeAddContractModal = () => {
    setIsAddContractModalVisible(false);
  };

  const openViewContractModal = () => {
    navigate("/app/dashboards/project/contract/viewContract", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };
  const closeViewContractModal = () => {
    setIsViewContractModalVisible(false);
  };
  const openEditContractModal = () => {
    setIsEditContractModalVisible(true);
  };
  // Close Add Job Modal
  const closeEditContractModal = () => {
    setIsEditContractModalVisible(false);
  };
  // Search functionality
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (!value) {
        setUsers(tabledata?.Contract?.data || []);
        return;
    }
    
    const filtered = tabledata?.Contract?.data?.filter(contract => 
        contract.contract_number?.toLowerCase().includes(value) ||
        contract.phone?.toLowerCase().includes(value) ||
        contract.country?.toLowerCase().includes(value)
    ) || [];
    
    setUsers(filtered);
  };

  // Add filter function
  const getFilteredContracts = () => {
    if (!users) return [];
    
    let filtered = users;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(contract => {
        const clientName = clientData?.find(client => 
          client.id === contract.client
        )?.username?.toLowerCase();
        
        return clientName?.includes(searchText.toLowerCase());
      });
    }

    // Apply date range filter
    if (dateRange && dateRange.length === 2) {
      filtered = filtered.filter(contract => {
        const contractStartDate = dayjs(contract.startDate);
        const contractEndDate = dayjs(contract.endDate);
        const filterStartDate = dayjs(dateRange[0]);
        const filterEndDate = dayjs(dateRange[1]);

        // Contract's date range should overlap with the selected date range
        return (
          (contractStartDate.isAfter(filterStartDate) || contractStartDate.isSame(filterStartDate)) &&
          (contractEndDate.isBefore(filterEndDate) || contractEndDate.isSame(filterEndDate))
        );
      });
    }

    return filtered;
  };

  // Delete user
  // const deleteUser = (userId) => {
  //   dispatch(DeleteCon(userId));

  //   message.success({ content: `Deleted user ${userId}`, duration: 2 });
  // };

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteCon(userId));

      const updatedData = await dispatch(ContaractData());

      setUsers(users.filter((item) => item.id !== userId));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const Editfun = (id) => {
    openEditContractModal();
    setIdd(id);
  };
  const exportToExcel = () => {
    try {

      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Contract"); // Append the worksheet to the workbook

      writeFile(wb, "ContractData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };
  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

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
  
      if (parsedPermissions["dashboards-project-Contract"] && parsedPermissions["dashboards-project-Contract"][0]?.permissions) {
        allpermisson = parsedPermissions["dashboards-project-Contract"][0].permissions;
      
      } else {
      }
      
      const canCreateClient = allpermisson?.includes('create');
      const canEditClient = allpermisson?.includes('edit');
      const canDeleteClient = allpermisson?.includes('delete');
      const canViewClient = allpermisson?.includes('view');




      ///endpermission

  const dropdownMenu = (elm) => ({
    items: [
      // Conditionally add edit menu item
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => Editfun(elm.id)
      }] : []),
      
      // Conditionally add delete menu item
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
        title: 'Contract Number',
        dataIndex: 'contract_number',
       
        sorter: (a, b) => a.contract_number.localeCompare(b.contract_number)
    },
    {
      title: "Client",
      dataIndex: "client",
      render: (_, record) => (
        <span>
          {clientData?.find(client => client.id === record.client)?.username || record.client}
        </span>
      ),
      sorter: {
        compare: (a, b) => {
          const clientA = String(clientData?.find(client => client.id === a.client)?.username || a.client);
          const clientB = String(clientData?.find(client => client.id === b.client)?.username || b.client);
          return clientA.localeCompare(clientB);
        }
      }
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (_, record) => (
        <span>
          {projectData?.find(project => project.id === record.project)?.project_name || record.project}
        </span>
      ),
      sorter: {
        compare: (a, b) => {
          const projectA = String(projectData?.find(project => project.id === a.project)?.project_name || a.project);
          const projectB = String(projectData?.find(project => project.id === b.project)?.project_name || b.project);
          return projectA.localeCompare(projectB);
        }
      }
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: phone => (
          <span>{phone || '-'}</span>
      ),
      sorter: (a, b) => (a.phone || '').localeCompare(b.phone || '')
  },
  {
      title: 'Country',
      dataIndex: 'country',
      render: country => (
          <span>{country || '-'}</span>
      ),
      sorter: (a, b) => (a.country || '').localeCompare(b.country || '')
  },
  {
    title: "Subject",
    dataIndex: "subject",
    sorter: {
      compare: (a, b) => a.subject.length - b.subject.length,
    },
  },
    {
      title: "Contract Value",
      dataIndex: "value",
      sorter: {
        compare: (a, b) => a.value.length - b.value.length,
      },
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
              placeholder="Search by contract number, phone, country..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              allowClear
              className="search-input"
            />
          </div>
          <div className="mr-md-3 mb-3">
            <RangePicker
              placeholder={['Contract Start Date', 'Contract End Date']}
              onChange={(dates) => setDateRange(dates)}
              format="DD-MM-YYYY"
              allowClear
              className="date-range-picker"
            />
          </div>
        </Flex>
        <Flex gap="7px">
          
  {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                <Button
                type="primary"
                className="ml-2"
                onClick={openAddContractModal}
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
                dataSource={getFilteredContracts()}
                rowKey="id"
                pagination={{
                  total: getFilteredContracts().length,
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
      {/* Add Job Modal */}
      <Modal
        title="Add Contract"
        visible={isAddContractModalVisible}
        onCancel={closeAddContractModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <AddContract onClose={closeAddContractModal} />
      </Modal>
      <Modal
        title="View Contract"
        visible={isViewContractModalVisible}
        onCancel={closeViewContractModal}
        footer={null}
        width={1800}
        className="mt-[-70px]"
      >
        <ViewContract onClose={closeViewContractModal} />
      </Modal>
      <Modal
        title="Edit Contract"
        visible={isEditContractModalVisible}
        onCancel={closeEditContractModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditContract onClose={closeEditContractModal} id={idd} />
      </Modal>
    </Card>
  );
};

// Add styles
const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 200px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .date-range-picker {
    min-width: 280px;
  }

  @media (max-width: 768px) {
    .search-input,
    .date-range-picker {
      width: 100%;
      margin-bottom: 1rem;
    }
  }
`;

const ContractListWithStyles = () => (
  <>
    <style>{styles}</style>
    <ContractList />
  </>
);

export default ContractListWithStyles;
