
import React, { useState } from 'react';
import CompantInfoList from './CompanyInfo/CompanyInfoList';
import CustomerInvoiceList from './Invoice/CustomerInvoiceList';
import ProposalList from './Proposal/ProposalList';


function ViewCustomer() {
   return (
      <>
        <div>
         <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg p-4'>
         <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
              <div className='mt-3'>
              <CompantInfoList/>
              </div>
              <div>
                <ProposalList/>
              </div>
              <div>
              <CustomerInvoiceList/>
              </div>
         </div>
        </div>
      </>
  )
      
}

export default ViewCustomer;


// import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card,Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import UserView from '../../../Users/user-list/UserView';
// // import ViewCustomer from '../customer/ViewCustomer'
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import StatisticWidget from 'components/shared-components/StatisticWidget';
// // import { DealStatisticData } from '../../dashboards/default/DefaultDashboardData';
// import AvatarStatus from 'components/shared-components/AvatarStatus';
// import AddCustomer from './AddCustomer';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import { IoCopyOutline } from "react-icons/io5";
// import utils from 'utils';
// import EditCustomer from './EditCustomer';


// function ViewCustomer() {
//    // const [dealStatisticViewData] = useState(DealStatisticViewData);




//    const [users, setUsers] = useState(userData);
//    const [list, setList] = useState(OrderListData);
//    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//    const [userProfileVisible, setUserProfileVisible] = useState(false);
//    //   const [customerVisible,setCustomerVisible] = useState(false)
//    const [selectedUser, setSelectedUser] = useState(null);
//    const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
//    const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] = useState(false);
//    const [isEditCustomerModalVisible, setIsEditCustomerModalVisible] = useState(false);


//    // Open Add Job Modal
//    const openAddCustomerModal = () => {
//       setIsAddCustomerModalVisible(true);
//    };

//    // Close Add Job Modal
//    const closeAddCustomerModal = () => {
//       setIsAddCustomerModalVisible(false);
//    };


//    const openviewCustomerModal = () => {
//       setIsViewCustomerModalVisible(true);
//    };

//    // Close Add Job Modal
//    const closeViewCustomerModal = () => {
//       setIsViewCustomerModalVisible(false);
//    };

   
//    const openEditCustomerModal = () => {
//       setIsEditCustomerModalVisible(true);
//    };

//    // Close Add Job Modal
//    const closeEditCustomerModal = () => {
//       setIsEditCustomerModalVisible(false);
//    };



//    // Search functionality
//    const onSearch = (e) => {
//       const value = e.currentTarget.value;
//       const searchArray = value ? list : OrderListData;
//       const data = utils.wildCardSearch(searchArray, value);
//       setList(data);
//       setSelectedRowKeys([]);
//    };

//    // Delete user
//    const deleteUser = (userId) => {
//       setUsers(users.filter((item) => item.id !== userId));
//       message.success({ content: `Deleted user ${userId}`, duration: 2 });
//    };

//    // Show user profile
//    const showUserProfile = (userInfo) => {
//       setSelectedUser(userInfo);
//       setUserProfileVisible(true);
//    };

//    //   const showCustomerView = (userInfo) => {
//    //     setSelectedUser(userInfo);
//    //     setCustomerVisible(true);
//    //   };

//    // Close user profile
//    const closeUserProfile = () => {
//       setSelectedUser(null);
//       setUserProfileVisible(false);
//    };


//    //   const closeCustomerView = () => {
//    //     setSelectedUser(null);
//    //     setCustomerVisible(false);
//    //   };

//    const getViewStatus = status => {
//       if(status === 'Draft') {
//          return 'blue'
//       }
//       if(status === 'Open') {
//          return 'cyan'
//       }
//       return ''
//    }

//    const dropdownMenu = (elm) => (
//       <Menu>
//          <Menu.Item>
//             <Flex alignItems="center">
//                <Button
//                   type=""
//                   className=""
//                   icon={<LinkOutlined />}
//                   onClick={() => showUserProfile(elm)}
//                   size="small"
//                >
//                   <span className="">Copy Invoice</span>
//                </Button>
//             </Flex>
//          </Menu.Item>
//          <Menu.Item>
//             <Flex alignItems="center">
//                <Button
//                   type=""
//                   className=""
//                   icon={<CopyOutlined />}
//                   onClick={() => showUserProfile(elm)}
//                   size="small"
//                >
//                   <span className="">Duplicate Invoice</span>
//                </Button>
//             </Flex>
//          </Menu.Item>
//          <Menu.Item>
//             <Flex alignItems="center">
//                <Button
//                   type=""
//                   className=""
//                   icon={<EyeOutlined />}
//                   onClick={() => openviewCustomerModal(elm)}
//                   size="small"
//                >
//                   <span className="">Show</span>
//                </Button>
//             </Flex>
//          </Menu.Item>
//          <Menu.Item>
//             <Flex alignItems="center">
//                <Button
//                   type=""
//                   className=""
//                   icon={<EditOutlined />}
//                   onClick={() => openEditCustomerModal(elm)}
//                   size="small"
//                >
//                   <span className="">Edit</span>
//                </Button>
//             </Flex>
//          </Menu.Item>
//          {/* <Menu.Item>
//        <Flex alignItems="center">
//          <Button
//            type=""
//            className=""
//            icon={<PushpinOutlined />}
//            onClick={() => showUserProfile(elm)}
//            size="small"
//          >
//            <span className="ml-2">Pin</span>
//          </Button>
//        </Flex>
//      </Menu.Item> */}
//          <Menu.Item>
//             <Flex alignItems="center">
//                <Button
//                   type=""
//                   className=""
//                   icon={<DeleteOutlined />}
//                   onClick={() => deleteUser(elm.id)}
//                   size="small"
//                >
//                   <span className="">Delete</span>
//                </Button>
//             </Flex>
//          </Menu.Item>
//       </Menu>
//    );


