import React, { useState } from 'react';
import { Card,Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import ViewCustomer from '../customer/ViewCustomer'
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import userData from 'assets/data/user-list.data.json';
import OrderListData from 'assets/data/order-list.data.json';
import { IoCopyOutline } from "react-icons/io5";
import utils from 'utils';
import ViewInvoice from '../../invoice/ViewInvoice';
import AddInvoice from '../../invoice/AddInvoice';


function CustomerInvoiceList() {
   const [users, setUsers] = useState(userData);
   const [list, setList] = useState(OrderListData);
   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
   const [userProfileVisible, setUserProfileVisible] = useState(false);
   //   const [customerVisible,setCustomerVisible] = useState(false)
   const [selectedUser, setSelectedUser] = useState(null);
   const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
   const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] = useState(false);
   const [isEditCustomerModalVisible, setIsEditCustomerModalVisible] = useState(false);


   // Open Add Job Modal
   const openAddCustomerModal = () => {
      setIsAddCustomerModalVisible(true);
   };

   // Close Add Job Modal
   const closeAddCustomerModal = () => {
      setIsAddCustomerModalVisible(false);
   };


   const openviewCustomerModal = () => {
      setIsViewCustomerModalVisible(true);
   };

   // Close Add Job Modal
   const closeViewCustomerModal = () => {
      setIsViewCustomerModalVisible(false);
   };

   
   const openEditCustomerModal = () => {
      setIsEditCustomerModalVisible(true);
   };

   // Close Add Job Modal
   const closeEditCustomerModal = () => {
      setIsEditCustomerModalVisible(false);
   };



   // Search functionality
   const onSearch = (e) => {
      const value = e.currentTarget.value;
      const searchArray = value ? list : OrderListData;
      const data = utils.wildCardSearch(searchArray, value);
      setList(data);
      setSelectedRowKeys([]);
   };

   // Delete user
   const deleteUser = (userId) => {
      setUsers(users.filter((item) => item.id !== userId));
      message.success({ content: `Deleted user ${userId}`, duration: 2 });
   };

   // Show user profile
   const showUserProfile = (userInfo) => {
      setSelectedUser(userInfo);
      setUserProfileVisible(true);
   };

   //   const showCustomerView = (userInfo) => {
   //     setSelectedUser(userInfo);
   //     setCustomerVisible(true);
   //   };

   // Close user profile
   const closeUserProfile = () => {
      setSelectedUser(null);
      setUserProfileVisible(false);
   };


   //   const closeCustomerView = () => {
   //     setSelectedUser(null);
   //     setCustomerVisible(false);
   //   };

   const getViewStatus = status => {
      if(status === 'Draft') {
         return 'blue'
      }
      if(status === 'Open') {
         return 'cyan'
      }
      return ''
   }

   const dropdownMenu = (elm) => (
      <Menu>
         <Menu.Item>
            <Flex alignItems="center">
               <Button
                  type=""
                  className=""
                  icon={<LinkOutlined />}
                  onClick={() => showUserProfile(elm)}
                  size="small"
               >
                  <span className="">Copy Invoice</span>
               </Button>
            </Flex>
         </Menu.Item>
         <Menu.Item>
            <Flex alignItems="center">
               <Button
                  type=""
                  className=""
                  icon={<CopyOutlined />}
                  onClick={() => showUserProfile(elm)}
                  size="small"
               >
                  <span className="">Duplicate Invoice</span>
               </Button>
            </Flex>
         </Menu.Item>
         <Menu.Item>
            <Flex alignItems="center">
               <Button
                  type=""
                  className=""
                  icon={<EyeOutlined />}
                  onClick={() => openviewCustomerModal(elm)}
                  size="small"
               >
                  <span className="">Show</span>
               </Button>
            </Flex>
         </Menu.Item>
         <Menu.Item>
            <Flex alignItems="center">
               <Button
                  type=""
                  className=""
                  icon={<EditOutlined />}
                  onClick={() => openEditCustomerModal(elm)}
                  size="small"
               >
                  <span className="">Edit</span>
               </Button>
            </Flex>
         </Menu.Item>
         {/* <Menu.Item>
       <Flex alignItems="center">
         <Button
           type=""
           className=""
           icon={<PushpinOutlined />}
           onClick={() => showUserProfile(elm)}
           size="small"
         >
           <span className="ml-2">Pin</span>
         </Button>
       </Flex>
     </Menu.Item> */}
         <Menu.Item>
            <Flex alignItems="center">
               <Button
                  type=""
                  className=""
                  icon={<DeleteOutlined />}
                  onClick={() => deleteUser(elm.id)}
                  size="small"
               >
                  <span className="">Delete</span>
               </Button>
            </Flex>
         </Menu.Item>
      </Menu>
   );


   const tableColumns = [
      {
         title: 'Invoice',
         dataIndex: 'invoice',
         sorter: {
            compare: (a, b) => a.branch.length - b.branch.length,
         },
      },
      {
         title: 'Issue Date',
         dataIndex: 'issueDate',
         sorter: {
            compare: (a, b) => a.title.length - b.title.length,
         },
      },
      {
         title: 'Due Date',
         dataIndex: 'dueDate',
         sorter: {
            compare: (a, b) => a.title.length - b.title.length,
         },
      },
      {
         title: '	Due Amount',
         dataIndex: 'dueAmount',
         sorter: {
            compare: (a, b) => a.status.length - b.status.length,
         },
      },
      {
			title: 'Status',
			dataIndex: 'status',
			render: (_, record) => (
				<><Tag color={getViewStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
		},
      {
         title: 'Action',
         dataIndex: 'actions',
         render: (_, elm) => (
            <div className="text-center">
               <EllipsisDropdown menu={dropdownMenu(elm)} />
            </div>
         ),
      },
   ];


   return (
      <>

         <Card bodyStyle={{ padding: '-3px'}}>
            <Col span={24}>
               <h4 className='font-medium'>Invoice</h4>
            </Col>
            <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
               <Flex className="mb-1" mobileFlex={false}>
                  <div className="mr-md-3 mb-3">
                     <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
                  </div>
               </Flex>
               <Flex gap="7px">
                  <Button type="primary" className="ml-2" onClick={openAddCustomerModal}>
                     <PlusOutlined />
                     <span>New</span>
                  </Button>
                  <Button type="primary" icon={<FileExcelOutlined />} block>
                     Export All
                  </Button>
               </Flex>
            </Flex>
            <div className="table-responsive mt-2">
               <Table
                  columns={tableColumns}
                  dataSource={users}
                  rowKey="id"
                  scroll={{ x: 1200 }}
               />
            </div>

            {/* Add Job Modal */}
            <Modal
               title=""
               visible={isAddCustomerModalVisible}
               onCancel={closeAddCustomerModal}
               footer={null}
               width={800}
            >
               <AddInvoice onClose={closeAddCustomerModal} />
            </Modal>

            <Modal
               title=""
               visible={isViewCustomerModalVisible}
               onCancel={closeViewCustomerModal}
               footer={null}
               width={1200}
            >
               <ViewInvoice onClose={closeViewCustomerModal} />
            </Modal>
         </Card>

      </>
   )
}

export default CustomerInvoiceList
