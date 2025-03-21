import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";
import UserView from "../../../Users/user-list/UserView";
import { utils } from "xlsx";
import Flex from "components/shared-components/Flex";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobCandidate from "./AddJobCandidate";
import { useDispatch, useSelector } from "react-redux";
import { GetJobdata } from '../JobReducer/JobSlice';
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";

const { Option } = Select;

const JobCandidateList = () => {
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddJobCandidateModalVisible, setIsAddJobCandidateModalVisible] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [uniqueStatuses, setUniqueStatuses] = useState(['All']);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.loggedInUser.username);
  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = React.useMemo(() => alldata.jobapplications.data || [], [alldata.jobapplications.data]);

  const filteredData = fnddta.filter((item) => item.created_by === user);
  const jobsData = useSelector((state) => state.Jobs?.Jobs?.data || []);
  useEffect(() => {
    dispatch(getjobapplication());
  }, [dispatch]);

  useEffect(() => {
    if (fnddta) {
      setUsers(filteredData);
      const statuses = ['All', ...new Set(filteredData.map(item => item.status).filter(Boolean))];
      setUniqueStatuses(statuses);
    }
  }, [fnddta, filteredData]);
  const closeAddJobCandidateModal = () => {
    setIsAddJobCandidateModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };

  const getFilteredCandidates = () => {
    if (!users) return [];

    let filtered = [...users];
    if (searchText) {
      filtered = filtered.filter(candidate => {
        return (
          candidate.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          candidate.job?.toLowerCase().includes(searchText.toLowerCase()) ||
          candidate.location?.toLowerCase().includes(searchText.toLowerCase()) ||
          candidate.current_location?.toLowerCase().includes(searchText.toLowerCase()) ||
          candidate.status?.toLowerCase().includes(searchText.toLowerCase()) ||
          getJobName(candidate.job)?.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    }

    // Status filter from dropdown
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(candidate =>
        candidate.status?.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    return filtered;
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

  useEffect(() => {
    dispatch(GetJobdata());
  }, [dispatch]);

  useEffect(() => {
    console.log('Jobs Data:', jobsData);
    console.log('Job Application Data:', fnddta);
  }, [jobsData, fnddta]);

  const getJobName = (jobId) => {
    const job = jobsData.find(job => job.id === jobId);
    if (job) {
      return job.title;
    }
    return 'N/A';
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
    setUserProfileVisible(false);
  };

  const roleId = useSelector((state) => state.user.loggedInUser.role_id);
  const roles = useSelector((state) => state.role?.role?.data);
  const roleData = roles?.find(role => role.id === roleId);

  const whorole = roleData?.role_name;

  const parsedPermissions = Array.isArray(roleData?.permissions)
    ? roleData.permissions
    : typeof roleData?.permissions === 'string'
      ? JSON.parse(roleData.permissions)
      : [];

  let allpermisson;

  if (parsedPermissions["extra-hrm-jobs-jobcandidate"] && parsedPermissions["extra-hrm-jobs-jobcandidate"][0]?.permissions) {
    allpermisson = parsedPermissions["extra-hrm-jobs-jobcandidate"][0].permissions;
  }
  const canViewClient = allpermisson?.includes('view');

  const getjobStatus = (status) => {
    if (status === "active") {
      return "blue";
    }
    if (status === "blocked") {
      return "cyan";
    }
    return "";
  };

  const tableColumns = [
    {
      title: "name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            src={record.img}
            name={record.name}
            subTitle={record.email}
          />
        </div>
      ),
      sorter: (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1),
    },
    {
      title: "Notice Period",
      dataIndex: "notice_period",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Location",
      dataIndex: "location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },
    {
      title: "Job",
      dataIndex: "job",
      render: (jobId) => {
        return <span>{getJobName(jobId)}</span>;
      },
      sorter: (a, b) => {
        const jobNameA = getJobName(a.job)?.toLowerCase() || '';
        const jobNameB = getJobName(b.job)?.toLowerCase() || '';
        return jobNameA.localeCompare(jobNameB);
      },
    },
    {
      title: "current_location",
      dataIndex: "current_location",
      sorter: (a, b) => a.leavetype.length - b.leavetype.length,
    },

    {
      title: "phone",
      dataIndex: "phone",
      sorter: (a, b) => a.totaldays.length - b.totaldays.length,
    },
    {
      title: "total_experience",
      dataIndex: "total_experience",
      sorter: (a, b) => a.leavereason.length - b.leavereason.length,
    },
    {
      title: "Applied Source",
      dataIndex: "applied_source",
      sorter: (a, b) => a.applied_source.localeCompare(b.applied_source),
    },
    {
      title: "Cover Letter",
      dataIndex: "cover_letter",
      render: (text) => {
        const stripHtml = (html) => {
          if (!html) return 'N/A';
          const tmp = document.createElement('DIV');
          tmp.innerHTML = html;
          return tmp.textContent || tmp.innerText || 'N/A';
        };

        const plainText = stripHtml(text);
        return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
      },
      sorter: (a, b) => {
        const stripHtml = (html) => {
          if (!html) return '';
          const tmp = document.createElement('DIV');
          tmp.innerHTML = html;
          return tmp.textContent || tmp.innerText || '';
        };
        return stripHtml(a.cover_letter).localeCompare(stripHtml(b.cover_letter));
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <>
          <Tag color={getjobStatus(record.status)}>{record.status}</Tag>
        </>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "status"),
    },
  ];

  // Add status change handler
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
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
            <Input.Group compact>
              <Input
                placeholder="Search "
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <Select
              defaultValue="All"
              style={{ minWidth: '120px' }}
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              {uniqueStatuses.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        {/* <Flex gap="7px">
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddJobCandidateModal}>
              <PlusOutlined />
              <span>New</span>
            </Button>
          ) : null}
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel}
            block
          >
            Export All
          </Button>
        </Flex> */}
      </Flex>
      <div className="table-responsive mt-2">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table
            columns={tableColumns}
            dataSource={getFilteredCandidates()}
            rowKey="id"
            pagination={{
              total: getFilteredCandidates().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}
      </div>
      <UserView
        data={selectedUser}
        visible={userProfileVisible}
        close={closeUserProfile}
      />

      {/* Add Job Modal */}
      <Modal
        title=""
        visible={isAddJobCandidateModalVisible}
        onCancel={closeAddJobCandidateModal}
        footer={null}
        width={800}
      >
        <AddJobCandidate onClose={closeAddJobCandidateModal} />
      </Modal>
    </Card>
  );
};

const styles = `
  .search-input {
    transition: all 0.3s;
    min-width: 300px;
  }

  .search-input:hover,
  .search-input:focus {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .ant-input-group {
    display: flex;
    align-items: center;
  }

  .ant-input-group .ant-input {
    width: calc(100% - 90px);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ant-input-group .ant-btn {
    width: 90px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  @media (max-width: 768px) {
    .search-input,
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

  .ant-select {
    min-width: 120px;
  }

  @media (max-width: 768px) {
    .ant-select {
      width: 100%;
    }
  }
`;

const JobCandidateListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobCandidateList />
  </>
);

export default JobCandidateListWithStyles;
