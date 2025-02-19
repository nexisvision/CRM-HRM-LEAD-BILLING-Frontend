import React, { useEffect, useState } from "react";
import { Card, Table, Menu, Input, message, Button, Modal, Space } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddSalary from "./AddSalary";
import SetSalary from "./SetSalary";
import { useDispatch, useSelector } from "react-redux";
import { deleteSalaryss, getSalaryss } from "./SalaryReducers/SalarySlice";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import { useNavigate } from "react-router-dom";

const SalaryList = () => {
  const [list, setList] = useState([]);
  const [id, setId] = useState(null);
  const [userId, setUserId] = useState(null);
  const dispatch = useDispatch();
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
  const [isSetSalaryModalVisible, setIsSetSalaryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const navigate = useNavigate();
  const openSetSalaryModal = () => setIsSetSalaryModalVisible(true);
  const closeSetSalaryModal = () => setIsSetSalaryModalVisible(false);

  useEffect(() => {
    dispatch(getSalaryss());
  }, []);

const user = useSelector((state) => state.user.loggedInUser.username);

  const alldata = useSelector((state) => state.salary);
  const dfnddataa = alldata.salary.data || [];

const dfnddata = dfnddataa.filter((item) => item.created_by === user);

  useEffect(() => {
    if (dfnddata) {
      setList(dfnddata);
    }
  }, [dfnddata]);

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);

  const whorole = roleData.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
    ? JSON.parse(roleData.permissions)
    : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-payroll-salary"] && parsedPermissions["extra-hrm-payroll-salary"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-payroll-salary"][0].permissions;
  } else {
  }

  const canCreateClient = allpermisson?.includes('create');
  const canEditClient = allpermisson?.includes('edit');
  const canDeleteClient = allpermisson?.includes('delete');
  const canViewClient = allpermisson?.includes('view');

  const openAddSalaryModal = () => {
    setIsAddSalaryModalVisible(true);
  };

  const openSetSalaryModall = (id) => {
    setId(id);
    console.log("userId",id);
    openSetSalaryModal();
  };

  const closeAddSalaryModal = () => {
    setIsAddSalaryModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredSalaries = () => {
    if (!list) return [];
    
    if (!searchText) return list;

    return list.filter(salary => {
      return (
        salary.salary?.toString().toLowerCase().includes(searchText) ||
        salary.payslipType?.toLowerCase().includes(searchText) ||
        salary.netSalary?.toString().toLowerCase().includes(searchText) ||
        salary.bankAccount?.toString().toLowerCase().includes(searchText) ||
        salary.status?.toLowerCase().includes(searchText)
      );
    });
  };

  const deleteUser = (userId) => {
    dispatch(deleteSalaryss(userId)).then(() => {
      dispatch(getSalaryss());
      setList(list.filter((item) => item.id !== userId));
    });
  };

  const dropdownMenu = (user) => (
    <Menu>
      {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Button type="text" icon={<EyeOutlined />} onClick={ () => openSetSalaryModall(user.employeeId)}>
            Set Salary
          </Button>
        </Menu.Item>
      ) : null}
      
      {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Menu.Item>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(user.id)}
          >
            Delete
          </Button>
        </Menu.Item>
      ) : null}
    </Menu>
  );

  const tableColumns = [
    {
      title: "salary",
      dataIndex: "salary",
    },
    {
      title: "PayRoll Type",
      dataIndex: "payslipType",
    },
    {
      title: "netSalary",
      dataIndex: "netSalary",
    },
    {
      title: "bankAccount",
      dataIndex: "bankAccount",
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (_, record) => <EllipsisDropdown menu={dropdownMenu(record)} />,
    },
  ];

  return (
    <Card>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <Input
          placeholder="Search by salary, payslip type, bank account..."
          prefix={<SearchOutlined />}
          onChange={onSearch}
          value={searchText}
          allowClear
          style={{ width: 300 }}
          className="search-input"
        />
   
        {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Button type="primary" onClick={openAddSalaryModal}>
            <PlusOutlined /> Add Salary
          </Button>
        ) : null}
      </Space>

      {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Table 
          columns={tableColumns} 
          dataSource={getFilteredSalaries()} 
          rowKey="id"
          pagination={{
            total: getFilteredSalaries().length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
          }}
        />
      ) : null}

      <Modal
        title="Add Salary"
        visible={isAddSalaryModalVisible}
        onCancel={closeAddSalaryModal}
        width={800}
        footer={null}
      >
        <AddSalary onClose={closeAddSalaryModal} />
      </Modal>
      <Modal
        className="mt-[-70px]"
        title="Set Salary"
        visible={isSetSalaryModalVisible}
        onCancel={closeSetSalaryModal}
        footer={null}
        width={1900}
      >
        <SetSalary id={id} onClose={closeSetSalaryModal} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-affix-wrapper {
    min-width: 250px;
  }

  @media (max-width: 768px) {
    .ant-input-affix-wrapper {
      width: 100%;
    }
  }

  .ant-space {
    flex-wrap: wrap;
    gap: 16px !important;
  }

  @media (max-width: 576px) {
    .ant-space {
      flex-direction: column;
    }
    
    .ant-space > * {
      width: 100% !important;
    }
  }
`;

const SalaryListWithStyles = () => (
  <>
    <style>{styles}</style>
    <SalaryList />
  </>
);

export default SalaryListWithStyles;