//    const tableColumns = [
//       {
//          title: 'Invoice',
//          dataIndex: 'invoice',
//          sorter: {
//             compare: (a, b) => a.branch.length - b.branch.length,
//          },
//       },
//       {
//          title: 'Issue Date',
//          dataIndex: 'issueDate',
//          sorter: {
//             compare: (a, b) => a.title.length - b.title.length,
//          },
//       },
//       {
//          title: 'Due Date',
//          dataIndex: 'dueDate',
//          sorter: {
//             compare: (a, b) => a.title.length - b.title.length,
//          },
//       },
//       {
//          title: '	Due Amount',
//          dataIndex: 'dueAmount',
//          sorter: {
//             compare: (a, b) => a.status.length - b.status.length,
//          },
//       },
//       {
// 			title: 'Status',
// 			dataIndex: 'status',
// 			render: (_, record) => (
// 				<><Tag color={getViewStatus(record.orderStatus)}>{record.orderStatus}</Tag></>
// 			),
// 			sorter: (a, b) => utils.antdTableSorter(a, b, 'status')
// 		},
//       {
//          title: 'Action',
//          dataIndex: 'actions',
//          render: (_, elm) => (
//             <div className="text-center">
//                <EllipsisDropdown menu={dropdownMenu(elm)} />
//             </div>
//          ),
//       },
//    ];


//    // 


//    return (
//       <>
//         <div>
//         <div className='bg-gray-50 ml-[-24px] mr-[-24px] p-6 mt-[-53px] rounded-t-lg rounded-b-lg mb-[-24px] pb-3'>
//           {/* <div className=" bg-gray-100"> */}

//          <Card className='border-0 mt-5'>
           
//                {/* {dealStatisticViewData.map((elm, i) => ( */}
//                   <div className="bg-white shadow rounded-lg p-4">
//                      <h1 className="font-medium text-lg mb-4">Company Info</h1>
//                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Customer Id</h6>
//                            <h5 className="font-semibold text-base">#CUST02024</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Date of Creation</h6>
//                            <h5 className="font-semibold text-base">21-07-2021</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Balance</h6>
//                            <h5 className="font-semibold text-base">USD 100.009,00</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Overdue</h6>
//                            <h5 className="font-semibold text-base">USD 1.544,00</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Total Sum of Invoices</h6>
//                            <h5 className="font-semibold text-base">USD 105.855,00</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Quantity of Invoice</h6>
//                            <h5 className="font-semibold text-base">3</h5>
//                         </div>
//                         <div>
//                            <h6 className="text-gray-600 text-sm">Average Sales</h6>
//                            <h5 className="font-semibold text-base">USD 35.285,00</h5>
//                         </div>
//                      </div>
//                   </div>
//                {/* ))} */}
//          </Card>




//          <Card bodyStyle={{ padding: '-3px'}}>
//             <Col span={24}>
//                <h4 className='font-medium'>Invoice</h4>
//             </Col>
//             <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//                <Flex className="mb-1" mobileFlex={false}>
//                   <div className="mr-md-3 mb-3">
//                      <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//                   </div>
//                </Flex>
//                <Flex gap="7px">
//                   <Button type="primary" className="ml-2" onClick={openAddCustomerModal}>
//                      <PlusOutlined />
//                      <span>New</span>
//                   </Button>
//                   <Button type="primary" icon={<FileExcelOutlined />} block>
//                      Export All
//                   </Button>
//                </Flex>
//             </Flex>
//             <div className="table-responsive mt-2">
//                <Table
//                   columns={tableColumns}
//                   dataSource={users}
//                   rowKey="id"
//                   scroll={{ x: 1200 }}
//                />
//             </div>
//             <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

//             {/* Add Job Modal */}
//             <Modal
//                title=""
//                visible={isAddCustomerModalVisible}
//                onCancel={closeAddCustomerModal}
//                footer={null}
//                width={800}
//             >
//                <AddCustomer onClose={closeAddCustomerModal} />
//             </Modal>

//             <Modal
//                title=""
//                visible={isViewCustomerModalVisible}
//                onCancel={closeViewCustomerModal}
//                footer={null}
//                width={1200}
//             >
//                <ViewCustomer onClose={closeViewCustomerModal} />
//             </Modal>
//          </Card>
//          </div>
// {/* </div>   */}
//          </div>
//       </>
//    )
// }

// export default ViewCustomer
