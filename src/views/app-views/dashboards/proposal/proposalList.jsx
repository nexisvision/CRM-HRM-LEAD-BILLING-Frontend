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

import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import userData from "../../../../assets/data/user-list.data.json";
import OrderListData from "../../../../assets/data/order-list.data.json";
import utils from "utils";
import useSelection from "antd/es/table/hooks/useSelection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AddProposal from "./AddProposal";
import EditProposal from "./EditProposal";
import { delpropos, getpropos } from "./proposalReducers/proposalSlice";

const { Option } = Select;

const ProposalList = () => {
  const [users, setUsers] = useState(userData);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  // const [viewApplicationVisible, setViewApplicationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddProposalModalVisible, setIsAddProposalSetupModalVisible] =
    useState(false);
  const [isEditProposalModalVisible, setIsEditProposalModalVisible] =
    useState(false);
  //   const [isViewTrainingSetupModalVisible, setIsViewTrainingSetupModalVisible] =
  //     useState(false);

  const [idd, setIdd] = useState("");

  useEffect(() => {
    dispatch(getpropos());
  }, [dispatch]);

  const allproposal = useSelector((state) => state?.proposal);
  const fnddatas = allproposal?.proposal?.data;

  useEffect(() => {
    setUsers(fnddatas);
  }, [fnddatas]);

  const allempdata = useSelector((state) => state.Training);
  const fnddata = allempdata.Training.data;

  const openAddProposalModal = () => {
    setIsAddProposalSetupModalVisible(true);
  };

  const closeProposalModal = () => {
    setIsAddProposalSetupModalVisible(false);
  };

  const openEditProposalModal = () => {
    setIsEditProposalModalVisible(true);
  };

  const closeEditProposalModal = () => {
    setIsEditProposalModalVisible(false);
  };

  //   const openviewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(true);
  //   };

  //   const closeViewTrainingSetupModal = () => {
  //     setIsViewTrainingSetupModalVisible(false);
  //   };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const deleteUser = (userId) => {
    dispatch(delpropos(userId)).then(() => {
      dispatch(getpropos());
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
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  const editfun = (idd) => {
    openEditProposalModal();
    setIdd(idd);
  };
  //   const viewfun = (idd) => {
  //     openviewTrainingSetupModal();
  //     setIdd(idd);
  //   };

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
            // onClick={() => viewfun(elm.id)}
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
      title: "calculatedTax",
      dataIndex: "calculatedTax",
      sorter: (a, b) => a.calculatedTax.length - b.calculatedTax.length,
    },
    {
      title: "created_by ",
      dataIndex: "created_by",
      sorter: (a, b) => a.created_by.length - b.created_by.length,
    },
    {
      title: "description",
      dataIndex: "description",
      sorter: (a, b) => a.description.length - b.description.length,
    },
    {
      title: "discount",
      dataIndex: "discount",
      sorter: (a, b) => a.discount.length - b.discount.length,
    },
    {
      title: "tax",
      dataIndex: "tax",
      sorter: (a, b) => a.tax.length - b.tax.length,
    },
    {
      title: "total",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
    },
    {
      title: "valid_till",
      dataIndex: "valid_till",
      sorter: (a, b) => a.valid_till.length - b.valid_till.length,
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
            onClick={openAddProposalModal}
          >
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-4">
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
        title="Add Proposal"
        visible={isAddProposalModalVisible}
        onCancel={closeProposalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddProposal onClose={closeProposalModal} />
      </Modal>

      <Modal
        title="Edit Proposal"
        visible={isEditProposalModalVisible}
        onCancel={closeEditProposalModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditProposal onClose={closeEditProposalModal} idd={idd} />
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

export default ProposalList;
