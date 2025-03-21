import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Menu,
  Input,
  message,
  Button,
  Modal,
  Radio,
  DatePicker,
  Dropdown,
} from "antd";
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  FileExcelOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import UserView from "../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import AddDeal from "./AddDeal";
import { utils, writeFile } from "xlsx";
import EditDeal from "./EditDeal";
import ViewDeal from "./ViewDeal";
import { useDispatch, useSelector } from "react-redux";
import { DeleteDeals, GetDeals } from "./DealReducers/DealSlice";
import { ClientData } from "views/app-views/Users/client-list/CompanyReducers/CompanySlice";
import { getstages } from "../systemsetup/LeadStages/LeadsReducer/LeadsstageSlice";
import { GetPip } from "../systemsetup/Pipeline/PiplineReducer/piplineSlice";
import { debounce } from "lodash";
import DealCards from "./DealCards";

const VIEW_LIST = "LIST";
const VIEW_GRID = "GRID";

const DealList = () => {
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const dispatch = useDispatch();

  const [view, setView] = useState(VIEW_LIST);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDealModalVisible, setIsAddDealModalVisible] = useState(false);
  const [isViewDealModalVisible, setIsViewDealModalVisible] = useState(false);

  const [isEditDealModalVisible, setIsEditDealModalVisible] = useState(false);

  const [idd, setIdd] = useState("");
  const tabledata = useSelector((state) => state.Deals);

  const user = useSelector((state) => state.user.loggedInUser.username);

  const [stagesList, setStagesList] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (tabledata?.Deals?.data) {
      const filteredDeals = tabledata.Deals.data.filter(
        (deal) => deal.created_by === user
      );
      setUsers(filteredDeals);
    }
  }, [tabledata, user]);

  const debouncedSearch = debounce((value, date) => {
    setIsSearching(true);
    const searchValue = value.toLowerCase();

    try {
      if (!tabledata?.Deals?.data) {
        setUsers([]);
        setIsSearching(false);
        return;
      }

      const filteredData = tabledata.Deals.data.filter((deal) => {
        const matchesUser = deal.created_by === user;
        const matchesSearch =
          !searchValue ||
          deal.dealName?.toString().toLowerCase().includes(searchValue) ||
          deal.leadTitle?.toString().toLowerCase().includes(searchValue) ||
          deal.project?.toString().toLowerCase().includes(searchValue);

        // Add date filtering
        let matchesDate = true;
        if (date) {
          const dealDate = dayjs(deal.closedDate).startOf("day");
          const selectedDay = dayjs(date).startOf("day");
          matchesDate = dealDate.isSame(selectedDay, "day");
        }

        return matchesUser && matchesSearch && matchesDate;
      });

      setUsers(filteredData);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, 300);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, selectedDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    debouncedSearch(searchValue, date);
  };

  useEffect(() => {
    dispatch(GetPip());
  }, [dispatch]);

  const stagesData = useSelector((state) => state.StagesLeadsDeals);

  const openAddDealModal = () => {
    setIsAddDealModalVisible(true);
  };

  const closeAddDealModal = () => {
    setIsAddDealModalVisible(false);
  };

  const openEditDealModal = () => {
    setIsEditDealModalVisible(true);
  };

  const closeEditDealModal = () => {
    setIsEditDealModalVisible(false);
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users);
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "Deal"); // Append the worksheet to the workbook

      writeFile(wb, "DealData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again.");
    }
  };

  //// permission

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find((role) => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === "string"
      ? JSON.parse(roleData.permissions)
      : {};

  // Get deal-specific permissions
  const dealPermissions =
    parsedPermissions["dashboards-deal"]?.[0]?.permissions || [];

  // Define permission checks
  const canViewDeal = dealPermissions.includes("view");
  const canCreateDeal = dealPermissions.includes("create");
  const canEditDeal = dealPermissions.includes("update");
  const canDeleteDeal = dealPermissions.includes("delete");

  const getDropdownItems = (elm) => {
    const items = [];

    // Only add edit option if user has edit permission
    if (canEditDeal) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => EditDelas(elm.id),
      });
    }

    // Only add delete option if user has delete permission
    if (canDeleteDeal) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deleteUser(elm.id),
        danger: true,
      });
    }

    return items;
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "dealName",
      sorter: {
        compare: (a, b) => a.dealName.localeCompare(b.dealName),
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
    {
      title: "Stage",
      dataIndex: "stage",
      render: (stageId) => getStageName(stageId),
      sorter: {
        compare: (a, b) => {
          const stageNameA = getStageName(a.stage);
          const stageNameB = getStageName(b.stage);
          return stageNameA.localeCompare(stageNameB);
        },
      },
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      sorter: {
        compare: (a, b) => a.created_by - b.created_by,
      },
    },

    {
      title: "Deal Name",
      dataIndex: "dealName",
      sorter: {
        compare: (a, b) => a.dealName - b.dealName,
      },
    },
    {
      title: "Lead Title",
      dataIndex: "leadTitle",
      sorter: {
        compare: (a, b) => a.leadTitle - b.leadTitle,
      },
    },
    {
      title: "Closed Date",
      dataIndex: "closedDate",
      render: (_, record) => (
        <span>
          {record.closedDate
            ? dayjs(record.closedDate).format("DD-MM-YYYY")
            : ""}
        </span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "closedDate"),
    },
    {
      title: "Project",
      dataIndex: "project",
      sorter: {
        compare: (a, b) => a.project - b.project,
      },
    },

    {
      title: "Action",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-center">
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

  const styles = `
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
  `;

  const EditDelas = (id) => {
    openEditDealModal();
    setIdd(id);
  };

  const getStageName = (stageId) => {
    const stage = stagesList.find((stage) => stage.id === stageId);
    return stage ? stage.stageName : "N/A";
  };

  const deleteUser = async (userId) => {
    try {
      await dispatch(DeleteDeals(userId));

      await dispatch(GetDeals());

      setUsers(users.filter((item) => item.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  useEffect(() => {
    dispatch(GetDeals());
    dispatch(ClientData());
    dispatch(getstages());
  }, [dispatch]);

  useEffect(() => {
    if (tabledata && tabledata.Deals && tabledata.Deals.data) {
      const filteredDeals = tabledata.Deals.data.filter(
        (deal) => deal.created_by === user
      );
      setUsers(filteredDeals);
    }
  }, [tabledata, user]);

  useEffect(() => {
    if (
      stagesData &&
      stagesData.StagesLeadsDeals &&
      stagesData.StagesLeadsDeals.data
    ) {
      setStagesList(stagesData.StagesLeadsDeals.data);
    }
  }, [stagesData]);

  useEffect(() => {
    if (stagesList?.StagesLeadsDeals?.data) {
      setStagesList(stagesList.StagesLeadsDeals.data);
    }
  }, [stagesList]);

  const closeViewDealModal = () => {
    setIsViewDealModalVisible(false);
  };

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
              placeholder="Search by deal name, lead title, or project..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={searchValue}
              allowClear
              style={{ width: "300px" }}
              loading={isSearching}
            />
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker
              onChange={handleDateChange}
              value={selectedDate}
              format="DD-MM-YYYY"
              placeholder="Search closed date"
              allowClear
              style={{ width: "200px" }}
            />
          </div>
        </Flex>
        <Flex gap="7px" className="items-center">
          <Radio.Group
            defaultValue={VIEW_LIST}
            onChange={(e) => setView(e.target.value)}
            value={view}
            className="mr-2 flex items-center"
          >
            <Radio.Button
              value={VIEW_GRID}
              className="flex items-center justify-center"
            >
              <AppstoreOutlined />
            </Radio.Button>
            <Radio.Button
              value={VIEW_LIST}
              className="flex items-center justify-center"
            >
              <UnorderedListOutlined />
            </Radio.Button>
          </Radio.Group>

          {canCreateDeal && (
            <Button type="primary" className="ml-2" onClick={openAddDealModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          )}

          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel} // Call export function when the button is clicked
            block
          >
            Export All
          </Button>
          {/* <Button type="primary" icon={<FileAddOutlined />} block>
            Import All
          </Button> */}
        </Flex>
      </Flex>

      {view === VIEW_LIST ? (
        <div className="table-responsive">
          {canViewDeal && (
            <Table
              columns={tableColumns}
              dataSource={users}
              rowKey="id"
              pagination={{
                total: users.length,
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          )}
        </div>
      ) : (
        canViewDeal && <DealCards data={users} />
      )}

      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />
      <Modal
        title="Add Deal"
        visible={isAddDealModalVisible}
        onCancel={closeAddDealModal}
        footer={null}
        width={800}
        className="mt-[-70 px]"
      >
        <AddDeal onClose={closeAddDealModal} />
      </Modal>
      <Modal
        title="Edit Deal"
        visible={isEditDealModalVisible}
        onCancel={closeEditDealModal}
        footer={null}
        width={800}
        className="mt-[-70px]"
      >
        <EditDeal onClose={closeEditDealModal} id={idd} />
      </Modal>

      <Modal
        className="mt-[-70px]"
        title="Deal"
        visible={isViewDealModalVisible}
        onCancel={closeViewDealModal}
        footer={null}
        width={1800}
      >
        <ViewDeal onClose={closeViewDealModal} />
      </Modal>

      <style jsx>{styles}</style>
    </Card>
  );
};

export default DealList;
