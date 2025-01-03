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
  EditOutlined,
  FileAddOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { DealStatisticData } from "../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddDeal from "./AddDeal";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import EditDeal from "./EditDeal";
import ViewDeal from "./ViewDeal";
import { useDispatch, useSelector } from "react-redux";
import { DeleteDeals, GetDeals } from "./DealReducers/DealSlice";
import { useNavigate } from "react-router-dom";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";

const DealList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewDealVisible, setViewDealVisible] = useState(false);

  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDealModalVisible, setIsAddDealModalVisible] = useState(false);
  const [isViewDealModalVisible, setIsViewDealModalVisible] = useState(false);

  const [isEditDealModalVisible, setIsEditDealModalVisible] = useState(false);

  const [idd, setIdd] = useState("");

  const [dealStatisticData] = useState(DealStatisticData);

  const tabledata = useSelector((state) => state.Deals);

  // Open Add Job Modal
  const openAddDealModal = () => {
    setIsAddDealModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddDealModal = () => {
    setIsAddDealModalVisible(false);
  };

  const openEditDealModal = () => {
    setIsEditDealModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditDealModal = () => {
    setIsEditDealModalVisible(false);
  };

  const openViewDealModal = () => {
    navigate("/app/dashboards/project/deal/viewDeal", {
      state: { user: selectedUser },
    }); // Pass user data as state if needed
  };

  // const openViewDealModal = () => {
  //   setIsViewDealModalVisible(true);
  // };

  // Close Add Job Modal
  const closeViewDealModal = () => {
    setIsViewDealModalVisible(false);
  };

  // Search functionality
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteDeals(userId));

      const updatedData = await dispatch(GetDeals());

      setUsers(users.filter((item) => item.id !== userId));

      message.success({ content: "Deleted user successfully", duration: 2 });
    } catch (error) {
      console.error("Error deleting user:", error);
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
    dispatch(GetDeals());
  }, []);

  useEffect(() => {
    if (tabledata && tabledata.Deals && tabledata.Deals.data) {
      setUsers(tabledata.Deals.data);
    }
  }, [tabledata]);

  const EditDelas = (id) => {
    openEditDealModal();
    setIdd(id);
  };

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={openViewDealModal}
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
            icon={<MailOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => EditDelas(elm.id)}
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
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "clients",
      sorter: {
        compare: (a, b) => a.branch.length - b.branch.length,
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.title.length - b.title.length,
      },
    },
    {
      title: "Stage",
      dataIndex: "dealName",
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
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
      title: "User",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus size={30} src={record.image} name={record.name} />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
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
      <Row gutter={16}>
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
      </Row>
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
          <Button type="primary" className="ml-2" onClick={openAddDealModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
          <Button type="primary" icon={<FileAddOutlined />} block>
            Import All
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
      {/* <ViewDeal visible={viewDealVisible} close={closeViewDeal} /> */}

      {/* Add Job Modal */}
      <Modal
        title="Add Deal"
        visible={isAddDealModalVisible}
        onCancel={closeAddDealModal}
        footer={null}
        width={800}
        className="mt-[-70 px]"
      >
        <AddDeal onClose={closeAddDealModal} />
      </Modal>
      <Modal
        title="Edit Deal"
        visible={isEditDealModalVisible}
        onCancel={closeEditDealModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditDeal onClose={closeEditDealModal} id={idd} />
      </Modal>

      <Modal
        className="mt-[-70px]"
        title="Deal"
        visible={isViewDealModalVisible}
        onCancel={closeViewDealModal}
        footer={null}
        width={1800}
      >
        <ViewDeal onClose={closeViewDealModal} />
      </Modal>
    </Card>
  );
};

export default DealList;
