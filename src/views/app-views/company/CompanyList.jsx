import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteClient, ClientData } from "./CompanyReducers/CompanySlice";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PushpinOutlined,
  RocketOutlined,
  PlusOutlined,
  FileExcelOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Modal,
  message,
  Radio,
  Row,
  Col,
  Dropdown,
  Tag,
  Menu,
  Table,
} from "antd";
import { MdOutlineEmail } from "react-icons/md";
import AddCompany from "./AddCompany";
import EditCompany from "./EditCompany";
import ResetPassword from "./ResetPassword";
import utils from "utils";
import PlanUpgrade from "./PlanUpgrade";
import CompanyCard from "./CompanyCard"; // Import the CompanyCard component
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import { getsubplandata } from "../subscribeduserplans/subplanReducer/subplanSlice";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddUpgradePlan from './AddUpgradePlan';
import EmailVerificationModal from "./EmailVerification";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Option } = Select;
const VIEW_LIST = "LIST";
const VIEW_GRID = "GRID";

const CompanyList = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(VIEW_GRID); // Default to grid view
  const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] =
    useState(false);
  const [isEditCompanyModalVisible, setIsEditCompanyModalVisible] =
    useState(false);
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [isUpgradePlanModalVisible, setIsUpgradePlanModalVisible] =
    useState(false);
  const [comnyid, setCompnyid] = useState("");
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: "",
  });

  // New state for editing company card modal
  // const [isEditCompanyCardModalVisible, setIsEditCompanyCardModalVisible] = useState(false);

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
    const filteredUsers =
      value !== "All" ? users.filter((user) => user.status === value) : users;
    setUsers(filteredUsers);
  };

  const handleCompanyClick = (id) => {
    navigate(`/app/company/${id}`);
  };

  const handleEmailVerification = async (email) => {
    try {
      // Add your email verification logic here
      // await dispatch(sendVerificationEmail(email));
      message.success('Verification email sent successfully');
    } catch (error) {
      message.error('Failed to send verification email');
    }
  };


  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    const searchResults = value
      ? users.filter((user) => user.username.toLowerCase().includes(value))
      : tableData.ClientData.data; // Reset to original data if search is cleared
    setUsers(searchResults);
  };

  const deleteUser = (userId) => {
    dispatch(deleteClient(userId))
      .then(()=>{
        dispatch(ClientData());
        message.success(`Deleted Company successfully`);
      })
  };

  const dropdownMenu = (user) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => {
          setIsEditCompanyModalVisible(true);
          setCompnyid(user.id);
        }
      },
      {
        key: 'email',
        icon: <MdOutlineEmail />,
        label: 'Update Email',
        onClick: () => {
          setIsEmailVerificationModalVisible(true);
          setCompnyid(user.id);
        }
      },
      {
        key: 'upgrade',
        icon: <RocketOutlined />,
        label: 'Upgrade Plans',
        onClick: () => {
          setIsUpgradePlanModalVisible(true);
          setCompnyid(user.id);
        }
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(user.id)
      }
    ]
  });

  const onChangeCompanyView = (e) => {
    setView(e.target.value);
  };

  const tableColumns = [

    // {
    //       title: "profilePic",
    //       dataIndex: 'profilePic',
    //       render: (_, record) => (
    //         <AvatarStatus
    //           src={record.profilePic}
    //           name={record.username || record.firstName}
    //           size={40}
    //         />
    //       ),
    //     },

    {
      title: "profilePic",
      dataIndex: 'profilePic',
      render: (_, record) => (
        <div className="d-flex align-items-center">
          {record.profilePic ? (
            <AvatarStatus
              src={record.profilePic}
              name={record.username || record.firstName}
              size={40}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="d-flex align-items-center">
              <Avatar
                size={40}
                icon={<UserOutlined style={{ color: '#666666' }} />}
                style={{
                  backgroundColor: '#f0f0f0',
                  marginRight: '8px'
                }}
              />
              <span>{record.username}</span>
            </div>
          )}
        </div>
      ),
    },

    {
      title: "Company",
      dataIndex: "username",
      sorter: (a, b) => (a.username.toLowerCase() > b.username.toLowerCase() ? -1 : 1),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => utils.antdTableSorter(a, b, "phone"),
    },

    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => utils.antdTableSorter(a, b, "lastName"),
    },

    {
      title: "GSTIN",
      dataIndex: "gstIn",
      sorter: (a, b) => utils.antdTableSorter(a, b, "gstIn"),
    },

    {
      title: "Bank Name",
      dataIndex: "bankname",
      sorter: (a, b) => utils.antdTableSorter(a, b, "bankname"),
    },

    {
      title: "IFSC",
      dataIndex: "ifsc",
      sorter: (a, b) => utils.antdTableSorter(a, b, "ifsc"),
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
         
        </div>

        <div className="flex gap-4 ">
          <Radio.Group value={view} onChange={onChangeCompanyView}>
            <Radio.Button
              value={VIEW_GRID}
              className="border-[2px] px-[12px] py-[8px] rounded-[6px] inline-flex items-center justify-center"
            >
              <AppstoreOutlined />
            </Radio.Button>
            <Radio.Button
              value={VIEW_LIST}
              className="border-[2px] px-[12px] py-[8px] rounded-[6px] inline-flex items-center justify-center"
            >
              <UnorderedListOutlined />
            </Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            onClick={() => setIsAddCompanyModalVisible(true)}
            icon={<PlusOutlined />}
          >
            New
          </Button>
          {/* <Button type="primary" icon={<FileExcelOutlined />}>
            Export
          </Button> */}
        </div>
      </div>

      {/* Conditional rendering of grid or list view */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <h3 className="text-lg font-semibold text-gray-600">No Data Available</h3>
          <p className="text-gray-500">Please add new companies to see them listed here.</p>
        </div>
      ) : view === VIEW_LIST ? (
        <div className="overflow-x-auto">
          <Table
            columns={tableColumns}
            dataSource={users}
            rowKey="id"
            scroll={{ x: 1200 }}
          />
        </div>
      ) : (
        <Row gutter={[24, 24]} className="px-4">
          {users.map((user) => (
            <Col
              key={user.id}
              xs={24}
              sm={12}
              lg={8}
              xl={6}
              className="mb-6"
            >
              <CompanyCard
                company={user}
                onEdit={(id) => {
                  setIsEditCompanyModalVisible(true);
                  setCompnyid(id);
                }}
                onDelete={deleteUser}
                onUpgrade={(id) => {
                  setIsUpgradePlanModalVisible(true);
                  setCompnyid(id);
                }}
                onEmailUpdate={(id) => {
                  setIsEmailVerificationModalVisible(true);
                  setCompnyid(id);
                }}
                onCompanyClick={handleCompanyClick}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Modals */}
      <Modal
        title="Create Company"
        visible={isAddCompanyModalVisible}
        onCancel={() => setIsAddCompanyModalVisible(false)}
        footer={null}
      >
        <AddCompany onClose={() => setIsAddCompanyModalVisible(false)} />
      </Modal>

      <Modal
        title="Edit Company"
        visible={isEditCompanyModalVisible}
        onCancel={() => setIsEditCompanyModalVisible(false)}
        width={900}
        // className="1200px"
        footer={null}
      >
        <EditCompany
          onClose={() => setIsEditCompanyModalVisible(false)}
          comnyid={comnyid}
        />
      </Modal>



      <EmailVerificationModal
        visible={isEmailVerificationModalVisible}
        onCancel={() => setIsEmailVerificationModalVisible(false)}
        onSubmit={handleEmailVerification}
        idd={comnyid}
        initialEmail={initialValues.email}
      />

      <Modal
        title="Reset Password"
        visible={isResetPasswordModalVisible}
        onCancel={() => setIsResetPasswordModalVisible(false)}
        footer={null}
      >
        <ResetPassword onClose={() => setIsResetPasswordModalVisible(false)} />
      </Modal>

      <Modal
        title="Upgrade Plan"
        visible={isUpgradePlanModalVisible}
        onCancel={() => setIsUpgradePlanModalVisible(false)}
        footer={null}
        width={800}
      >
        <AddUpgradePlan
          onClose={() => setIsUpgradePlanModalVisible(false)}
          comnyid={comnyid}
        />
      </Modal>
    </div>
  );
};

export default CompanyList;
