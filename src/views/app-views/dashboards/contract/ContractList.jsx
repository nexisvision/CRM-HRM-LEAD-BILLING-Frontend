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
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
// import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
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

const ContractList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);

  const [idd, setIdd] = useState("");

  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddContractModalVisible, setIsAddContractModalVisible] =
    useState(false);
  const [isViewContractModalVisible, setIsViewContractModalVisible] =
    useState(false);
  const [isEditContractModalVisible, setIsEditContractModalVisible] =
    useState(false);
    const navigate = useNavigate();
  //   const [dealStatisticData] = useState(DealStatisticData);
  // Open Add Job Modal

  const tabledata = useSelector((state) => state.Contract);

  const openAddContractModal = () => {
    setIsAddContractModalVisible(true);
  };
  // Close Add Job Modal
  const closeAddContractModal = () => {
    setIsAddContractModalVisible(false);
  };

  const openViewContractModal = () => {
    navigate("/app/dashboards/project/contract/viewContract", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };
  // const openViewContractModal = () => {
  //   setIsViewContractModalVisible(true);
  // };
  // Close Add Job Modal
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
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
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

      message.success({ content: "Deleted user successfully", duration: 2 });
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
      // Format the data for Excel
      // const formattedData = list.map(row => ({
      //   ID: row.id,
      //   RelatedID: row.related_id,
      //   TaskName: row.taskName,
      //   Category: row.category,
      //   Project: row.project,
      //   StartDate: row.startDate,
      //   DueDate: row.dueDate,
      //   AssignedTo: JSON.parse(row.assignTo).join(", "), // Assuming assignTo is a JSON string
      //   Status: row.status,
      //   Priority: row.priority,
      //   Description: row.description.replace(/<[^>]+>/g, ''), // Remove HTML tags from description
      //   CreatedBy: row.created_by,
      //   CreatedAt: row.createdAt,
      //   UpdatedAt: row.updatedAt,
      // }));

      // Create a worksheet from the formatted data
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Contract"); // Append the worksheet to the workbook

      // Write the workbook to a file
      writeFile(wb, "ContractData.xlsx");
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

  useEffect(() => {
    dispatch(GetProject());
    dispatch(ClientData());
  }, []);

  useEffect(() => {
    dispatch(ContaractData());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.Contract && tabledata.Contract.data) {
      setUsers(tabledata.Contract.data);
    }
  }, [tabledata]);

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<CopyOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Duplicate</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewContractModal}
            size="small"
          >
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => Editfun(elm.id)}
            size="small"
          >
            <span className="">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<PushpinOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item> */}
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
    </Menu>
  );
  const tableColumns = [
    // {
    //   title: 'Name',
    //   dataIndex: 'name',
    //   sorter: {
    //     compare: (a, b) => a.branch.length - b.branch.length,
    //   },
    // },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "Client",
      dataIndex: "client",
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: "Project",
      dataIndex: "project",
      //   render: (status) => (
      //     <Tag className="text-capitalize" color={status === 'active' ? 'cyan' : 'red'}>
      //       {status}
      //     </Tag>
      //   ),
      sorter: {
        compare: (a, b) => a.status.length - b.status.length,
      },
    },
    {
      title: "Contract Type",
      dataIndex: "type",
      // render: (_, record) => (
      //     <div className="d-flex">
      //         <AvatarStatus size={30} src={record.image} name={record.name}/>
      //     </div>
      // ),
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "Contract Value",
      dataIndex: "value",
      // render: (_, record) => (
      //     <div className="d-flex">
      //         <AvatarStatus size={30} src={record.image} name={record.name}/>
      //     </div>
      // ),
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      // render: (_, record) => (
      //     <div className="d-flex">
      //         <AvatarStatus size={30} src={record.image} name={record.name}/>
      //     </div>
      // ),
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      // render: (_, record) => (
      //     <div className="d-flex">
      //         <AvatarStatus size={30} src={record.image} name={record.name}/>
      //     </div>
      // ),
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
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
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button
            type="primary"
            className="ml-2"
            onClick={openAddContractModal}
          >
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
export default ContractList;
