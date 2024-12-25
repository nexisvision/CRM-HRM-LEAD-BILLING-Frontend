import React, { useEffect, useState } from "react";
import { Card, Table, Input, Tag, Menu, Button,Select,Modal, message } from "antd";
import { EyeOutlined, DeleteOutlined, MailOutlined,RocketOutlined, PushpinOutlined,SearchOutlined,EditOutlined,PlusOutlined,FileExcelOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import UserView from "../Users/user-list/UserView";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import OrderListData from 'assets/data/order-list.data.json';
import utils from 'utils';


import userData from "assets/data/user-list.data.json";
import AddCompany from "./AddCompany";
import EditCompany from "./EditCompany";
import ResetPassword from "./ResetPassword";
import PlanUpgrade from "./PlanUpgrade";
import { useDispatch, useSelector } from "react-redux";
import { ClientData, deleteClient } from "./CompanyReducers/CompanySlice";

const { Option } = Select;

const CompanyList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] = useState(false);
  const [isEditCompanyModalVisible, setIsEditCompanyModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [isUpgradePlanModalVisible, setIsUpgradePlanModalVisible] = useState(false);
  const [comnyid,setCompnyid] = useState("");

  const tabledata = useSelector((state) => state.ClientData);
  console.log("ooooo",tabledata)

  const dispatch = useDispatch();


  const deleteUser = (userId) => {
    dispatch(deleteClient(userId))
    setUsers(users.filter((user) => user.id !== userId));
    dispatch(ClientData())
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const getCompanyStatus = status => {
    if (status === 'active') {
      return 'blue'
    }
    if (status === 'blocked') {
      return 'cyan'
    }
    return ''
  }
  const comId = (id) =>{
    setCompnyid(id);
  }


    useEffect(() => {
      dispatch(ClientData());
    }, [dispatch]);
  
    useEffect(() => {
       if (tabledata && tabledata.ClientData && tabledata.ClientData.data) {
         setUsers(tabledata.ClientData.data);
       }
     }, [tabledata]);


  const companyStatusList = ['active', 'blocked'];

  const handleShowStatus = (value) => {
    if (value !== 'All') {
      const key = 'status';
      const data = utils.filterArray(userData, key, value);
      setUsers(data);
    } else {
      setUsers(userData);
    }
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
  };

const openAddCompanyModal = () => {
    setIsAddCompanyModalVisible(true);
  };

  const closeAddCompanyModal = () => {
    setIsAddCompanyModalVisible(false);
  };

  const openEditCompanyModal = () => {
    setIsEditCompanyModalVisible(true);
  };

  const closeEditCompanyModal = () => {
    setIsEditCompanyModalVisible(false);
  };

  const openResetPasswordModal = () => {
    setIsResetPasswordModalVisible(true);
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalVisible(false);
  };


  const openUpgradePlanModal = () => {
    setIsUpgradePlanModalVisible(true);
  };

  const closeUpgradePlanModal = () => {
    setIsUpgradePlanModalVisible(false);
  };


  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const dropdownMenu = (user) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
      <Button
        type=""
        icon={<EyeOutlined />}
        onClick={() => showUserProfile(user)}
        size="small"
        style={{ display: "block", marginBottom: "8px" }}
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
  onClick={() => {
    openEditCompanyModal();
    comId(user.id); // Call the delete user function
  }}
  size="small"
  style={{ display: "block", marginBottom: "8px" }}
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
        onClick={openResetPasswordModal}
        size="small"
        style={{ display: "block", marginBottom: "8px" }}
      >
        Reset Password
      </Button>
      </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
      <Button
        type=""
        icon={<RocketOutlined />}
        onClick={openUpgradePlanModal}
        size="small"
        style={{ display: "block", marginBottom: "8px" }}
      >
        UpgradePlan
      </Button>
      </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
      <Button
        type=""
        icon={<DeleteOutlined />}
        onClick={() => deleteUser(user.id)}
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
      title: "Company",
      dataIndex: "company",
      sorter: (a, b) => a.company.length - b.company.length,
    },
    {
      title: "Client",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus src={record.img} name={record.name} subTitle={record.email} />
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Pending Project",
      dataIndex: "pendingprojects",
      sorter: (a, b) => a.pendingprojects.length - b.pendingprojects.length,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Invoices",
      dataIndex: "invoices",
      sorter: (a, b) => a.invoices.length - b.invoices.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: "Last online",
      dataIndex: "lastOnline",
      sorter: (a, b) => dayjs(a.lastOnline).unix() - dayjs(b.lastOnline).unix(),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
				<><Tag color={getCompanyStatus(record.status)}>{record.status}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, user) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(user)} />
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
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Select.Option value="All">All Status</Select.Option>
              {companyStatusList.map((elm) => (
                <Select.Option key={elm} value={elm}>
                  {elm}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddCompanyModal}>
            <PlusOutlined />
            New
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      {userProfileVisible && (
        <UserView
          data={selectedUser}
          visible={userProfileVisible}
          close={closeUserProfile}
        />
      )}
       <Modal
        title="Create Company"
        visible={isAddCompanyModalVisible}
        onCancel={closeAddCompanyModal}
        footer={null}
        width={1100}
        // className="mt-[-70px]"
      >
        <AddCompany onClose={closeAddCompanyModal} />
      </Modal>
      <Modal
        title="Edit Company"
        visible={isEditCompanyModalVisible}
        onCancel={closeEditCompanyModal}
        footer={null}
        width={1000}
      >
        <EditCompany onClose={closeEditCompanyModal} comnyid={comnyid} />
      </Modal>

      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={closeResetPasswordModal}
        footer={null}
        width={1000}
      >
        <ResetPassword onClose={closeResetPasswordModal} />
      </Modal>
      <Modal
        title="Upgrade Plan"
        visible={isUpgradePlanModalVisible}
        onCancel={closeUpgradePlanModal}
        footer={null}
        width={1000}
      >
        <PlanUpgrade onClose={closeUpgradePlanModal} />
      </Modal>
    </Card>
  );
};

export default CompanyList;
