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
import userData from "../../../../assets/data/user-list.data.json";
import OrderListData from "../../../../assets/data/order-list.data.json";
import utils from "utils";
import { Deletetrainng, GetallTrainng } from "./TrainingReducer/TrainingSlice";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ViewTrainingSetup from "./ViewTrainingSetup";
// import ViewJobApplication from './ViewJobApplication';

const { Option } = Select;

const TrainingSetupList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
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
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
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
      <Menu.Item>
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
          <Button
            type="primary"
            className="ml-2"
            onClick={openAddTrainingSetupModal}
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
        <Table
          columns={tableColumns}
          dataSource={users}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
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
