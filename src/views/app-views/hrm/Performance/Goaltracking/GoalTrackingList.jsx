import React, { useState } from "react";
import {
  Card,
  Table,
  Menu,
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
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddGoalTracking from "./AddGoalTracking";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import EditGoalTracking from "./EditGoalTracking";

const GoalTrackingList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [isAddGoalTrackingModalVisible, setAddGoalTrackingModalVisible] = useState(false);
  const [isEditGoalTrackingModalVisible, setEditGoalTrackingModalVisible] = useState(false);


  const openAddGoalTrackingModal = () => {
    setAddGoalTrackingModalVisible(true);
  };

  const closeAddGoalTrackingModal = () => {
    setAddGoalTrackingModalVisible(false);
  };



  const openEditGoalTrackingModal = () => {
    setEditGoalTrackingModalVisible(true);
  };

  const closeEditGoalTrackingModal = () => {
    setEditGoalTrackingModalVisible(false);
  };



  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

  const deleteUser = (userId) => {
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

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
      <Flex alignItems="center">
        <Button
        type=""
          icon={<EyeOutlined />}
          onClick={() => showUserProfile(elm)}
          size="small"
        >
          View Details
          
        </Button>
      </Flex>
      </Menu.Item>
      <Menu.Item>
      <Flex alignItems="center">
        <Button
        type=""
          icon={<EditOutlined />}
          onClick={openEditGoalTrackingModal}
          size="small"
        >
          Edit
        </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
      <Flex alignItems="center">
        <Button
        type=""
          icon={<PushpinOutlined />}
          onClick={() => showUserProfile(elm)}
          size="small"
        >
          Pin
        </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
      <Flex alignItems="center">
        <Button
        type=""
          icon={<DeleteOutlined />}
          onClick={() => deleteUser(elm.id)}
          size="small"
        >
          Delete
        </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Goal Type",
      dataIndex: "goaltype",
      sorter: (a, b) => a.goaltype.length - b.goaltype.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: (a, b) => a.subject.length - b.subject.length,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: (a, b) => a.branch.length - b.branch.length,
    },
    {
      title: "Target Achievement",
      dataIndex: "targetachievement",
      sorter: (a, b) => a.targetachievement.length - b.targetachievement.length,
    },
    {
      title: "Overall Rating",
      dataIndex: "overallrating",
      sorter: (a, b) => a.overallrating.length - b.overallrating.length,
    },
    {
      title: "Start Date",
      dataIndex: "startdate",
      sorter: (a, b) => dayjs(a.startdate).unix() - dayjs(b.startdate).unix(),
    },
    {
      title: "End Date",
      dataIndex: "enddate",
      sorter: (a, b) => dayjs(a.enddate).unix() - dayjs(b.enddate).unix(),
    },
    {
      title: "Progress",
      dataIndex: "progress",
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
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
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
            onClick={openAddGoalTrackingModal}
          >
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={() => closeUserProfile()}
      />

      <Modal
        title="Add New GoalTracking"
        visible={isAddGoalTrackingModalVisible}
        onCancel={closeAddGoalTrackingModal}
        footer={null}
        width={800}
      >
        <AddGoalTracking onClose={closeAddGoalTrackingModal} />
      </Modal>

      <Modal
        title="Edit GoalTracking"
        visible={isEditGoalTrackingModalVisible}
        onCancel={closeEditGoalTrackingModal}
        footer={null}
        width={800}
      >
        <EditGoalTracking onClose={closeEditGoalTrackingModal} />
      </Modal>
    </Card>
  );
};

export default GoalTrackingList;
