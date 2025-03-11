import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
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
import Flex from "components/shared-components/Flex";
import Addpolicy from "./Addpolicy";
import Editpolicy from "./Editpolicy";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deletepolicys, getpolicys } from "./policyReducer/policySlice";
import { debounce } from 'lodash';

const PolicyList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [isAddpolicyModalVisible, setIsAddpolicyModalVisible] = useState(false);

  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Add loading state
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getpolicys());
  }, [dispatch]);

  const allbranch = useSelector((state) => state.policy);
  const fndbranch = allbranch.policy.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditpolicyModalVisible, setIsEditpolicyModalVisible] =
    useState(false);


  const openAddpolicyModal = () => {
    setIsAddpolicyModalVisible(true);
  };

  const closeAddpolicyModal = () => {
    setIsAddpolicyModalVisible(false);
  };

  const openEditJobOfferLetterModal = () => {
    setIsEditpolicyModalVisible(true);
  };

  const closeEditpolicyModal = () => {
    setIsEditpolicyModalVisible(false);
  };

  // Create debounced version of search
  const debouncedSearch = debounce((value, data, setUsers) => {
    setIsSearching(true);

    const searchValue = value.toLowerCase();

    if (!searchValue) {
      setUsers(fndbranch || []);
      setIsSearching(false);
      return;
    }

    const filteredData = fndbranch?.filter(policy => {
      return (
        policy.title?.toString().toLowerCase().includes(searchValue) ||
        policy.description?.toString().toLowerCase().includes(searchValue)
      );
    }) || [];

    setUsers(filteredData);
    setIsSearching(false);
  }, 300);

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, fndbranch, setUsers);
  };

  const deleteUser = (userId) => {
    dispatch(deletepolicys(userId)).then(() => {
      dispatch(getpolicys());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      message.success({ content: `Deleted Policy ${userId}`, duration: 2 });
    });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Policy"); // Append the sheet to the workbook

      writeFile(wb, "PolicyData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  const eidtfun = (idd) => {
    openEditJobOfferLetterModal();
    setIdd(idd);
  };

  const getDropdownItems = (record) => {
    return [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => eidtfun(record.id)
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(record.id),
        danger: true
      }
    ];
  };

  const tableColumns = [
    {
      title: "Title",
      dataIndex: "title",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
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
        record.title
          ? record.title.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.title?.length - b.title?.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
      sorter: (a, b) => a.description?.length - b.description?.length,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
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
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search by title..."
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
          <Button type="primary" className="ml-2" onClick={openAddpolicyModal}>
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
          dataSource={users}
          rowKey="id"
          scroll={{ x: 1200 }}
        />
      </div>
      <Modal
        title="Add Policy"
        visible={isAddpolicyModalVisible}
        onCancel={closeAddpolicyModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <Addpolicy onClose={closeAddpolicyModal} />
      </Modal>

      <Modal
        title="Edit Policy"
        visible={isEditpolicyModalVisible}
        onCancel={closeEditpolicyModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <Editpolicy onClose={closeEditpolicyModal} idd={idd} />
      </Modal>

    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 250px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
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

  @media (max-width: 768px) {
    .search-input {
      width: 100%;
      min-width: unset;
    }
    
    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }
`;

const PolicyListWithStyles = () => (
  <>
    <style>{styles}</style>
    <PolicyList />
  </>
);

export default PolicyListWithStyles;
