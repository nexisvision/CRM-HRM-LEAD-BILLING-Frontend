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
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobOfferLetter from "./AddJobOfferLetter";
import EditJobOfferLetter from "./EditJobOfferLetter";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  deletejobofferss,
  getjobofferss,
} from "./jobOfferletterReducer/jobofferlateerSlice";
// import {
//   deletejobapplication,
//   getjobapplication,
// } from "./JobapplicationReducer/JobapplicationSlice";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const JobOfferLetterList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddJobOfferLetterModalVisible, setIsAddJobOfferLetterModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getjobofferss());
  }, []);
 
const user = useSelector((state) => state.user.loggedInUser.username);

  const alldatas = useSelector((state) => state.joboffers);
  const fnddata = alldatas.joboffers.data || [];

  const fnddtaa = fnddata.filter((item) => item.created_by === user);

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddtaa);
    }
  }, [fnddata]);

  const [
    isAddJobEditJobOfferLetterModalVisible,
    setIsEditJobOfferLetterModalVisible,
  ] = useState(false);

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;

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
                       
                          if (parsedPermissions["extra-hrm-jobs-jobonbording"] && parsedPermissions["extra-hrm-jobs-jobonbording"][0]?.permissions) {
                            allpermisson = parsedPermissions["extra-hrm-jobs-jobonbording"][0].permissions;
                            // console.log('Parsed Permissions:', allpermisson);
                          
                          } else {
                            // console.log('extra-hrm-jobs-jobonbording is not available');
                          }
                          
                          const canCreateClient = allpermisson?.includes('create');
                          const canEditClient = allpermisson?.includes('edit');
                          const canDeleteClient = allpermisson?.includes('delete');
                          const canViewClient = allpermisson?.includes('view');
                       
                          ///endpermission



  //   useEffect(() => {
  //     dispatch(getjobapplication());
  //   }, []);

  //   useEffect(() => {
  //     if (fnddta) {
  //       setUsers(fnddta);
  //     }
  //   }, [fnddta]);

  const openAddJobOfferLetterModal = () => {
    setIsAddJobOfferLetterModalVisible(true);
  };

  const closeAddJobOfferLetterModal = () => {
    setIsAddJobOfferLetterModalVisible(false);
  };

  const openEditJobOfferLetterModal = () => {
    setIsEditJobOfferLetterModalVisible(true);
  };

  const closeEditJobOfferLetterModal = () => {
    setIsEditJobOfferLetterModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : [];
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    dispatch(deletejobofferss(userId)).then(() => {
      dispatch(getjobofferss());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      // message.success({ content: `Deleted user ${userId}`, duration: 2 });
    });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "JobOfferLatter"); // Append the sheet to the workbook

      writeFile(wb, "JobOfferLatterData.xlsx"); // Save the file as ProposalData.xlsx
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

  const jobStatusList = ["active", "blocked"];

  const eidtfun = (idd) => {
    openEditJobOfferLetterModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} size="small">
            <span>View Details</span>
          </Button>
        </Flex>
      </Menu.Item> */}
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
      </Menu.Item> */}
      {/* <Menu.Item>
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
                                        onClick={() => eidtfun(elm.id)}
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
                                       <span>Delete</span>
                                     </Button>
                                   </Flex>
                                 </Menu.Item>
                                ) : null}
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "Offer",
    //   dataIndex: "Offer",
    //   //   render: (_, record) => (
    //   //     <div className="d-flex">
    //   //       <AvatarStatus
    //   //         src={record.img}
    //   //         name={record.name}
    //   //         subTitle={record.email}
    //   //       />
    //   //     </div>
    //   //   ),
    //   sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    // },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: (a, b) => a.salary.length - b.salary.length,
    },
    {
      title: "Offer Expiry",
      dataIndex: "offer_expiry",
      render: (text) => dayjs(text).format("DD-MM-YYYY"), // Format the date
    },
    {
      title: "Expected Joining Date",
      dataIndex: "expected_joining_date",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
    // {
    //   title: "created_by",
    //   dataIndex: "created_by",
    //   sorter: (a, b) => a.created_by.length - b.created_by.length,
    // },
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
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={onSearch}
            />
          </div>
          {/* <div className="w-full md:w-48 ">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Job </Option>
              {jobStatusList.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div> */}
        </Flex>
        <Flex gap="7px">
         

             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                            <Button
                                                                                                                            type="primary"
                                                                                                                            className="ml-2"
                                                                                                                            onClick={openAddJobOfferLetterModal}
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
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} /> */}
      <Modal
        title="Add Job Offer Letter"
        visible={isAddJobOfferLetterModalVisible}
        onCancel={closeAddJobOfferLetterModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddJobOfferLetter onClose={closeAddJobOfferLetterModal} />
      </Modal>

      <Modal
        title="Edit Job Offer Letter"
        visible={isAddJobEditJobOfferLetterModalVisible}
        onCancel={closeEditJobOfferLetterModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditJobOfferLetter onClose={closeEditJobOfferLetterModal} idd={idd} />
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

export default JobOfferLetterList;
