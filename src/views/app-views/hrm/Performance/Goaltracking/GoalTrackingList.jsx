import React, { useState } from "react";
import {
  Card,
  Table,
  Input,
  message,
  Button,
  Modal,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
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

  const getDropdownItems = (record) => {
    return [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => showUserProfile(record)
      },
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: openEditGoalTrackingModal
      },
      {
        key: 'pin',
        icon: <PushpinOutlined />,
        label: 'Pin',
        onClick: () => showUserProfile(record)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(record.id),
        danger: true
      }
    ];
  };

  const tableColumns = [
    {
      title: "Goal Type",
      dataIndex: "goaltype",
      sorter: (a, b) => a.goaltype?.length - b.goaltype?.length,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      sorter: (a, b) => a.subject?.length - b.subject?.length,
    },
    {
      title: "Branch",
      dataIndex: "branch",
      sorter: (a, b) => a.branch?.length - b.branch?.length,
    },
    {
      title: "Target Achievement",
      dataIndex: "targetachievement",
      sorter: (a, b) => a.targetachievement?.length - b.targetachievement?.length,
    },
    {
      title: "Overall Rating",
      dataIndex: "overallrating",
      sorter: (a, b) => a.overallrating?.length - b.overallrating?.length,
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
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
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

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
              className="search-input"
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

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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

  .ant-btn-text:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  .ant-btn-text:active {
    background-color: rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const GoalTrackingListWithStyles = () => (
  <>
    <style>{styles}</style>
    <GoalTrackingList />
  </>
);

export default GoalTrackingListWithStyles;
