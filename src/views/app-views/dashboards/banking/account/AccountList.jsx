import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Select,
  Space,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deleteAccount, getAccounts } from "./AccountReducer/AccountSlice";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddAccount from "./AddAccount";
import EditAccount from "./EditAccount";
import { debounce } from 'lodash';

const { Option } = Select;

const AccountList = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);
  const [isEditAccountModalVisible, setIsEditAccountModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getAccounts());
  }, []);

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

  const dropdownMenu = (elm) => ({
    items: [
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
        onClick: () => deleteUser(elm.id)
      }
    ]
  });

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


