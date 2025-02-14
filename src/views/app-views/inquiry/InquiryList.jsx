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
// import Addpolicy from "./Addpolicy";
// import Editpolicy from "./Editpolicy";
// import EditJobOfferLetter from "./EditJobOfferLetter";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import AddInquiry from "./AddInquiry";
import EditInquiry from "./EditInquiry";
import { deleteinqu, getinqu } from "./inquiryReducer/inquirySlice";
// import { deletepolicys, getpolicys } from "./policyReducer/policySlice";
// import {
//   deletejobapplication,
//   getjobapplication,
// } from "./JobapplicationReducer/JobapplicationSlice";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const InquiryList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddinquiryModalVisible, setIsAddinquiryModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getinqu());
  }, []);

  const allbranch = useSelector((state) => state.inquiry);
  const fndbranch = allbranch.inquiry.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditinquiryModalVisible, setIsEditinquiryModalVisible] =
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

  const openAddinquiryModal = () => {
    setIsAddinquiryModalVisible(true);
  };

  const closeAddinquiryModal = () => {
    setIsAddinquiryModalVisible(false);
  };

  const openEditinquiryModal = () => {
    setIsEditinquiryModalVisible(true);
  };

  const closeEditinquiryModal = () => {
    setIsEditinquiryModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Inquiry"); // Append the sheet to the workbook

      writeFile(wb, "InquiryData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    dispatch(deleteinqu(userId)).then(() => {
      dispatch(getinqu());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      message.success({ content: `Deleted inquiry ${userId}`, duration: 2 });
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
    openEditinquiryModal();
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
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "message",
      dataIndex: "message",
      sorter: (a, b) => a.message.length - b.message.length,
    },
    {
      title: "subject",
      dataIndex: "subject",
      sorter: (a, b) => a.subject.length - b.subject.length,
    },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   sorter: (a, b) => a.phone.length - b.phone.length,
    // },
    // {
    //     title: "Subject",
    //     dataIndex: "subject",
    //     sorter: (a, b) => a.subject.length - b.subject.length,
    //   },
    //   {
    //     title: "Message",
    //     dataIndex: "message",
    //     sorter: (a, b) => a.message.length - b.message.length,
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
          <Button type="primary" className="ml-2" onClick={openAddinquiryModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
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
        title="Add Inquiry"
        visible={isAddinquiryModalVisible}
        onCancel={closeAddinquiryModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddInquiry onClose={closeAddinquiryModal} />
      </Modal>

      <Modal
        title="Edit Inquiry"
        visible={isEditinquiryModalVisible}
        onCancel={closeEditinquiryModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditInquiry onClose={closeEditinquiryModal} idd={idd} />
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

export default InquiryList;
