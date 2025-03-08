import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal, DatePicker } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddAnnouncement from './AddAnnouncement';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import { utils, writeFile } from "xlsx";
import { useDispatch, useSelector } from 'react-redux';
import { DeleteAnn, GetAnn } from './AnnouncementReducer/AnnouncementSlice';
import { useNavigate } from 'react-router-dom';
import { getBranch } from '../Branch/BranchReducer/BranchSlice';

const AnnouncementList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAnnouncementModalVisible, setIsAddAnnouncementModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchDate, setSearchDate] = useState(null);

  const navigate = useNavigate();

  const user = useSelector((state) => state.user.loggedInUser.username);
    const tabledata = useSelector((state) => state.Announce);  

  const dispatch = useDispatch();



  // Convert class methods to regular functions
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
    
    return users.filter(announcement => {
      const matchesText = !searchText || 
        announcement.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        stripHtmlTags(announcement.description)?.toLowerCase().includes(searchText.toLowerCase());

      const matchesDate = !searchDate || 
        dayjs(announcement.date).format('YYYY-MM-DD') === searchDate.format('YYYY-MM-DD');

      return matchesText && matchesDate;
    });
  };

  const handleSearch = () => {
    message.success('Search completed');
  };

  const deleteUser = (userId) => {
    // setUsers(prevUsers => prevUsers.filter(item => item.id !== userId));
    // message.success({ content: `Deleted user ${userId}`, duration: 2 });
          dispatch(DeleteAnn( userId ))
                .then(() => {
                  dispatch(GetAnn());
                  // message.success('announcement Deleted successfully!');
                  setUsers(prevUsers => prevUsers.filter(item => item.id !== userId));
                  navigate('/app/hrm/announcement');
                })
                .catch((error) => {
                  // message.error('Failed to update department.');
                  console.error('Edit API error:', error);
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
      utils.book_append_sheet(wb, ws, "Announcement"); // Append the sheet to the workbook

      writeFile(wb, "AnnouncementData.xlsx"); // Save the file as ProposalData.xlsx
      message.success("Data exported successfully!"); // Show success message
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      message.error("Failed to export data. Please try again."); // Show error message
    }
  };

    useEffect(()=>{
      dispatch(GetAnn())
    },[dispatch]);

     //// permission
                                    
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
                   
                      if (parsedPermissions["extra-hrm-announcement"] && parsedPermissions["extra-hrm-announcement"][0]?.permissions) {
                        allpermisson = parsedPermissions["extra-hrm-announcement"][0].permissions;
                      
                      } else {
                      }
                      
                      const canCreateClient = allpermisson?.includes('create');
                      const canEditClient = allpermisson?.includes('edit');
                      const canDeleteClient = allpermisson?.includes('delete');
                      const canViewClient = allpermisson?.includes('view');
                   
                      ///endpermission

  
      useEffect(() => {
        if
         (tabledata && tabledata.Announce && tabledata.Announce.data) {
          const filteredData = tabledata.Announce.data.filter((item) => item.created_by === user);
          setUsers(filteredData);
        }
      }, [tabledata]);

  // Function to strip HTML tags from text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Convert dropdownMenu to a regular function
  const dropdownMenu = (elm) => ({
    items: [
      // View, Mail, and Pin options are commented out but kept for reference
      // {
      //   key: 'view',
      //   icon: <EyeOutlined />,
      //   label: 'View Details',
      //   onClick: () => showUserProfile(elm)
      // },
      // {
      //   key: 'mail',
      //   icon: <MailOutlined />,
      //   label: 'Send Mail',
      //   onClick: () => showUserProfile(elm)
      // },
      // {
      //   key: 'pin',
      //   icon: <PushpinOutlined />,
      //   label: 'Pin',
      //   onClick: () => showUserProfile(elm)
      // },
      
      // Edit option is commented out but kept for reference
      // ...(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client") ? [{
      //   key: 'edit',
      //   icon: <EditOutlined />,
      //   label: 'Edit',
      //   onClick: () => EditMeet(elm.id)
      // }] : []),
      
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
      title: 'Title',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text) => stripHtmlTags(text),
      sorter: {
        compare: (a, b) => stripHtmlTags(a.description).localeCompare(stripHtmlTags(b.description)),
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, elm) => (
        <div className="text-center">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      )
    },
  ];

  return (
    <Card bodyStyle={{ padding: '-3px' }}>
      <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
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
          {(whorole === "super-admin" || whorole === "client" || (canCreateClient && whorole !== "super-admin" && whorole !== "client")) ? (
            <Button type="primary" className="ml-2" onClick={openAddAnnouncementModal}>
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
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
          <Table 
            columns={tableColumns} 
            dataSource={getFilteredAnnouncements()} 
            rowKey="id"
            pagination={{
              total: getFilteredAnnouncements().length,
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
            }}
          />
        ) : null}
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

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
`;

const AnnouncementListWithStyles = () => (
  <>
    <style>{styles}</style>
    <AnnouncementList />
  </>
);

export default AnnouncementListWithStyles;