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
import AddDocument from "./AddDocument";
import EditDocument from "./EditDocument";
// import userData from "assets/data/user-list.data.json";
// import AddDocument from "./AddDocument";
// import EditTrainingSetup from "./EditTrainingSetup";
import userData from "../../../../assets/data/user-list.data.json";
import OrderListData from "../../../../assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
// import { Deletetrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deleteDocu, getDocu } from "./DocumentReducers/documentSlice";
// import ViewTrainingSetup from "./ViewTrainingSetup";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const DocumentList = () => {
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
  //   const [isViewTrainingSetupModalVisible, setIsViewTrainingSetupModalVisible] =
  //     useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getDocu());
  }, []);

  const alladatas = useSelector((state) => state.Documents);
  const fnddtaas = alladatas.Documents.data;

  useEffect(() => {
    if (fnddtaas) {
      setUsers(fnddtaas);
    }
  }, [fnddtaas]);

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

  //   const openviewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(true);
  //   };

  //   const closeViewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(false);
  //   };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Document"); // Append the sheet to the workbook

      writeFile(wb, "DocumentData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : [];
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    dispatch(deleteDocu(userId)).then(() => {
      dispatch(getDocu());
      setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
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

  if (parsedPermissions["extra-hrm-document"] && parsedPermissions["extra-hrm-document"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-document"][0].permissions;

  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  ///endpermission


  //   useEffect(() => {
  //     dispatch(GetallTrainng());
  //   }, []);

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
    }
  }, [fnddata]);

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
      const data = utils.filterArray(users, key, value);
      setUsers(data);
    } else {
      setUsers(users);
    }
  };

  const editfun = (idd) => {
    openEditTrainingSetupModal();
    setIdd(idd);
  };
  //   const viewfun = (idd) => {
  //     openviewTrainingSetupModal();
  //     setIdd(idd);
  //   };

  const jobStatusList = ["active", "blocked"];

  const dropdownMenu = (elm) => ({
    items: [
      // View Details, Send Mail, and Pin options are commented out but kept for reference
      // {
      //   key: 'view',
      //   icon: <EyeOutlined />,
      //   label: 'View Details',
      //   onClick: () => viewfun(elm.id)
      // },
      // {
      //   key: 'mail',
      //   icon: <MailOutlined />,
      //   label: 'Send Mail',
      //   onClick: () => showUserProfile(elm)
      // },
      // {
      //   key: 'pin',
      //   icon: <PushpinOutlined />,
      //   label: 'Add to Job OnBoard',
      //   onClick: () => showUserProfile(elm)
      // },
      
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => editfun(elm.id)
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
      title: "name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    // {
    //   title: "role",
    //   dataIndex: "role",
    //   sorter: (a, b) => a.role.length - b.role.length,
    // },
    {
      title: "description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> // Render HTML content
    },
    //   {
    //     title: "files",
    //     dataIndex: "files",
    //     sorter: (a, b) => a.files.length - b.files.length,
    //   },

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
      <div className="table-responsive mt-4">

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
        title="Add Document"
        visible={isAddTrainingSetupModalVisible}
        onCancel={closeTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddDocument onClose={closeTrainingSetupModal} />
      </Modal>

      <Modal
        title="Edit Document"
        visible={isEditTrainingSetupModalVisible}
        onCancel={closeEditTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditDocument onClose={closeEditTrainingSetupModal} idd={idd} />
      </Modal>

      {/* <Modal
        title="Edit Training Setup"
        visible={isViewTrainingSetupModalVisible}
        onCancel={closeViewTrainingSetupModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <ViewTrainingSetup onClose={closeViewTrainingSetupModal} idd={idd} />
      </Modal> */}
    </Card>
  );
};

export default DocumentList;
