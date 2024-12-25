
import React, { useState } from 'react';
// import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
import CreditSummaryList from './CreditSummary/CreditSummaryList';
import ReceiptSummaryList from './Receipt Summary/ReceiptSummaryList';
import ProductSummaryList from "./ProductSummary/ProductSummaryList"

function ViewInvoice() {



    return (
        <>
        <div className=''>
            <div className='bg-gray-50 ml-[-24px] mr-[-24px] mt-[-52px] mb-[-40px] rounded-t-lg rounded-b-lg pt-3'>
            <h2 className="mb-4 border-b pb-[30px] font-medium"></h2>
                
            <div className='p-10 pt-3 pb-3'>
                <ProductSummaryList />
            </div>
            
            <div className='px-10 pb-3'>
                <ReceiptSummaryList />
            </div>

            <div className='px-10 pb-3'>
                <CreditSummaryList />
            </div>
            </div>
            </div>

        </>
    )
}

export default ViewInvoice;


// import React, { useState } from 'react';
// // import { DealStatisticViewData } from '../../../dashboards/default/DefaultDashboardData';
// import { Card, Form, Table, Menu, Row, Col, Tag, Input, message, Button, Modal } from 'antd';
// import { EyeOutlined, DeleteOutlined, SearchOutlined, MailOutlined, PlusOutlined, PushpinOutlined, FileExcelOutlined, CopyOutlined, EditOutlined, LinkOutlined } from '@ant-design/icons';
// import UserView from '../../../Users/user-list/UserView';
// import Flex from 'components/shared-components/Flex';
// import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
// import userData from 'assets/data/user-list.data.json';
// import OrderListData from 'assets/data/order-list.data.json';
// import AddInvoice from './AddInvoice';
// import ViewEditInvoice from './ViewEditInvoice';


// function ViewInvoice() {
//     // const [dealStatisticViewData] = useState(DealStatisticViewData);

//     const [users, setUsers] = useState(userData);
//     const [list, setList] = useState(OrderListData);
//     const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//     const [userProfileVisible, setUserProfileVisible] = useState(false);
//     //   const [customerVisible,setCustomerVisible] = useState(false)
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [isAddCustomerModalVisible, setIsAddCustomerModalVisible] = useState(false);
//     const [isViewCustomerModalVisible, setIsViewCustomerModalVisible] = useState(false);
//     const [isEditInvoiceModalVisible, setIsEditInvoiceModalVisible] = useState(false);


//     // Open Add Job Modal
//     const openAddCustomerModal = () => {
//         setIsAddCustomerModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeAddCustomerModal = () => {
//         setIsAddCustomerModalVisible(false);
//     };


//     const openviewCustomerModal = () => {
//         setIsViewCustomerModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeViewCustomerModal = () => {
//         setIsViewCustomerModalVisible(false);
//     };


//     // Open Add Job Modal
//     const openEditInvoiceModal = () => {
//         setIsEditInvoiceModalVisible(true);
//     };

//     // Close Add Job Modal
//     const closeEditInvoiceModal = () => {
//         setIsEditInvoiceModalVisible(false);
//     };


//     // Delete user
//     const deleteUser = (userId) => {
//         setUsers(users.filter((item) => item.id !== userId));
//         message.success({ content: `Deleted user ${userId}`, duration: 2 });
//     };

    

//     // Close user profile
//     const closeUserProfile = () => {
//         setSelectedUser(null);
//         setUserProfileVisible(false);
//     };

//     const dropdownMenu = (elm) => (
//         <Menu>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<DeleteOutlined />}
//                         onClick={() => deleteUser(elm.id)}
//                         size="small"
//                     >
//                         {/* <span className="">Delete</span> */}
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//         </Menu>
//     );

