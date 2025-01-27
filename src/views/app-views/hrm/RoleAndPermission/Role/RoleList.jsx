import React, { useState } from 'react';
import { Card, Table, Menu, Button, Input, message, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined,EditOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import { useDispatch, useSelector } from 'react-redux';
import utils from 'utils';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import AddRole from './AddRole';
// import { getAllRoles } from 'redux/actions/RoleAndPermissionActions';
import { useEffect } from 'react';
import { deleteRole, getRoles } from '../RoleAndPermissionReducers/RoleAndPermissionSlice';
import EditRole from './EditRole';
// import { getRoles } from '@testing-library/react';
// import { useDispatch, useSelector } from 'react-redux';

const RoleList = () => {
  const [users, setUsers] = useState(userData);
  const [userProfileVisible, setUserProfileVisible] = useState(false);
    const [isEditRoleModalVisible, setIsEditRoleModalVisible] = useState(false);
      const [id, setId] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [list, setList] = useState(OrderListData); // Initialize with OrderListData
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddRoleModalVisible, setIsAddRoleModalVisible] = useState(false);
    const dispatch = useDispatch();
  
    const tabledata = useSelector((state) => state.role.role.data);

    const openEditRoleModal = () => {
      setIsEditRoleModalVisible(true);
    };
  
    const closeEditRoleModal = () => {
      setIsEditRoleModalVisible(false);
    };
  

  // Open Add Role Modal
  const openAddRoleModal = () => {
    setIsAddRoleModalVisible(true);
  };

  // Close Add Role Modal
  const closeAddRoleModal = () => {
    setIsAddRoleModalVisible(false);
  };

useEffect(() => { 
  dispatch(getRoles());
}, [dispatch]);

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };


  useEffect(() => {
      if (tabledata) {
        setUsers(tabledata);
      }
    }, [tabledata]);

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(item => item.id !== userId);
    setUsers(updatedUsers);
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
    setSelectedUser(null);
  };

   const editfun = (id) =>{
    openEditRoleModal();
    setId(id)
  } 


  
     const deleteRoles = (userId) => {
        // setUsers(users.filter(item => item.id !== userId));
        // dispatch(DeleteDes(userId));
        // dispatch(getDes())
        // message.success({ content: `Deleted user ${userId}`, duration: 2 });
  
          dispatch(deleteRole( userId )) 
                    .then(() => {
                      dispatch(getRoles());
                      message.success('Appraisal Deleted successfully!');
                      setUsers(users.filter(item => item.id !== userId));
                      
                    })
                    .catch((error) => {
                      // message.error('Failed to delete Indicator.');
                      console.error('Edit API error:', error);
                    });
      };
  


  const dropdownMenu = (elm) => (
    <Menu>
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<EyeOutlined />} onClick={() => { showUserProfile(elm) }} size="small">
            <span className="">View Details</span>
          </Button>
        </Flex>
      </Menu.Item>
      {/* <Menu.Item>
        <Flex alignItems="center">
          <Button
            type=""
            icon={<EditOutlined />}
            onClick={()=>{editfun(elm.id)}}
            size="small"
          >
           Edit
          </Button>
        </Flex>
      </Menu.Item> */}
     
      <Menu.Item>
        <Flex alignItems="center">
          <Button type="" icon={<DeleteOutlined />}  onClick={() => { deleteRoles(elm.id) }} size="small">
            <span className="">Delete</span>
          </Button>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const tableColumns = [
    {
      title: 'Role',
      dataIndex: 'role_name',
      sorter: {
        compare: (a, b) => a.role_name.length - b.role_name.length,
      },
    },
    {
      title: 'Permission',
      dataIndex: 'permissions',
      sorter: {
        compare: (a, b) => a.permissions.length - b.permissions.length,
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
            <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
          </div>
        </Flex>
        <Flex gap="7px">
          <Button type="primary" className="ml-2" onClick={openAddRoleModal}>
            <PlusOutlined />
            <span>New</span>
          </Button>
          <Button type="primary" icon={<FileExcelOutlined />} block>
            Export All
          </Button>
        </Flex>
      </Flex>
      <div className="table-responsive mt-2">
        <Table columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
      <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

      {/* Add Role Modal */}
      <Modal
        title="Add Role"
        visible={isAddRoleModalVisible}
        onCancel={closeAddRoleModal}
        footer={null}
        width={800}
        className='mt-[-70px]'
      >
        <AddRole onClose={closeAddRoleModal} />
      </Modal>

      <Modal
        title="Edit Role"
        visible={isEditRoleModalVisible}
        onCancel={closeEditRoleModal}
        footer={null}
        width={1000}
        className='mt-[-70px]'
      >
        <EditRole onClose={closeEditRoleModal} id={id} />
      </Modal>
    </Card>
  );
};

export default RoleList;
