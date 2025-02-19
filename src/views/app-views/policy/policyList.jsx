import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Tag,
  Input,
  message,
  Button,
  Modal,
  Select,
  Space,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  MailOutlined,
  PlusOutlined,
  PushpinOutlined,
  FileExcelOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
// import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import Addpolicy from "./Addpolicy";
import Editpolicy from "./Editpolicy";
// import EditJobOfferLetter from "./EditJobOfferLetter";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { deletepolicys, getpolicys } from "./policyReducer/policySlice";
// import {
//   deletejobapplication,
//   getjobapplication,
// } from "./JobapplicationReducer/JobapplicationSlice";
// import ViewJobApplication from './ViewJobApplication';
import { debounce } from 'lodash';

const { Option } = Select;

const PolicyList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddpolicyModalVisible, setIsAddpolicyModalVisible] = useState(false);

  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Add loading state
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    dispatch(getpolicys());
  }, []);

  const allbranch = useSelector((state) => state.policy);
  const fndbranch = allbranch.policy.data;

  useEffect(() => {
    if (fndbranch) {
      setUsers(fndbranch);
    }
  }, [fndbranch]);

  const [isEditpolicyModalVisible, setIsEditpolicyModalVisible] =
    useState(false);

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;

  //   useEffect(() => {
  //     dispatch(getjobapplication());
  //   }, []);

  //   useEffect(() => {
  //     if (fnddta) {
  //       setUsers(fnddta);
  //     }
  //   }, [fnddta]);

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

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
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

  // const showViewApplication = (userInfo) => {
  //   setViewApplicationVisible(true);
  //   setSelectedUser(userInfo);
  // };

  // const closeViewApplication = () => {
  //   setViewApplicationVisible(false);
  //   setSelectedUser(null);
  // };

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const eidtfun = (idd) => {
    openEditJobOfferLetterModal();
    setIdd(idd);
  };

  const dropdownMenu = (elm) => (
    <Menu>
  
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<EditOutlined />}
            onClick={() => eidtfun(elm.id)}
            size="small"
          >
            <span className="ml-2">Edit</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            className=""
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(elm.id)}
            size="small"
          >
            <span>Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

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
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
      sorter: (a, b) => a.description.length - b.description.length,
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
              placeholder="Search by title..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: '250px' }}
              loading={isSearching}
            />
          </div>
          {/* <div className="w-full md:w-48 ">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowStatus}
              placeholder="Status"
            >
              <Option value="All">All Job </Option>
              {jobStatusList.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div> */}
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
      {/* <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      /> */}

      {/* <ViewJobApplication data={selectedUser} visible={viewApplicationVisible} close={closeViewApplication} /> */}
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

export default PolicyList;
