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
  FilePdfOutlined,
  PushpinOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../../Users/user-list/UserView";
import { utils, writeFile } from "xlsx";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobCandidate from "./AddJobCandidate";
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";

const JobCandidateList = () => {
  const [users, setUsers] = useState(userData);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobCandidateModalVisible, setIsAddJobCandidateModalVisible] =
    useState(false);
  const [annualStatisticData] = useState(AnnualStatisticData);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;

  useEffect(() => {
    dispatch(getjobapplication());
  }, []);

  useEffect(() => {
    if (fnddta) {
      setUsers(fnddta);
    }
  }, [fnddta]);

  // Open Add Job Modal
  const openAddJobCandidateModal = () => {
    setIsAddJobCandidateModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddJobCandidateModal = () => {
    setIsAddJobCandidateModalVisible(false);
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(users);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Candidates");
    writeFile(wb, "JobCandidates.xlsx");
  };

  const handleJob = () => {
    navigate("/app/hrm/jobs/jobcandidate/viewjobcandidate", {
      state: { user: selectedUser },
    });
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  // Delete user
  const deleteUser = (userId) => {
    setUsers(users.filter((item) => item.id !== userId));
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
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

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EyeOutlined />}
            onClick={handleJob}
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
            icon={<FilePdfOutlined />}
            onClick={() => showUserProfile(elm)}
            size="small"
          >
            <span className="ml-2">Download Cv</span>
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

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const tableColumns = [
    {
      title: "name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: "notice_period",
      dataIndex: "notice_period",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "location",
      dataIndex: "location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "job",
      dataIndex: "job",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "current_location",
      dataIndex: "current_location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "phone",
      dataIndex: "phone",
      sorter: (a, b) => a.totaldays.length - b.totaldays.length,
    },
    {
      title: "total_experience",
      dataIndex: "total_experience",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },
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
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex>
        <Flex gap="7px">
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
        title=""
        visible={isAddJobCandidateModalVisible}
        onCancel={closeAddJobCandidateModal}
        footer={null}
        width={800}
      >
        <AddJobCandidate onClose={closeAddJobCandidateModal} />
      </Modal>
    </Card>
  );
};

export default JobCandidateList;
