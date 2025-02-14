import React, { useEffect, useState } from 'react';
import { Card, Table, Menu, Input, message, Button, Modal } from 'antd';
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

const AnnouncementList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddAnnouncementModalVisible, setIsAddAnnouncementModalVisible] = useState(false);

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
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
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
                        console.log('Parsed Permissions:', allpermisson);
                      
                      } else {
                        console.log('extra-hrm-announcement is not available');
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

  // Convert dropdownMenu to a regular function
  const dropdownMenu = (elm) => (
    <Menu>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<EyeOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<MailOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="">Send Mail</span>
          </Button>
        </Flex>
      </Menu.Item>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" className="" icon={<PushpinOutlined />} onClick={() => showUserProfile(elm)} size="small">
            <span className="ml-2">Pin</span>
          </Button>
        </Flex>
      </Menu.Item> */}
     

      {/* {(whorole === "super-admin" || whorole === "client" || (canEditClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Flex alignItems="center">
                                     <Button
                                       type=""
                                       className=""
                                       icon={<EditOutlined />}
                                       onClick={() => EditMeet(elm.id)}
                                       size="small"
                                     >
                                       <span className="">Edit</span>
                                     </Button>
                                   </Flex>
                                 </Menu.Item>
                                ) : null} */}
                  
                  
                  {(whorole === "super-admin" || whorole === "client" || (canDeleteClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                   <Menu.Item>
                                   <Flex alignItems="center">
                                     <Button type="" className="" icon={<DeleteOutlined />} onClick={() => deleteUser(elm.id)} size="small">
                                       <span className="">Delete</span>
                                     </Button>
                                   </Flex>
                                 </Menu.Item>
                                ) : null}
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Titile',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.intime.title - b.intime.title,
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: {
        compare: (a, b) => a.description.length - b.description.length,
      },
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
          <div className="mr-md-3 mb-3">
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={onSearch} />
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
                onClick={exportToExcel} // Call export function when the button is clicked
                block
              >
                Export All
              </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">

         {(whorole === "super-admin" || whorole === "client" || (canViewClient && whorole !== "super-admin" && whorole !== "client")) ? (
                                                  <Table columns={tableColumns} dataSource={users} rowKey="id" scroll={{ x: 1200 }} />

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

export default AnnouncementList;