import React, { Component } from 'react';
import { Card, Table, Menu, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import UserView from '../../../Users/user-list/UserView';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

import AvatarStatus from 'components/shared-components/AvatarStatus';
import AddPermission from './AddPermisssion';
import userData from "assets/data/user-list.data.json";
import OrderListData from "assets/data/order-list.data.json";
import utils from 'utils';

export class PermissionList extends Component {
  state = {
    users: userData,
    userProfileVisible: false,
    selectedUser: null,
    list: OrderListData, // Initialize with OrderListData
    selectedRowKeys: [],
    isAddEmployeeModalVisible: false, // State to toggle Add Employee Modal
  };

  // Open Add Employee Modal
  openAddPermissionModal = () => {
    this.setState({ isAddPermissionModalVisible: true });
  };

  // Close Add Employee Modal
  closeAddPermissionModal = () => {
    this.setState({ isAddPermissionModalVisible: false });
  };

  onSearch = (e) => {
    const { list } = this.state;
    const value = e.currentTarget.value;
    const searchArray = value ? list : OrderListData;
    const data = utils.wildCardSearch(searchArray, value);
    this.setState({ list: data, selectedRowKeys: [] });
  };

  deleteUser = (userId) => {
    this.setState({
      users: this.state.users.filter(item => item.id !== userId),
    });
    message.success({ content: `Deleted user ${userId}`, duration: 2 });
  };

  showUserProfile = (userInfo) => {
    this.setState({
      userProfileVisible: true,
      selectedUser: userInfo,
    });
  };

  closeUserProfile = () => {
    this.setState({
      userProfileVisible: false,
      selectedUser: null,
    });
  };

  render() {
    const { users, userProfileVisible, selectedUser, isAddPermissionModalVisible } = this.state;


    const dropdownMenu = elm => (
        <Menu>
            
            <Menu.Item>
                <Flex alignItems="center">
                    {/* <EyeOutlined />
                    <span className="ml-2">View Details</span> */}
                 
                <Button type="" className="" icon={<EyeOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
                <span className="">View Details</span>
                </Button>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    {/* <EyeOutlined />
                    <span className="ml-2">View Details</span> */}
                 
                 <Button type="" className="" icon={<MailOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
                <span className="">Send Mail</span>
                </Button>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    {/* <EyeOutlined />
                    <span className="ml-2">View Details</span> */}
                 
                 <Button type="" className="" icon={<PushpinOutlined />} onClick={() => {this.showUserProfile(elm)}} size="small">
                <span className="ml-2">Pin</span>
                </Button>
                </Flex>
            </Menu.Item>
            <Menu.Item>
                <Flex alignItems="center">
                    {/* <DeleteOutlined />
                    <span className="ml-2">Delete</span> */}
                
    <Button type="" className="" icon={<DeleteOutlined />} onClick={() => {this.deleteUser(elm.id)}} size="small"> 
    <span className="">Delete</span>
    </Button>
    
    
                </Flex>
            </Menu.Item>	
        </Menu>
    );


    const tableColumns = [
   
      {
        title: 'Permission',
        dataIndex: 'permission',
        sorter: {
          compare: (a, b) => a.permission.length - b.permission.length,
        },
      },
    
      {
        title: 'Action',
        dataIndex: 'actions',
        render: (_, elm) => (
            <div className="text-center">
                <EllipsisDropdown menu={dropdownMenu(elm)}/>
            </div>
        )
    },
    
    ];

    return (
      <Card bodyStyle={{ padding: '-3px' }}>
        <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
          <Flex className="mb-1" mobileFlex={false}>
            <div className="mr-md-3 mb-3">
              <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => this.onSearch(e)} />
            </div>
          </Flex>
          <Flex gap="7px">
            <Button type="primary" className="ml-2" onClick={this.openAddPermissionModal}>
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
        <UserView data={selectedUser} visible={userProfileVisible} close={() => this.closeUserProfile()} />

        {/* Add Employee Modal */}
        <Modal
          title="Add Permission"
          visible={isAddPermissionModalVisible}
          onCancel={this.closeAddPermissionModal}
          footer={null}
          width={800}
          className='mt-[-70px]'
        >
          <AddPermission onClose={this.closeAddPermissionModal} />
        </Modal>
      </Card>
    );
  }
}

export default PermissionList;
