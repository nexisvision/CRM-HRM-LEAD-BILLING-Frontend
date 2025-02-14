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
// import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import Addpolicy from "./Addpolicy";
import Editpolicy from "./Editpolicy";
// import EditJobOfferLetter from "./EditJobOfferLetter";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deletepolicys, getpolicys } from "./policyReducer/policySlice";
// import {
//   deletejobapplication,
//   getjobapplication,
// } from "./JobapplicationReducer/JobapplicationSlice";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const PolicyList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddpolicyModalVisible, setIsAddpolicyModalVisible] = useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getpolicys());
  }, []);

  const allbranch = useSelector((state) => state.policy);
  const fndbranch = allbranch.policy.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditpolicyModalVisible, setIsEditpolicyModalVisible] =
    useState(false);

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;

  //   useEffect(() => {
  //     dispatch(getjobapplication());
  //   }, []);

  //   useEffect(() => {
  //     if (fnddta) {
  //       setUsers(fnddta);
  //     }
  //   }, [fnddta]);

  const openAddpolicyModal = () => {
    setIsAddpolicyModalVisible(true);
  };

  const closeAddpolicyModal = () => {
    setIsAddpolicyModalVisible(false);
  };

  const openEditJobOfferLetterModal = () => {
    setIsEditpolicyModalVisible(true);
  };

  const closeEditpolicyModal = () => {
    setIsEditpolicyModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    dispatch(deletepolicys(userId)).then(() => {
      dispatch(getpolicys());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      message.success({ content: `Deleted Policy ${userId}`, duration: 2 });
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

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Policy"); // Append the sheet to the workbook

      writeFile(wb, "PolicyData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
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
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  const jobStatusList = ["active", "blocked"];

  const eidtfun = (idd) => {
    openEditJobOfferLetterModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
  
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
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "Branch",
    //   dataIndex: "Branch",
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
      title: "Title",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
      sorter: (a, b) => a.description.length - b.description.length,
    },
    // {
    //   title: "Created By",
    //   dataIndex: "created_by",
    //   sorter: (a, b) => a.created_by.length - b.created_by.length,
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
          <Button type="primary" className="ml-2" onClick={openAddpolicyModal}>
            <PlusOutlined />
            <span>New</span>  
          </Button>
          {/* <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
                Export All
              </Button> */}
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table
          columns={tableColumns}
          dataSource={users}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>
      {/* <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      /> */}

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} /> */}
      <Modal
        title="Add Policy"
        visible={isAddpolicyModalVisible}
        onCancel={closeAddpolicyModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <Addpolicy onClose={closeAddpolicyModal} />
      </Modal>

      <Modal
        title="Edit Policy"
        visible={isEditpolicyModalVisible}
        onCancel={closeEditpolicyModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <Editpolicy onClose={closeEditpolicyModal} idd={idd} />
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

export default PolicyList;
