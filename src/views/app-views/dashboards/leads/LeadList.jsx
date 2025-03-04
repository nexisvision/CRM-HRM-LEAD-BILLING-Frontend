import React, { useEffect, useRef, useState } from "react"; // Import useRef for file input
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
  Radio,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  EditOutlined,
  FileExcelOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  RetweetOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { DealStatisticData } from "../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddLead from "./AddLead";
import { utils, writeFile } from "xlsx";
import EditLead from "./EditLead";
import ViewLead from "./ViewLead";
import { useDispatch, useSelector } from "react-redux";
import { GetLeads, LeadsDelete } from "./LeadReducers/LeadSlice";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import LeadCards from "./LeadCards/LeadCards";
import ConvertDeal from "./ConvertDeal";
// import LeadCardsList from './LeadCards/LeadCardsList'; // Adjust the import path as necessary

const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const LeadList = () => {
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddLeadModalVisible, setIsAddLeadModalVisible] = useState(false);
  const [isViewLeadModalVisible, setIsViewLeadModalVisible] = useState(false);
  const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);
  const [dealStatisticData] = useState(DealStatisticData);
  const navigate = useNavigate();

  const [id, setId] = useState("null");
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Ref for file input
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  const [view, setView] = useState(VIEW_LIST);

  // Add these new state declarations
  const [isConvertDealModalVisible, setIsConvertDealModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // console.log("Selected file:", file); // Process the file here (e.g., upload to server)
      message.success(`Selected file: ${file.name}`);
    }
  };

  const openViewLeadModal = () => {
    navigate("/app/dashboards/project/lead/viewLead", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };

  // Open file manager
  const openFileManager = () => {
    fileInputRef.current.click();
  };

  const openAddLeadModal = () => setIsAddLeadModalVisible(true);
  const closeAddLeadModal = () => setIsAddLeadModalVisible(false);
  const openEditLeadModal = () => setIsEditLeadModalVisible(true);
  const closeEditLeadModal = () => setIsEditLeadModalVisible(false);
  // const openViewLeadModal = () => setIsViewLeadModalVisible(true);
  const closeViewLeadModal = () => setIsViewLeadModalVisible(false);

  const tabledata = useSelector((state) => state.Leads);



  const user = useSelector((state) => state.user.loggedInUser.username);

  // Set initial filtered data
  useEffect(() => {
    if (tabledata && tabledata.Leads && tabledata.Leads.data) {
      setFilteredData(tabledata.Leads.data);
    }
  }, [tabledata]);

  // Search function
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    if (!value || !tabledata.Leads.data) {
      setFilteredData(tabledata.Leads.data);
      return;
    }

    // Filter based on lead title
    const filtered = tabledata.Leads.data.filter(lead =>
      lead.leadTitle?.toString().toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // Get filtered data
  const getFilteredLeads = () => {
    return filteredData || [];
  };

  const handleLeadClick = (id) => {
    navigate(`/app/dashboards/lead/view/${id}`);
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

  if (parsedPermissions["dashboards-lead"] && parsedPermissions["dashboards-lead"][0]?.permissions) {
    allpermisson = parsedPermissions["dashboards-lead"][0].permissions;
    // console.log('Parsed Permissions:', allpermisson);

  } else {
    // console.log('dashboards-lead is not available');
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission



  const deleteUser = async (userId) => {
    try {
      await dispatch(LeadsDelete(userId));

      const updatedData = await dispatch(GetLeads());

      setUsers(users.filter((item) => item.id !== userId));

      // message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      // console.error("Error deleting user:", error);
    }
  };
  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Lead"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "LeadData.xlsx");
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

  useEffect(() => {
    dispatch(GetLeads());
  }, [dispatch]);


  useEffect(() => {
    if (tabledata && tabledata.Leads && tabledata.Leads.data) {
      // Filter leads by created_by matching the logged-in user's username
      // const filteredLeads = tabledata.Leads.data.filter(lead => lead.created_by === user);
      const filteredLeads = tabledata.Leads.data;
      setUsers(filteredLeads);
    }
  }, [tabledata]);



  const EditFun = (id) => {
    setId(id);
    openEditLeadModal();
  };

  // Add these new handler functions
  const openConvertDealModal = (lead) => {
    setSelectedLead(lead);
    setIsConvertDealModalVisible(true);
  };

  const closeConvertDealModal = () => {
    setSelectedLead(null);
    setIsConvertDealModalVisible(false);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewLeadModal}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<RetweetOutlined />}
            onClick={() => openConvertDealModal(elm)}
            size="small"
          >
            <span className="">Convert to Deal</span>


          </Button>
        </Flex>
      </Menu.Item>



      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Flex alignItems="center">
            <Button
              type=""
              className=""
              icon={<EditOutlined />}
              onClick={() => EditFun(elm.id)}
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
              <span className="">Delete</span>
            </Button>
          </Flex>
        </Menu.Item>
      ) : null}


    </Menu>
  );

  const tableColumns = [
    {
      title: "leadTitle",
      dataIndex: "leadTitle",
      render: (leadTitle, record) => (
        <div
          onClick={() => handleLeadClick(record.id)}
          className="cursor-pointer hover:text-blue-600"
        >
          <h4 className="mb-0">{leadTitle}</h4>
        </div>
      ),
      sorter: {
        compare: (a, b) => a.leadTitle.length - b.leadTitle.length,
      },
    },
    {
      title: "Name",
      dataIndex: "firstName",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: "email",
      dataIndex: "email",
      sorter: {
        compare: (a, b) => a.email.length - b.email.length,
      },
    },
    // {
    //   title: "leadTitle",
    //   dataIndex: "leadTitle",
    //   sorter: {
    //     compare: (a, b) => a.leadTitle.length - b.leadTitle.length,
    //   },
    // },
    // {
    //   title: "leadTitle",
    //   dataIndex: "leadTitle",
    //   sorter: (a, b) => dayjs(a.leadTitle).unix() - dayjs(b.startdate).unix(),
    // },
    {
      title: "Task",
      dataIndex: "status",
      render: (status) => (

        <Tag
          className="text-capitalize"
          color={status === "active" ? "cyan" : "red"}
        >
          {status}
        </Tag>
      ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
    {
      title: "telephone",
      dataIndex: "telephone",
      sorter: {
        compare: (a, b) => a.telephone.length - b.telephone.length,
      },
    },
    // {
    //   title: "User",
    //   dataIndex: "name",
    //   render: (_, record) => (
    //     <div className="d-flex">
    //       <AvatarStatus size={30} src={record.image} name={record.name} />
    //     </div>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    // },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
    // Table columns definition
  ];

  const onChangeProjectView = (e) => {
    setView(e.target.value);
  };

  const handleAddNewLead = () => {
    openAddLeadModal();
  };

  return (
    <div>
      {/* <LeadCardsList /> */}
      <Card bodyStyle={{ padding: "-3px" }}>
        {/* <Row gutter={16}>
          {dealStatisticData.map((elm, i) => (
            <Col xs={12} sm={12} md={12} lg={12} xl={6} key={i}>
              <StatisticWidget
                title={elm.title}
                value={elm.value}
                status={elm.status}
                subtitle={elm.subtitle}
              />
            </Col>
          ))}
        </Row> */}
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search by lead title..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
          </Flex>

          {/* Buttons positioned to the right */}
          <Flex gap="7px" className="items-center">
            <Radio.Group
              defaultValue={VIEW_LIST}
              onChange={(e) => setView(e.target.value)}
              value={view}
              className="mr-2"
            >
              <Radio.Button value={VIEW_GRID}>
                <AppstoreOutlined />
              </Radio.Button>
              <Radio.Button value={VIEW_LIST}>
                <UnorderedListOutlined />
              </Radio.Button>
            </Radio.Group>

            {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) && (
              <Button type="primary" onClick={openAddLeadModal}>
                <PlusOutlined />
                <span>New</span>
              </Button>
            )}

            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
            >
              Export All
            </Button>
          </Flex>
        </Flex>

        {/* View switching section */}
        {view === VIEW_LIST ? (
          <div className="table-responsive">
            {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) && (
              <Table
                columns={tableColumns}
                dataSource={getFilteredLeads()}
                rowKey="id"
                pagination={{
                  total: getFilteredLeads().length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                }}
              />
            )}
          </div>
        ) : (
          <LeadCards data={getFilteredLeads()} />
        )}

        {/* File input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={closeUserProfile}
        />

        <Modal
          title="Create Lead"
          visible={isAddLeadModalVisible}
          onCancel={closeAddLeadModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <AddLead onClose={closeAddLeadModal} />
        </Modal>
        <Modal
          title="Edit Lead"
          visible={isEditLeadModalVisible}
          onCancel={closeEditLeadModal}
          footer={null}
          width={800}
          className="mt-[-70px] "
        >
          <EditLead onClose={closeEditLeadModal} id={id} />
        </Modal>

        <Modal
          title="View Lead"
          visible={isViewLeadModalVisible}
          onCancel={closeViewLeadModal}
          footer={null}
          width={1800}
          className="mt-[-70px]"
        >
          <ViewLead onClose={closeViewLeadModal} />
        </Modal>

        <Modal
          title="Convert to Deal"
          visible={isConvertDealModalVisible}
          onCancel={closeConvertDealModal}
          footer={null}
          width={800}
          className="mt-[-70px]"
        >
          <ConvertDeal
            onClose={closeConvertDealModal}
            leadData={selectedLead}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default LeadList;
