import React, { useEffect, useMemo, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Modal,
  message,
  Space,
  Dropdown,
} from "antd";
import {
  FileExcelOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  PushpinOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import { utils } from "xlsx";
import EditTicket from "./EditTicket";
import AddTicket from "./AddTicket";
import ViewTicket from "./ViewTicket";
import { DeleteTicket, getAllTicket } from "./TicketReducer/TicketSlice";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const priorityList = ["Low", "Medium", "High", "Critical"];

export const TicketList = () => {
  const [list, setList] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddTicketModalVisible, setIsAddTicketModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] =
    useState(false);
  const [isViewTicketModalVisible, setIsViewTicketModalVisible] =
    useState(false);
  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = useMemo(
    () => alldatat?.Ticket?.data || [],
    [alldatat?.Ticket?.data]
  );

  useEffect(() => {
    dispatch(empdata());
  }, [dispatch]);

  const alldatass = useSelector(
    (state) => state?.employee?.employee?.data || []
  );

  useEffect(() => {
    dispatch(empdata());
    dispatch(getAllTicket());
    const storedPinnedTasks =
      JSON.parse(localStorage.getItem("pinnedTasks")) || [];
    setPinnedTasks(storedPinnedTasks);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllTicket());
  }, [dispatch]);

  useEffect(() => {
    if (fnddata) {
      setList(fnddata);
    }
  }, [fnddata]);

  const handleModalVisibility = {
    add: {
      open: () => setIsAddTicketModalVisible(true),
      close: () => setIsAddTicketModalVisible(false),
    },
    edit: {
      open: () => setIsEditTicketModalVisible(true),
      close: () => setIsEditTicketModalVisible(false),
    },
    view: {
      open: () => setIsViewTicketModalVisible(true),
      close: () => setIsViewTicketModalVisible(false),
    },
  };

  const deletfun = async (userId) => {
    try {
      await dispatch(DeleteTicket(userId));
      await dispatch(getAllTicket());
    } catch (error) {
      message.error("Failed to delete ticket");
    }
  };

  const editfun = (idd) => {
    setIdd(idd);
    handleModalVisibility.edit.open();
  };

  const togglePinTask = (taskId) => {
    setPinnedTasks((prevPinned) => {
      const newPinned = prevPinned.includes(taskId)
        ? prevPinned.filter((id) => id !== taskId)
        : [...prevPinned, taskId];
      localStorage.setItem("pinnedTasks", JSON.stringify(newPinned));
      return newPinned;
    });
  };

  // Create debounced version of search
  const debouncedSearch = debounce((value, data, setList) => {
    const searchValue = value.toLowerCase();

    if (!searchValue) {
      // Reset to original data
      setList(data || []);
      return;
    }

    const filteredData =
      data?.filter((ticket) => {
        return (
          ticket.ticketSubject
            ?.toString()
            .toLowerCase()
            .includes(searchValue) ||
          ticket.requestor?.toString().toLowerCase().includes(searchValue) ||
          ticket.priority?.toString().toLowerCase().includes(searchValue)
        );
      }) || [];

    setList(filteredData);
  }, 300); // 300ms delay

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    debouncedSearch(value, fnddata, setList);
  };

  const getDropdownItems = (record) => {
    return [
      {
        key: "pin",
        icon: pinnedTasks.includes(record.id) ? (
          <PushpinOutlined style={{ color: "gold" }} />
        ) : (
          <PushpinOutlined />
        ),
        label: pinnedTasks.includes(record.id) ? "Unpin" : "Pin",
        onClick: () => togglePinTask(record.id),
      },
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => editfun(record.id),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        onClick: () => deletfun(record.id),
        danger: true,
      },
    ];
  };

  const tableColumns = [
    {
      title: "Pinned",
      dataIndex: "pinned",
      render: (text, record) => (
        <span>
          {pinnedTasks.includes(record.id) ? (
            <PushpinOutlined style={{ color: "gold" }} />
          ) : (
            <PushpinOutlined />
          )}
        </span>
      ),
    },
    {
      title: "Subject",
      dataIndex: "ticketSubject",
      sorter: (a, b) => utils.antdTableSorter(a, b, ""),
    },
    {
      title: "requestor",
      dataIndex: "requestor",
      sorter: (a, b) => {
        if (!Array.isArray(alldatass)) return 0;
        const requestorNameA =
          alldatass.find((emp) => emp?.id === a?.requestor)?.username || "";
        const requestorNameB =
          alldatass.find((emp) => emp?.id === b?.requestor)?.username || "";
        return requestorNameA.localeCompare(requestorNameB);
      },
      render: (requestorId) => {
        if (!Array.isArray(alldatass)) return <span>N/A</span>;
        const requestorName = alldatass.find(
          (emp) => emp?.id === requestorId
        )?.username;
        return <span>{requestorName || "N/A"}</span>;
      },
    },
    {
      title: "Start Date ",
      dataIndex: "createdAt",
      render: (_, record) => (
        <span>{dayjs(record.createdAt).format(DATE_FORMAT_DD_MM_YYYY)}</span>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "createdAt"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      render: (date) => dayjs(date).format(DATE_FORMAT_DD_MM_YYYY),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      sorter: {
        compare: (a, b) => a.priority.length - b.priority.length,
      },
    },
    {
      title: "description",
      dataIndex: "description",
      sorter: {
        compare: (a, b) => a.activity.length - b.activity.length,
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Dropdown
            menu={{ items: getDropdownItems(record) }}
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

  return (
    <div className="container">
      <Card>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
        >
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search by subject..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchValue}
                allowClear
                style={{ width: "250px" }}
              />
            </div>
            <div className="mr-md-3 mb-3">
              <Select
                defaultValue="All"
                style={{ width: 120 }}
                onChange={(value) => {
                  const filteredData =
                    value === "All"
                      ? fnddata
                      : fnddata.filter((item) => item.priority === value);
                  setList(filteredData);
                }}
              >
                <Option value="All">All Priority</Option>
                {priorityList.map((priority) => (
                  <Option key={priority} value={priority}>
                    {priority}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>

          <Flex gap={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleModalVisibility.add.open}
            >
              New
            </Button>
            <Button type="primary" icon={<FileExcelOutlined />} block>
              Export All
            </Button>
          </Flex>
        </Flex>

        <Table
          columns={tableColumns}
          dataSource={list}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />

        <Modal
          title="Create Ticket"
          visible={isAddTicketModalVisible}
          onCancel={handleModalVisibility.add.close}
          footer={null}
          width={1000}
        >
          <AddTicket onClose={handleModalVisibility.add.close} />
        </Modal>

        <Modal
          title="Edit Ticket"
          visible={isEditTicketModalVisible}
          onCancel={handleModalVisibility.edit.close}
          footer={null}
          width={1000}
        >
          <EditTicket onClose={handleModalVisibility.edit.close} idd={idd} />
        </Modal>

        <Modal
          title="View Ticket"
          visible={isViewTicketModalVisible}
          onCancel={handleModalVisibility.view.close}
          footer={null}
          width={1000}
        >
          <ViewTicket onClose={handleModalVisibility.view.close} />
        </Modal>
      </Card>
    </div>
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

const TicketListWithStyles = () => (
  <>
    <style>{styles}</style>
    <TicketList />
  </>
);

export default TicketListWithStyles;
