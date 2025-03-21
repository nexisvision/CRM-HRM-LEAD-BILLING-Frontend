import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  DatePicker,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  EyeOutlined,
  MoreOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AddAnnouncement from "./AddAnnouncement";
import userData from "assets/data/user-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAnn, GetAnn } from "./AnnouncementReducer/AnnouncementSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const AnnouncementList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddAnnouncementModalVisible, setIsAddAnnouncementModalVisible] =
    useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState(null);

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.loggedInUser.username);
  const tabledata = useSelector((state) => state.Announce);

  const dispatch = useDispatch();

  const openAddAnnouncementModal = () => {
    setIsAddAnnouncementModalVisible(true);
  };

  const closeAddAnnouncementModal = () => {
    setIsAddAnnouncementModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const onDateSearch = (date) => {
    setSearchDate(date);
  };

  const getFilteredAnnouncements = () => {
    if (!users) return [];

    return users.filter((announcement) => {
      const matchesText =
        !searchText ||
        announcement.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        stripHtmlTags(announcement.description)
          ?.toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesDate =
        !searchDate ||
        dayjs(announcement.date).format("YYYY-MM-DD") ===
        searchDate.format("YYYY-MM-DD");

      return matchesText && matchesDate;
    });
  };

  const handleSearch = () => {
    message.success("Search completed");
  };

  const deleteUser = (userId) => {
    dispatch(DeleteAnn(userId))
      .then(() => {
        dispatch(GetAnn());
        setUsers((prevUsers) => prevUsers.filter((item) => item.id !== userId));
        navigate("/app/hrm/announcement");
      })
      .catch((error) => {
        console.error("Edit API error:", error);
      });
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Announcement"); // Append the sheet to the workbook

      writeFile(wb, "AnnouncementData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

  useEffect(() => {
    dispatch(GetAnn());
  }, [dispatch]);

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : [];

  // Simplified permission extraction
  const announcementPermissions =
    parsedPermissions["extra-hrm-announcement"]?.[0]?.permissions || [];

  // Individual permission checks
  const canView =
    whorole === "super-admin" ||
    whorole === "client" ||
    announcementPermissions.includes("view");
  const canCreate =
    whorole === "super-admin" ||
    whorole === "client" ||
    announcementPermissions.includes("create");
  const canUpdate =
    whorole === "super-admin" ||
    whorole === "client" ||
    announcementPermissions.includes("update");
  const canDelete =
    whorole === "super-admin" ||
    whorole === "client" ||
    announcementPermissions.includes("delete");

  // Update the dropdownMenu items
  const getDropdownItems = (elm) => [
    ...(canView
      ? [
        {
          key: "view",
          icon: <EyeOutlined />,
          label: "View Details",
          onClick: () => {
            message.info("View Details clicked");
          },
        },
      ]
      : []),
    ...(canUpdate
      ? [
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Edit",
          onClick: () => {
            navigate(`/app/hrm/announcement/edit/${elm.id}`);
          },
        },
      ]
      : []),
    ...(canDelete
      ? [
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "Delete",
          onClick: () => deleteUser(elm.id),
          danger: true,
        },
      ]
      : []),
  ];

  const tableColumns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => stripHtmlTags(text),
      sorter: {
        compare: (a, b) =>
          stripHtmlTags(a.description).localeCompare(
            stripHtmlTags(b.description)
          ),
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm)} />}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="border-0 shadow-sm flex items-center justify-center w-8 h-8 bg-white/90 hover:bg-white hover:shadow-md transition-all duration-200"
              style={{
                borderRadius: "10px",
                padding: 0,
              }}
            >
              <MoreOutlined style={{ fontSize: "18px", color: "#1890ff" }} />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (tabledata && tabledata.Announce && tabledata.Announce.data) {
      const filteredData = tabledata.Announce.data.filter(
        (item) => item.created_by === user
      );
      setUsers(filteredData);
    }
  }, [tabledata, user]);

  const stripHtmlTags = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <Card bodyStyle={{ padding: "-3px" }}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        mobileFlex={false}
      >
        <Flex className="mb-1" mobileFlex={false}>
          <div className="search-container mr-md-3 mb-3 flex gap-3">
            {/* <Input.Group compact className="search-group"> */}
            <Input
              placeholder="Search announcement title"
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchText}
              className="search-input"
              onPressEnter={handleSearch}
            />
            <DatePicker
              placeholder="Search by date"
              onChange={onDateSearch}
              value={searchDate}
              className="date-search-input"
              format="DD-MM-YYYY"
            />
            {/* </Input.Group> */}
          </div>
        </Flex>
        <Flex gap="7px">
          {canCreate && (
            <Button
              type="primary"
              className="ml-2"
              onClick={openAddAnnouncementModal}
            >
              <PlusOutlined />
              <span>New</span>
            </Button>
          )}
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
        {canView && (
          <Table
            columns={tableColumns}
            dataSource={getFilteredAnnouncements()}
            rowKey="id"
            pagination={{
              total: getFilteredAnnouncements().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
          />
        )}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      <Modal
        title="Add Announncement"
        visible={isAddAnnouncementModalVisible}
        onCancel={closeAddAnnouncementModal}
        footer={null}
        width={800}
      >
        <AddAnnouncement onClose={closeAddAnnouncementModal} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-container {
    display: flex;
    align-items: center;
  }

  .search-group {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .search-input {
    transition: all 0.3s;
    width: 250px !important;
  }

  .date-search-input {
    transition: all 0.3s;
    width: 150px !important;
  }

  .search-input:hover,
  .search-input:focus,
  .date-search-input:hover,
  .date-search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  @media (max-width: 768px) {
    .search-group {
      flex-direction: row;
      gap: 8px;
    }

    .search-input,
    .date-search-input {
      width: auto !important;
      flex: 1;
    }
    
    .mb-1 {
      margin-bottom: 1rem;
    }

    .mr-md-3 {
      margin-right: 0;
    }
  }

  .table-responsive {
    overflow-x: auto;
  }

  .ant-dropdown-trigger {
    transition: all 0.3s;
  }

  .ant-dropdown-trigger:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .ant-menu-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
  }

  .ant-menu-item:hover {
    background-color: #f0f7ff;
  }

  .ant-menu-item-danger:hover {
    background-color: #fff1f0;
  }
`;

const AnnouncementListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AnnouncementList />
  </>
);

export default AnnouncementListWithStyles;
