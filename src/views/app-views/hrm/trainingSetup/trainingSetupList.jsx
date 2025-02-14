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
// import UserView from '../../../Users/user-list/UserView';
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
// import AddJobApplication from './AddJobApplication';
// import EditJobApplication from './EditJobApplication';
// import ViewJobApplication from './ViewJobApplication';
// import userData from "assets/data/user-list.data.json";
import AddTrainingSetup from "./AddTrainingSetup";
import EditTrainingSetup from "./EditTrainingSetup";
import { utils, writeFile } from "xlsx";
import { Deletetrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ViewTrainingSetup from "./ViewTrainingSetup";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const TrainingSetupList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddTrainingSetupModalVisible, setIsAddTrainingSetupModalVisible] =
    useState(false);
  const [isEditTrainingSetupModalVisible, setIsEditTrainingSetupModalVisible] =
    useState(false);
  const [isViewTrainingSetupModalVisible, setIsViewTrainingSetupModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  const allempdata = useSelector((state) => state.Training);
  const fnddata = allempdata.Training.data;

  const openAddTrainingSetupModal = () => {
    setIsAddTrainingSetupModalVisible(true);
  };

  const closeTrainingSetupModal = () => {
    setIsAddTrainingSetupModalVisible(false);
  };

  const openEditTrainingSetupModal = () => {
    setIsEditTrainingSetupModalVisible(true);
  };

  const closeEditTrainingSetupModal = () => {
    setIsEditTrainingSetupModalVisible(false);
  };

  const openviewTrainingSetupModal = () => {
    setIsViewTrainingSetupModalVisible(true);
  };

  const closeViewTrainingSetupModal = () => {
    setIsViewTrainingSetupModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : [];
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "TrainingSetup"); // Append the sheet to the workbook

      writeFile(wb, "TrainingSetupData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const deleteUser = (userId) => {
    dispatch(Deletetrainng(userId));
    dispatch(GetallTrainng());
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    dispatch(GetallTrainng());
  }, []);

  useEffect(() => {
    if (fnddata) {
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
                             
                                if (parsedPermissions["extra-hrm-trainingSetup"] && parsedPermissions["extra-hrm-trainingSetup"][0]?.permissions) {
                                  allpermisson = parsedPermissions["extra-hrm-trainingSetup"][0].permissions;
                                  // console.log('Parsed Permissions:', allpermisson);
                                
                                } else {
                                  // console.log('extra-hrm-trainingSetup is not available');
                                }
                                
                                const canCreateClient = allpermisson?.includes('create');
                                const canEditClient = allpermisson?.includes('edit');
                                const canDeleteClient = allpermisson?.includes('delete');
                                const canViewClient = allpermisson?.includes('view');
                             
                                ///endpermission


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
      const data = utils.filterArray([], key, value);
      setUsers(data);
    } else {
      setUsers([]);
    }
  };

  const editfun = (idd) => {
    openEditTrainingSetupModal();
    setIdd(idd);
  };
  const viewfun = (idd) => {
    openviewTrainingSetupModal();
    setIdd(idd);
  };

  const jobStatusList = ["active", "blocked"];

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewfun(elm.id)}
          >
            <span>View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      
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
      </Menu.Item>
      <Menu.Item>
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
                                     size="small"
                                     onClick={() => editfun(elm.id)}
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
      title: "category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    // {
    //   title: "Links",
    //   dataIndex: "links",
    //   sorter: (a, b) => a.links.length - b.links.length,
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
  ];

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          {/* <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
          </div>
          <div className="w-full md:w-48 ">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Job </Option>
              {jobStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
            </Select>
          </div> */}
        </Flex>
        <Flex gap="7px">
         

           {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                                               <Button
                                                                                                                                               type="primary"
                                                                                                                                               className="ml-2"
                                                                                                                                               onClick={openAddTrainingSetupModal}
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
                                                                                 dataSource={users}
                                                                                 rowKey="id"
                                                                                 scroll={{ x: 1200 }}
                                                                               />
                                                                                     ) : null}
      
      </div>
      {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} />  */}

      <Modal
        title="Add Training Setup"
        visible={isAddTrainingSetupModalVisible}
        onCancel={closeTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddTrainingSetup onClose={closeTrainingSetupModal} />
      </Modal>

      <Modal
        title="Edit Training Setup"
        visible={isEditTrainingSetupModalVisible}
        onCancel={closeEditTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditTrainingSetup onClose={closeEditTrainingSetupModal} idd={idd} />
      </Modal>

      <Modal
        title="Edit Training Setup"
        visible={isViewTrainingSetupModalVisible}
        onCancel={closeViewTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewTrainingSetup onClose={closeViewTrainingSetupModal} idd={idd} />
      </Modal>
    </Card>
  );
};

export default TrainingSetupList;
