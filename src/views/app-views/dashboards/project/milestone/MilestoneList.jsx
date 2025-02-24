import React, { Component, useEffect } from "react";
import { useState } from "react";
// import { PrinterOutlined } from '@ant-design/icons';
import StatisticWidget from "components/shared-components/StatisticWidget";
import { AnnualStatisticData } from "../../../dashboards/default/DefaultDashboardData";
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
} from "antd";
// import { invoiceData } from '../../../pages/invoice/invoiceData';
// import { Row, Col, Avatar, Dropdown, Menu, Tag } from 'antd';
import NumberFormat from "react-number-format";
// import React, {useState} from 'react'
// import { Card, Table, Select, Input, Button, Badge, Menu, Tag } from 'antd';
import OrderListData from "../../../../../assets/data/order-list.data.json";
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
import AddMilestone from "./AddMilestone";
import EditMilestone from "./EditMilestone";
// import AddInvoice from './AddInvoice';
// import EditInvoice from './EditInvoice';
// import ViewInvoice from './ViewInvoice';

import { useDispatch, useSelector } from "react-redux";
import { Deletemins, Getmins } from "./minestoneReducer/minestoneSlice";
import { useParams } from "react-router-dom";

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

const milestoneStatusList = ["Paid", "Pending", "Expired"];

export const MilestoneList = () => {
  const [annualStatisticData] = useState(AnnualStatisticData);
  const [list, setList] = useState(OrderListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAddMilestoneModalVisible, setIsAddMilestoneModalVisible] =
    useState(false);
  const [isEditMilestoneModalVisible, setIsEditMilestoneModalVisible] =
    useState(false);
  const [isViewMilestoneModalVisible, setIsViewMilestoneModalVisible] =
    useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [idd, setIdd] = useState("");

  const allempdata = useSelector((state) => state.Milestone);
  const filtermin = allempdata.Milestone.data;

  

  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Get unique statuses from milestone data
  const getUniqueStatuses = () => {
    if (!filtermin) return [];
    
    // Get all unique statuses from the data
    const statuses = [...new Set(filtermin.map(item => item.milestone_status))];
    
    // Create status options array with 'All Status' as first option
    return [
      { value: 'all', label: 'All Status' },
      ...statuses.map(status => ({
        value: status,
        label: status
      }))
    ];
  };

  // Get status options
  const statusOptions = getUniqueStatuses();

  // Open Add Job Modal
  const openAddMilestoneModal = () => {
    setIsAddMilestoneModalVisible(true);
  };

  // Close Add Job Modal
  const closeAddMilestoneModal = () => {
    setIsAddMilestoneModalVisible(false);
  };

  // Open Add Job Modal
  const openEditMilestoneModal = () => {
    setIsEditMilestoneModalVisible(true);
  };

  // Close Add Job Modal
  const closeEditMilestoneModal = () => {
    setIsEditMilestoneModalVisible(false);
  };

  // Open Add Job Modal
  const openViewMilestoneModal = () => {
    setIsViewMilestoneModalVisible(true);
  };

  // Close Add Job Modal
  const closeViewMilestoneModal = () => {
    setIsViewMilestoneModalVisible(false);
  };

  const { id } = useParams();

  useEffect(() => {
    dispatch(Getmins(id));
  }, []);

  useEffect(() => {
    if (filtermin) {
      setList(filtermin);
    }
  }, [filtermin]);

  const deleetfuc = (userId) => {
    dispatch(Deletemins(userId)).then(()=>{
      dispatch(Getmins(id));
      // message.success("Milestone deleted successfully!");
    });
  };

  const Editfunc = (id) => {
    openEditMilestoneModal();
    setIdd(id);
  };
// console.log(idd,"idddd");
  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => Editfunc(row.id)}>
          <EditOutlined />
          <span className="ml-2">Edit</span>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center" onClick={() => deleetfuc(row.id)}>
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    // {
    //   title: "#",
    //   dataIndex: "id",
    // },
    {
      title: "Milestone Title",
      dataIndex: "milestone_title",
      sorter: {
        compare: (a, b) => a.milestone_title.length - b.milestone_title.length,
      },
    },
    {
      title: "Milestone Cost",
      dataIndex: "milestone_cost",
      sorter: {
        compare: (a, b) => a.milestoneCost.length - b.milestoneCost.length,
      },
    },
    {
      title: "Budget ",
      dataIndex: "add_cost_to_project_budget",
      sorter: {
        compare: (a, b) =>
          a.add_cost_to_project_budget.length -
          b.add_cost_to_project_budget.length,
      },
    },
    {
      title: "Status",
      dataIndex: "milestone_status",
      render: (_, record) => (
        <>
          <Tag color={getMilestoneStatus(record.milestone_status)}>
            {record.milestone_status}
          </Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "milestone_status"),
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

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (!value) {
      setList(filtermin);
      return;
    }
    
    const filtered = filtermin.filter(milestone => 
      milestone.milestone_title?.toLowerCase().includes(value)
    );
    
    setList(filtered);
  };

  // Update the filter function to include status
  const getFilteredMilestones = () => {
    if (!filtermin) return [];
    
    let filtered = filtermin;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(milestone => 
        milestone.milestone_title?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(milestone => 
        milestone.milestone_status === selectedStatus
      );
    }

    return filtered;
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  return (
    <div className="container">
      <div>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          mobileFlex={false}
          className="flex flex-wrap gap-4"
        >
          <Flex
            className="flex flex-wrap gap-4 mb-4 md:mb-0"
            mobileFlex={false}
          >
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-48">
              <Input
                placeholder="Search by milestone title..."
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                allowClear
                className="search-input"
              />
            </div>
            <div className="mr-0 md:mr-3 mb-3 md:mb-0 w-full md:w-40">
              <Select
                placeholder="Filter by status"
                onChange={handleStatusChange}
                value={selectedStatus}
                style={{ width: '100%' }}
                className="status-select"
              >
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </div>
          </Flex>
          <Flex gap="7px" className="flex">
            <div className="flex gap-4">
              <Button
                type="primary"
                className="flex items-center"
                onClick={openAddMilestoneModal}
              >
                <PlusOutlined />
                <span className="ml-2">Create Milestone</span>
              </Button>
            </div>
          </Flex>
        </Flex>
      </div>
      <Card>
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={getFilteredMilestones()}
            rowKey="id"
            pagination={{
              total: getFilteredMilestones().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        </div>

        <Modal
          title="Milestone Create"
          visible={isAddMilestoneModalVisible}
          onCancel={closeAddMilestoneModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <AddMilestone onClose={closeAddMilestoneModal} />
        </Modal>
        <Modal
          title="Milestone Edit"
          visible={isEditMilestoneModalVisible}
          onCancel={closeEditMilestoneModal}
          footer={null}
          width={1000}
          className="mt-[-70px]"
        >
          <EditMilestone onClose={closeEditMilestoneModal} idd={idd} />
        </Modal>
      </Card>
    </div>
  );
};

const styles = `
  .search-input,
  .status-select {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus,
  .status-select:hover,
  .status-select:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  @media (max-width: 768px) {
    .search-input,
    .status-select,
    .ant-input-group {
      width: 100%;
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
`;

const MilestoneListWithStyles = () => (
  <>
    <style>{styles}</style>
    <MilestoneList />
  </>
);

export default MilestoneListWithStyles;
