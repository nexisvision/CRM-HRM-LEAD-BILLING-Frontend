import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteClient, ClientData } from "./CompanyReducers/CompanySlice";
import { EyeOutlined, DeleteOutlined, EditOutlined, PushpinOutlined, RocketOutlined, PlusOutlined, FileExcelOutlined, AppstoreOutlined, UnorderedListOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Modal, message, Radio, Row, Col, Dropdown, Tag, Menu,Table} from "antd";
import AddCompany from "./AddCompany";
import EditCompany from "./EditCompany";
import ResetPassword from "./ResetPassword";
import utils from "utils";
import PlanUpgrade from "./PlanUpgrade";
import CompanyCard from './CompanyCard'; // Import the CompanyCard component
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";

const { Option } = Select;
const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const CompanyList = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(VIEW_GRID);  // Default to grid view
  const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] = useState(false);
  const [isEditCompanyModalVisible, setIsEditCompanyModalVisible] = useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] = useState(false);
  const [isUpgradePlanModalVisible, setIsUpgradePlanModalVisible] = useState(false);
  const [comnyid, setCompnyid] = useState("");

  const tableData = useSelector((state) => state.ClientData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(ClientData());
  }, [dispatch]);

  useEffect(() => {
    if (tableData && tableData.ClientData && tableData.ClientData.data) {
      setUsers(tableData.ClientData.data);
    }
  }, [tableData]);

  const handleShowStatus = (value) => {
    const filteredUsers = value !== 'All' ? users.filter(user => user.status === value) : users;
    setUsers(filteredUsers);
  };

  const handleCompanyClick = (id) => {
    navigate(`/app/company/${id}`);
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchResults = value ? users.filter(user => user.name.toLowerCase().includes(value.toLowerCase())) : users;
    setUsers(searchResults);
  };

  const deleteUser = (userId) => {
    dispatch(deleteClient(userId));
    message.success(`Deleted user ${userId}`);
  };

  const dropdownMenu = (user) => (
    <Menu>
      <Menu.Item>
        <Button icon={<EyeOutlined />} onClick={() => { }} size="small">View Details</Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon={<EditOutlined />} onClick={() => { setIsEditCompanyModalVisible(true); setCompnyid(user.id); }} size="small">Edit</Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon={<PushpinOutlined />} onClick={() => setIsResetPasswordModalVisible(true)} size="small">Reset Password</Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon={<RocketOutlined />} onClick={() => setIsUpgradePlanModalVisible(true)} size="small">Upgrade Plan</Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon={<DeleteOutlined />} onClick={() => deleteUser(user.id)} size="small">Delete</Button>
      </Menu.Item>
    </Menu>
  );

  const onChangeCompanyView = (e) => {
    setView(e.target.value);
  };
  const tableColumns = [
    {
      title: "Company",
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: "Email",
      dataIndex: "Email",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: " Application",
      dataIndex: " Application",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Add By",
      dataIndex: "Add By",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Offer Exprire On",
      dataIndex: "Offer Exprire On",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "Expected Joining Date",
      dataIndex: "Expected Joining Date",
      sorter: (a, b) => a.totaldays.length - b.totaldays.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
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
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={onSearch}
            className="w-60"
          />
          <Select
            defaultValue="All"
            style={{ width: 180 }}
            onChange={handleShowStatus}
            className="w-60"
            placeholder="Status"
          >
            <Option value="All">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="blocked">Blocked</Option>
          </Select>
        </div>

        <div className="flex gap-4 items-center">
          <Radio.Group value={view} onChange={onChangeCompanyView}>
            <Radio.Button value={VIEW_GRID} className="border-2 px-3 py-2 rounded-md">
              <AppstoreOutlined className="align-middle" />
            </Radio.Button>
            <Radio.Button value={VIEW_LIST} className="border-2 px-3 py-2 rounded-md">
              <UnorderedListOutlined className="align-middle" />
            </Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            onClick={() => setIsAddCompanyModalVisible(true)}
            icon={<PlusOutlined />}
          >
            New
          </Button>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Conditional rendering of grid or list view */}
      {view === VIEW_LIST ? (
        <div className="overflow-x-auto">
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        </div>
      ) : (
        <Row gutter={16}>
          {users.map((user) => (
            <Col key={user.id} xs={24} sm={12} lg={8} xl={6}>
              <CompanyCard company={user} />
            </Col>
          ))}
        </Row>
      )}

      {/* Modals */}
      <Modal title="Create Company" visible={isAddCompanyModalVisible} onCancel={() => setIsAddCompanyModalVisible(false)} footer={null} width={1100}>
        <AddCompany onClose={() => setIsAddCompanyModalVisible(false)} />
      </Modal>
      <Modal title="Edit Company" visible={isEditCompanyModalVisible} onCancel={() => setIsEditCompanyModalVisible(false)} footer={null} width={1000}>
        <EditCompany onClose={() => setIsEditCompanyModalVisible(false)} comnyid={comnyid} />
      </Modal>
      <Modal title="Reset Password" visible={isResetPasswordModalVisible} onCancel={() => setIsResetPasswordModalVisible(false)} footer={null} width={1000}>
        <ResetPassword onClose={() => setIsResetPasswordModalVisible(false)} />
      </Modal>
      <Modal title="Upgrade Plan" visible={isUpgradePlanModalVisible} onCancel={() => setIsUpgradePlanModalVisible(false)} footer={null} width={1000}>
        <PlanUpgrade onClose={() => setIsUpgradePlanModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default CompanyList;
