import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, Button, Modal, message } from "antd";
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
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { useNavigate } from "react-router-dom";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";

import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from "utils";
import { useDispatch, useSelector } from "react-redux";
import { deleteBranch, getBranch } from "./BranchReducer/BranchSlice";
// import { DeleteDept, getDept } from './DepartmentReducers/DepartmentSlice';

const BranchList = () => {
  const [users, setUsers] = useState(userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddBranchModalVisible, setIsAddBranchModalVisible] = useState(false);
  const [isEditBranchModalVisible, setIsEditBranchModalVisible] =
    useState(false);
  const [dept, setDept] = useState("");

  const [idd, setIdd] = useState("");

  const tabledata = useSelector((state) => state.Branch);
  const fnddata = tabledata.Branch.data;

  useEffect(() => {
    dispatch(getBranch());
  }, []);

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddata);
    }
  }, [fnddata]);

  // const navigate = useNavigate();

  const openAddBranchModal = () => {
    setIsAddBranchModalVisible(true);
  };

  const closeAddBranchModal = () => {
    setIsAddBranchModalVisible(false);
  };

  const openEditBranchModal = () => {
    setIsEditBranchModalVisible(true);
  };

  const closeEditBranchModal = () => {
    setIsEditBranchModalVisible(false);
  };

  const handleParticularBranchModal = () => {
    navigate("/app/hrm/department/particulardepartment", {
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

  //   useEffect(()=>{
  //     dispatch(getDept())
  //   },[dispatch]);

  const deleteUser = (userId) => {
    dispatch(deleteBranch(userId))
      .then(() => {
        dispatch(getBranch());
        message.success("Department Deleted successfully!");
        setUsers(users.filter((item) => item.id !== userId));
      })
      .catch((error) => {
        message.error("Failed to update department.");
        console.error("Edit API error:", error);
      });
  };

  const showUserProfile = (userInfo) => {
    setSelectedUser(userInfo);
    setUserProfileVisible(true);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const editDept = (Deptid) => {
    openEditBranchModal();
    setDept(Deptid);
    setIdd(Deptid);
  };

  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Button
          type=""
          icon={<EyeOutlined />}
          onClick={handleParticularBranchModal}
          size="small"
        >
          <span>View Details</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type=""
          icon={<EditOutlined />}
          onClick={() => editDept(elm.id)}
          size="small"
        >
          <span>Edit</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type=""
          icon={<PushpinOutlined />}
          onClick={() => showUserProfile(elm)}
          size="small"
        >
          <span>Pin</span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          type=""
          icon={<DeleteOutlined />}
          onClick={() => deleteUser(elm.id)}
          size="small"
        >
          <span>Delete</span>
        </Button>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Branch",
      dataIndex: "branchName",
      sorter: (a, b) => a.branchName.length - b.branchName.length,
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
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddBranchModal}>
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
        close={closeUserProfile}
      />

      {/* Add Department Modal */}
      <Modal
        title="Add Branch"
        visible={isAddBranchModalVisible}
        onCancel={closeAddBranchModal}
        footer={null}
        width={800}
      >
        <AddBranch onClose={closeAddBranchModal} />
      </Modal>

      {/* Edit Department Modal */}
      <Modal
        title="Edit Branch"
        visible={isEditBranchModalVisible}
        onCancel={closeEditBranchModal}
        footer={null}
        width={800}
      >
        <EditBranch onClose={closeEditBranchModal} comnyid={dept} idd={idd} />
      </Modal>
    </Card>
  );
};

export default BranchList;
