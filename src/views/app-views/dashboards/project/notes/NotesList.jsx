import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import {
  Row,
  Card,
  Col,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Modal,
  Tag,
  message,
} from "antd";
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from "react-number-format";
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import {
  EyeOutlined,
  FileExcelOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { TiPinOutline } from "react-icons/ti";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
// import NumberFormat from 'react-number-format';
import dayjs from "dayjs";
import { DATE_FORMAT_DD_MM_YYYY } from "constants/DateConstant";
import utils from "utils";
import AddNotes from "./AddNotes";
import EditNotes from "./EditNotes";
import ViewNotes from "./ViewNotes";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DeleteNotes, GetNote } from "./NotesReducer/NotesSlice";
import { debounce } from 'lodash';
import { empdata } from "views/app-views/hrm/Employee/EmployeeReducers/EmployeeSlice";

const { Column } = Table;

const { Option } = Select;

const getMilestoneStatus = (status) => {
  if (status === "Paid") {
    return "success";
  }
  if (status === "Pending") {
    return "warning";
  }
  if (status === "Expired") {
    return "error";
  }
  return "";
};

const getShippingStatus = (status) => {
  if (status === "Ready") {
    return "blue";
  }
  if (status === "Shipped") {
    return "cyan";
  }
  return "";
};

const notesStatusList = ["Paid", "Pending", "Expired"];

export const NotesList = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [AddNotesModalVisible, setAddNotesModalVisible] = useState(false);
  const [EditNotesModalVisible, setEditNotesModalVisible] = useState(false);
  const [ViewNotesModalVisible, setViewNotesModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleShowStatus = (value) => {
    if (value !== "All") {
      const key = "milestoneStatus";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      dispatch(GetNote(id));
    }
  };

  const { id } = useParams();

  const allempdata = useSelector((state) => state.Notes);
  const filtermin = allempdata.Notes.data;

  // Add employee data from Redux store
  const employeeData = useSelector((state) => state.employee?.employee?.data || []);

  useEffect(() => {
    dispatch(GetNote(id));
    dispatch(empdata()); // Fetch employee data
  }, [dispatch, id]);

  useEffect(() => {
    if (filtermin) {
      setList(filtermin);
    }
  }, [filtermin]);

  const DeleteFun = async (exid) => {
    try {
      const response = await dispatch(DeleteNotes(exid));
      // message.success("Note deleted successfully!");
      if (response.error) {
        throw new Error(response.error.message);
      }
      const updatedData = await dispatch(GetNote(id));
      setList(list.filter((item) => item.id !== exid));

    } catch (error) {
      console.error("Error deleting note:", error.message || error);
    }
  };

  const editfun = (nid) => {
    openEditNotesModal();
    setIdd(nid);
  };

  // Open Add Job Modal
  const openAddNotesModal = () => {
    setAddNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddNotesModal = () => {
    setAddNotesModalVisible(false);
  };

  // Open Add Job Modal
  const openEditNotesModal = () => {
    setEditNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditNotesModal = () => {
    setEditNotesModalVisible(false);
  };

  // Open Add Job Modal
  const openViewNotesModal = () => {
    setViewNotesModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewNotesModal = () => {
    setViewNotesModalVisible(false);
  };

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => editfun(row.id)}>
          <EditOutlined />
          {/* <EditOutlined /> */}
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      {/* <Menu.Item>
        <Flex alignItems="center" onClick={openViewNotesModal}>
          <EyeOutlined />
          <span className="ml-2">View</span>
        </Flex>
      </Menu.Item> */}
      <Menu.Item>
        <Flex alignItems="center" onClick={() => DeleteFun(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: "Note Title",
      dataIndex: "note_title",
      sorter: {
        compare: (a, b) => a.note_title.length - b.note_title.length,
      },
    },
    {
      title: "Note Type",
      dataIndex: "notetype",
      sorter: {
        compare: (a, b) => a.notetype.length - b.notetype.length,
      },
    },
    {
      title: "Employee",
      dataIndex: "employees",
      render: (employees) => {
        try {
          const employeeObj = typeof employees === 'string' ? JSON.parse(employees) : employees;
          const employeeId = employeeObj?.id;
          const employee = employeeData?.find(emp => emp.id === employeeId);
          return <span>{employee?.username || 'N/A'}</span>;
        } catch (error) {
          console.error('Error parsing employee data:', error);
          return <span>N/A</span>;
        }
      },
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

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  // Create debounced search function
  const debouncedSearch = debounce((value, data) => {
    setIsSearching(true);
    
    if (!value) {
      setList(filtermin || []);
      setIsSearching(false);
      return;
    }

    const filtered = filtermin?.filter(note => {
      try {
        const employeeObj = JSON.parse(note.employees);
        const employee = employeeData?.find(emp => emp.id === employeeObj?.id);
        const username = employee?.username || '';

        return (
          note.note_title?.toString().toLowerCase().includes(value) ||
          note.notetype?.toString().toLowerCase().includes(value) ||
          username.toLowerCase().includes(value)
        );
      } catch (error) {
        return (
          note.note_title?.toString().toLowerCase().includes(value) ||
          note.notetype?.toString().toLowerCase().includes(value)
        );
      }
    }) || [];

    setList(filtered);
    setIsSearching(false);
  }, 300);

  // Modified onSearch function
  const onSearch = (e) => {
    const value = e.currentTarget.value.toLowerCase();
    setSearchValue(value);
    debouncedSearch(value, filtermin);
  };

  return (
    <div className="container">
      <div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap  gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search notes..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchValue}
                allowClear
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
								<Option value="All">All payment </Option>
								{paymentStatusList.map(elm => <Option key={elm} value={elm}>{elm}</Option>)}
							</Select>
						</div> */}
          </Flex>
          <Flex gap="7px" className="flex">
            <div className="flex gap-4">
              <Button
                type="primary"
                className="flex items-center"
                onClick={openAddNotesModal}
              >
                <PlusOutlined />
                <span className="ml-2">Create Note</span>
              </Button>
            </div>
          </Flex>
        </Flex>
      </div>
      <Card>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={list}
            rowKey="id"
            scroll={{ x: 1200 }}
            loading={isSearching}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: "checkbox",
              preserveSelectedRowKeys: false,
              ...rowSelection,
            }}
          />
        </div>

        <Modal
          title="Add Project Notes"
          visible={AddNotesModalVisible}
          onCancel={closeAddNotesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddNotes onClose={closeAddNotesModal} />
        </Modal>
        <Modal
          title="Edit Project Notes"
          visible={EditNotesModalVisible}
          onCancel={closeEditNotesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditNotes onClose={closeEditNotesModal} idd={idd} />
        </Modal>
        <Modal
          title="Project Note Details"
          visible={ViewNotesModalVisible}
          onCancel={closeViewNotesModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <ViewNotes onClose={closeViewNotesModal} />
        </Modal>
      </Card>
    </div>
  );
};

export default NotesList;
