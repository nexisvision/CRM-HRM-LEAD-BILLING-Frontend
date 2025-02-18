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
    const value = e.currentTarget.value;
    const searchStr = value.toLowerCase();
    const filteredData = dfnddata.filter(item => 
      Object.values(item).some(val => 
        val?.toString().toLowerCase().includes(searchStr)
      )
    );
    setList(filteredData);
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
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          onChange={onSearch}
        />
   
        {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Button type="primary" className="mt-4" onClick={openAddSalaryModal}>
            <PlusOutlined /> Add Salary
          </Button>
        ) : null}
      </Space>

      {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
        <Table columns={tableColumns} className="mt-4" dataSource={list} rowKey="id" />
      ) : null}

      <Modal
        title="Add Salary"
        visible={isAddSalaryModalVisible}
        onCancel={closeAddSalaryModal}
        width={1000}
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

export default SalaryList;