//     const dropdownMenus = (elm) => (
//         <Menu>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<EditOutlined />}
//                         onClick={openEditInvoiceModal}
//                         size="small"
//                     >
//                         <span className="">Edit</span>
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//             <Menu.Item>
//                 <Flex alignItems="center">
//                     <Button
//                         type=""
//                         className=""
//                         icon={<DeleteOutlined />}
//                         onClick={() => deleteUser(elm.id)}
//                         size="small"
//                     >
//                         <span className="">Delete</span>
//                     </Button>
//                 </Flex>
//             </Menu.Item>
//         </Menu>
//     );

//     const tableColumns = [
//         {
//             title: 'Payment Receipt',
//             dataIndex: 'paymentreceipt',
//             sorter: {
//                 compare: (a, b) => a.branch.length - b.branch.length,
//             },
//         },
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Reference',
//             dataIndex: 'Reference',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Receipt',
//             dataIndex: 'receipt',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'OrderId',
//             dataIndex: 'orderId',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Action',
//             dataIndex: 'actions',
//             render: (_, elm) => (
//                 <div className="text-center">
//                     <EllipsisDropdown menu={dropdownMenu(elm)} />
//                 </div>
//             ),
//         },
//     ];


//     const invoiceTable = [
//         {
//             title: 'Date',
//             dataIndex: 'date',
//             sorter: {
//                 compare: (a, b) => a.title.length - b.title.length,
//             },
//         },
//         {
//             title: 'Amount',
//             dataIndex: 'amount',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Description',
//             dataIndex: 'description',
//             sorter: {
//                 compare: (a, b) => a.status.length - b.status.length,
//             },
//         },
//         {
//             title: 'Action',
//             dataIndex: 'actions',
//             render: (_, elm) => (
//                 <div className="text-center">
//                     <EllipsisDropdown menu={dropdownMenus(elm)} />
//                 </div>
//             ),
//         },
//     ];


//     return (
//         <>
//             <Card className='border-0'>

//                 <div className="p-6 bg-gray-50">
//                     {/* Heading */}
//                     <h1 className="text-sm font-medium mb-1">Product Summary</h1>
//                     <p className="text-xs text-gray-500 mb-2">
//                         All items here cannot be deleted.
//                     </p>

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                         <table className="w-full border border-gray-300 bg-white text-center text-xs">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="px-4 py-2">#</th>
//                                     <th className="px-4 py-2">Product</th>
//                                     <th className="px-4 py-2">Quantity</th>
//                                     <th className="px-4 py-2">Rate</th>
//                                     <th className="px-4 py-2">Discount</th>
//                                     <th className="px-4 py-2">Tax</th>
//                                     <th className="px-4 py-2">Description</th>
//                                     <th className="px-4 py-2">
//                                         <span>Price</span>
//                                         <br />
//                                         <span className="text-red-500">(after tax & discount)</span>

//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* Row 1 */}
//                                 <tr>
//                                     <td className="px-4 py-2">1</td>
//                                     <td className="px-4 py-2">Refrigerator</td>
//                                     <td className="px-4 py-2">1 (Piece)</td>
//                                     <td className="px-4 py-2">USD 90.000,00</td>
//                                     <td className="px-4 py-2">USD 0.00</td>
//                                     <td className="px-4 py-2 text-center">
//                                         <tr><p className='flex'>CGST (10%):USD  9.000,00</p></tr>
//                                         <tr><p>SGST (5%):USD  4.500,00</p></tr>
//                                     </td>
//                                     <td className="border px-4 py-2">
//                                         Giving information on its origins.
//                                     </td>
//                                     <td className="px-4 py-2">USD 103.500,00</td>
//                                 </tr>
//                                 {/* Total Row */}
//                                 <tr className="bg-gray-100 font-semibold">
//                                     <td className="px-4 py-2 text-center" colSpan="3">
//                                         Total
//                                     </td>
//                                     <td className="px-4 py-2">USD 90.000,00</td>
//                                     <td className="px-4 py-2">USD 0,00</td>
//                                     <td className="px-4 py-2">USD  13.500,00</td>
//                                     <td className="px-4 py-2"></td>
//                                     <td className="px-4 py-2"></td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Summary Details */}
//                     <div className="mt-3 flex flex-col items-end space-y-2 text-xs">
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Sub Total</span>
//                             <span className="text-gray-700">USD 90.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Discount</span>
//                             <span className="text-gray-700">USD 0,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">CGST</span>
//                             <span className="text-gray-700">USD 9.000,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">SGST</span>
//                             <span className="text-gray-700">USD 4.500,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Total</span>
//                             <span className="text-gray-700">USD 103.500,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Paid</span>
//                             <span className="text-gray-700">USD 3.260,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3 border-b pb-2">
//                             <span className="text-gray-700">Credit Note</span>
//                             <span className="text-gray-700">USD 100.240,00</span>
//                         </div>
//                         <div className="flex justify-between w-full sm:w-1/3">
//                             <span className="text-gray-700">Due</span>
//                             <span className="text-gray-700">USD  0,00</span>
//                         </div>
//                     </div>
//                 </div>
//             </Card>

