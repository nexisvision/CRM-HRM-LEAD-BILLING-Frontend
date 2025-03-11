import React, { useEffect } from "react";
import { useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Menu,
  Modal,
  Tag,
  DatePicker,
  Progress,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Flex from "components/shared-components/Flex";
import dayjs from "dayjs";
import utils from "utils";
import AddMilestone from "./AddMilestone";
import EditMilestone from "./EditMilestone";

import { useDispatch, useSelector } from "react-redux";
import { Deletemins, Getmins } from "./minestoneReducer/minestoneSlice";
import { useParams } from "react-router-dom";
import { getcurren } from "views/app-views/setting/currencies/currenciesSlice/currenciesSlice";
import { GetProject } from "../project-list/projectReducer/ProjectSlice";


const { Option } = Select;
const { RangePicker } = DatePicker;

export const MilestoneList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isAddMilestoneModalVisible, setIsAddMilestoneModalVisible] = useState(false);
  const [isEditMilestoneModalVisible, setIsEditMilestoneModalVisible] = useState(false);
  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState(null);

  // Add selectors for data
  const allempdata = useSelector((state) => state.Milestone);
  const filtermin = allempdata.Milestone.data;
  const { currencies } = useSelector((state) => state.currencies);
  const curr = currencies?.data || [];
  const projectData = useSelector((state) => state?.Project?.Project?.data) || [];
  const currentProject = projectData.find(project => project.id === id);

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


  // Add useEffect to fetch currencies and project data
  useEffect(() => {
    dispatch(getcurren());
    dispatch(GetProject());
    dispatch(Getmins(id));
  }, [dispatch, id]);


  const deleetfuc = (userId) => {
    dispatch(Deletemins(userId)).then(() => {
      dispatch(Getmins(id));
    });
  };

  const Editfunc = (id) => {
    openEditMilestoneModal();
    setIdd(id);
  };
  // console.log(idd,"idddd");

  const getDropdownItems = (row, Editfunc, deleetfuc) => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Edit',
      onClick: () => Editfunc(row.id)
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      onClick: () => deleetfuc(row.id),
      danger: true
    }
  ];

  // Add currency formatting helper
  const formatCurrency = (value) => {
    if (!currentProject?.currency || !curr?.length) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(value);
    }

    const projectCurrency = curr.find(c => c.id === currentProject.currency);
    if (!projectCurrency) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(value);
    }

    // Use the project's currency for formatting
    return `${projectCurrency.currencyIcon || '₹'}${Number(value).toLocaleString()}`;
  };

  const tableColumns = [
    {
      title: "Milestone Title",
      dataIndex: "milestone_title",
      key: "milestone_title",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
      sorter: {
        compare: (a, b) => a.milestone_title.localeCompare(b.milestone_title),
      },
    },
    {
      title: "Cost",
      dataIndex: "milestone_cost",
      key: "milestone_cost",
      render: (cost) => (
        <span className="font-medium">
          {formatCurrency(cost)}
        </span>
      ),
      sorter: {
        compare: (a, b) => a.milestone_cost - b.milestone_cost,
      },
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => {
        const now = dayjs();
        const startDate = dayjs(record.milestone_start_date);
        const endDate = dayjs(record.milestone_end_date);
        const totalDays = endDate.diff(startDate, 'days');
        const elapsedDays = now.diff(startDate, 'days');
        const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

        const getProgressColor = () => {
          if (record.milestone_status?.toLowerCase() === 'completed' ||
            record.milestone_status?.toLowerCase() === 'done') {
            return '#52c41a';
          }
          if (progress >= 100) return '#f5222d';
          if (progress >= 70) return '#faad14';
          return '#1890ff';
        };

        return (
          <div>
            <Progress
              percent={Math.round(progress)}
              size="small"
              strokeColor={getProgressColor()}
              className="mb-1"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{dayjs(record.milestone_start_date).format('DD MMM')}</span>
              <span>{dayjs(record.milestone_end_date).format('DD MMM')}</span>
            </div>
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Timeline",
      key: "timeline",
      render: (_, record) => {
        const endDate = dayjs(record.milestone_end_date);
        const now = dayjs();
        const isOverdue = now.isAfter(endDate);

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Tag
                icon={<CalendarOutlined />}
                color={isOverdue ? 'error' : 'default'}
                className="rounded-full"
              >
                {endDate.format('DD MMM YYYY')}
              </Tag>
            </div>
            <div className="text-xs text-gray-500">
              {isOverdue
                ? `Overdue by ${now.diff(endDate, 'days')} days`
                : `${endDate.diff(now, 'days')} days remaining`}
            </div>
          </div>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "milestone_status",
      key: "milestone_status",
      render: (status) => {
        const getStatusColor = (status) => {
          const normalizedStatus = status?.toLowerCase();
          if (normalizedStatus === "completed" || normalizedStatus === "done") return "success";
          if (normalizedStatus === "in progress") return "processing";
          if (normalizedStatus === "pending") return "warning";
          if (normalizedStatus === "expired") return "error";
          return "default";
        };

        return (
          <Tag color={getStatusColor(status)} className="rounded-full px-3 py-1">
            {status || 'Not Set'}
          </Tag>
        );
      },
      sorter: (a, b) => utils.antdTableSorter(a, b, "milestone_status"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, elm) => (
        <div className="text-center">
          <Dropdown
            overlay={<Menu items={getDropdownItems(elm, Editfunc, deleetfuc)} />}
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

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Update the filter function to include date range
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

    // Apply date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startRange = dayjs(dateRange[0]).startOf('day');
      const endRange = dayjs(dateRange[1]).endOf('day');

      filtered = filtered.filter(milestone => {
        const milestoneStartDate = dayjs(milestone.milestone_start_date);
        return (milestoneStartDate.isAfter(startRange) || milestoneStartDate.isSame(startRange)) &&
          (milestoneStartDate.isBefore(endRange) || milestoneStartDate.isSame(endRange));
      });
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
            <div className="mr-0 md:mr-3 mb-3 md:mb-0">
              <RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                placeholder={['Start Date', 'End Date']}
                className="date-range-picker"
              />
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
      <Card className="mt-4">
        <div className="table-responsive">
          <Table
            columns={tableColumns}
            dataSource={getFilteredMilestones()}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              total: getFilteredMilestones().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
            className="milestone-table"
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
  .status-select,
  .date-range-picker {
    transition: all 0.3s;
  }

  .search-input:hover,
  .search-input:focus,
  .status-select:hover,
  .status-select:focus,
  .date-range-picker:hover,
  .date-range-picker:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  @media (max-width: 768px) {
    .search-input,
    .status-select,
    .date-range-picker,
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

  .max-w-md {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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

const MilestoneListWithStyles = () => (
  <>
    <style>{styles}</style>
    <MilestoneList />
  </>
);

export default MilestoneListWithStyles;
