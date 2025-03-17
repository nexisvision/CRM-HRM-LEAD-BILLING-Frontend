import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Space,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAccounts } from "./AccountReducer/AccountSlice";
import Flex from "components/shared-components/Flex";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";
import { debounce } from 'lodash';

const AccountList = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);
  const [isEditAccountModalVisible, setIsEditAccountModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getAccounts());
  }, [dispatch]);

  const allAccounts = useSelector((state) => state.account);
  const fndAccounts = allAccounts.account.data;

  useEffect(() => {
    if (fndAccounts) {
      setAccounts(fndAccounts);
    }
  }, [fndAccounts]);

  const debouncedSearch = debounce((value, data, setAccounts) => {
    setIsSearching(true);

    const searchValue = value.toLowerCase();

    if (!searchValue) {
      setAccounts(fndAccounts || []);
      setIsSearching(false);
      return;
    }

    const filteredData = fndAccounts?.filter(account => {
      return (
        account.bankHolderName?.toString().toLowerCase().includes(searchValue) ||
        account.bankName?.toString().toLowerCase().includes(searchValue) ||
        account.accountNumber?.toString().toLowerCase().includes(searchValue)
      );
    }) || [];

    setAccounts(filteredData);
    setIsSearching(false);
  }, 300);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, fndAccounts, setAccounts);
  };

  const openAddAccountModal = () => {
    setIsAddAccountModalVisible(true);
  };

  const closeAddAccountModal = () => {
    setIsAddAccountModalVisible(false);
  };

  const eidtfun = (idd) => {
    setIsEditAccountModalVisible(true);
    setIdd(idd);
  };

  const closeEditAccountModal = () => {
    setIsEditAccountModalVisible(false);
  };

  const deleteUser = async (accountId) => {
    try {
      const result = await dispatch(deleteAccount(accountId)).unwrap();
      if (result.success) {
        dispatch(getAccounts());
        const updatedAccounts = accounts.filter((item) => item.id !== accountId);
        setAccounts(updatedAccounts);
      } else {
      }
    } catch (error) {
    }
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(accounts);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Accounts");
      writeFile(wb, "AccountsData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  const getDropdownItems = (elm) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => eidtfun(elm.id)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => deleteUser(elm.id),
      danger: true
    }
  ];

  const tableColumns = [
    {
      title: "Bank Holder Name",
      dataIndex: "bankHolderName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record.bankHolderName
          ? record.bankHolderName.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.bankHolderName.localeCompare(b.bankHolderName),
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      sorter: (a, b) => a.accountNumber.localeCompare(b.accountNumber),
    },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      sorter: (a, b) => a.openingBalance - b.openingBalance,
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
    },
    {
      title: "Bank Address",
      dataIndex: "bankAddress",
      render: (address) => <span>{address || 'N/A'}</span>,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
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
      ),
    },
  ];

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search by name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: '250px' }}
              loading={isSearching}
            />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" onClick={openAddAccountModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
            block
          >
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table
          columns={tableColumns}
          dataSource={accounts}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>

      <style jsx>{`
        .ant-dropdown-menu {
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .ant-dropdown-menu-item {
          padding: 8px 16px;
        }
        .ant-dropdown-menu-item:hover {
          background-color: #f5f5f5;
        }
        .ant-dropdown-menu-item-danger:hover {
          background-color: #fff1f0;
        }
      `}</style>

      <Modal
        title="Add Account"
        visible={isAddAccountModalVisible}
        onCancel={closeAddAccountModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddAccount onClose={closeAddAccountModal} />
      </Modal>

      <Modal
        title="Edit Account"
        visible={isEditAccountModalVisible}
        onCancel={closeEditAccountModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditAccount onClose={closeEditAccountModal} idd={idd} />
      </Modal>
    </Card>
  );
};

export default AccountList;


