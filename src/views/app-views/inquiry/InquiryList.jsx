import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Input,
  message,
  Button,
  Modal,
  Select,
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
import { deleteinqu, getinqu } from "./inquiryReducer/inquirySlice";
import { debounce } from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import { writeFile } from "xlsx";
import utils from "utils";
import EditInquiry from "./EditInquiry";
import AddInquiry from "./AddInquiry";


const { Option } = Select;

const InquiryList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [isAddinquiryModalVisible, setIsAddinquiryModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getinqu());
  }, [dispatch]);

  const allbranch = useSelector((state) => state.inquiry);
  const fndbranch = allbranch.inquiry.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditinquiryModalVisible, setIsEditinquiryModalVisible] =
    useState(false);

  const openAddinquiryModal = () => {
    setIsAddinquiryModalVisible(true);
  };

  const closeAddinquiryModal = () => {
    setIsAddinquiryModalVisible(false);
  };

  const openEditinquiryModal = () => {
    setIsEditinquiryModalVisible(true);
  };

  const closeEditinquiryModal = () => {
    setIsEditinquiryModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Inquiry");

      writeFile(wb, "InquiryData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
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

    const filteredData = fndbranch?.filter(inquiry => {
      return (
        inquiry.name?.toString().toLowerCase().includes(searchValue) ||
        inquiry.email?.toString().toLowerCase().includes(searchValue) ||
        inquiry.subject?.toString().toLowerCase().includes(searchValue)
      );
    }) || [];

    setUsers(filteredData);
    setIsSearching(false);
  }, 300); // 300ms delay

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, fndbranch, setUsers);
  };

  const deleteUser = (userId) => {
    dispatch(deleteinqu(userId)).then(() => {
      dispatch(getinqu());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
      message.success({ content: `Deleted inquiry ${userId}`, duration: 2 });
    });
  };


  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "status";
      const data = utils.filterArray(users, key, value);
      setUsers(data);
    } else {
      setUsers(fndbranch || []);
    }
  };

  const jobStatusList = ["active", "blocked"];

  const eidtfun = (idd) => {
    openEditinquiryModal();
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
      title: "Name",
      dataIndex: "name",
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
        record.name
          ? record.name.toString().toLowerCase().includes(value.toLowerCase())
          : '',
      sorter: (a, b) => a.name?.length - b.name?.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email?.length - b.email?.length,
    },
    {
      title: "message",
      dataIndex: "message",
      sorter: (a, b) => a.message?.length - b.message?.length,
    },
    {
      title: "subject",
      dataIndex: "subject",
      sorter: (a, b) => a.subject?.length - b.subject?.length,
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
              placeholder="Search by name..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: '250px' }}
              loading={isSearching}
            />
          </div>
          {/* <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Status</Option>
              {jobStatusList.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div> */}
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddinquiryModal}>
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
        />
      </div>
      {/* <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      /> */}

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} /> */}
      <Modal
        title="Add Inquiry"
        visible={isAddinquiryModalVisible}
        onCancel={closeAddinquiryModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddInquiry onClose={closeAddinquiryModal} />
      </Modal>

      <Modal
        title="Edit Inquiry"
        visible={isEditinquiryModalVisible}
        onCancel={closeEditinquiryModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditInquiry onClose={closeEditinquiryModal} idd={idd} />
      </Modal>
      {/* <Modal
        title=""
        visible={viewApplicationVisible}
        onCancel={closeViewApplication}
        footer={null}
        width={1200}
        className='mt-[-70px]'
      >
        <ViewJobApplication onClose={closeViewApplication} />
      </Modal> */}
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

const InquiryListWithStyles = () => (
  <>
    <style>{styles}</style>
    <InquiryList />
  </>
);

export default InquiryListWithStyles;
