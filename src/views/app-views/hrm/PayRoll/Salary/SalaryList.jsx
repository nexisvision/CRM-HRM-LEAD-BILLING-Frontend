import React, { useEffect, useState } from "react";
import { Card, Table, Input, message, Button, Modal, Space, Badge, Switch, Dropdown } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import AddSalary from "./AddSalary";
import SetSalary from "./SetSalary";
import { useDispatch, useSelector } from "react-redux";
import { deleteSalaryss, getSalaryss, editSalaryss } from "./SalaryReducers/SalarySlice";
import { empdata } from "../../Employee/EmployeeReducers/EmployeeSlice";
import dayjs from "dayjs";

const SalaryList = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [id, setId] = useState(null);
  const [isAddSalaryModalVisible, setIsAddSalaryModalVisible] = useState(false);
  const [isSetSalaryModalVisible, setIsSetSalaryModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const salaryState = useSelector((state) => state.salary);
  const [salaryData, setSalaryData] = useState([]);

  useEffect(() => {
    setSalaryData(salaryState?.salary?.data || []);
  }, [salaryState?.salary?.data]);
  const isLoading = salaryState?.isLoading || false;

  const userData = useSelector((state) => state.user?.loggedInUser);
  const user = userData?.username;
  const roleId = userData?.role_id;

  const roles = useSelector((state) => state.role?.role?.data || []);
  const roleData = roles.find(role => role.id === roleId) || {};
  const whorole = roleData.role_name || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getSalaryss()).unwrap();
        await dispatch(empdata()).unwrap();
      } catch (error) {
        message.error('Failed to fetch data');
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (salaryData && user) {
      const userSalaries = salaryData.filter((item) => item.created_by === user);
      setList(userSalaries);
    }
  }, [salaryData, user]);

  const parsedPermissions = (() => {
    try {
      if (Array.isArray(roleData?.permissions)) {
        return roleData.permissions;
      }
      if (typeof roleData?.permissions === 'string') {
        return JSON.parse(roleData.permissions);
      }
      return [];
    } catch {
      return [];
    }
  })();

  const allpermisson = parsedPermissions["extra-hrm-payroll-salary"]?.[0]?.permissions || [];

  const canCreateClient = allpermisson.includes('create');
  const canEditClient = allpermisson.includes('edit');
  const canDeleteClient = allpermisson.includes('delete');
  const canViewClient = allpermisson.includes('view');

  const openSetSalaryModal = () => setIsSetSalaryModalVisible(true);
  const closeSetSalaryModal = () => setIsSetSalaryModalVisible(false);
  const openAddSalaryModal = () => setIsAddSalaryModalVisible(true);
  const closeAddSalaryModal = () => setIsAddSalaryModalVisible(false);

  const openSetSalaryModall = (id) => {
    setId(id);
    openSetSalaryModal();
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
    dispatch(deleteSalaryss(userId))
      .unwrap()
      .then(() => {
        dispatch(getSalaryss());
        setList(prev => prev.filter(item => item.id !== userId));
      })
      .catch((error) => {
        message.error(error?.message || "Failed to delete salary");
      });
  };

  const handleStatusChange = (record, checked) => {
    handleSalaryStatusChange(dispatch, record, checked)
      .then(() => {
        dispatch(getSalaryss());
        dispatch(empdata());
      });
  };

  const dropdownMenu = (record) => {
    const items = [];

    if (whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'setSalary',
        icon: <EyeOutlined />,
        label: 'Set Salary',
        onClick: () => record?.employeeId && openSetSalaryModall(record.employeeId)
      });
    }

    if (whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) {
      items.push({
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => record?.id && deleteUser(record.id),
        danger: true
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Salary Per Month",
      dataIndex: "salary",
      render: (salary) => salary || 'N/A',
    },
    {
      title: "PayRoll Type",
      dataIndex: "payslipType",
      render: (type) => type || 'N/A',
    },
    {
      title: "Yearly Package",
      dataIndex: "netSalary",
      render: (salary) => salary || 'N/A',
    },

    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      render: (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "Bank Account",
      dataIndex: "bankAccount",
      render: (account) => account || 'N/A',
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, record) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={status === 'paid'}
            onChange={(checked) => handleStatusChange(record, checked)}
            checkedChildren="Paid"
            unCheckedChildren="Unpaid"
            disabled={!(whorole === "super-admin" || whorole === "client" || canEditClient)}
          />
          <Badge
            status={status === 'paid' ? 'success' : 'error'}
            text={status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
          />
        </div>
      ),
    },
    {
      title: "Action",
      key: "actions",
      width: 100,
      render: (_, record) => {
        const items = dropdownMenu(record);
        return items.length > 0 ? (
          <div className="text-center">
            <Dropdown
              menu={{ items }}
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
        ) : null;
      },
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

      {isLoading ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <>
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
        </>
      )}
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
`;

const SalaryListWithStyles = () => (
  <>
    <style>{styles}</style>
    <SalaryList />
  </>
);

export default SalaryListWithStyles;

export const handleSalaryStatusChange = (dispatch, record, checked) => {
  const newStatus = checked ? 'paid' : 'unpaid';

  const payload = {
    id: record.id,
    status: newStatus
  };

  return dispatch(editSalaryss(payload))
    .unwrap()
    .then(() => {
      message.success(`Status updated to ${newStatus}`);
    })
    .catch((error) => {
      message.error(error?.message || "Failed to update status");
    });
};
