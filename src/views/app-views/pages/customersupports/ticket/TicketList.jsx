import React, { useEffect, useState } from "react";
import Flex from "components/shared-components/Flex";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Modal,
  Menu,
  Dropdown,
  message,
  Space,
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
import { utils, writeFile } from "xlsx";
import EditTicket from "./EditTicket";
import AddTicket from "./AddTicket";
import ViewTicket from "./ViewTicket";
import { DeleteTicket, getAllTicket } from "./TicketReducer/TicketSlice";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from 'lodash';
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Option } = Select;

const priorityList = ["Low", "Medium", "High", "Critical"];

export const TicketList = () => {
  const [list, setList] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [isAddTicketModalVisible, setIsAddTicketModalVisible] = useState(false);
  const [isEditTicketModalVisible, setIsEditTicketModalVisible] = useState(false);
  const [isViewTicketModalVisible, setIsViewTicketModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const alldatat = useSelector((state) => state?.Ticket);
  const fnddata = alldatat?.Ticket?.data || [];
  const alldatass = useSelector((state) => state.employee.employee.data);

  useEffect(() => {
    dispatch(empdata());
    dispatch(getAllTicket());
    const storedPinnedTasks = JSON.parse(localStorage.getItem("pinnedTasks")) || [];
    setPinnedTasks(storedPinnedTasks);
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
      message.success('Ticket deleted successfully');
    } catch (error) {
      message.error('Failed to delete ticket');
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

  // Action menu for each row
  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item key="pin" onClick={() => togglePinTask(record.id)}>
        <Flex alignItems="center">
          <PushpinOutlined style={{ color: pinnedTasks.includes(record.id) ? "gold" : undefined }} />
          <span className="ml-2">{pinnedTasks.includes(record.id) ? "Unpin" : "Pin"}</span>
        </Flex>
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => editfun(record.id)}>
        <Flex alignItems="center">
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => deletfun(record.id)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Pinned",
      dataIndex: "pinned",
      width: 70,
      render: (_, record) => (
        <PushpinOutlined 
          style={{ color: pinnedTasks.includes(record.id) ? "gold" : undefined }}
          onClick={() => togglePinTask(record.id)}
        />
      ),
    },
    {
      title: "Subject",
      dataIndex: "ticketSubject",
      sorter: (a, b) => (a.ticketSubject || '').localeCompare(b.ticketSubject || ''),
    },
    {
      title: "Requestor",
      dataIndex: "requestor",
      render: (requestorId) => {
        const requestor = alldatass?.find(emp => emp.id === requestorId);
        return requestor?.username || 'N/A';
      },
    },
    {
      title: "Start Date",
      dataIndex: "createdAt",
      render: (date) => dayjs(date).format(DATE_FORMAT_DD_MM_YYYY),
    },
    {
      title: "Priority",
      dataIndex: "priority",
    },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const debouncedSearch = debounce((value) => {
    const searchLower = value.toLowerCase();
    const filtered = fnddata?.filter(ticket => 
      ticket.ticketSubject?.toLowerCase().includes(searchLower) ||
      ticket.description?.toLowerCase().includes(searchLower)
    ) || [];
    setList(filtered);
  }, 300);

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value) {
      setList(fnddata);
    } else {
      debouncedSearch(value);
    }
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(list);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Ticket");
      writeFile(wb, "TicketData.xlsx");
      message.success("Data exported successfully!");
    } catch (error) {
      message.error("Failed to export data");
    }
  };

  return (
    <div className="container">
      <Card>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input
                placeholder="Search by subject..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchValue}
                allowClear
                style={{ width: '250px' }}
              />
            </div>
            <div className="mr-md-3 mb-3">
              <Select
                defaultValue="All"
                style={{ width: 120 }}
                onChange={(value) => setSelectedPriority(value)}
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
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
            >
              Export
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

export default TicketList;