//             <Card bodyStyle={{ padding: '-3px' }}>
//                 <Col span={24}>
//                     <h4 className='font-medium'>Receipt Summary</h4>
//                 </Col>
//                 {/* <Flex alignItems="center" justifyContent="space-between" mobileFlex={false}>
//                     <Flex className="mb-1" mobileFlex={false}>
//                         <div className="mr-md-3 mb-3">
//                             <Input placeholder="Search" prefix={<SearchOutlined />} onChange={(e) => onSearch(e)} />
//                         </div>
//                     </Flex>
//                     <Flex gap="7px">
//                         <Button type="primary" className="ml-2" onClick={openAddCustomerModal}>
//                             <PlusOutlined />
//                             <span>New</span>
//                         </Button>
//                         <Button type="primary" icon={<FileExcelOutlined />} block>
//                             Export All
//                         </Button>
//                     </Flex>
//                 </Flex> */}
//                 <div className="table-responsive mt-2">
//                     <Table
//                         columns={tableColumns}
//                         dataSource={users}
//                         rowKey="id"
//                         scroll={{ x: 1200 }}
//                     />
//                 </div>
//                 <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} />

//                 {/* Add Job Modal */}
//                 <Modal
//                     title=""
//                     visible={isAddCustomerModalVisible}
//                     onCancel={closeAddCustomerModal}
//                     footer={null}
//                     width={800}
//                 >
//                     <AddInvoice onClose={closeAddCustomerModal} />
//                 </Modal>

//                 <Modal
//                     title=""
//                     visible={isViewCustomerModalVisible}
//                     onCancel={closeViewCustomerModal}
//                     footer={null}
//                     width={1200}
//                 >
//                     <ViewInvoice onClose={closeViewCustomerModal} />
//                 </Modal>

//                 {/* <Modal
//                title=""
//                visible={isEditCustomerModalVisible}
//                onCancel={closeEditCustomerModal}
//                footer={null}
//                width={800}
//             >
//                <EditCustomer onClose={closeEditCustomerModal} />
//             </Modal> */}
//             </Card>

//             <Card bodyStyle={{ padding: '-3px' }}>
//                 <Col span={24}>
//                     <h4 className='font-medium'>Credit Note Summary</h4>
//                 </Col>
//                 <div className="table-responsive mt-2 text-center">
//                     <Table
//                         columns={invoiceTable}
//                         dataSource={users}
//                         rowKey="id"
//                     // scroll={{ x: 800 }}
//                     />
//                 </div>
//                 {/* <UserView data={selectedUser} visible={userProfileVisible} close={closeUserProfile} /> */}


//                 <Modal
//                     title=""
//                     visible={isEditInvoiceModalVisible}
//                     onCancel={closeEditInvoiceModal}
//                     footer={null}
//                     width={500}
//                     className='mt-[-70px]'
//                 >
//                     <ViewEditInvoice onClose={closeEditInvoiceModal} />
//                 </Modal>
//             </Card>
//         </>
//     )
// }

// export default ViewInvoice;
