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
  DatePicker,
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
import UserView from "../../../Users/user-list/UserView";
import Flex from "components/shared-components/Flex";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import AvatarStatus from "components/shared-components/AvatarStatus";
import AddJobOfferLetter from "./AddJobOfferLetter";
import EditJobOfferLetter from "./EditJobOfferLetter";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import {
  deletejobofferss,
  getjobofferss,
} from "./jobOfferletterReducer/jobofferlateerSlice";
import { getjobapplication } from "../JobApplication/JobapplicationReducer/JobapplicationSlice";
import { GetJobdata } from "../JobReducer/JobSlice";
import AddEmployee from "../../Employee/AddEmployee";

const { Option } = Select;

const JobOfferLetterList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddJobOfferLetterModalVisible, setIsAddJobOfferLetterModalVisible] =
    useState(false);

  const [idd, setIdd] = useState("");
  const [searchText, setSearchText] = useState('');

  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    dispatch(getjobofferss());
    dispatch(getjobapplication());
    dispatch(GetJobdata());
  }, [dispatch]);
 
const user = useSelector((state) => state.user.loggedInUser.username);

  const alldatas = useSelector((state) => state.joboffers);
  const fnddata = alldatas.joboffers.data || [];


  const alljob = useSelector((state)=>state?.Jobs?.Jobs?.data);

  const jobappliaction = useSelector((state)=>state?.jobapplications?.jobapplications?.data);

  const fnddtaa = fnddata.filter((item) => item.created_by === user);

  useEffect(() => {
    if (fnddata) {
      setUsers(fnddtaa);  
    }
  }, [fnddata]);

  const [
    isAddJobEditJobOfferLetterModalVisible,
    setIsEditJobOfferLetterModalVisible,
  ] = useState(false);

  const alldata = useSelector((state) => state.jobapplications);
  const fnddta = alldata.jobapplications.data;

                                        
                          const roleId = useSelector((state) => state.user.loggedInUser.role_id);
                          const roles = useSelector((state) => state.role?.role?.data);
                          const roleData = roles?.find(role => role.id === roleId);
                       
                          const whorole = roleData.role_name;
                       
                          const parsedPermissions = Array.isArray(roleData?.permissions)
                          ? roleData.permissions
                          : typeof roleData?.permissions === 'string'
                          ? JSON.parse(roleData.permissions)
                          : [];
                        
                          let allpermisson;  
                       
                          if (parsedPermissions["extra-hrm-jobs-jobonbording"] && parsedPermissions["extra-hrm-jobs-jobonbording"][0]?.permissions) {
                            allpermisson = parsedPermissions["extra-hrm-jobs-jobonbording"][0].permissions;
                          
                          } else {
                          }
                          
                          const canCreateClient = allpermisson?.includes('create');
                          const canEditClient = allpermisson?.includes('edit');
                          const canDeleteClient = allpermisson?.includes('delete');
                          const canViewClient = allpermisson?.includes('view');
                       

  const openAddJobOfferLetterModal = () => {
    setIsAddJobOfferLetterModalVisible(true);
  };

  const closeAddJobOfferLetterModal = () => {
    setIsAddJobOfferLetterModalVisible(false);
  };

  const openEditJobOfferLetterModal = () => {
    setIsEditJobOfferLetterModalVisible(true);
  };

  const closeEditJobOfferLetterModal = () => {
    setIsEditJobOfferLetterModalVisible(false);
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const getFilteredOffers = () => {
    if (!users) return [];
    
    let filtered = [...users];

    // Text search filter
    if (searchText) {
      filtered = filtered.filter(offer => {
        const offerSalary = offer.salary?.toString().toLowerCase();
        const searchValue = searchText.toLowerCase();
        return offerSalary?.includes(searchValue);
      });
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
      const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
      
      filtered = filtered.filter(offer => {
        const offerExpiry = dayjs(offer.offer_expiry).format('YYYY-MM-DD');
        const expectedJoining = dayjs(offer.expected_joining_date).format('YYYY-MM-DD');
        
        return offerExpiry >= startDate && expectedJoining <= endDate;
      });
    }

    return filtered;
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

  const deleteUser = (userId) => {
    dispatch(deletejobofferss(userId)).then(() => {
      dispatch(getjobofferss());
      const updatedUsers = users.filter((item) => item.id !== userId);
      setUsers(updatedUsers);
    });
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(users); // Convert JSON data to a sheet
      const wb = utils.book_new(); // Create a new workbook
      utils.book_append_sheet(wb, ws, "JobOfferLatter"); // Append the sheet to the workbook

      writeFile(wb, "JobOfferLatterData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
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
      setUsers(users);
    }
  };

  const jobStatusList = ["active", "blocked"];

  const eidtfun = (idd) => {
    openEditJobOfferLetterModal();
    setIdd(idd);
  };

  const convertemployee = (idd) => {
    const fndoffer = fnddata.find((item) => item.id === idd);
    const jobappdata = jobappliaction.find((item) => item.job === fndoffer.job_applicant);

    // Prepare the data to be passed to the AddEmployee component
    const data = {
      firstName: jobappdata?.firstName || '',
      lastName: jobappdata?.lastName || '',
      email: jobappdata?.email || '',
      // Add other fields as necessary
    };

    setEmployeeData(data);
    setIsAddEmployeeModalVisible(true);
  };

  const closeAddEmployeeModal = () => {
    setIsAddEmployeeModalVisible(false);
    setEmployeeData(null);
  };

  const dropdownMenu = (elm) => ({
    items: [
     
      {
        key: 'convert',
        icon: <EditOutlined />,
        label: 'Convert To Employee',
        onClick: () => convertemployee(elm.id)
      },
      
      ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => eidtfun(elm.id)
      }] : []),
      
      ...(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client") ? [{
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => deleteUser(elm.id)
      }] : [])
    ]
  });

  const tableColumns = [
    {
      title: "Job",
      dataIndex: "job_applicant",
      render: (_, record) => {
        const job = alljob?.find(job => job.id === record.job_applicant);
        return job ? job.title : record.job_applicant;
      },
      sorter: (a, b) => {
        const jobA = alljob?.find(job => job.id === a.job_applicant)?.title || '';
        const jobB = alljob?.find(job => job.id === b.job_applicant)?.title || '';
        return jobA.localeCompare(jobB);
      },
    },
    {
      title: "Job Applicant",
      dataIndex: "job",
      render: (_, record) => {
        const application = jobappliaction?.find(app => app.id === record.job);
        return application ? application.name : record.job;
      },
      sorter: (a, b) => {
        const appA = jobappliaction?.find(app => app.id === a.job)?.name || '';
        const appB = jobappliaction?.find(app => app.id === b.job)?.name || '';
        return appA.localeCompare(appB);
      },
    },
    {
      title: "Salary",
      dataIndex: "salary",
      sorter: (a, b) => a.salary.length - b.salary.length,
    },
    {
      title: "Offer Expiry",
      dataIndex: "offer_expiry",
      render: (text) => dayjs(text).format("DD-MM-YYYY"), // Format the date
    },
    {
      title: "Expected Joining Date",
      dataIndex: "expected_joining_date",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
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
                placeholder="Search"
                prefix={<SearchOutlined />}
                onChange={onSearch}
                value={searchText}
                className="search-input"
                onPressEnter={handleSearch}
              />
            </Input.Group>
          </div>
          <div className="mr-md-3 mb-3">
            <DatePicker.RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD-MM-YYYY"
              placeholder={['Offer Expiry', 'Expected Joining']}
              className="w-100"
              allowClear={true}
              style={{ minWidth: '300px' }}
            />
          </div>
        </Flex>
        <Flex gap="7px">
         

             {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                                                                            <Button
                                                                                                                            type="primary"
                                                                                                                            className="ml-2"
                                                                                                                            onClick={openAddJobOfferLetterModal}
                                                                                                                          >
                                                                                                                            <PlusOutlined />
                                                                                                                            <span>New</span>
                                                                                                                          </Button>                                                                                                                       
                                                                                                                                                                                                                                                          
                                                                                                                                        ) : null}


          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportToExcel} // Call export function when the button is clicked
            block
          >
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

             {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                                    <Table
                                                                    columns={tableColumns}
                                                                    dataSource={getFilteredOffers()}
                                                                    rowKey="id"
                                                                    pagination={{
                                                                      total: getFilteredOffers().length,
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

      <Modal
        title="Add Job Offer Letter"
        visible={isAddJobOfferLetterModalVisible}
        onCancel={closeAddJobOfferLetterModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddJobOfferLetter onClose={closeAddJobOfferLetterModal} />
      </Modal>

      <Modal
        title="Edit Job Offer Letter"
        visible={isAddJobEditJobOfferLetterModalVisible}
        onCancel={closeEditJobOfferLetterModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <EditJobOfferLetter onClose={closeEditJobOfferLetterModal} idd={idd} />
      </Modal>

      <Modal
        title="Add Employee"
        visible={isAddEmployeeModalVisible}
        onCancel={closeAddEmployeeModal}
        footer={null}
        width={1000}
        className="mt-[-70px]"
      >
        <AddEmployee onClose={closeAddEmployeeModal} initialData={employeeData} />
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

  .ant-picker {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    .ant-picker {
      width: 100%;
    }
  }
`;

const JobOfferLetterListWithStyles = () => (
  <>
    <style>{styles}</style>
    <JobOfferLetterList />
  </>
);

export default JobOfferLetterListWithStyles;
