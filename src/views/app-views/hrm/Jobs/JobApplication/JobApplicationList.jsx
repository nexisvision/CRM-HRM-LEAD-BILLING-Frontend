import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobApplication from "./AddJobApplication";
import EditJobApplication from "./EditJobApplication";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  deletejobapplication,
  getjobapplication,
} from "./JobapplicationReducer/JobapplicationSlice";
const { Option } = Select;

const JobApplicationList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobApplicationModalVisible, setIsAddJobApplicationModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const [
    isAddJobAEditlicationModalVisible,
    setIsEditJobApplicationModalVisible,
  ] = useState(false);

  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = React.useMemo(() => alldata.jobapplications.data || [], [alldata.jobapplications.data]);

  const fnddtaa = fnddta.filter((item) => item.created_by === user);

  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [uniqueStatuses, setUniqueStatuses] = useState(['All']);

  useEffect(() => {
    dispatch(getjobapplication());
  }, [dispatch]);

  useEffect(() => {
    if (fnddta) {
      setUsers(fnddtaa);
      const statuses = ['All', ...new Set(fnddtaa.map(item => item.status).filter(Boolean))];
      setUniqueStatuses(statuses);
    }
  }, [fnddtaa, fnddta]);

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

    if (searchText) {
      filtered = filtered.filter(application => {
        return (
          application.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          application.status?.toLowerCase().includes(searchText.toLowerCase()) ||
          application.notice_period?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

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
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');



  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "JobApplication");

      writeFile(wb, "JobApplicationData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };
  const deleteUser = (userId) => {
    dispatch(deletejobapplication(userId)).then(() => {
      dispatch(getjobapplication());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
    });
  };


  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };


  const eidtfun = (idd) => {
    openEditJobApplicationModal();
    setIdd(idd);
  };

  const getDropdownItems = (row) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => eidtfun(row.id)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(row.id),
        danger: true
      });
    }

    return items;
  };

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
          <Dropdown
            menu={{ items: getDropdownItems(elm) }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: '10px',
                padding: 0
              }}
            >
              <MoreOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            </Button>
          </Dropdown>
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

  .ant-dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    padding: 4px;
  }

  .ant-dropdown-menu-item {
    padding: 8px 16px;
    border-radius: 4px;
    margin: 2px 0;
    transition: all 0.3s;
  }

  .ant-dropdown-menu-item:hover {
    background-color: #f5f5f5;
  }

  .ant-dropdown-menu-item-danger:hover {
    background-color: #fff1f0;
  }

  .ant-dropdown-menu-item .anticon {
    font-size: 16px;
    margin-right: 8px;
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
