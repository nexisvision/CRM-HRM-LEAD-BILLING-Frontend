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
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import AddInquiry from "./AddInquiry";
import EditInquiry from "./EditInquiry";
import { deleteinqu, getinqu } from "./inquiryReducer/inquirySlice";
import { debounce } from 'lodash';

const { Option } = Select;

const InquiryList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddinquiryModalVisible, setIsAddinquiryModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getinqu());
  }, []);

  const allbranch = useSelector((state) => state.inquiry);
  const fndbranch = allbranch.inquiry.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditinquiryModalVisible, setIsEditinquiryModalVisible] =
    useState(false);

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;
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
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Inquiry"); // Append the sheet to the workbook

      writeFile(wb, "InquiryData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  // Create debounced version of search
  const debouncedSearch = debounce((value, data, setUsers) => {
    setIsSearching(true);
    
    const searchValue = value.toLowerCase();
    
    if (!searchValue) {
      setUsers(fndbranch || []); // Reset to original data
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

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };


  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
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
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "message",
      dataIndex: "message",
      sorter: (a, b) => a.message.length - b.message.length,
    },
    {
      title: "subject",
      dataIndex: "subject",
      sorter: (a, b) => a.subject.length - b.subject.length,
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
          <div className="mb-3">
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
          </div>
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

export default InquiryList;
